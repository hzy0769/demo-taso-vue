import { reactive, watch } from 'vue'
import { t, FX_RATES } from './i18n'
import { fmtMoney } from './i18n/format'

/* ── 支付方式與支付流(V2.3 · 參考 Stripe Express Checkout / Apple HIG /
   Google Pay 品牌規範 / Kraken·Crypto.com 穩定幣入金流程)──────────────
   統一支付上下文 PayRequest 同時服務「充值」與「實體卡申請」兩個入口:
   - 錢包(Apple Pay / Google Pay)→ 系統支付單模擬彈層,生物識別後即時完成
   - 銀行卡 → 卡表單屏(P04 之後的獨立步驟)
   - USDT / USDC → 選網絡 → 地址 + 二維碼 → 等待區塊確認
   上次使用的支付方式持久化(結賬最佳實踐:記住上次選擇)。
   結算幣種:註冊主體在香港,收款與扣款一律為港幣;會員卡為 Visa 美元
   賬戶,到賬金額按匯率實時換匯為美元入賬(見 hkdToUsd)。
   展示幣種(V2.10):法幣通道(錢包/銀行卡)按港幣展示;選擇 USDT / USDC
   的那一刻起,頁面金額即換算為美元展示(選幣即換算,不等支付步)。 */

/** 後台設置的港幣兌美元結算匯率:1 HKD ≈ 0.1282 USD(演示;正式版接入受認可匯率來源) */
export const HKD_USD_RATE = 1 / FX_RATES.HKD

/** 港幣金額 → 美元入賬金額(匯率實時換算) */
export const hkdToUsd = (hkd: number) => hkd / FX_RATES.HKD

/** 當前選中支付方式是否為數字貨幣(USDT / USDC) */
export const isCryptoMethod = () => pay.method === 'usdt' || pay.method === 'usdc'

/** 按當前支付方式的展示幣種格式化港幣金額:法幣 → HK$;USDT/USDC → 按匯率折算 US$(隨 pay.method 響應式切換) */
export function payDisplayMoney(hkd: number): string {
  return isCryptoMethod()
    ? fmtMoney({ amount: hkdToUsd(hkd), currency: 'USD' })
    : fmtMoney({ amount: hkd, currency: 'HKD' })
}

/** 數字貨幣方式下原港幣金額的輔助小字(≈ HK$…);法幣方式返回空串 */
export function payDisplayHint(hkd: number): string {
  return isCryptoMethod() ? `≈ ${fmtMoney({ amount: hkd, currency: 'HKD' })}` : ''
}

export type PayMethodId = 'apple-pay' | 'google-pay' | 'card' | 'usdt' | 'usdc'
export type PayKind = 'wallet' | 'card' | 'crypto'
export type PayPurpose = 'topup' | 'card'

/** 支付單 / 錢包彈層中的金額行(已格式化的展示文本) */
export interface PayLine {
  label: string
  money: string
}

/**
 * 支付披露報價(評審 §3.4 / 平台化基礎卡 Quote):
 * 每次付款前固定展示 —— 計價幣種、扣款幣種、匯率來源與有效時間、
 * 平台費 / 網絡費 / 稅費、到賬金額、退款規則、收款主體與客服入口。
 * 字段為已本地化的展示文本;金額構造統一走 i18n/format(無歧義貨幣符號)。
 */
export interface Quote {
  /** 計價幣種(ISO 4217;加密為 USDT / USDC) */
  priceCurrency: string
  /** 扣款幣種 */
  chargeCurrency: string
  /** 非同幣種時的換算說明(演示匯率 + 時點;見 i18n FX_RATES) */
  fxNote?: string
  /** 平台費 */
  platformFee: PayLine
  /** 網絡費(僅加密方式;由發起方錢包承擔) */
  networkFee?: PayLine
  /** 稅費 */
  tax: PayLine
  /** 到賬金額 */
  arrival: PayLine
  /** 退款規則說明 */
  refund: string
  /** 收款主體 */
  payee: string
  /** 客服入口 */
  support: string
}

