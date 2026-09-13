/**
 * 全球多语言与本地化核心(设计方案 v1.0 §3–§5、§11)
 *
 * 面向用户的设置仅保留:界面语言 / 内容地区 / 自动翻译。
 * 翻译目标始终跟随界面语言,内容语言默认覆盖全部语言的内容候选;
 * 时区与展示货币保留为格式化基础配置,暂不在原型设置页暴露。
 * 存储值使用 BCP 47 语言标签与 IANA 时区,不存显示字符串。
 */
import { reactive, watch } from 'vue'
import zhHantHK from './locales/zh-Hant-HK'
import en from './locales/en'
import zhHansCN from './locales/zh-Hans-CN'
import jaJP from './locales/ja-JP'
import koKR from './locales/ko-KR'
import frFR from './locales/fr-FR'
import viVN from './locales/vi-VN'
import thTH from './locales/th-TH'
import arSA from './locales/ar-SA'
import ruRU from './locales/ru-RU'

/* ── 偏好模型(§11.1)────────────────────────────────────────────── */

export type PrefSource = 'user' | 'migration' | 'default' | 'channel'

export type ContentRegionScope = 'global' | 'country' | 'city'

export interface ContentRegion {
  scope: ContentRegionScope
  /** ISO 3166-1 alpha-2;全球范围时为空字符串 */
  country: string
  /** 城市范围时为 REGIONS 中的城市 id */
  cityId?: string
}

export interface LocalizationPreferences {
  uiLocale: string
  contentRegion: ContentRegion
  /** 最近使用過的內容地區(快捷入口痕跡,非顯式偏好,不參與 sources) */
  recentRegions: ContentRegion[]
  timeZone: string
  displayCurrency: string
  autoTranslate: boolean
  sources: Partial<Record<string, PrefSource>>
  updatedAt: string
}

/**
 * 全球回退默认值(评审 §1:香港不得作为全球默认)。
 * 仅在设备信号完全不可用时使用;首启实际取 suggestPrefs() 的建议值。
 */
export const DEFAULT_PREFS: LocalizationPreferences = {
  uiLocale: 'en',
  contentRegion: { scope: 'global', country: '' },
  recentRegions: [],
  timeZone: 'UTC',
  displayCurrency: 'USD',
  autoTranslate: true,
  sources: {
    uiLocale: 'default', contentRegion: 'default', timeZone: 'default', displayCurrency: 'default', autoTranslate: 'default',
  },
  updatedAt: '',
}

/* ── 冷启动建议(评审 §1:设备语言 → 设备时区/粗粒度地区 → English)────
   注意:本段在模块初始化早期被 loadPrefs() 调用,须自包含,
   不得引用文件后部才声明的 UI_LANGS / REGIONS(TDZ)。 */

/** 建议可映射的 UI 语言主标签(与 UI_LANGS 保持同步) */
const SUGGEST_LANGS: Record<string, string> = {
  en: 'en', ja: 'ja-JP', ko: 'ko-KR',
  fr: 'fr-FR', vi: 'vi-VN', th: 'th-TH', ar: 'ar-SA', ru: 'ru-RU',
}

/** 浏览器语言 → 已收录 UI 语言;zh 按文字系统分流,未收录语言回退 English */
export function suggestUiLocale(): string {
  const candidates = [...(navigator.languages ?? []), navigator.language].filter(Boolean)
  for (const raw of candidates) {
    const l = raw.toLowerCase()
    if (l.startsWith('zh')) {
      // zh-Hant* / zh-TW / zh-HK / zh-MO → 繁體(香港);zh-Hans* / zh-CN / zh-SG → 简体
      return /hant|tw|hk|mo/.test(l) ? 'zh-Hant-HK' : 'zh-Hans-CN'
    }
    const hit = SUGGEST_LANGS[l.split('-')[0]]
    if (hit) return hit
  }
  return DEFAULT_PREFS.uiLocale
}

