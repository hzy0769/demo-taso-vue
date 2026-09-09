<script setup lang="ts">
import { app, toast } from '../store'
import PageHeader from '../components/PageHeader.vue'

const records = [
  { date: '09/09', amount: 'HK$ 0.40' },
  { date: '09/08', amount: 'HK$ 0.40' },
  { date: '09/07', amount: 'HK$ 0.40' },
]
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'reimburse-detail' }" data-screen="reimburse-detail">
    <PageHeader title="消费报销 #R202609081288" />
    <div class="card" style="margin-top:8px">
      <div class="kv"><span class="k">商家</span><span class="v">焼肉Taso</span></div>
      <div class="kv"><span class="k">消费日期</span><span class="v num">2026-09-08</span></div>
      <div class="kv"><span class="k">原始消费</span><span class="v num">HK$800.00</span></div>
      <div class="kv"><span class="k">审核金额</span><span class="v num">HK$800.00</span></div>
      <div class="kv"><span class="k">权益上限</span><span class="v num gold">HK$928.00</span></div>
    </div>
    <div class="card" style="margin-top:12px">
      <div class="row-b"><span class="meta">结算进度</span><span class="num">62%</span></div>
      <div class="prog" style="margin-top:8px"><i style="width:62%"></i></div>
      <div class="row" style="margin-top:12px;gap:8px">
        <div style="flex:1"><div class="meta">已结算</div><div class="num" style="font-weight:600">HK$ 120.00</div></div>
        <div style="flex:1"><div class="meta">今日预计</div><div class="num" style="font-weight:600">HK$ 0.40</div></div>
        <div style="flex:1"><div class="meta">剩余</div><div class="num" style="font-weight:600">HK$ 808.00</div></div>
      </div>
    </div>
    <h3 style="font-size:15px;font-weight:600;margin:18px 0 10px">结算记录</h3>
    <div class="card" style="padding:4px 14px">
      <div v-for="r in records" :key="r.date" class="li" style="border:0">
        <span class="meta">{{ r.date }}</span>
        <span class="li-title num">{{ r.amount }}</span>
        <span class="badge ok">已入账</span>
      </div>
    </div>
    <button class="btn btn-o" style="margin-top:16px" @click="toast('原始凭证为隐私数据，仅审核员可见')">查看原始凭证</button>
  </section>
</template>
