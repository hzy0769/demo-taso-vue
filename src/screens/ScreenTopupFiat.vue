<script setup lang="ts">
import { computed, ref } from 'vue'
import { app, save, show, toast } from '../store'
import { t, prefs, FX_UPDATED_AT, currencyFlag } from '../i18n'
import { fmtMoney, fmtDate, fmtMoneyEstimate } from '../i18n/format'
import { PAY_METHODS, pay, payMethodName, startCard, startWallet, lastPaidText, hkdToUsd, HKD_USD_RATE, type PayRequest, type Quote } from '../pay'
import PageHeader from '../components/PageHeader.vue'
import QuoteDisclosure from '../components/QuoteDisclosure.vue'

/**
 * 快捷充值(V2.11 · 法币专页,由「充值」入口拆分):
 * 港币计价扣款 + 钱包快捷按钮(Apple Pay / Google Pay 即付)+ 银行卡;
 * 按用户设置的本地货币(语言与地区 → 本地货币,V2.12)显示支付金额换算
 * (估算,§9.1 原币始终可见),方便全球用户理解金额;到账按汇率换汇为
 * 美元入 Visa 账户。本地货币=港币(同币种)时不显示换算行。
 */

const amt = ref('1,000.00')
const PRESETS = [100, 500, 1000, 5000]
const FEE_RATE = 0.16

const parsed = computed(() => parseFloat(amt.value.replace(/,/g, '')) || 0)
const fee = computed(() => parsed.value * FEE_RATE)
const total = computed(() => parsed.value * (1 + FEE_RATE))
const HKD = (n: number) => fmtMoney({ amount: n, currency: 'HKD' })
const USD = (n: number) => fmtMoney({ amount: n, currency: 'USD' })

const rateText = HKD_USD_RATE.toFixed(4)
const rateTime = fmtDate(FX_UPDATED_AT)

/** 到账金额(美元):港币扣款按汇率实时换汇入账 */
const creditUSD = computed(() => hkdToUsd(parsed.value))

/** 本地展示货币:语言与地区设置 → 本地货币(V2.12;默认跟随语言所属地区) */
const localCurrency = computed(() => prefs.displayCurrency)

/** 当地货币等值(仅辅助信息;与扣款币种相同时为 null 不展示,§9.1) */
const localAmtEst = computed(() => fmtMoneyEstimate({ amount: parsed.value, currency: 'HKD' }, localCurrency.value))
const localTotalEst = computed(() => fmtMoneyEstimate({ amount: total.value, currency: 'HKD' }, localCurrency.value))

/** 法币方式:钱包 + 银行卡 */
const methods = computed(() => PAY_METHODS.filter(m => m.available && m.kind !== 'crypto'))
const wallets = computed(() => methods.value.filter(m => m.kind === 'wallet'))
const others = computed(() => methods.value.filter(m => m.kind !== 'wallet'))

/** 上次方式若是 USDT/USDC(虚拟币页),在法币页回落银行卡 */
const fiatMethod = computed(() => (pay.method === 'usdt' || pay.method === 'usdc' ? 'card' : pay.method))

