<script setup lang="ts">
import { ref } from 'vue'
import { app, toast } from '../store'
import { t } from '../i18n'
import { fmtMoney } from '../i18n/format'
import PageHeader from '../components/PageHeader.vue'
import TasoCard from '../components/TasoCard.vue'

const frozen = ref(false)
const USD = (n: number) => fmtMoney({ amount: n, currency: 'USD' })

function toggleFreeze() {
  const wasFrozen = frozen.value
  frozen.value = !wasFrozen
  toast(t(wasFrozen ? 'card.detail.unfrozenToast' : 'card.detail.frozenToast'))
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'card-detail' }" data-screen="card-detail">
    <PageHeader :title="t('card.detail.title')">
      <template #right>
        <button class="bk" :aria-label="t('a11y.more')" @click="toast(t('profile.moreToast'))"><svg class="ic"><use href="#i-more"/></svg></button>
      </template>
    </PageHeader>
    <TasoCard pan="•••• •••• •••• 3812" style="margin-top:10px">
      <template #top-right>
        <span class="badge ok" style="background:color-mix(in oklch,var(--ok) 18%,transparent)">{{ t('mycard.activated') }}</span>
      </template>
      <div class="row-b" style="margin-top:14px">
        <span class="meta" style="color:color-mix(in oklch,var(--fg) 62%,transparent)">Alex · 09/28</span>
        <span class="visa">VISA</span>
      </div>
    </TasoCard>
    <div class="card" style="margin-top:14px">
      <div class="kv"><span class="k">{{ t('benefits.cardBalance') }}</span><span class="v num">{{ USD(12580) }}</span></div>
      <div class="kv"><span class="k">{{ t('card.detail.monthSpend') }}</span><span class="v num">{{ USD(3920) }}</span></div>
      <div class="kv"><span class="k">{{ t('card.detail.partnerSaved') }}</span><span class="v num gold">{{ USD(280) }}</span></div>
    </div>
    <div class="card" style="margin-top:14px;padding:4px 14px">
      <button class="li" @click="toggleFreeze">
        <span class="li-ic"><svg class="ic"><use href="#i-lock"/></svg></span>
        <span class="li-title">{{ t(frozen ? 'card.detail.unfreeze' : 'card.detail.freeze') }}</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" @click="toast(t('card.detail.txNotifyToast'))">
        <span class="li-ic"><svg class="ic"><use href="#i-bell"/></svg></span>
        <span class="li-title">{{ t('card.detail.txNotify') }}</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" @click="toast(t('card.detail.panToast'))">
        <span class="li-ic"><svg class="ic"><use href="#i-eye"/></svg></span>
        <span class="li-title">{{ t('card.detail.viewPan') }}</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" @click="toast(t('card.detail.replaceToast', { a: 5, b: 7 }))">
        <span class="li-ic"><svg class="ic"><use href="#i-refresh"/></svg></span>
        <span class="li-title">{{ t('card.detail.replace') }}</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
    </div>
  </section>
</template>
