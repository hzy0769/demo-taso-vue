<script setup lang="ts">
import { app, toast } from '../store'
import { t } from '../i18n'
import { fmtMoney, fmtLocalDate } from '../i18n/format'
import PageHeader from '../components/PageHeader.vue'

const USD = (n: number) => fmtMoney({ amount: n, currency: 'USD' })

/** 結算記錄:自然日 + 金額結構化 */
const records = [
  { date: '2026-09-09', amount: 0.4 },
  { date: '2026-09-08', amount: 0.4 },
  { date: '2026-09-07', amount: 0.4 },
]
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'reimburse-detail' }" data-screen="reimburse-detail">
    <PageHeader :title="t('reimburse.detailTitle', { id: 'R202609081288' })" />
    <div class="card" style="margin-top:8px">
      <div class="kv"><span class="k">{{ t('reimburse.merchant') }}</span><span class="v">焼肉Taso</span></div>
      <div class="kv"><span class="k">{{ t('reimburse.spendDate') }}</span><span class="v num">{{ fmtLocalDate('2026-09-08') }}</span></div>
      <div class="kv"><span class="k">{{ t('reimburse.originalSpend') }}</span><span class="v num">{{ USD(800) }}</span></div>
      <div class="kv"><span class="k">{{ t('reimburse.auditedAmount') }}</span><span class="v num">{{ USD(800) }}</span></div>
      <div class="kv"><span class="k">{{ t('reimburse.benefitCap') }}</span><span class="v num gold">{{ USD(928) }}</span></div>
    </div>
    <div class="card" style="margin-top:12px">
      <div class="row-b"><span class="meta">{{ t('reimburse.progress') }}</span><span class="num">62%</span></div>
      <div class="prog" style="margin-top:8px"><i style="width:62%"></i></div>
      <div class="row" style="margin-top:12px;gap:8px">
        <div style="flex:1"><div class="meta">{{ t('reimburse.settled') }}</div><div class="num" style="font-weight:600">{{ USD(120) }}</div></div>
        <div style="flex:1"><div class="meta">{{ t('reimburse.todayExpected') }}</div><div class="num" style="font-weight:600">{{ USD(0.4) }}</div></div>
        <div style="flex:1"><div class="meta">{{ t('reimburse.remain') }}</div><div class="num" style="font-weight:600">{{ USD(808) }}</div></div>
      </div>
    </div>
    <h3 style="font-size:15px;font-weight:600;margin:18px 0 10px">{{ t('reimburse.records') }}</h3>
    <div class="card" style="padding:4px 14px">
      <div v-for="r in records" :key="r.date" class="li" style="border:0">
        <span class="meta">{{ fmtLocalDate(r.date) }}</span>
        <span class="li-title num">{{ USD(r.amount) }}</span>
        <span class="badge ok">{{ t('reimburse.credited') }}</span>
      </div>
    </div>
    <button class="btn btn-o" style="margin-top:16px" @click="toast(t('reimburse.receiptToast'))">{{ t('reimburse.viewReceipt') }}</button>
  </section>
</template>
