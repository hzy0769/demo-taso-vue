<script setup lang="ts">
import { computed, ref } from 'vue'
import { app, showDialog, save, toast, fmt } from '../store'
import PageHeader from '../components/PageHeader.vue'

const method = ref<'bank' | 'wallet'>('bank')
const amt = ref('500.00')

const parsed = computed(() => parseFloat(amt.value.replace(/,/g, '')) || 0)

function confirm() {
  if (!parsed.value || parsed.value <= 0) {
    toast('请输入有效金额')
    return
  }
  if (parsed.value > app.wd) {
    toast('超过可提现余额')
    return
  }
  showDialog('确认提现', `提现 HK$${fmt(parsed.value)}，手续费 HK$8.00，预计 1–3 个工作日到账。`, () => {
    app.wd -= parsed.value
    save()
    toast('提现申请已提交')
  })
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'withdraw' }" data-screen="withdraw">
    <PageHeader title="提现" />
    <div class="card" style="margin-top:8px">
      <div class="meta">可提现余额</div>
      <div class="num" style="font-size:28px;font-weight:700">HK$ {{ fmt(app.wd) }}</div>
    </div>
    <div class="field" style="margin-top:16px">
      <label>提现至</label>
      <div class="card" style="padding:6px 14px">
        <button class="li" style="border:0" @click="method = 'bank'">
          <span class="li-title">绑定银行卡（尾号 2021）</span>
          <svg class="ic" :style="method === 'bank' ? 'color:var(--fg)' : 'color:var(--muted)'"><use href="#i-check"/></svg>
        </button>
        <button class="li" style="border:0" @click="method = 'wallet'">
          <span class="li-title">数字钱包</span>
          <svg class="ic" :style="method === 'wallet' ? 'color:var(--fg)' : 'color:var(--muted)'"><use href="#i-check"/></svg>
        </button>
      </div>
    </div>
    <div class="field" style="margin-top:16px">
      <label>金额</label>
      <input v-model="amt" class="input num" inputmode="decimal" />
    </div>
    <div class="card" style="margin-top:16px">
      <div class="kv"><span class="k">手续费</span><span class="v num">HK$ 8.00</span></div>
      <div class="kv"><span class="k">到账时间</span><span class="v">预计 1–3 个工作日</span></div>
    </div>
    <p class="meta" style="margin-top:12px">首次提现需完成实名验证；新绑定银行卡有冷却期；数字资产提现仅在合规合作架构下开放。</p>
    <button class="btn btn-p" style="margin-top:20px" @click="confirm">提交提现</button>
  </section>
</template>
