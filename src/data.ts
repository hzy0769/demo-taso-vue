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
  /** 非中文源语言帖子：显示「翻译自 XX · 显示原文 / 显示翻译」开关 */
  lang?: string
  /** 未翻译的原文文本（与 lang 成对出现） */
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
  /** 广告帖（参考 X 信息流广告）：值为落地页域名，有值即显示 Ad 标签、图下「来自域名」、广告专属菜单 */
  ad?: string
  /** 广告落地页链接文案（正文尾部金色展示，如 WanderPass.com） */
  link?: string
}

/* ── 信息流广告（参考 X：广告主账号 + 推广创意图 + 落地页域名）──────── */

const adWanderpass: Post = {
  id: 91,
  avatar: 'W',
  author: '@wanderpass',
  verify: 'Advertiser',
  meta: '',
  text: '长途飞行落地就断网？我这次环日之旅全程在线。\n\nWanderPass eSIM 覆盖 190+ 目的地，扫码即激活，不用换卡不用排队。\n\n全站流量包最高 62% OFF，Taso 用户专享！\n\n试试吧 -> ',
  link: 'WanderPass.com',
  lang: '英语',
  original: 'Dead roaming ruins a good trip. My whole Japan loop stayed online with a WanderPass eSIM — scan to activate, no SIM swap, no kiosk queue.\n\n190+ destinations covered, data packs up to 62% OFF for Taso members!\n\nTry it -> WanderPass.com',
  image: '/assets/ad-wanderpass.svg',
  imgW: 720,
  imgH: 880,
  likeCount: '2.6K',
  commentCount: '296',
  shareCount: '266',
  ad: 'wanderpass.com',
}

const adStayloft: Post = {
  id: 92,
  avatar: 'L',
  author: '@stayloft',
  verify: 'Advertiser',
  meta: '',
  text: '旺季住东京，一晚 ¥420 的设计 Loft 你敢信？\n\nStayLoft 亚洲 12 城限时闪促，Taso 用户再享独家 6 折。\n\n部分房型含免费取消，商旅报销直接对接 Taso。\n\n看看日期 -> ',
  link: 'StayLoft.com',
  lang: '英语',
  original: 'A design Loft in Tokyo for ¥420 a night in peak season? Yes really.\n\nStayLoft flash sale across 12 Asian cities, with an exclusive extra discount for Taso users.\n\nSelected rooms include free cancellation and link straight into Taso expense reports.\n\nCheck dates -> StayLoft.com',
  image: '/assets/ad-stayloft.svg',
  imgW: 720,
  imgH: 720,
  likeCount: '1.1K',
  commentCount: '98',
  shareCount: '74',
  ad: 'stayloft.com',
}

const adRailasia: Post = {
  id: 93,
  avatar: 'R',
  author: '@railasia',
  verify: 'Advertiser',
  meta: '',
  text: '一张通票扫遍亚洲高铁，这次真的打折了。\n\nRailAsia 通票全线路 8 折，Taso App 内下单再返 3% 报销金。\n\n坐高铁看海去 -> ',
  link: 'RailAsia.com',
  image: '/assets/ad-railasia.svg',
  imgW: 720,
  imgH: 800,
  likeCount: '864',
  commentCount: '56',
  shareCount: '41',
  ad: 'railasia.com',
}

