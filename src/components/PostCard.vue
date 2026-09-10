<script setup lang="ts">
import { ref } from 'vue'
import { show, toast, openSheet, openPost } from '../store'
import type { Post } from '../data'
import PostText from './PostText.vue'

defineProps<{ post: Post }>()

const liked = ref(false)
const saved = ref(false)

function toggleLike() {
  liked.value = !liked.value
  toast(liked.value ? '已点赞' : '已取消点赞')
}
function toggleBookmark() {
  saved.value = !saved.value
  toast(saved.value ? '已收藏' : '已取消收藏')
}
</script>

<template>
  <article class="card">
    <div class="row-b">
      <div class="row">
        <span class="avatar">{{ post.avatar }}</span>
        <div>
          <div class="row" style="gap:5px">
            <b style="font-size:14px">{{ post.author }}</b>
            <span class="vfy"><svg class="ic sm f"><use href="#i-check"/></svg>{{ post.verify }}</span>
          </div>
          <span class="meta">{{ post.meta }}</span>
        </div>
      </div>
      <button class="bk" aria-label="更多" @click="toast('更多操作：不感兴趣 / 屏蔽 / 举报')"><svg class="ic"><use href="#i-more"/></svg></button>
    </div>
    <div @click="openPost(post)">
      <PostText :post="post" clamp />
      <div class="img-wrap" style="display:block;width:100%;margin-top:12px">
        <img :src="post.image" :width="post.imgW" :height="post.imgH" :alt="post.author" />
      </div>
    </div>
    <button v-if="post.merchant" class="row-b" style="width:100%;margin-top:12px;padding:10px 12px;border:1px solid var(--border);border-radius:12px;background:var(--surface);text-align:left" @click="show('merchant')">
      <div class="row">
        <span class="li-ic"><svg class="ic"><use href="#i-pin"/></svg></span>
        <div>
          <div style="font-weight:600;font-size:14px">{{ post.merchant.title }}</div>
          <div class="meta">{{ post.merchant.meta }}</div>
        </div>
      </div>
      <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
    </button>
    <div class="row-b" style="margin-top:12px">
      <button class="row" style="gap:6px;min-height:44px;color:var(--muted)" @click="toggleLike">
        <svg class="ic" :class="{ f: liked }" :style="liked ? 'color:var(--danger)' : ''"><use href="#i-heart"/></svg>
        <span class="num">{{ post.likeCount }}</span>
      </button>
      <button class="row" style="gap:6px;min-height:44px;color:var(--muted)" @click="openSheet('comments')">
        <svg class="ic"><use href="#i-comment"/></svg>
        <span class="num">{{ post.commentCount }}</span>
      </button>
      <button class="row" style="gap:6px;min-height:44px;color:var(--muted)" @click="toast('分享链接已复制')">
        <svg class="ic"><use href="#i-share"/></svg>
        <span v-if="post.shareCount" class="num">{{ post.shareCount }}</span>
      </button>
      <button class="row" style="gap:6px;min-height:44px;color:var(--muted)" @click="toggleBookmark">
        <svg class="ic" :class="{ f: saved }"><use href="#i-bookmark"/></svg>
      </button>
    </div>
  </article>
</template>
