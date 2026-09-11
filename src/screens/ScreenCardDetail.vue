<script setup lang="ts">
import { ref } from 'vue'
import { app, fmt, toast } from '../store'
import PageHeader from '../components/PageHeader.vue'
import TasoCard from '../components/TasoCard.vue'

const frozen = ref(false)

function toggleFreeze() {
  const wasFrozen = frozen.value
  frozen.value = !wasFrozen
  toast(wasFrozen ? '卡片已解冻' : '卡片已冻结，交易将被拒绝')
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'card-detail' }" data-screen="card-detail">
    <PageHeader title="卡片详情">
      <template #right>
        <button class="bk" aria-label="更多" @click="toast('更多操作：不感兴趣 / 屏蔽 / 举报')"><svg class="ic"><use href="#i-more"/></svg></button>
      </template>
    </PageHeader>
    <TasoCard pan="•••• •••• •••• 3812" style="margin-top:10px">
      <template #top-right>
        <span class="badge ok" style="background:color-mix(in oklch,var(--ok) 18%,transparent)">已激活</span>
      </template>
      <div class="row-b" style="margin-top:14px">
        <span class="meta" style="color:color-mix(in oklch,var(--fg) 62%,transparent)">Alex · 09/28</span>
        <span class="visa">VISA</span>
      </div>
    </TasoCard>
    <div class="card" style="margin-top:14px">
      <div class="kv"><span class="k">卡内余额</span><span class="v num">US$ {{ fmt(app.bal) }}</span></div>
      <div class="kv"><span class="k">本月消费</span><span class="v num">US$ 3,920.00</span></div>
      <div class="kv"><span class="k">合作商家节省</span><span class="v num gold">US$ 280.00</span></div>
    </div>
    <div class="card" style="margin-top:14px;padding:4px 14px">
      <button class="li" @click="toggleFreeze">
        <span class="li-ic"><svg class="ic"><use href="#i-lock"/></svg></span>
        <span class="li-title">{{ frozen ? '解冻卡片' : '冻结卡片' }}</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" @click="toast('交易通知已开启')">
        <span class="li-ic"><svg class="ic"><use href="#i-bell"/></svg></span>
        <span class="li-title">设置交易通知</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" @click="toast('完整卡号仅由符合 PCI DSS 的卡组件提供')">
        <span class="li-ic"><svg class="ic"><use href="#i-eye"/></svg></span>
        <span class="li-title">查看完整卡号</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" @click="toast('补卡申请已提交，预计 5-7 个工作日')">
        <span class="li-ic"><svg class="ic"><use href="#i-refresh"/></svg></span>
        <span class="li-title">更换 / 补卡</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
    </div>
  </section>
</template>