/** 设备时区(不申请定位权限;粗粒度地区信号) */
export function suggestTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || DEFAULT_PREFS.timeZone
  } catch {
    return DEFAULT_PREFS.timeZone
  }
}

/** 时区 → 内容地区建议(城市 + ISO 国家);未覆盖时区回退全球(不虚构位置) */
const TZ_CITY: Record<string, { cityId: string; country: string }> = {
  'Asia/Hong_Kong': { cityId: 'hong-kong', country: 'HK' },
  'Asia/Tokyo': { cityId: 'tokyo', country: 'JP' },
  'Asia/Seoul': { cityId: 'seoul', country: 'KR' },
  'Asia/Bangkok': { cityId: 'bangkok', country: 'TH' },
  'Asia/Singapore': { cityId: 'singapore', country: 'SG' },
  'Asia/Shanghai': { cityId: 'shanghai', country: 'CN' },
  'Asia/Taipei': { cityId: 'taipei', country: 'TW' },
  'Europe/London': { cityId: 'london', country: 'GB' },
  'America/New_York': { cityId: 'new-york', country: 'US' },
  'Europe/Paris': { cityId: 'paris', country: 'FR' },
  'Asia/Ho_Chi_Minh': { cityId: 'ho-chi-minh', country: 'VN' },
  'Europe/Moscow': { cityId: 'moscow', country: 'RU' },
  'Asia/Riyadh': { cityId: 'riyadh', country: 'SA' },
}

function suggestRegion(tz: string): ContentRegion {
  const hit = TZ_CITY[tz]
  return hit ? { scope: 'city', country: hit.country, cityId: hit.cityId } : { scope: 'global', country: '' }
}

/** 國家 → 當地貨幣(僅 FX_RATES 支持幣種,歐元區共用 EUR;suggestPrefs 兜底 HKD、countryCurrencyOf 兜底 USD) */
const COUNTRY_CURRENCY: Record<string, string> = {
  HK: 'HKD', TW: 'TWD', JP: 'JPY', KR: 'KRW', TH: 'THB', SG: 'SGD',
  VN: 'VND', RU: 'RUB', SA: 'SAR', AE: 'AED', US: 'USD', CN: 'CNY',
  FR: 'EUR', DE: 'EUR', IT: 'EUR', ES: 'EUR', NL: 'EUR', BE: 'EUR',
  PT: 'EUR', IE: 'EUR', FI: 'EUR', GR: 'EUR', AT: 'EUR',
}

/** 首启建议偏好:全部标记 default,可跳过 / 可修改;显式保存后永不自动重置 */
export function suggestPrefs(): LocalizationPreferences {
  const uiLocale = suggestUiLocale()
  const timeZone = suggestTimeZone()
  const contentRegion = suggestRegion(timeZone)
  return {
    ...JSON.parse(JSON.stringify(DEFAULT_PREFS)),
    uiLocale,
    timeZone,
    contentRegion,
    displayCurrency: COUNTRY_CURRENCY[contentRegion.country] ?? DEFAULT_PREFS.displayCurrency,
  }
}

const STORAGE_KEY = 'taso-locale'

/** 旧值迁移(§4.4):zh-CN 等历史值规范化,标记 migration 允许后续建议确认 */
const MIGRATE_LANG: Record<string, string> = {
  'zh-CN': 'zh-Hans-CN', 'zh': 'zh-Hans-CN', 'zh-Hans': 'zh-Hans-CN',
  'zh-TW': 'zh-Hant-TW', 'zh-Hant': 'zh-Hant-HK',
  'ja': 'ja-JP', 'ko': 'ko-KR',
  'fr': 'fr-FR', 'vi': 'vi-VN', 'th': 'th-TH', 'ar': 'ar-SA', 'ru': 'ru-RU',
}

function migrateLocale(v: string): { locale: string; source: PrefSource } {
  if (MIGRATE_LANG[v]) return { locale: MIGRATE_LANG[v], source: 'migration' }
  return { locale: v, source: 'user' }
}

