<script setup lang="ts">
import { app, show, showDialog } from '../store'

/** AUTH-010 登录异常：统一错误页，优先给出可执行动作（AUTH PRD §16.3 / §28.3） */
function retry() {
  app.stack = app.stack.filter(s => s !== 'auth-error')
  show(app.stack[app.stack.length - 1] ?? 'login', false)
}

function help() {
  showDialog(
    "Can't sign in?",
    '正式版：输入你曾使用的邮箱或手机号，系统会提示可能存在的登录方式（不会泄露该账号是否已注册）。当前为演示占位。',
  )
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'auth-error' }" data-screen="auth-error">
    <div style="min-height:100%;display:flex;flex-direction:column;justify-content:center;padding:0 6px">
      <div style="text-align:center">
        <span style="display:inline-grid;place-items:center;width:64px;height:64px;border-radius:50%;background:var(--danger-soft);color:var(--danger)">
          <svg class="ic" style="width:30px;height:30px"><use href="#i-alert"/></svg>
        </span>
        <h1 style="font-size:22px;font-weight:700;letter-spacing:-.02em;margin-top:18px">Sign-in didn't complete</h1>
        <p class="meta" style="margin-top:8px;font-size:13px;line-height:1.8">
          The authorization was cancelled, or too many incorrect<br />verification codes were entered. Please try again.
        </p>
      </div>
      <button class="btn btn-p" style="margin-top:28px" @click="retry">Try again</button>
      <div style="text-align:center;margin-top:14px">
        <button class="lnk" style="font-size:13px" @click="help">Can't sign in?</button>
      </div>
    </div>
  </section>
</template>
