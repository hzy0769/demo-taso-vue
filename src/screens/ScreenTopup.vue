<script setup lang="ts">
import { computed, ref } from 'vue'
import { app, save, show, toast } from '../store'
import { t, prefs } from '../i18n'
import { fmtMoney } from '../i18n/format'
import { PAY_METHODS, pay, payMethodName, startCard, startCrypto, startWallet, lastPaidText, type PayRequest, type Quote } from '../pay'
import PageHeader from '../components/PageHeader.vue'
import QuoteDisclosure from '../components/QuoteDisclosure.vue'

/**
 * 会员卡充值(Stripe Express Checkout 模式):
 * 金额 → 费用摘要 + 付款前固定披露(Quote,评审 §3.4)→ 钱包快捷按钮
 * (Apple Pay 仅苹果设备,点击即付)→ 其他方式单选列表 → 吸底支付栏。
 * 入账一律 USD 记账,支付币种由方式决定;加密方式带「地区相关」演示标签(评审 §3.2)。
 */

const amt = ref('1,000.00')
const PRESETS = [100, 500, 1000, 5000]
const FEE_RATE = 0.16

const parsed = computed(() => parseFloat(amt.value.replace(/,/g, '')) || 0)
const fee = computed(() => parsed.value * FEE_RATE)
const total = computed(() => parsed.value * (1 + FEE_RATE))
const USD = (n: number) => fmtMoney({ amount: n, currency: 'USD' })

const methods = computed(() => PAY_METHODS.filter(m => m.available))
const wallets = computed(() => methods.value.filter(m => m.kind === 'wallet'))
const others = computed(() => methods.value.filter(m => m.kind !== 'wallet'))

const isCrypto = computed(() => pay.method === 'usdt' || pay.method === 'usdc')
const cryptoAsset = computed(() => (pay.method === 'usdt' ? 'USDT' : 'USDC'))

/** 付款前披露:随所选支付方式实时更新扣款币种与网络费(评审 §3.4) */
const quote = computed<Quote>(() => ({
  priceCurrency: 'USD',
  chargeCurrency: isCrypto.value ? cryptoAsset.value : 'USD',
  fxNote: isCrypto.value
    ? t('pay.crypto.rateNote', { asset: cryptoAsset.value })
    : t('quote.fxNone'),
  platformFee: { label: t('topup.fee', { rate: 16 }), money: USD(fee.value) },
  networkFee: isCrypto.value
    ? { label: t('quote.networkFee'), money: t('quote.borneBySender') }
    : undefined,
  tax: { label: t('quote.tax'), money: t('quote.taxIncluded') },
  arrival: { label: t('topup.creditAmount'), money: USD(parsed.value) },
  refund: t('quote.refundTopup'),
  payee: t('quote.payee'),
  support: t('quote.support'),
}))

/** 支付完成展示态:到账金额 + 支付方式 */
const done = ref<{ credit: number; via: string } | null>(null)

function setPreset(n: number) {
  amt.value = `${n}.00`
}

function buildRequest(): PayRequest {
  return {
    purpose: 'topup',
    lines: [
      { label: t('topup.amount'), money: USD(parsed.value) },
      { label: t('topup.fee', { rate: 16 }), money: USD(fee.value) },
    ],
    totalText: USD(total.value),
    amountUSD: total.value,
    quote: quote.value,
    onSuccess: () => {
      app.bal += parsed.value
      save()
      toast(t('topup.success'))
      done.value = { credit: parsed.value, via: lastPaidText() }
    },
  }
}

/** 钱包快捷按钮:express = 选定即支付 */
function expressPay(m: 'apple-pay' | 'google-pay') {
  if (!valid()) return
  pay.method = m
  startWallet(m, buildRequest())
}

function payNow() {
  if (!valid()) return
  const m = pay.method
  const req = buildRequest()
  if (m === 'apple-pay' || m === 'google-pay') startWallet(m, req)
  else if (m === 'card') { startCard(req); show('pay-card') }
  else { startCrypto(m as 'usdt' | 'usdc', req); show('pay-crypto') }
}

function valid() {
  if (!parsed.value || parsed.value <= 0) {
    toast(t('topup.invalid'))
    return false
  }
  return true
}

