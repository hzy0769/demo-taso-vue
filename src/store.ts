import { nextTick, reactive } from 'vue'
import { foryouSeed, followingPosts, MEMBERS, REPLIES, SOCIAL_SEED, type Post, type Social } from './data'
import { resetCard } from './card'

export type ScreenId =
  | 'splash' | 'welcome' | 'login' | 'interests'
  | 'auth-oauth' | 'auth-entry' | 'auth-otp' | 'auth-error' | 'auth-nickname'
  | 'home' | 'post' | 'profile' | 'discover' | 'search'
  | 'merchant' | 'place'
  | 'benefits' | 'card-apply' | 'card-address' | 'card-country' | 'card-shipping' | 'card-review' | 'card-success' | 'card-tracking'
  | 'card-detail' | 'topup' | 'wallet' | 'dividend'
  | 'transactions' | 'wallet-transactions' | 'reimburse' | 'reimburse-detail' | 'withdraw'
  | 'referral' | 'creator'
  | 'me' | 'settings' | 'language' | 'security' | 'kyc' | 'notifications'
  | 'friends' | 'messages' | 'chat' | 'my-qrcode'
  | 'account' | 'auth-methods' | 'auth-sessions' | 'auth-delete'

/** 底部 Tab 对应的根屏幕 */
export const ROOTS: ScreenId[] = ['home', 'discover', 'benefits', 'me']

/** 引导流程屏幕：已访问用户恢复时不允许落在这些屏幕上 */
const ONBOARDING: ScreenId[] = [
  'splash', 'welcome', 'login', 'interests',
  'auth-oauth', 'auth-entry', 'auth-otp', 'auth-error', 'auth-nickname',
]

/** 另外不可恢复的屏幕：chat 依赖内存中的 chatWith，重启后回退首页 */
const NO_RESTORE: ScreenId[] = [...ONBOARDING, 'chat']

interface DialogReq {
  title: string
  text: string
  onOk?: () => void
  /** 主按钮文案，默认「确认」 */
  okText?: string
}

/** 好友页共享 Tab 状态（消息中心横幅可直达「请求」Tab） */
export type FriendsTab = '好友' | '请求' | '推荐'

/* ── 注册与登录（AUTH PRD v1.0）───────────────────────────────────── */

export type Provider = 'apple' | 'google' | 'x' | 'email' | 'phone'

/** 账号级别:注册即会员;股东由后台审核开通(V1.6 股东分红) */
export type Role = 'member' | 'shareholder'

export const ROLE_NAME: Record<Role, string> = { member: '会员', shareholder: '股东' }

/** 登录身份：一个 TASO User 可绑定多个（AUTH PRD §3.2） */
export interface AuthIdentity {
  provider: Provider
  /** provider_user_id（第三方）/ 邮箱 / E.164 手机号 */
  key: string
  /** 展示用掩码：a***n@gmail.com */
  label: string
  boundAt: string
}

export interface AuthUser {
  id: string
  nickname: string
  countryCode: string
  language: string
  timezone: string
  createdAt: string
  /** 是否持有有效 TASO session（登出 = false，账号保留） */
  session: boolean
  /** 账号级别：注册默认会员，股东由后台审核（V1.6） */
  role: Role
  identities: AuthIdentity[]
}

interface AuthState {
  user: AuthUser | null
  /** 认证完成、尚未创建账号的临时身份（新用户注册前） */
  pending: { provider: Provider; key: string; label: string } | null
  /** 授权屏正在处理的第三方 provider */
  oauth: Exclude<Provider, 'email' | 'phone'> | null
  /** OTP 原始目的地（邮箱 / E.164 手机号，作为 identity key） */
  otpKey: string
  /** OTP 掩码目的地（屏幕展示） */
  otpTo: string
}

function loadAuthUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem('taso-auth')
    if (raw) {
      const u = JSON.parse(raw) as AuthUser
      if (Array.isArray(u.identities) && u.nickname) {
        if (u.role !== 'shareholder') u.role = 'member' // 旧账号无 role 字段时兜底为会员
        return u
      }
    }
  } catch { /* 损坏时视为未注册 */ }
  return null
}

