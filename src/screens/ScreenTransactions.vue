<script setup lang="ts">
import { computed, ref } from 'vue'
import { app } from '../store'
import { CARD_TX, CARD_TX_FILTERS, type TxItem, type TxCat } from '../data'
import { t } from '../i18n'
import { fmtMoney, fmtDate } from '../i18n/format'
import PageHeader from '../components/PageHeader.vue'

const filter = ref<string>('all')

const chips = computed(() => CARD_TX_FILTERS.map(k => ({ k, label: t(`tx.cat.${k}`) })))

/** 筛选:类别匹配;fee 筛选手续费行 */
function match(tx: TxItem, f: string): boolean {
  if (f === 'all') return true
  if (f === 'fee') return !!tx.fee
  return tx.cat === (f as TxCat)
}
const list = computed(() => CARD_TX.filter(tx => match(tx, filter.value)))

const title = (tx: TxItem) => t(tx.titleKey, tx.titleParams)
const sub = (tx: TxItem) =>
  tx.fee ? t('tx.sub.fee', { amount: fmtMoney(tx.fee) })
  : tx.subKey ? t(tx.subKey, tx.subParams)
  : ''
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'transactions' }" data-screen="transactions">
    <PageHeader :title="t('tx.titleCard')">
      <template #right>
        <span class="badge soft">{{ t('tx.noWithdraw') }}</span>
      </template>
    </PageHeader>
    <p class="meta" style="margin-top:6px">{{ t('tx.introCard') }}</p>
    <div class="chips" style="margin-top:10px">
      <button
        v-for="f in chips" :key="f.k"
        class="chip" :class="{ on: filter === f.k }"
        @click="filter = f.k"
      >{{ f.label }}</button>
    </div>
    <div class="stack" style="margin-top:14px">
      <div v-for="tx in list" :key="tx.ref" class="card">
        <div class="row-b">
          <div>
            <b style="font-size:14px">{{ title(tx) }}</b>
            <p class="meta">{{ fmtDate(tx.at) }} · {{ tx.ref }}</p>
          </div>
          <div style="text-align:right">
            <div class="num" :class="{ ok: tx.sign === '+' }">{{ fmtMoney(tx.amount, { sign: tx.sign }) }}</div>
            <div class="meta">{{ sub(tx) }}</div>
          </div>
        </div>
        <span class="badge" :class="tx.status === 'pending' ? 'warn' : 'ok'" style="margin-top:8px">{{ t(`tx.status.${tx.status}`) }}</span>
      </div>
    </div>
  </section>
</template>
