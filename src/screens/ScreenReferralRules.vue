<script setup lang="ts">
import { REFERRAL_PLAN, type ReferralTrack } from '../data'
import { app } from '../store'
import { t } from '../i18n'
import { fmtRate, fmtMoney } from '../i18n/format'
import PageHeader from '../components/PageHeader.vue'

/** 演示方案固定 3 级;层级数与比例均为后台可配(§79) */
const LEVEL_KEYS = ['refRules.lv1', 'refRules.lv2', 'refRules.lv3']

const tracks: { key: ReferralTrack }[] = [{ key: 'purchase' }, { key: 'topup' }]

/** 计算示例基数:直推下级购卡 1 张(HK$1,000,演示汇率 7.8)/ 充值 US$10,000 */
const EXAMPLE_BASE: Record<ReferralTrack, number> = { purchase: 1000 / 7.8, topup: 10000 }
const USD = (n: number) => fmtMoney({ amount: n, currency: 'USD' })

const rules = [
  t('refRules.rule1'),
  t('refRules.rule2'),
  t('refRules.rule3'),
  t('refRules.rule4'),
]
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'referral-rules' }" data-screen="referral-rules">
    <PageHeader :title="t('refRules.title')" />
    <div class="card" style="margin-top:8px">
      <div class="row-b">
        <b style="font-size:14px">{{ t('refRules.overview') }}</b>
        <span class="badge soft">{{ t('refRules.demoBadge') }}</span>
      </div>
      <p class="meta" style="margin-top:8px">{{ t('refRules.overviewNote', { levels: REFERRAL_PLAN.purchase.levels }) }}</p>
    </div>

    <div v-for="tr in tracks" :key="tr.key" class="card" style="margin-top:14px">
      <div class="row-b">
        <b style="font-size:14px">{{ t(`refRules.${tr.key}Title`) }}</b>
        <span class="badge soft">{{ t('refRules.trackBadge') }}</span>
      </div>
      <div class="formula" style="margin-top:8px">{{ t(`refRules.${tr.key}Formula`) }}</div>
      <div style="margin-top:6px">
        <div v-for="(rate, i) in REFERRAL_PLAN[tr.key].rates" :key="i" class="kv">
          <span class="k">{{ t(LEVEL_KEYS[i]) }}</span>
          <span class="v num" style="font-weight:700">{{ fmtRate(rate) }}</span>
        </div>
      </div>
      <p class="meta" style="margin-top:10px">{{ t(`refRules.${tr.key}Example`, { base: USD(EXAMPLE_BASE[tr.key]) }) }}</p>
      <div>
        <div v-for="(rate, i) in REFERRAL_PLAN[tr.key].rates" :key="i" class="kv">
          <span class="k">{{ t(LEVEL_KEYS[i]) }}</span>
          <span class="v num">{{ t('refRules.exampleRow', { rate: fmtRate(rate), amount: USD(EXAMPLE_BASE[tr.key] * rate) }) }}</span>
        </div>
      </div>
    </div>

    <div class="card" style="margin-top:14px">
      <b style="font-size:14px">{{ t('refRules.settleTitle') }}</b>
      <div v-for="r in rules" :key="r" class="li" style="border:0;min-height:34px">
        <svg class="ic ok"><use href="#i-check"/></svg>
        <span class="li-title" style="font-size:13px">{{ r }}</span>
      </div>
    </div>
    <p class="meta" style="margin-top:12px">{{ t('refRules.note') }}</p>
  </section>
</template>