/** 演示态：每个第三方 provider 固定的 provider_user_id 与账号信息（AUTH PRD §7–§9） */
export const OAUTH_INFO: Record<Exclude<Provider, 'email' | 'phone'>, {
  name: string
  account: string
  key: string
  perms: string[]
}> = {
  google: {
    name: 'Alex Chen', account: 'alex.chen@gmail.com', key: 'g-1029384756',
    perms: ['See your name and profile picture', 'See your email address'],
  },
  apple: {
    name: 'Alex Chen', account: 'r9f2k1@privaterelay.appleid.com', key: 'a-88231104',
    perms: ['Read your name', 'Read your email (Hide My Email relay)'],
  },
  x: {
    name: 'Alex Chen', account: '@alex_travel', key: 'x-40211398',
    perms: ['Read your profile', 'Read your email address'],
  },
}

export const app = reactive({
  stack: ['splash'] as ScreenId[],
  screen: 'splash' as ScreenId,
  /** 会员卡余额（独立账户，仅限消费，不可提现） */
  bal: 12580,
  /** 钱包可提现余额（推广/创作/分红/报销等收益账本） */
  wd: 800,
  visited: localStorage.getItem('taso-visited') === '1',
  toast: '',
  toastOn: false,
  sheet: '' as '' | 'composer' | 'comments' | 'add-friend' | 'post-more',
  /** 帖子更多操作弹层正在针对的帖子 */
  morePost: null as Post | null,
  /** 已关注的帖子作者（@handle，参考 X 的帖子菜单） */
  follows: loadFollows(),
  dialog: null as DialogReq | null,
  /** 首页 For You 数据（发布成功后向头部插入新帖） */
  foryou: [...foryouSeed] as Post[],
  following: followingPosts,
  /** 详情页正在展示的帖子 id（openPost 设置，未知 id 回退热帖） */
  postId: 1,
  /** 好友与消息（PRD §73） */
  social: loadSocial(),
  chatWith: '',
  friendsTab: '好友' as FriendsTab,
  /** 注册与登录（AUTH PRD） */
  auth: { user: loadAuthUser(), pending: null, oauth: null, otpKey: '', otpTo: '' } as AuthState,
})

export const fmt = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

let toastTimer: ReturnType<typeof setTimeout> | undefined

export function toast(msg: string) {
  app.toast = msg
  app.toastOn = true
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { app.toastOn = false }, 2200)
}

export function save() {
  localStorage.setItem('taso-bal', String(app.bal))
  localStorage.setItem('taso-wd', String(app.wd))
}

function resetScroll() {
  const vp = document.querySelector('.viewport')
  if (vp) vp.scrollTop = 0
  const el = document.querySelector(`.scr[data-screen="${app.screen}"]`)
  if (el) el.scrollTop = 0
}

export function show(id: ScreenId, push = true) {
  app.screen = id
  if (push) {
    app.stack.push(id)
    if (app.stack.length > 40) app.stack.shift()
  }
  if (id === 'home') {
    localStorage.setItem('taso-visited', '1')
    app.visited = true
  }
  localStorage.setItem('taso-screen', id)
  void nextTick(resetScroll)
}

export function back() {
  if (app.stack.length > 1) {
    app.stack.pop()
    show(app.stack[app.stack.length - 1], false)
  } else {
    show('home', false)
  }
}

export function openSheet(name: 'composer' | 'comments' | 'add-friend') {
  app.sheet = name
}

/** 点击帖子 → 详情页展示完整内容 */
export function openPost(p: Post) {
  app.postId = p.id
  show('post')
}

/** 搜索等只知道 id 的场景 */
export function openPostById(id: number) {
  app.postId = id
  show('post')
}

/* ── 帖子更多操作（参考 X 的帖子菜单，前期版本只保留核心三项）────────── */

function loadFollows(): string[] {
  try {
    const raw = localStorage.getItem('taso-follows')
    if (raw) {
      const a = JSON.parse(raw) as unknown
      if (Array.isArray(a)) return a.filter(x => typeof x === 'string')
    }
  } catch { /* 损坏时视为未关注 */ }
  return []
}

