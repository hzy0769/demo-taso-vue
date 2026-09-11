<script setup lang="ts">
import { app, show, syncAccountPrefs } from '../store'
import { t, prefs, UI_LANGS, regionName } from '../i18n'
import PageHeader from '../components/PageHeader.vue'
import ToggleSwitch from '../components/ToggleSwitch.vue'

/**
 * 精簡設定：只保留 App 顯示語言、內容地區和自動翻譯。
 * - 譯文目標永遠跟隨 App 顯示語言；
 * - 所有原文語言均可進入推薦候選；
 * - 時區與展示貨幣仍是格式化資料，不在此處要求用戶設定。
 */

const markUser = (k: string) => { prefs.sources[k] = 'user' }

function setUiLocale(code: string) {
  prefs.uiLocale = code
  markUser('uiLocale')
  syncAccountPrefs()
}
function setAutoTranslate(v: boolean) {
  prefs.autoTranslate = v
  markUser('autoTranslate')
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
