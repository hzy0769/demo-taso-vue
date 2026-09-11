<script setup lang="ts">
import { computed, ref } from 'vue'
import { app, maskEmail, maskPhone, sendOtp } from '../store'
import { t, countryName } from '../i18n'
import PageHeader from '../components/PageHeader.vue'

/** AUTH-003/005 邮箱 / 手机号输入:统一的「继续」流程,注册登录不区分(AUTH PRD §5.4) */
const mode = ref<'email' | 'phone'>('email')
const email = ref('')
const cc = ref('+852')
const phone = ref('')
const err = ref('')

/** 区号候选:常用市场,展示对应国家名(区号是拨号事实,不翻译) */
const CCS = ['+852', '+81', '+82', '+65', '+66', '+1', '+44']
const ccCountry = (dial: string) => ({ '+852': 'HK', '+81': 'JP', '+82': 'KR', '+65': 'SG', '+66': 'TH', '+1': 'US', '+44': 'GB' })[dial] ?? ''

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const title = computed(() => t(mode.value === 'email' ? 'auth.entry.emailTitle' : 'auth.entry.phoneTitle'))
const canGo = computed(() =>
  mode.value === 'email' ? email.value.trim().length > 3 : phone.value.replace(/\D/g, '').length >= 7,
)

function go() {
  if (mode.value === 'email') {
    const e = email.value.trim()
    if (!EMAIL_RE.test(e)) {
      err.value = t('auth.entry.errEmail')
      return
    }
    err.value = ''
    sendOtp({ provider: 'email', key: e.toLowerCase(), label: maskEmail(e) })
  } else {
    const digits = phone.value.replace(/\D/g, '')
    if (digits.length < 7) {
      err.value = t('auth.entry.errPhone')
      return
    }
    err.value = ''
    // E.164 存储(AUTH PRD §11.2),区号按地区预选但可修改
    sendOtp({ provider: 'phone', key: `${cc.value}${digits}`, label: maskPhone(cc.value, digits) })
  }
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'auth-entry' }" data-screen="auth-entry">
    <PageHeader :title="t('auth.signIn')" />
    <h1 style="font-size:24px;font-weight:700;letter-spacing:-.02em;margin-top:8px">{{ title }}</h1>
    <p class="meta" style="margin-top:6px;font-size:12.5px;line-height:1.7">{{ t('auth.entry.sub') }}</p>

    <div class="seg" style="margin-top:18px">
      <button :class="{ on: mode === 'email' }" @click="mode = 'email'">{{ t('auth.entry.email') }}</button>
      <button :class="{ on: mode === 'phone' }" @click="mode = 'phone'">{{ t('auth.entry.phone') }}</button>
    </div>

    <div class="field" style="margin-top:16px">
      <label>{{ t(mode === 'email' ? 'auth.entry.email' : 'auth.entry.phone') }}</label>
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
        <select v-model="cc" class="input num" style="width:120px;flex:none">
          <option v-for="c in CCS" :key="c" :value="c">{{ c }} · {{ countryName(ccCountry(c)) }}</option>
        </select>
        <input v-model="phone" class="input num" inputmode="tel" placeholder="9123 4567" @keyup.enter="go" />
      </div>
      <p v-if="err" class="danger" style="font-size:12.5px;margin-top:8px">{{ err }}</p>
    </div>

    <button class="btn btn-p" style="margin-top:20px" :disabled="!canGo" @click="go">{{ t('common.continue') }}</button>
    <p class="meta" style="margin-top:16px;font-size:11.5px;line-height:1.7;text-align:center">{{ t('auth.entry.note') }}</p>
  </section>
</template>
