<script setup lang="ts">
import { computed, ref } from 'vue'
import { app, back, toast } from '../store'
import { COUNTRIES, card, countryLabel, countryLabelEn, switchCountry, type Country } from '../card'
import { t } from '../i18n'
import PageHeader from '../components/PageHeader.vue'

/** 国家/地区选择器(全球配送 PRD §8 + 本地化 §9.3):按 UI 语言显示本地化名,
 *  支持官方名 / 别名 / ISO 代码搜索 */

const q = ref('')

const zhNames = (code: string) => {
  const zhHans = new Intl.DisplayNames(['zh-Hans'], { type: 'region', fallback: 'code' }).of(code) ?? ''
  const zhHant = new Intl.DisplayNames(['zh-Hant'], { type: 'region', fallback: 'code' }).of(code) ?? ''
  return [zhHans, zhHant]
}

/** 命中集合:本地化名(当前 UI 语言 + en + zh)与 ISO 代码 */
const hit = computed(() => {
  const k = q.value.trim().toLowerCase()
  if (!k) return COUNTRIES
  return COUNTRIES.filter(c =>
    c.code.toLowerCase() === k
    || countryLabel(c.code).toLowerCase().includes(k)
    || countryLabelEn(c.code).toLowerCase().includes(k)
    || zhNames(c.code).some(n => n.includes(q.value.trim()))
  )
})
const recommended = computed(() => hit.value.filter(c => c.rec))
const others = computed(() => hit.value.filter(c => !c.rec).sort((a, b) => countryLabel(a.code).localeCompare(countryLabel(b.code))))

function pick(c: Country) {
  const same = c.code === card.draft.countryCode
  if (!same) {
    const had = switchCountry(c.code)
    if (had) toast(t('card.country.switched'))
  }
  back()
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'card-country' }" data-screen="card-country">
    <PageHeader :title="t('card.country.title')" />
    <div class="row" style="margin-top:8px;gap:10px">
      <svg class="ic" style="color:var(--muted);flex:none"><use href="#i-search"/></svg>
      <input v-model="q" class="input" :placeholder="t('card.country.search')">
    </div>

    <div v-if="recommended.length" class="card" style="margin-top:14px">
      <p class="meta" style="margin-bottom:2px">{{ t('card.country.recommended') }}</p>
      <button v-for="c in recommended" :key="c.code" class="ctry-row" @click="pick(c)">
        <span class="fl">{{ c.flag }}</span>
        <span class="nm">{{ countryLabel(c.code) }}<span class="en">{{ countryLabelEn(c.code) }}</span></span>
        <svg v-if="c.code === card.draft.countryCode" class="ic" style="color:var(--accent)"><use href="#i-check"/></svg>
        <span v-else-if="!c.shippable" class="badge" style="background:var(--danger-soft);color:var(--danger)">{{ t('card.country.noShip') }}</span>
      </button>
    </div>

    <div v-if="others.length" class="card" style="margin-top:10px">
      <p class="meta" style="margin-bottom:2px">{{ t('card.country.all') }}</p>
      <button v-for="c in others" :key="c.code" class="ctry-row" @click="pick(c)">
        <span class="fl">{{ c.flag }}</span>
        <span class="nm">{{ countryLabel(c.code) }}<span class="en">{{ countryLabelEn(c.code) }}</span></span>
        <svg v-if="c.code === card.draft.countryCode" class="ic" style="color:var(--accent)"><use href="#i-check"/></svg>
        <span v-else-if="!c.shippable" class="badge" style="background:var(--danger-soft);color:var(--danger)">{{ t('card.country.noShip') }}</span>
      </button>
    </div>

    <p v-if="!hit.length" class="meta" style="margin-top:20px;text-align:center">{{ t('card.country.empty') }}</p>
    <p class="meta" style="margin-top:14px">{{ t('card.country.note') }}</p>
  </section>
</template>
