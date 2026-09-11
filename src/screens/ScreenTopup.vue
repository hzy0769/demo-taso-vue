<script setup lang="ts">
import { computed, ref } from 'vue'
import { app, showDialog, save, toast } from '../store'
import { t } from '../i18n'
import { fmtMoney } from '../i18n/format'
import PageHeader from '../components/PageHeader.vue'

const cur = ref('USD')
const currencies = ['USD', 'USDT', 'USDC']
const amt = ref('10,000.00')

const parsed = computed(() => parseFloat(amt.value.replace(/,/g, '')) || 0)
const FEE_RATE = 0.16
const USD = (n: number) => fmtMoney({ amount: n, currency: 'USD' })

function confirm() {
  if (!parsed.value || parsed.value <= 0) {
    toast(t('topup.invalid'))
    return
  }
  showDialog(
    t('topup.confirmTitle'),
    t('topup.confirmBody', {
      amount: USD(parsed.value),
      rate: 16,
      fee: USD(parsed.value * FEE_RATE),
      total: USD(parsed.value * 1.16),
    }),
    () => {
      app.bal += parsed.value
      save()
      toast(t('topup.success'))
    },
  )
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'topup' }" data-screen="topup">
    <PageHeader :title="t('topup.title')" />
    <div class="field" style="margin-top:8px">
      <label>{{ t('topup.currency') }}</label>
      <div class="chips">
        <button
          v-for="c in currencies" :key="c"
          class="chip" :class="{ on: cur === c }"
          @click="cur = c"
        >{{ c }}</button>
      </div>
    </div>
    <div class="field" style="margin-top:16px">
      <label>{{ t('topup.amount') }}</label>
      <input v-model="amt" class="input num" inputmode="decimal" />
    </div>
    <div class="card" style="margin-top:16px">
      <div class="kv"><span class="k">{{ t('topup.amount') }}</span><span class="v num">{{ USD(parsed) }}</span></div>
      <div class="kv"><span class="k">{{ t('topup.fee', { rate: 16 }) }}</span><span class="v num">{{ USD(parsed * FEE_RATE) }}</span></div>
      <div class="kv"><span class="k">{{ t('topup.estPay') }}</span><span class="v num" style="font-weight:700">{{ USD(parsed * 1.16) }}</span></div>
    </div>
    <p class="meta" style="margin-top:12px">{{ t('topup.note') }}</p>
    <button class="btn btn-p" style="margin-top:20px" @click="confirm">{{ t('topup.btn') }}</button>
  </section>
</template>