function again() {
  done.value = null
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'topup' }" data-screen="topup">
    <PageHeader :title="t('topup.title')" />

    <template v-if="!done">
      <!-- 余额上下文 -->
      <div class="row-b" style="margin-top:8px;padding:0 2px">
        <span class="meta">{{ t('topup.balanceNow') }}</span>
        <span class="row" style="gap:8px">
          <b class="num" style="font-size:15px">{{ USD(app.bal) }}</b>
          <span class="badge soft">{{ t('benefits.spendOnly') }}</span>
        </span>
      </div>

      <!-- 金额 -->
      <div class="amt-box">
        <span class="meta">{{ t('topup.amount') }}</span>
        <div class="amt-row">
          <span class="amt-cur">US$</span>
          <input v-model="amt" class="amt-input num" inputmode="decimal" :aria-label="t('topup.amount')" />
        </div>
        <div class="chips" style="margin-top:12px">
          <button v-for="p in PRESETS" :key="p" class="chip gold" :class="{ on: parsed === p }" @click="setPreset(p)">
            <span class="num">{{ p.toLocaleString(prefs.uiLocale) }}</span>
          </button>
        </div>
      </div>

      <!-- 费用摘要 -->
      <div class="card">
        <div class="kv"><span class="k">{{ t('topup.creditAmount') }}</span><span class="v num">{{ USD(parsed) }}</span></div>
        <div class="kv"><span class="k">{{ t('topup.fee', { rate: 16 }) }}</span><span class="v num">{{ USD(fee) }}</span></div>
        <div class="kv"><span class="k">{{ t('topup.estPay') }}</span><span class="v num" style="font-weight:700">{{ USD(total) }}</span></div>
      </div>

      <!-- 付款前固定披露(评审 §3.4) -->
      <QuoteDisclosure :quote="quote" style="margin-top:10px" />

      <!-- 支付方式 -->
      <div class="sec-h" style="margin-top:18px"><span>{{ t('topup.payWith') }}</span></div>
      <div class="wrow" :class="{ single: wallets.length === 1 }">
        <button
          v-for="w in wallets" :key="w.id"
          class="wbtn" :aria-label="t(w.nameKey)"
          @click="expressPay(w.id as 'apple-pay' | 'google-pay')"
        >
          <svg class="wbtn-mark" viewBox="0 0 24 24" aria-hidden="true"><use :href="w.id === 'apple-pay' ? '#logo-apple' : '#logo-google'"/></svg>
          <span>Pay</span>
        </button>
      </div>

      <div class="paydiv"><span>{{ t('pay.otherWays') }}</span></div>

      <button
        v-for="m in others" :key="m.id"
        class="pm-row" :class="{ on: pay.method === m.id }"
        @click="pay.method = m.id"
      >
        <span class="pm-ic" :class="m.id">
          <svg v-if="m.id === 'card'" class="ic"><use href="#i-card"/></svg>
          <svg v-else-if="m.id === 'usdt'" class="pm-logo" viewBox="0 0 24 24" aria-hidden="true"><use href="#pm-usdt"/></svg>
          <svg v-else class="pm-logo" viewBox="0 0 24 24" aria-hidden="true"><use href="#pm-usdc"/></svg>
        </span>
        <span style="flex:1;min-width:0">
          <span class="pm-name">{{ t(m.nameKey) }}</span>
          <span v-if="m.subKey" class="pm-sub">{{ t(m.subKey) }}</span>
          <!-- 加密方式:能力矩阵演示标签(评审 §3.2,原型不隐藏入口) -->
          <span v-if="m.kind === 'crypto'" class="pm-sub">{{ t('capability.regionTag') }}</span>
        </span>
        <span class="ckdot" :class="{ on: pay.method === m.id }"></span>
      </button>

      <p class="meta" style="margin-top:12px">{{ t('topup.note') }}</p>

      <!-- 吸底支付栏 -->
      <div class="paybar">
        <button class="paybar-mth" @click="payNow">
          <span class="pm-ic sm" :class="pay.method">
            <svg v-if="pay.method === 'card'" class="ic"><use href="#i-card"/></svg>
            <svg v-else-if="pay.method === 'usdt'" class="pm-logo" viewBox="0 0 24 24"><use href="#pm-usdt"/></svg>
            <svg v-else-if="pay.method === 'usdc'" class="pm-logo" viewBox="0 0 24 24"><use href="#pm-usdc"/></svg>
            <svg v-else class="pm-logo" viewBox="0 0 24 24"><use :href="pay.method === 'apple-pay' ? '#logo-apple' : '#logo-google'"/></svg>
          </span>
          <span class="paybar-mth-t">
            <b>{{ USD(total) }}</b>
            <span>{{ payMethodName(pay.method) }}</span>
          </span>
        </button>
        <button class="btn btn-p paybar-btn" :disabled="!parsed" @click="payNow">{{ t('topup.payBtn') }}</button>
      </div>
    </template>

    <!-- 支付完成 -->
    <div v-else style="display:flex;flex-direction:column;align-items:center;padding-top:40px;text-align:center">
      <span style="width:76px;height:76px;border-radius:50%;background:var(--ok-soft);display:grid;place-items:center">
        <svg class="ic" style="width:36px;height:36px;color:var(--ok);stroke-width:2.4"><use href="#i-check"/></svg>
      </span>
      <h2 style="font-size:20px;font-weight:700;margin-top:16px">{{ t('topup.successTitle') }}</h2>
      <b class="num" style="font-size:26px;margin-top:8px">+{{ USD(done.credit) }}</b>
      <div class="card" style="margin-top:20px;width:100%;text-align:left">
        <div class="kv"><span class="k">{{ t('pay.paidVia') }}</span><span class="v">{{ done.via }}</span></div>
        <div class="kv"><span class="k">{{ t('topup.balanceNow') }}</span><span class="v num" style="font-weight:700">{{ USD(app.bal) }}</span></div>
      </div>
      <button class="btn btn-p" style="margin-top:20px" @click="show('my-card')">{{ t('common.done') }}</button>
      <button class="btn btn-o" style="margin-top:10px" @click="again">{{ t('topup.again') }}</button>
    </div>
  </section>
</template>
