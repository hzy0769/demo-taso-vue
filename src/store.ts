import { nextTick, reactive } from 'vue'
import { foryouSeed, followingPosts, type Post } from './data'

export type ScreenId =
  | 'splash' | 'welcome' | 'login' | 'interests'
  | 'home' | 'post' | 'profile' | 'discover' | 'search'
  | 'merchant' | 'place'
  | 'benefits' | 'card-apply' | 'card-detail' | 'topup' | 'wallet'
  | 'transactions' | 'reimburse' | 'reimburse-detail' | 'withdraw'
  | 'referral' | 'creator'
  | 'me' | 'settings' | 'language' | 'security' | 'kyc' | 'notifications'

/** 底部 Tab 对应的根屏幕 */
export const ROOTS: ScreenId[] = ['home', 'discover', 'benefits', 'me']

/** 引导流程屏幕：已访问用户恢复时不允许落在这些屏幕上 */
const ONBOARDING: ScreenId[] = ['splash', 'welcome', 'login', 'interests']

interface DialogReq {
  title: string
  text: string
  onOk?: () => void
}

export const app = reactive({
  stack: ['splash'] as ScreenId[],
  screen: 'splash' as ScreenId,
  bal: 12580,
  wd: 800,
  visited: localStorage.getItem('taso-visited') === '1',
  toast: '',
  toastOn: false,
  sheet: '' as '' | 'composer' | 'comments',
  dialog: null as DialogReq | null,
  /** 首页 For You 数据（发布成功后向头部插入新帖） */
  foryou: [...foryouSeed] as Post[],
  following: followingPosts,
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

export function openSheet(name: 'composer' | 'comments') {
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
    const ok = saved && !ONBOARDING.includes(saved)
    app.stack = [ok ? saved : 'home']
    show(app.stack[0], false)
  } else {
    setTimeout(() => {
      if (app.stack[app.stack.length - 1] === 'splash') show('welcome')
    }, 1500)
  }
}
