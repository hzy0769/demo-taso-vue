<script setup lang="ts">
import { ref } from 'vue'
import { app, show } from '../store'

const uiLang = ref('简体中文')
const region = ref('Hong Kong')
const contentLangs = ref([
  { label: '中文', on: true },
  { label: 'English', on: true },
  { label: '日本語', on: false },
  { label: '한국어', on: false },
])
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'welcome' }" data-screen="welcome">
    <div style="display:flex;justify-content:flex-end;padding:10px 0">
      <button class="bk" style="width:auto;padding:0 10px;font-size:13px;color:var(--muted)" @click="show('interests')">跳过</button>
    </div>
    <h1 style="font-size:26px;font-weight:700;letter-spacing:-.02em;line-height:1.3">Welcome to Taso<br /><span class="gold">发现世界的每一次体验</span></h1>
    <p class="meta" style="margin-top:6px">先选好语言与地区，让推荐更懂你。</p>
    <div class="field" style="margin-top:24px">
      <label>App 显示语言</label>
      <select v-model="uiLang" class="input">
        <option>简体中文</option><option>繁體中文</option><option>English</option><option>日本語</option><option>한국어</option>
      </select>
    </div>
    <div class="field" style="margin-top:16px">
      <label>内容语言（可多选）</label>
      <div class="chips">
        <button
          v-for="lang in contentLangs" :key="lang.label"
          class="chip" :class="{ on: lang.on }"
          @click="lang.on = !lang.on"
        >{{ lang.label }}</button>
      </div>
    </div>
    <div class="field" style="margin-top:16px">
      <label>所在地区</label>
      <select v-model="region" class="input">
        <option>Hong Kong</option><option>Tokyo</option><option>Bangkok</option><option>Seoul</option><option>中国大陆</option>
      </select>
    </div>
    <button class="btn btn-p" style="margin-top:28px" @click="show('interests')">开始探索</button>
  </section>
</template>
