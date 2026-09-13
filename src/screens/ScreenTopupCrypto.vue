<script setup lang="ts">
import { computed, ref } from 'vue'
import { app, save, show, toast } from '../store'
import { t, prefs } from '../i18n'
import { fmtMoney } from '../i18n/format'
import { PAY_METHODS, pay, startCrypto, lastPaidText, type PayRequest, type Quote } from '../pay'
import PageHeader from '../components/PageHeader.vue'
import QuoteDisclosure from '../components/QuoteDisclosure.vue'

/**
 * 虚拟币充值(V2.11 · 由「充值」入口拆分):USDT / USDC 专页。
 * 以美元计价(USDT / USDC 与美元 1:1),金额输入、手续费、支付额
 * 全程 US$ 展示,无换汇、无汇率披露;到账直接入 Visa 美元账户。
 * 支付走加密四步流(选网络 → 地址/二维码 → 区块确认 → 到账)。
 */

const amt = ref('100.00')
const PRESETS = [25, 100, 500, 1000]
const FEE_RATE = 0.16

const parsed = computed(() => parseFloat(amt.value.replace(/,/g, '')) || 0)
const fee = computed(() => parsed.value * FEE_RATE)
const total = computed(() => parsed.value * (1 + FEE_RATE))
const USD = (n: number) => fmtMoney({ amount: n, currency: 'USD' })

/** 加密方式:仅 USDT / USDC */
const methods = computed(() => PAY_METHODS.filter(m => m.kind === 'crypto'))

/** 上次方式若是法币(钱包/银行卡),在虚拟币页回落 USDT */
const cryptoMethod = computed(() => (pay.method === 'usdt' || pay.method === 'usdc' ? pay.method : 'usdt') as 'usdt' | 'usdc')
const assetName = computed(() => (cryptoMethod.value === 'usdt' ? 'USDT' : 'USDC'))

/** 付款前披露:美元计价、U 币 1:1,无汇率行(评审 §3.4) */
const quote = computed<Quote>(() => ({
  priceCurrency: 'USD',
  chargeCurrency: assetName.value,
  fxNote: undefined,
  platformFee: { label: t('topup.fee', { rate: 16 }), money: USD(fee.value) },
  networkFee: { label: t('quote.networkFee'), money: t('quote.borneBySender') },
  tax: { label: t('quote.tax'), money: t('quote.taxIncluded') },
  arrival: { label: t('topup.creditAmount'), money: USD(parsed.value) },
  refund: t('quote.refundTopup'),
  payee: t('quote.payee'),
  support: t('quote.support'),
}))

/** 支付完成展示态:到账金额(美元)+ 支付方式 */
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
    // USDT/USDC 1:1 美元:支付数量 = 美元总额(含手续费),无换汇
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

function payNow() {
  if (!valid()) return
  pay.method = cryptoMethod.value
  startCrypto(cryptoMethod.value, buildRequest())
  show('pay-crypto')
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
  <section class="scr" :class="{ on: app.screen === 'topup-crypto' }" data-screen="topup-crypto">
    <PageHeader :title="t('topup.cryptoTitle')" />

    <template v-if="!done">
      <!-- 余额上下文 -->
      <div class="row-b" style="margin-top:8px;padding:0 2px">
        <span class="meta">{{ t('topup.balanceNow') }}</span>
        <span class="row" style="gap:8px">
          <b class="num" style="font-size:15px">{{ USD(app.bal) }}</b>
          <span class="badge soft">{{ t('benefits.spendOnly') }}</span>
        </span>
      </div>

      <!-- 金额(美元计价,U 币 1:1) -->
      <div class="amt-box">
        <span class="meta">{{ t('topup.amount') }} · US$ / {{ t('pay.crypto.stableNote') }}</span>
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

      <!-- 费用摘要:全程美元,无换汇 -->
      <div class="card">
        <div class="kv"><span class="k">{{ t('topup.creditAmount') }}</span><span class="v num">{{ USD(parsed) }}</span></div>
        <div class="kv"><span class="k">{{ t('topup.fee', { rate: 16 }) }}</span><span class="v num">{{ USD(fee) }}</span></div>
        <div class="kv"><span class="k">{{ t('topup.estPay') }}</span><span class="v num" style="font-weight:700">{{ USD(total) }}</span></div>
      </div>

      <!-- 付款前固定披露(评审 §3.4) -->
      <QuoteDisclosure :quote="quote" style="margin-top:10px" />

      <!-- 支付方式:USDT / USDC -->
      <div class="sec-h" style="margin-top:18px"><span>{{ t('topup.payWith') }}</span></div>
      <button
        v-for="m in methods" :key="m.id"
        class="pm-row" :class="{ on: cryptoMethod === m.id }"
        @click="pay.method = m.id"
      >
        <span class="pm-ic" :class="m.id">
          <svg class="pm-logo" viewBox="0 0 24 24" aria-hidden="true"><use :href="m.id === 'usdt' ? '#pm-usdt' : '#pm-usdc'"/></svg>
        </span>
        <span style="flex:1;min-width:0">
          <span class="pm-name">{{ t(m.nameKey) }}</span>
          <span v-if="m.subKey" class="pm-sub">{{ t(m.subKey) }}</span>
        </span>
        <span class="ckdot" :class="{ on: cryptoMethod === m.id }"></span>
      </button>

      <!-- 法币入口引导 -->
      <button class="lnk-row" @click="show('topup-fiat')">
        <span>{{ t('topup.goFiat') }}</span>
        <svg class="ic sm"><use href="#i-right"/></svg>
      </button>

      <p class="meta" style="margin-top:12px">{{ t('pay.crypto.netWarn') }}</p>

      <!-- 吸底支付栏 -->
      <div class="paybar">
        <button class="paybar-mth" @click="payNow">
          <span class="pm-ic sm" :class="cryptoMethod">
            <svg class="pm-logo" viewBox="0 0 24 24"><use :href="cryptoMethod === 'usdt' ? '#pm-usdt' : '#pm-usdc'"/></svg>
          </span>
          <span class="paybar-mth-t">
            <b>{{ USD(total) }}</b>
            <span>{{ assetName }}</span>
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
