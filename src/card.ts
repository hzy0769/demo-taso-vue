import { reactive, watch } from 'vue'
import { t, countryName } from './i18n'
import { fmtLocalDateShort, isoLocalDate } from './i18n/format'

/* ── 實體會員卡全球申請與配送(V1.8 · 全球配送 PRD + 本地化方案 §9.3)─────
   國家配置決定欄位 key、順序、必填與校驗;標籤、說明、錯誤文案從 locale
   資源讀取;國家顯示名由 Intl.DisplayNames 按當前 UI 語言格式化。
   新草稿默認收件國家為 HK(§4.1);已保存地址不被覆蓋。 */

export interface AddrFieldConf {
  /** 語義化欄位 key(§9.3),標籤經 labelKey 從文案資源解析 */
  key: string
  labelKey: string
  required?: boolean
  type?: 'text' | 'select'
  options?: string[]
  /** 與相鄰下一欄位同行顯示(First / Last name 成對) */
  pair?: boolean
}

export interface Country {
  /** ISO 3166-1 alpha-2(§8.2) */
  code: string
  flag: string
  /** 電話區號,選國家後自動帶入(§9) */
  dial: string
  /** 電話號碼位數範圍(不含區號) */
  digits: [number, number]
  postalRe?: RegExp
  postalExample?: string
  /** 是否支援特快配送(§15.3 偏遠地區僅 Standard) */
  express: boolean
  /** 是否支援實體卡配送(§15.1) */
  shippable: boolean
  /** 推薦國家(選擇器置頂,§8.1) */
  rec?: boolean
  fields: AddrFieldConf[]
}

export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming',
]

const f = (key: string, labelKey: string, required = false, extra: Partial<AddrFieldConf> = {}): AddrFieldConf =>
  ({ key, labelKey, required, ...extra })

/** 國際姓名對(西方國家順序:姓名在前,§7.1/§7.2) */
const intlName = (): AddrFieldConf[] => [
  f('firstName', 'addr.firstName', true, { pair: true }),
  f('lastName', 'addr.lastName', true, { pair: true }),
]

/** 未單獨建模國家的國際通用模板(§30:擴展市場無需重複開發頁面) */
const defaultFields = (): AddrFieldConf[] => [
  ...intlName(),
  f('addressLine1', 'addr.addressLine1', true),
  f('addressLine2', 'addr.addressLine2Unit'),
  f('city', 'addr.city', true),
  f('state', 'addr.stateProvince'),
  f('postalCode', 'addr.postalCodeOpt'),
]