export interface PayRequest {
  purpose: PayPurpose
  /** 商家支付單明細行(不含合計,合計由 totalText 展示) */
  lines: PayLine[]
  /** 主 CTA / 錢包彈層的合計文本 */
  totalText: string
  /** USDT/USDC 實際需支付的美元等值金額(含手續費;港幣總額按匯率折算,穩定幣與美元 1:1) */
  amountUSD: number
  /** 付款前披露(評審 §3.4:確認頁與錢包支付單複述同一份 Quote) */
  quote?: Quote
  onSuccess: () => void
}

export interface PayMethodMeta {
  id: PayMethodId
  kind: PayKind
  nameKey: string
  subKey?: string
  /** Apple Pay 僅在蘋果設備展示(HIG:只在支持的設備顯示 Apple Pay 標誌) */
  available: boolean
}

/** Apple Pay 僅在蘋果設備出現;Google Pay 全平台 */
export const APPLE_DEVICE = /Mac|iPhone|iPad|iPod/.test(
  (typeof navigator !== 'undefined' && (navigator.platform || navigator.userAgent)) || '',
)

export const PAY_METHODS: PayMethodMeta[] = [
  { id: 'apple-pay', kind: 'wallet', nameKey: 'pay.applePay', available: APPLE_DEVICE },
  { id: 'google-pay', kind: 'wallet', nameKey: 'pay.googlePay', available: true },
  { id: 'card', kind: 'card', nameKey: 'pay.card', subKey: 'pay.cardSub', available: true },
  { id: 'usdt', kind: 'crypto', nameKey: 'pay.usdt', subKey: 'pay.usdtSub', available: true },
  { id: 'usdc', kind: 'crypto', nameKey: 'pay.usdc', subKey: 'pay.usdcSub', available: true },
]

export const methodMeta = (id: PayMethodId) => PAY_METHODS.find(m => m.id === id)

export const payMethodName = (id: PayMethodId) => t(methodMeta(id)?.nameKey ?? 'pay.card')

/* ── 穩定幣網絡(Kraken / Crypto.com 模式:先選網絡再給地址)────────── */

export interface CryptoNet {
  id: 'TRC20' | 'ERC20' | 'BEP20'
  /** 網絡顯示名:USDT-TRC20 等,品牌與代號不翻譯 */
  label: string
  subKey: string
  /** 入賬所需區塊確認數(演示值) */
  confs: number
  recommended?: boolean
}

export const CRYPTO_NETS: CryptoNet[] = [
  { id: 'TRC20', label: 'TRON (TRC20)', subKey: 'pay.crypto.net.trc20', confs: 2, recommended: true },
  { id: 'ERC20', label: 'Ethereum (ERC20)', subKey: 'pay.crypto.net.erc20', confs: 3 },
  { id: 'BEP20', label: 'BNB Smart Chain (BEP20)', subKey: 'pay.crypto.net.bep20', confs: 2 },
]

export const netOf = (id: string) => CRYPTO_NETS.find(n => n.id === id) ?? CRYPTO_NETS[0]

/** 確定性偽隨機字符串(FNV 變體):同 seed 產出相同序列 */
function pseudoChars(seed: string, n: number, alphabet: string): string {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  let out = ''
  for (let i = 0; i < n; i++) {
    h = Math.imul(h ^ (h >>> 15), 2246822519) >>> 0
    out += alphabet[h % alphabet.length]
  }
  return out
}

/** 演示收款地址:按 幣種+網絡 確定性生成,同組合刷新後不變(TRC20 為 Base58 T 開頭,其餘 0x 十六進制) */
export function demoAddress(asset: 'usdt' | 'usdc', net: string): string {
  const seed = `taso-${asset}-${net}`
  if (net === 'TRC20') return 'T' + pseudoChars(seed, 33, '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz')
  return '0x' + pseudoChars(seed, 40, '0123456789abcdef')
}

/** 演示交易哈希(每次隨機) */
export function demoTxid(): string {
  return '0x' + pseudoChars(`taso-tx-${Date.now()}-${Math.random()}`, 62, '0123456789abcdef')
}

/* ── 銀行卡輸入輔助(格式化 + 品牌識別,本地演示不外發)─────────────── */

export interface CardDraft {
  number: string
  exp: string
  cvc: string
  save: boolean
}

export type CardBrand = 'visa' | 'mastercard' | 'amex' | ''

