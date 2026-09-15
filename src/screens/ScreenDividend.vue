<script setup lang="ts">
import { computed } from 'vue'
import { app } from '../store'
import {
  DIVIDEND_PERIODS, DIVIDEND_RATE, DIVIDEND_RECHARGE_RATE,
  dividendSalesOf, dividendRechargeOf, type DividendPeriod,
} from '../data'
import { t } from '../i18n'
import { fmtMoney, fmtLocalDate, fmtLocalDateShort } from '../i18n/format'
import PageHeader from '../components/PageHeader.vue'

/** 每期按双公式现算(§79;V3.3 起关联额统计股东全部关联层级,不再限下 3 级):
    销售分红 = 平台总销售额 × 14% × (关联销售总额 ÷ 平台总销售额)
    充值分红 = 会员总充值额 × 0.35% × (关联充值额 ÷ 会员总充值额) */
const SALES_PCT = Math.round(DIVIDEND_RATE * 100)
const RECHARGE_PCT = (DIVIDEND_RECHARGE_RATE * 100).toFixed(2).replace(/\.?0+$/, '')

interface PeriodRow extends DividendPeriod {
  salesPool: number
  rechargePool: number
  salesRatio: number
  rechargeRatio: number
  salesDiv: number
  rechargeDiv: number
  total: number
  range: string
}

