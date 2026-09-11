<script setup lang="ts">
import { computed } from 'vue'
import { app, deleteAccount, showDialog } from '../store'
import { t } from '../i18n'
import PageHeader from '../components/PageHeader.vue'

/** AUTH-016/017 删除账号:风险提示 → 二次确认 → 执行(AUTH PRD §18.3) */
const u = computed(() => app.auth.user)

const SCOPE = computed(() => [
  t('deleteAccount.scope1'),
  t('deleteAccount.scope2'),
  t('deleteAccount.scope3'),
  t('deleteAccount.scope4'),
])

function confirmDelete() {
  showDialog(
    t('deleteAccount.confirmTitle'),
    t('deleteAccount.confirmBody'),
    deleteAccount,
  )
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'auth-delete' }" data-screen="auth-delete">
    <PageHeader :title="t('deleteAccount.title')" />

    <div class="card row" style="margin-top:8px;gap:12px;border-color:color-mix(in oklch,var(--danger) 35%,transparent)">
      <span style="display:grid;place-items:center;width:40px;height:40px;border-radius:12px;background:var(--danger-soft);color:var(--danger);flex:none">
        <svg class="ic"><use href="#i-alert"/></svg>
      </span>
      <p style="font-size:13.5px;line-height:1.6">{{ t('deleteAccount.warn') }}</p>
    </div>

    <div v-if="u" class="card" style="margin-top:14px">
      <div class="kv"><span class="k">{{ t('deleteAccount.account') }}</span><span class="v">{{ u.nickname }} · TASO ID {{ u.id }}</span></div>
      <div class="kv"><span class="k">{{ t('deleteAccount.scopeLabel') }}</span><span class="v">{{ t('deleteAccount.allData') }}</span></div>
      <div class="kv"><span class="k">{{ t('deleteAccount.recovery') }}</span><span class="v">{{ t('deleteAccount.days14') }}</span></div>
      <div class="kv"><span class="k">{{ t('deleteAccount.session') }}</span><span class="v">{{ t('deleteAccount.revokeAll') }}</span></div>
    </div>

    <div class="card" style="margin-top:14px;padding:4px 14px">
      <div v-for="s in SCOPE" :key="s" class="li" style="border:0">
        <span class="li-ic" style="background:var(--danger-soft);color:var(--danger)"><svg class="ic"><use href="#i-x"/></svg></span>
        <span class="li-title" style="font-weight:400;font-size:14px">{{ s }}</span>
      </div>
    </div>

    <button class="btn btn-danger" style="margin-top:20px" @click="confirmDelete">{{ t('deleteAccount.btn') }}</button>
    <p class="meta" style="margin-top:14px;font-size:11px;text-align:center">
      {{ t('deleteAccount.demoNote') }}
    </p>
  </section>
</template>