export interface RegionOption {
  id: string
  country: string
  /** 各 UI 語言下的顯示名(§9.3:由 locale catalog 格式化,不混用) */
  names: Record<string, string>
  /** 檢索別名(§8.3) */
  aliases: string[]
}

export const REGIONS: RegionOption[] = [
  { id: 'hong-kong', country: 'HK', names: { 'zh-Hant': '香港', 'zh-Hans': '香港', en: 'Hong Kong', ja: '香港', ko: '홍콩', fr: 'Hong Kong', vi: 'Hồng Kông', th: 'ฮ่องกง', ar: 'هونغ كونغ', ru: 'Гонконг' }, aliases: ['HK', 'HongKong', '香港島'] },
  { id: 'tokyo', country: 'JP', names: { 'zh-Hant': '東京', 'zh-Hans': '东京', en: 'Tokyo', ja: '東京', ko: '도쿄', fr: 'Tokyo', vi: 'Tokyo', th: 'โตเกียว', ar: 'طوكيو', ru: 'Токио' }, aliases: ['Dongjing', 'トウキョウ'] },
  { id: 'osaka', country: 'JP', names: { 'zh-Hant': '大阪', 'zh-Hans': '大阪', en: 'Osaka', ja: '大阪', ko: '오사카', fr: 'Osaka', vi: 'Osaka', th: 'โอซากา', ar: 'أوساكا', ru: 'Осака' }, aliases: [] },
  { id: 'seoul', country: 'KR', names: { 'zh-Hant': '首爾', 'zh-Hans': '首尔', en: 'Seoul', ja: 'ソウル', ko: '서울', fr: 'Séoul', vi: 'Seoul', th: 'โซล', ar: 'سيول', ru: 'Сеул' }, aliases: ['漢城', '首尔'] },
  { id: 'bangkok', country: 'TH', names: { 'zh-Hant': '曼谷', 'zh-Hans': '曼谷', en: 'Bangkok', ja: 'バンコク', ko: '방콕', fr: 'Bangkok', vi: 'Bangkok', th: 'กรุงเทพฯ', ar: 'بانكوك', ru: 'Бангкок' }, aliases: ['Krung Thep'] },
  { id: 'chiang-mai', country: 'TH', names: { 'zh-Hant': '清邁', 'zh-Hans': '清迈', en: 'Chiang Mai', ja: 'チェンマイ', ko: '치앙마이', fr: 'Chiang Mai', vi: 'Chiang Mai', th: 'เชียงใหม่', ar: 'تشياغ ماي', ru: 'Чиангмай' }, aliases: [] },
  { id: 'phuket', country: 'TH', names: { 'zh-Hant': '布吉', 'zh-Hans': '普吉', en: 'Phuket', ja: 'プーケット', ko: '푸껫', fr: 'Phuket', vi: 'Phuket', th: 'ภูเก็ต', ar: 'بوكيت', ru: 'Пхукет' }, aliases: [] },
  { id: 'singapore', country: 'SG', names: { 'zh-Hant': '新加坡', 'zh-Hans': '新加坡', en: 'Singapore', ja: 'シンガポール', ko: '싱가포르', fr: 'Singapour', vi: 'Singapore', th: 'สิงคโปร์', ar: 'سنغافورة', ru: 'Сингапур' }, aliases: ['狮城', '獅城'] },
  { id: 'shanghai', country: 'CN', names: { 'zh-Hant': '上海', 'zh-Hans': '上海', en: 'Shanghai', ja: '上海', ko: '상하이', fr: 'Shanghai', vi: 'Thượng Hải', th: 'เซี่ยงไฮ้', ar: 'شنغهاي', ru: 'Шанхай' }, aliases: [] },
  { id: 'taipei', country: 'TW', names: { 'zh-Hant': '台北', 'zh-Hans': '台北', en: 'Taipei', ja: 'タイペイ', ko: '타이베이', fr: 'Taipei', vi: 'Đài Bắc', th: 'ไทเป', ar: 'تايبيه', ru: 'Тайбэй' }, aliases: [] },
  { id: 'london', country: 'GB', names: { 'zh-Hant': '倫敦', 'zh-Hans': '伦敦', en: 'London', ja: 'ロンドン', ko: '런던', fr: 'Londres', vi: 'London', th: 'ลอนดอน', ar: 'لندن', ru: 'Лондон' }, aliases: [] },
  { id: 'new-york', country: 'US', names: { 'zh-Hant': '紐約', 'zh-Hans': '纽约', en: 'New York', ja: 'ニューヨーク', ko: '뉴욕', fr: 'New York', vi: 'New York', th: 'นิวยอร์ก', ar: 'نيويورك', ru: 'Нью-Йорк' }, aliases: ['NYC'] },
  { id: 'paris', country: 'FR', names: { 'zh-Hant': '巴黎', 'zh-Hans': '巴黎', en: 'Paris', ja: 'パリ', ko: '파리', fr: 'Paris', vi: 'Paris', th: 'ปารีส', ar: 'باريس', ru: 'Париж' }, aliases: ['City of Light'] },
  { id: 'hanoi', country: 'VN', names: { 'zh-Hant': '河內', 'zh-Hans': '河内', en: 'Hanoi', ja: 'ハノイ', ko: '하노이', fr: 'Hanoï', vi: 'Hà Nội', th: 'ฮานอย', ar: 'هانوي', ru: 'Ханой' }, aliases: ['Ha Noi'] },
  { id: 'ho-chi-minh', country: 'VN', names: { 'zh-Hant': '胡志明市', 'zh-Hans': '胡志明市', en: 'Ho Chi Minh City', ja: 'ホーチミン', ko: '호치민', fr: 'Hô-Chi-Minh-Ville', vi: 'Thành phố Hồ Chí Minh', th: 'โฮจิมินห์ซิตี', ar: 'هوشي منه', ru: 'Хошимин' }, aliases: ['Saigon', '西貢', '西贡'] },
  { id: 'moscow', country: 'RU', names: { 'zh-Hant': '莫斯科', 'zh-Hans': '莫斯科', en: 'Moscow', ja: 'モスクワ', ko: '모스크바', fr: 'Moscou', vi: 'Moscow', th: 'มอสโก', ar: 'موسكو', ru: 'Москва' }, aliases: ['Moskva'] },
  { id: 'riyadh', country: 'SA', names: { 'zh-Hant': '利雅德', 'zh-Hans': '利雅得', en: 'Riyadh', ja: 'リヤド', ko: '리야드', fr: 'Riyad', vi: 'Riyadh', th: 'ริยาด', ar: 'الرياض', ru: 'Эр-Рияд' }, aliases: ['Ar Riyadh', 'Al Riyadh'] },
]

