<script setup lang="ts">
import { computed } from 'vue'
import { app, syncAccountPrefs } from '../store'
import {
  t, prefs, UI_LANGS, CONTENT_LANGS, REGIONS, TIMEZONES, CURRENCIES,
  regionName, currencyName, timeZoneLabel,
} from '../i18n'
import PageHeader from '../components/PageHeader.vue'
import ToggleSwitch from '../components/ToggleSwitch.vue'

/**
 * 语言与地区(設計方案 §6):六项独立设置——界面语言 / 翻译目标 / 内容语言 /
 * 内容地区 / 时区 / 显示货币,全部显示当前值并即时预览;附加自动翻译开关、
 * 本地内容优先级与「使用裝置設定建議」。账户国家、KYC 等合规字段不在此页。
 */

const markUser = (k: string) => { prefs.sources[k] = 'user' }

function setUiLocale(code: string) {
  prefs.uiLocale = code
  markUser('uiLocale')
  syncAccountPrefs()
}
function setTranslationLocale(code: string) {
  prefs.translationLocale = code
  markUser('translationLocale')
  syncAccountPrefs()
}
function toggleContent(code: string) {
  const i = prefs.contentLocales.indexOf(code)
  if (i >= 0) {
    if (prefs.contentLocales.length > 1) prefs.contentLocales.splice(i, 1)
  } else {
    prefs.contentLocales.push(code)
  }
  markUser('contentLocales')
  syncAccountPrefs()
}
function setRegion(id: string) {
  const region = REGIONS.find(r => r.id === id)
  if (region) {
    prefs.contentRegion = { country: region.country, cityId: region.id }
    markUser('contentRegion')
    syncAccountPrefs()
  }
}
function setTimeZone(tz: string) {
  prefs.timeZone = tz
  markUser('timeZone')
  syncAccountPrefs()
}
function setCurrency(c: string) {
  prefs.displayCurrency = c
  markUser('displayCurrency')
  syncAccountPrefs()
}
function setAutoTranslate(v: boolean) {
  prefs.autoTranslate = v
  markUser('autoTranslate')
  syncAccountPrefs()
}
function setPriority(v: 'high' | 'medium' | 'low') {
  prefs.localContentPriority = v
  markUser('localContentPriority')
  syncAccountPrefs()
}

/** 地区选项显示名跟随 UI 语言 */
const langKey = (locale: string) =>
  locale.startsWith('zh-Hant') ? 'zh-Hant' : locale.startsWith('zh-Hans') ? 'zh-Hans' : locale.split('-')[0]
const regionOptLabel = (r: { names: Record<string, string> }) => r.names[langKey(prefs.uiLocale)] ?? r.names.en

const priorities = computed(() => ([
  { k: 'high' as const, label: t('lang.priorityHigh') },
  { k: 'medium' as const, label: t('lang.priorityMedium') },
  { k: 'low' as const, label: t('lang.priorityLow') },
]))

/** 裝置設定僅作建議(§4.2):不覆蓋已保存選擇,需用戶確認後套用 */
const deviceLang = navigator.language || 'zh-Hant-HK'
const deviceTz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Hong_Kong'

function applyDevice() {
  prefs.timeZone = deviceTz
  markUser('timeZone')
  syncAccountPrefs()
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'language' }" data-screen="language">
    <PageHeader :title="t('lang.title')" />

    <div class="field" style="margin-top:8px">
      <label>{{ t('lang.uiLanguage') }}</label>
      <select :value="prefs.uiLocale" class="input" @change="setUiLocale(($event.target as HTMLSelectElement).value)">
        <option v-for="l in UI_LANGS" :key="l.code" :value="l.code">{{ l.name }}</option>
      </select>
    </div>

    <div class="field" style="margin-top:14px">
      <label>{{ t('lang.translateTo') }}</label>
      <select :value="prefs.translationLocale" class="input" @change="setTranslationLocale(($event.target as HTMLSelectElement).value)">
        <option v-for="l in UI_LANGS" :key="l.code" :value="l.code">{{ l.name }}</option>
      </select>
    </div>

    <div class="field" style="margin-top:14px">
      <label>{{ t('lang.contentLanguages') }}</label>
      <div class="chips">
        <button
          v-for="lang in CONTENT_LANGS" :key="lang.code"
          class="chip" :class="{ on: prefs.contentLocales.includes(lang.code) }"
          @click="toggleContent(lang.code)"
        >{{ lang.name }}</button>
      </div>
    </div>

    <div class="field" style="margin-top:14px">
      <label>{{ t('lang.contentRegion') }}</label>
      <select :value="prefs.contentRegion.cityId" class="input" @change="setRegion(($event.target as HTMLSelectElement).value)">
        <option v-for="r in REGIONS" :key="r.id" :value="r.id">{{ regionOptLabel(r) }}</option>
      </select>
      <p class="meta" style="margin-top:6px;font-size:11px">{{ t('lang.contentRegion') }}:{{ regionName(prefs.contentRegion) }}({{ prefs.contentRegion.country }})</p>
    </div>

    <div class="field" style="margin-top:14px">
      <label>{{ t('lang.timezone') }}</label>
      <select :value="prefs.timeZone" class="input" @change="setTimeZone(($event.target as HTMLSelectElement).value)">
        <option v-for="tz in TIMEZONES" :key="tz" :value="tz">{{ timeZoneLabel(tz) }}</option>
      </select>
    </div>

    <div class="field" style="margin-top:14px">
      <label>{{ t('lang.displayCurrency') }}</label>
      <select :value="prefs.displayCurrency" class="input" @change="setCurrency(($event.target as HTMLSelectElement).value)">
        <option v-for="c in CURRENCIES" :key="c" :value="c">{{ currencyName(c) }} · {{ c }}</option>
      </select>
    </div>

    <div class="li" style="margin-top:16px;border:0">
      <span class="li-title">{{ t('lang.autoTranslate') }}</span>
      <ToggleSwitch :model-value="prefs.autoTranslate" :label="t('lang.autoTranslate')" @update:model-value="setAutoTranslate" />
    </div>
    <p class="meta" style="margin-top:2px;font-size:11px">{{ t('lang.autoTranslateSub') }}</p>

    <div class="field" style="margin-top:14px">
      <label>{{ t('lang.localPriority') }}</label>
      <div class="seg">
        <button v-for="p in priorities" :key="p.k" :class="{ on: prefs.localContentPriority === p.k }" @click="setPriority(p.k)">{{ p.label }}</button>
      </div>
    </div>

    <div class="card" style="margin-top:14px">
      <div class="row-b">
        <div>
          <b style="font-size:14px">{{ t('lang.deviceSuggest') }}</b>
          <p class="meta" style="margin-top:4px">{{ t('lang.deviceSuggestSub', { lang: deviceLang, tz: deviceTz }) }}</p>
        </div>
        <button class="btn btn-o" style="width:auto;min-height:36px;padding:6px 14px;font-size:13px" @click="applyDevice">{{ t('common.apply') }}</button>
      </div>
    </div>

    <div class="li" style="margin-top:14px;border:0">
      <span class="li-title">{{ t('lang.manageLangs') }}</span>
      <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
    </div>
    <p class="meta" style="margin-top:2px;font-size:11px">{{ t('lang.manageLangsSub') }}</p>

    <p class="meta" style="margin-top:14px;font-size:11px">{{ t('lang.currencyNote') }}</p>
  </section>
</template>
