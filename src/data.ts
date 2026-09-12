import type { ScreenId } from './store'
import type { Money } from './i18n/format'

/* ── UGC 帖子模型(設計方案 §8.1)────────────────────────────────────
   originalContent 永遠保存發布內容,不被翻譯覆蓋;
   translations 是按目標語言派生的資源(機器/人工/作者);時間為 ISO 8601 instant。 */

export type VerifyKey = 'verifiedPurchase' | 'localCreator' | 'verifiedMember' | 'frequentTraveler' | 'creator' | 'advertiser'

export interface PostTranslation {
  locale: string
  text: string
  source: 'machine' | 'human' | 'author'
}

export interface Post {
  id: number
  avatar: string
  author: string
  verifyKey: VerifyKey
  /** 發布時刻(ISO 8601 instant,§9.2) */
  createdAt: string
  /** 發布地點(檢索與展示用城市 id,見 i18n/REGIONS) */
  placeCityId?: string
  original: { text: string; locale?: string }
  translations: PostTranslation[]
  /** 文內金色話題標籤(用戶內容,不翻譯) */
  goldTag?: string
  image: string
  imgW: number
  imgH: number
  likes: number
  comments: number
  /** 無分享計數時不顯示數字 */
  shares?: number
  /** 合作商家卡片(官方名稱 + 結構化價格/評分) */
  merchant?: { title: string; price: Money; rating: number }
  /** 廣告帖:值為落地頁域名,有值即顯示 Ad 標籤與廣告專屬選單 */
  ad?: string
  /** 廣告落地頁連結文案(譯文尾部金色展示) */
  link?: string
}

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString()

/* ── 信息流廣告(參考 X:廣告主帳號 + 推廣創意圖 + 落地頁域名)──────── */

const adWanderpass: Post = {
  id: 91,
  avatar: 'W',
  author: '@wanderpass',
  verifyKey: 'advertiser',
  createdAt: hoursAgo(4),
  placeCityId: 'tokyo',
  original: {
    locale: 'en',
    text: 'Dead roaming ruins a good trip. My whole Japan loop stayed online with a WanderPass eSIM — scan to activate, no SIM swap, no kiosk queue.\n\n190+ destinations covered, data packs up to 62% OFF for Taso members!\n\nTry it -> WanderPass.com',
  },
  translations: [
    { locale: 'zh-Hans', source: 'human', text: '长途飞行落地就断网?我这次环日之旅全程在线。\n\nWanderPass eSIM 覆盖 190+ 目的地,扫码即激活,不用换卡不用排队。\n\n全站流量包最高 62% OFF,Taso 用户专享!\n\n试试吧 -> ' },
    { locale: 'zh-Hant', source: 'human', text: '長途飛行落地就斷網?我這次環日之旅全程在線。\n\nWanderPass eSIM 覆蓋 190+ 目的地,掃碼即激活,不用換卡不用排隊。\n\n全站流量包最高 62% OFF,Taso 用戶專享!\n\n試試吧 -> ' },
  ],
  link: 'WanderPass.com',
  image: '/assets/ad-wanderpass.svg',
  imgW: 720,
  imgH: 880,
  likes: 2600,
  comments: 296,
  shares: 266,
  ad: 'wanderpass.com',
}

const adStayloft: Post = {
  id: 92,
  avatar: 'L',
  author: '@stayloft',
  verifyKey: 'advertiser',
  createdAt: hoursAgo(7),
  placeCityId: 'tokyo',
  original: {
    locale: 'en',
    text: 'A design Loft in Tokyo for ¥420 a night in peak season? Yes really.\n\nStayLoft flash sale across 12 Asian cities, with an exclusive extra discount for Taso users.\n\nSelected rooms include free cancellation and link straight into Taso expense reports.\n\nCheck dates -> StayLoft.com',
  },
  translations: [
    { locale: 'zh-Hans', source: 'human', text: '旺季住东京,一晚 ¥420 的设计 Loft 你敢信?\n\nStayLoft 亚洲 12 城限时闪促,Taso 用户再享独家 6 折。\n\n部分房型含免费取消,商旅报销直接对接 Taso。\n\n看看日期 -> ' },
    { locale: 'zh-Hant', source: 'human', text: '旺季住東京,一晚 ¥420 的設計 Loft 你敢信?\n\nStayLoft 亞洲 12 城限時閃促,Taso 用戶再享獨家 6 折。\n\n部分房型含免費取消,商旅報銷直接對接 Taso。\n\n看看日期 -> ' },
  ],
  link: 'StayLoft.com',
  image: '/assets/ad-stayloft.svg',
  imgW: 720,
  imgH: 720,
  likes: 1100,
  comments: 98,
  shares: 74,
  ad: 'stayloft.com',
}