/** 帖子右上角「更多」→ 打开操作菜单 */
export function openPostMore(p: Post) {
  app.morePost = p
  app.sheet = 'post-more'
}

export function isFollowed(handle: string) {
  return app.follows.includes(handle)
}

/** 关注 / 取消关注帖子作者（演示态：本地记录） */
export function toggleFollowAuthor(handle: string) {
  const followed = isFollowed(handle)
  app.follows = followed ? app.follows.filter(h => h !== handle) : [...app.follows, handle]
  localStorage.setItem('taso-follows', JSON.stringify(app.follows))
  closeSheets()
  toast(followed ? `已取消关注 ${handle}` : `已关注 ${handle}`)
}

/** 不感兴趣：从信息流移除该帖（演示态：仅本地过滤） */
export function notInterested() {
  notInterestedSilently()
  closeSheets()
  toast('好的，会减少推荐此类内容')
}

/** 举报帖子：弹确认框，确认后提交（演示态：仅提示） */
export function reportPost() {
  const p = app.morePost
  if (!p) return
  closeSheets()
  showDialog('举报帖子', `确认举报 ${p.author} 发布的这条帖子吗？提交后我们会尽快审核处理。`, () => toast('已收到举报，感谢反馈'))
}

/* ── 广告帖操作（参考 X 的广告菜单）────────────────────────────────── */

/** 我不喜欢这个广告：从信息流移除并反馈 */
export function dislikeAd() {
  notInterestedSilently()
  closeSheets()
  toast('已收到反馈，会减少此类广告')
}

/** 为什么我会看到这个广告：弹说明框 */
export function whyThisAd() {
  const p = app.morePost
  if (!p) return
  closeSheets()
  showDialog(
    '为什么我会看到这个广告？',
    `根据你的浏览与互动，Taso 向你展示来自 ${p.author} 的这条广告。你可以随时在「设置 · 通知与推荐」中调整广告偏好。`,
    undefined,
    '知道了',
  )
}

/** 隐藏广告主：其全部帖子从信息流移除 */
export function muteAdAuthor() {
  const author = app.morePost?.author
  if (!author) return
  app.foryou = app.foryou.filter(p => p.author !== author)
  app.following = app.following.filter(p => p.author !== author)
  closeSheets()
  toast(`已隐藏 ${author} 的广告`)
}

/** 屏蔽广告主：弹确认框，确认后全量移除 */
export function blockAdAuthor() {
  const author = app.morePost?.author
  if (!author) return
  closeSheets()
  showDialog('屏蔽广告主', `屏蔽后你将不再看到 ${author} 发布的广告与内容，确认继续吗？`, () => {
    app.foryou = app.foryou.filter(p => p.author !== author)
    app.following = app.following.filter(p => p.author !== author)
    toast(`已屏蔽 ${author}`)
  }, '屏蔽')
}

/** 举报广告 */
export function reportAd() {
  const p = app.morePost
  if (!p) return
  closeSheets()
  showDialog('举报广告', `确认举报 ${p.author} 投放的这条广告吗？提交后我们会尽快审核处理。`, () => toast('已收到举报，感谢反馈'), '举报')
}

/** 从两条信息流移除当前操作的帖子（不动弹层、不提示） */
function notInterestedSilently() {
  const id = app.morePost?.id
  if (id != null) {
    app.foryou = app.foryou.filter(p => p.id !== id)
    app.following = app.following.filter(p => p.id !== id)
  }
}

export function closeSheets() {
  app.sheet = ''
}

export function showDialog(title: string, text: string, onOk?: () => void, okText?: string) {
  app.dialog = { title, text, onOk, okText }
}

export function closeDialog() {
  app.dialog = null
}

export function dialogOk() {
  const req = app.dialog
  app.dialog = null
  req?.onOk?.()
}

/** 启动逻辑：已登录恢复上次屏幕；回头客（已登出）直接进登录页；新用户进欢迎页 */
export function bootstrap() {
  if (app.auth.user?.session) {
    const saved = localStorage.getItem('taso-screen') as ScreenId | null
    const ok = saved && !NO_RESTORE.includes(saved)
    app.stack = [ok ? saved : 'home']
    show(app.stack[0], false)
  } else if (app.visited) {
    setTimeout(() => {
      if (app.stack[app.stack.length - 1] === 'splash') show('login')
    }, 1200)
  } else {
    setTimeout(() => {
      if (app.stack[app.stack.length - 1] === 'splash') show('welcome')
    }, 1500)
  }
}

