<script setup lang="ts">
import { app } from '../store'
import PageHeader from '../components/PageHeader.vue'

const unlocked = ['会员卡', '充值', '报销']
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'kyc' }" data-screen="kyc">
    <PageHeader title="实名 / KYC 状态" />
    <div class="card" style="margin-top:8px;text-align:center;padding:22px 16px">
      <div class="badge ok" style="font-size:13px;justify-content:center"><svg class="ic sm"><use href="#i-check"/></svg>当前状态：已通过</div>
      <div class="row-b" style="margin-top:16px;text-align:left"><span class="meta">姓名</span><b>******</b></div>
      <div class="row-b" style="margin-top:10px;text-align:left"><span class="meta">地区</span><b>Hong Kong</b></div>
    </div>
    <div class="card" style="margin-top:14px">
      <div v-for="u in unlocked" :key="u" class="li" style="border:0">
        <svg class="ic ok"><use href="#i-check"/></svg><span class="li-title">{{ u }}</span>
      </div>
      <div class="li" style="border:0">
        <svg class="ic warn"><use href="#i-check"/></svg>
        <span class="li-title">数字资产</span><span class="badge warn">按地区开放</span>
      </div>
    </div>
    <p class="meta" style="margin-top:12px">KYC 所需字段由实际牌照方/发卡行/支付机构决定，Taso 不自行扩大个人敏感资料收集范围。</p>
  </section>
</template>