const adRailasia: Post = {
  id: 93,
  avatar: 'R',
  author: '@railasia',
  verifyKey: 'advertiser',
  createdAt: hoursAgo(6),
  placeCityId: 'seoul',
  original: {
    locale: 'zh-Hans',
    text: '一张通票扫遍亚洲高铁,这次真的打折了。\n\nRailAsia 通票全线路 8 折,Taso App 内下单再返 3% 报销金。\n\n坐高铁看海去 -> ',
  },
  translations: [
    { locale: 'zh-Hant', source: 'human', text: '一張通票掃遍亞洲高鐵,這次真的打折了。\n\nRailAsia 通票全線路 8 折,Taso App 內下單再返 3% 報銷金。\n\n坐高鐵看海去 -> ' },
    { locale: 'en', source: 'human', text: 'One pass for every high-speed rail in Asia — and it is actually on sale.\n\nRailAsia passes are 20% off network-wide, plus 3% reimbursement credit when you order in the Taso app.\n\nRide the rails to the sea -> ' },
  ],
  link: 'RailAsia.com',
  image: '/assets/ad-railasia.svg',
  imgW: 720,
  imgH: 800,
  likes: 864,
  comments: 56,
  shares: 41,
  ad: 'railasia.com',
}

export const foryouSeed: Post[] = [
  {
    id: 1,
    avatar: 'T',
    author: '@tokyofood',
    verifyKey: 'verifiedPurchase',
    createdAt: hoursAgo(2),
    placeCityId: 'tokyo',
    original: {
      locale: 'en',
      text: 'Is this yakiniku in Shibuya really worth it? Melt-in-your-mouth wagyu at ¥3,800 per person.\n\nWe got a table at 9pm, but once the charcoal was lit it was all worth it. Must-orders: thick-cut beef tongue and A5 wagyu short rib. The staff grill everything tableside and nail the doneness.\n\nThe stone-pot short rib rice to finish is incredible — grab a coupon in the app first for 5% off with the Taso card. Absolutely worth the trip; trying the lunch set next time.',
    },
    translations: [
      { locale: 'zh-Hans', source: 'human', text: 'Shibuya 这家烧肉真的值得来吗?入口即化的和牛,人均只要 ¥3,800。\n\n排到晚上九点才进店,但炭火一起,一切都值了。必点厚切牛舌和 A5 和牛肋条,外焦里嫩,店员帮忙烤制,火候掌握得恰到好处。\n\n最后上的石锅牛肋饭香气扑鼻,配一碗海带汤收尾刚好。用 Taso 会员卡结账还能打 95 折,记得提前在 App 领券。\n\n总体非常值得专程来一次,下次想来试试午市套餐。' },
      { locale: 'zh-Hant', source: 'human', text: 'Shibuya 這家燒肉真的值得來嗎?入口即化的和牛,人均只要 ¥3,800。\n\n排到晚上九點才進店,但炭火一起,一切都值了。必點厚切牛舌和 A5 和牛肋條,外焦裡嫩,店員幫忙烤製,火候掌握得恰到好處。\n\n最後上的石鍋牛肋飯香氣撲鼻,配一碗海帶湯收尾剛好。用 Taso 會員卡結賬還能打 95 折,記得提前在 App 領券。\n\n總體非常值得專程來一次,下次想來試試午市套餐。' },
      { locale: 'ja', source: 'human', text: '渋谷のこの焼肉、本当に来る価値ある?口の中でとろける和牛が、一人あたりわずか ¥3,800。\n\n21 時まで並んでようやく入店。でも炭火に火が入った瞬間、すべてが報われました。厚切り牛タンと A5 和牛カルビは必須。店員さんが目の前で焼いてくれて、火入れも完璧です。\n\n締めの石焼カルビ丼は香り最高。ワカメスープでさっぱり〆るのがちょうどいい。Taso メンバーカードで支払うと 5% オフなので、事前にアプリでクーポンを取得しておくと安心。\n\n総合的にわざわざ来る価値あり。次はランチセットを試したい。' },
      { locale: 'ko', source: 'human', text: '시부야의 이 야키니쿠, 진짜 갈 만할까? 입에서 녹는 와규가 1인당 겨우 ¥3,800.\n\n밤 9시까지 줄을 서서야 입점했지만, 숯불이 붙는 순간 다 값어치 있었어요. 두꺼운 우설과 A5 와규 갈비는 필수. 직원이 테이블에서 구워주고 불 조절도 완벽합니다.\n\n마지막 돌솥 갈비 밥은 향이 가득하고, 미역국으로 마무리하면 딱 좋아요. Taso 멤버십 카드로 계산하면 5% 할인도 되니 미리 앱에서 쿠폰 받는 걸 잊지 마세요.\n\n전체적으로 일부러 올 가치가 충분해요. 다음엔 점심 세트를 먹어보고 싶네요.' },
    ],
    goldTag: '#焼肉Taso',
    image: '/assets/taso-yakiniku.jpg',
    imgW: 720,
    imgH: 481,
    likes: 1200,
    comments: 82,
    shares: 214,
    merchant: { title: '焼肉Taso Shibuya', price: { amount: 3800, currency: 'JPY' }, rating: 4.7 },
  },
  {
    id: 2,
    avatar: 'C',
    author: '@coffeelog',
    verifyKey: 'localCreator',
    createdAt: hoursAgo(5),
    placeCityId: 'hong-kong',
    original: { locale: 'en', text: 'This pour-over in Hong Kong is stunning — an Ethiopian natural with bright acidity.' },
    translations: [
      { locale: 'zh-Hans', source: 'machine', text: '香港这杯手冲太惊艳,豆子是埃塞俄比亚日晒,果酸明亮,值得专程去。' },
      { locale: 'zh-Hant', source: 'human', text: '香港這杯手沖太驚艷,豆子是埃塞俄比亞日曬,果酸明亮,值得專程去。' },
    ],
    image: '/assets/taso-coffee.jpg',
    imgW: 720,
    imgH: 480,
    likes: 862,
    comments: 47,
    shares: 130,
  },
  adWanderpass,
  {
    id: 3,
    avatar: 'S',
    author: '@seoulsnack',
    verifyKey: 'verifiedMember',
    createdAt: hoursAgo(8),
    placeCityId: 'seoul',
    original: { locale: 'ko', text: '서울 이 디저트 가게의 콩가루 빙수, 40분을 줄 서도 갈 가치가 있어요.' },
    translations: [
      { locale: 'zh-Hans', source: 'human', text: '首尔这家甜品店的黄豆粉冰,排队 40 分钟也值。' },
      { locale: 'zh-Hant', source: 'human', text: '首爾這家甜品店的黃豆粉冰,排隊 40 分鐘也值。' },
    ],
    image: '/assets/taso-dessert.jpg',
    imgW: 720,
    imgH: 1281,
    likes: 2400,
    comments: 156,
    shares: 389,
  },
  adStayloft,
]

