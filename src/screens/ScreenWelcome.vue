<script setup lang="ts">
import { reactive } from 'vue'
import { app, show, syncAccountPrefs } from '../store'
import { t, prefs, UI_LANGS, CONTENT_LANGS, REGIONS, uiLocaleLabel, contentLocaleLabel, type PrefSource } from '../i18n'

/**
 * 歡迎頁(§4.3):首屏直接以繁體中文(香港)呈現,不阻塞註冊;
 * 提供緊湊的「語言與地區」入口;跳過 = 沿用默認值,繼續 = 保存為顯式用戶偏好。
 */
const draft = reactive({
  uiLocale: prefs.uiLocale,
  translationLocale: prefs.translationLocale,
  contentLocales: [...prefs.contentLocales],
  regionId: prefs.contentRegion.cityId ?? 'hong-kong',
})

const contentOptions = CONTENT_LANGS

/** 地区选项显示名跟随草稿 UI 语言即时预览(§6 即时预览) */
const langKey = (locale: string) =>
  locale.startsWith('zh-Hant') ? 'zh-Hant' : locale.startsWith('zh-Hans') ? 'zh-Hans' : locale.split('-')[0]
const regionOptLabel = (r: { names: Record<string, string> }) => r.names[langKey(draft.uiLocale)] ?? r.names.en

function toggleContent(code: string) {
  const i = draft.contentLocales.indexOf(code)
  if (i >= 0) {
    if (draft.contentLocales.length > 1) draft.contentLocales.splice(i, 1)
  } else {
    draft.contentLocales.push(code)
  }
}

const setSource = (k: string, s: PrefSource = 'user') => { prefs.sources[k] = s }

function commit() {
  const region = REGIONS.find(r => r.id === draft.regionId)
  prefs.uiLocale = draft.uiLocale
  prefs.translationLocale = draft.translationLocale
  prefs.contentLocales = [...draft.contentLocales]
  prefs.contentRegion = region ? { country: region.country, cityId: region.id } : { country: 'HK', cityId: 'hong-kong' }
  for (const k of ['uiLocale', 'translationLocale', 'contentLocales', 'contentRegion']) setSource(k)
  syncAccountPrefs()
  show('login')
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'welcome' }" data-screen="welcome">
    <div style="display:flex;justify-content:flex-end;padding:10px 0">
      <button class="bk" style="width:auto;padding:0 10px;font-size:13px;color:var(--muted)" @click="show('login')">{{ t('welcome.skip') }}</button>
    </div>
    <h1 style="font-size:26px;font-weight:700;letter-spacing:-.02em;line-height:1.3">Welcome to Taso<br /><span class="gold">{{ t('welcome.title') }}</span></h1>
    <p class="meta" style="margin-top:6px">{{ t('welcome.sub') }}</p>

    <div class="card" style="margin-top:24px;padding:14px">
      <div class="row-b" style="margin-bottom:4px">
        <b style="font-size:14px">{{ t('welcome.langRegion') }}</b>
      </div>
      <div class="field" style="margin-top:10px">
        <label>{{ t('lang.uiLanguage') }}</label>
        <select v-model="draft.uiLocale" class="input">
          <option v-for="l in UI_LANGS" :key="l.code" :value="l.code">{{ l.name }}</option>
        </select>
      </div>
      <div class="field" style="margin-top:12px">
        <label>{{ t('lang.contentLanguages') }}</label>
        <div class="chips">
          <button
            v-for="lang in contentOptions" :key="lang.code"
            class="chip" :class="{ on: draft.contentLocales.includes(lang.code) }"
            @click="toggleContent(lang.code)"
          >{{ lang.name }}</button>
        </div>
      </div>
      <div class="field" style="margin-top:12px">
        <label>{{ t('lang.translateTo') }}</label>
        <select v-model="draft.translationLocale" class="input">
          <option v-for="l in UI_LANGS" :key="l.code" :value="l.code">{{ l.name }}</option>
        </select>
      </div>
      <div class="field" style="margin-top:12px">
        <label>{{ t('lang.contentRegion') }}</label>
        <select v-model="draft.regionId" class="input">
          <option v-for="r in REGIONS" :key="r.id" :value="r.id">{{ regionOptLabel(r) }}</option>
        </select>
      </div>
    </div>

    <button class="btn btn-p" style="margin-top:22px" @click="commit">{{ t('welcome.start') }}</button>
    <p class="meta" style="margin-top:10px;font-size:11px;text-align:center">{{ t('welcome.nextHint') }}</p>
    <p class="meta" style="margin-top:14px;font-size:11px;text-align:center">
      {{ t('lang.uiLanguage') }}:{{ uiLocaleLabel(draft.uiLocale) }} · {{ t('lang.translateTo') }}:{{ uiLocaleLabel(draft.translationLocale) }} · {{ t('lang.contentLanguages') }}:{{ draft.contentLocales.map(contentLocaleLabel).join(t('common.listSeparator')) }}
    </p>
  </section>
</template>
