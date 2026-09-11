<script setup lang="ts">
import { computed, ref } from 'vue'
import { app, show } from '../store'
import { WALLET_TX, WALLET_TX_FILTERS } from '../data'
import PageHeader from '../components/PageHeader.vue'

const filter = ref<string>('全部')
const list = computed(() => (filter.value === '全部' ? WALLET_TX : WALLET_TX.filter(t => t.cat === filter.value)))
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'wallet-transactions' }" data-screen="wallet-transactions">
    <PageHeader title="钱包明细">
      <template #right>
        <span class="badge soft">收益账户</span>
      </template>
    </PageHeader>
    <p class="meta" style="margin-top:6px">钱包账户流水：报销、创作、推广、分红等收益与提现；会员卡充值与消费请前往「会员卡 · 消费记录」查看。</p>
    <div class="chips" style="margin-top:10px">
      <button
        v-for="f in WALLET_TX_FILTERS" :key="f"
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
    <button class="btn btn-p" style="margin-top:16px" @click="show('withdraw')">去提现</button>
  </section>
</template>