export const followingPosts: Post[] = [
  {
    id: 4,
    avatar: 'A',
    author: '@alex',
    verifyKey: 'creator',
    createdAt: hoursAgo(1),
    placeCityId: 'tokyo',
    original: { locale: 'zh-Hans', text: '东京这家拉面汤头浓郁,叉烧入口即化,深夜营业到 3 点。' },
    translations: [
      { locale: 'zh-Hant', source: 'human', text: '東京這家拉麵湯頭濃郁,叉燒入口即化,深夜營業到 3 點。' },
      { locale: 'en', source: 'human', text: 'This Tokyo ramen has a rich, deep broth and chashu that melts in your mouth — open until 3am.' },
    ],
    image: '/assets/taso-ramen.jpg',
    imgW: 720,
    imgH: 720,
    likes: 3100,
    comments: 204,
  },
  adRailasia,
  {
    id: 5,
    avatar: 'M',
    author: '@mia',
    verifyKey: 'frequentTraveler',
    createdAt: hoursAgo(3),
    placeCityId: 'bangkok',
    original: { locale: 'th', text: 'ผัดไทยที่ตลาดกลางคืนนี้ฉ่ำกำลังดี แค่ 60 บาทต่อจานเท่านั้น' },
    translations: [
      { locale: 'zh-Hans', source: 'machine', text: '曼谷夜市的泰式炒粉,锅气十足,一份只要 60 泰铢。' },
      { locale: 'zh-Hant', source: 'human', text: '曼谷夜市的泰式炒粉,鑊氣十足,一份只要 60 泰銖。' },
    ],
    image: '/assets/taso-bangkok.jpg',
    imgW: 720,
    imgH: 557,
    likes: 1800,
    comments: 93,
  },
]

