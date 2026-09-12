<script setup lang="ts">
import { computed } from 'vue'
import { app, show } from '../store'
import { t, prefs, regionName } from '../i18n'
import PageHeader from '../components/PageHeader.vue'

/**
 * 城市卡片:canonical 名 + 本地化热度(§8.3 双名展示)。
 * 首个筛选位为「所选地区精选」而非「附近」(评审 §2):
 * 未接入定位权限时不得暗示真实距离,排序依据是内容地区,不是设备位置。
 */
const chips = computed(() => ([
  { k: 'region', label: t('discover.regionPicks', { region: regionName(prefs.contentRegion) }) },
  { k: 'cities', label: t('discover.cities') },
  { k: 'food', label: t('discover.food') },
  { k: 'travel', label: t('discover.travel') },
  { k: 'hot', label: t('discover.hot') },
  { k: 'offers', label: t('discover.offers') },
] as const))

const CITIES = [
  { id: 'tokyo', canonical: 'Tokyo', img: '/assets/taso-tokyo.jpg', w: 720, h: 467, heat: 98 },
  { id: 'hong-kong', canonical: 'Hong Kong', img: '/assets/taso-hongkong.jpg', w: 720, h: 450, heat: 92 },
  { id: 'bangkok', canonical: 'Bangkok', img: '/assets/taso-bangkok.jpg', w: 720, h: 557, heat: 91 },
  { id: 'seoul', canonical: 'Seoul', img: '/assets/taso-seoul.jpg', w: 720, h: 1117, heat: 89 },
] as const

const cityOf = (cityId: string) => regionName({ country: '', cityId })
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'discover' }" data-screen="discover">
    <PageHeader :title="t('discover.title')" :back-btn="false">
      <template #right>
        <button class="bk" :aria-label="t('a11y.notifications')" @click="show('notifications')"><svg class="ic"><use href="#i-bell"/></svg></button>
      </template>
    </PageHeader>
    <button class="row input" style="width:100%;text-align:left;color:var(--muted)" @click="show('search')">
      <svg class="ic"><use href="#i-search"/></svg>{{ t('discover.searchHint') }}
    </button>
    <div class="chips" style="margin-top:12px">
      <button v-for="c in chips" :key="c.k" class="chip" :class="{ on: c.k === 'region' }">{{ c.label }}</button>
    </div>
    <h3 style="font-size:15px;font-weight:600;margin:18px 0 10px">{{ t('discover.hotCities') }}</h3>
    <div class="grid-2">
      <button v-for="c in CITIES" :key="c.id" class="tile img-wrap" @click="show('place')">
        <img :src="c.img" :width="c.w" :height="c.h" :alt="t(`img.${c.id === 'hong-kong' ? 'hongkong' : c.id}`)" />
        <span class="cap">{{ cityOf(c.id) }} <span class="sub">{{ c.canonical }} · {{ t('discover.heat', { n: c.heat }) }}</span></span>
      </button>
    </div>
    <h3 style="font-size:15px;font-weight:600;margin:18px 0 10px">{{ t('discover.todayHot') }}</h3>
    <div class="stack">
      <button class="li" @click="show('merchant')">
        <span class="li-ic"><svg class="ic"><use href="#i-store"/></svg></span>
        <span class="li-title">焼肉Taso</span><span class="li-sub">Shibuya · ★4.7</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" @click="show('merchant')">
        <span class="li-ic"><svg class="ic"><use href="#i-store"/></svg></span>
        <span class="li-title">鮨 Taso</span><span class="li-sub">Tokyo · ★4.8</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" @click="show('merchant')">
        <span class="li-ic"><svg class="ic"><use href="#i-store"/></svg></span>
        <span class="li-title">Taso Coffee</span><span class="li-sub">{{ cityOf('hong-kong') }} · ★4.6</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
    </div>
    <h3 style="font-size:15px;font-weight:600;margin:18px 0 10px">{{ t('discover.trendingSearches') }}</h3>
    <div class="chips">
      <button class="chip">{{ t('interests.ramen') }}</button><button class="chip">{{ t('interests.yakiniku') }}</button><button class="chip">{{ t('interests.hotel') }}</button><button class="chip">{{ t('interests.onsen') }}</button><button class="chip">{{ t('interests.coffee') }}</button>
    </div>
  </section>
</template>
