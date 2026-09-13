<script setup lang="ts">
import { computed, ref } from 'vue'
import { app, show, toast } from '../store'
import { CARD_FEE_HKD, card, etaRange, etaText, methodOf, methodName, phoneText, submitOrder, addrLines } from '../card'
import { t, FX_UPDATED_AT } from '../i18n'
import { fmtMoney, fmtDate } from '../i18n/format'
import { pay, payMethodName, startCard, startCrypto, startWallet, openPicker, lastPaidText, hkdToUsd, HKD_USD_RATE, type PayRequest, type Quote } from '../pay'
import PageHeader from '../components/PageHeader.vue'
import QuoteDisclosure from '../components/QuoteDisclosure.vue'

/**
 * P04 确认申请(全球配送 PRD §12 + V2.3 支付):
 * 汇总卡片 / 地址 / 配送方式 / 费用 + 地址确认勾选 + 支付方式选择;
 * 支付成功后才生成申请单(P05)。注册主体在香港:办理费与配送费均为
 * 港币定价、合并港币支付(V2.4),Visa 美元账户按汇率实时换汇入账;
 * USDT / USDC 与美元 1:1,支付数量 = 港币总额按同一汇率折算的美元数。
 */

const lines = computed(() => addrLines(card.draft))
const method = computed(() => methodOf(card.method))
const eta = computed(() => { const [a, b] = etaRange(method.value.days); return etaText(a, b) })
const feeText = (fee: number) => (fee ? fmtMoney({ amount: fee, currency: 'HKD' }) : t('common.free'))
const hkdFee = computed(() => fmtMoney({ amount: CARD_FEE_HKD, currency: 'HKD' }))
const total = computed(() => fmtMoney({ amount: CARD_FEE_HKD + method.value.fee, currency: 'HKD' }))

const confirmed = ref(false)
const submitting = ref(false)

/** 加密支付所需美元等值:港币总额(办理费 + 配送费)按汇率折算(估算,§9.1) */
const totalUSD = computed(() => hkdToUsd(CARD_FEE_HKD + method.value.fee))

const isCryptoSel = computed(() => pay.method === 'usdt' || pay.method === 'usdc')
const cryptoAsset = computed(() => (pay.method === 'usdt' ? 'USDT' : 'USDC'))

/** 付款前披露(评审 §3.4):办理费以 HKD 计价扣款,按汇率换汇入账并附时点 */
const quote = computed<Quote>(() => ({
  priceCurrency: 'HKD',
  chargeCurrency: isCryptoSel.value ? cryptoAsset.value : 'HKD',
  fxNote: t('quote.fxNote', { rate: HKD_USD_RATE.toFixed(4), time: fmtDate(FX_UPDATED_AT) }),
  platformFee: { label: t('card.review.cardFee'), money: hkdFee.value },
  networkFee: isCryptoSel.value
    ? { label: t('quote.networkFee'), money: t('quote.borneBySender') }
    : undefined,
  tax: { label: t('quote.tax'), money: t('quote.taxIncluded') },
  arrival: { label: t('quote.arrivalCard'), money: `${methodName(method.value)} · ${eta.value}` },
  refund: t('quote.refundCard'),
  payee: t('quote.payee'),
  support: t('quote.support'),
}))

function buildRequest(): PayRequest {
  const isCrypto = pay.method === 'usdt' || pay.method === 'usdc'
  return {
    purpose: 'card',
    lines: [
      { label: t('card.review.cardFee'), money: hkdFee.value },
      ...(method.value.fee ? [{ label: t('card.review.shippingFee'), money: feeText(method.value.fee) }] : []),
    ],
    totalText: isCrypto ? fmtMoney({ amount: totalUSD.value, currency: 'USD' }) : total.value,
    amountUSD: totalUSD.value,
    quote: quote.value,
    onSuccess: () => {
      submitting.value = true
      setTimeout(() => {
        submitOrder(lastPaidText())
        submitting.value = false
        show('card-success')
      }, 600)
    },
  }
}