/* ── 多語言檢索(設計方案 §8.3 SearchDocument)────────────────────── */

export type SearchType = 'user' | 'merchant' | 'post' | 'place' | 'topic'

export interface SearchDoc {
  type: SearchType
  /** 官方 / 原始名稱 */
  canonical: string
  /** 本地化名稱(locale → 名稱) */
  names?: Record<string, string>
  /** 別名 / 舊名 / 常見寫法 / 轉寫 */
  aliases: string[]
  descKey: string
  descParams?: Record<string, string | number>
  go: ScreenId
  /** 帖子結果:直達對應詳情頁 */
  pid?: number
  /** 用戶結果:成員 id(渲染時取本地化 bio) */
  member?: string
}

export const SEARCH_DB: SearchDoc[] = [
  { type: 'user', canonical: '@tokyofood', aliases: ['tokyofood', '東京美食探店', '东京美食探店'], descKey: 'search.sd.user', descParams: { count: 12800 }, go: 'profile', member: 'tokyofood' },
  { type: 'merchant', canonical: '焼肉Taso', names: { 'zh-Hant': '焼肉Taso', 'zh-Hans': '焼肉Taso', en: 'Yakiniku Taso', ja: '焼肉Taso', ko: '야키니쿠 타소' }, aliases: ['yakiniku', '焼肉', '烧肉', 'Yakiniku Taso'], descKey: 'search.sd.merchant', descParams: { city: 'Tokyo', rating: 4.7 }, go: 'merchant' },
  { type: 'post', canonical: '@tokyofood', names: { 'zh-Hant': 'Shibuya 這家燒肉真的值得來嗎?', 'zh-Hans': 'Shibuya这家烧肉真的值得来吗?', en: 'Is this yakiniku in Shibuya really worth it?', ja: '渋谷のこの焼肉、本当に来る価値ある?', ko: '시부야의 이 야키니쿠, 진짜 갈 만할까?' }, aliases: ['焼肉taso', '和牛'], descKey: 'search.sd.post', descParams: { author: 'tokyofood', likes: 1200 }, go: 'post', pid: 1 },
  { type: 'place', canonical: 'Shibuya', names: { 'zh-Hant': '澀谷', 'zh-Hans': '涩谷', en: 'Shibuya', ja: '渋谷', ko: '시부야' }, aliases: ['渋谷', '涩谷', 'しぶや', 'Tokyo', '東京', '东京', 'Dongjing', '渋谷区'], descKey: 'search.sd.place', descParams: { country: 'JP', heat: 98 }, go: 'place' },
  { type: 'topic', canonical: '#拉面', names: { 'zh-Hant': '#拉麵', 'zh-Hans': '#拉面', en: '#ramen', ja: '#ラーメン', ko: '#라멘' }, aliases: ['ramen', 'ラーメン', '라멘', '#拉麵'], descKey: 'search.sd.topic', descParams: { count: 12400 }, go: 'search' },
  { type: 'merchant', canonical: '鮨 Taso', names: { 'zh-Hant': '鮨 Taso', 'zh-Hans': '鮨 Taso', en: 'Sushi Taso', ja: '鮨 Taso', ko: '스시 타소' }, aliases: ['sushi', '寿司', '壽司', 'スシ'], descKey: 'search.sd.merchant', descParams: { city: 'Tokyo', rating: 4.8 }, go: 'merchant' },
  { type: 'place', canonical: 'Bangkok Night Market', names: { 'zh-Hant': '曼谷夜市', 'zh-Hans': '曼谷夜市', en: 'Bangkok Night Market', ja: 'バンコク・ナイトマーケット', ko: '방콕 야시장' }, aliases: ['考山路', '夜市', 'night market'], descKey: 'search.sd.place', descParams: { country: 'TH', heat: 91 }, go: 'place' },
  { type: 'place', canonical: 'Hong Kong', names: { 'zh-Hant': '香港', 'zh-Hans': '香港', en: 'Hong Kong', ja: '香港', ko: '홍콩' }, aliases: ['HK', 'HongKong', '香港島', '港岛'], descKey: 'search.sd.place', descParams: { country: 'HK', heat: 92 }, go: 'place' },
  { type: 'post', canonical: '@coffeelog', names: { 'zh-Hant': '香港這杯咖啡太驚艷', 'zh-Hans': '香港这杯咖啡太惊艳', en: 'This Hong Kong pour-over is stunning', ja: '香港のこのハンドドリップは圧巻', ko: '홍콩의 이 핸드드립 커피' }, aliases: ['手沖', '手冲', 'pour-over'], descKey: 'search.sd.post', descParams: { author: 'coffeelog', likes: 862 }, go: 'post', pid: 2 },
  { type: 'user', canonical: '@coffeelog', aliases: ['coffeelog', '香港咖啡地圖', '香港咖啡地图'], descKey: 'search.sd.user', descParams: { count: 8600 }, go: 'profile', member: 'coffeelog' },
  { type: 'topic', canonical: '#温泉', names: { 'zh-Hant': '#溫泉', 'zh-Hans': '#温泉', en: '#onsen', ja: '#温泉', ko: '#온천' }, aliases: ['onsen', '온천', '#溫泉'], descKey: 'search.sd.topic', descParams: { count: 6800 }, go: 'search' },
  { type: 'merchant', canonical: 'Taso Coffee', aliases: ['咖啡', 'coffee'], descKey: 'search.sd.merchant', descParams: { city: 'Hong Kong', rating: 4.6 }, go: 'merchant' },
  { type: 'place', canonical: 'Seoul Myeongdong', names: { 'zh-Hant': '首爾明洞', 'zh-Hans': '首尔明洞', en: 'Seoul Myeongdong', ja: 'ソウル・明洞', ko: '서울 명동' }, aliases: ['明洞', 'myeongdong'], descKey: 'search.sd.place', descParams: { country: 'KR', heat: 89 }, go: 'place' },
]

