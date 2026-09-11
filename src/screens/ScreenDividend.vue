<script setup lang="ts">
import { computed } from 'vue'
import { app } from '../store'
import { DIVIDEND_PERIODS, DIVIDEND_RATE } from '../data'
import { t } from '../i18n'
import { fmtMoney, fmtLocalDate, fmtLocalDateShort } from '../i18n/format'
import PageHeader from '../components/PageHeader.vue'

/** 每期按公式现算:分红 = 平台总销售额 × 14% × (关联销售总额(下 3 级) ÷ 平台总销售额) */
const LEVELS = 3
const RATE_PCT = Math.round(DIVIDEND_RATE * 100)

const rows = computed(() => DIVIDEND_PERIODS.map(p => {
  const pool = p.platformSales * DIVIDEND_RATE
  const ratio = p.relatedSales / p.platformSales
  return { ...p, pool, ratio, dividend: pool * ratio, range: `${fmtLocalDateShort(p.from)} – ${fmtLocalDateShort(p.to)}` }
}))
const total = computed(() => rows.value.reduce((s, r) => s + r.dividend, 0))
const latest = rows.value[0]
const USD = (n: number) => fmtMoney({ amount: n, currency: 'USD' })
const pct = (r: number) => new Intl.NumberFormat('en', { style: 'percent', minimumFractionDigits: 2 }).format(r)
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'dividend' }" data-screen="dividend">
    <PageHeader :title="t('dividend.title')" />
    <div class="taso-card" style="margin-top:8px;min-height:0">
      <div>
        <div class="row-b">
          <span class="brand">TASO SHAREHOLDER</span>
          <span style="font-size:11px;font-weight:600">{{ t('dividend.holderNo') }} SH-1024</span>
        </div>
        <p class="meta" style="margin-top:14px;color:inherit;opacity:.72">{{ t('dividend.cumulative', { n: rows.length }) }}</p>
        <div class="num" style="font-size:30px;font-weight:700;letter-spacing:.01em">{{ USD(total) }}</div>
      </div>
      <div class="row" style="gap:8px">
        <div style="flex:1">
          <div class="num" style="font-weight:600">{{ USD(latest.dividend) }}</div>
          <div class="meta" style="color:inherit;opacity:.72">{{ t('dividend.latest') }}</div>
        </div>
        <div style="flex:1">
          <div class="num" style="font-weight:600">{{ pct(latest.ratio) }}</div>
          <div class="meta" style="color:inherit;opacity:.72">{{ t('dividend.poolRatio') }}</div>
        </div>
        <div style="flex:1">
          <div class="num" style="font-weight:600">{{ t('dividend.periodCount', { n: rows.length }) }}</div>
          <div class="meta" style="color:inherit;opacity:.72">{{ t('dividend.issued') }}</div>
        </div>
      </div>
    </div>
    <div class="card" style="margin-top:14px">
      <div class="row-b"><b style="font-size:14px">{{ t('dividend.formulaTitle') }}</b><span class="badge soft">{{ t('dividend.monthly') }}</span></div>
      <div class="formula">{{ t('dividend.formula', { rate: RATE_PCT }) }}</div>
      <p class="meta" style="margin-top:10px">{{ t('dividend.formulaNote', { levels: LEVELS }) }}</p>
    </div>
    <div class="stack" style="margin-top:14px">
      <div v-for="r in rows" :key="r.no" class="card">
        <div class="row-b">
          <div>
            <b style="font-size:14px">{{ t('dividend.periodTitle', { no: r.no }) }}</b>
            <p class="meta">{{ t('dividend.settleRange', { range: r.range }) }}</p>
            <p class="meta">{{ t('dividend.payDate', { date: fmtLocalDate(r.paidAt) }) }}</p>
          </div>
          <div style="text-align:right">
            <div class="num ok" style="font-weight:700">{{ fmtMoney({ amount: r.dividend, currency: 'USD' }, { sign: '+' }) }}</div>
            <span class="badge ok" style="margin-top:4px">{{ t('dividend.issued') }}</span>
          </div>
        </div>
        <div style="margin-top:10px">
          <div class="kv"><span class="k">{{ t('dividend.platformSales') }}</span><span class="v num">{{ USD(r.platformSales) }}</span></div>
          <div class="kv"><span class="k">{{ t('dividend.pool', { rate: RATE_PCT }) }}</span><span class="v num">{{ USD(r.pool) }}</span></div>
          <div class="kv"><span class="k">{{ t('dividend.relatedSales', { levels: LEVELS }) }}</span><span class="v num">{{ USD(r.relatedSales) }}</span></div>
          <div class="kv"><span class="k">{{ t('dividend.poolRatio') }}</span><span class="v num gold">{{ pct(r.ratio) }}</span></div>
        </div>
      </div>
    </div>
    <p class="meta" style="margin-top:12px">{{ t('dividend.note') }}</p>
  </section>
</template>
