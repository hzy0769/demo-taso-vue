import { computed } from 'vue'
import { app } from './store'
import { MY_HANDLE, MY_POSTS } from './data'
import { dayKey, isoLocalDate } from './i18n/format'

/* ── 報銷活動引擎(V3.1 · 後台可配置演示值)───────────────────────────
   活動期內,報銷比例由「當日原創發帖任務」決定:
   - 基礎檔 65%:任意會員提交的消費帳單
   - 任務 1–4:當日原創發帖累計 1/2/3/4 篇 → 85% / 95% / 105% / 115%
   - 每張帳單在提交時按當日已達成的最高檔鎖定比例,其後發帖不影響該單
   正式版全部字段由後台動態配置(活動期起止 / 基礎比例 / 檔位篇數與比例 /
   任務口徑),客戶端僅讀取展示;高於 100% 的檔位須風控與法務確認後開放。 */

export interface ReimburseTier {
  /** 當日原創發帖累計篇數(達標門檻) */
  posts: number
  /** 達標後的報銷比例(0.85 = 85%) */
  rate: number
}

export const REIMBURSE_CAMPAIGN = {
  /** 活動 ID(演示) */
  id: 'RC-2026-09-A',
  /** 活動期(自然日;後台配置,App 僅展示。演示為滾動窗口,保持長期有效) */
  start: isoLocalDate(-14),
  end: isoLocalDate(16),
  /** 基礎檔:無任務達成時的比例 */
  baseRate: 0.65,
  /** 任務檔位(篇數 → 比例,後台可增刪調整) */
  tiers: [
    { posts: 1, rate: 0.85 },
    { posts: 2, rate: 0.95 },
    { posts: 3, rate: 1.05 },
    { posts: 4, rate: 1.15 },
  ] as ReimburseTier[],
  /** 日結算節奏(既有規則保留:按審核金額每日線性結算至上限) */
  dailyRate: 0.0005,
}

/** 活動期剩餘天數(含當日;0 = 最後一天) */
export function campaignDaysLeft(): number {
  return Math.max(0, Math.round((Date.parse(REIMBURSE_CAMPAIGN.end) - Date.parse(isoLocalDate(0))) / 86_400_000))
}

/**
 * 當日原創發帖數(任務計數口徑):兩條信息流 + 我的帖文種子中,
 * 以演示身份發布、發布成功(非審核中)且創建於用戶時區今日的帖子。
 */
export const todayOriginalPosts = computed(() => {
  const today = dayKey()
  const seen = new Set<number>()
  let n = 0
  for (const p of [...app.foryou, ...app.following, ...MY_POSTS]) {
    if (p.author !== MY_HANDLE || seen.has(p.id)) continue
    seen.add(p.id)
    if ((p.status ?? 'published') !== 'reviewing' && dayKey(new Date(p.createdAt)) === today) n++
  }
  return n
})

/** 當前生效比例:基礎檔,或已達成的最高任務檔 */
export function tierRateFor(posts: number): number {
  let rate = REIMBURSE_CAMPAIGN.baseRate
  for (const t of REIMBURSE_CAMPAIGN.tiers) if (posts >= t.posts) rate = t.rate
  return rate
}

/** 當前提交帳單將鎖定的比例 */
export const currentRate = computed(() => tierRateFor(todayOriginalPosts.value))

/** 下一個未達成檔位(無則 null) */
export const nextTier = computed(() =>
  REIMBURSE_CAMPAIGN.tiers.find(t => t.posts > todayOriginalPosts.value) ?? null,
)