/* ── 流水(§9.1:金額 = 數值 + ISO 4217,時刻 = ISO instant)────────── */

export type TxCat = 'topup' | 'spend' | 'reimburse' | 'creator' | 'referral' | 'dividend' | 'withdraw'
export type TxStatus = 'done' | 'credited' | 'pending'

export interface TxItem {
  titleKey: string
  titleParams?: Record<string, string | number>
  at: string
  ref: string
  amount: Money
  sign: '+' | '-'
  /** 副行手續費(金額結構化) */
  fee?: Money
  subKey?: string
  subParams?: Record<string, string | number>
  status: TxStatus
  cat: TxCat
}

/** 會員卡賬戶流水:充值 / 消費(Visa 網絡同步),不含錢包收益 */
export const CARD_TX: TxItem[] = [
  {
    titleKey: 'tx.topup',
    at: '2026-09-08T12:34:00+08:00',
    ref: 'TOPUP-09081234',
    amount: { amount: 10000, currency: 'USD' },
    sign: '+',
    fee: { amount: 1600, currency: 'USD' },
    status: 'done',
    cat: 'topup',
  },
  {
    titleKey: 'tx.spend',
    titleParams: { merchant: '焼肉Taso' },
    at: '2026-09-08T19:30:00+09:00',
    ref: 'PAY-09081930',
    amount: { amount: 800, currency: 'USD' },
    sign: '-',
    subKey: 'tx.sub.visaDiscount',
    status: 'done',
    cat: 'spend',
  },
]

export const CARD_TX_FILTERS = ['all', 'topup', 'spend', 'fee'] as const