export const foryouSeed: Post[] = [
  {
    id: 1,
    avatar: 'T',
    author: '@tokyofood',
    verify: 'Verified Purchase',
    meta: 'Tokyo · 2h ago',
    text: 'Shibuya 这家烧肉真的值得来吗？入口即化的和牛，人均只要 ¥3,800。\n\n排到晚上九点才进店，但炭火一起，一切都值了。必点厚切牛舌和 A5 和牛肋条，外焦里嫩，店员帮忙烤制，火候掌握得恰到好处。\n\n最后上的石锅牛肋饭香气扑鼻，配一碗海带汤收尾刚好。用 Taso 会员卡结账还能打 95 折，记得提前在 App 领券。\n\n总体非常值得专程来一次，下次想来试试午市套餐。',
    goldTag: '#焼肉Taso',
    lang: '英语',
    original: 'Is this yakiniku in Shibuya really worth it? Melt-in-your-mouth wagyu at ¥3,800 per person.\n\nWe got a table at 9pm, but once the charcoal was lit it was all worth it. Must-orders: thick-cut beef tongue and A5 wagyu short rib. The staff grill everything tableside and nail the doneness.\n\nThe stone-pot short rib rice to finish is incredible — grab a coupon in the app first for 5% off with the Taso card. Absolutely worth the trip; trying the lunch set next time.',
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
    lang: '英语',
    original: 'This pour-over in Hong Kong is stunning — an Ethiopian natural with bright acidity.',
    image: '/assets/taso-coffee.jpg',
    imgW: 720,
    imgH: 480,
    likeCount: '862',
    commentCount: '47',
    shareCount: '130',
  },
  adWanderpass,
  {
    id: 3,
    avatar: 'S',
    author: '@seoulsnack',
    verify: 'Verified Member',
    meta: 'Seoul · 8h ago',
    text: '首尔这家甜品店的黄豆粉冰，排队 40 分钟也值。',
    lang: '韩语',
    original: '서울 이 디저트 가게의 콩가루 빙수, 40분을 줄 서도 갈 가치가 있어요.',
    image: '/assets/taso-dessert.jpg',
    imgW: 720,
    imgH: 1281,
    likeCount: '2.4K',
    commentCount: '156',
    shareCount: '389',
  },
  adStayloft,
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
  adRailasia,
  {
    id: 5,
    avatar: 'M',
    author: '@mia',
    verify: 'Frequent Traveler',
    meta: 'Bangkok · 3h ago',
    text: '曼谷夜市的泰式炒粉，锅气十足，一份只要 60 泰铢。',
    lang: '泰语',
    original: 'ผัดไทยที่ตลาดกลางคืนนี้ฉ่ำกำลังดี แค่ 60 บาทต่อจานเท่านั้น',
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
  /** 帖子结果：直达对应详情页 */
  pid?: number
}

export const SEARCH_DB: SearchItem[] = [
  { t: '用户', n: '@tokyofood', d: '东京美食探店 · 12.8K 粉丝', go: 'profile' },
  { t: '商家', n: '焼肉Taso', d: 'Shibuya · ★4.7', go: 'merchant' },
  { t: '帖子', n: 'Shibuya这家烧肉真的值得来吗？', d: '@tokyofood · 1.2K 赞', go: 'post', pid: 1 },
  { t: '地点', n: 'Shibuya', d: 'Tokyo · 热度 98', go: 'place' },
  { t: '话题', n: '#拉面', d: '12.4K 帖子', go: 'search' },
  { t: '商家', n: '鮨 Taso', d: 'Tokyo · ★4.8', go: 'merchant' },
  { t: '地点', n: 'Bangkok 夜市', d: 'Thailand · 热度 91', go: 'place' },
  { t: '帖子', n: '香港这杯咖啡太惊艳', d: '@coffeelog · 862 赞', go: 'post', pid: 2 },
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
  cat: '充值' | '消费' | '报销' | '创作' | '推广'
}

export const TX_LIST: TxItem[] = [
  {
    title: '会员卡充值', meta: '2026-09-08 · TOPUP-09081234',
    amount: '+US$10,000', amountOk: true, sub: '手续费 US$1,600',
    badge: '交易完成', badgeCls: 'ok', cat: '充值',
  },
  {
    title: '焼肉Taso 消费', meta: '2026-09-08 · PAY-09081930',
    amount: '−US$800', amountOk: false, sub: '会员 95 折',
    badge: '交易完成', badgeCls: 'ok', cat: '消费',
  },
  {
    title: '报销结算入账', meta: '2026-09-09 · USD-09090012',
    amount: '+US$0.40', amountOk: true, sub: '日结 0.05%',
    badge: '已入账', badgeCls: 'ok', cat: '报销',
  },
  {
    title: '创作收益', meta: '2026-09-07 · CRT-09070088',
    amount: '+US$120', amountOk: true, sub: '内容激励',
    badge: '已入账', badgeCls: 'ok', cat: '创作',
  },
]

export const TX_FILTERS = ['全部', '充值', '消费', '报销', '创作', '推广', '手续费'] as const

/* ── 好友与消息（PRD §73）────────────────────────────────────────── */

export interface Member {
  id: string
  avatar: string
  nick: string
  handle: string
  verify: string
  city: string
  online: boolean
  bio: string
}

/** 可添加为好友的演示成员（“我”= @alex，不在此表内） */
export const MEMBERS: Record<string, Member> = {
  mia: { id: 'mia', avatar: 'M', nick: 'Mia', handle: '@mia', verify: 'Frequent Traveler', city: 'Bangkok', online: true, bio: '曼谷美食与旅行攻略' },
  sora: { id: 'sora', avatar: 'S', nick: 'Sora', handle: '@sora', verify: 'Verified Member', city: 'Seoul', online: true, bio: '首尔甜品猎人' },
  ken: { id: 'ken', avatar: 'K', nick: 'Ken', handle: '@ken', verify: 'Local Creator', city: 'Hong Kong', online: false, bio: '港岛咖啡地图作者' },
  tokyofood: { id: 'tokyofood', avatar: 'T', nick: 'TokyoFood', handle: '@tokyofood', verify: 'Verified Purchase', city: 'Tokyo', online: true, bio: '东京探店日记' },
  coffeelog: { id: 'coffeelog', avatar: 'C', nick: 'CoffeeLog', handle: '@coffeelog', verify: 'Local Creator', city: 'Hong Kong', online: false, bio: '香港咖啡地图' },
  yuki: { id: 'yuki', avatar: 'Y', nick: 'Yuki', handle: '@yuki', verify: 'Verified Member', city: 'Osaka', online: true, bio: '大阪吃到扶墙出' },
  daniel: { id: 'daniel', avatar: 'D', nick: 'Daniel', handle: '@daniel', verify: 'Frequent Traveler', city: 'Singapore', online: false, bio: '环球旅行 30 国' },
}

export interface FriendReq {
  id: number
  member: string
  note: string
  time: string
}

export interface ChatMsg {
  id: number
  mine: boolean
  text: string
  time: string
  day: string
  read?: boolean
}

/** 单聊会话：id 即对方成员 id（演示态，见 §73.16） */
export interface Conv {
  id: string
  msgs: ChatMsg[]
  unread: number
}

export interface Social {
  friends: string[]
  reqIn: FriendReq[]
  reqOut: string[]
  convs: Conv[]
}

export const SOCIAL_SEED: Social = {
  friends: ['mia'],
  reqIn: [
    { id: 1, member: 'sora', note: '来自通讯录匹配', time: '5m' },
    { id: 2, member: 'ken', note: '通过你的帖子找到你', time: '昨天' },
  ],
  reqOut: [],
  convs: [
    {
      id: 'mia',
      unread: 1,
      msgs: [
        { id: 1, mine: false, text: '曼谷夜市那家泰式炒粉，攻略写好了发你 📝', time: '18:20', day: '昨天' },
        { id: 2, mine: true, text: '太好了，下个月就去！', time: '18:47', day: '昨天', read: true },
        { id: 3, mine: false, text: '到了喊我，再给你推几家本地人去的', time: '09:15', day: '今天' },
      ],
    },
  ],
}

/** 模拟回复语料（key 为成员 id） */
export const REPLIES: Record<string, string[]> = {
  mia: ['好呀，到时候组队 🙌', '这家我 mark 好久了，一起去', '收到收到', '曼谷见！'],
  sora: ['好嘞', '甜品店周末人少，建议 3 点去', '哈哈哈真的', '下次来首尔多待两天，我带你'],
  ken: ['中环那家新开的我还没试', '港岛线攻略我更新了', '+1', '改天咖啡走起'],
  tokyofood: ['这家我也在 list 上', '东京的话听我的准没错 😎', '排队 30 分钟起，早点去'],
  coffeelog: ['手冲推荐试试冰冲', '这批豆子昨天刚到货', '好，留个位置给你'],
  yuki: ['大阪烧我吹爆', '环球影城攻略要吗', '嘿嘿，来了带你吃'],
  daniel: ['新加坡美食节刚好在这周', '辣蟹记得提前预约', '收到！'],
}
