<script setup lang="ts">
import { computed, ref } from 'vue'
import { app, show, openPostById } from '../store'
import { SEARCH_DB, MEMBERS, type SearchDoc } from '../data'
import { t, localName, countryName } from '../i18n'
import { compact } from '../i18n/format'
import PageHeader from '../components/PageHeader.vue'

/**
 * 多语言搜索(§8.3):对官方原名、各语言本地化名与别名/转写统一匹配;
 * 结果标题优先显示用户语言的名称,官方原名作为次级信息保留。
 */
const q = ref('')
const tab = ref<'all' | 'user' | 'merchant' | 'post' | 'place' | 'topic'>('all')

const tabs = computed(() => ([
  { k: 'all', label: t('search.tabAll') },
  { k: 'user', label: t('search.tabUsers') },
  { k: 'merchant', label: t('search.tabMerchants') },
  { k: 'post', label: t('search.tabPosts') },
  { k: 'place', label: t('search.tabPlaces') },
  { k: 'topic', label: t('search.tabTopics') },
] as const))

const haystack = (doc: SearchDoc) =>
  [doc.canonical, ...(doc.names ? Object.values(doc.names) : []), ...doc.aliases]
    .join(' ').toLowerCase()

const results = computed(() => {
  const keyword = q.value.trim().toLowerCase()
  return SEARCH_DB.filter(
    r =>
      (tab.value === 'all' || r.type === tab.value) &&
      (!keyword || haystack(r).includes(keyword)),
  )
})

/** 显示名:本地化名优先,无则用官方原名 */
const displayName = (doc: SearchDoc) => (doc.names ? localName(doc.names, doc.canonical) : doc.canonical)
/** 次级信息:与显示名不同的官方原名(帮助旅行场景线下识别) */
const canonicalName = (doc: SearchDoc) => (doc.names && doc.canonical !== displayName(doc) ? doc.canonical : '')

const typeLabel = (doc: SearchDoc) => t(`search.tab${doc.type.charAt(0).toUpperCase()}${doc.type.slice(1)}s`)

const iconFor = (type: SearchDoc['type']) =>
  ({ user: '#i-user', merchant: '#i-store', post: '#i-image', place: '#i-pin', topic: '#i-comment' })[type]

/** 描述行:结构化参数按类型格式化(数字紧凑化、国家名本地化) */
function descOf(doc: SearchDoc): string {
  const p = { ...doc.descParams } as Record<string, string | number>
  if (doc.member) p.bio = localName(MEMBERS[doc.member].bio)
  for (const k of Object.keys(p)) if (typeof p[k] === 'number') p[k] = compact(p[k] as number)
  if (doc.type === 'place' && typeof p.country === 'string') p.country = countryName(p.country)
  return t(doc.descKey, p)
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'search' }" data-screen="search">
    <PageHeader :back-btn="true">
      <template #title>
        <input v-model="q" class="input" :placeholder="t('search.placeholder')" style="flex:1;min-height:44px" />
      </template>
      <template #right>
        <button class="bk" :aria-label="t('a11y.clear')" @click="q = ''"><svg class="ic"><use href="#i-x"/></svg></button>
      </template>
    </PageHeader>
    <div class="chips" style="margin-top:8px">
      <button
        v-for="tb in tabs" :key="tb.k"
        class="chip" :class="{ on: tab === tb.k }"
        @click="tab = tb.k"
      >{{ tb.label }}</button>
    </div>
    <div class="stack" style="margin-top:14px">
      <button v-for="r in results" :key="r.type + r.canonical" class="li" @click="r.pid ? openPostById(r.pid) : show(r.go)">
        <span class="li-ic"><svg class="ic"><use :href="iconFor(r.type)"/></svg></span>
        <span>
          <span class="li-title" style="display:block">{{ displayName(r) }}<span v-if="canonicalName(r)" class="li-sub" style="margin-left:6px">{{ canonicalName(r) }}</span></span>
          <span class="li-sub">{{ typeLabel(r) }} · {{ descOf(r) }}</span>
        </span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <p v-if="!results.length" class="meta" style="padding:20px 0;text-align:center">{{ t('search.empty') }}</p>
    </div>
  </section>
</template>
