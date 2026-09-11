<script setup lang="ts">
import { computed } from 'vue'
import { app } from '../store'
import { t } from '../i18n'
import PageHeader from '../components/PageHeader.vue'

/** KYC 解锁能力列表:金融可用性由账户国家/KYC 决定,不由 UI 语言(§10.1) */
const unlocked = computed(() => [
  t('kyc.memberCard'),
  t('kyc.topup'),
  t('kyc.reimburse'),
  t('kyc.withdraw'),
])
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'kyc' }" data-screen="kyc">
    <PageHeader :title="t('kyc.title')" />
    <div class="card" style="margin-top:8px;text-align:center;padding:22px 16px">
      <div class="badge ok" style="font-size:13px;justify-content:center"><svg class="ic sm"><use href="#i-check"/></svg>{{ t('kyc.statusLabel') }}</div>
      <div class="row-b" style="margin-top:16px;text-align:left"><span class="meta">{{ t('kyc.name') }}</span><b>******</b></div>
      <div class="row-b" style="margin-top:10px;text-align:left"><span class="meta">{{ t('kyc.region') }}</span><b>Hong Kong</b></div>
    </div>
    <div class="card" style="margin-top:14px">
      <div v-for="u in unlocked" :key="u" class="li" style="border:0">
        <svg class="ic ok"><use href="#i-check"/></svg><span class="li-title">{{ u }}</span>
      </div>
      <div class="li" style="border:0">
        <svg class="ic warn"><use href="#i-check"/></svg>
        <span class="li-title">{{ t('kyc.digitalAssets') }}</span><span class="badge warn">{{ t('kyc.byRegion') }}</span>
      </div>
    </div>
    <p class="meta" style="margin-top:12px">{{ t('kyc.note') }}</p>
  </section>
</template>
