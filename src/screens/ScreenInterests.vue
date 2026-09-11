<script setup lang="ts">
import { ref } from 'vue'
import { app, show } from '../store'
import { t } from '../i18n'
import PageHeader from '../components/PageHeader.vue'

/** 兴趣标签(演示种子):语义化 key 驱动,扩展语言无需改页面结构 */
const INTEREST_KEYS = [
  'interests.ramen', 'interests.yakiniku', 'interests.coffee', 'interests.dessert', 'interests.onsen',
  'interests.island', 'interests.hotpot', 'interests.hotel', 'interests.cafe', 'interests.citywalk',
] as const

const interests = ref(INTEREST_KEYS.map(key => ({ key, on: false })))
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'interests' }" data-screen="interests">
    <PageHeader :title="t('interests.title')">
      <template #right><span class="meta">{{ t('interests.multi') }}</span></template>
    </PageHeader>
    <p style="margin:6px 0 16px;color:var(--muted);font-size:13px">{{ t('interests.hint') }}</p>
    <div class="chips" style="flex-wrap:wrap;gap:10px">
      <button
        v-for="item in interests" :key="item.key"
        class="chip" :class="{ on: item.on }"
        @click="item.on = !item.on"
      >{{ t(item.key) }}</button>
    </div>
    <div class="row" style="margin-top:28px;gap:10px">
      <button class="btn btn-o" style="flex:none;padding:10px 22px;color:var(--muted)" @click="show('home')">{{ t('common.skip') }}</button>
      <button class="btn btn-p" style="flex:1" @click="show('home')">{{ t('common.done') }}</button>
    </div>
  </section>
</template>
