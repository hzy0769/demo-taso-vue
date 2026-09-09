<script setup lang="ts">
import { computed, ref } from 'vue'
import { app } from '../store'
import { TX_FILTERS, TX_LIST } from '../data'
import PageHeader from '../components/PageHeader.vue'

const filter = ref<string>('全部')
const list = computed(() => (filter.value === '全部' ? TX_LIST : TX_LIST.filter(t => t.cat === filter.value)))
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'transactions' }" data-screen="transactions">
    <PageHeader title="交易明细" />
    <div class="chips" style="margin-top:8px">
      <button
        v-for="f in TX_FILTERS" :key="f"
        class="chip" :class="{ on: filter === f }"
        @click="filter = f"
      >{{ f }}</button>
    </div>
    <div class="stack" style="margin-top:14px">
      <div v-for="tx in list" :key="tx.meta" class="card">
        <div class="row-b">
          <div>
            <b style="font-size:14px">{{ tx.title }}</b>
            <p class="meta">{{ tx.meta }}</p>
          </div>
          <div style="text-align:right">
            <div class="num" :class="{ ok: tx.amountOk }">{{ tx.amount }}</div>
            <div class="meta">{{ tx.sub }}</div>
          </div>
        </div>
        <span class="badge" :class="tx.badgeCls" style="margin-top:8px">{{ tx.badge }}</span>
      </div>
    </div>
  </section>
</template>
