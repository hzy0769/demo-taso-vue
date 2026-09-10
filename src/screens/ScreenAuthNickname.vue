<script setup lang="ts">
import { computed, ref } from 'vue'
import { app, completeSignup } from '../store'
import PageHeader from '../components/PageHeader.vue'

/** AUTH-008 新用户昵称：最短 Onboarding，仅收集昵称（AUTH PRD §12.3） */
const nick = ref('')
const err = ref('')
const MAX = 30

const len = computed(() => [...nick.value.trim()].length)
const via = computed(() => app.auth.pending?.provider)

const VIA_LABEL: Record<string, string> = {
  apple: 'Apple', google: 'Google', x: 'X', email: '邮箱', phone: '手机号',
}

function submit() {
  const s = nick.value.trim()
  const n = [...s].length
  if (!n) {
    err.value = 'Please enter a nickname.'
    return
  }
  if (n < 2) {
    err.value = 'Nickname must be at least 2 characters.'
    return
  }
  if (n > MAX) {
    err.value = `Nickname must be ${MAX} characters or fewer.`
    return
  }
  // 过滤控制字符 / 不可见字符（AUTH PRD §12.3）
  if (/[\u0000-\u001F\u007F\u200B-\u200D\uFEFF]/.test(s)) {
    err.value = 'Nickname contains unsupported characters.'
    return
  }
  err.value = ''
  completeSignup(s)
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'auth-nickname' }" data-screen="auth-nickname">
    <PageHeader title="Welcome" />
    <div v-if="via" style="margin-top:6px"><span class="badge soft">已通过{{ VIA_LABEL[via] }}验证 · 账号即将创建</span></div>
    <h1 style="font-size:24px;font-weight:700;letter-spacing:-.02em;margin-top:12px">Welcome to TASO 👋</h1>
    <p class="meta" style="margin-top:6px;font-size:12.5px">What should we call you?</p>

    <div class="field" style="margin-top:22px">
      <label>Nickname</label>
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
      <p v-else class="meta" style="font-size:11.5px;margin-top:8px">2–30 characters. You can change this anytime.</p>
    </div>

    <button class="btn btn-p" style="margin-top:24px" @click="submit">Start exploring</button>
    <p class="meta" style="margin-top:16px;font-size:11.5px;line-height:1.7;text-align:center">
      国家/地区与界面语言已自动检测，可在「设置 · 语言与地区」中独立修改。
    </p>
  </section>
</template>
