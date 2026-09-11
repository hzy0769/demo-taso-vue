<script setup lang="ts">
import { computed } from 'vue'
import { app, show, toast, toggleRole, fmt } from '../store'
import { DIVIDEND_TOTAL } from '../data'
import PageHeader from '../components/PageHeader.vue'

const stats = [
  { n: '86', label: 'Posts' },
  { n: '42', label: 'Reviews' },
  { n: '1.2K', label: 'Likes' },
]

const msgUnread = computed(() => app.social.convs.reduce((n, c) => n + c.unread, 0))
/** 登录账号昵称联动（AUTH PRD：完成认证后账号信息进入「我的」） */
const name = computed(() => app.auth.user?.nickname ?? 'Alex')
const initial = computed(() => name.value.trim().slice(0, 1).toUpperCase() || 'A')
/** 账号级别:股东时展示金色标记与「股东分红」入口（V1.6） */
const isHolder = computed(() => app.auth.user?.role === 'shareholder')
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'me' }" data-screen="me">
    <PageHeader title="我的" :back-btn="false">
      <template #right>
        <button class="bk" aria-label="我的二维码" @click="show('my-qrcode')"><svg class="ic"><use href="#i-qrcode"/></svg></button>
        <button class="bk" aria-label="设置" @click="show('settings')"><svg class="ic"><use href="#i-settings"/></svg></button>
      </template>
    </PageHeader>
    <div class="card" style="margin-top:8px">
      <button class="row" style="width:100%;text-align:left" @click="show('profile')">
        <span class="avatar lg">{{ initial }}</span>
        <div style="flex:1">
          <div class="row" style="gap:5px">
            <b style="font-size:17px">{{ name }}</b>
            <span class="vfy"><svg class="ic sm f"><use href="#i-check"/></svg>Creator</span>
            <span
              class="role-tag" :class="isHolder ? 'holder' : 'member'"
              role="button" tabindex="0" title="点击切换账号级别(演示)"
              @click.stop="toggleRole" @keydown.enter.stop.prevent="toggleRole"
            ><svg v-if="isHolder" class="ic sm f"><use href="#i-star"/></svg>{{ isHolder ? '股东' : '会员' }}</span>
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
      <button class="li" @click="show('friends')">
        <span class="li-ic"><svg class="ic"><use href="#i-users"/></svg></span>
        <span class="li-title">好友</span>
        <span v-if="app.social.reqIn.length" class="li-val" style="color:var(--accent)">{{ app.social.reqIn.length }} 条新申请</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" @click="show('messages')">
        <span class="li-ic"><svg class="ic"><use href="#i-chat"/></svg></span>
        <span class="li-title">消息</span>
        <span v-if="msgUnread" class="li-val" style="color:var(--danger)">{{ msgUnread }} 条未读</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" @click="show('creator')">
        <span class="li-ic"><svg class="ic"><use href="#i-camera"/></svg></span>
        <span class="li-title">创作中心</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" @click="show('my-card')">
        <span class="li-ic"><svg class="ic"><use href="#i-card"/></svg></span>
        <span class="li-title">我的会员卡</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" @click="show('wallet')">
        <span class="li-ic"><svg class="ic"><use href="#i-wallet"/></svg></span>
        <span class="li-title">钱包</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button v-if="isHolder" class="li" @click="show('dividend')">
        <span class="li-ic"><svg class="ic" style="color:var(--accent)"><use href="#i-star"/></svg></span>
        <span class="li-title">股东分红</span>
        <span class="li-val gold num">US${{ fmt(DIVIDEND_TOTAL) }}</span>
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
