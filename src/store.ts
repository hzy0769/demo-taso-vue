import { nextTick, reactive } from 'vue'
import { foryouSeed, followingPosts, MEMBERS, REPLIES, SOCIAL_SEED, type Post, type Social } from './data'

export type ScreenId =
  | 'splash' | 'welcome' | 'login' | 'interests'
  | 'home' | 'post' | 'profile' | 'discover' | 'search'
  | 'merchant' | 'place'
  | 'benefits' | 'card-apply' | 'card-detail' | 'topup' | 'wallet'
  | 'transactions' | 'reimburse' | 'reimburse-detail' | 'withdraw'
  | 'referral' | 'creator'
  | 'me' | 'settings' | 'language' | 'security' | 'kyc' | 'notifications'
  | 'friends' | 'messages' | 'chat' | 'my-qrcode'

/** 底部 Tab 对应的根屏幕 */
export const ROOTS: ScreenId[] = ['home', 'discover', 'benefits', 'me']

/** 引导流程屏幕：已访问用户恢复时不允许落在这些屏幕上 */
const ONBOARDING: ScreenId[] = ['splash', 'welcome', 'login', 'interests']

/** 另外不可恢复的屏幕：chat 依赖内存中的 chatWith，重启后回退首页 */
const NO_RESTORE: ScreenId[] = [...ONBOARDING, 'chat']

interface DialogReq {
  title: string
  text: string
  onOk?: () => void
}

/** 好友页共享 Tab 状态（消息中心横幅可直达「请求」Tab） */
export type FriendsTab = '好友' | '请求' | '推荐'

export const app = reactive({
  stack: ['splash'] as ScreenId[],
  screen: 'splash' as ScreenId,
  bal: 12580,
  wd: 800,
  visited: localStorage.getItem('taso-visited') === '1',
  toast: '',
  toastOn: false,
  sheet: '' as '' | 'composer' | 'comments' | 'add-friend',
  dialog: null as DialogReq | null,
  /** 首页 For You 数据（发布成功后向头部插入新帖） */
  foryou: [...foryouSeed] as Post[],
  following: followingPosts,
  /** 好友与消息（PRD §73） */
  social: loadSocial(),
  chatWith: '',
  friendsTab: '好友' as FriendsTab,
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

export function closeSheets() {
  app.sheet = ''
}

export function showDialog(title: string, text: string, onOk?: () => void) {
  app.dialog = { title, text, onOk }
}

export function closeDialog() {
  app.dialog = null
}

export function dialogOk() {
  const req = app.dialog
  app.dialog = null
  req?.onOk?.()
}

/** 启动逻辑：已访问用户恢复上次屏幕，否则 1.5s 后进入欢迎页 */
export function bootstrap() {
  if (app.visited) {
    const saved = localStorage.getItem('taso-screen') as ScreenId | null
    const ok = saved && !NO_RESTORE.includes(saved)
    app.stack = [ok ? saved : 'home']
    show(app.stack[0], false)
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
