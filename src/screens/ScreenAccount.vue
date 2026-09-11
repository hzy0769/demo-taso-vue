<script setup lang="ts">
import { computed } from 'vue'
import { app, show } from '../store'
import { t, countryName, uiLocaleLabel, timeZoneLabel } from '../i18n'
import { fmtLocalDate } from '../i18n/format'
import PageHeader from '../components/PageHeader.vue'

/** AUTH-012 账号与安全:登录方式 / 账号信息 / 设备会话 / 删除账号(AUTH PRD §13.4) */
const u = computed(() => app.auth.user)

/** 账户国家:合规事实(可能未确认),显示名经 Intl 本地化;界面语言/时区与偏好联动 */
const countryText = computed(() => (u.value?.countryCode ? countryName(u.value.countryCode) : t('account.countryUnconfirmed')))
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'account' }" data-screen="account">
    <PageHeader :title="t('account.title')" />

    <template v-if="u">
      <div class="card" style="margin-top:8px">
        <div class="row" style="gap:14px">
          <span class="avatar lg">{{ u.nickname.slice(0, 1).toUpperCase() }}</span>
          <div style="flex:1;min-width:0">
            <b style="font-size:17px">{{ u.nickname }}</b>
            <p class="meta">TASO ID · {{ u.id }}</p>
          </div>
          <span class="badge ok">{{ t('account.normal') }}</span>
        </div>
        <div style="margin-top:12px">
          <div class="kv"><span class="k">{{ t('account.country') }}</span><span class="v">{{ countryText }}</span></div>
          <div class="kv"><span class="k">{{ t('account.uiLanguage') }}</span><span class="v">{{ uiLocaleLabel(u.language) }}</span></div>
          <div class="kv"><span class="k">{{ t('account.timezone') }}</span><span class="v">{{ timeZoneLabel(u.timezone) }}</span></div>
          <div class="kv"><span class="k">{{ t('account.registered') }}</span><span class="v">{{ fmtLocalDate(u.createdAt) }}</span></div>
        </div>
      </div>

      <div class="card" style="margin-top:14px;padding:4px 14px">
        <button class="li" style="border:0" @click="show('auth-methods')">
          <span class="li-ic"><svg class="ic"><use href="#i-shield"/></svg></span>
          <span class="li-title">{{ t('account.loginMethods') }}</span>
          <span class="li-val">{{ t('account.boundCount', { n: u.identities.length }) }}</span>
          <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
        </button>
        <button class="li" style="border:0" @click="show('auth-sessions')">
          <span class="li-ic"><svg class="ic"><use href="#i-monitor"/></svg></span>
          <span class="li-title">{{ t('account.sessions') }}</span>
          <span class="li-val">{{ t('account.deviceCount', { n: 3 }) }}</span>
          <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
        </button>
      </div>

      <div class="card" style="margin-top:14px;padding:4px 14px">
        <button class="li" style="border:0" @click="show('auth-delete')">
          <span class="li-ic" style="background:var(--danger-soft);color:var(--danger)"><svg class="ic"><use href="#i-trash"/></svg></span>
          <span class="li-title danger">{{ t('account.delete') }}</span>
          <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
        </button>
      </div>

      <p class="meta" style="margin-top:16px;font-size:11px;text-align:center">{{ t('account.demoNote') }}</p>
    </template>
  </section>
</template>
