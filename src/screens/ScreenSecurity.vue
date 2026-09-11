<script setup lang="ts">
import { computed } from 'vue'
import { app, toast } from '../store'
import { t, countryName } from '../i18n'
import PageHeader from '../components/PageHeader.vue'
import ToggleSwitch from '../components/ToggleSwitch.vue'

/** 安全与隐私:标题/提示走文案 key,地区类字段经 Intl 本地化 */
const items = computed(() => ([
  { icon: '#i-refresh', title: t('security.devices'), msg: t('security.devicesMsg', { region: countryName('HK') }) },
  { icon: '#i-lock', title: t('security.password'), msg: t('security.passwordMsg') },
  { icon: '#i-user', title: t('security.contact'), msg: t('security.contactMsg') },
  { icon: '#i-wallet', title: t('security.withdraw'), msg: t('security.withdrawMsg') },
  { icon: '#i-copy', title: t('security.walletAddr'), msg: t('security.walletAddrMsg') },
  { icon: '#i-card', title: t('security.bankCard'), msg: t('security.bankCardMsg', { last4: '2021' }) },
  { icon: '#i-check', title: t('security.auths'), msg: t('security.authsMsg') },
  { icon: '#i-x', title: t('security.blocklist'), msg: t('security.blocklistMsg') },
  { icon: '#i-image', title: t('security.downloadData'), msg: t('security.downloadDataMsg') },
]))
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'security' }" data-screen="security">
    <PageHeader :title="t('security.title')" />
    <div class="card" style="margin-top:8px;padding:4px 14px">
      <button v-for="it in items" :key="it.title" class="li" style="border:0" @click="toast(it.msg)">
        <span class="li-ic"><svg class="ic"><use :href="it.icon"/></svg></span>
        <span class="li-title">{{ it.title }}</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <div class="li" style="border:0">
        <span class="li-ic"><svg class="ic"><use href="#i-shield"/></svg></span>
        <span class="li-title">{{ t('security.twofa') }}</span>
        <ToggleSwitch :label="t('security.twofa')" />
      </div>
    </div>
    <button class="btn btn-danger" style="margin-top:20px" @click="toast(t('security.deleteToast'))">{{ t('security.deleteAccount') }}</button>
  </section>
</template>