/** 阿拉伯文等从右到左書寫的 UI 語言(html dir 基礎鏡像,§7.3)。
    必須聲明在 persist 之前:persist 在模塊初始化時即調用 isRtlLocale。 */
export const RTL_LANGS = new Set(['ar', 'ar-SA'])

export function isRtlLocale(locale: string): boolean {
  return RTL_LANGS.has(locale) || RTL_LANGS.has(locale.split('-')[0])
}

function loadPrefs(): LocalizationPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const s = JSON.parse(raw) as Partial<LocalizationPreferences>
      if (typeof s.uiLocale === 'string') {
        // 舊版的翻譯目標、內容語言與本地優先級不再提供設定。
        // 刻意丟棄它們，讓譯文改為跟隨 App 語言、內容候選改為全語言。
        const legacy = s as Partial<LocalizationPreferences> & Record<string, unknown>
        const { translationLocale: _translationLocale, contentLocales: _contentLocales, localContentPriority: _localContentPriority, ...kept } = legacy
        const p: LocalizationPreferences = {
          ...DEFAULT_PREFS,
          ...kept,
          contentRegion: normalizeContentRegion(s.contentRegion),
          recentRegions: normalizeRecentRegions(kept.recentRegions),
          sources: kept.sources ?? {},
        }
        const m = migrateLocale(p.uiLocale)
        p.uiLocale = m.locale
        if (p.sources.uiLocale !== 'user') p.sources.uiLocale = m.source
        return p
      }
    }
  } catch { /* 損壞時回落設備建議 */ }
  return suggestPrefs()
}