/* ── 好友与消息（PRD §73）────────────────────────────────────────── */

function loadSocial(): Social {
  try {
    const raw = localStorage.getItem('taso-social')
    if (raw) {
      const s = JSON.parse(raw) as Social
      if (Array.isArray(s.friends) && Array.isArray(s.reqIn) && Array.isArray(s.reqOut) && Array.isArray(s.convs)) return s
    }
  } catch { /* 损坏时回退种子数据 */ }
  return JSON.parse(JSON.stringify(SOCIAL_SEED))
}

let msgSeq = 0
for (const c of app.social.convs) for (const m of c.msgs) if (m.id > msgSeq) msgSeq = m.id

export function persistSocial() {
  localStorage.setItem('taso-social', JSON.stringify(app.social))
}

const now = () => new Date().toTimeString().slice(0, 5)

export function isFriend(id: string) {
  return app.social.friends.includes(id)
}

/** 申请三态：none 可申请 / out 已发出待通过 / friend 已是好友 */
export function reqState(id: string): 'none' | 'out' | 'friend' {
  if (isFriend(id)) return 'friend'
  if (app.social.reqOut.includes(id)) return 'out'
  return 'none'
}

export function sendReq(id: string) {
  if (reqState(id) !== 'none' || !MEMBERS[id]) return
  app.social.reqOut.push(id)
  persistSocial()
  toast(`已向 ${MEMBERS[id].nick} 发送好友申请`)
}

export function revokeReq(id: string) {
  app.social.reqOut = app.social.reqOut.filter(x => x !== id)
  persistSocial()
  toast('已撤回好友申请')
}

export function acceptReq(reqId: number) {
  const r = app.social.reqIn.find(x => x.id === reqId)
  if (!r) return
  app.social.reqIn = app.social.reqIn.filter(x => x.id !== reqId)
  app.social.friends.push(r.member)
  app.social.convs.unshift({
    id: r.member,
    unread: 1,
    msgs: [{ id: ++msgSeq, mine: false, text: `嗨，我是 ${MEMBERS[r.member].nick}，很高兴认识你 👋`, time: now(), day: '今天' }],
  })
  persistSocial()
  toast(`你和 ${MEMBERS[r.member].nick} 已经成为好友`)
}

export function rejectReq(reqId: number) {
  const r = app.social.reqIn.find(x => x.id === reqId)
  if (!r) return
  app.social.reqIn = app.social.reqIn.filter(x => x.id !== reqId)
  persistSocial()
  toast('已拒绝该好友申请')
}

function ensureConv(id: string) {
  let c = app.social.convs.find(x => x.id === id)
  if (!c) {
    c = { id, msgs: [], unread: 0 }
    app.social.convs.unshift(c)
  }
  return c
}

function bump(c: { id: string }) {
  const i = app.social.convs.findIndex(x => x.id === c.id)
  if (i > 0) {
    const [hit] = app.social.convs.splice(i, 1)
    app.social.convs.unshift(hit)
  }
}

export function openChat(id: string) {
  if (!MEMBERS[id]) return
  const c = ensureConv(id)
  c.unread = 0
  app.chatWith = id
  persistSocial()
  show('chat')
}

const GENERIC_REPLIES = ['好的 👌', '收到！', '哈哈哈', '同意 +1', '看看周末有没有空']

export function sendMsg(text: string) {
  const id = app.chatWith
  const t = text.trim()
  if (!id || !t) return
  const c = ensureConv(id)
  c.msgs.push({ id: ++msgSeq, mine: true, text: t, time: now(), day: '今天' })
  bump(c)
  persistSocial()
  scheduleReply(id)
}