/** 付款前披露:法币通道展示汇率换汇说明(评审 §3.4) */
const quote = computed<Quote>(() => ({
  priceCurrency: 'HKD',
  chargeCurrency: 'HKD',
  fxNote: t('quote.fxNote', { rate: rateText, time: rateTime }),
  platformFee: { label: t('topup.fee', { rate: 16 }), money: HKD(fee.value) },
  networkFee: undefined,
  tax: { label: t('quote.tax'), money: t('quote.taxIncluded') },
  arrival: { label: t('topup.creditAmount'), money: USD(creditUSD.value) },
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
      { label: t('topup.amount'), money: HKD(parsed.value) },
      { label: t('topup.fee', { rate: 16 }), money: HKD(fee.value) },
    ],
    totalText: HKD(total.value),
    amountUSD: hkdToUsd(total.value),
    quote: quote.value,
    onSuccess: () => {
      app.bal += creditUSD.value
      save()
      toast(t('topup.success'))
      done.value = { credit: creditUSD.value, via: lastPaidText() }
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
  const m = fiatMethod.value as 'apple-pay' | 'google-pay' | 'card'
  const req = buildRequest()
  if (m === 'apple-pay' || m === 'google-pay') startWallet(m, req)
  else { startCard(req); show('pay-card') }
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
  <section class="scr" :class="{ on: app.screen === 'topup-fiat' }" data-screen="topup-fiat">
    <PageHeader :title="t('topup.fiatTitle')" />

    <template v-if="!done">
      <!-- 余额上下文 -->
      <div class="row-b" style="margin-top:8px;padding:0 2px">
        <span class="meta">{{ t('topup.balanceNow') }}</span>
        <span class="row" style="gap:8px">
          <b class="num" style="font-size:15px">{{ USD(app.bal) }}</b>
          <span class="badge soft">{{ t('benefits.spendOnly') }}</span>
        </span>
      </div>

      <!-- 金额(港币扣款;可自定义输入,附当地货币换算条) -->
      <div class="amt-box">
        <div class="row-b">
          <span class="meta">{{ t('topup.amount') }}</span>
          <span class="meta" style="font-size:11px">{{ t('topup.customHint') }}</span>
        </div>
        <div class="amt-row">
          <span class="amt-cur">HK$</span>
          <input v-model="amt" class="amt-input num" inputmode="decimal" :aria-label="t('topup.amount')" />
        </div>
        <!-- 本地货币换算(V2.12):旗标 + 高对比金条;同币种不显示(§9.1) -->
        <div v-if="localAmtEst" class="loc-conv">
          <span class="flag" aria-hidden="true">{{ currencyFlag(localCurrency) }}</span>
          <span class="lbl">{{ t('topup.localConv') }}</span>
          <b class="amt num">{{ localAmtEst.text }}</b>
          <span class="cur num">{{ localCurrency }}</span>
        </div>
        <div class="chips" style="margin-top:12px">
          <button v-for="p in PRESETS" :key="p" class="chip gold" :class="{ on: parsed === p }" @click="setPreset(p)">
            <span class="num">{{ p.toLocaleString(prefs.uiLocale) }}</span>
          </button>
        </div>
      </div>

      <!-- 费用摘要:港币扣款,到账按汇率实时换汇为美元 -->
      <div class="card">
        <div class="kv">
          <span class="k">
            {{ t('topup.creditAmount') }}
            <span class="meta" style="display:block;margin-top:2px;font-size:11px">{{ t('topup.creditConverted', { rate: rateText }) }}</span>
          </span>
          <span class="v num">{{ USD(creditUSD) }}</span>
        </div>
        <div class="kv"><span class="k">{{ t('topup.fee', { rate: 16 }) }}</span><span class="v num">{{ HKD(fee) }}</span></div>
        <div class="kv">
          <span class="k">
            {{ t('topup.estPay') }}
            <span v-if="localTotalEst" class="meta" style="display:block;margin-top:2px;font-size:11px">
              <span aria-hidden="true">{{ currencyFlag(localCurrency) }}</span>
              ≈ <b class="num" style="color:var(--accent-ink)">{{ localTotalEst.text }}</b> · {{ localTotalEst.rateNote }}
            </span>
          </span>
          <span class="v num" style="font-weight:700">{{ HKD(total) }}</span>
        </div>
      </div>

      <!-- 付款前固定披露(评审 §3.4) -->
      <QuoteDisclosure :quote="quote" style="margin-top:10px" />

      <!-- 支付方式:法币通道 -->
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
        class="pm-row" :class="{ on: fiatMethod === m.id }"
        @click="pay.method = m.id"
      >
        <span class="pm-ic" :class="m.id">
          <svg class="ic"><use href="#i-card"/></svg>
        </span>
        <span style="flex:1;min-width:0">
          <span class="pm-name">{{ t(m.nameKey) }}</span>
          <span v-if="m.subKey" class="pm-sub">{{ t(m.subKey) }}</span>
        </span>
        <span class="ckdot" :class="{ on: fiatMethod === m.id }"></span>
      </button>

      <!-- 虚拟币入口引导 -->
      <button class="lnk-row" @click="show('topup-crypto')">
        <span>{{ t('topup.goCrypto') }}</span>
        <svg class="ic sm"><use href="#i-right"/></svg>
      </button>

      <p class="meta" style="margin-top:12px">{{ t('topup.note') }}</p>

      <!-- 吸底支付栏 -->
      <div class="paybar">
        <button class="paybar-mth" @click="payNow">
          <span class="pm-ic sm card">
            <svg class="ic"><use href="#i-card"/></svg>
          </span>
          <span class="paybar-mth-t">
            <b>{{ HKD(total) }}</b>
            <span>{{ payMethodName(fiatMethod) }}</span>
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
