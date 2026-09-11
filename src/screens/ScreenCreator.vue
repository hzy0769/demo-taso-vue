<script setup lang="ts">
import { app, openPostById, toast } from '../store'
import { t } from '../i18n'
import { fmtMoney, compact } from '../i18n/format'
import PageHeader from '../components/PageHeader.vue'

const contents = [
  { img: '/assets/taso-ramen.jpg', titleKey: 'creator.c1', views: 124000, amount: 120, pid: 4 },
  { img: '/assets/taso-yakiniku.jpg', titleKey: 'creator.c2', views: 62000, amount: 80, pid: 1 },
  { img: '/assets/taso-coffee.jpg', titleKey: 'creator.c3', views: 18000, amount: 23, pid: 2 },
] as const
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'creator' }" data-screen="creator">
    <PageHeader :title="t('creator.title')" />
    <div class="row" style="gap:8px;margin-top:8px">
      <div class="card" style="flex:1;padding:12px"><div class="num gold" style="font-weight:700">{{ fmtMoney({ amount: 620, currency: 'USD' }) }}</div><div class="meta">{{ t('creator.monthIncome') }}</div></div>
      <div class="card" style="flex:1;padding:12px"><div class="num warn" style="font-weight:700">{{ fmtMoney({ amount: 180, currency: 'USD' }) }}</div><div class="meta">{{ t('creator.pending') }}</div></div>
      <div class="card" style="flex:1;padding:12px"><div class="num ok" style="font-weight:700">{{ fmtMoney({ amount: 440, currency: 'USD' }) }}</div><div class="meta">{{ t('creator.settled') }}</div></div>
    </div>
    <h3 style="font-size:15px;font-weight:600;margin:18px 0 10px">{{ t('creator.performance') }}</h3>
    <div class="card" style="padding:4px 14px">
      <button v-for="c in contents" :key="c.titleKey" class="li" style="border:0" @click="openPostById(c.pid)">
        <img :src="c.img" width="44" height="44" alt="" style="border-radius:10px;width:44px;height:44px;object-fit:cover" />
        <span class="li-title">{{ t(c.titleKey) }}</span>
        <span class="li-val num">{{ t('creator.stat', { views: compact(c.views), amount: fmtMoney({ amount: c.amount, currency: 'USD' }) }) }}</span>
      </button>
    </div>
    <p class="meta" style="margin-top:12px">{{ t('creator.note') }}</p>
    <button class="btn btn-o" style="margin-top:16px" @click="toast(t('creator.rulesToast'))">{{ t('creator.rules') }}</button>
  </section>
</template>
