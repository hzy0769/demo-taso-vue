<script setup lang="ts">
import { app, toast } from '../store'
import { t } from '../i18n'
import { fmtMoney } from '../i18n/format'
import PageHeader from '../components/PageHeader.vue'

function copyLink() {
  if (navigator.clipboard) {
    navigator.clipboard.writeText('https://taso.app/r/A8K29').catch(() => {})
  }
  toast(t('referral.linkCopied'))
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'referral' }" data-screen="referral">
    <PageHeader :title="t('referral.title')" />
    <div class="row" style="gap:8px;margin-top:8px">
      <div class="card" style="flex:1;padding:12px"><div class="num" style="font-weight:700">128</div><div class="meta">{{ t('referral.invited') }}</div></div>
      <div class="card" style="flex:1;padding:12px"><div class="num" style="font-weight:700">32</div><div class="meta">{{ t('referral.direct') }}</div></div>
      <div class="card" style="flex:1;padding:12px"><div class="num gold" style="font-weight:700">{{ fmtMoney({ amount: 2380, currency: 'USD' }) }}</div><div class="meta">{{ t('referral.totalReward') }}</div></div>
      <div class="card" style="flex:1;padding:12px"><div class="num warn" style="font-weight:700">420</div><div class="meta">{{ t('referral.pendingSettle') }}</div></div>
    </div>
    <div class="card" style="margin-top:14px">
      <div class="meta">{{ t('referral.myLink') }}</div>
      <div class="row-b" style="margin-top:8px"><span class="num" style="font-size:13px;word-break:break-all">https://taso.app/r/A8K29</span></div>
      <div class="row" style="margin-top:12px;gap:10px">
        <button class="btn btn-o" style="flex:1" @click="copyLink">{{ t('common.copy') }}</button>
        <button class="btn btn-p" style="flex:1" @click="toast(t('post.shareCopied'))">{{ t('common.share') }}</button>
      </div>
    </div>
    <div class="card" style="margin-top:14px">
      <div class="row-b"><b style="font-size:14px">{{ t('referral.structure') }}</b><span class="badge soft">{{ t('referral.currentRules') }}</span></div>
      <div class="kv" style="margin-top:6px"><span class="k">{{ t('referral.l1') }}</span><span class="v num">{{ t('referral.byRegion') }}</span></div>
      <div class="kv"><span class="k">{{ t('referral.l2') }}</span><span class="v num">{{ t('referral.byRegion') }}</span></div>
      <div class="kv"><span class="k">{{ t('referral.l3') }}</span><span class="v num">{{ t('referral.byRegion') }}</span></div>
      <button class="btn btn-o" style="margin-top:12px" @click="toast(t('referral.rulesToast'))">{{ t('referral.viewRules') }}</button>
    </div>
    <p class="meta" style="margin-top:12px">{{ t('referral.note') }}</p>
  </section>
</template>