/** 錢包收益賬戶流水:報銷 / 創作 / 推廣 / 分紅 / 提現,不含會員卡餘額 */
export const WALLET_TX: TxItem[] = [
  {
    titleKey: 'tx.reimburseSettle',
    at: '2026-09-09T09:00:00+08:00',
    ref: 'USD-09090012',
    amount: { amount: 0.4, currency: 'USD' },
    sign: '+',
    subKey: 'tx.sub.dailySettle',
    subParams: { rate: 0.05 },
    status: 'credited',
    cat: 'reimburse',
  },
  {
    titleKey: 'tx.referralBuy',
    at: '2026-09-08T16:05:00+08:00',
    ref: 'RFL-09080112',
    amount: { amount: 38.46, currency: 'USD' },
    sign: '+',
    subKey: 'tx.sub.referralBuy',
    subParams: { rate: '30%', base: 'HK$1,000' },
    status: 'credited',
    cat: 'referral',
  },
  {
    titleKey: 'tx.referralTopup',
    at: '2026-09-08T15:20:00+08:00',
    ref: 'RFL-09080045',
    amount: { amount: 50, currency: 'USD' },
    sign: '+',
    subKey: 'tx.sub.referralTopup',
    subParams: { rate: '0.5%', base: 'US$10,000' },
    status: 'credited',
    cat: 'referral',
  },
  {
    titleKey: 'tx.referralTopup',
    at: '2026-09-07T11:40:00+08:00',
    ref: 'RFL-09070083',
    amount: { amount: 10, currency: 'USD' },
    sign: '+',
    subKey: 'tx.sub.referralTopupL2',
    subParams: { rate: '0.1%', base: 'US$10,000' },
    status: 'credited',
    cat: 'referral',
  },
  {
    titleKey: 'tx.dividendSales',
    titleParams: { no: 12 },
    at: '2026-09-05T10:00:00+08:00',
    ref: 'DVD-20260805-S',
    amount: { amount: 12096, currency: 'USD' },
    sign: '+',
    subKey: 'tx.sub.salesPoolRatio',
    subParams: { ratio: '4.80%' },
    status: 'credited',
    cat: 'dividend',
  },
  {
    titleKey: 'tx.dividendRecharge',
    titleParams: { no: 12 },
    at: '2026-09-05T10:00:00+08:00',
    ref: 'DVD-20260805-R',
    amount: { amount: 1540, currency: 'USD' },
    sign: '+',
    subKey: 'tx.sub.rechargePoolRatio',
    subParams: { ratio: '4.58%' },
    status: 'credited',
    cat: 'dividend',
  },
  {
    titleKey: 'tx.creatorIncome',
    at: '2026-09-07T18:40:00+08:00',
    ref: 'CRT-09070088',
    amount: { amount: 120, currency: 'USD' },
    sign: '+',
    subKey: 'tx.sub.contentBonus',
    status: 'credited',
    cat: 'creator',
  },
  {
    titleKey: 'tx.withdraw',
    at: '2026-09-05T14:10:00+08:00',
    ref: 'WDR-09050021',
    amount: { amount: 500, currency: 'USD' },
    sign: '-',
    subKey: 'tx.sub.bankCard',
    subParams: { last4: '2021' },
    status: 'pending',
    cat: 'withdraw',
  },
]

export const WALLET_TX_FILTERS = ['all', 'reimburse', 'creator', 'referral', 'dividend', 'withdraw', 'fee'] as const

/* ── 推廣雙軌佣金(V2.2;比例與層數均為演示值,後台運營可配)────────── */

export type ReferralTrack = 'purchase' | 'topup'

/** rates 按一/二/三級順序;levels 為分傭層數(演示 3 級) */
export const REFERRAL_PLAN: Record<ReferralTrack, { levels: number; rates: [number, number, number] }> = {
  purchase: { levels: 3, rates: [0.30, 0.05, 0.01] },
  topup: { levels: 3, rates: [0.005, 0.001, 0.0005] },
}

/** 錢包「推廣獎勵」賬本按軌道拆分的演示值(合計 US$180,與權益頁入口一致) */
export const WALLET_REFERRAL: Record<ReferralTrack, number> = { purchase: 126, topup: 54 }

/* ── 股東分紅(V1.6 起銷售軌道,V2.2 增充值軌道; LocalDate 週期,§9.2)── */

/** 銷售分紅池比例:平台總銷售額 × 14% */
export const DIVIDEND_RATE = 0.14
/** 充值分紅池比例:會員總充值額 × 0.35% */
export const DIVIDEND_RECHARGE_RATE = 0.0035

export interface DividendPeriod {
  no: number
  from: string
  to: string
  paidAt: string
  platformSales: number
  relatedSales: number
  platformRecharge: number
  relatedRecharge: number
}

