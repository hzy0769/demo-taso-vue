<script setup lang="ts">
import { computed } from 'vue'
import { app, show, toast } from '../store'
import { CARD_FEE_HKD, METHODS, card, countryOf, etaRange, etaText, methodOf, methodName, phoneText, addrLines } from '../card'
import { t } from '../i18n'
import { fmtMoney } from '../i18n/format'
import PageHeader from '../components/PageHeader.vue'

/** P03 配送方式(全球配送 PRD §10):地址摘要 + Standard/Express + 费用汇总 */

const country = computed(() => countryOf(card.draft.countryCode))
const lines = computed(() => addrLines(card.draft))
const method = computed(() => methodOf(card.method))

/** 配送费与办理费同为港币定价(V2.4),分开列示、同币种合并合计 */
const feeText = (fee: number) => (fee ? fmtMoney({ amount: fee, currency: 'HKD' }) : t('common.free'))
const etaOf = (days: [number, number]) => { const [a, b] = etaRange(days); return etaText(a, b) }
const hkdFee = computed(() => fmtMoney({ amount: CARD_FEE_HKD, currency: 'HKD' }))
const total = computed(() => fmtMoney({ amount: CARD_FEE_HKD + method.value.fee, currency: 'HKD' }))

function setMethod(code: 'standard' | 'express') {
  if (code === 'express' && country.value && !country.value.express) {
    toast(t('card.ship.expressUnavailable'))
    return
  }
  card.method = code
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'card-shipping' }" data-screen="card-shipping">
    <PageHeader :title="t('card.ship.title')" />
    <div class="card" style="margin-top:8px">
      <div class="row-b" style="align-items:flex-start">
        <span class="meta">{{ t('addr.deliverTo') }}</span>
        <button class="edit-btn" @click="show('card-address')">{{ t('common.edit') }}</button>
      </div>
      <div style="margin-top:6px">
        <b style="font-size:14px">{{ lines[0] }}</b>
        <p v-for="(l, i) in lines.slice(1)" :key="i" style="font-size:13px;color:var(--muted);margin-top:2px">{{ l }}</p>
        <p class="meta" style="margin-top:4px">{{ phoneText(card.draft) }}</p>
      </div>
    </div>

    <div class="field" style="margin-top:16px">
      <label>{{ t('card.ship.options') }}</label>
      <button
        v-for="m in METHODS" :key="m.code"
        class="opt"
        :class="{ on: card.method === m.code, dis: m.code === 'express' && !country?.express }"
        @click="setMethod(m.code)"
      >
        <span class="dot"></span>
        <span style="flex:1;min-width:0">
          <b style="font-size:14px">{{ methodName(m) }}</b>
          <p class="meta" style="margin-top:3px">{{ t('card.ship.eta') }} {{ etaOf(m.days) }} · <span style="white-space:nowrap">{{ t('card.ship.days', { a: m.days[0], b: m.days[1] }) }}</span></p>
          <p v-if="m.code === 'express' && !country?.express" class="ferr" style="margin-top:3px">{{ t('card.ship.expressInline') }}</p>
        </span>
        <b class="num" style="flex:none;font-size:14px">{{ feeText(m.fee) }}</b>
      </button>
    </div>

    <div class="card" style="margin-top:16px">
      <div class="kv"><span class="k">{{ t('card.ship.cardFee') }}</span><span class="v num">{{ hkdFee }}</span></div>
      <div class="kv"><span class="k">{{ t('card.ship.shippingFeeMethod', { method: methodName(method) }) }}</span><span class="v num">{{ feeText(method.fee) }}</span></div>
      <div class="kv"><span class="k" style="font-weight:600;color:var(--fg)">{{ t('card.ship.total') }}</span><span class="v num" style="font-weight:700">{{ total }}</span></div>
    </div>

    <button class="btn btn-gold" style="margin-top:16px" @click="show('card-review')">{{ t('common.continue') }}</button>
    <p class="meta" style="margin-top:12px">{{ t('card.ship.note') }}</p>
  </section>
</template>