/** 演示态：1–2.5 秒后本地模拟对方回复并回执“已读”（§73.16） */
function scheduleReply(id: string) {
  setTimeout(() => {
    const c = app.social.convs.find(x => x.id === id)
    if (!c || !MEMBERS[id]) return
    const pool = REPLIES[id] ?? GENERIC_REPLIES
    const text = pool[Math.floor(Math.random() * pool.length)]
    for (const m of c.msgs) if (m.mine) m.read = true
    c.msgs.push({ id: ++msgSeq, mine: false, text, time: now(), day: '今天' })
    bump(c)
    if (app.screen === 'chat' && app.chatWith === id) {
      c.unread = 0
    } else {
      c.unread++
      toast(`${MEMBERS[id].nick}：${text}`)
    }
    persistSocial()
  }, 1100 + Math.random() * 1400)
}

/* ── 注册与登录动作（AUTH PRD §2 统一“继续使用 TASO”）────────────── */

export function persistAuth() {
  if (app.auth.user) localStorage.setItem('taso-auth', JSON.stringify(app.auth.user))
  else localStorage.removeItem('taso-auth')
}

export function maskEmail(email: string) {
  const [name, domain] = email.split('@')
  if (!domain) return email
  const head = name.slice(0, 1)
  const tail = name.length > 1 ? name.slice(-1) : ''
  return `${head}${'*'.repeat(Math.max(name.length - 2, 1))}${tail}@${domain}`
}

export function maskPhone(cc: string, phone: string) {
  const p = phone.replace(/\s+/g, '')
  return `${cc} ${p.slice(0, 4)}****${p.slice(-2)}`
}

/** 从栈中移除若干屏幕后回到栈顶（用于“授权中 / OTP”等中转屏出栈） */
function dropScreens(ids: ScreenId[], next?: ScreenId) {
  app.stack = app.stack.filter(s => !ids.includes(s))
  show(next ?? app.stack[app.stack.length - 1], !!next)
}

/** 点击第三方按钮 → 进入授权页（AUTH-007） */
export function oauthBegin(p: Exclude<Provider, 'email' | 'phone'>) {
  app.auth.oauth = p
  app.auth.pending = null
  show('auth-oauth')
}

/**
 * 授权页返回：取消按 PRD §26「登录未完成」回登录页；
 * 同意则查询 provider + provider_user_id：已存在 → 登录；不存在 → 新建账号流程
 */
export function finishOauth(ok: boolean) {
  const p = app.auth.oauth
  app.auth.oauth = null
  if (!p) return
  if (!ok) {
    dropScreens(['auth-oauth'])
    toast('登录未完成')
    return
  }
  const info = OAUTH_INFO[p]
  dropScreens(['auth-oauth'])
  resolveIdentity({ provider: p, key: info.key, label: info.account })
}

/** Email / 手机号 OTP 验证通过后同样走身份归并（AUTH PRD §5.4 统一“继续”流程） */
function resolveIdentity(id: { provider: Provider; key: string; label: string }) {
  const hit = app.auth.user?.identities.some(i => i.provider === id.provider && i.key === id.key)
  if (hit && app.auth.user) {
    loginAs(app.auth.user)
  } else {
    app.auth.pending = id
    show('auth-nickname')
  }
}

function loginAs(user: AuthUser) {
  user.session = true
  persistAuth()
  app.auth.pending = null
  localStorage.setItem('taso-visited', '1')
  app.visited = true
  show('home')
  toast(`欢迎回来，${user.nickname}`)
}

/** 发送 OTP（AUTH-003/005 → AUTH-004/006）。演示码固定 123456 */
export function sendOtp(dest: { provider: 'email' | 'phone'; key: string; label: string }) {
  app.auth.otpKey = dest.key
  app.auth.otpTo = dest.label
  app.auth.pending = null
  show('auth-otp')
  toast('验证码已发送 · 演示码 123456')
}

export function verifyOtp(code: string): boolean {
  if (code !== '123456') return false
  const provider = app.auth.otpKey.includes('@') ? 'email' : 'phone'
  resolveIdentity({ provider, key: app.auth.otpKey, label: app.auth.otpTo })
  return true
}

/** OTP 连续错误：进入登录异常页（AUTH-010）并清理中转屏 */
export function otpLocked() {
  dropScreens(['auth-entry', 'auth-otp'], 'auth-error')
}

