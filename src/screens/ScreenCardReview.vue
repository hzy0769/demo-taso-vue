<script setup lang="ts">
import { computed, ref } from 'vue'
import { app, fmt, show, toast } from '../store'
import { CARD_FEE_HKD, card, etaRange, etaText, methodOf, phoneText, submitOrder, addrLines } from '../card'
import PageHeader from '../components/PageHeader.vue'

/** P04 确认申请（全球配送 PRD §12）：汇总卡片 / 地址 / 配送方式 / 费用 + 地址确认勾选 */

const lines = computed(() => addrLines(card.draft))
const method = computed(() => methodOf(card.method))
const eta = computed(() => { const [a, b] = etaRange(method.value.days); return etaText(a, b) })
const feeText = (fee: number) => (fee ? `US$ ${fmt(fee)}` : '免费')
const total = computed(() =>
  method.value.fee ? `HK$ ${fmt(CARD_FEE_HKD)} ＋ US$ ${fmt(method.value.fee)}` : `HK$ ${fmt(CARD_FEE_HKD)}`,
)

const confirmed = ref(false)
const submitting = ref(false)

function submit() {
  if (!confirmed.value) {
    toast('请先确认收件地址信息无误')
    return
  }
  if (submitting.value) return
  submitting.value = true
  // 演示态：模拟提交/支付请求（§31 提交按钮需有明确 Loading 状态）
  setTimeout(() => {
    submitOrder()
    submitting.value = false
    show('card-success')
  }, 900)
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'card-review' }" data-screen="card-review">
    <PageHeader title="确认申请" />
    <div class="card" style="margin-top:8px">
      <div class="row" style="gap:12px">
        <span class="li-ic"><svg class="ic"><use href="#i-card"/></svg></span>
        <span style="flex:1">
          <b style="font-size:14px">实体会员卡 Physical Member Card</b>
          <p class="meta" style="margin-top:2px">Taso Visa 联名 · 标准会员 Standard Membership</p>
        </span>
        <span class="num" style="font-size:14px;font-weight:700">HK$ {{ fmt(CARD_FEE_HKD) }}</span>
      </div>
    </div>

    <div class="card" style="margin-top:12px">
      <div class="row-b" style="align-items:flex-start">
        <span class="meta">收件地址 Shipping address</span>
        <button class="edit-btn" @click="show('card-address')">编辑</button>
      </div>
      <div style="margin-top:6px">
        <b style="font-size:14px">{{ lines[0] }}</b>
        <p v-for="(l, i) in lines.slice(1)" :key="i" style="font-size:13px;color:var(--muted);margin-top:2px">{{ l }}</p>
        <p class="meta" style="margin-top:4px">{{ phoneText(card.draft) }}</p>
      </div>
    </div>

    <div class="card" style="margin-top:12px">
      <div class="row-b">
        <span class="meta">配送方式 Shipping method</span>
        <button class="edit-btn" @click="show('card-shipping')">编辑</button>
      </div>
      <div class="kv" style="margin-top:4px"><span class="k" style="color:var(--fg);font-weight:600">{{ method.name }}</span><span class="v num">{{ feeText(method.fee) }}</span></div>
      <div class="kv"><span class="k">预计送达</span><span class="v num">{{ eta }}</span></div>
    </div>

    <div class="card" style="margin-top:12px">
      <div class="kv"><span class="k">办理费 Card</span><span class="v num">HK$ {{ fmt(CARD_FEE_HKD) }}</span></div>
      <div class="kv"><span class="k">配送费 Shipping</span><span class="v num">{{ feeText(method.fee) }}</span></div>
      <div class="kv"><span class="k" style="font-weight:600;color:var(--fg)">合计 Total</span><span class="v num" style="font-weight:700">{{ total }}</span></div>
    </div>

    <button class="ckrow" style="margin-top:16px" @click="confirmed = !confirmed">
      <span class="ckbox" :class="{ on: confirmed }">
        <svg v-if="confirmed" class="ic sm" style="color:var(--surface)"><use href="#i-check"/></svg>
      </span>
      <span>我确认收件地址信息无误（I confirm that the address is correct）</span>
    </button>

    <button class="btn btn-gold" style="margin-top:18px" :disabled="!confirmed || submitting" @click="submit">
      <span v-if="submitting" class="spin"></span>
      {{ submitting ? '提交中…' : '提交申请 Submit Application' }}
    </button>
    <p class="meta" style="margin-top:12px">提交后进入制卡与配送流程，制卡完成前可联系客服修改地址；配送开始后不可修改。</p>
  </section>
</template>
