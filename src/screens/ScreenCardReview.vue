<script setup lang="ts">
import { computed, ref } from 'vue'
import { app, show, toast } from '../store'
import { CARD_FEE_HKD, card, etaRange, etaText, methodOf, methodName, phoneText, submitOrder, addrLines } from '../card'
import { t } from '../i18n'
import { fmtMoney } from '../i18n/format'
import PageHeader from '../components/PageHeader.vue'

/** P04 确认申请(全球配送 PRD §12):汇总卡片 / 地址 / 配送方式 / 费用 + 地址确认勾选 */

const lines = computed(() => addrLines(card.draft))
const method = computed(() => methodOf(card.method))
const eta = computed(() => { const [a, b] = etaRange(method.value.days); return etaText(a, b) })
const feeText = (fee: number) => (fee ? fmtMoney({ amount: fee, currency: 'USD' }) : t('common.free'))
const hkdFee = computed(() => fmtMoney({ amount: CARD_FEE_HKD, currency: 'HKD' }))
const total = computed(() =>
  method.value.fee ? t('card.ship.totalSplit', { a: hkdFee.value, b: fmtMoney({ amount: method.value.fee, currency: 'USD' }) }) : hkdFee.value)

const confirmed = ref(false)
const submitting = ref(false)

function submit() {
  if (!confirmed.value) {
    toast(t('card.review.confirmFirst'))
    return
  }
  if (submitting.value) return
  submitting.value = true
  // 演示态:模拟提交/支付请求(§31 提交按钮需有明确 Loading 状态)
  setTimeout(() => {
    submitOrder()
    submitting.value = false
    show('card-success')
  }, 900)
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

    <button class="ckrow" style="margin-top:16px" @click="confirmed = !confirmed">
      <span class="ckbox" :class="{ on: confirmed }">
        <svg v-if="confirmed" class="ic sm" style="color:var(--surface)"><use href="#i-check"/></svg>
      </span>
      <span>{{ t('card.review.confirmAddr') }}</span>
    </button>

    <button class="btn btn-gold" style="margin-top:18px" :disabled="!confirmed || submitting" @click="submit">
      <span v-if="submitting" class="spin"></span>
      {{ submitting ? t('card.review.submitting') : t('card.review.submit') }}
    </button>
    <p class="meta" style="margin-top:12px">{{ t('card.review.note') }}</p>
  </section>
</template>
