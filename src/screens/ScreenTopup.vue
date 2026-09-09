<script setup lang="ts">
import { computed, ref } from 'vue'
import { app, showDialog, save, toast, fmt } from '../store'
import PageHeader from '../components/PageHeader.vue'

const cur = ref('HKD')
const currencies = ['HKD', 'USD', 'USDT', 'USDC']
const amt = ref('10,000.00')

const parsed = computed(() => parseFloat(amt.value.replace(/,/g, '')) || 0)

function confirm() {
  if (!parsed.value || parsed.value <= 0) {
    toast('请输入有效金额')
    return
  }
  showDialog(
    '确认充值',
    `充值 HK$${fmt(parsed.value)}，手续费 16% HK$${fmt(parsed.value * 0.16)}，预计支付 HK$${fmt(parsed.value * 1.16)}。`,
    () => {
      app.bal += parsed.value
      save()
      toast('充值成功，余额已更新')
    },
  )
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'topup' }" data-screen="topup">
    <PageHeader title="充值" />
    <div class="field" style="margin-top:8px">
      <label>选择币种</label>
      <div class="chips">
        <button
          v-for="c in currencies" :key="c"
          class="chip" :class="{ on: cur === c }"
          @click="cur = c"
        >{{ c }}</button>
      </div>
    </div>
    <div class="field" style="margin-top:16px">
      <label>充值金额</label>
      <input v-model="amt" class="input num" inputmode="decimal" />
    </div>
    <div class="card" style="margin-top:16px">
      <div class="kv"><span class="k">充值金额</span><span class="v num">HK$ {{ fmt(parsed) }}</span></div>
      <div class="kv"><span class="k">手续费 16%</span><span class="v num">HK$ {{ fmt(parsed * 0.16) }}</span></div>
      <div class="kv"><span class="k">预计支付</span><span class="v num" style="font-weight:700">HK$ {{ fmt(parsed * 1.16) }}</span></div>
    </div>
    <p class="meta" style="margin-top:12px">到账规则：以合作金融机构实际处理结果为准。手续费用途由法务/财务确认后展示。</p>
    <button class="btn btn-p" style="margin-top:20px" @click="confirm">确认充值</button>
  </section>
</template>
