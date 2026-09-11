/**
 * 全球多语言与本地化核心(设计方案 v1.0 §3–§5、§11)
 *
 * 关键解耦字段(§3):界面语言 / 翻译目标 / 内容语言 / 内容地区 / 时区 / 展示货币
 * 各自独立保存于 LocalizationPreferences,互相不得推导覆盖。
 * 存储值使用 BCP 47 语言标签与 IANA 时区,不存显示字符串。
 */
import { reactive, watch } from 'vue'
import zhHantHK from './locales/zh-Hant-HK'
import en from './locales/en'
import zhHansCN from './locales/zh-Hans-CN'
import jaJP from './locales/ja-JP'
import koKR from './locales/ko-KR'

/* ── 偏好模型(§11.1)────────────────────────────────────────────── */

export type PrefSource = 'user' | 'migration' | 'default' | 'channel'

export interface LocalizationPreferences {
  uiLocale: string
  translationLocale: string
  contentLocales: string[]
  contentRegion: { country: string; cityId?: string }
  timeZone: string
  displayCurrency: string
  autoTranslate: boolean
  localContentPriority: 'high' | 'medium' | 'low'
  sources: Partial<Record<string, PrefSource>>
  updatedAt: string
}

/** 全球默认值(§4.1):新会话 / 未保存偏好一律为繁体中文(香港)+ 香港配置 */
export const DEFAULT_PREFS: LocalizationPreferences = {
  uiLocale: 'zh-Hant-HK',
  translationLocale: 'zh-Hant-HK',
  contentLocales: ['zh-Hant', 'en'],
  contentRegion: { country: 'HK', cityId: 'hong-kong' },
  timeZone: 'Asia/Hong_Kong',
  displayCurrency: 'HKD',
  autoTranslate: true,
  localContentPriority: 'high',
  sources: {
    uiLocale: 'default', translationLocale: 'default', contentLocales: 'default',
    contentRegion: 'default', timeZone: 'default', displayCurrency: 'default',
  },
  updatedAt: '',
}

const STORAGE_KEY = 'taso-locale'

/** 旧值迁移(§4.4):zh-CN 等历史值规范化,标记 migration 允许后续建议确认 */
const MIGRATE_LANG: Record<string, string> = {
  'zh-CN': 'zh-Hans-CN', 'zh': 'zh-Hans-CN', 'zh-Hans': 'zh-Hans-CN',
  'zh-TW': 'zh-Hant-TW', 'zh-Hant': 'zh-Hant-HK',
  'ja': 'ja-JP', 'ko': 'ko-KR',
}

function migrateLocale(v: string): { locale: string; source: PrefSource } {
  if (MIGRATE_LANG[v]) return { locale: MIGRATE_LANG[v], source: 'migration' }
  return { locale: v, source: 'user' }
}

function loadPrefs(): LocalizationPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const s = JSON.parse(raw) as Partial<LocalizationPreferences>
      if (typeof s.uiLocale === 'string' && Array.isArray(s.contentLocales)) {
        const p: LocalizationPreferences = {
          ...DEFAULT_PREFS,
          ...s,
          contentRegion: s.contentRegion ?? DEFAULT_PREFS.contentRegion,
          sources: s.sources ?? {},
        }
        for (const k of ['uiLocale', 'translationLocale'] as const) {
          const m = migrateLocale(p[k])
          p[k] = m.locale
          if (p.sources[k] !== 'user') p.sources[k] = m.source
        }
        return p
      }
    }
  } catch { /* 損壞時回落全球默認值 */ }
  return JSON.parse(JSON.stringify(DEFAULT_PREFS))
}

export const prefs = reactive<LocalizationPreferences>(loadPrefs())

/** 偏好來源標記:顯式保存一律記為 user,永不自動重置(§4.4) */
function persist() {
  prefs.updatedAt = new Date().toISOString()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
  document.documentElement.lang = prefs.uiLocale
}
watch(prefs, persist, { deep: true })
document.documentElement.lang = prefs.uiLocale

/** 匿名偏好與帳號偏好合併(§4.3):帳號已有顯式偏好時以帳號為準 */
export function applyAccountPrefs(saved: Partial<LocalizationPreferences> | undefined): boolean {
  if (!saved?.uiLocale || !Array.isArray(saved.contentLocales)) return false
  const changed = saved.uiLocale !== prefs.uiLocale
    || saved.timeZone !== prefs.timeZone
    || saved.contentRegion?.country !== prefs.contentRegion.country
  Object.assign(prefs, JSON.parse(JSON.stringify(saved)))
  return changed
}

export function snapshotPrefs(): LocalizationPreferences {
  return JSON.parse(JSON.stringify(prefs))
}

export function resetPrefs() {
  Object.assign(prefs, JSON.parse(JSON.stringify(DEFAULT_PREFS)))
}

/* ── 文案資源與回退(§5.2、§7.1)────────────────────────────────── */

type Catalog = Record<string, string>

