<script setup lang="ts">
import { computed } from 'vue'
import { app, show, showDialog, toast, openSheet } from '../store'
import { t } from '../i18n'
import { fmtMoney, fmtLocalDateShort, fmtRate } from '../i18n/format'
import { REIMBURSE_CAMPAIGN, campaignDaysLeft, todayOriginalPosts, currentRate, nextTier } from '../reimburse'
import PageHeader from '../components/PageHeader.vue'

const USD = (n: number) => fmtMoney({ amount: n, currency: 'USD' })

/** 结算中示例单:提交当日锁定任务1档(85%) → 上限 = 审核金额 × 85% */
const LOCKED_RATE = 0.85
const SPEND = 800
const SETTLED = 120
const CAP = SPEND * LOCKED_RATE

/** 任务阶梯:基础档 + 四档任务,当前生效档金色高亮 */
const ladder = computed(() => [
  {
    key: 'base',
    label: t('reimburse.base'),
    sub: t('reimburse.baseSub', { rate: fmtRate(REIMBURSE_CAMPAIGN.baseRate) }),
    rate: REIMBURSE_CAMPAIGN.baseRate,
    achieved: true,
    current: todayOriginalPosts.value === 0,
    icon: 'i-receipt',
    num: 0,
  },
  ...REIMBURSE_CAMPAIGN.tiers.map((tier, i) => ({
    key: `t${tier.posts}`,
    label: t('reimburse.taskN', { n: i + 1 }),
    sub: t('reimburse.taskSub', { posts: tier.posts }),
    rate: tier.rate,
    achieved: todayOriginalPosts.value >= tier.posts,
    current: todayOriginalPosts.value >= tier.posts
      && (REIMBURSE_CAMPAIGN.tiers[i + 1]?.posts ?? Infinity) > todayOriginalPosts.value,
    icon: '',
    num: tier.posts,
  })),
])

function submit() {
  showDialog(t('reimburse.submitTitle'), t('reimburse.submitBody', { rate: fmtRate(currentRate.value) }), () =>
    toast(t('reimburse.submitted')),
  )
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'reimburse' }" data-screen="reimburse">
    <PageHeader :title="t('reimburse.title')" />
    <!-- 活动期:后台配置,App 展示起止与剩余天数 -->
    <div class="rb-camp">
      <svg class="ic"><use href="#i-gift"/></svg>
      <div style="flex:1;min-width:0">
        <b style="font-size:14px">{{ t('reimburse.campaign.title') }}</b>
        <div class="meta" style="margin-top:2px">{{ t('reimburse.campaign.range', { start: fmtLocalDateShort(REIMBURSE_CAMPAIGN.start), end: fmtLocalDateShort(REIMBURSE_CAMPAIGN.end) }) }}</div>
      </div>
      <span class="badge gold-badge">{{ t('reimburse.campaign.left', { n: campaignDaysLeft() }) }}</span>
    </div>
    <div class="row" style="gap:8px;margin-top:10px">
      <div class="card" style="flex:1;padding:12px"><div class="num" style="font-weight:700">12</div><div class="meta">{{ t('reimburse.audited') }}</div></div>
      <div class="card" style="flex:1;padding:12px"><div class="num warn" style="font-weight:700">8</div><div class="meta">{{ t('reimburse.settling') }}</div></div>
      <div class="card" style="flex:1;padding:12px"><div class="num ok" style="font-weight:700">21</div><div class="meta">{{ t('reimburse.done') }}</div></div>
    </div>
    <button class="btn btn-p" style="margin-top:14px" @click="submit">{{ t('reimburse.submit') }}</button>

    <!-- 今日报销档位:基础 65%,当日原创发帖任务逐档提升,提交时按当日达成档位锁定 -->
    <div class="card" style="margin-top:14px">
      <div class="row-b">
        <div>
          <div class="meta">{{ t('reimburse.today') }}</div>
          <div class="num gold" style="font-size:26px;font-weight:700;margin-top:2px">{{ fmtRate(currentRate) }}</div>
        </div>
        <div style="text-align:right">
          <div class="meta">{{ t('reimburse.todayPosts', { have: todayOriginalPosts, max: REIMBURSE_CAMPAIGN.tiers.length }) }}</div>
          <div class="prog" style="width:88px;margin-top:8px"><i :style="{ width: `${Math.min(100, todayOriginalPosts / REIMBURSE_CAMPAIGN.tiers.length * 100)}%` }"></i></div>
        </div>
      </div>
      <p class="meta gold" style="margin-top:10px">
        {{ nextTier ? t('reimburse.tier.next', { rate: fmtRate(nextTier.rate) }) : t('reimburse.tier.max', { rate: fmtRate(currentRate) }) }}
      </p>
      <div style="margin-top:6px">
        <div v-for="row in ladder" :key="row.key" class="tier" :class="{ on: row.current, done: row.achieved && !row.current }">
          <span class="t-ic">
            <svg v-if="row.icon" class="ic sm"><use :href="`#${row.icon}`"/></svg>
            <svg v-else-if="row.achieved" class="ic sm"><use href="#i-check"/></svg>
            <template v-else>{{ row.num }}</template>
          </span>
          <div style="flex:1;min-width:0">
            <div class="row" style="gap:6px;min-height:20px">
              <b style="font-size:14px">{{ row.label }}</b>
              <span v-if="row.current" class="badge gold-badge">{{ t('reimburse.tier.current') }}</span>
            </div>
            <div class="meta" style="margin-top:1px">{{ row.sub }}</div>
          </div>
          <b class="num" :class="{ gold: row.current }" style="font-size:15px">{{ fmtRate(row.rate) }}</b>
        </div>
      </div>
      <p class="meta" style="margin-top:10px">{{ t('reimburse.lockNote') }}</p>
      <button class="btn btn-gold" style="margin-top:12px" @click="openSheet('composer')">{{ t('reimburse.goCompose') }}</button>
    </div>

    <h3 style="font-size:15px;font-weight:600;margin:18px 0 10px">{{ t('reimburse.settling') }}</h3>
    <div class="card">
      <div class="row-b"><b>焼肉Taso</b><span class="badge warn">{{ t('reimburse.settling') }}</span></div>
      <div class="kv" style="margin-top:6px"><span class="k">{{ t('reimburse.spend') }}</span><span class="v num">{{ USD(SPEND) }}</span></div>
      <div class="kv"><span class="k">{{ t('reimburse.lockedTier') }}</span><span class="v num gold">{{ t('reimburse.lockedTierV', { rate: fmtRate(LOCKED_RATE), task: 1 }) }}</span></div>
      <div class="kv"><span class="k">{{ t('reimburse.capLimit') }}</span><span class="v num">{{ USD(CAP) }}</span></div>
      <div class="kv"><span class="k">{{ t('reimburse.settled') }}</span><span class="v num ok">{{ USD(SETTLED) }}</span></div>
      <div class="kv"><span class="k">{{ t('reimburse.remain') }}</span><span class="v num">{{ USD(CAP - SETTLED) }}</span></div>
      <p class="meta" style="margin-top:8px">{{ t('reimburse.dailyRule', { rate: 0.05 }) }}</p>
      <button class="btn btn-o" style="margin-top:12px" @click="show('reimburse-detail')">{{ t('reimburse.viewDetail') }}</button>
    </div>
    <p class="meta" style="margin-top:12px">{{ t('reimburse.note') }}</p>
  </section>
</template>
