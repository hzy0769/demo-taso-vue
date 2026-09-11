<script setup lang="ts">
import { app, show, fmt } from '../store'
import { card } from '../card'
import PageHeader from '../components/PageHeader.vue'
import TasoCard from '../components/TasoCard.vue'
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'my-card' }" data-screen="my-card">
    <PageHeader title="我的会员卡" />
    <TasoCard pan="•••• •••• •••• 3812" style="cursor:pointer" @click="show('card-detail')">
      <template #top-right>
        <span class="badge ok">已激活</span>
      </template>
      <div class="row-b" style="margin-top:14px">
        <span class="meta" style="color:color-mix(in oklch,var(--fg) 62%,transparent)">Alex · 09/28</span>
        <span class="meta" style="color:color-mix(in oklch,var(--fg) 62%,transparent)">GOLD MEMBER</span>
      </div>
    </TasoCard>
    <div class="card" style="margin-top:14px">
      <div class="row-b">
        <span class="meta">卡内余额</span>
        <span class="badge soft">仅限消费 · 不可提现</span>
      </div>
      <div class="num" style="font-size:24px;font-weight:700;margin-top:4px">US$ {{ fmt(app.bal) }}</div>
      <div class="row" style="margin-top:14px;gap:10px">
        <button class="btn btn-p" style="flex:1" @click="show('topup')">充值</button>
        <button class="btn btn-o" style="flex:1" @click="show('transactions')">消费记录</button>
      </div>
    </div>
    <div class="card" style="margin-top:14px;padding:4px 14px">
      <button class="li" @click="show('card-apply')">
        <span class="li-ic"><svg class="ic"><use href="#i-card"/></svg></span>
        <span class="li-title">申请实体卡</span><span class="li-val num">HK$1,000/张</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button v-if="card.order" class="li" @click="show('card-tracking')">
        <span class="li-ic"><svg class="ic"><use href="#i-send"/></svg></span>
        <span class="li-title">配送追踪</span><span class="badge warn">制作 / 配送中</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" @click="show('card-detail')">
        <span class="li-ic"><svg class="ic"><use href="#i-lock"/></svg></span>
        <span class="li-title">卡片管理</span><span class="li-val">冻结 / 补卡 / 交易通知</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
    </div>
  </section>
</template>
