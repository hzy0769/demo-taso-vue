<script setup lang="ts">
import { computed, ref } from 'vue'
import { app, closeSheets, toast } from '../store'
import { t } from '../i18n'

const order = ref<'hot' | 'latest' | 'author'>('hot')
const draft = ref('')

/** 演示种子评论(§8.2:评论保持原文,不假装翻译) */
const orders = computed(() => ([
  { k: 'hot', label: t('comments.hot') },
  { k: 'latest', label: t('comments.latest') },
  { k: 'author', label: t('comments.authorReplies') },
] as const))
</script>

<template>
  <div class="sheet" :class="{ on: app.sheet === 'comments' }" role="dialog" :aria-label="t('comments.hot')">
    <div class="grip"></div>
    <div class="row-b">
      <b style="font-size:17px">{{ t('post.commentsCount', { count: 82 }) }}</b>
      <div class="seg" style="width:auto">
        <button v-for="o in orders" :key="o.k" :class="{ on: order === o.k }" @click="order = o.k">{{ o.label }}</button>
      </div>
    </div>
    <div class="stack" style="margin-top:14px">
      <div class="card">
        <div class="row">
          <span class="avatar">A</span>
          <div style="flex:1">
            <b style="font-size:13px">@alex</b>
            <p style="font-size:14px;margin-top:2px">{{ t('comments.q1') }}</p>
            <div class="row" style="margin-top:6px;gap:14px">
              <span class="meta">{{ t('comments.a1') }}</span>
              <button class="tag" style="border:0;padding:0" @click="toast(t('comments.liked'))">{{ t('comments.likeCount', { n: 23 }) }}</button>
              <button class="tag" style="border:0;padding:0" @click="toast(t('comments.replied', { name: '@alex' }))">{{ t('comments.reply') }}</button>
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="row">
          <span class="avatar">M</span>
          <div style="flex:1">
            <b style="font-size:13px">@mia</b>
            <p style="font-size:14px;margin-top:2px">{{ t('comments.q2') }}</p>
            <div class="row" style="margin-top:6px;gap:14px">
              <span class="meta">{{ t('comments.a2') }}</span>
              <button class="tag" style="border:0;padding:0" @click="toast(t('comments.liked'))">{{ t('comments.likeCount', { n: 12 }) }}</button>
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="row">
          <span class="avatar">S</span>
          <div style="flex:1">
            <b style="font-size:13px">@sora</b>
            <p style="font-size:14px;margin-top:2px">{{ t('comments.q3') }}</p>
            <div class="row" style="margin-top:6px;gap:14px"><span class="meta">{{ t('comments.a3') }}</span></div>
          </div>
        </div>
      </div>
    </div>
    <div class="row" style="margin-top:16px">
      <input v-model="draft" class="input" :placeholder="t('comments.placeholder')" style="flex:1" />
      <button class="btn btn-p" style="width:auto" @click="toast(t('comments.published')); closeSheets()">{{ t('common.send') }}</button>
    </div>
  </div>
</template>
