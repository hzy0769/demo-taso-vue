<script setup lang="ts">
import { computed } from 'vue'
import { app, show } from '../store'
import { DIVIDEND_TOTAL } from '../data'
import { t } from '../i18n'
import { fmtMoney } from '../i18n/format'
import PageHeader from '../components/PageHeader.vue'
import TasoCard from '../components/TasoCard.vue'

/** 股东账号展示「股东分红」入口(V1.6) */
const isHolder = computed(() => app.auth.user?.role === 'shareholder')

const USD = (n: number) => fmtMoney({ amount: n, currency: 'USD' })
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'benefits' }" data-screen="benefits">
    <PageHeader :title="t('benefits.title')" :back-btn="false">
      <template #right>
        <button class="bk" :aria-label="t('a11y.settings')" @click="show('settings')"><svg class="ic"><use href="#i-settings"/></svg></button>
      </template>
    </PageHeader>

    <!-- 会员卡:综合权益页第一优先级模块(V1.9) -->
    <div class="sec-h" style="margin-top:6px">
      <span>{{ t('benefits.memberCard') }}</span>
      <button class="sec-more" @click="show('my-card')">{{ t('benefits.myCard') }} ›</button>
    </div>
    <TasoCard pan="•••• •••• •••• 3812" style="cursor:pointer" @click="show('my-card')">
      <div class="row-b" style="margin-top:14px">
        <span class="meta" style="color:color-mix(in oklch,var(--fg) 62%,transparent)">Alex · 09/28</span>
        <span class="meta" style="color:color-mix(in oklch,var(--fg) 62%,transparent)">GOLD MEMBER</span>
      </div>
    </TasoCard>
    <div class="card" style="margin-top:10px">
      <div class="row-b">
        <span class="meta">{{ t('benefits.cardBalance') }}</span>
        <span class="badge soft">{{ t('benefits.spendOnly') }}</span>
      </div>
      <div class="num" style="font-size:22px;font-weight:700;margin-top:4px">{{ USD(app.bal) }}</div>
      <div class="row" style="margin-top:12px;gap:10px">
        <button class="btn btn-p" style="flex:1" @click="show('topup')">{{ t('benefits.topup') }}</button>
        <button class="btn btn-o" style="flex:1" @click="show('transactions')">{{ t('benefits.spendRecords') }}</button>
      </div>
    </div>

    <!-- 钱包:收益账户摘要(V1.9 起在权益页展示,与会员卡并列) -->
    <div class="sec-h">
      <span>{{ t('benefits.walletSection') }}</span>
      <button class="sec-more" @click="show('wallet')">{{ t('benefits.enterWallet') }} ›</button>
    </div>
    <div class="card">
      <div class="row-b">
        <span class="meta">{{ t('benefits.withdrawable') }}</span>
        <span class="badge soft">{{ t('benefits.withdrawableBadge') }}</span>
      </div>
      <div class="num" style="font-size:22px;font-weight:700;margin-top:4px">{{ USD(app.wd) }}</div>
      <div class="kv"><span class="k">{{ t('benefits.pendingReimburse') }}</span><span class="v num warn">{{ USD(1240) }}</span></div>
      <div class="row" style="margin-top:12px;gap:10px">
        <button class="btn btn-p" style="flex:1" @click="show('withdraw')">{{ t('benefits.withdraw') }}</button>
        <button class="btn btn-o" style="flex:1" @click="show('wallet-transactions')">{{ t('benefits.incomeRecords') }}</button>
      </div>
    </div>

    <!-- 推广与收益:钱包来源入口(V1.9 自会员卡页迁入) -->
    <div class="sec-h"><span>{{ t('benefits.promotion') }}</span></div>
    <div class="card" style="padding:4px 14px">
      <button class="li" @click="show('referral')">
        <span class="li-ic"><svg class="ic"><use href="#i-gift"/></svg></span>
        <span class="li-title">{{ t('benefits.referralCenter') }}</span><span class="li-val num gold">{{ USD(180) }}</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" @click="show('creator')">
        <span class="li-ic"><svg class="ic"><use href="#i-camera"/></svg></span>
        <span class="li-title">{{ t('benefits.creatorIncome') }}</span><span class="li-val num">{{ USD(620) }}</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" @click="show('reimburse')">
        <span class="li-ic"><svg class="ic"><use href="#i-receipt"/></svg></span>
        <span class="li-title">{{ t('benefits.reimburse') }}</span><span class="badge warn">{{ t('benefits.settlingCount', { n: 8 }) }}</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button v-if="isHolder" class="li" @click="show('dividend')">
        <span class="li-ic"><svg class="ic" style="color:var(--accent)"><use href="#i-star"/></svg></span>
        <span class="li-title">{{ t('benefits.dividend') }}</span><span class="li-val num gold">{{ USD(DIVIDEND_TOTAL) }}</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
    </div>
  </section>
</template>
