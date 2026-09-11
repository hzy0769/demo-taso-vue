<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { app, back, syncAccountPrefs } from '../store'
import {
  t, prefs, COUNTRY_CODES, citiesForCountry, countryFlag, countryName, countrySearchNames,
  localName, rememberRegion, type ContentRegion,
} from '../i18n'
import PageHeader from '../components/PageHeader.vue'

/**
 * 內容地區選擇器：
 * - 「全球」解除地理篩選；
 * - 選過的國家 / 城市進入「最近使用」，冷啟動回退推薦地區；
 * - 支援 ISO 完整國家 / 地區清單與多語搜尋；
 * - 選中有城市資料的市場後，可選「全部該國」或一座城市。
 */
const q = ref('')
const countryForCityStep = ref('')
const suggested = ['HK', 'JP', 'TH', 'KR', 'SG', 'US', 'GB']

const normalizedQuery = computed(() => q.value.trim().toLowerCase())
const allCountries = computed(() => [...COUNTRY_CODES].sort((a, b) => countryName(a).localeCompare(countryName(b))))
const matchingCountries = computed(() => {
  const query = normalizedQuery.value
  if (!query) return allCountries.value
  return allCountries.value.filter(code =>
    code.toLowerCase().includes(query)
    || countrySearchNames(code).some(name => name.toLowerCase().includes(query)),
  )
})
const matchingCities = computed(() => {
  const query = normalizedQuery.value
  if (!query || countryForCityStep.value) return []
  return Object.values(CITY_BY_ID).filter(city =>
    city.namesText.toLowerCase().includes(query) || city.aliases.some(alias => alias.toLowerCase().includes(query)),
  )
})
const recommendationList = computed(() => suggested.filter(code => matchingCountries.value.includes(code)))
/** 搜尋時全部匹配項進入「搜尋結果」;瀏覽態才把推薦國家從長列表中分離。 */
const otherCountries = computed(() => normalizedQuery.value
  ? matchingCountries.value
  : matchingCountries.value.filter(code => !suggested.includes(code)))
const selectedCities = computed(() => citiesForCountry(countryForCityStep.value))

/** 提前攤平城市名稱，避免把城市搜尋限制為當前 UI 文字。 */
const CITY_BY_ID = Object.fromEntries(
  COUNTRY_CODES.flatMap(code => citiesForCountry(code)).map(city => [city.id, {
    ...city,
    namesText: Object.values(city.names).join(' '),
  }]),
)

function save(region: ContentRegion) {
  prefs.contentRegion = { ...region }
  rememberRegion(region)
  prefs.sources.contentRegion = 'user'
  syncAccountPrefs()
  back()
}

function chooseGlobal() {
  save({ scope: 'global', country: '' })
}

function chooseCountry(code: string) {
  const cities = citiesForCountry(code)
  if (cities.length) {
    q.value = ''
    countryForCityStep.value = code
  } else {
    save({ scope: 'country', country: code })
  }
}

function chooseAllInCountry() {
  if (countryForCityStep.value) save({ scope: 'country', country: countryForCityStep.value })
}

function chooseCity(cityId: string) {
  const city = CITY_BY_ID[cityId]
  if (city) save({ scope: 'city', country: city.country, cityId })
}

function selectedCountry(code: string) {
  return prefs.contentRegion.scope !== 'global' && prefs.contentRegion.country === code
}

function selectedCity(id: string) {
  return prefs.contentRegion.scope === 'city' && prefs.contentRegion.cityId === id
}

function selectedRegion(r: ContentRegion) {
  return prefs.contentRegion.scope === r.scope
    && prefs.contentRegion.country === r.country
    && prefs.contentRegion.cityId === r.cityId
}

/** 最近使用條目名:城市 → 城市名,國家 → 國家 / 地區名 */
function recentLabel(r: ContentRegion) {
  if (r.scope === 'city' && r.cityId) {
    const city = CITY_BY_ID[r.cityId]
    if (city) return localName(city.names)
  }
  return countryName(r.country)
}

function resetToCountries() {
  countryForCityStep.value = ''
  q.value = ''
}

