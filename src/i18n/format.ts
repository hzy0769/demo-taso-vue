/**
 * 數值、貨幣、日期與相對時間格式化(設計方案 §9)
 *
 * 規則:
 * - 金額一律 { amount, ISO 4217 } 結構,展示用 Intl.NumberFormat;賬本幣種不隨顯示語言改變
 * - 時刻存 ISO 8601 instant,按用戶 timeZone + 有效 uiLocale 渲染
 * - 「剛剛 / 5 分鐘前 / 昨天」由時間差實時計算,不落庫(§9.2)
 */
import { prefs, t, FX_RATES, FX_UPDATED_AT } from './index'

export interface Money {
  amount: number
  currency: string
}

export const money = (amount: number, currency: string): Money => ({ amount, currency })

/** 交易金額:符號與金額分離,+/− 在各語言下一致 */
export function fmtMoney(m: Money, opts: { sign?: '+' | '-' } = {}): string {
  const s = new Intl.NumberFormat(prefs.uiLocale, { style: 'currency', currency: m.currency }).format(m.amount)
  return opts.sign ? (opts.sign === '+' ? `+${s}` : `−${s}`) : s
}

/**
 * 展示貨幣等值(僅發現/報價場景,§9.1):
 * 原幣種金額始終可見,等值僅作輔信息,並附「估算」與匯率時間。
 * 與交易同幣種時返回 null(不換算、不靜默相加)。
 */
export function fmtMoneyEstimate(m: Money, displayCurrency: string): { text: string; rateNote: string } | null {
  if (displayCurrency === m.currency || !FX_RATES[m.currency] || !FX_RATES[displayCurrency]) return null
  const usd = m.amount / FX_RATES[m.currency]
  const est = usd * FX_RATES[displayCurrency]
  const text = new Intl.NumberFormat(prefs.uiLocale, { style: 'currency', currency: displayCurrency }).format(est)
  const rate = (FX_RATES[displayCurrency] / FX_RATES[m.currency]).toFixed(4)
  const at = fmtDate(FX_UPDATED_AT)
  return { text, rateNote: t('money.estRateNote', { rate, time: at }) }
}

/** 自然日(YYYY-MM-DD)格式化:結算週期、發放日等 LocalDate 字段(§9.2) */
export function fmtLocalDate(iso: string): string {
  return new Intl.DateTimeFormat(prefs.uiLocale, {
    timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric',
  }).format(new Date(`${iso}T00:00:00Z`))
}

/** 自然日短格式(範圍兩端、ETA):zh「9月8日」/ en「Sep 8」 */
export function fmtLocalDateShort(iso: string): string {
  return new Intl.DateTimeFormat(prefs.uiLocale, {
    timeZone: 'UTC', month: 'short', day: 'numeric',
  }).format(new Date(`${iso}T00:00:00Z`))
}

/** 時刻 → 用戶時區完整日期時間(§9.2 示例:2026年9月8日 19:30) */
export function fmtDateTime(iso: string): string {
  return new Intl.DateTimeFormat(prefs.uiLocale, {
    timeZone: prefs.timeZone, year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(new Date(iso))
}

export function fmtDate(iso: string): string {
  return new Intl.DateTimeFormat(prefs.uiLocale, {
    timeZone: prefs.timeZone, year: 'numeric', month: 'short', day: 'numeric',
  }).format(new Date(iso))
}

export function fmtTime(iso: string): string {
  return new Intl.DateTimeFormat(prefs.uiLocale, {
    timeZone: prefs.timeZone, hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(new Date(iso))
}

/** 用戶時區下的日曆日 key(YYYY-MM-DD),供「今天/昨天」分組 */
export function dayKey(at: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: prefs.timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(at)
}

const pad = (n: number) => (n < 10 ? `0${n}` : String(n))

/** 相對今天的自然日(YYYY-MM-DD) */
export function isoLocalDate(offsetDays: number): string {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() + offsetDays)
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`
}

/** 相對時間:剛剛 / n 分鐘前 / n 小時前 / 昨天 / n 天前 / 日期(§9.2) */
export function relTime(iso: string): string {
  const atMs = new Date(iso).getTime()
  const nowMs = Date.now()
  const diffMin = Math.round((nowMs - atMs) / 60000)
  if (diffMin < 1) return t('time.justNow')
  if (diffMin < 60) return t('time.minutesAgo', { n: diffMin })
  const diffHr = Math.round(diffMin / 60)
  if (diffHr < 24) return t('time.hoursAgo', { n: diffHr })
  const yesterday = dayKey(new Date(nowMs - 24 * 3600 * 1000))
  if (dayKey(new Date(atMs)) === yesterday) return t('time.yesterday')
  if (diffHr < 24 * 7) return t('time.daysAgo', { n: Math.round(diffHr / 24) })
  return fmtDate(iso)
}

/** 會話列表時間:今天顯示時刻,昨天顯示「昨天」,更早顯示日期 */
export function convTime(iso: string): string {
  const at = new Date(iso)
  if (dayKey(at) === dayKey()) return fmtTime(iso)
  if (dayKey(at) === dayKey(new Date(Date.now() - 24 * 3600 * 1000))) return t('time.yesterday')
  return fmtDate(iso)
}

/** 聊天分組標題:今天 / 昨天 / 完整日期 */
export function chatDayLabel(iso: string): string {
  const at = new Date(iso)
  if (dayKey(at) === dayKey()) return t('time.today')
  if (dayKey(at) === dayKey(new Date(Date.now() - 24 * 3600 * 1000))) return t('time.yesterday')
  return fmtDate(iso)
}

/** 緊湊計數(1.2K / 1.2萬 / 1200 由 locale 決定) */
export function compact(n: number): string {
  return new Intl.NumberFormat(prefs.uiLocale, { notation: 'compact', maximumFractionDigits: 1 }).format(n)
}

/** 比例(雙軌傭金/費率):0.3 → 30%、0.0005 → 0.05%(最多兩位小數) */
export function fmtRate(r: number): string {
  return new Intl.NumberFormat(prefs.uiLocale, { style: 'percent', maximumFractionDigits: 2 }).format(r)
}
