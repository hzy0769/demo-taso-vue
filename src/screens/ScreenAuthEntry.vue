<script setup lang="ts">
import { computed, ref } from 'vue'
import { app, maskEmail, maskPhone, sendOtp } from '../store'
import PageHeader from '../components/PageHeader.vue'

/** AUTH-003/005 邮箱 / 手机号输入：统一的「继续」流程，注册登录不区分（AUTH PRD §5.4） */
const mode = ref<'email' | 'phone'>('email')
const email = ref('')
const cc = ref('+852')
const phone = ref('')
const err = ref('')

const CCS = ['+852', '+81', '+82', '+65', '+66', '+1', '+44']
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const title = computed(() => (mode.value === 'email' ? "What's your email?" : "What's your phone number?"))
const canGo = computed(() =>
  mode.value === 'email' ? email.value.trim().length > 3 : phone.value.replace(/\D/g, '').length >= 7,
)

function go() {
  if (mode.value === 'email') {
    const e = email.value.trim()
    if (!EMAIL_RE.test(e)) {
      err.value = 'Please enter a valid email address.'
      return
    }
    err.value = ''
    sendOtp({ provider: 'email', key: e.toLowerCase(), label: maskEmail(e) })
  } else {
    const digits = phone.value.replace(/\D/g, '')
    if (digits.length < 7) {
      err.value = 'Please enter a valid phone number.'
      return
    }
    err.value = ''
    // E.164 存储（AUTH PRD §11.2），区号按地区预选但可修改
    sendOtp({ provider: 'phone', key: `${cc.value}${digits}`, label: maskPhone(cc.value, digits) })
  }
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'auth-entry' }" data-screen="auth-entry">
    <PageHeader title="Sign in" />
    <h1 style="font-size:24px;font-weight:700;letter-spacing:-.02em;margin-top:8px">{{ title }}</h1>
    <p class="meta" style="margin-top:6px;font-size:12.5px;line-height:1.7">
      We'll text you a verification code. Existing member? You're signing in.<br />New here? We'll create your account automatically.
    </p>

    <div class="seg" style="margin-top:18px">
      <button :class="{ on: mode === 'email' }" @click="mode = 'email'">Email</button>
      <button :class="{ on: mode === 'phone' }" @click="mode = 'phone'">Phone</button>
    </div>

    <div class="field" style="margin-top:16px">
      <label>{{ mode === 'email' ? 'Email address' : 'Phone number' }}</label>
      <input
        v-if="mode === 'email'"
        v-model="email"
        class="input"
        type="email"
        inputmode="email"
        placeholder="you@example.com"
        @keyup.enter="go"
      />
      <div v-else class="row">
        <select v-model="cc" class="input num" style="width:92px;flex:none">
          <option v-for="c in CCS" :key="c" :value="c">{{ c }}</option>
        </select>
        <input v-model="phone" class="input num" inputmode="tel" placeholder="9123 4567" @keyup.enter="go" />
      </div>
      <p v-if="err" class="danger" style="font-size:12.5px;margin-top:8px">{{ err }}</p>
    </div>

    <button class="btn btn-p" style="margin-top:20px" :disabled="!canGo" @click="go">Continue</button>
    <p class="meta" style="margin-top:16px;font-size:11.5px;line-height:1.7;text-align:center">
      This phone number / email will only be used for sign-in verification.<br />Taso won't request contacts, photos or precise location during sign-in.
    </p>
  </section>
</template>
