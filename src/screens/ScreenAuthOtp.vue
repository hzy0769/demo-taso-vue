<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { app, otpLocked, toast, verifyOtp } from '../store'
import { t } from '../i18n'
import PageHeader from '../components/PageHeader.vue'

/** AUTH-004/006 邮箱 / 手机 OTP:6 位输入 + 倒计时重发;连续错误 3 次进入登录异常页 */
const N = 6
const digits = ref<string[]>(Array(N).fill(''))
const boxes = ref<HTMLInputElement[]>([])
const err = ref('')
const shakeOn = ref(false)
const fails = ref(0)
const checking = ref(false)
const sec = ref(0)

let ticker: ReturnType<typeof setInterval> | null = null

const code = computed(() => digits.value.join(''))
const digitsLeft = computed(() => N - code.value.length)

function startCountdown() {
  sec.value = 60
  if (ticker) clearInterval(ticker)
  ticker = setInterval(() => {
    sec.value--
    if (sec.value <= 0 && ticker) {
      clearInterval(ticker)
      ticker = null
      sec.value = 0
    }
  }, 1000)
}

onMounted(() => {
  startCountdown()
  boxes.value[0]?.focus()
})

onBeforeUnmount(() => {
  if (ticker) clearInterval(ticker)
})

function shake() {
  shakeOn.value = false
  requestAnimationFrame(() => {
    shakeOn.value = true
    setTimeout(() => (shakeOn.value = false), 350)
  })
}

function focus(i: number) {
  boxes.value[Math.max(0, Math.min(i, N - 1))]?.focus()
}

function onInput(i: number, e: Event) {
  const v = (e.target as HTMLInputElement).value.replace(/\D/g, '')
  digits.value[i] = v.slice(-1)
  ;(e.target as HTMLInputElement).value = digits.value[i]
  if (v && i < N - 1) focus(i + 1)
  err.value = ''
  if (code.value.length === N) submit()
}

function onKey(i: number, e: KeyboardEvent) {
  if (e.key === 'Backspace' && !digits.value[i] && i > 0) {
    focus(i - 1)
    setTimeout(() => focus(i - 1))
  }
}

function onPaste(e: ClipboardEvent) {
  const text = e.clipboardData?.getData('text').replace(/\D/g, '').slice(0, N) ?? ''
  if (!text) return
  e.preventDefault()
  const arr = Array(N).fill('')
  for (let i = 0; i < text.length; i++) arr[i] = text[i]
  digits.value = arr
  arr.forEach((d, i) => {
    if (boxes.value[i]) boxes.value[i].value = d
  })
  err.value = ''
  if (text.length === N) {
    focus(N - 1)
    submit()
  } else {
    focus(text.length)
  }
}

function submit() {
  if (checking.value) return
  if (code.value.length < N) {
    err.value = t('auth.otp.errEnter')
    return
  }
  checking.value = true
  // 模拟服务端校验耗时
  setTimeout(() => {
    checking.value = false
    if (verifyOtp(code.value)) return // 成功:由 store 负责跳转
    fails.value++
    if (fails.value >= 3) {
      otpLocked()
      return
    }
    err.value = t('auth.otp.errIncorrect', { n: 3 - fails.value })
    shake()
    digits.value = Array(N).fill('')
    boxes.value.forEach(b => (b.value = ''))
    focus(0)
  }, 500)
}

function resend() {
  if (sec.value > 0) return
  startCountdown()
  toast(t('auth.otp.resent'))
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'auth-otp' }" data-screen="auth-otp">
    <PageHeader :title="t('auth.otp.title')" />
    <h1 style="font-size:24px;font-weight:700;letter-spacing:-.02em;margin-top:8px">{{ t('auth.otp.heading') }}</h1>
    <p class="meta" style="margin-top:6px;font-size:12.5px">
      {{ t('auth.otp.sub') }} <b style="color:var(--fg)">{{ app.auth.otpTo }}</b>
    </p>
    <div style="margin-top:10px"><span class="badge soft">{{ t('auth.otp.demoBadge') }}</span></div>

    <div class="otp-row" :class="{ shake: shakeOn }" style="margin-top:24px">
      <input
        v-for="(d, i) in digits"
        :key="i"
        :ref="el => { if (el) boxes[i] = el as HTMLInputElement }"
        class="otp-box"
        :class="{ filled: !!d, err: !!err }"
        :value="d"
        inputmode="numeric"
        maxlength="2"
        @input="onInput(i, $event)"
        @keydown="onKey(i, $event)"
        @paste="onPaste"
      />
    </div>

    <div class="row" style="margin-top:14px;justify-content:center;min-height:20px">
      <span v-if="checking" class="spin" style="width:16px;height:16px;border-width:1.5px"></span>
      <p v-else-if="err" class="danger" style="font-size:12.5px">{{ err }}</p>
      <p v-else class="meta" style="font-size:12px">{{ t('auth.otp.digitsLeft', { n: digitsLeft }) }}</p>
    </div>

    <button class="btn btn-p" style="margin-top:18px" :disabled="checking || code.length < N" @click="submit">
      {{ t('auth.otp.verify') }}
    </button>

    <div style="text-align:center;margin-top:16px">
      <button
        class="meta"
        :style="{ color: sec > 0 ? 'var(--muted)' : 'var(--fg)', fontWeight: 600, fontSize: '13px' }"
        :disabled="sec > 0"
        @click="resend"
      >{{ sec > 0 ? t('auth.otp.resendIn', { sec }) : t('auth.otp.resend') }}</button>
    </div>
  </section>
</template>
