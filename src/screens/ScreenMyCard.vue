<script setup lang="ts">
import { app, show } from '../store'
import { card, CARD_FEE_HKD } from '../card'
import { t } from '../i18n'
import { fmtMoney } from '../i18n/format'
import PageHeader from '../components/PageHeader.vue'
import TasoCard from '../components/TasoCard.vue'

const USD = (n: number) => fmtMoney({ amount: n, currency: 'USD' })
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'my-card' }" data-screen="my-card">
    <PageHeader :title="t('mycard.title')" />
    <TasoCard pan="•••• •••• •••• 3812" style="cursor:pointer" @click="show('card-detail')">
      <template #top-right>
        <span class="badge ok">{{ t('mycard.activated') }}</span>
      </template>
      <div class="row-b" style="margin-top:14px">
        <span class="meta" style="color:color-mix(in oklch,var(--fg) 62%,transparent)">Alex · 09/28</span>
        <span class="meta" style="color:color-mix(in oklch,var(--fg) 62%,transparent)">GOLD MEMBER</span>
      </div>
    </TasoCard>
    <div class="card" style="margin-top:14px">
      <div class="row-b">
        <span class="meta">{{ t('benefits.cardBalance') }}</span>
        <span class="badge soft">{{ t('benefits.spendOnly') }}</span>
      </div>
      <div class="num" style="font-size:24px;font-weight:700;margin-top:4px">{{ USD(app.bal) }}</div>
      <div class="row" style="margin-top:14px;gap:10px">
        <button class="btn btn-p" style="flex:1" @click="show('topup-fiat')">{{ t('topup.fiatTitle') }}</button>
        <button class="btn btn-gold" style="flex:1" @click="show('topup-crypto')">{{ t('topup.cryptoTitle') }}</button>
      </div>
      <button class="btn btn-o" style="margin-top:10px" @click="show('transactions')">{{ t('benefits.spendRecords') }}</button>
    </div>
    <div class="card" style="margin-top:14px;padding:4px 14px">
      <button class="li" @click="show('card-apply')">
        <span class="li-ic"><svg class="ic"><use href="#i-card"/></svg></span>
        <span class="li-title">{{ t('mycard.applyPhysical') }}</span><span class="li-val num">{{ t('money.perCard', { price: fmtMoney({ amount: CARD_FEE_HKD, currency: 'HKD' }) }) }}</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button v-if="card.order" class="li" @click="show('card-tracking')">
        <span class="li-ic"><svg class="ic"><use href="#i-send"/></svg></span>
        <span class="li-title">{{ t('mycard.tracking') }}</span><span class="badge warn">{{ t('mycard.makingBadge') }}</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" @click="show('card-detail')">
        <span class="li-ic"><svg class="ic"><use href="#i-lock"/></svg></span>
        <span class="li-title">{{ t('mycard.manage') }}</span><span class="li-val">{{ t('mycard.manageSub') }}</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
    </div>
  </section>
</template>