export const DIVIDEND_PERIODS: DividendPeriod[] = [
  { no: 12, from: '2026-08-01', to: '2026-08-31', paidAt: '2026-09-05', platformSales: 1800000, relatedSales: 86400, platformRecharge: 9600000, relatedRecharge: 440000 },
  { no: 11, from: '2026-07-01', to: '2026-07-31', paidAt: '2026-08-05', platformSales: 1700000, relatedSales: 76500, platformRecharge: 9000000, relatedRecharge: 396000 },
  { no: 10, from: '2026-06-01', to: '2026-06-30', paidAt: '2026-07-05', platformSales: 1500000, relatedSales: 60000, platformRecharge: 8400000, relatedRecharge: 320000 },
  { no: 9, from: '2026-05-01', to: '2026-05-31', paidAt: '2026-06-05', platformSales: 1600000, relatedSales: 52000, platformRecharge: 8800000, relatedRecharge: 280000 },
  { no: 8, from: '2026-04-01', to: '2026-04-30', paidAt: '2026-05-06', platformSales: 1400000, relatedSales: 49000, platformRecharge: 8200000, relatedRecharge: 260000 },
  { no: 7, from: '2026-03-01', to: '2026-03-31', paidAt: '2026-04-06', platformSales: 1200000, relatedSales: 42000, platformRecharge: 7600000, relatedRecharge: 230000 },
]

/** 期銷售分紅 = 平台總銷售額 × 14% × (關聯銷售總額 ÷ 平台總銷售額) */
export const dividendSalesOf = (p: DividendPeriod) =>
  p.platformSales * DIVIDEND_RATE * (p.relatedSales / p.platformSales)

/** 期充值分紅 = 會員總充值額 × 0.35% × (關聯充值額 ÷ 會員總充值額) */
export const dividendRechargeOf = (p: DividendPeriod) =>
  p.platformRecharge * DIVIDEND_RECHARGE_RATE * (p.relatedRecharge / p.platformRecharge)

/** 累計已發放分紅(雙軌合計):銷售 US$51,226 + 充值 US$6,741 = US$57,967 */
export const DIVIDEND_SALES_TOTAL = DIVIDEND_PERIODS.reduce((sum, p) => sum + dividendSalesOf(p), 0)
export const DIVIDEND_RECHARGE_TOTAL = DIVIDEND_PERIODS.reduce((sum, p) => sum + dividendRechargeOf(p), 0)
export const DIVIDEND_TOTAL = DIVIDEND_SALES_TOTAL + DIVIDEND_RECHARGE_TOTAL

/* ── 好友與消息(PRD §73;時間為 ISO instant,「今天/昨天」即時計算)── */

export interface Member {
  id: string
  avatar: string
  nick: string
  handle: string
  verifyKey: VerifyKey
  /** 常駐城市(見 i18n/REGIONS) */
  cityId: string
  online: boolean
  /** 簡介:原文 zh-Hans + 各語言譯文(演示種子內容) */
  bio: Record<string, string>
}

