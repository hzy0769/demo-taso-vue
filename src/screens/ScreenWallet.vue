<script setup lang="ts">
import { app, show } from '../store'
import PageHeader from '../components/PageHeader.vue'
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'wallet' }" data-screen="wallet">
    <PageHeader title="钱包">
      <template #right>
        <button class="bk" aria-label="明细" @click="show('transactions')"><svg class="ic"><use href="#i-receipt"/></svg></button>
      </template>
    </PageHeader>
    <div class="card" style="margin-top:8px">
      <div class="kv"><span class="k">可用消费余额</span><span class="v num">US$ 10,500.00</span></div>
      <div class="kv"><span class="k">创作收益</span><span class="v num">US$ 620.00</span></div>
      <div class="kv"><span class="k">推广奖励</span><span class="v num">US$ 180.00</span></div>
      <div class="kv"><span class="k">待结算报销</span><span class="v num warn">US$ 1,240.00</span></div>
      <div class="kv"><span class="k">冻结金额</span><span class="v num">US$ 300.00</span></div>
    </div>
    <p class="meta" style="margin-top:10px">各余额按账本类型独立管理，互不混用；余额仅限平台内使用，不支持提现。</p>
    <button class="btn btn-o" style="margin-top:16px;width:100%" @click="show('transactions')">交易明细</button>
  </section>
</template>
