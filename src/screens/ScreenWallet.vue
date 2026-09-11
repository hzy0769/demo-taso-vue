<script setup lang="ts">
import { app, show } from '../store'
import { t } from '../i18n'
import { fmtMoney } from '../i18n/format'
import PageHeader from '../components/PageHeader.vue'

const USD = (n: number) => fmtMoney({ amount: n, currency: 'USD' })
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'wallet' }" data-screen="wallet">
    <PageHeader :title="t('wallet.title')">
      <template #right>
        <button class="bk" :aria-label="t('benefits.incomeRecords')" @click="show('wallet-transactions')"><svg class="ic"><use href="#i-receipt"/></svg></button>
      </template>
    </PageHeader>
    <div class="card" style="margin-top:8px">
      <div class="row-b" style="margin-bottom:6px">
        <span class="meta">{{ t('wallet.independent') }}</span>
        <span class="badge soft">{{ t('benefits.withdrawableBadge') }}</span>
      </div>
      <div class="kv"><span class="k">{{ t('wallet.creatorIncome') }}</span><span class="v num">{{ USD(620) }}</span></div>
      <div class="kv"><span class="k">{{ t('wallet.referralReward') }}</span><span class="v num">{{ USD(180) }}</span></div>
      <div class="kv"><span class="k">{{ t('wallet.shareholderDividend') }}</span><span class="v num">{{ USD(51310) }}</span></div>
      <div class="kv"><span class="k">{{ t('wallet.pendingSettle') }}</span><span class="v num warn">{{ USD(1240) }}</span></div>
      <div class="kv"><span class="k">{{ t('wallet.frozenAmount') }}</span><span class="v num">{{ USD(300) }}</span></div>
      <div class="kv" style="border-top:1px solid var(--fg);margin-top:4px">
        <span class="k" style="font-weight:600">{{ t('wallet.withdrawable') }}</span>
        <span class="v num" style="font-weight:700">{{ USD(app.wd) }}</span>
      </div>
    </div>
    <p class="meta" style="margin-top:10px">{{ t('wallet.note') }}</p>
    <div class="row" style="margin-top:16px;gap:10px">
      <button class="btn btn-p" style="flex:1" @click="show('withdraw')">{{ t('benefits.withdraw') }}</button>
      <button class="btn btn-o" style="flex:1" @click="show('wallet-transactions')">{{ t('wallet.txHistory') }}</button>
    </div>
  </section>
</template>
