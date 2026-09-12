<script setup lang="ts">
import { app, show, toast } from '../store'
import { card, CARD_FEE_HKD, etaText } from '../card'
import { t } from '../i18n'
import { fmtMoney } from '../i18n/format'
import PageHeader from '../components/PageHeader.vue'

/** P05 申请成功(全球配送 PRD §17):申请编号 + 预计送达 + 追踪入口 */

function copyId() {
  const id = card.order?.id
  if (!id) return
  navigator.clipboard?.writeText(id)
    .then(() => toast(t('card.success.copied')))
    .catch(() => toast(id))
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'card-success' }" data-screen="card-success">
    <PageHeader :title="t('card.success.title')" :back-btn="false" />
    <div v-if="card.order" style="display:flex;flex-direction:column;align-items:center;padding-top:40px;text-align:center">
      <span style="width:76px;height:76px;border-radius:50%;background:var(--ok-soft);display:grid;place-items:center">
        <svg class="ic" style="width:36px;height:36px;color:var(--ok);stroke-width:2.4"><use href="#i-check"/></svg>
      </span>
      <h2 style="font-size:20px;font-weight:700;margin-top:16px">{{ t('card.success.submitted') }}</h2>
      <p style="font-size:14px;color:var(--muted);margin-top:6px">{{ t('card.success.making') }}</p>

      <div class="card" style="margin-top:22px;width:100%;text-align:left">
        <div class="row-b">
          <span class="k" style="font-size:13px;color:var(--muted)">{{ t('card.success.appId') }}</span>
          <button class="edit-btn" :aria-label="t('a11y.copyApplicationId')" @click="copyId"><svg class="ic sm"><use href="#i-copy"/></svg></button>
        </div>
        <p class="num" style="font-size:16px;font-weight:700;margin-top:2px">{{ card.order.id }}</p>
        <div class="kv" style="margin-top:8px"><span class="k">{{ t('card.success.estDelivery') }}</span><span class="v num">{{ etaText(card.order.etaFrom, card.order.etaTo) }}</span></div>
        <div v-if="card.order.paidVia" class="kv"><span class="k">{{ t('pay.paidVia') }}</span><span class="v">{{ card.order.paidVia }}</span></div>
        <div class="kv"><span class="k">{{ t('card.success.cardFeePaid') }}</span><span class="v num">{{ fmtMoney({ amount: CARD_FEE_HKD, currency: 'HKD' }) }}</span></div>
        <div class="kv"><span class="k">{{ t('card.success.shippingPaid') }}</span><span class="v num">{{ card.order.shippingFee ? fmtMoney({ amount: card.order.shippingFee, currency: 'USD' }) : t('common.free') }}</span></div>
      </div>

      <button class="btn btn-p" style="margin-top:20px" @click="show('card-tracking')">{{ t('card.success.viewTracking') }}</button>
      <button class="btn btn-o" style="margin-top:10px" @click="show('benefits')">{{ t('common.done') }}</button>
    </div>

    <div v-else class="card" style="margin-top:20px;text-align:center">
      <p style="font-size:14px;color:var(--muted)">{{ t('card.success.noOrder') }}</p>
      <button class="btn btn-gold" style="margin-top:14px" @click="show('card-apply')">{{ t('card.success.goApply') }}</button>
    </div>
  </section>
</template>
