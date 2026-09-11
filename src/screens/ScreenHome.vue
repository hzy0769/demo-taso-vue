<script setup lang="ts">
import { computed, ref } from 'vue'
import { app, show } from '../store'
import { t, prefs, regionName, isInContentRegion } from '../i18n'
import { localeMatches, pickTranslation } from '../i18n/content'
import PostCard from '../components/PostCard.vue'

const feed = ref<'foryou' | 'following'>('foryou')
const unread = computed(() => app.social.convs.reduce((n, c) => n + c.unread, 0))

/**
 * 所有原文語言均可成為候選；內容地區只調整「為你推薦」的排序。
 * 因此選「泰國」會先看泰國相關內容，沒有足夠本地內容時仍保留全球興趣內容，
 * 而非把首頁變成空白。追蹤流則永遠保留追蹤關係的完整性。
 * 次級排序：無可用譯文的外語原文降低排序但不過濾（規則 §2）。
 */
function translationRank(post: typeof app.foryou[number]): number {
  const locale = post.original.locale
  if (!locale || localeMatches(prefs.uiLocale, locale)) return 0
  return pickTranslation(post) ? 0 : 1
}

const forYouPosts = computed(() => {
  const unique = new Map<number, typeof app.foryou[number]>()
  for (const post of [...app.foryou, ...app.following]) unique.set(post.id, post)
  const posts = [...unique.values()]
  if (prefs.contentRegion.scope === 'global') {
    return [...posts].sort((a, b) => translationRank(a) - translationRank(b))
  }
  return [
    ...posts.filter(post => isInContentRegion(post.placeCityId)).sort((a, b) => translationRank(a) - translationRank(b)),
    ...posts.filter(post => !isInContentRegion(post.placeCityId)).sort((a, b) => translationRank(a) - translationRank(b)),
  ]
})
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'home' }" data-screen="home">
    <header class="hd">
      <div style="font-family:var(--font-mono);font-weight:700;letter-spacing:.18em;font-size:18px">TASO</div>
      <div style="flex:1"></div>
      <button class="bk" :aria-label="t('a11y.search')" @click="show('search')"><svg class="ic"><use href="#i-search"/></svg></button>
      <button class="bk" :aria-label="t('a11y.messages')" @click="show('messages')"><svg class="ic"><use href="#i-chat"/></svg><span v-if="unread" class="rdot">{{ unread > 99 ? '99+' : unread }}</span></button>
      <button class="bk" :aria-label="t('a11y.notifications')" @click="show('notifications')"><svg class="ic"><use href="#i-bell"/></svg></button>
    </header>
    <div class="feed-tab">
      <button :class="{ on: feed === 'foryou' }" @click="feed = 'foryou'">{{ t('feed.foryou') }}</button>
      <button :class="{ on: feed === 'following' }" @click="feed = 'following'">{{ t('feed.following') }}</button>
    </div>
    <p v-if="feed === 'foryou'" class="meta" style="margin:-4px 0 10px">{{ regionName(prefs.contentRegion) }}</p>
    <div v-show="feed === 'foryou'" class="stack">
      <PostCard v-for="post in forYouPosts" :key="post.id" :post="post" />
    </div>
    <div v-show="feed === 'following'" class="stack">
      <PostCard v-for="post in app.following" :key="post.id" :post="post" />
    </div>
  </section>
</template>
