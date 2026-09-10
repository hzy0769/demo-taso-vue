<script setup lang="ts">
import { computed } from 'vue'
import { app, fmt } from '../store'
import { DIVIDEND_PERIODS, DIVIDEND_RATE } from '../data'
import PageHeader from '../components/PageHeader.vue'

/** 每期按公式现算:分红 = 会员卡销售总额 × 14% × (关联销售总额(下 3 级) ÷ 平台总销售额) */
const rows = computed(() => DIVIDEND_PERIODS.map(p => {
  const pool = p.cardSales * DIVIDEND_RATE
  const ratio = p.relatedSales / p.platformSales
  return { ...p, pool, ratio, dividend: pool * ratio }
}))
const total = computed(() => rows.value.reduce((s, r) => s + r.dividend, 0))
const latest = rows.value[0]
const pct = (r: number) => (r * 100).toFixed(2) + '%'
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'dividend' }" data-screen="dividend">
    <PageHeader title="股东分红" />
    <div class="taso-card" style="margin-top:8px;min-height:0">
      <div>
        <div class="row-b">
          <span class="brand">TASO SHAREHOLDER</span>
          <span style="font-size:11px;font-weight:600">股东编号 SH-1024</span>
        </div>
        <p class="meta" style="margin-top:14px;color:inherit;opacity:.72">累计分红(近 {{ rows.length }} 期)</p>
        <div class="num" style="font-size:30px;font-weight:700;letter-spacing:.01em">US${{ fmt(total) }}</div>
      </div>
      <div class="row" style="gap:8px">
        <div style="flex:1">
          <div class="num" style="font-weight:600">{{ fmt(latest.dividend) }}</div>
          <div class="meta" style="color:inherit;opacity:.72">最新一期 US$</div>
        </div>
        <div style="flex:1">
          <div class="num" style="font-weight:600">{{ pct(latest.ratio) }}</div>
          <div class="meta" style="color:inherit;opacity:.72">分红池占比</div>
        </div>
        <div style="flex:1">
          <div class="num" style="font-weight:600">{{ rows.length }} 期</div>
          <div class="meta" style="color:inherit;opacity:.72">已发放</div>
        </div>
      </div>
    </div>
    <div class="card" style="margin-top:14px">
      <div class="row-b"><b style="font-size:14px">分红计算公式</b><span class="badge soft">按月结算</span></div>
      <div class="formula">股东分红 = 平台会员卡销售总额 × 14% × (股东关联销售总额 ÷ 平台总销售额)</div>
      <p class="meta" style="margin-top:10px">「股东关联销售总额」仅统计该股东下面 3 级产生的销售总额;股东身份由平台后台审核开通。</p>
    </div>
    <div class="stack" style="margin-top:14px">
      <div v-for="r in rows" :key="r.no" class="card">
        <div class="row-b">
          <div>
            <b style="font-size:14px">第 {{ r.no }} 期分红</b>
            <p class="meta">结算周期 {{ r.range }}</p>
            <p class="meta">发放日 {{ r.paidAt }}</p>
          </div>
          <div style="text-align:right">
            <div class="num ok" style="font-weight:700">+US${{ fmt(r.dividend) }}</div>
            <span class="badge ok" style="margin-top:4px">已发放</span>
          </div>
        </div>
        <div style="margin-top:10px">
          <div class="kv"><span class="k">平台会员卡销售总额</span><span class="v num">US${{ fmt(r.cardSales) }}</span></div>
          <div class="kv"><span class="k">分红池(×14%)</span><span class="v num">US${{ fmt(r.pool) }}</span></div>
          <div class="kv"><span class="k">我的关联销售(下 3 级)</span><span class="v num">US${{ fmt(r.relatedSales) }}</span></div>
          <div class="kv"><span class="k">平台总销售额</span><span class="v num">US${{ fmt(r.platformSales) }}</span></div>
          <div class="kv"><span class="k">分红池占比</span><span class="v num gold">{{ pct(r.ratio) }}</span></div>
        </div>
      </div>
    </div>
    <p class="meta" style="margin-top:12px">分红金额均为税前演示数据,实际到账以钱包明细为准;分红规则由平台后台配置与审核。</p>
  </section>
</template>
