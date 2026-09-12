<script setup lang="ts">
import { computed, ref } from 'vue'
import { app, openPost, openSheet } from '../store'
import { MY_POSTS, MY_HANDLE, type Post } from '../data'
import { t } from '../i18n'
import { compact } from '../i18n/format'
import { postView, postMeta } from '../i18n/content'
import PageHeader from '../components/PageHeader.vue'

const seg = ref<'all' | 'published' | 'reviewing'>('all')

const segs = computed(() => ([
  { k: 'all', label: t('myPosts.tabAll') },
  { k: 'published', label: t('myPosts.tabPublished') },
  { k: 'reviewing', label: t('myPosts.tabReviewing') },
] as const))

/** 我的帖文:种子 + 两条信息流中以演示身份发布(含刚发布的)的帖子,按时间倒序 */
const mine = computed<Post[]>(() => {
  const seen = new Set<number>()
  const list: Post[] = []
  for (const p of [...app.foryou, ...app.following, ...MY_POSTS]) {
    if (p.author === MY_HANDLE && !seen.has(p.id)) {
      seen.add(p.id)
      list.push(p)
    }
  }
  return list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
})

const filtered = computed(() =>
  mine.value.filter(p => (seg.value === 'all' ? true : (p.status ?? 'published') === seg.value)),
)

/** 摘要:当前显示文本首行,超长截断 */
const excerpt = (p: Post) => {
  const line = postView(p).text.split('\n')[0]
  return line.length > 52 ? `${line.slice(0, 52)}…` : line
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'my-posts' }" data-screen="my-posts">
    <PageHeader :title="t('me.myPosts')">
      <template #right>
        <button class="bk" :aria-label="t('myPosts.a11yCompose')" @click="openSheet('composer')"><svg class="ic"><use href="#i-plus"/></svg></button>
      </template>
    </PageHeader>
    <div class="seg" style="margin-top:8px">
      <button v-for="s in segs" :key="s.k" :class="{ on: seg === s.k }" @click="seg = s.k">{{ s.label }}</button>
    </div>
    <div class="stack" style="margin-top:12px">
      <button v-for="p in filtered" :key="p.id" class="card" style="text-align:left;width:100%" @click="openPost(p)">
        <div class="row" style="align-items:flex-start">
          <div class="img-wrap" style="width:72px;height:72px;flex:none">
            <img :src="p.image" :width="p.imgW" :height="p.imgH" style="width:72px;height:72px;object-fit:cover" :alt="p.author" />
          </div>
          <div style="flex:1;min-width:0">
            <p style="font-size:14px;line-height:1.45">{{ excerpt(p) }}</p>
            <p class="meta" style="margin-top:4px">{{ postMeta(p) }}</p>
            <div class="row" style="gap:10px;margin-top:6px">
              <span v-if="p.status === 'reviewing'" class="badge warn">{{ t('myPosts.reviewing') }}</span>
              <span v-else class="badge ok">{{ t('myPosts.published') }}</span>
              <span v-if="p.status !== 'reviewing'" class="row meta" style="gap:4px">
                <svg class="ic sm"><use href="#i-heart"/></svg>{{ compact(p.likes) }}
                <svg class="ic sm" style="margin-left:6px"><use href="#i-comment"/></svg>{{ compact(p.comments) }}
              </span>
            </div>
          </div>
        </div>
      </button>
      <div v-if="!filtered.length" class="card" style="text-align:center;padding:28px 14px">
        <b>{{ t('myPosts.empty') }}</b>
        <p class="meta" style="margin-top:6px">{{ t('myPosts.emptyHint') }}</p>
        <button class="btn btn-p" style="width:auto;margin-top:14px" @click="openSheet('composer')">{{ t('myPosts.compose') }}</button>
      </div>
    </div>
    <p class="meta" style="margin-top:12px">{{ t('myPosts.note') }}</p>
  </section>
</template>