export const prefs = reactive<LocalizationPreferences>(loadPrefs())

/** 偏好來源標記:顯式保存一律記為 user,永不自動重置(§4.4) */
function persist() {
  prefs.updatedAt = new Date().toISOString()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
  document.documentElement.lang = prefs.uiLocale
  document.documentElement.dir = isRtlLocale(prefs.uiLocale) ? 'rtl' : 'ltr'
}
watch(prefs, persist, { deep: true })
document.documentElement.lang = prefs.uiLocale
document.documentElement.dir = isRtlLocale(prefs.uiLocale) ? 'rtl' : 'ltr'

/** 匿名偏好與帳號偏好合併(§4.3):帳號已有顯式偏好時以帳號為準 */
export function applyAccountPrefs(saved: Partial<LocalizationPreferences> | undefined): boolean {
  if (!saved?.uiLocale) return false
  const changed = saved.uiLocale !== prefs.uiLocale
    || saved.timeZone !== prefs.timeZone
    || saved.contentRegion?.country !== prefs.contentRegion.country
  const { translationLocale: _translationLocale, contentLocales: _contentLocales, localContentPriority: _localContentPriority, ...kept } = saved as Partial<LocalizationPreferences> & Record<string, unknown>
  Object.assign(prefs, JSON.parse(JSON.stringify(kept)))
  prefs.contentRegion = normalizeContentRegion(saved.contentRegion)
  return changed
}

export function snapshotPrefs(): LocalizationPreferences {
  return JSON.parse(JSON.stringify(prefs))
}

