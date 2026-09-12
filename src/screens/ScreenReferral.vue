<script setup lang="ts">
import { app, toast, show } from '../store'
import { REFERRAL_PLAN, type ReferralTrack } from '../data'
import { t } from '../i18n'
import { fmtMoney, fmtRate } from '../i18n/format'
import PageHeader from '../components/PageHeader.vue'

/** 演示方案固定 3 级;层级数与比例均为后台可配(§79) */
const LEVEL_KEYS = ['refRules.lv1', 'refRules.lv2', 'refRules.lv3']
const tracks: { key: ReferralTrack; icon: string }[] = [
  { key: 'purchase', icon: '#i-card' },
  { key: 'topup', icon: '#i-wallet' },
]

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
    <!-- 示例收益披露(评审 P0:多级现金奖励须先过市场资格与合规确认;原型为示例数据) -->
    <div class="demo-bar" role="note">
      <svg class="ic sm" style="flex:none;margin-top:1px"><use href="#i-alert"/></svg>
      <span>{{ t('referral.demoBanner') }}</span>
    </div>
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

    <!-- 双轨佣金结构(V2.2):购卡 30/5/1 + 充值 0.5/0.1/0.05,独立计佣 -->
    <div class="card" style="margin-top:14px">
      <div class="row-b"><b style="font-size:14px">{{ t('referral.structure') }}</b><span class="badge soft">{{ t('referral.demoPlan') }}</span></div>
      <div v-for="tr in tracks" :key="tr.key" style="margin-top:12px">
        <div class="row" style="gap:8px">
          <svg class="ic" style="color:var(--muted)"><use :href="tr.icon"/></svg>
          <b style="font-size:13px">{{ t(`refRules.${tr.key}Title`) }}</b>
        </div>
        <div style="margin-top:4px">
          <div v-for="(rate, i) in REFERRAL_PLAN[tr.key].rates" :key="i" class="kv">
            <span class="k">{{ t(LEVEL_KEYS[i]) }}</span>
            <span class="v num" style="font-weight:700">{{ fmtRate(rate) }}</span>
          </div>
        </div>
      </div>
      <p class="meta" style="margin-top:10px">{{ t('referral.trackNote') }}</p>
      <button class="btn btn-o" style="margin-top:12px" @click="show('referral-rules')">{{ t('referral.viewRules') }}</button>
    </div>
    <p class="meta" style="margin-top:12px">{{ t('referral.note') }}</p>
  </section>
</template>