export const COUNTRIES: Country[] = [
  { code: 'HK', flag: '🇭🇰', dial: '+852', digits: [8, 8],
    express: true, shippable: true, rec: true,
    fields: [
      f('fullName', 'addr.fullName', true),
      f('city', 'addr.districtHK', true),
      f('addressLine1', 'addr.streetHK', true),
      f('addressLine2', 'addr.addressLine2Unit'),
    ] },
  { code: 'JP', flag: '🇯🇵', dial: '+81', digits: [9, 10],
    postalRe: /^\d{3}-?\d{4}$/, postalExample: '150-0001', express: true, shippable: true, rec: true,
    fields: [
      f('postalCode', 'addr.postalCode', true),
      f('state', 'addr.statePrefecture', true),
      f('city', 'addr.cityWard', true),
      f('addressLine1', 'addr.addressLine1', true),
      f('addressLine2', 'addr.addressLine2Bldg'),
      ...intlName(),
    ] },
  { code: 'US', flag: '🇺🇸', dial: '+1', digits: [10, 10],
    postalRe: /^\d{5}(-\d{4})?$/, postalExample: '12345', express: true, shippable: true, rec: true,
    fields: [
      ...intlName(),
      f('addressLine1', 'addr.addressLine1', true),
      f('addressLine2', 'addr.addressLine2Apt'),
      f('city', 'addr.city', true),
      f('state', 'addr.stateState', true, { type: 'select', options: US_STATES }),
      f('postalCode', 'addr.postalCode', true),
    ] },
  { code: 'CN', flag: '🇨🇳', dial: '+86', digits: [11, 11],
    postalRe: /^\d{6}$/, postalExample: '100000', express: true, shippable: true, rec: true,
    fields: [
      f('fullName', 'addr.fullName', true),
      f('state', 'addr.province', true),
      f('city', 'addr.city', true),
      f('district', 'addr.district', true),
      f('addressLine1', 'addr.detailCN', true),
      f('postalCode', 'addr.postalCode', true),
    ] },
  { code: 'TW', flag: '🇹🇼', dial: '+886', digits: [9, 9],
    postalRe: /^\d{3}(\d{2})?$/, postalExample: '100', express: true, shippable: true,
    fields: [
      f('fullName', 'addr.fullName', true),
      f('city', 'addr.cityTW', true),
      f('district', 'addr.districtTW', true),
      f('addressLine1', 'addr.addressLine1', true),
      f('postalCode', 'addr.postalCode', true),
    ] },
  { code: 'GB', flag: '🇬🇧', dial: '+44', digits: [9, 10],
    postalRe: /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i, postalExample: 'SW1A 1AA', express: true, shippable: true, rec: true,
    fields: [
      ...intlName(),
      f('addressLine1', 'addr.addressLine1', true),
      f('addressLine2', 'addr.addressLine2Opt'),
      f('city', 'addr.townCity', true),
      f('state', 'addr.stateCounty'),
      f('postalCode', 'addr.postalCode', true),
    ] },
  { code: 'SG', flag: '🇸🇬', dial: '+65', digits: [8, 8],
    postalRe: /^\d{6}$/, postalExample: '018956', express: true, shippable: true,
    fields: [
      ...intlName(),
      f('addressLine1', 'addr.addressLine1', true),
      f('addressLine2', 'addr.addressLine2Unit'),
      f('postalCode', 'addr.postalCode', true),
    ] },
  { code: 'KR', flag: '🇰🇷', dial: '+82', digits: [9, 10],
    postalRe: /^\d{5}$/, postalExample: '04524', express: true, shippable: true, fields: defaultFields() },
  { code: 'AU', flag: '🇦🇺', dial: '+61', digits: [9, 9],
    postalRe: /^\d{4}$/, postalExample: '2000', express: true, shippable: true, fields: defaultFields() },
  { code: 'CA', flag: '🇨🇦', dial: '+1', digits: [10, 10],
    postalRe: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i, postalExample: 'K1A 0B1', express: true, shippable: true, fields: defaultFields() },
  { code: 'FR', flag: '🇫🇷', dial: '+33', digits: [9, 9],
    postalRe: /^\d{5}$/, postalExample: '75001', express: true, shippable: true, fields: defaultFields() },
  { code: 'DE', flag: '🇩🇪', dial: '+49', digits: [9, 11],
    postalRe: /^\d{5}$/, postalExample: '10115', express: true, shippable: true, fields: defaultFields() },
  { code: 'IT', flag: '🇮🇹', dial: '+39', digits: [9, 10],
    postalRe: /^\d{5}$/, postalExample: '00100', express: true, shippable: true, fields: defaultFields() },
  { code: 'ES', flag: '🇪🇸', dial: '+34', digits: [9, 9],
    postalRe: /^\d{5}$/, postalExample: '28001', express: true, shippable: true, fields: defaultFields() },
  { code: 'IN', flag: '🇮🇳', dial: '+91', digits: [10, 10],
    postalRe: /^\d{6}$/, postalExample: '110001', express: true, shippable: true, fields: defaultFields() },
  { code: 'TH', flag: '🇹🇭', dial: '+66', digits: [9, 9],
    postalRe: /^\d{5}$/, postalExample: '10210', express: true, shippable: true, fields: defaultFields() },
  { code: 'AE', flag: '🇦🇪', dial: '+971', digits: [9, 9],
    express: true, shippable: true, fields: defaultFields() },
  { code: 'MX', flag: '🇲🇽', dial: '+52', digits: [10, 10],
    postalRe: /^\d{5}$/, postalExample: '06600', express: false, shippable: true, fields: defaultFields() },
  { code: 'BR', flag: '🇧🇷', dial: '+55', digits: [10, 11],
    postalRe: /^\d{5}-?\d{3}$/, postalExample: '01310-100', express: false, shippable: true, fields: defaultFields() },
  { code: 'ZA', flag: '🇿🇦', dial: '+27', digits: [9, 9],
    postalRe: /^\d{4}$/, postalExample: '8001', express: false, shippable: true, fields: defaultFields() },
  // 演示「國家不支援配送」場景(§15.1)
  { code: 'IS', flag: '🇮🇸', dial: '+354', digits: [7, 9],
    express: false, shippable: false, fields: defaultFields() },
  { code: 'MV', flag: '🇲🇻', dial: '+960', digits: [7, 7],
    express: false, shippable: false, fields: defaultFields() },
]

