<script setup lang="ts">
import { app, showDialog, toast } from '../store'
import PageHeader from '../components/PageHeader.vue'
import TasoCard from '../components/TasoCard.vue'

const perks = ['合作商家专属优惠', '会员限定活动', '消费权益结算资格', '全球支付能力（以发卡机构支持范围为准）']
const steps = ['产品说明', '条款同意', '身份验证', '地址信息', '申请支付', '审核', '制卡', '配送', '激活']

function apply() {
  showDialog('确认申请', '实体卡办理费 HK$1,000，将进入持牌发卡机构的身份验证流程。', () =>
    toast('申请已提交，进入审核（演示）'),
  )
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'card-apply' }" data-screen="card-apply">
    <PageHeader title="申请实体卡" />
    <TasoCard pan="•••• •••• •••• ••••" style="margin-top:10px">
      <p class="meta" style="margin-top:12px;color:color-mix(in oklch,var(--fg) 62%,transparent)">实体卡办理费</p>
      <div class="num" style="font-size:28px;font-weight:700">HK$ 1,000</div>
    </TasoCard>
    <div class="card" style="margin-top:14px">
      <div v-for="p in perks" :key="p" class="li" style="border:0">
        <svg class="ic ok"><use href="#i-check"/></svg><span class="li-title">{{ p }}</span>
      </div>
    </div>
    <div class="row" style="margin-top:14px;gap:8px;flex-wrap:wrap">
      <span v-for="s in steps" :key="s" class="badge soft">{{ s }}</span>
    </div>
    <button class="btn btn-gold" style="margin-top:20px" @click="apply">立即申请</button>
    <p class="meta" style="margin-top:12px">申请需通过持牌发卡机构的身份验证。Taso App 不保存完整卡号、CVV 等高敏感支付数据。</p>
  </section>
</template>