/** catalog 註冊名 → 文案表。回退鏈:精確 locale → 語言/文字(zh-Hant)→ 基準 en */
const CATALOGS: Record<string, Catalog> = {
  'zh-Hant-HK': zhHantHK as Catalog,
  'zh-Hans-CN': zhHansCN as Catalog,
  'ja-JP': jaJP as Catalog,
  'ko-KR': koKR as Catalog,
  en: en as Catalog,
}

/** zh-Hant-HK → zh-Hant;zh-Hans-CN → zh-Hans;ja-JP → ja */
const baseLangOf = (locale: string) => locale.split('-').slice(0, 2).join('-').replace(/-(CN|HK|TW|KR|JP)$/, '')

function catalogFor(locale: string): Catalog | undefined {
  return CATALOGS[locale] ?? CATALOGS[baseLangOf(locale)]
}

/** ICU-lite:解析 "{name, plural, =0 {…} one {…} other {…}}" 片段 */
function pickPlural(pattern: string, locale: string): string {
  const rules = new Intl.PluralRules(locale)
  return pattern.replace(/\{(\w+),\s*plural,\s*([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g, (_all, name: string, body: string) => {
    const branches: Record<string, string> = {}
    const re = /(=\d+|zero|one|two|few|many|other)\s*\{([^{}]*)\}/g
    let m: RegExpExecArray | null
    while ((m = re.exec(body))) branches[m[1]] = m[2]
    const n = Number(paramsCache[name])
    const key = String(n) in branches ? String(n) : rules.select(n)
    const tpl = branches[key] ?? branches.other ?? ''
    return tpl.replace(/#/g, formatNumber(n, locale))
  })
}

let paramsCache: Record<string, string | number> = {}

function formatNumber(n: number, locale: string): string {
  return new Intl.NumberFormat(locale).format(n)
}

/**
 * 取文案:key 以用途命名(§7.1),變數 {name} 插值、複數走 plural。
 * 命中失敗按 §5.2 記錄可觀測錯誤,並回落審核過的安全文案(en 基準)。
 */
export function t(key: string, params?: Record<string, string | number>): string {
  paramsCache = params ?? {}
  for (const locale of [prefs.uiLocale, baseLangOf(prefs.uiLocale), 'en']) {
    const cat = catalogFor(locale)
    const v = cat?.[key]
    if (v != null) return interpolate(pickPlural(v, locale), paramsCache)
  }
  console.warn(`[i18n] missing key: ${key} (${prefs.uiLocale})`)
  return (en as Catalog)[key] ?? key
}

function interpolate(tpl: string, params: Record<string, string | number>): string {
  return tpl.replace(/\{(\w+)\}/g, (all, name: string) =>
    name in params ? String(params[name]) : all)
}

/* ── 語言 / 地區 / 時區 / 貨幣元數據(顯示名,非存儲值)──────────── */

export interface NamedOption {
  /** 存儲值(BCP 47 / IANA / ISO 4217) */
  code: string
  /** 自身語言的名稱(語言一律以自身名稱顯示) */
  name: string
}

/** P0:zh-Hant-HK、en;P1:zh-Hans-CN、ja-JP、ko-KR(§5.1) */
export const UI_LANGS: NamedOption[] = [
  { code: 'zh-Hant-HK', name: '繁體中文(香港)' },
  { code: 'en', name: 'English' },
  { code: 'zh-Hans-CN', name: '简体中文' },
  { code: 'ja-JP', name: '日本語' },
  { code: 'ko-KR', name: '한국어' },
]

/** 內容語言按語言/文字選擇,不含地區(§3) */
export const CONTENT_LANGS: NamedOption[] = [
  { code: 'zh-Hant', name: '繁體中文' },
  { code: 'zh-Hans', name: '简体中文' },
  { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
]

export interface RegionOption {
  id: string
  country: string
  /** 各 UI 語言下的顯示名(§9.3:由 locale catalog 格式化,不混用) */
  names: Record<string, string>
  /** 檢索別名(§8.3) */
  aliases: string[]
}

export const REGIONS: RegionOption[] = [
  { id: 'hong-kong', country: 'HK', names: { 'zh-Hant': '香港', 'zh-Hans': '香港', en: 'Hong Kong', ja: '香港', ko: '홍콩' }, aliases: ['HK', 'HongKong', '香港島'] },
  { id: 'tokyo', country: 'JP', names: { 'zh-Hant': '東京', 'zh-Hans': '东京', en: 'Tokyo', ja: '東京', ko: '도쿄' }, aliases: ['Dongjing', 'トウキョウ'] },
  { id: 'osaka', country: 'JP', names: { 'zh-Hant': '大阪', 'zh-Hans': '大阪', en: 'Osaka', ja: '大阪', ko: '오사카' }, aliases: [] },
  { id: 'seoul', country: 'KR', names: { 'zh-Hant': '首爾', 'zh-Hans': '首尔', en: 'Seoul', ja: 'ソウル', ko: '서울' }, aliases: ['漢城', '首尔'] },
  { id: 'bangkok', country: 'TH', names: { 'zh-Hant': '曼谷', 'zh-Hans': '曼谷', en: 'Bangkok', ja: 'バンコク', ko: '방콕' }, aliases: [] },
  { id: 'singapore', country: 'SG', names: { 'zh-Hant': '新加坡', 'zh-Hans': '新加坡', en: 'Singapore', ja: 'シンガポール', ko: '싱가포르' }, aliases: ['狮城', '獅城'] },
  { id: 'shanghai', country: 'CN', names: { 'zh-Hant': '上海', 'zh-Hans': '上海', en: 'Shanghai', ja: '上海', ko: '상하이' }, aliases: [] },
  { id: 'taipei', country: 'TW', names: { 'zh-Hant': '台北', 'zh-Hans': '台北', en: 'Taipei', ja: 'タイペイ', ko: '타이베이' }, aliases: [] },
  { id: 'london', country: 'GB', names: { 'zh-Hant': '倫敦', 'zh-Hans': '伦敦', en: 'London', ja: 'ロンドン', ko: '런던' }, aliases: [] },
  { id: 'new-york', country: 'US', names: { 'zh-Hant': '紐約', 'zh-Hans': '纽约', en: 'New York', ja: 'ニューヨーク', ko: '뉴욕' }, aliases: ['NYC'] },
]

/** 內容地區顯示名:精確 → 語言 → en(與文案回退一致的呈現層規則) */
export function regionName(r: { cityId?: string; country: string }): string {
  if (r.cityId) {
    const hit = REGIONS.find(x => x.id === r.cityId)
    if (hit) return localName(hit.names)
  }
  return countryName(r.country)
}

/** 從 {locale: string} 內容映射中按當前 UI 語言挑選(用於商家/成員等實體名) */
export function localName(map: Record<string, string>, fallback = ''): string {
  for (const locale of [prefs.uiLocale, baseLangOf(prefs.uiLocale), 'en']) {
    const key = locale === 'zh-Hant-HK' || locale === 'zh-Hant' ? 'zh-Hant'
      : locale === 'zh-Hans-CN' || locale === 'zh-Hans' ? 'zh-Hans'
      : locale.split('-')[0]
    if (map[key]) return map[key]
  }
  return map.en ?? map['zh-Hant'] ?? fallback
}

/* ── 顯示名稱(Intl.DisplayNames,§9.3 / §8.1)──────────────────── */

const dnCache = new Map<string, Intl.DisplayNames>()

function displayNames(type: 'region' | 'language' | 'currency'): Intl.DisplayNames {
  const locale = prefs.uiLocale
  const k = `${locale}:${type}`
  let dn = dnCache.get(k)
  if (!dn) {
    dn = new Intl.DisplayNames([locale, 'en'], { type, fallback: 'code' })
    dnCache.set(k, dn)
  }
  return dn
}

export const countryName = (code: string) => (code ? displayNames('region').of(code) ?? code : '')

export const languageName = (tag: string) => displayNames('language').of(tag) ?? tag

export const currencyName = (code: string) => displayNames('currency').of(code) ?? code

/** 時區顯示:如「香港標準時間」+ IANA ID(§6 時區項) */
export function timeZoneLabel(tz: string): string {
  const long = new Intl.DateTimeFormat(prefs.uiLocale, { timeZone: tz, timeZoneName: 'long' })
    .formatToParts(new Date()).find(p => p.type === 'timeZoneName')?.value ?? tz
  return `${long} · ${tz}`
}

/** 語言/時區等偏好項的顯示名(設置頁六項右側值,§6) */
export const uiLocaleLabel = (code: string) =>
  UI_LANGS.find(l => l.code === code)?.name ?? languageName(code)

export const contentLocaleLabel = (code: string) =>
  CONTENT_LANGS.find(l => l.code === code)?.name ?? languageName(code)

export function contentLocalesLabel(): string {
  const names = prefs.contentLocales.map(contentLocaleLabel)
  return names.join(t('common.listSeparator'))
}

export const TIMEZONES = [
  'Asia/Hong_Kong', 'Asia/Tokyo', 'Asia/Seoul', 'Asia/Shanghai', 'Asia/Taipei',
  'Asia/Bangkok', 'Asia/Singapore', 'Europe/London', 'America/New_York', 'UTC',
]

export const CURRENCIES = ['HKD', 'USD', 'JPY', 'TWD', 'KRW', 'SGD', 'THB', 'EUR']

/* ── 展示貨幣換算披露(§9.1:估算 + 匯率來源與時間)──────────────── */

/** 演示匯率(每單位 USD),正式版須接入受認可匯率來源 */
export const FX_RATES: Record<string, number> = {
  USD: 1, HKD: 7.8, JPY: 150, TWD: 31.5, KRW: 1340, SGD: 1.34, THB: 34.5, EUR: 0.92,
}
export const FX_UPDATED_AT = '2026-09-11T10:00:00+08:00'
