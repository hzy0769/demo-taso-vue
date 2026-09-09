<script setup lang="ts">
import { app, show, toast } from '../store'
import PageHeader from '../components/PageHeader.vue'

const stats = [
  { n: '86', label: 'Posts' },
  { n: '42', label: 'Reviews' },
  { n: '1.2K', label: 'Likes' },
]
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'me' }" data-screen="me">
    <PageHeader title="我的" :back-btn="false">
      <template #right>
        <button class="bk" aria-label="设置" @click="show('settings')"><svg class="ic"><use href="#i-settings"/></svg></button>
      </template>
    </PageHeader>
    <div class="card" style="margin-top:8px">
      <button class="row" style="width:100%;text-align:left" @click="show('profile')">
        <span class="avatar lg">A</span>
        <div style="flex:1">
          <div class="row" style="gap:5px">
            <b style="font-size:17px">Alex</b>
            <span class="vfy"><svg class="ic sm f"><use href="#i-check"/></svg>Creator</span>
          </div>
          <p class="meta">Tokyo · 12.8K Followers</p>
        </div>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <div class="row" style="margin-top:14px;text-align:center">
        <div v-for="s in stats" :key="s.label" style="flex:1">
          <div class="num" style="font-weight:700">{{ s.n }}</div>
          <div class="meta">{{ s.label }}</div>
        </div>
      </div>
    </div>
    <div class="card" style="margin-top:14px;padding:4px 14px">
      <button class="li" @click="toast('我的帖子')">
        <span class="li-ic"><svg class="ic"><use href="#i-image"/></svg></span>
        <span class="li-title">我的帖子</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" @click="toast('我的收藏')">
        <span class="li-ic"><svg class="ic"><use href="#i-bookmark"/></svg></span>
        <span class="li-title">我的收藏</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" @click="toast('我的关注')">
        <span class="li-ic"><svg class="ic"><use href="#i-user"/></svg></span>
        <span class="li-title">我的关注</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" @click="toast('我的足迹')">
        <span class="li-ic"><svg class="ic"><use href="#i-pin"/></svg></span>
        <span class="li-title">我的足迹</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" @click="show('creator')">
        <span class="li-ic"><svg class="ic"><use href="#i-camera"/></svg></span>
        <span class="li-title">创作中心</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" @click="show('benefits')">
        <span class="li-ic"><svg class="ic"><use href="#i-card"/></svg></span>
        <span class="li-title">会员卡</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" @click="show('wallet')">
        <span class="li-ic"><svg class="ic"><use href="#i-wallet"/></svg></span>
        <span class="li-title">钱包</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" @click="show('reimburse')">
        <span class="li-ic"><svg class="ic"><use href="#i-receipt"/></svg></span>
        <span class="li-title">消费报销</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" @click="show('referral')">
        <span class="li-ic"><svg class="ic"><use href="#i-gift"/></svg></span>
        <span class="li-title">推广中心</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" @click="show('settings')">
        <span class="li-ic"><svg class="ic"><use href="#i-settings"/></svg></span>
        <span class="li-title">设置</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
    </div>
  </section>
</template>