/** 可添加為好友的演示成員(「我」= @alex,不在此表內) */
export const MEMBERS: Record<string, Member> = {
  mia: { id: 'mia', avatar: 'M', nick: 'Mia', handle: '@mia', verifyKey: 'frequentTraveler', cityId: 'bangkok', online: true, bio: { 'zh-Hans': '曼谷美食与旅行攻略', 'zh-Hant': '曼谷美食與旅行攻略', en: 'Bangkok food & travel guides', ja: 'バンコク美食・旅行ガイド', ko: '방콕 미식·여행 가이드' } },
  sora: { id: 'sora', avatar: 'S', nick: 'Sora', handle: '@sora', verifyKey: 'verifiedMember', cityId: 'seoul', online: true, bio: { 'zh-Hans': '首尔甜品猎人', 'zh-Hant': '首爾甜品獵人', en: 'Seoul dessert hunter', ja: 'ソウルスイーツハンター', ko: '서울 디저트 헌터' } },
  ken: { id: 'ken', avatar: 'K', nick: 'Ken', handle: '@ken', verifyKey: 'localCreator', cityId: 'hong-kong', online: false, bio: { 'zh-Hans': '港岛咖啡地图作者', 'zh-Hant': '港島咖啡地圖作者', en: 'Author of the HK Island coffee map', ja: '港島コーヒーマップ著者', ko: '홍콩섬 커피 지도 작가' } },
  tokyofood: { id: 'tokyofood', avatar: 'T', nick: 'TokyoFood', handle: '@tokyofood', verifyKey: 'verifiedPurchase', cityId: 'tokyo', online: true, bio: { 'zh-Hans': '东京探店日记', 'zh-Hant': '東京探店日記', en: 'Tokyo restaurant diary', ja: '東京食べ歩き日記', ko: '도쿄 맛집 탐방 일기' } },
  coffeelog: { id: 'coffeelog', avatar: 'C', nick: 'CoffeeLog', handle: '@coffeelog', verifyKey: 'localCreator', cityId: 'hong-kong', online: false, bio: { 'zh-Hans': '香港咖啡地图', 'zh-Hant': '香港咖啡地圖', en: 'Hong Kong coffee map', ja: '香港コーヒーマップ', ko: '홍콩 커피 지도' } },
  yuki: { id: 'yuki', avatar: 'Y', nick: 'Yuki', handle: '@yuki', verifyKey: 'verifiedMember', cityId: 'osaka', online: true, bio: { 'zh-Hans': '大阪吃到扶墙出', 'zh-Hant': '大阪吃到扶牆出', en: 'Eating through Osaka', ja: '大阪はしごグルメ', ko: '오사카 먹방 투어' } },
  daniel: { id: 'daniel', avatar: 'D', nick: 'Daniel', handle: '@daniel', verifyKey: 'frequentTraveler', cityId: 'singapore', online: false, bio: { 'zh-Hans': '环球旅行 30 国', 'zh-Hant': '環球旅行 30 國', en: '30 countries and counting', ja: '世界 30 カ国旅行', ko: '30개국 여행 중' } },
}

export interface FriendReq {
  id: number
  member: string
  noteKey: 'contacts' | 'viaPost'
  at: string
}

export interface ChatMsg {
  id: number
  mine: boolean
  text: string
  /** ISO 8601 instant;分組「今天 / 昨天」由用戶時區即時計算(§8.2) */
  at: string
  read?: boolean
}

/** 單聊會話:id 即對方成員 id(演示態,見 §73.16) */
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

const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString()
const at = (dayOffset: number, h: number, min: number) => {
  const d = new Date()
  d.setDate(d.getDate() + dayOffset)
  d.setHours(h, min, 0, 0)
  return d.toISOString()
}

export const SOCIAL_SEED: Social = {
  friends: ['mia'],
  reqIn: [
    { id: 1, member: 'sora', noteKey: 'contacts', at: minutesAgo(5) },
    { id: 2, member: 'ken', noteKey: 'viaPost', at: at(-1, 21, 30) },
  ],
  reqOut: [],
  convs: [
    {
      id: 'mia',
      unread: 1,
      msgs: [
        { id: 1, mine: false, text: '曼谷夜市那家泰式炒粉,攻略写好了发你 📝', at: at(-1, 18, 20) },
        { id: 2, mine: true, text: '太好了,下个月就去!', at: at(-1, 18, 47), read: true },
        { id: 3, mine: false, text: '到了喊我,再给你推几家本地人去的', at: at(0, 9, 15) },
      ],
    },
  ],
}

/** 模擬回覆語料(key 為成員 id;UGC 原文保留,不做假翻譯) */
export const REPLIES: Record<string, string[]> = {
  mia: ['好呀,到时候组队 🙌', '这家我 mark 好久了,一起去', '收到收到', '曼谷见!'],
  sora: ['好嘞', '甜品店周末人少,建议 3 点去', '哈哈哈真的', '下次来首尔多待两天,我带你'],
  ken: ['中环那家新开的我还没试', '港岛线攻略我更新了', '+1', '改天咖啡走起'],
  tokyofood: ['这家我也在 list 上', '东京的话听我的准没错 😎', '排队 30 分钟起,早点去'],
  coffeelog: ['手冲推荐试试冰冲', '这批豆子昨天刚到货', '好,留个位置给你'],
  yuki: ['大阪烧我吹爆', '环球影城攻略要吗', '嘿嘿,来了带你吃'],
  daniel: ['新加坡美食节刚好在这周', '辣蟹记得提前预约', '收到!'],
}

export const GENERIC_REPLIES = ['好的 👌', '收到!', '哈哈哈', '同意 +1', '看看周末有没有空']
