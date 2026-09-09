<script setup lang="ts">
import { computed, ref } from 'vue'
import { app, show, toast } from '../store'
import PageHeader from '../components/PageHeader.vue'

const phone = ref('')
const otp = ref('')
const otpSec = ref(0)
let otpTimer: ReturnType<typeof setInterval> | null = null

const loginDisabled = computed(() => !(phone.value.trim().length >= 8 && otp.value.trim().length >= 4))
const otpText = computed(() => (otpSec.value > 0 ? `${otpSec.value}s 后重发` : '获取验证码'))

function sendOtp() {
  if (otpTimer) return
  otpSec.value = 60
  otpTimer = setInterval(() => {
    otpSec.value--
    if (otpSec.value <= 0) {
      clearInterval(otpTimer!)
      otpTimer = null
      otpSec.value = 0
    }
  }, 1000)
  toast('验证码已发送（演示：任意 6 位数字）')
}

function login() {
  localStorage.setItem('taso-visited', '1')
  app.visited = true
  show('home')
  toast('欢迎回来，Alex')
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'login' }" data-screen="login">
    <PageHeader title="登录 / 注册" />
    <div style="text-align:center;margin:18px 0 22px">
      <div style="font-family:var(--font-mono);font-weight:700;letter-spacing:.22em;font-size:26px">TASO</div>
      <p class="meta" style="margin-top:4px">发现真实的世界</p>
    </div>
    <div class="field">
      <label>手机号</label>
      <div class="row">
        <span class="input num" style="width:76px;flex:none">+852</span>
        <input v-model="phone" class="input num" inputmode="tel" placeholder="9123 4567" />
      </div>
    </div>
    <button class="btn btn-o" style="margin-top:12px" :disabled="otpSec > 0" @click="sendOtp">{{ otpText }}</button>
    <div class="field" style="margin-top:12px">
      <input v-model="otp" class="input num" inputmode="numeric" placeholder="6 位验证码" />
    </div>
    <button class="btn btn-p" style="margin-top:20px" :disabled="loginDisabled" @click="login">登录</button>
    <div class="row" style="margin:20px 0">
      <hr style="flex:1;border:0;border-top:1px solid var(--border)" /><span class="meta">或</span><hr style="flex:1;border:0;border-top:1px solid var(--border)" />
    </div>
    <div class="stack">
      <button class="btn btn-o" @click="toast('第三方登录为演示占位')">继续使用 Apple</button>
      <button class="btn btn-o" @click="toast('第三方登录为演示占位')">继续使用 Google</button>
    </div>
    <p class="meta" style="margin-top:22px">登录即表示同意《用户协议》与《隐私政策》。支付、储值与数字资产功能仅在合规地区按实际牌照开放。</p>
  </section>
</template>
