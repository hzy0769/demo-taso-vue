import { reactive, watch } from 'vue'

/* ── 实体会员卡全球申请与配送（V1.8 · 全球配送 PRD）──────────────────────
   设计文档：docs/global_physical_member_card_delivery_prototype.md
   核心：国家/地区驱动的动态地址模型（§22 配置驱动），字段顺序、命名、
   必填与校验规则由各国配置决定，不写死「省/市/区」结构（§6） */

export interface AddrFieldConf {
  key: string
  label: string
  required?: boolean
  type?: 'text' | 'select'
  options?: string[]
  /** 与相邻下一字段同行显示（First / Last name 成对） */
  pair?: boolean
}

export interface Country {
  /** ISO 3166-1 alpha-2（§8.2） */
  code: string
  flag: string
  zh: string
  en: string
  /** 电话区号，选国家后自动带入（§9） */
  dial: string
  /** 电话号码位数范围（不含区号） */
  digits: [number, number]
  postalRe?: RegExp
  postalExample?: string
  /** 是否支持特快配送（§15.3 偏远地区仅 Standard） */
  express: boolean
  /** 是否支持实体卡配送（§15.1） */
  shippable: boolean
  /** 推荐国家（选择器置顶，§8.1） */
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

const f = (key: string, label: string, required = false, extra: Partial<AddrFieldConf> = {}): AddrFieldConf =>
  ({ key, label, required, ...extra })

/** 国际姓名对（西方国家顺序：姓名在前，§7.1/§7.2） */
const intlName = (): AddrFieldConf[] => [
  f('firstName', '名 / First name', true, { pair: true }),
  f('lastName', '姓 / Last name', true, { pair: true }),
]

/** 未单独建模国家的国际通用模板（§30：扩展市场无需重复开发页面） */
const defaultFields = (): AddrFieldConf[] => [
  ...intlName(),
  f('addressLine1', '街道地址 / Street address', true),
  f('addressLine2', '公寓 / 单元（可选）'),
  f('city', '城市 / City', true),
  f('state', '州 / 省（可选）'),
  f('postalCode', '邮政编码（可选）'),
]

export const COUNTRIES: Country[] = [
  { code: 'JP', flag: '🇯🇵', zh: '日本', en: 'Japan', dial: '+81', digits: [9, 10],
    postalRe: /^\d{3}-?\d{4}$/, postalExample: '150-0001', express: true, shippable: true, rec: true,
    fields: [
      f('postalCode', '邮政编码 / Postal code', true),
      f('state', '都道府县 / Prefecture', true),
      f('city', '市 / 区 City / Ward', true),
      f('addressLine1', '街道地址 / Street address', true),
      f('addressLine2', '大楼 / 公寓名（可选）'),
      ...intlName(),
    ] },
  { code: 'US', flag: '🇺🇸', zh: '美国', en: 'United States', dial: '+1', digits: [10, 10],
    postalRe: /^\d{5}(-\d{4})?$/, postalExample: '12345', express: true, shippable: true, rec: true,
    fields: [
      ...intlName(),
      f('addressLine1', '街道地址 / Street address', true),
      f('addressLine2', '公寓 / 房间号（Apt / Suite / Unit，可选）'),
      f('city', '城市 / City', true),
      f('state', '州 / State', true, { type: 'select', options: US_STATES }),
      f('postalCode', '邮编 / ZIP code', true),
    ] },
  { code: 'CN', flag: '🇨🇳', zh: '中国', en: 'China', dial: '+86', digits: [11, 11],
    postalRe: /^\d{6}$/, postalExample: '100000', express: true, shippable: true, rec: true,
    fields: [
      f('fullName', '收件人姓名', true),
      f('state', '省 / Province', true),
      f('city', '城市 / City', true),
      f('district', '区县 / District', true),
      f('addressLine1', '详细地址 / Street address', true),
      f('postalCode', '邮政编码', true),
    ] },
  { code: 'GB', flag: '🇬🇧', zh: '英国', en: 'United Kingdom', dial: '+44', digits: [9, 10],
    postalRe: /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i, postalExample: 'SW1A 1AA', express: true, shippable: true, rec: true,
    fields: [
      ...intlName(),
      f('addressLine1', '地址第一行 / Address line 1', true),
      f('addressLine2', '地址第二行 / Address line 2（可选）'),
      f('city', '城镇 / 城市 / Town · City', true),
      f('state', '郡 / County（可选）'),
      f('postalCode', '邮编 / Postcode', true),
    ] },
  { code: 'HK', flag: '🇭🇰', zh: '香港', en: 'Hong Kong', dial: '+852', digits: [8, 8],
    express: true, shippable: true,
    fields: [
      f('fullName', '收件人姓名', true),
      f('city', '区域 / District（如 油尖旺）', true),
      f('addressLine1', '街道及门牌号', true),
      f('addressLine2', '大厦 / 单位（可选）'),
    ] },
  { code: 'TW', flag: '🇹🇼', zh: '台湾', en: 'Taiwan', dial: '+886', digits: [9, 9],
    postalRe: /^\d{3}(\d{2})?$/, postalExample: '100', express: true, shippable: true,
    fields: [
      f('fullName', '收件人姓名', true),
      f('city', '城市 / 縣市', true),
      f('district', '區 / 鄉鎮市區', true),
      f('addressLine1', '詳細地址 / Street address', true),
      f('postalCode', '郵遞區號', true),
    ] },
  { code: 'KR', flag: '🇰🇷', zh: '韩国', en: 'South Korea', dial: '+82', digits: [9, 10],
    postalRe: /^\d{5}$/, postalExample: '04524', express: true, shippable: true, fields: defaultFields() },
  { code: 'SG', flag: '🇸🇬', zh: '新加坡', en: 'Singapore', dial: '+65', digits: [8, 8],
    postalRe: /^\d{6}$/, postalExample: '018956', express: true, shippable: true,
    fields: [
      ...intlName(),
      f('addressLine1', '街道地址 / Street address', true),
      f('addressLine2', '公寓 / 单元（可选）'),
      f('postalCode', '邮编 / Postal code', true),
    ] },
  { code: 'AU', flag: '🇦🇺', zh: '澳大利亚', en: 'Australia', dial: '+61', digits: [9, 9],
    postalRe: /^\d{4}$/, postalExample: '2000', express: true, shippable: true, fields: defaultFields() },
  { code: 'CA', flag: '🇨🇦', zh: '加拿大', en: 'Canada', dial: '+1', digits: [10, 10],
    postalRe: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i, postalExample: 'K1A 0B1', express: true, shippable: true, fields: defaultFields() },
  { code: 'FR', flag: '🇫🇷', zh: '法国', en: 'France', dial: '+33', digits: [9, 9],
    postalRe: /^\d{5}$/, postalExample: '75001', express: true, shippable: true, fields: defaultFields() },
  { code: 'DE', flag: '🇩🇪', zh: '德国', en: 'Germany', dial: '+49', digits: [9, 11],
    postalRe: /^\d{5}$/, postalExample: '10115', express: true, shippable: true, fields: defaultFields() },
  { code: 'IT', flag: '🇮🇹', zh: '意大利', en: 'Italy', dial: '+39', digits: [9, 10],
    postalRe: /^\d{5}$/, postalExample: '00100', express: true, shippable: true, fields: defaultFields() },
  { code: 'ES', flag: '🇪🇸', zh: '西班牙', en: 'Spain', dial: '+34', digits: [9, 9],
    postalRe: /^\d{5}$/, postalExample: '28001', express: true, shippable: true, fields: defaultFields() },
  { code: 'IN', flag: '🇮🇳', zh: '印度', en: 'India', dial: '+91', digits: [10, 10],
    postalRe: /^\d{6}$/, postalExample: '110001', express: true, shippable: true, fields: defaultFields() },
  { code: 'TH', flag: '🇹🇭', zh: '泰国', en: 'Thailand', dial: '+66', digits: [9, 9],
    postalRe: /^\d{5}$/, postalExample: '10210', express: true, shippable: true, fields: defaultFields() },
  { code: 'AE', flag: '🇦🇪', zh: '阿联酋', en: 'United Arab Emirates', dial: '+971', digits: [9, 9],
    express: true, shippable: true, fields: defaultFields() },
  { code: 'MX', flag: '🇲🇽', zh: '墨西哥', en: 'Mexico', dial: '+52', digits: [10, 10],
    postalRe: /^\d{5}$/, postalExample: '06600', express: false, shippable: true, fields: defaultFields() },
  { code: 'BR', flag: '🇧🇷', zh: '巴西', en: 'Brazil', dial: '+55', digits: [10, 11],
    postalRe: /^\d{5}-?\d{3}$/, postalExample: '01310-100', express: false, shippable: true, fields: defaultFields() },
  { code: 'ZA', flag: '🇿🇦', zh: '南非', en: 'South Africa', dial: '+27', digits: [9, 9],
    postalRe: /^\d{4}$/, postalExample: '8001', express: false, shippable: true, fields: defaultFields() },
  // 演示「国家不支持配送」场景（§15.1）
  { code: 'IS', flag: '🇮🇸', zh: '冰岛', en: 'Iceland', dial: '+354', digits: [7, 9],
    express: false, shippable: false, fields: defaultFields() },
  { code: 'MV', flag: '🇲🇻', zh: '马尔代夫', en: 'Maldives', dial: '+960', digits: [7, 7],
    express: false, shippable: false, fields: defaultFields() },
]

export const countryOf = (code: string) => COUNTRIES.find(c => c.code === code)

/* ── 配送方式与费用（§10 / §23 / §24）────────────────────────────────── */

export interface ShippingMethod {
  code: 'standard' | 'express'
  name: string
  days: [number, number]
  /** 配送费 US$（实体卡办理费为发卡机构港币定价，是全平台唯一非美元金额） */
  fee: number
}

export const METHODS: ShippingMethod[] = [
  { code: 'standard', name: '标准配送 Standard', days: [5, 10], fee: 0 },
  { code: 'express', name: '特快配送 Express', days: [2, 4], fee: 12.99 },
]

export const methodOf = (code: string) => METHODS.find(m => m.code === code) ?? METHODS[0]

/** 实体卡办理费：发卡机构港币定价 HK$1,000/张（PRD §4.1.A，全平台唯一非美元金额） */
export const CARD_FEE_HKD = 1000

/* ── 申请流程状态（草稿保留 §27 / 保存默认地址 §16 / 订单）────────────── */

export interface CardAddress {
  countryCode: string
  /** 动态表单字段值（键同 AddrFieldConf.key，统一地址模型 §6.2/§21） */
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

const seedDraft = (): CardAddress => ({ countryCode: 'JP', values: {}, dial: '+81', phone: '' })

const seed = (): CardState => ({ draft: seedDraft(), saveDefault: true, default: null, method: 'standard', order: null })

function loadCard(): CardState {
  try {
    const raw = localStorage.getItem('taso-card')
    if (raw) {
      const s = JSON.parse(raw) as CardState
      if (s && typeof s.draft === 'object' && typeof s.draft.values === 'object') {
        const st = { ...seed(), ...s }
        if (!countryOf(st.draft.countryCode)) st.draft = seedDraft()
        // 已保存默认地址可再次使用：草稿为空时带入（§16 / P01 §4.2）
        const empty = !Object.keys(st.draft.values).length && !st.draft.phone
        if (empty && st.default) st.draft = JSON.parse(JSON.stringify(st.default))
        const c = countryOf(st.draft.countryCode)
        if (st.method === 'express' && !c?.express) st.method = 'standard'
        return st
      }
    }
  } catch { /* 损坏时回退初始态 */ }
  return seed()
}

export const card = reactive<CardState>(loadCard())

function persistCard() {
  localStorage.setItem('taso-card', JSON.stringify(card))
}

/** 任意状态变更即持久化（草稿保留 §27：用户退出页面后可恢复） */
watch(card, persistCard, { deep: true })

/** 删除账号时全量重置（store.deleteAccount 调用） */
export function resetCard() {
  Object.assign(card, seed())
  card.draft = seedDraft()
}

/** 切换国家：保留同名字段值、重置区号；返回此前是否已填地址（供调用方提示 §8.2） */
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

/** 字段级地址校验（§13）：返回 key → 错误文案（key='country' 为国家级错误） */
export function validateAddress(): Record<string, string> {
  const errs: Record<string, string> = {}
  const c = countryOf(card.draft.countryCode)
  if (!c) { errs.country = '请选择国家 / 地区'; return errs }
  if (!c.shippable) { errs.country = '实体卡暂不支持配送至该国家 / 地区，请选择其他地址'; return errs }
  for (const fld of c.fields) {
    const v = (card.draft.values[fld.key] ?? '').trim()
    const name = fld.label.split(' / ')[0]
    if (fld.required && !v) {
      errs[fld.key] = `请填写${name}`
    } else if (v && fld.key === 'postalCode' && c.postalRe && !c.postalRe.test(v)) {
      errs[fld.key] = c.postalExample
        ? `请输入有效的${name}（示例 ${c.postalExample}）`
        : `请输入有效的${name}`
    }
  }
  const digits = card.draft.phone.replace(/\D/g, '')
  if (!digits) errs.phone = '请填写电话号码'
  else if (digits.length < c.digits[0] || digits.length > c.digits[1]) {
    errs.phone = `号码需为 ${c.digits[0]}–${c.digits[1]} 位数字（不含区号）`
  }
  return errs
}

/* ── 展示辅助 ─────────────────────────────────────────────────────────── */

/** 地址展示行（§28.2 最多 4 行）：姓名 / 街道 / 区-市-州 / 邮编-国家 */
export function addrLines(a: CardAddress): string[] {
  const v = a.values
  const name = (v.fullName ?? '').trim() || [v.firstName, v.lastName].filter(Boolean).join(' ').trim()
  const street = [v.addressLine1, v.addressLine2].filter(Boolean).join(' ').trim()
  const region = [v.district, v.city, v.state].filter(Boolean).join(', ')
  const tail = [(v.postalCode ?? '').trim(), countryOf(a.countryCode)?.zh ?? a.countryCode].filter(Boolean).join(', ')
  return [name, street, region, tail].filter(Boolean)
}

export const phoneText = (a: CardAddress) => `${a.dial} ${a.phone}`.trim()

const dayIso = (offset: number) => {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return d.toISOString().slice(0, 10)
}

export const fmtDay = (iso: string) => {
  const [, m, d] = iso.split('-')
  return `${+m}月${+d}日`
}

/** 今日起算的预计送达日期区间（§11：展示日期范围而非天数） */
export const etaRange = (days: [number, number]) => [dayIso(days[0]), dayIso(days[1])] as const

export const etaText = (from: string, to: string) => `${fmtDay(from)} – ${fmtDay(to)}`

/** 提交申请（P04 → P05）：生成申请单并快照地址；保存默认地址按勾选生效（§16） */
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