function payAndSubmit() {
  if (!confirmed.value) {
    toast(t('card.review.confirmFirst'))
    return
  }
  if (submitting.value) return
  const m = pay.method
  const req = buildRequest()
  if (m === 'apple-pay' || m === 'google-pay') startWallet(m, req)
  else if (m === 'card') { startCard(req); show('pay-card') }
  else { startCrypto(m as 'usdt' | 'usdc', req); show('pay-crypto') }
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'card-review' }" data-screen="card-review">
    <PageHeader :title="t('card.review.title')" />
    <div class="card" style="margin-top:8px">
      <div class="row" style="gap:12px">
        <span class="li-ic"><svg class="ic"><use href="#i-card"/></svg></span>
        <span style="flex:1">
          <b style="font-size:14px">{{ t('card.review.product') }}</b>
          <p class="meta" style="margin-top:2px">{{ t('card.review.productSub') }}</p>
        </span>
        <span class="num" style="font-size:14px;font-weight:700">{{ hkdFee }}</span>
      </div>
    </div>

    <div class="card" style="margin-top:12px">
      <div class="row-b" style="align-items:flex-start">
        <span class="meta">{{ t('card.review.address') }}</span>
        <button class="edit-btn" @click="show('card-address')">{{ t('common.edit') }}</button>
      </div>
      <div style="margin-top:6px">
        <b style="font-size:14px">{{ lines[0] }}</b>
        <p v-for="(l, i) in lines.slice(1)" :key="i" style="font-size:13px;color:var(--muted);margin-top:2px">{{ l }}</p>
        <p class="meta" style="margin-top:4px">{{ phoneText(card.draft) }}</p>
      </div>
    </div>

    <div class="card" style="margin-top:12px">
      <div class="row-b">
        <span class="meta">{{ t('card.review.method') }}</span>
        <button class="edit-btn" @click="show('card-shipping')">{{ t('common.edit') }}</button>
      </div>
      <div class="kv" style="margin-top:4px"><span class="k" style="color:var(--fg);font-weight:600">{{ methodName(method) }}</span><span class="v num">{{ feeText(method.fee) }}</span></div>
      <div class="kv"><span class="k">{{ t('card.ship.eta') }}</span><span class="v num">{{ eta }}</span></div>
    </div>

    <div class="card" style="margin-top:12px">
      <div class="kv"><span class="k">{{ t('card.review.cardFee') }}</span><span class="v num">{{ hkdFee }}</span></div>
      <div class="kv"><span class="k">{{ t('card.review.shippingFee') }}</span><span class="v num">{{ feeText(method.fee) }}</span></div>
      <div class="kv"><span class="k" style="font-weight:600;color:var(--fg)">{{ t('card.review.total') }}</span><span class="v num" style="font-weight:700">{{ total }}</span></div>
    </div>

    <!-- 付款前固定披露(评审 §3.4):随所选支付方式更新 -->
    <QuoteDisclosure :quote="quote" style="margin-top:10px" />

    <!-- 支付方式 -->
    <div class="card" style="margin-top:12px">
      <div class="row-b">
        <span class="meta">{{ t('card.review.payment') }}</span>
        <button class="edit-btn" @click="openPicker()">{{ t('common.change') }}</button>
      </div>
      <div class="row" style="gap:12px;margin-top:8px">
        <span class="pm-ic" :class="pay.method">
          <svg v-if="pay.method === 'card'" class="ic"><use href="#i-card"/></svg>
          <svg v-else-if="pay.method === 'usdt'" class="pm-logo" viewBox="0 0 24 24"><use href="#pm-usdt"/></svg>
          <svg v-else-if="pay.method === 'usdc'" class="pm-logo" viewBox="0 0 24 24"><use href="#pm-usdc"/></svg>
          <svg v-else class="pm-logo" viewBox="0 0 24 24"><use :href="pay.method === 'apple-pay' ? '#logo-apple' : '#logo-google'"/></svg>
        </span>
        <b style="flex:1;font-size:14px">{{ payMethodName(pay.method) }}</b>
      </div>
      <p v-if="pay.method === 'usdt' || pay.method === 'usdc'" class="meta" style="margin-top:6px">
        {{ t('pay.crypto.cardEstimate', { amount: fmtMoney({ amount: totalUSD, currency: 'USD' }) }) }}
      </p>
    </div>

    <button class="ckrow" style="margin-top:16px" @click="confirmed = !confirmed">
      <span class="ckbox" :class="{ on: confirmed }">
        <svg v-if="confirmed" class="ic sm" style="color:var(--surface)"><use href="#i-check"/></svg>
      </span>
      <span>{{ t('card.review.confirmAddr') }}</span>
    </button>

    <p class="meta" style="margin-top:12px">{{ t('card.review.note') }}</p>

    <div class="paybar">
      <span class="paybar-total">
        <span class="meta">{{ t('card.review.total') }}</span>
        <b class="num">{{ total }}</b>
      </span>
      <button class="btn btn-gold paybar-btn" :disabled="!confirmed || submitting" @click="payAndSubmit">
        <span v-if="submitting" class="spin"></span>
        {{ submitting ? t('card.review.submitting') : t('card.review.payAndSubmit') }}
      </button>
    </div>
  </section>
</template>
