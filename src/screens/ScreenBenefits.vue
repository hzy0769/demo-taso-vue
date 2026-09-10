<script setup lang="ts">
import { app, show, fmt } from '../store'
import PageHeader from '../components/PageHeader.vue'
import TasoCard from '../components/TasoCard.vue'
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'benefits' }" data-screen="benefits">
    <PageHeader title="我的会员卡" :back-btn="false">
      <template #right>
        <button class="bk" aria-label="设置" @click="show('settings')"><svg class="ic"><use href="#i-settings"/></svg></button>
      </template>
    </PageHeader>
    <TasoCard pan="•••• •••• •••• 3812" style="cursor:pointer" @click="show('card-detail')">
      <div class="row-b" style="margin-top:14px">
        <span class="meta" style="color:color-mix(in oklch,var(--fg) 62%,transparent)">Alex · 09/28</span>
        <span class="meta" style="color:color-mix(in oklch,var(--fg) 62%,transparent)">GOLD MEMBER</span>
      </div>
    </TasoCard>
    <div class="card" style="margin-top:14px">
      <div class="row-b">
        <span class="meta">可用余额</span>
        <span class="num" style="font-size:24px;font-weight:700">US$ {{ fmt(app.bal) }}</span>
      </div>
      <div class="row" style="margin-top:14px;gap:10px">
        <button class="btn btn-p" style="flex:1" @click="show('topup')">充值</button>
        <button class="btn btn-o" style="flex:1" @click="show('transactions')">消费记录</button>
      </div>
    </div>
    <div class="row" style="margin-top:14px;gap:10px">
      <div class="card" style="flex:1">
        <div class="meta">本月权益</div>
        <div class="num gold" style="font-size:20px;font-weight:700">US$ 382</div>
        <div class="meta" style="margin-top:2px">已优惠</div>
      </div>
      <div class="card" style="flex:1">
        <div class="meta">待结算</div>
        <div class="num" style="font-size:20px;font-weight:700">US$ 96</div>
        <div class="meta" style="margin-top:2px">报销入账中</div>
      </div>
    </div>
    <div class="card" style="margin-top:14px;padding:4px 14px">
      <button class="li" @click="show('reimburse')">
        <span class="li-ic"><svg class="ic"><use href="#i-receipt"/></svg></span>
        <span class="li-title">报销中心</span><span class="badge warn">8 结算中</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" @click="show('referral')">
        <span class="li-ic"><svg class="ic"><use href="#i-gift"/></svg></span>
        <span class="li-title">推广中心</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" @click="show('creator')">
        <span class="li-ic"><svg class="ic"><use href="#i-camera"/></svg></span>
        <span class="li-title">创作收益</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" @click="show('wallet')">
        <span class="li-ic"><svg class="ic"><use href="#i-wallet"/></svg></span>
        <span class="li-title">钱包</span><span class="li-val">多账户</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
    </div>
    <p class="meta" style="margin-top:14px">会员卡由持牌发卡机构提供，Taso 仅提供体验层与权益层。储值与报销规则以合作机构实际处理为准。</p>
  </section>
</template>
