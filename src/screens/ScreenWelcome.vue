<script setup lang="ts">
import { app, show, syncAccountPrefs } from '../store'
import { t, prefs, UI_LANGS, regionName } from '../i18n'
import ToggleSwitch from '../components/ToggleSwitch.vue'

/**
 * 歡迎頁(§4.3):首屏直接以繁體中文(香港)呈現,不阻塞註冊;
 * 提供緊湊的三項設定;跳過 = 沿用默認值。
 * 翻譯內容跟隨 App 語言，所有語言內容皆可進入推薦候選。
 */
function setUiLocale(code: string) {
  prefs.uiLocale = code
  prefs.sources.uiLocale = 'user'
  syncAccountPrefs()
}

function setAutoTranslate(v: boolean) {
  prefs.autoTranslate = v
  prefs.sources.autoTranslate = 'user'
  syncAccountPrefs()
}

function commit() {
  prefs.sources.contentRegion = 'user'
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
        <select :value="prefs.uiLocale" class="input" @change="setUiLocale(($event.target as HTMLSelectElement).value)">
          <option v-for="l in UI_LANGS" :key="l.code" :value="l.code">{{ l.name }}</option>
        </select>
      </div>
      <button class="li" style="margin-top:12px;width:100%;border:0" @click="show('content-region')">
        <span class="li-ic"><svg class="ic"><use href="#i-pin"/></svg></span>
        <span class="li-title">{{ t('lang.contentRegion') }}</span>
        <span class="li-val">{{ regionName(prefs.contentRegion) }}</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <div class="li" style="margin-top:4px;border:0">
        <span class="li-title">{{ t('lang.autoTranslate') }}</span>
        <ToggleSwitch :model-value="prefs.autoTranslate" :label="t('lang.autoTranslate')" @update:model-value="setAutoTranslate" />
      </div>
    </div>

    <button class="btn btn-p" style="margin-top:22px" @click="commit">{{ t('welcome.start') }}</button>
    <p class="meta" style="margin-top:10px;font-size:11px;text-align:center">{{ t('welcome.nextHint') }}</p>
  </section>
</template>
