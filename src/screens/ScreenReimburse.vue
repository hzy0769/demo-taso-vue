<script setup lang="ts">
import { app, show, showDialog, toast } from '../store'
import { t } from '../i18n'
import { fmtMoney } from '../i18n/format'
import PageHeader from '../components/PageHeader.vue'

const USD = (n: number) => fmtMoney({ amount: n, currency: 'USD' })

function submit() {
  showDialog(t('reimburse.submitTitle'), t('reimburse.submitBody'), () =>
    toast(t('reimburse.submitted')),
  )
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'reimburse' }" data-screen="reimburse">
    <PageHeader :title="t('reimburse.title')" />
    <div class="row" style="gap:8px;margin-top:8px">
      <div class="card" style="flex:1;padding:12px"><div class="num" style="font-weight:700">12</div><div class="meta">{{ t('reimburse.audited') }}</div></div>
      <div class="card" style="flex:1;padding:12px"><div class="num warn" style="font-weight:700">8</div><div class="meta">{{ t('reimburse.settling') }}</div></div>
      <div class="card" style="flex:1;padding:12px"><div class="num ok" style="font-weight:700">21</div><div class="meta">{{ t('reimburse.done') }}</div></div>
    </div>
    <button class="btn btn-p" style="margin-top:14px" @click="submit">{{ t('reimburse.submit') }}</button>
    <h3 style="font-size:15px;font-weight:600;margin:18px 0 10px">{{ t('reimburse.settling') }}</h3>
    <div class="card">
      <div class="row-b"><b>焼肉Taso</b><span class="badge warn">{{ t('reimburse.settling') }}</span></div>
      <div class="kv" style="margin-top:6px"><span class="k">{{ t('reimburse.spend') }}</span><span class="v num">{{ USD(800) }}</span></div>
      <div class="kv"><span class="k">{{ t('reimburse.capLimit') }}</span><span class="v num">{{ USD(928) }}</span></div>
      <div class="kv"><span class="k">{{ t('reimburse.settled') }}</span><span class="v num ok">{{ USD(120) }}</span></div>
      <div class="kv"><span class="k">{{ t('reimburse.remain') }}</span><span class="v num">{{ USD(808) }}</span></div>
      <p class="meta" style="margin-top:8px">{{ t('reimburse.dailyRule', { rate: 0.05 }) }}</p>
      <button class="btn btn-o" style="margin-top:12px" @click="show('reimburse-detail')">{{ t('reimburse.viewDetail') }}</button>
    </div>
    <p class="meta" style="margin-top:12px">{{ t('reimburse.note') }}</p>
  </section>
</template>