export const countryOf = (code: string) => COUNTRIES.find(c => c.code === code)

/** 當前 UI 語言下的國家顯示名(Intl.DisplayNames,§9.3) */
export const countryLabel = (code: string) => countryName(code)

/** 英文官方名(選擇器次行,輔助旅行場景識別) */
const enNameCache = new Intl.DisplayNames(['en'], { type: 'region', fallback: 'code' })
export const countryLabelEn = (code: string) => enNameCache.of(code) ?? code

/* ── 配送方式與費用(§10 / §23 / §24)────────────────────────────────── */

export interface ShippingMethod {
  code: 'standard' | 'express'
  nameKey: string
  days: [number, number]
  /** 配送費 US$(實體卡辦理費為發卡機構港幣定價,是全平台唯一非美元金額) */
  fee: number
}

export const METHODS: ShippingMethod[] = [
  { code: 'standard', nameKey: 'card.ship.standard', days: [5, 10], fee: 0 },
  { code: 'express', nameKey: 'card.ship.express', days: [2, 4], fee: 12.99 },
]

export const methodOf = (code: string) => METHODS.find(m => m.code === code) ?? METHODS[0]
export const methodName = (m: ShippingMethod) => t(m.nameKey)

/** 實體卡辦理費:發卡機構港幣定價 HK$1,000/張(PRD §4.1.A,全平台唯一非美元金額) */
export const CARD_FEE_HKD = 1000

/* ── 申請流程狀態(草稿保留 §27 / 保存默認地址 §16 / 訂單)────────────── */

export interface CardAddress {
  countryCode: string
  /** 動態表單欄位值(鍵同 AddrFieldConf.key,統一地址模型 §6.2/§21) */
  values: Record<string, string>
  dial: string
  phone: string
}

export interface CardOrder {
  id: string
  createdAt: string
  address: CardAddress
  method: 'standard' | 'express'
  shippingFee: number
  etaFrom: string
  etaTo: string
  carrier: string
  trackingNo: string
}

interface CardState {
  draft: CardAddress
  saveDefault: boolean
  default: CardAddress | null
  method: 'standard' | 'express'
  order: CardOrder | null
}

/** 新草稿默認國家為 HK(本地化方案 §4.1) */
const seedDraft = (): CardAddress => ({ countryCode: 'HK', values: {}, dial: '+852', phone: '' })

const seed = (): CardState => ({ draft: seedDraft(), saveDefault: true, default: null, method: 'standard', order: null })

function loadCard(): CardState {
  try {
    const raw = localStorage.getItem('taso-card')
    if (raw) {
      const s = JSON.parse(raw) as CardState
      if (s && typeof s.draft === 'object' && typeof s.draft.values === 'object') {
        const st = { ...seed(), ...s }
        if (!countryOf(st.draft.countryCode)) st.draft = seedDraft()
        // 已保存默認地址可再次使用:草稿為空時帶入(§16 / P01 §4.2)
        const empty = !Object.keys(st.draft.values).length && !st.draft.phone
        if (empty && st.default) st.draft = JSON.parse(JSON.stringify(st.default))
        const c = countryOf(st.draft.countryCode)
        if (st.method === 'express' && !c?.express) st.method = 'standard'
        return st
      }
    }
  } catch { /* 損壞時回退初始態 */ }
  return seed()
}

export const card = reactive<CardState>(loadCard())

function persistCard() {
  localStorage.setItem('taso-card', JSON.stringify(card))
}

/** 任意狀態變更即持久化(草稿保留 §27:用戶退出頁面後可恢復) */
watch(card, persistCard, { deep: true })

/** 刪除帳號時全量重置(store.deleteAccount 調用) */
export function resetCard() {
  Object.assign(card, seed())
  card.draft = seedDraft()
}

