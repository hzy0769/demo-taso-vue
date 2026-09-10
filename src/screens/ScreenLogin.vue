<script setup lang="ts">
import { ref } from 'vue'
import { app, oauthBegin, show, showDialog } from '../store'

/** AUTH-002 注册登录首页：注册与登录统一为「继续使用 TASO」（AUTH PRD §2.1） */
const busy = ref<'' | 'apple' | 'google' | 'x'>('')

function go(p: 'apple' | 'google' | 'x') {
  if (busy.value) return
  busy.value = p
  setTimeout(() => {
    busy.value = ''
    oauthBegin(p)
  }, 450)
}

function legal() {
  showDialog('服务条款与隐私政策', '正式版将按当前界面语言打开对应版本的《服务条款》与《隐私政策》。当前为原型演示占位。')
}

function langSheet() {
  showDialog('界面语言 / Language', '初始语言自动适配设备语言，也可在「设置 · 语言与地区」中独立修改（与所在地区解耦）。\n\nSupports: English · 简体中文 · 繁體中文 · 日本語 · 한국어')
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'login' }" data-screen="login">
    <div style="min-height:100%;display:flex;flex-direction:column;padding:56px 4px 10px">
      <div style="text-align:center">
        <div style="font-family:var(--font-mono);font-weight:700;letter-spacing:.22em;font-size:34px">TASO</div>
        <p class="meta" style="margin-top:8px">Discover · Share · Travel</p>
      </div>

      <div style="flex:1"></div>

      <div class="stack">
        <button class="oauth-btn apple" :disabled="!!busy" @click="go('apple')">
          <span v-if="busy === 'apple'" class="spin"></span>
          <svg v-else class="logo"><use href="#logo-apple"/></svg>
          <span>Continue with Apple</span>
        </button>
        <button class="oauth-btn google" :disabled="!!busy" @click="go('google')">
          <span v-if="busy === 'google'" class="spin"></span>
          <svg v-else class="logo"><use href="#logo-google"/></svg>
          <span>Continue with Google</span>
        </button>
        <button class="oauth-btn x" :disabled="!!busy" @click="go('x')">
          <span v-if="busy === 'x'" class="spin"></span>
          <svg v-else class="logo"><use href="#logo-x"/></svg>
          <span>Continue with X</span>
        </button>
      </div>

      <div class="row" style="margin:18px 0 4px">
        <hr style="flex:1;border:0;border-top:1px solid var(--border)" />
        <span class="meta" style="padding:0 10px">or</span>
        <hr style="flex:1;border:0;border-top:1px solid var(--border)" />
      </div>
      <button style="min-height:44px;font-weight:600;font-size:15px" @click="show('auth-entry')">
        Continue with email or phone
      </button>

      <p style="margin-top:18px;font-size:11.5px;color:var(--muted);text-align:center;line-height:1.7">
        By continuing, you agree to Taso's
        <button class="lnk" @click="legal">Terms of Service</button> and
        <button class="lnk" @click="legal">Privacy Policy</button>.
      </p>

      <div style="display:flex;justify-content:center;margin-top:14px">
        <button class="tag" style="min-height:34px;gap:6px;font-size:12px" @click="langSheet">
          <svg class="ic sm"><use href="#i-globe"/></svg>
          <span>English</span>
        </button>
      </div>
    </div>
  </section>
</template>
