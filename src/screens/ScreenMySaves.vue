<script setup lang="ts">
import { computed } from 'vue'
import { app, show } from '../store'
import { MY_POSTS, type Post } from '../data'
import { t } from '../i18n'
import PageHeader from '../components/PageHeader.vue'
import PostCard from '../components/PostCard.vue'

/** 全部可打开的帖子池(信息流 + 我的帖文种子) */
const pool = computed<Post[]>(() => {
  const seen = new Set<number>()
  const list: Post[] = []
  for (const p of [...app.foryou, ...app.following, ...MY_POSTS]) {
    if (!seen.has(p.id)) {
      seen.add(p.id)
      list.push(p)
    }
  }
  return list
})

/** 收藏列表按收藏顺序(app.saved 头部为最新) */
const savedPosts = computed<Post[]>(() =>
  app.saved.map(id => pool.value.find(p => p.id === id)).filter((p): p is Post => !!p),
)
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'my-saves' }" data-screen="my-saves">
    <PageHeader :title="t('me.mySaves')" />
    <p class="meta" style="margin-top:6px">{{ t('mySaves.intro') }}</p>
    <div v-if="savedPosts.length" class="stack" style="margin-top:12px">
      <PostCard v-for="p in savedPosts" :key="p.id" :post="p" />
    </div>
    <div v-else class="card" style="margin-top:12px;text-align:center;padding:28px 14px">
      <b>{{ t('mySaves.empty') }}</b>
      <p class="meta" style="margin-top:6px">{{ t('mySaves.emptyHint') }}</p>
      <button class="btn btn-p" style="width:auto;margin-top:14px" @click="show('home')">{{ t('mySaves.goHome') }}</button>
    </div>
  </section>
</template>
