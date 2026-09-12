<script setup lang="ts">
import { computed } from 'vue'
import { app, show, syncAccountPrefs } from '../store'
import { t, prefs, UI_LANGS, regionName, uiLocaleLabel, suggestTimeZone } from '../i18n'
import ToggleSwitch from '../components/ToggleSwitch.vue'

/**
 * 欢迎页(评审 §1):首启以「设备语言 + 时区」给出可见但可跳过的建议,
 * 不预设任何市场;用户可修改,跳过 = 沿用建议值(来源标记 default)。
 * 翻译内容跟随 App 语言,所有语言内容皆可进入推荐候选。
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

/** 建议说明:告知当前值来自设备信号且可随时更改,不是定位结果 */
const suggested = computed(() => t('welcome.suggestHint', {
  lang: uiLocaleLabel(prefs.uiLocale),
  region: regionName(prefs.contentRegion),
  tz: suggestTimeZone(),
}))
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'welcome' }" data-screen="welcome">
    <div style="display:flex;justify-content:flex-end;padding:10px 0">
      <button class="bk" style="width:auto;padding:0 10px;font-size:13px;color:var(--muted)" @click="show('login')">{{ t('welcome.skip') }}</button>
    </div>
    <h1 style="font-size:26px;font-weight:700;letter-spacing:-.02em;line-height:1.3">Welcome to Taso<br /><span class="gold">{{ t('welcome.title') }}</span></h1>
    <p class="meta" style="margin-top:6px">{{ t('welcome.sub') }}</p>

    <!-- 设备建议说明(评审 §1:建议而非预设;未使用定位权限) -->
    <div class="suggest-bar" role="note">
      <svg class="ic sm" style="flex:none;margin-top:1px"><use href="#i-globe"/></svg>
      <span>{{ suggested }}</span>
    </div>

    <div class="card" style="margin-top:14px;padding:14px">
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