const rows = computed<PeriodRow[]>(() => DIVIDEND_PERIODS.map(p => ({
  ...p,
  salesPool: p.platformSales * DIVIDEND_RATE,
  rechargePool: p.platformRecharge * DIVIDEND_RECHARGE_RATE,
  salesRatio: p.relatedSales / p.platformSales,
  rechargeRatio: p.relatedRecharge / p.platformRecharge,
  salesDiv: dividendSalesOf(p),
  rechargeDiv: dividendRechargeOf(p),
  total: dividendSalesOf(p) + dividendRechargeOf(p),
  range: `${fmtLocalDateShort(p.from)} – ${fmtLocalDateShort(p.to)}`,
})))
const total = computed(() => rows.value.reduce((s, r) => s + r.total, 0))
const salesTotal = computed(() => rows.value.reduce((s, r) => s + r.salesDiv, 0))
const rechargeTotal = computed(() => rows.value.reduce((s, r) => s + r.rechargeDiv, 0))
const latest = rows.value[0]
const USD = (n: number) => fmtMoney({ amount: n, currency: 'USD' })
const pct = (r: number) => new Intl.NumberFormat('en', { style: 'percent', minimumFractionDigits: 2 }).format(r)
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'dividend' }" data-screen="dividend">
    <PageHeader :title="t('dividend.title')" />
    <!-- 示例数据披露(评审 P0:非真实投资邀约;资格、披露与预计值须与历史区分) -->
    <div class="demo-bar" role="note">
      <svg class="ic sm" style="flex:none;margin-top:1px"><use href="#i-alert"/></svg>
      <span>{{ t('dividend.demoBanner') }}</span>
    </div>
    <div class="taso-card" style="margin-top:8px;min-height:0">
      <div>
        <div class="row-b">
          <span class="brand">TASO SHAREHOLDER</span>
          <span style="font-size:11px;font-weight:600">{{ t('dividend.holderNo') }} SH-1024</span>
        </div>
        <p class="meta" style="margin-top:14px;color:inherit;opacity:.72">{{ t('dividend.cumulative', { n: rows.length }) }}</p>
        <div class="num" style="font-size:30px;font-weight:700;letter-spacing:.01em">{{ USD(total) }}</div>
        <p class="meta" style="margin-top:4px;color:inherit;opacity:.72">{{ t('dividend.trackSplit', { sales: USD(salesTotal), recharge: USD(rechargeTotal) }) }}</p>
      </div>
      <div class="row" style="gap:8px;margin-top:12px">
        <div style="flex:1">
          <div class="num" style="font-weight:600">{{ USD(latest.total) }}</div>
          <div class="meta" style="color:inherit;opacity:.72">{{ t('dividend.latest') }}</div>
        </div>
        <div style="flex:1">
          <div class="num" style="font-weight:600">{{ pct(latest.salesRatio) }}</div>
          <div class="meta" style="color:inherit;opacity:.72">{{ t('dividend.salesPoolRatio') }}</div>
        </div>
        <div style="flex:1">
          <div class="num" style="font-weight:600">{{ pct(latest.rechargeRatio) }}</div>
          <div class="meta" style="color:inherit;opacity:.72">{{ t('dividend.rechargePoolRatio') }}</div>
        </div>
        <div style="flex:1">
          <div class="num" style="font-weight:600">{{ t('dividend.periodCount', { n: rows.length }) }}</div>
          <div class="meta" style="color:inherit;opacity:.72">{{ t('dividend.issued') }}</div>
        </div>
      </div>
    </div>

    <div class="card" style="margin-top:14px">
      <div class="row-b"><b style="font-size:14px">{{ t('dividend.formulaTitle') }}</b><span class="badge soft">{{ t('dividend.monthly') }}</span></div>
      <div class="formula">{{ t('dividend.formulaSales', { rate: SALES_PCT }) }}</div>
      <div class="formula" style="margin-top:8px">{{ t('dividend.formulaRecharge', { rate: RECHARGE_PCT }) }}</div>
      <p class="meta" style="margin-top:10px">{{ t('dividend.formulaNote') }}</p>
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
            <div class="num ok" style="font-weight:700">{{ fmtMoney({ amount: r.total, currency: 'USD' }, { sign: '+' }) }}</div>
            <span class="badge ok" style="margin-top:4px">{{ t('dividend.issued') }}</span>
          </div>
        </div>

        <div class="row-b" style="margin-top:12px">
          <b style="font-size:13px">{{ t('dividend.salesTrack') }}</b>
          <span class="num ok" style="font-weight:700">{{ fmtMoney({ amount: r.salesDiv, currency: 'USD' }, { sign: '+' }) }}</span>
        </div>
        <div style="margin-top:2px">
          <div class="kv"><span class="k">{{ t('dividend.platformSales') }}</span><span class="v num">{{ USD(r.platformSales) }}</span></div>
          <div class="kv"><span class="k">{{ t('dividend.pool', { rate: SALES_PCT }) }}</span><span class="v num">{{ USD(r.salesPool) }}</span></div>
          <div class="kv"><span class="k">{{ t('dividend.relatedSales') }}</span><span class="v num">{{ USD(r.relatedSales) }}</span></div>
          <div class="kv"><span class="k">{{ t('dividend.poolRatio') }}</span><span class="v num gold">{{ pct(r.salesRatio) }}</span></div>
        </div>

        <div class="row-b" style="margin-top:10px">
          <b style="font-size:13px">{{ t('dividend.rechargeTrack') }}</b>
          <span class="num ok" style="font-weight:700">{{ fmtMoney({ amount: r.rechargeDiv, currency: 'USD' }, { sign: '+' }) }}</span>
        </div>
        <div style="margin-top:2px">
          <div class="kv"><span class="k">{{ t('dividend.platformRecharge') }}</span><span class="v num">{{ USD(r.platformRecharge) }}</span></div>
          <div class="kv"><span class="k">{{ t('dividend.pool', { rate: RECHARGE_PCT }) }}</span><span class="v num">{{ USD(r.rechargePool) }}</span></div>
          <div class="kv"><span class="k">{{ t('dividend.relatedRecharge') }}</span><span class="v num">{{ USD(r.relatedRecharge) }}</span></div>
          <div class="kv"><span class="k">{{ t('dividend.poolRatio') }}</span><span class="v num gold">{{ pct(r.rechargeRatio) }}</span></div>
        </div>
      </div>
    </div>
    <p class="meta" style="margin-top:12px">{{ t('dividend.note') }}</p>
  </section>
</template>
