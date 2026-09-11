<script setup lang="ts">
import { computed, ref } from 'vue'
import { app, toast, openPostById } from '../store'
import { t, prefs } from '../i18n'
import { fmtMoney, fmtMoneyEstimate, fmtLocalDate, compact } from '../i18n/format'
import PageHeader from '../components/PageHeader.vue'

const saved = ref(false)
const seg = ref<'posts' | 'reviews' | 'offers'>('posts')

const segs = computed(() => ([
  { k: 'posts', label: t('merchant.segPosts') },
  { k: 'reviews', label: t('merchant.segReviews') },
  { k: 'offers', label: t('merchant.segOffers') },
] as const))

const price = { amount: 3800, currency: 'JPY' }
const priceText = computed(() => t('money.perPerson', { price: fmtMoney(price) }))
const priceEst = computed(() => fmtMoneyEstimate(price, prefs.displayCurrency))

function toggleSave() {
  saved.value = !saved.value
  toast(t(saved.value ? 'merchant.saved' : 'merchant.unsaved'))
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'merchant' }" data-screen="merchant">
    <PageHeader :title="t('merchant.title')">
      <template #right>
        <button class="bk" :aria-label="t('a11y.share')" @click="toast(t('post.shareCopied'))"><svg class="ic"><use href="#i-share"/></svg></button>
      </template>
    </PageHeader>
    <div class="img-wrap"><img src="/assets/taso-yakiniku.jpg" width="720" height="481" :alt="t('img.merchantStore')" /></div>
    <div style="margin-top:14px">
      <div class="row" style="gap:6px">
        <h2 style="font-size:21px;font-weight:700">焼肉Taso</h2><span class="badge soft">{{ t('post.partnerMerchant') }}</span>
      </div>
      <div class="row" style="margin-top:6px">
        <span class="num" style="font-weight:600">★4.7</span><span class="meta">{{ t('merchant.reviewsCount', { count: compact(2381) }) }}</span>
      </div>
      <p class="row meta" style="margin-top:6px"><svg class="ic sm"><use href="#i-pin"/></svg>Tokyo · Shibuya 1-2-3</p>
      <p class="meta" style="margin-top:4px">{{ priceText }}<template v-if="priceEst"> · ≈{{ priceEst.text }}({{ priceEst.rateNote }})</template></p>
    </div>
    <div class="row" style="margin-top:14px;gap:10px">
      <button class="btn btn-o" style="flex:1" @click="toast(t('merchant.navLaunched'))">{{ t('merchant.navBtn') }}</button>
      <button class="btn btn-o" style="flex:1" @click="toggleSave">{{ t('merchant.save') }}</button>
      <button class="btn btn-o" style="flex:1" @click="toast(t('post.shareCopied'))">{{ t('common.share') }}</button>
    </div>
    <div class="card" style="margin-top:14px;border-color:color-mix(in oklch,var(--accent) 55%,var(--border));background:color-mix(in oklch,var(--accent) 7%,var(--surface))">
      <div class="row-b">
        <span class="meta">{{ t('merchant.benefitBrand') }}</span>
        <span class="vfy"><svg class="ic sm f"><use href="#i-card"/></svg>{{ t('merchant.memberExclusive') }}</span>
      </div>
      <div style="font-weight:700;font-size:16px;margin-top:6px">{{ t('merchant.benefit', { off: t('merchant.off95') }) }}</div>
      <p class="meta" style="margin-top:4px">{{ t('merchant.validUntil', { date: fmtLocalDate('2026-12-31') }) }} · {{ t('merchant.redeemNote') }}</p>
    </div>
    <div class="row-b" style="margin-top:14px;font-size:14px"><span class="meta">{{ t('merchant.hoursToday') }}</span><b>11:00 – 23:00</b></div>
    <div class="seg" style="margin-top:14px">
      <button v-for="s in segs" :key="s.k" :class="{ on: seg === s.k }" @click="seg = s.k">{{ s.label }}</button>
    </div>
    <div class="stack" style="margin-top:12px">
      <button class="card" style="text-align:left;width:100%" @click="openPostById(4)">
        <div class="row">
          <img src="/assets/taso-ramen.jpg" width="56" height="56" alt="" style="border-radius:12px;width:56px;height:56px;object-fit:cover" />
          <div><b style="font-size:14px">@alex</b><p style="font-size:13px;color:var(--muted);margin-top:2px">{{ t('merchant.post1Desc') }}</p></div>
        </div>
      </button>
      <button class="card" style="text-align:left;width:100%" @click="openPostById(1)">
        <div class="row">
          <img src="/assets/taso-yakiniku.jpg" width="56" height="56" alt="" style="border-radius:12px;width:56px;height:56px;object-fit:cover" />
          <div><b style="font-size:14px">@tokyofood</b><p style="font-size:13px;color:var(--muted);margin-top:2px">{{ t('merchant.post2Desc') }}</p></div>
        </div>
      </button>
    </div>
  </section>
</template>
