<script setup lang="ts">
import { computed } from 'vue'
import { app, show, toast } from '../store'
import { CARD_FEE_HKD, card } from '../card'
import { t } from '../i18n'
import { fmtMoney } from '../i18n/format'
import PageHeader from '../components/PageHeader.vue'
import TasoCard from '../components/TasoCard.vue'

/** P01 实体会员卡申请入口(全球配送 PRD §4):卡片展示 + 配送权益 + 费用提示 */

const perks = computed(() => [
  t('card.apply.perk1'),
  t('card.apply.perk2'),
  t('card.apply.perk3'),
])

function track() {
  if (!card.order) {
    toast(t('card.apply.noOrder'))
    return
  }
  show('card-tracking')
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'card-apply' }" data-screen="card-apply">
    <PageHeader :title="t('card.apply.title')" />
    <TasoCard pan="•••• •••• •••• ••••" style="margin-top:10px">
      <p class="meta" style="margin-top:12px;color:color-mix(in oklch,var(--fg) 62%,transparent)">Physical Member Card</p>
      <div style="font-size:17px;font-weight:700;margin-top:2px">{{ t('card.apply.shipAfter') }}</div>
    </TasoCard>
    <div class="card" style="margin-top:14px;padding:4px 14px">
      <div v-for="p in perks" :key="p" class="li" style="border:0">
        <svg class="ic ok"><use href="#i-check"/></svg><span class="li-title">{{ p }}</span>
      </div>
    </div>
    <div class="card" style="margin-top:14px">
      <div class="kv"><span class="k">{{ t('card.apply.fee') }}</span><span class="v num">{{ t('money.perCard', { price: fmtMoney({ amount: CARD_FEE_HKD, currency: 'HKD' }) }) }}</span></div>
      <div class="kv"><span class="k">{{ t('card.apply.shippingFee') }}</span><span class="v">{{ t('card.apply.calcAtCheckout') }}</span></div>
    </div>
    <button class="btn btn-gold" style="margin-top:16px" @click="show('card-address')">{{ t('card.apply.btn') }}</button>
    <button class="btn btn-o" style="margin-top:10px" @click="track">{{ t('card.apply.viewTracking') }}</button>
    <p class="meta" style="margin-top:12px">{{ t('card.apply.note') }}</p>
  </section>
</template>
