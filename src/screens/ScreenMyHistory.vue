<script setup lang="ts">
import { computed } from 'vue'
import { app, openPostById, showDialog, clearHistory } from '../store'
import { MY_POSTS, type Post } from '../data'
import { t } from '../i18n'
import { relTime, chatDayLabel } from '../i18n/format'
import { postView } from '../i18n/content'
import PageHeader from '../components/PageHeader.vue'

/** 全部可打开的帖子池(信息流 + 我的帖文种子;收藏广告被移除等场景查不到即跳过) */
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

const findPost = (pid: number) => pool.value.find(p => p.id === pid)

const items = computed(() =>
  app.history.map(h => ({ ...h, post: findPost(h.pid) })).filter(h => h.post),
)

/** 按自然日分组(用户时区),组标题:今天 / 昨天 / 完整日期 */
const groups = computed(() => {
  const out: { label: string; items: typeof items.value }[] = []
  for (const it of items.value) {
    const label = chatDayLabel(it.at)
    const last = out[out.length - 1]
    if (last && last.label === label) last.items.push(it)
    else out.push({ label, items: [it] })
  }
  return out
})

/** 摘要:当前显示文本首行,超长截断 */
const excerpt = (p: Post) => {
  const line = postView(p).text.split('\n')[0]
  return line.length > 40 ? `${line.slice(0, 40)}…` : line
}

function askClear() {
  if (!items.value.length) return
  showDialog(t('myHistory.clearTitle'), t('myHistory.clearBody'), clearHistory, t('myHistory.clear'))
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'my-history' }" data-screen="my-history">
    <PageHeader :title="t('me.myHistory')">
      <template #right>
        <button class="bk" :aria-label="t('myHistory.clear')" :disabled="!items.length" @click="askClear"><svg class="ic"><use href="#i-trash"/></svg></button>
      </template>
    </PageHeader>
    <p class="meta" style="margin-top:6px">{{ t('myHistory.intro') }}</p>
    <template v-for="g in groups" :key="g.label">
      <p class="meta" style="margin-top:14px;margin-bottom:2px">{{ g.label }}</p>
      <div class="card" style="padding:4px 14px">
        <div
          v-for="h in g.items" :key="h.pid"
          class="conv" role="button" tabindex="0"
          @click="openPostById(h.pid)" @keydown.enter.prevent="openPostById(h.pid)"
        >
          <div class="img-wrap" style="width:56px;height:56px;flex:none">
            <img :src="h.post!.image" :width="h.post!.imgW" :height="h.post!.imgH" style="width:56px;height:56px;object-fit:cover" :alt="h.post!.author" />
          </div>
          <div class="t">
            <p style="font-size:14px;font-weight:500">{{ excerpt(h.post!) }}</p>
            <p class="prev">{{ h.post!.author }} · {{ relTime(h.at) }}</p>
          </div>
          <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
        </div>
      </div>
    </template>
    <div v-if="!items.length" class="card" style="margin-top:12px;text-align:center;padding:28px 14px">
      <b>{{ t('myHistory.empty') }}</b>
      <p class="meta" style="margin-top:6px">{{ t('myHistory.emptyHint') }}</p>
      <button class="btn btn-p" style="width:auto;margin-top:14px" @click="openPostById(1)">{{ t('myHistory.goBrowse') }}</button>
    </div>
    <p class="meta" style="margin-top:12px">{{ t('myHistory.note') }}</p>
  </section>
</template>