/** 切換國家:保留同名欄位值、重置區號;返回此前是否已填地址(供調用方提示 §8.2) */
export function switchCountry(code: string): boolean {
  const c = countryOf(code)
  if (!c || code === card.draft.countryCode) return false
  const had = Object.keys(card.draft.values).length > 0
  const keep: Record<string, string> = {}
  for (const fld of c.fields) if (card.draft.values[fld.key]) keep[fld.key] = card.draft.values[fld.key]
  card.draft.values = keep
  card.draft.countryCode = code
  card.draft.dial = c.dial
  if (card.method === 'express' && !c.express) card.method = 'standard'
  return had
}

/** 結構化欄位錯誤(§13):key → {文案 key, 參數};由畫面按 UI 語言渲染 */
export interface FieldError {
  key: string
  params?: Record<string, string | number>
}

export function validateAddress(): Record<string, FieldError> {
  const errs: Record<string, FieldError> = {}
  const c = countryOf(card.draft.countryCode)
  if (!c) { errs.country = { key: 'addr.err.noCountry' }; return errs }
  if (!c.shippable) { errs.country = { key: 'addr.noShipAlert' }; return errs }
  for (const fld of c.fields) {
    const v = (card.draft.values[fld.key] ?? '').trim()
    const name = t(fld.labelKey)
    if (fld.required && !v) {
      errs[fld.key] = { key: 'addr.err.required', params: { field: name } }
    } else if (v && fld.key === 'postalCode' && c.postalRe && !c.postalRe.test(v)) {
      errs[fld.key] = c.postalExample
        ? { key: 'addr.err.postalInvalid', params: { field: name, example: c.postalExample } }
        : { key: 'addr.err.postalInvalidNoExample', params: { field: name } }
    }
  }
  const digits = card.draft.phone.replace(/\D/g, '')
  if (!digits) errs.phone = { key: 'addr.err.phoneRequired' }
  else if (digits.length < c.digits[0] || digits.length > c.digits[1]) {
    errs.phone = { key: 'addr.err.phoneDigits', params: { min: c.digits[0], max: c.digits[1] } }
  }
  return errs
}

/* ── 展示輔助 ─────────────────────────────────────────────────────────── */

/** 地址展示行(§28.2 最多 4 行):姓名 / 街道 / 區-市-州 / 郵編-國家;國家名按 UI 語言 */
export function addrLines(a: CardAddress): string[] {
  const v = a.values
  const name = (v.fullName ?? '').trim() || [v.firstName, v.lastName].filter(Boolean).join(' ').trim()
  const street = [v.addressLine1, v.addressLine2].filter(Boolean).join(' ').trim()
  const region = [v.district, v.city, v.state].filter(Boolean).join(', ')
  const tail = [(v.postalCode ?? '').trim(), countryLabel(a.countryCode)].filter(Boolean).join(', ')
  return [name, street, region, tail].filter(Boolean)
}

export const phoneText = (a: CardAddress) => `${a.dial} ${a.phone}`.trim()

/** 今日起算的預計送達日期區間(§11:展示日期範圍而非天數;自然日) */
export const etaRange = (days: [number, number]) => [isoLocalDate(days[0]), isoLocalDate(days[1])] as const

export const etaText = (from: string, to: string) => `${fmtLocalDateShort(from)} – ${fmtLocalDateShort(to)}`

/** 以某自然日为基准加偏移(追踪时间线用) */
export const isoLocalDateOf = (base: string, offsetDays: number) => {
  const d = new Date(`${base}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + offsetDays)
  return d.toISOString().slice(0, 10)
}

/** 提交申請(P04 → P05):生成申請單並快照地址;保存默認地址按勾選生效(§16) */
export function submitOrder(): CardOrder {
  const m = methodOf(card.method)
  const [etaFrom, etaTo] = etaRange(m.days)
  const date = new Date().toISOString().slice(0, 10)
  if (card.saveDefault) card.default = JSON.parse(JSON.stringify(card.draft))
  card.order = {
    id: `MC-${date.replace(/-/g, '')}-${String(Math.floor(100000 + Math.random() * 900000))}`,
    createdAt: date,
    address: JSON.parse(JSON.stringify(card.draft)),
    method: m.code,
    shippingFee: m.fee,
    etaFrom,
    etaTo,
    carrier: 'Taso Express',
    trackingNo: `TR${Math.floor(1e8 + Math.random() * 9e8)}${card.draft.countryCode}`,
  }
  return card.order
}
