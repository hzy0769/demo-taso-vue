<script setup lang="ts">
import { computed } from 'vue'
import { app } from '../store'
import { t, languageName } from '../i18n'
import { fmtMoney, relTime } from '../i18n/format'
import PageHeader from '../components/PageHeader.vue'

/** 通知项:事件数据 + 可本地化模板 key(§8.2),时间/金额为结构化参数 */
const filterLabels = computed(() => ([
  { k: 'all', label: t('notifications.all') },
  { k: 'interact', label: t('notifications.interact') },
  { k: 'follow', label: t('notifications.follow') },
  { k: 'orders', label: t('notifications.orders') },
  { k: 'review', label: t('notifications.review') },
  { k: 'system', label: t('notifications.system') },
] as const))

const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString()

const items = computed(() => ([
  { icon: '#i-heart', title: t('notifications.like'), sub: t('notifications.likeSub'), at: minutesAgo(2), cat: 'interact' },
  { icon: '#i-user-plus', title: t('notifications.friend'), sub: t('notifications.friendSub'), at: minutesAgo(5), cat: 'follow' },
  { icon: '#i-check', title: t('notifications.receipt'), sub: t('notifications.receiptSub'), at: minutesAgo(61), cat: 'review' },
  { icon: '#i-wallet', title: t('notifications.dailyBenefit', { money: fmtMoney({ amount: 0.4, currency: 'USD' }) }), sub: t('notifications.dailyBenefitSub'), at: minutesAgo(180), cat: 'orders' },
  { icon: '#i-card', title: t('notifications.topup', { money: fmtMoney({ amount: 10000, currency: 'USD' }) }), sub: t('notifications.topupSub'), at: minutesAgo(1500), cat: 'orders' },
  { icon: '#i-globe', title: t('notifications.translated', { language: languageName('ja') }), sub: t('notifications.translatedSub'), at: minutesAgo(1600), cat: 'system' },
]))
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'notifications' }" data-screen="notifications">
    <PageHeader :title="t('notifications.title')" />
    <div class="chips" style="margin-top:8px">
      <button v-for="f in filterLabels" :key="f.k" class="chip" :class="{ on: f.k === 'all' }">{{ f.label }}</button>
    </div>
    <div class="stack" style="margin-top:14px">
      <div v-for="it in items" :key="it.title + it.at" class="card">
        <div class="row">
          <span class="li-ic"><svg class="ic"><use :href="it.icon"/></svg></span>
          <div style="flex:1">
            <b style="font-size:14px">{{ it.title }}</b>
            <p class="meta">{{ it.sub }} · {{ relTime(it.at) }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