export function cardBrand(number: string): CardBrand {
  const n = number.replace(/\D/g, '')
  if (/^4/.test(n)) return 'visa'
  if (/^(5[1-5]|2[2-7])/.test(n)) return 'mastercard'
  if (/^3[47]/.test(n)) return 'amex'
  return ''
}

/** 卡號分組:Amex 4-6-5,其餘 4-4-4-4(-4-4) */
export function fmtCardNumber(v: string): string {
  const n = v.replace(/\D/g, '').slice(0, cardBrand(v) === 'amex' ? 15 : 19)
  const groups = cardBrand(n) === 'amex' ? [4, 6, 5] : [4, 4, 4, 4, 3]
  const out: string[] = []
  let i = 0
  for (const g of groups) {
    if (i >= n.length) break
    out.push(n.slice(i, i + g))
    i += g
  }
  return out.join(' ')
}

/** 有效期 MM/YY 輸入格式化 */
export function fmtExp(v: string): string {
  const n = v.replace(/\D/g, '').slice(0, 4)
  return n.length <= 2 ? n : `${n.slice(0, 2)}/${n.slice(2)}`
}

export function cardOk(c: CardDraft): boolean {
  const n = c.number.replace(/\D/g, '')
  const brand = cardBrand(n)
  const len = brand === 'amex' ? 15 : brand ? 16 : 0
  if (!len || n.length !== len) return false
  const [mm, yy] = c.exp.split('/')
  if (!mm || !yy || +mm < 1 || +mm > 12 || yy.length !== 2) return false
  return new RegExp(`^\\d{3,4}$`).test(c.cvc) && (brand !== 'amex' || c.cvc.length === 4) && (brand === 'amex' || c.cvc.length === 3)
}

export const cardLast4 = (c: CardDraft) => c.number.replace(/\D/g, '').slice(-4)

/* ── 支付狀態(模塊級;彈層/屏幕共享)────────────────────────────────── */

interface PayState {
  /** 上次使用的支付方式(持久化,默認跟隨設備) */
  method: PayMethodId
  /** 支付方式選擇彈層(卡申請 P04 入口) */
  pickerOpen: boolean
  /** 系統錢包支付單模擬彈層 */
  wallet: null | ({ method: 'apple-pay' | 'google-pay'; phase: 'review' | 'auth' | 'done' } & PayRequest)
  /** 銀行卡支付屏上下文 */
  cardReq: PayRequest | null
  /** 加密支付屏上下文 */
  cryptoReq: null | ({
    asset: 'usdt' | 'usdc'
    step: 'network' | 'transfer' | 'pending' | 'done'
    network: string
    confs: number
    txid: string
  } & PayRequest)
  cardDraft: CardDraft
}

const STORAGE_KEY = 'taso-pay'

function loadPay(): Pick<PayState, 'method' | 'cardDraft'> {
  const def: Pick<PayState, 'method' | 'cardDraft'> = {
    method: APPLE_DEVICE ? 'apple-pay' : 'card',
    cardDraft: { number: '', exp: '', cvc: '', save: true },
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const s = JSON.parse(raw) as Partial<PayState>
      if (s.method && PAY_METHODS.some(m => m.id === s.method && m.available)) def.method = s.method
      if (s.cardDraft && typeof s.cardDraft === 'object') {
        const c = s.cardDraft as Partial<CardDraft>
        // 演示態只保存掩碼後的展示信息,不落完整卡號(見 pay.card.note 聲明)
        def.cardDraft = { number: '', exp: '', cvc: '', save: c.save !== false }
      }
    }
  } catch { /* 損壞時回落默認 */ }
  return def
}

const loaded = loadPay()

export const pay = reactive<PayState>({
  method: loaded.method,
  pickerOpen: false,
  wallet: null,
  cardReq: null,
  cryptoReq: null,
  cardDraft: loaded.cardDraft,
})

watch(
  () => ({ method: pay.method, save: pay.cardDraft.save }),
  v => localStorage.setItem(STORAGE_KEY, JSON.stringify(v)),
  { deep: true },
)

