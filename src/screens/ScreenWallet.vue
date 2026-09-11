<script setup lang="ts">
import { app, show, fmt } from '../store'
import PageHeader from '../components/PageHeader.vue'
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'wallet' }" data-screen="wallet">
    <PageHeader title="钱包">
      <template #right>
        <button class="bk" aria-label="明细" @click="show('wallet-transactions')"><svg class="ic"><use href="#i-receipt"/></svg></button>
      </template>
    </PageHeader>
    <div class="card" style="margin-top:8px">
      <div class="row-b" style="margin-bottom:6px">
        <span class="meta">收益账户 · 与会员卡相互独立</span>
        <span class="badge soft">可提现</span>
      </div>
      <div class="kv"><span class="k">创作收益</span><span class="v num">US$ 620.00</span></div>
      <div class="kv"><span class="k">推广奖励</span><span class="v num">US$ 180.00</span></div>
      <div class="kv"><span class="k">股东分红</span><span class="v num">US$ 51,310.00</span></div>
      <div class="kv"><span class="k">待结算报销</span><span class="v num warn">US$ 1,240.00</span></div>
      <div class="kv"><span class="k">冻结金额</span><span class="v num">US$ 300.00</span></div>
      <div class="kv" style="border-top:1px solid var(--fg);margin-top:4px">
        <span class="k" style="font-weight:600">可提现余额</span>
        <span class="v num" style="font-weight:700">US$ {{ fmt(app.wd) }}</span>
      </div>
    </div>
    <p class="meta" style="margin-top:10px">钱包汇集推广、创作、分红、报销等收益，不含会员卡余额；各账本独立管理、互不混用，可提现余额以入账状态为准。</p>
    <div class="row" style="margin-top:16px;gap:10px">
      <button class="btn btn-p" style="flex:1" @click="show('withdraw')">提现</button>
      <button class="btn btn-o" style="flex:1" @click="show('wallet-transactions')">交易明细</button>
    </div>
  </section>
</template>
