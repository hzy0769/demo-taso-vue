<script setup lang="ts">
import { computed, ref } from 'vue'
import { app, show, openPostById } from '../store'
import { SEARCH_DB, type SearchItem } from '../data'
import PageHeader from '../components/PageHeader.vue'

const q = ref('')
const tab = ref('全部')
const tabs = ['全部', '用户', '商家', '帖子', '地点', '话题']

const results = computed(() => {
  const keyword = q.value.trim().toLowerCase()
  return SEARCH_DB.filter(
    r =>
      (tab.value === '全部' || r.t === tab.value) &&
      (!keyword || r.n.toLowerCase().includes(keyword) || r.d.toLowerCase().includes(keyword)),
  )
})

const iconFor = (t: SearchItem['t']) =>
  ({ 用户: '#i-user', 商家: '#i-store', 帖子: '#i-image', 地点: '#i-pin', 话题: '#i-comment' })[t]
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'search' }" data-screen="search">
    <PageHeader :back-btn="true">
      <template #title>
        <input v-model="q" class="input" placeholder="拉面 / ramen / ラーメン" style="flex:1;min-height:44px" />
      </template>
      <template #right>
        <button class="bk" aria-label="清空" @click="q = ''"><svg class="ic"><use href="#i-x"/></svg></button>
      </template>
    </PageHeader>
    <div class="chips" style="margin-top:8px">
      <button
        v-for="t in tabs" :key="t"
        class="chip" :class="{ on: tab === t }"
        @click="tab = t"
      >{{ t }}</button>
    </div>
    <div class="stack" style="margin-top:14px">
      <button v-for="r in results" :key="r.t + r.n" class="li" @click="r.pid ? openPostById(r.pid) : show(r.go)">
        <span class="li-ic"><svg class="ic"><use :href="iconFor(r.t)"/></svg></span>
        <span>
          <span class="li-title" style="display:block">{{ r.n }}</span>
          <span class="li-sub">{{ r.t }} · {{ r.d }}</span>
        </span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <p v-if="!results.length" class="meta" style="padding:20px 0;text-align:center">没有匹配结果，试试「拉面 / ramen / ラーメン」</p>
    </div>
  </section>
</template>
