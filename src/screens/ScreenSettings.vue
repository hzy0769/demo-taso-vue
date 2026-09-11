<script setup lang="ts">
import { app, logout, showDialog, show } from '../store'
import { t, prefs, uiLocaleLabel, regionName } from '../i18n'
import PageHeader from '../components/PageHeader.vue'
import ToggleSwitch from '../components/ToggleSwitch.vue'
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'settings' }" data-screen="settings">
    <PageHeader :title="t('settings.title')" />
    <div class="card" style="margin-top:8px;padding:4px 14px">
      <button class="li" style="border:0" @click="show('account')">
        <span class="li-ic"><svg class="ic"><use href="#i-user"/></svg></span>
        <span class="li-title">{{ t('settings.account') }}</span>
        <span class="li-val">{{ app.auth.user?.nickname ?? t('settings.notLoggedIn') }}</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" style="border:0" @click="show('language')">
        <span class="li-ic"><svg class="ic"><use href="#i-globe"/></svg></span>
        <span class="li-title">{{ t('settings.langRegion') }}</span>
        <span class="li-val">{{ uiLocaleLabel(prefs.uiLocale) }} · {{ regionName(prefs.contentRegion) }}</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" style="border:0" @click="show('security')">
        <span class="li-ic"><svg class="ic"><use href="#i-shield"/></svg></span>
        <span class="li-title">{{ t('settings.security') }}</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" style="border:0" @click="show('kyc')">
        <span class="li-ic"><svg class="ic"><use href="#i-check"/></svg></span>
        <span class="li-title">{{ t('settings.kyc') }}</span><span class="badge ok">{{ t('settings.kycPassed') }}</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" style="border:0" @click="show('notifications')">
        <span class="li-ic"><svg class="ic"><use href="#i-bell"/></svg></span>
        <span class="li-title">{{ t('settings.notifications') }}</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <div class="li" style="border:0">
        <span class="li-ic"><svg class="ic"><use href="#i-bell"/></svg></span>
        <span class="li-title">{{ t('settings.push') }}</span>
        <ToggleSwitch :label="t('settings.push')" />
      </div>
    </div>
    <button
      class="btn btn-danger"
      style="margin-top:20px"
      @click="showDialog(t('settings.logoutTitle'), t('settings.logoutBody'), logout)"
    >{{ t('settings.logout') }}</button>
  </section>
</template>
