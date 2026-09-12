<script setup lang="ts">
import { computed } from 'vue'
import { app, show } from '../store'
import { DIVIDEND_SALES_TOTAL, DIVIDEND_RECHARGE_TOTAL, WALLET_REFERRAL } from '../data'
import { t } from '../i18n'
import { fmtMoney } from '../i18n/format'
import PageHeader from '../components/PageHeader.vue'

const USD = (n: number) => fmtMoney({ amount: n, currency: 'USD' })

/** 双轨小计:推广 = 购卡 + 充值佣金;分红 = 销售 + 充值分红(与 P410/P412 同源,§79) */
const referralTotal = computed(() => WALLET_REFERRAL.purchase + WALLET_REFERRAL.topup)
const dividendTotal = computed(() => DIVIDEND_SALES_TOTAL + DIVIDEND_RECHARGE_TOTAL)
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

      <!-- 推广奖励 · 双轨佣金(V2.2):点击直达推广中心 -->
      <button class="kv" style="width:100%;text-align:inherit" @click="show('referral')">
        <span class="k" style="font-weight:600">{{ t('wallet.referralReward') }}</span>
        <span class="v num" style="font-weight:700">{{ USD(referralTotal) }}</span>
      </button>
      <div class="kv" style="padding-left:12px">
        <span class="k">{{ t('wallet.referralBuy') }}</span><span class="v num">{{ USD(WALLET_REFERRAL.purchase) }}</span>
      </div>
      <div class="kv" style="padding-left:12px">
        <span class="k">{{ t('wallet.referralTopup') }}</span><span class="v num">{{ USD(WALLET_REFERRAL.topup) }}</span>
      </div>

      <!-- 股东分红 · 双公式(V2.2):点击直达 P412 -->
      <button class="kv" style="width:100%;text-align:inherit" @click="show('dividend')">
        <span class="k" style="font-weight:600">{{ t('wallet.shareholderDividend') }}</span>
        <span class="v num" style="font-weight:700">{{ USD(dividendTotal) }}</span>
      </button>
      <div class="kv" style="padding-left:12px">
        <span class="k">{{ t('wallet.dividendSales') }}</span><span class="v num">{{ USD(DIVIDEND_SALES_TOTAL) }}</span>
      </div>
      <div class="kv" style="padding-left:12px">
        <span class="k">{{ t('wallet.dividendRecharge') }}</span><span class="v num">{{ USD(DIVIDEND_RECHARGE_TOTAL) }}</span>
      </div>

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
