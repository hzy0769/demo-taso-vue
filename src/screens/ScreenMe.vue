<script setup lang="ts">
import { computed } from 'vue'
import { app, show, showRoleStatus, roleLabel } from '../store'
import { DIVIDEND_TOTAL } from '../data'
import { t, regionName } from '../i18n'
import { fmtMoney, compact } from '../i18n/format'
import PageHeader from '../components/PageHeader.vue'

const stats = computed(() => ([
  { n: '86', label: t('me.statPosts') },
  { n: '42', label: t('me.statReviews') },
  { n: compact(1200), label: t('me.statLikes') },
]))

const msgUnread = computed(() => app.social.convs.reduce((n, c) => n + c.unread, 0))
/** 登录账号昵称联动(AUTH PRD:完成认证后账号信息进入「我的」) */
const name = computed(() => app.auth.user?.nickname ?? 'Alex')
const initial = computed(() => name.value.trim().slice(0, 1).toUpperCase() || 'A')
/** 账号级别:由后台审核开通,前台不可切换(评审 §3.5);点击仅查看审核状态示例 */
const isHolder = computed(() => app.auth.user?.role === 'shareholder')
const followersLine = computed(() => t('me.followersLine', { city: regionName({ country: '', cityId: 'tokyo' }), count: compact(12800) }))
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'me' }" data-screen="me">
    <PageHeader :title="t('me.title')" :back-btn="false">
      <template #right>
        <button class="bk" :aria-label="t('a11y.myQrcode')" @click="show('my-qrcode')"><svg class="ic"><use href="#i-qrcode"/></svg></button>
        <button class="bk" :aria-label="t('a11y.settings')" @click="show('settings')"><svg class="ic"><use href="#i-settings"/></svg></button>
      </template>
    </PageHeader>
    <div class="card" style="margin-top:8px">
      <button class="row" style="width:100%;text-align:left" @click="show('profile')">
        <span class="avatar lg">{{ initial }}</span>
        <div style="flex:1">
          <div class="row" style="gap:5px">
            <b style="font-size:17px">{{ name }}</b>
            <span class="vfy"><svg class="ic sm f"><use href="#i-check"/></svg>{{ t('verify.creator') }}</span>
            <span
              class="role-tag" :class="isHolder ? 'holder' : 'member'"
              role="button" tabindex="0" :title="t('me.roleHint')"
              @click.stop="showRoleStatus" @keydown.enter.stop.prevent="showRoleStatus"
            ><svg v-if="isHolder" class="ic sm f"><use href="#i-star"/></svg>{{ roleLabel(isHolder ? 'shareholder' : 'member') }}</span>
          </div>
          <p class="meta">{{ followersLine }}</p>
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
      <button class="li" @click="show('my-posts')">
        <span class="li-ic"><svg class="ic"><use href="#i-image"/></svg></span>
        <span class="li-title">{{ t('me.myPosts') }}</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" @click="show('my-saves')">
        <span class="li-ic"><svg class="ic"><use href="#i-bookmark"/></svg></span>
        <span class="li-title">{{ t('me.mySaves') }}</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" @click="show('my-follows')">
        <span class="li-ic"><svg class="ic"><use href="#i-user"/></svg></span>
        <span class="li-title">{{ t('me.myFollows') }}</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" @click="show('my-history')">
        <span class="li-ic"><svg class="ic"><use href="#i-pin"/></svg></span>
        <span class="li-title">{{ t('me.myHistory') }}</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" @click="show('friends')">
        <span class="li-ic"><svg class="ic"><use href="#i-users"/></svg></span>
        <span class="li-title">{{ t('me.friends') }}</span>
        <span v-if="app.social.reqIn.length" class="li-val" style="color:var(--accent)">{{ t('me.newReqs', { n: app.social.reqIn.length }) }}</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" @click="show('messages')">
        <span class="li-ic"><svg class="ic"><use href="#i-chat"/></svg></span>
        <span class="li-title">{{ t('me.messages') }}</span>
        <span v-if="msgUnread" class="li-val" style="color:var(--danger)">{{ t('me.unread', { n: msgUnread }) }}</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" @click="show('creator')">
        <span class="li-ic"><svg class="ic"><use href="#i-camera"/></svg></span>
        <span class="li-title">{{ t('me.creator') }}</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" @click="show('my-card')">
        <span class="li-ic"><svg class="ic"><use href="#i-card"/></svg></span>
        <span class="li-title">{{ t('me.myCard') }}</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" @click="show('wallet')">
        <span class="li-ic"><svg class="ic"><use href="#i-wallet"/></svg></span>
        <span class="li-title">{{ t('me.wallet') }}</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <!-- 股东分红:会员亦可见示例数据(原型边界说明);真实上线按能力矩阵仅对审核通过的股东开放 -->
      <button class="li" @click="show('dividend')">
        <span class="li-ic"><svg class="ic" style="color:var(--accent-ink)"><use href="#i-star"/></svg></span>
        <span class="li-title">{{ t('me.dividend') }}</span>
        <span v-if="!isHolder" class="badge warn">{{ t('demo.tag') }}</span>
        <span v-else class="li-val num gold">{{ fmtMoney({ amount: DIVIDEND_TOTAL, currency: 'USD' }) }}</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" @click="show('reimburse')">
        <span class="li-ic"><svg class="ic"><use href="#i-receipt"/></svg></span>
        <span class="li-title">{{ t('me.reimburse') }}</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" @click="show('referral')">
        <span class="li-ic"><svg class="ic"><use href="#i-gift"/></svg></span>
        <span class="li-title">{{ t('me.referral') }}</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" @click="show('settings')">
        <span class="li-ic"><svg class="ic"><use href="#i-settings"/></svg></span>
        <span class="li-title">{{ t('me.settings') }}</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
    </div>
  </section>
</template>
