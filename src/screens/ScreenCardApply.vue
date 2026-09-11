<script setup lang="ts">
import { app, fmt, show, toast } from '../store'
import { CARD_FEE_HKD, card } from '../card'
import PageHeader from '../components/PageHeader.vue'
import TasoCard from '../components/TasoCard.vue'

/** P01 实体会员卡申请入口（全球配送 PRD §4）：卡片展示 + 配送权益 + 费用提示 */

const perks = ['全球配送 Global delivery', '安全送达 Secure delivery', '物流可追踪 Track your shipment']

function track() {
  if (!card.order) {
    toast('暂无进行中的申请')
    return
  }
  show('card-tracking')
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'card-apply' }" data-screen="card-apply">
    <PageHeader title="申请实体卡" />
    <TasoCard pan="•••• •••• •••• ••••" style="margin-top:10px">
      <p class="meta" style="margin-top:12px;color:color-mix(in oklch,var(--fg) 62%,transparent)">Physical Member Card</p>
      <div style="font-size:17px;font-weight:700;margin-top:2px">制作完成后寄送到你的地址</div>
    </TasoCard>
    <div class="card" style="margin-top:14px;padding:4px 14px">
      <div v-for="p in perks" :key="p" class="li" style="border:0">
        <svg class="ic ok"><use href="#i-check"/></svg><span class="li-title">{{ p }}</span>
      </div>
    </div>
    <div class="card" style="margin-top:14px">
      <div class="kv"><span class="k">实体卡办理费</span><span class="v num">HK$ {{ fmt(CARD_FEE_HKD) }} / 张</span></div>
      <div class="kv"><span class="k">配送费</span><span class="v">结算时计算 Calculated at checkout</span></div>
    </div>
    <button class="btn btn-gold" style="margin-top:16px" @click="show('card-address')">申请办卡 Apply for Card</button>
    <button class="btn btn-o" style="margin-top:10px" @click="track">查看申请 / 配送追踪</button>
    <p class="meta" style="margin-top:12px">申请需通过持牌发卡机构的身份验证，配送地址与方式在 App 内逐步确认，由承运商送达并全程可追踪。Taso App 不保存完整卡号、CVV 等高敏感支付数据。</p>
  </section>
</template>
