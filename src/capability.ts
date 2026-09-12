/**
 * 市场能力矩阵 MarketCapability(评审 §3 平台化基础卡)
 *
 * 真实实现由「用户居住地 / KYC 级别 / 年龄 / 产品实体 / 支付方式 / 币种 / 风险等级」
 * 共同决定;本原型只演示矩阵的展示语义:入口、深链、通知和客服话术都读同一状态,
 * 未开放市场显示「暂未在你所在地区提供」而不是事后阻断。
 * 原型边界(评审 · 原型边界说明):页面入口一律保留,只加状态标签,不隐藏、不删除。
 *
 * 注意:内容地区(推荐用)与账户居住地(合规用)严格分离 ——
 * 本矩阵只看账户国家(KYC 事实),绝不由 UI 语言或内容地区推导。
 */

/** 受矩阵管控的金融能力 */
export type FeatureId = 'card' | 'topup' | 'withdraw' | 'crypto' | 'referral' | 'dividend'

/** 能力四态(评审 §3.1:可见 / 可申请 / 可交易 / 只读 → 原型收敛为三态演示) */
export type CapabilityState = 'available' | 'regionLocked' | 'kycRequired'

export interface CapabilityInfo {
  state: CapabilityState
  /** 状态说明文案 key(capability.*) */
  noteKey: string
}

/**
 * 演示矩阵:首批市场的能力开关示例。
 * HK 全量开放;TW/JP/KR 开放卡务与银行提现、加密按市场受限;
 * SG/TH 部分开放;US/GB 演示「推广单层化 + 分红不可见」的受限口径。
 * 上线前须逐市场经法务确认,本表仅表达「同一矩阵驱动所有入口」的产品结构。
 */
const MARKETS: Record<string, Partial<Record<FeatureId, CapabilityState>>> = {
  HK: { card: 'available', topup: 'available', withdraw: 'available', crypto: 'available', referral: 'available', dividend: 'available' },
  TW: { card: 'available', topup: 'available', withdraw: 'available', crypto: 'regionLocked', referral: 'available', dividend: 'regionLocked' },
  JP: { card: 'available', topup: 'available', withdraw: 'available', crypto: 'regionLocked', referral: 'available', dividend: 'regionLocked' },
  KR: { card: 'available', topup: 'available', withdraw: 'available', crypto: 'regionLocked', referral: 'available', dividend: 'regionLocked' },
  SG: { card: 'available', topup: 'available', withdraw: 'available', crypto: 'available', referral: 'regionLocked', dividend: 'regionLocked' },
  TH: { card: 'available', topup: 'available', withdraw: 'kycRequired', crypto: 'regionLocked', referral: 'available', dividend: 'regionLocked' },
  US: { card: 'available', topup: 'available', withdraw: 'available', crypto: 'regionLocked', referral: 'kycRequired', dividend: 'regionLocked' },
  GB: { card: 'available', topup: 'available', withdraw: 'available', crypto: 'regionLocked', referral: 'kycRequired', dividend: 'regionLocked' },
}

/** 未收录市场:一律按「需先完成 KYC / 合规确认」演示,不默认全开 */
const FALLBACK: Record<FeatureId, CapabilityState> = {
  card: 'available', topup: 'kycRequired', withdraw: 'kycRequired',
  crypto: 'regionLocked', referral: 'kycRequired', dividend: 'regionLocked',
}

/** 原型演示账号的 KYC 地区(ScreenKyc 示例:Hong Kong) */
export const DEMO_MARKET = 'HK'

export function marketCapabilities(country: string): Record<FeatureId, CapabilityState> {
  const table = MARKETS[country] ?? {}
  return { ...FALLBACK, ...table }
}

/** 单项能力状态 + 说明 key(入口标签、深链、客服话术共用) */
export function capabilityOf(feature: FeatureId, country = DEMO_MARKET): CapabilityInfo {
  const state = marketCapabilities(country)[feature]
  return { state, noteKey: `capability.${state}` }
}

export const capabilityLabel = (feature: FeatureId, country = DEMO_MARKET) =>
  capabilityOf(feature, country).state

/** 是否处于未开放态(用于入口标签;原型不隐藏入口,仅改标注文案) */
export const isLocked = (feature: FeatureId, country = DEMO_MARKET) =>
  capabilityOf(feature, country).state !== 'available'
