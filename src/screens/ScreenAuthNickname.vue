<script setup lang="ts">
import { computed, ref } from 'vue'
import { app, completeSignup, providerName } from '../store'
import { t } from '../i18n'
import PageHeader from '../components/PageHeader.vue'

/** AUTH-008 新用户昵称:最短 Onboarding,仅收集昵称(AUTH PRD §12.3) */
const nick = ref('')
const err = ref('')
const MAX = 30

const len = computed(() => [...nick.value.trim()].length)
const via = computed(() => app.auth.pending?.provider)

function submit() {
  const s = nick.value.trim()
  const n = [...s].length
  if (!n) {
    err.value = t('auth.nick.errRequired')
    return
  }
  if (n < 2) {
    err.value = t('auth.nick.errShort')
    return
  }
  if (n > MAX) {
    err.value = t('auth.nick.errLong', { max: MAX })
    return
  }
  // 过滤控制字符 / 不可见字符(AUTH PRD §12.3)
  if (/[\u0000-\u001F\u007F\u200B-\u200D\uFEFF]/.test(s)) {
    err.value = t('auth.nick.errChars')
    return
  }
  err.value = ''
  completeSignup(s)
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'auth-nickname' }" data-screen="auth-nickname">
    <PageHeader title="TASO" />
    <div v-if="via" style="margin-top:6px"><span class="badge soft">{{ t('auth.nick.via', { provider: providerName(via) }) }}</span></div>
    <h1 style="font-size:24px;font-weight:700;letter-spacing:-.02em;margin-top:12px">{{ t('auth.nick.heading') }}</h1>
    <p class="meta" style="margin-top:6px;font-size:12.5px">{{ t('auth.nick.q') }}</p>

    <div class="field" style="margin-top:22px">
      <label>{{ t('auth.nick.label') }}</label>
      <div class="row">
        <input
          v-model="nick"
          class="input"
          placeholder="Zack"
          maxlength="40"
          @keyup.enter="submit"
        />
        <span class="meta" style="flex:none">{{ len }}/{{ MAX }}</span>
      </div>
      <p v-if="err" class="danger" style="font-size:12.5px;margin-top:8px">{{ err }}</p>
      <p v-else class="meta" style="font-size:11.5px;margin-top:8px">{{ t('auth.nick.hint') }}</p>
    </div>

    <button class="btn btn-p" style="margin-top:24px" @click="submit">{{ t('auth.nick.start') }}</button>
    <p class="meta" style="margin-top:16px;font-size:11.5px;line-height:1.7;text-align:center">{{ t('auth.nick.note') }}</p>
  </section>
</template>
