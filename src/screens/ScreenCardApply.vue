<script setup lang="ts">
import { ref } from 'vue'
import { app, show, showDialog, toast } from '../store'
import PageHeader from '../components/PageHeader.vue'
import TasoCard from '../components/TasoCard.vue'

const perks = ['合作商家专属优惠', '会员限定活动', '消费权益结算资格', '全球支付能力（以发卡机构支持范围为准）']
const steps = ['产品说明', '条款同意', '身份验证', '地址信息', '申请支付', '审核', '制卡', '配送', '激活']

const addr = ref('香港中环皇后大道中 99 号 12 楼')

function apply() {
  if (!addr.value.trim()) {
    toast('请填写账单 / 收件地址')
    return
  }
  showDialog('确认申请', `实体卡办理费 HK$1,000 / 张，将由平台安排制卡与配送，配送至：${addr.value.trim()}。`, () => {
    show('card-status')
    toast('申请已提交，正在制卡')
  })
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'card-apply' }" data-screen="card-apply">
    <PageHeader title="申请实体卡" />
    <TasoCard pan="•••• •••• •••• ••••" style="margin-top:10px">
      <p class="meta" style="margin-top:12px;color:color-mix(in oklch,var(--fg) 62%,transparent)">Taso Visa 联名会员卡 · 实体卡办理费</p>
      <div class="num" style="font-size:28px;font-weight:700">HK$ 1,000 <span style="font-size:12px;font-weight:400">/ 张</span></div>
    </TasoCard>
    <div class="card" style="margin-top:14px">
      <div v-for="p in perks" :key="p" class="li" style="border:0">
        <svg class="ic ok"><use href="#i-check"/></svg><span class="li-title">{{ p }}</span>
      </div>
    </div>
    <div class="field" style="margin-top:16px">
      <label>账单 / 收件地址（实体卡由平台配送）</label>
      <textarea v-model="addr" class="textarea" placeholder="用于卡片账单与实体卡配送"></textarea>
    </div>
    <div class="row" style="margin-top:14px;gap:8px;flex-wrap:wrap">
      <span v-for="s in steps" :key="s" class="badge soft">{{ s }}</span>
    </div>
    <button class="btn btn-gold" style="margin-top:20px" @click="apply">立即申请</button>
    <button class="btn btn-o" style="margin-top:10px" @click="show('card-status')">查看申请进度</button>
    <p class="meta" style="margin-top:12px">申请需通过持牌发卡机构的身份验证，开通前可在申请进度中查看制卡与配送状态。Taso App 不保存完整卡号、CVV 等高敏感支付数据。</p>
  </section>
</template>
