<script setup lang="ts">
import { app, show, syncAccountPrefs } from '../store'
import { t, prefs, UI_LANGS, LOCAL_CURRENCIES, LANG_CURRENCY, regionName, currencyName, currencyFlag } from '../i18n'
import PageHeader from '../components/PageHeader.vue'
import ToggleSwitch from '../components/ToggleSwitch.vue'

/**
 * 精簡設定:App 顯示語言、內容地區、自動翻譯、本地貨幣(V2.12 新增)。
 * - 譯文目標永遠跟隨 App 顯示語言;所有原文語言均可進入推薦候選;
 * - 本地貨幣下拉選項 = 顯示語言所屬地區的貨幣(UI_LANGS 對應去重);
 *   未顯式設置時跟隨語言自動切換,顯式保存後(sources=user)不再聯動;
 * - 時區仍是格式化資料,不在此處要求用戶設定。
 */

const markUser = (k: string) => { prefs.sources[k] = 'user' }

function setUiLocale(code: string) {
  prefs.uiLocale = code
  markUser('uiLocale')
  // 本地貨幣未顯式設置時跟隨語言所屬地區貨幣(顯式保存後永不覆蓋,§4.4)
  if (prefs.sources.displayCurrency !== 'user') {
    prefs.displayCurrency = LANG_CURRENCY[code] ?? 'HKD'
  }
  syncAccountPrefs()
}
function setAutoTranslate(v: boolean) {
  prefs.autoTranslate = v
  markUser('autoTranslate')
  syncAccountPrefs()
}
function setLocalCurrency(code: string) {
  prefs.displayCurrency = code
  markUser('displayCurrency')
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
      <label>{{ t('lang.localCurrency') }}</label>
      <select :value="prefs.displayCurrency" class="input" @change="setLocalCurrency(($event.target as HTMLSelectElement).value)">
        <option v-for="c in LOCAL_CURRENCIES" :key="c" :value="c">{{ currencyFlag(c) }} {{ currencyName(c) }} · {{ c }}</option>
      </select>
      <p class="meta" style="margin-top:6px;font-size:11px">{{ t('lang.localCurrencySub') }}</p>
    </div>

    <button class="li" style="margin-top:14px;width:100%;border:0" @click="show('content-region')">
      <span class="li-ic"><svg class="ic"><use href="#i-pin"/></svg></span>
      <span class="li-title">{{ t('lang.contentRegion') }}</span>
      <span class="li-val">{{ regionName(prefs.contentRegion) }}</span>
      <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
    </button>

    <div class="li" style="margin-top:16px;border:0">
      <span class="li-title">{{ t('lang.autoTranslate') }}</span>
      <ToggleSwitch :model-value="prefs.autoTranslate" :label="t('lang.autoTranslate')" @update:model-value="setAutoTranslate" />
    </div>
    <p class="meta" style="margin-top:2px;font-size:11px">{{ t('lang.autoTranslateSub') }}</p>
  </section>
</template>