/** 删除账号等回到首启:重新按设备信号建议(评审 §1),不回到写死的默认地区 */
export function resetPrefs() {
  Object.assign(prefs, suggestPrefs())
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
  'fr-FR': frFR as Catalog, fr: frFR as Catalog,
  'vi-VN': viVN as Catalog, vi: viVN as Catalog,
  'th-TH': thTH as Catalog, th: thTH as Catalog,
  'ar-SA': arSA as Catalog, ar: arSA as Catalog,
  'ru-RU': ruRU as Catalog, ru: ruRU as Catalog,
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

/** P0:zh-Hant-HK、en;P1:zh-Hans-CN、ja-JP、ko-KR;運營版:fr-FR、vi-VN、th-TH、ar-SA、ru-RU(§5.1) */
export const UI_LANGS: NamedOption[] = [
  { code: 'zh-Hant-HK', name: '繁體中文(香港)' },
  { code: 'en', name: 'English' },
  { code: 'zh-Hans-CN', name: '简体中文' },
  { code: 'ja-JP', name: '日本語' },
  { code: 'ko-KR', name: '한국어' },
  { code: 'fr-FR', name: 'Français' },
  { code: 'vi-VN', name: 'Tiếng Việt' },
  { code: 'th-TH', name: 'ไทย' },
  { code: 'ar-SA', name: 'العربية' },
  { code: 'ru-RU', name: 'Русский' },
]

/** 顯示語言 → 語言所屬地區的本地貨幣(V2.12 語言與地區「本地貨幣」選項來源;與 UI_LANGS 同步) */
export const LANG_CURRENCY: Record<string, string> = {
  'zh-Hant-HK': 'HKD', 'zh-Hans-CN': 'CNY', en: 'USD', 'ja-JP': 'JPY', 'ko-KR': 'KRW',
  'fr-FR': 'EUR', 'vi-VN': 'VND', 'th-TH': 'THB', 'ar-SA': 'SAR', 'ru-RU': 'RUB',
}

/** 「本地貨幣」下拉選項:語言對應地區貨幣按 UI_LANGS 順序去重 */
export const LOCAL_CURRENCIES: string[] = [...new Set(UI_LANGS.map(l => LANG_CURRENCY[l.code] ?? 'USD'))]

/* 地區元數據(REGIONS)已提升至 loadPrefs 之前:loadPrefs 在模塊初始化時經
   normalizeContentRegion 讀取 REGIONS,若聲明在後會因 TDZ 拋錯並被靜默
   吞掉,導致已存偏好每次冷啟動都被丟棄、回落默認值。 */

/** ISO 3166-1 alpha-2 完整國家 / 地區清單；內容地區不再只限原型城市。 */
export const COUNTRY_CODES = `
AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ
BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ
CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ
DE DJ DK DM DO DZ
EC EE EG EH ER ES ET
FI FJ FK FM FO FR
GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY
HK HM HN HR HT HU
ID IE IL IM IN IO IQ IR IS IT
JE JM JO JP
KE KG KH KI KM KN KP KR KW KY KZ
LA LB LC LI LK LR LS LT LU LV LY
MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ
NA NC NE NF NG NI NL NO NP NR NU NZ
OM
PA PE PF PG PH PK PL PM PN PR PS PT PW PY
QA
RE RO RS RU RW
SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ
TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ
UA UG UM US UY UZ
VA VC VE VG VI VN VU
WF WS XK
YE YT
ZA ZM ZW
`.trim().split(/\s+/)

/** 國旗僅作為國家名稱的輔助視覺，永不單獨表達地區。 */
export function countryFlag(code: string): string {
  return code.length === 2
    ? String.fromCodePoint(...[...code.toUpperCase()].map(c => 0x1F1E6 + c.charCodeAt(0) - 65))
    : '🌐'
}

export const citiesForCountry = (code: string) => REGIONS.filter(r => r.country === code)

/**
 * 首頁「為你推薦」的地區排序規則：
 * 全球不加地理篩選；選城市時優先精確城市；選國家時優先該國所有已標記城市。
 * 沒有地點標記的內容不會被誤判為本地內容，但仍可作為興趣 / 追蹤的全局補位。
 */
export function isInContentRegion(cityId?: string): boolean {
  const region = prefs.contentRegion
  if (region.scope === 'global') return true
  if (!cityId) return false
  const city = REGIONS.find(item => item.id === cityId)
  if (!city) return false
  return region.scope === 'city' ? city.id === region.cityId : city.country === region.country
}

function normalizeContentRegion(region: Partial<ContentRegion> | undefined): ContentRegion {
  if (!region || region.scope === 'global' || !region.country) return { scope: 'global', country: '' }
  if (region.cityId && REGIONS.some(r => r.id === region.cityId && r.country === region.country)) {
    return { scope: 'city', country: region.country, cityId: region.cityId }
  }
  return { scope: 'country', country: region.country }
}

const regionKey = (r: ContentRegion) => `${r.scope}:${r.country}:${r.cityId ?? ''}`

/** 最近使用僅收國家 / 城市;全球是常駐入口,不佔最近名額,上限 4 條。 */
function normalizeRecentRegions(list: unknown): ContentRegion[] {
  if (!Array.isArray(list)) return []
  const seen = new Set<string>()
  const out: ContentRegion[] = []
  for (const item of list) {
    const region = normalizeContentRegion(item)
    if (region.scope === 'global') continue
    const key = regionKey(region)
    if (seen.has(key)) continue
    seen.add(key)
    out.push(region)
  }
  return out.slice(0, 4)
}

/** 選中國家 / 城市後記為最近使用(置頂去重),全球不記錄。 */
export function rememberRegion(region: ContentRegion): void {
  if (region.scope === 'global') return
  const list = prefs.recentRegions.filter(r => regionKey(r) !== regionKey(region))
  list.unshift({ ...region })
  prefs.recentRegions = list.slice(0, 4)
}

/** 內容地區顯示名：城市 → 國家 / 地區 → 全球。 */
export function regionName(r: { scope?: ContentRegionScope; cityId?: string; country: string }): string {
  if (r.cityId) {
    const hit = REGIONS.find(x => x.id === r.cityId)
    if (hit) return localName(hit.names)
  }
  if (r.scope === 'global' || !r.country) return t('contentRegion.global')
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

function displayNames(type: 'region' | 'language' | 'currency', locale = prefs.uiLocale): Intl.DisplayNames {
  const k = `${locale}:${type}`
  let dn = dnCache.get(k)
  if (!dn) {
    dn = new Intl.DisplayNames([locale, 'en'], { type, fallback: 'code' })
    dnCache.set(k, dn)
  }
  return dn
}

export const countryName = (code: string) => (code ? displayNames('region').of(code) ?? code : '')

/** 國家選擇器同時匹配目前 UI 語言、英文、繁中 / 簡中與 ISO 代碼。 */
export function countrySearchNames(code: string): string[] {
  const locales = [prefs.uiLocale, 'en', 'zh-Hant', 'zh-Hans']
  return [...new Set(locales.map(locale => displayNames('region', locale).of(code) ?? '').filter(Boolean))]
}

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

export const TIMEZONES = [
  'Asia/Hong_Kong', 'Asia/Tokyo', 'Asia/Seoul', 'Asia/Shanghai', 'Asia/Taipei',
  'Asia/Bangkok', 'Asia/Singapore', 'Europe/London', 'America/New_York',
  'Europe/Paris', 'Asia/Ho_Chi_Minh', 'Europe/Moscow', 'Asia/Riyadh', 'UTC',
]

export const CURRENCIES = ['HKD', 'USD', 'JPY', 'TWD', 'KRW', 'SGD', 'THB', 'EUR', 'VND', 'RUB', 'SAR', 'AED']

/* ── 展示貨幣換算披露(§9.1:估算 + 匯率來源與時間)──────────────── */

/** 演示匯率(每單位 USD),正式版須接入受認可匯率來源 */
export const FX_RATES: Record<string, number> = {
  USD: 1, HKD: 7.8, JPY: 150, TWD: 31.5, KRW: 1340, SGD: 1.34, THB: 34.5, EUR: 0.92,
  VND: 26350, RUB: 92, SAR: 3.75, AED: 3.67, CNY: 7.25,
}
export const FX_UPDATED_AT = '2026-09-11T10:00:00+08:00'

/** 貨幣 → 國家 / 地區代碼(國旗僅作貨幣的輔助視覺,與幣碼同現;EUR 用歐盟旗) */
const CURRENCY_COUNTRY: Record<string, string> = {
  HKD: 'HK', USD: 'US', CNY: 'CN', JPY: 'JP', KRW: 'KR', TWD: 'TW', SGD: 'SG',
  THB: 'TH', EUR: 'EU', VND: 'VN', SAR: 'SA', AED: 'AE', RUB: 'RU',
}
export const currencyFlag = (code: string) => countryFlag(CURRENCY_COUNTRY[code] ?? '')

/**
 * 用戶國家 / 地區 → 當地展示貨幣(V2.11 快捷充值本地化展示):
 * 僅映射到 FX_RATES 支持的幣種(歐元區共用 EUR),未覆蓋市場回退 USD。
 * 賬號國家未確認(空)時由調用方回落 displayCurrency 偏好。
 * (與 suggestPrefs 共用頂部 COUNTRY_CURRENCY 表)
 */
export const countryCurrencyOf = (code: string) => COUNTRY_CURRENCY[code] ?? 'USD'
