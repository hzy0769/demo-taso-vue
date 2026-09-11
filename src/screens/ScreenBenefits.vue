<script setup lang="ts">
import { computed } from 'vue'
import { app, show, fmt } from '../store'
import { DIVIDEND_TOTAL } from '../data'
import PageHeader from '../components/PageHeader.vue'
import TasoCard from '../components/TasoCard.vue'

/** 股东账号展示「股东分红」入口（V1.6） */
const isHolder = computed(() => app.auth.user?.role === 'shareholder')
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'benefits' }" data-screen="benefits">
    <PageHeader title="权益" :back-btn="false">
      <template #right>
        <button class="bk" aria-label="设置" @click="show('settings')"><svg class="ic"><use href="#i-settings"/></svg></button>
      </template>
    </PageHeader>

    <!-- 会员卡：综合权益页第一优先级模块（V1.9） -->
    <div class="sec-h" style="margin-top:6px">
      <span>会员卡</span>
      <button class="sec-more" @click="show('my-card')">我的会员卡 ›</button>
    </div>
    <TasoCard pan="•••• •••• •••• 3812" style="cursor:pointer" @click="show('my-card')">
      <div class="row-b" style="margin-top:14px">
        <span class="meta" style="color:color-mix(in oklch,var(--fg) 62%,transparent)">Alex · 09/28</span>
        <span class="meta" style="color:color-mix(in oklch,var(--fg) 62%,transparent)">GOLD MEMBER</span>
      </div>
    </TasoCard>
    <div class="card" style="margin-top:10px">
      <div class="row-b">
        <span class="meta">卡内余额</span>
        <span class="badge soft">仅限消费 · 不可提现</span>
      </div>
      <div class="num" style="font-size:22px;font-weight:700;margin-top:4px">US$ {{ fmt(app.bal) }}</div>
      <div class="row" style="margin-top:12px;gap:10px">
        <button class="btn btn-p" style="flex:1" @click="show('topup')">充值</button>
        <button class="btn btn-o" style="flex:1" @click="show('transactions')">消费记录</button>
      </div>
    </div>

    <!-- 钱包：收益账户摘要（V1.9 起在权益页展示，与会员卡并列） -->
    <div class="sec-h">
      <span>钱包 · 收益账户</span>
      <button class="sec-more" @click="show('wallet')">进入钱包 ›</button>
    </div>
    <div class="card">
      <div class="row-b">
        <span class="meta">可提现余额</span>
        <span class="badge soft">可提现</span>
      </div>
      <div class="num" style="font-size:22px;font-weight:700;margin-top:4px">US$ {{ fmt(app.wd) }}</div>
      <div class="kv"><span class="k">待结算报销</span><span class="v num warn">US$ 1,240.00</span></div>
      <div class="row" style="margin-top:12px;gap:10px">
        <button class="btn btn-p" style="flex:1" @click="show('withdraw')">提现</button>
        <button class="btn btn-o" style="flex:1" @click="show('wallet-transactions')">收益明细</button>
      </div>
    </div>

    <!-- 推广与收益：钱包来源入口（V1.9 自会员卡页迁入） -->
    <div class="sec-h"><span>推广与收益</span></div>
    <div class="card" style="padding:4px 14px">
      <button class="li" @click="show('referral')">
        <span class="li-ic"><svg class="ic"><use href="#i-gift"/></svg></span>
        <span class="li-title">推广中心</span><span class="li-val num gold">US$ 180.00</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" @click="show('creator')">
        <span class="li-ic"><svg class="ic"><use href="#i-camera"/></svg></span>
        <span class="li-title">创作收益</span><span class="li-val num">US$ 620.00</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" @click="show('reimburse')">
        <span class="li-ic"><svg class="ic"><use href="#i-receipt"/></svg></span>
        <span class="li-title">消费报销</span><span class="badge warn">8 结算中</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button v-if="isHolder" class="li" @click="show('dividend')">
        <span class="li-ic"><svg class="ic" style="color:var(--accent)"><use href="#i-star"/></svg></span>
        <span class="li-title">股东分红</span><span class="li-val num gold">US${{ fmt(DIVIDEND_TOTAL) }}</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
    </div>
  </section>
</template>
