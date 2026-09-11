<script setup lang="ts">
import { computed } from 'vue'
import { app, fmt, show, toast } from '../store'
import { CARD_FEE_HKD, METHODS, card, countryOf, etaRange, etaText, methodOf, phoneText, addrLines } from '../card'
import PageHeader from '../components/PageHeader.vue'

/** P03 配送方式（全球配送 PRD §10）：地址摘要 + Standard/Express + 费用汇总 */

const country = computed(() => countryOf(card.draft.countryCode))
const lines = computed(() => addrLines(card.draft))
const method = computed(() => methodOf(card.method))

const feeText = (fee: number) => (fee ? `US$ ${fmt(fee)}` : '免费')
const etaOf = (days: [number, number]) => { const [a, b] = etaRange(days); return etaText(a, b) }
/** 合计：办理费 HK$（唯一非美元金额）+ 配送费 US$（§23 费用透明原则） */
const total = computed(() =>
  method.value.fee ? `HK$ ${fmt(CARD_FEE_HKD)} ＋ US$ ${fmt(method.value.fee)}` : `HK$ ${fmt(CARD_FEE_HKD)}`,
)

function setMethod(code: 'standard' | 'express') {
  if (code === 'express' && country.value && !country.value.express) {
    toast('该地址暂不支持特快配送，请选择标准配送')
    return
  }
  card.method = code
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'card-shipping' }" data-screen="card-shipping">
    <PageHeader title="配送方式" />
    <div class="card" style="margin-top:8px">
      <div class="row-b" style="align-items:flex-start">
        <span class="meta">配送至 / Deliver to</span>
        <button class="edit-btn" @click="show('card-address')">编辑</button>
      </div>
      <div style="margin-top:6px">
        <b style="font-size:14px">{{ lines[0] }}</b>
        <p v-for="(l, i) in lines.slice(1)" :key="i" style="font-size:13px;color:var(--muted);margin-top:2px">{{ l }}</p>
        <p class="meta" style="margin-top:4px">{{ phoneText(card.draft) }}</p>
      </div>
    </div>

    <div class="field" style="margin-top:16px">
      <label>配送方式 Shipping options</label>
      <button
        v-for="m in METHODS" :key="m.code"
        class="opt"
        :class="{ on: card.method === m.code, dis: m.code === 'express' && !country?.express }"
        @click="setMethod(m.code)"
      >
        <span class="dot"></span>
        <span style="flex:1;min-width:0">
          <b style="font-size:14px">{{ m.name }}</b>
          <p class="meta" style="margin-top:3px">预计送达 {{ etaOf(m.days) }} · <span style="white-space:nowrap">{{ m.days[0] }}–{{ m.days[1] }} 天</span></p>
          <p v-if="m.code === 'express' && !country?.express" class="ferr" style="margin-top:3px">Express Shipping is not available for this address.</p>
        </span>
        <b class="num" style="flex:none;font-size:14px">{{ feeText(m.fee) }}</b>
      </button>
    </div>

    <div class="card" style="margin-top:16px">
      <div class="kv"><span class="k">实体会员卡办理费</span><span class="v num">HK$ {{ fmt(CARD_FEE_HKD) }}</span></div>
      <div class="kv"><span class="k">配送费（{{ method.name }}）</span><span class="v num">{{ feeText(method.fee) }}</span></div>
      <div class="kv"><span class="k" style="font-weight:600;color:var(--fg)">合计</span><span class="v num" style="font-weight:700">{{ total }}</span></div>
    </div>

    <button class="btn btn-gold" style="margin-top:16px" @click="show('card-review')">继续 Continue</button>
    <p class="meta" style="margin-top:12px">预计送达为承运商参考时效，可能因当地物流状况顺延；偏远地区仅提供标准配送。</p>
  </section>
</template>
