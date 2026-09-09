<script setup lang="ts">
import { ref } from 'vue'
import { app } from '../store'
import PageHeader from '../components/PageHeader.vue'
import ToggleSwitch from '../components/ToggleSwitch.vue'

const uiLang = ref('中文（简体）')
const translateTo = ref('中文（简体）')
const region = ref('Hong Kong')
const priority = ref('高')
const contentLangs = ref([
  { label: '中文', on: true },
  { label: 'English', on: true },
  { label: '日本語', on: true },
  { label: '한국어', on: false },
])
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'language' }" data-screen="language">
    <PageHeader title="语言与地区" />
    <div class="field" style="margin-top:8px">
      <label>App 显示语言</label>
      <select v-model="uiLang" class="input">
        <option>中文（简体）</option><option>中文（繁體）</option><option>English</option><option>日本語</option><option>한국어</option>
      </select>
    </div>
    <div class="field" style="margin-top:14px">
      <label>内容语言</label>
      <div class="chips">
        <button
          v-for="lang in contentLangs" :key="lang.label"
          class="chip" :class="{ on: lang.on }"
          @click="lang.on = !lang.on"
        >{{ lang.label }}</button>
      </div>
    </div>
    <div class="li" style="margin-top:14px;border:0">
      <span class="li-title">自动翻译</span>
      <ToggleSwitch label="自动翻译" />
    </div>
    <div class="field" style="margin-top:12px">
      <label>自动翻译到</label>
      <select v-model="translateTo" class="input">
        <option>中文（简体）</option><option>English</option><option>日本語</option>
      </select>
    </div>
    <div class="field" style="margin-top:14px">
      <label>显示地区</label>
      <select v-model="region" class="input">
        <option>Hong Kong</option><option>Tokyo</option><option>Bangkok</option><option>Seoul</option>
      </select>
    </div>
    <div class="field" style="margin-top:14px">
      <label>本地内容优先级</label>
      <select v-model="priority" class="input">
        <option>高</option><option>中</option><option>低</option>
      </select>
    </div>
  </section>
</template>