/** 新用户完成昵称 → 创建 TASO User（自动检测语言/时区，AUTH PRD §6） */
export function completeSignup(nickname: string) {
  const p = app.auth.pending
  if (!p) return
  const detectedTz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Hong_Kong'
  app.auth.user = {
    id: String(Math.floor(10000000 + Math.random() * 89999999)),
    nickname,
    countryCode: 'HK',
    language: navigator.language || 'zh-CN',
    timezone: detectedTz,
    createdAt: new Date().toISOString().slice(0, 10),
    session: true,
    role: 'member', // 注册即会员,股东需后台审核(V1.6)
    identities: [{ ...p, boundAt: new Date().toISOString().slice(0, 10) }],
  }
  persistAuth()
  app.auth.pending = null
  dropScreens(['auth-nickname', 'auth-entry', 'auth-otp'], 'interests')
  toast(`欢迎来到 TASO，${nickname}`)
}

/** 已登录状态下绑定新登录方式（AUTH-015，演示态：即时成功） */
export function bindProvider(p: Provider) {
  const user = app.auth.user
  if (!user || user.identities.some(i => i.provider === p)) return
  const identity: AuthIdentity =
    p === 'email' ? { provider: 'email', key: 'demo@taso.app', label: 'demo@taso.app', boundAt: new Date().toISOString().slice(0, 10) }
    : p === 'phone' ? { provider: 'phone', key: '+852 9000 0000', label: '+852 9000****00', boundAt: new Date().toISOString().slice(0, 10) }
    : { provider: p, key: OAUTH_INFO[p].key, label: OAUTH_INFO[p].account, boundAt: new Date().toISOString().slice(0, 10) }
  user.identities.push(identity)
  persistAuth()
  toast(`已绑定${PROVIDER_NAME[p]}，现在可以用它登录 TASO`)
}

/** 不允许解绑最后一个登录方式（AUTH PRD §14.1） */
export function unbindProvider(p: Provider) {
  const user = app.auth.user
  if (!user) return
  if (user.identities.length <= 1) {
    showDialog('暂时无法解绑', '这是你唯一的登录方式。请先绑定 Apple、Google、X、邮箱或手机号，再进行解绑。')
    return
  }
  user.identities = user.identities.filter(i => i.provider !== p)
  persistAuth()
  toast(`已解绑${PROVIDER_NAME[p]}`)
}

/** 退出登录：撤销 session，账号与绑定关系保留（AUTH PRD §15） */
export function logout() {
  if (app.auth.user) {
    app.auth.user.session = false
    persistAuth()
  }
  app.auth.pending = null
  app.stack = ['login']
  show('login', false)
  toast('已退出登录')
}

/** 演示:点击「我的」页账号级别标记,在股东 / 会员间切换(真实环境股东由后台审核开通) */
export function toggleRole() {
  const user = app.auth.user
  if (!user) {
    toast('请先登录后再切换账号级别')
    return
  }
  user.role = user.role === 'shareholder' ? 'member' : 'shareholder'
  persistAuth()
  toast(user.role === 'shareholder' ? '已切换为股东账号(演示)' : '已切换为会员账号(演示)')
}

/** 删除账号（AUTH-016/017）：清空全部本地状态，回到首次启动 */
export function deleteAccount() {
  for (const k of ['taso-auth', 'taso-visited', 'taso-screen', 'taso-social', 'taso-bal', 'taso-wd', 'taso-follows', 'taso-card']) {
    localStorage.removeItem(k)
  }
  app.auth.user = null
  app.auth.pending = null
  app.visited = false
  app.bal = 12580
  app.wd = 800
  app.follows = []
  app.morePost = null
  resetCard()
  app.social = JSON.parse(JSON.stringify(SOCIAL_SEED))
  app.stack = ['splash']
  show('splash', false)
  setTimeout(() => {
    if (app.screen === 'splash') show('welcome')
  }, 1500)
  toast('账号已删除')
}

export const PROVIDER_NAME: Record<Provider, string> = {
  apple: 'Apple', google: 'Google', x: 'X', email: '邮箱', phone: '手机号',
}