/** 刪除帳號時清理(store.deleteAccount 調用) */
export function resetPay() {
  localStorage.removeItem(STORAGE_KEY)
  pay.method = APPLE_DEVICE ? 'apple-pay' : 'card'
  pay.pickerOpen = false
  pay.wallet = null
  pay.cardReq = null
  pay.cryptoReq = null
  pay.cardDraft = { number: '', exp: '', cvc: '', save: true }
}

/* ── 動作 ─────────────────────────────────────────────────────────────── */

export const openPicker = () => { pay.pickerOpen = true }
export const closePicker = () => { pay.pickerOpen = false }

/** 直接触发钱包支付(充值页快捷按钮:express = 立即支付,无需先选再付) */
export function startWallet(method: 'apple-pay' | 'google-pay', req: PayRequest) {
  pay.wallet = { method, phase: 'review', ...req }
}

export function walletCancel() {
  pay.wallet = null
}

/** 钱包弹层确认:模拟 Face ID / 双击侧边按钮 → 完成 → 回调 */
export function walletAuthorize() {
  const w = pay.wallet
  if (!w || w.phase !== 'review') return
  w.phase = 'auth'
  setTimeout(() => {
    if (pay.wallet !== w || w.phase !== 'auth') return
    w.phase = 'done'
    setTimeout(() => {
      if (pay.wallet !== w) return
      pay.wallet = null
      markPaid(w.method)
      w.onSuccess()
    }, 900)
  }, 1100)
}

/** 最近一笔完成的支付(成功页 / 收据展示用,不落盘) */
export const lastPaid = reactive<{ method: PayMethodId | ''; network: string; last4: string }>({ method: '', network: '', last4: '' })

export function markPaid(method: PayMethodId, network = '', last4 = '') {
  lastPaid.method = method
  lastPaid.network = network
  lastPaid.last4 = last4
}

/** 银行卡支付屏(导航由调用方执行:show('pay-card')) */
export function startCard(req: PayRequest) {
  pay.cardReq = req
  pay.pickerOpen = false
}

/** 加密支付屏,先落网络选择步(导航由调用方执行:show('pay-crypto')) */
export function startCrypto(asset: 'usdt' | 'usdc', req: PayRequest) {
  pay.cryptoReq = { asset, step: 'network', network: CRYPTO_NETS[0].id, confs: 0, txid: '', ...req }
  pay.pickerOpen = false
}

export const cryptoNet = () => netOf(pay.cryptoReq?.network ?? '')
export const cryptoAddress = () =>
  pay.cryptoReq ? demoAddress(pay.cryptoReq.asset, pay.cryptoReq.network) : ''

/** 选定网络 → 进入转账信息步 */
export function chooseCryptoNet(id: string) {
  const c = pay.cryptoReq
  if (!c || c.step !== 'network') return
  c.network = id
  c.step = 'transfer'
}

/** 「我已完成转账」→ 等待区块确认(演示:每 ~1.6s 一次确认) */
export function cryptoSent() {
  const c = pay.cryptoReq
  if (!c || c.step !== 'transfer') return
  c.step = 'pending'
  c.confs = 0
  c.txid = demoTxid()
  const net = netOf(c.network)
  const tick = () => {
    const cur = pay.cryptoReq
    if (!cur || cur !== c || cur.step !== 'pending') return
    cur.confs++
    if (cur.confs >= net.confs) {
      cur.step = 'done'
      markPaid(cur.asset, net.id)
    } else {
      setTimeout(tick, 1600)
    }
  }
  setTimeout(tick, 1500)
}

/** 确认完成 → 回到来源页并执行成功回调 */
export function finishCrypto() {
  const c = pay.cryptoReq
  if (!c || c.step !== 'done') return
  pay.cryptoReq = null
  c.onSuccess()
}

/** 卡申请收据上的支付方式展示行 */
export function paidViaText(method: PayMethodId | '', opts: { last4?: string; network?: string } = {}): string {
  if (!method) return ''
  const name = payMethodName(method)
  if (method === 'card' && opts.last4) return `${name} •••• ${opts.last4}`
  if ((method === 'usdt' || method === 'usdc') && opts.network) return `${name} · ${opts.network}`
  return name
}

export const lastPaidText = () => paidViaText(lastPaid.method, { network: lastPaid.network, last4: lastPaid.last4 })
