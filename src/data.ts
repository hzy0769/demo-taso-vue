import type { ScreenId } from './store'

export interface Post {
  id: number
  avatar: string
  author: string
  verify: string
  meta: string
  text: string
  /** 文内金色话题标签 */
  goldTag?: string
  /** 提供“查看原文”折叠块的帖子才显示翻译开关 */
  original?: string
  image: string
  imgW: number
  imgH: number
  likeCount: string
  commentCount: string
  /** 无分享计数时不显示数字 */
  shareCount?: string
  /** 合作商家卡片（仅部分帖子展示） */
  merchant?: { title: string; meta: string }
}

export const foryouSeed: Post[] = [
  {
    id: 1,
    avatar: 'T',
    author: '@tokyofood',
    verify: 'Verified Purchase',
    meta: 'Tokyo · 2h ago',
    text: 'Shibuya 这家烧肉真的值得来吗？入口即化的和牛，人均只要 ¥3,800。',
    goldTag: '#焼肉Taso',
    original: '原文：Is this yakiniku in Shibuya really worth it? Melt-in-your-mouth wagyu at ¥3,800 per person.',
    image: '/assets/taso-yakiniku.jpg',
    imgW: 720,
    imgH: 481,
    likeCount: '1.2K',
    commentCount: '82',
    shareCount: '214',
    merchant: { title: 'Shibuya · 焼肉Taso', meta: '¥3,800 / 人 · ★4.7' },
  },
  {
    id: 2,
    avatar: 'C',
    author: '@coffeelog',
    verify: 'Local Creator',
    meta: 'Hong Kong · 5h ago',
    text: '香港这杯手冲太惊艳，豆子是埃塞俄比亚日晒，果酸明亮，值得专程去。',
    original: '原文：This pour-over in Hong Kong is stunning — an Ethiopian natural with bright acidity.',
    image: '/assets/taso-coffee.jpg',
    imgW: 720,
    imgH: 480,
    likeCount: '862',
    commentCount: '47',
    shareCount: '130',
  },
  {
    id: 3,
    avatar: 'S',
    author: '@seoulsnack',
    verify: 'Verified Member',
    meta: 'Seoul · 8h ago',
    text: '首尔这家甜品店的黄豆粉冰，排队 40 分钟也值。',
    image: '/assets/taso-dessert.jpg',
    imgW: 720,
    imgH: 1281,
    likeCount: '2.4K',
    commentCount: '156',
    shareCount: '389',
  },
]

export const followingPosts: Post[] = [
  {
    id: 4,
    avatar: 'A',
    author: '@alex',
    verify: 'Creator',
    meta: 'Tokyo · 1h ago',
    text: '东京这家拉面汤头浓郁，叉烧入口即化，深夜营业到 3 点。',
    image: '/assets/taso-ramen.jpg',
    imgW: 720,
    imgH: 720,
    likeCount: '3.1K',
    commentCount: '204',
  },
  {
    id: 5,
    avatar: 'M',
    author: '@mia',
    verify: 'Frequent Traveler',
    meta: 'Bangkok · 3h ago',
    text: '曼谷夜市的泰式炒粉，锅气十足，一份只要 60 泰铢。',
    image: '/assets/taso-bangkok.jpg',
    imgW: 720,
    imgH: 557,
    likeCount: '1.8K',
    commentCount: '93',
  },
]

export interface SearchItem {
  t: '用户' | '商家' | '帖子' | '地点' | '话题'
  n: string
  d: string
  go: ScreenId
}

export const SEARCH_DB: SearchItem[] = [
  { t: '用户', n: '@tokyofood', d: '东京美食探店 · 12.8K 粉丝', go: 'profile' },
  { t: '商家', n: '焼肉Taso', d: 'Shibuya · ★4.7', go: 'merchant' },
  { t: '帖子', n: 'Shibuya这家烧肉真的值得来吗？', d: '@tokyofood · 1.2K 赞', go: 'post' },
  { t: '地点', n: 'Shibuya', d: 'Tokyo · 热度 98', go: 'place' },
  { t: '话题', n: '#拉面', d: '12.4K 帖子', go: 'search' },
  { t: '商家', n: '鮨 Taso', d: 'Tokyo · ★4.8', go: 'merchant' },
  { t: '地点', n: 'Bangkok 夜市', d: 'Thailand · 热度 91', go: 'place' },
  { t: '帖子', n: '香港这杯咖啡太惊艳', d: '@coffeelog · 862 赞', go: 'post' },
  { t: '用户', n: '@coffeelog', d: '香港咖啡地图 · 8.6K 粉丝', go: 'profile' },
  { t: '话题', n: '#温泉', d: '6.8K 帖子', go: 'search' },
  { t: '商家', n: 'Taso Coffee', d: 'Hong Kong · ★4.6', go: 'merchant' },
  { t: '地点', n: 'Seoul 明洞', d: 'Korea · 热度 89', go: 'place' },
]

export interface TxItem {
  title: string
  meta: string
  amount: string
  amountOk: boolean
  sub: string
  badge: string
  badgeCls: 'ok' | 'warn'
  /** 分类筛选关键字 */
  cat: '充值' | '消费' | '报销' | '创作' | '推广' | '提现'
}

export const TX_LIST: TxItem[] = [
  {
    title: '会员卡充值', meta: '2026-09-08 · TOPUP-09081234',
    amount: '+HK$10,000', amountOk: true, sub: '手续费 HK$1,600',
    badge: '交易完成', badgeCls: 'ok', cat: '充值',
  },
  {
    title: '焼肉Taso 消费', meta: '2026-09-08 · PAY-09081930',
    amount: '−HK$800', amountOk: false, sub: '会员 95 折',
    badge: '交易完成', badgeCls: 'ok', cat: '消费',
  },
  {
    title: '报销结算入账', meta: '2026-09-09 · RMB-09090012',
    amount: '+HK$0.40', amountOk: true, sub: '日结 0.05%',
    badge: '已入账', badgeCls: 'ok', cat: '报销',
  },
  {
    title: '创作收益', meta: '2026-09-07 · CRT-09070088',
    amount: '+HK$120', amountOk: true, sub: '内容激励',
    badge: '已入账', badgeCls: 'ok', cat: '创作',
  },
  {
    title: '提现', meta: '2026-09-05 · WDR-09050021',
    amount: '−HK$500', amountOk: false, sub: '银行卡尾号 2021',
    badge: '处理中', badgeCls: 'warn', cat: '提现',
  },
]

export const TX_FILTERS = ['全部', '充值', '消费', '报销', '创作', '推广', '提现', '手续费'] as const
