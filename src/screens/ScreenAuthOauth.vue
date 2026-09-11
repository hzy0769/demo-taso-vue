<script setup lang="ts">
import { computed, ref } from 'vue'
import { app, finishOauth, OAUTH_INFO } from '../store'
import { t } from '../i18n'

/** AUTH-007 第三方授权中:模拟 OAuth 授权页(无真实请求,见 PRD §72.5 演示态边界) */
const p = computed(() => (app.auth.oauth ?? 'google') as 'apple' | 'google' | 'x')
const info = computed(() => OAUTH_INFO[p.value])
const busy = ref(false)

/** 模拟 provider 授权页(按当前 UI 语言呈现,品牌名不翻译) */
const HEAD = computed<Record<'apple' | 'google' | 'x', { title: string; sub: string; wants: string }>>(() => ({
  google: { title: t('auth.oauth.googleTitle'), sub: t('auth.oauth.googleSub'), wants: t('auth.oauth.wantsGoogle') },
  apple: { title: t('auth.oauth.appleTitle'), sub: t('auth.oauth.appleSub'), wants: t('auth.oauth.wantsApple') },
  x: { title: t('auth.oauth.xTitle'), sub: t('auth.oauth.xSub'), wants: t('auth.oauth.wantsX') },
}))

function agree() {
  if (busy.value) return
  busy.value = true
  setTimeout(() => {
    busy.value = false
    finishOauth(true)
  }, 1200)
}
</script>

<template>
  <section class="scr consent" :class="{ on: app.screen === 'auth-oauth' }" data-screen="auth-oauth" style="padding:0">
    <div class="consent-head">
      <svg class="logo" style="width:26px;height:26px"><use :href="'#logo-' + p"/></svg>
      <div>
        <div class="consent-title">{{ HEAD[p].title }}</div>
        <div class="consent-sub">{{ HEAD[p].sub }}</div>
      </div>
    </div>

    <div style="padding:20px 20px 0">
      <div class="card row" style="gap:12px">
        <span class="avatar" style="font-family:var(--font-mono);font-weight:700">T</span>
        <div style="flex:1">
          <b style="font-size:14px">TASO</b>
          <p class="meta">taso.app</p>
        </div>
        <span class="meta" style="text-align:right;max-width:130px">{{ HEAD[p].wants }}</span>
      </div>

      <button class="card row" style="width:100%;text-align:left;gap:12px;margin-top:12px">
        <span class="avatar">A</span>
        <div style="flex:1;min-width:0">
          <b style="font-size:14px">{{ info.name }}</b>
          <p class="meta" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{{ info.account }}</p>
        </div>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>

      <div class="card" style="margin-top:12px;padding:4px 14px">
        <div v-for="perm in info.perms" :key="perm" class="li" style="border:0">
          <span class="li-ic" style="color:var(--ok);background:var(--ok-soft)"><svg class="ic"><use href="#i-check"/></svg></span>
          <span class="li-title" style="font-size:14px;font-weight:400">{{ perm }}</span>
        </div>
      </div>

      <div class="row" style="gap:10px;margin-top:22px">
        <button class="btn btn-o" @click="finishOauth(false)">{{ t('common.cancel') }}</button>
        <button class="btn btn-p" :disabled="busy" @click="agree">
          <span v-if="busy" class="spin"></span>
          <span>{{ busy ? t('auth.oauth.signingIn') : t('common.continue') }}</span>
        </button>
      </div>
    </div>

    <p class="meta" style="text-align:center;margin-top:26px">{{ t('auth.oauth.demoNote') }}</p>
  </section>
</template>