/** 屏幕常駐掛載:離開頁面時清掉二級步驟與搜尋詞,下次進入回到頂層列表。 */
watch(() => app.screen, screen => {
  if (screen !== 'content-region') resetToCountries()
})
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'content-region' }" data-screen="content-region">
    <PageHeader :title="t('contentRegion.title')" />

    <template v-if="countryForCityStep">
      <button class="li" style="margin-top:8px;width:100%;border:0" @click="resetToCountries">
        <span class="li-ic"><svg class="ic"><use href="#i-back"/></svg></span>
        <span class="li-title">{{ countryName(countryForCityStep) }}</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <p class="meta" style="margin:12px 0 6px">{{ t('contentRegion.chooseScope') }}</p>
      <div class="card">
        <button class="ctry-row" @click="chooseAllInCountry">
          <span class="fl">{{ countryFlag(countryForCityStep) }}</span>
          <span class="nm">{{ t('contentRegion.allInCountry', { country: countryName(countryForCityStep) }) }}</span>
          <svg v-if="prefs.contentRegion.scope === 'country' && prefs.contentRegion.country === countryForCityStep" class="ic" style="color:var(--accent)"><use href="#i-check"/></svg>
        </button>
        <button v-for="city in selectedCities" :key="city.id" class="ctry-row" @click="chooseCity(city.id)">
          <span class="li-ic"><svg class="ic"><use href="#i-pin"/></svg></span>
          <span class="nm">{{ localName(city.names) }}</span>
          <svg v-if="selectedCity(city.id)" class="ic" style="color:var(--accent)"><use href="#i-check"/></svg>
        </button>
      </div>
      <p class="meta" style="margin-top:14px">{{ t('contentRegion.cityHint') }}</p>
    </template>

    <template v-else>
      <div class="row" style="margin-top:8px;gap:10px">
        <svg class="ic" style="color:var(--muted);flex:none"><use href="#i-search"/></svg>
        <input v-model="q" class="input" :placeholder="t('contentRegion.search')">
      </div>

      <button class="card row-b" style="margin-top:14px;width:100%;text-align:left" @click="chooseGlobal">
        <div class="row">
          <span class="li-ic"><svg class="ic"><use href="#i-globe"/></svg></span>
          <div>
            <b style="font-size:14px">{{ t('contentRegion.global') }}</b>
            <p class="meta" style="margin-top:2px">{{ t('contentRegion.globalSub') }}</p>
          </div>
        </div>
        <svg v-if="prefs.contentRegion.scope === 'global'" class="ic" style="color:var(--accent)"><use href="#i-check"/></svg>
      </button>

      <div v-if="matchingCities.length" class="card" style="margin-top:10px">
        <p class="meta" style="margin-bottom:2px">{{ t('contentRegion.cities') }}</p>
        <button v-for="city in matchingCities" :key="city.id" class="ctry-row" @click="chooseCity(city.id)">
          <span class="li-ic"><svg class="ic"><use href="#i-pin"/></svg></span>
          <span class="nm">{{ localName(city.names) }}<span class="en">{{ countryName(city.country) }}</span></span>
          <svg v-if="selectedCity(city.id)" class="ic" style="color:var(--accent)"><use href="#i-check"/></svg>
        </button>
      </div>

      <div v-if="prefs.recentRegions.length && !normalizedQuery" class="card" style="margin-top:10px">
        <p class="meta" style="margin-bottom:2px">{{ t('contentRegion.recent') }}</p>
        <button v-for="r in prefs.recentRegions" :key="`${r.scope}:${r.country}:${r.cityId ?? ''}`" class="ctry-row" @click="save(r)">
          <span v-if="r.scope === 'city'" class="li-ic"><svg class="ic"><use href="#i-pin"/></svg></span>
          <span v-else class="fl">{{ countryFlag(r.country) }}</span>
          <span class="nm">{{ recentLabel(r) }}<span v-if="r.scope === 'city'" class="en">{{ countryName(r.country) }}</span></span>
          <svg v-if="selectedRegion(r)" class="ic" style="color:var(--accent)"><use href="#i-check"/></svg>
        </button>
      </div>

      <div v-if="!prefs.recentRegions.length && recommendationList.length && !normalizedQuery" class="card" style="margin-top:10px">
        <p class="meta" style="margin-bottom:2px">{{ t('contentRegion.recommended') }}</p>
        <button v-for="code in recommendationList" :key="code" class="ctry-row" @click="chooseCountry(code)">
          <span class="fl">{{ countryFlag(code) }}</span>
          <span class="nm">{{ countryName(code) }}</span>
          <svg v-if="selectedCountry(code)" class="ic" style="color:var(--accent)"><use href="#i-check"/></svg>
          <svg v-else-if="citiesForCountry(code).length" class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
        </button>
      </div>

      <div v-if="otherCountries.length" class="card" style="margin-top:10px">
        <p class="meta" style="margin-bottom:2px">{{ normalizedQuery ? t('contentRegion.results') : t('contentRegion.allCountries') }}</p>
        <button v-for="code in otherCountries" :key="code" class="ctry-row" @click="chooseCountry(code)">
          <span class="fl">{{ countryFlag(code) }}</span>
          <span class="nm">{{ countryName(code) }}</span>
          <svg v-if="selectedCountry(code)" class="ic" style="color:var(--accent)"><use href="#i-check"/></svg>
          <svg v-else-if="citiesForCountry(code).length" class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
        </button>
      </div>

      <p v-if="!matchingCountries.length && !matchingCities.length" class="meta" style="margin-top:20px;text-align:center">{{ t('contentRegion.empty') }}</p>
      <p class="meta" style="margin-top:14px">{{ t('contentRegion.help') }}</p>
    </template>
  </section>
</template>
