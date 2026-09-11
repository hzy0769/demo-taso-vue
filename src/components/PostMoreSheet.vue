<script setup lang="ts">
import { app, isFollowed, toggleFollowAuthor, notInterested, reportPost, dislikeAd, whyThisAd, muteAdAuthor, blockAdAuthor, reportAd } from '../store'
import { t } from '../i18n'
</script>

<template>
  <div class="sheet" :class="{ on: app.sheet === 'post-more' }" role="dialog" :aria-label="app.morePost?.ad ? t('postMore.ad.report') : t('postMore.report')">
    <div class="grip"></div>
    <template v-if="app.morePost">
      <!-- 广告帖:参考 X 的广告菜单 -->
      <template v-if="app.morePost.ad">
        <button class="menu-btn" @click="dislikeAd()">
          <svg class="ic"><use href="#i-meh"/></svg>
          <span>{{ t('postMore.ad.dislike') }}</span>
        </button>
        <button class="menu-btn" @click="whyThisAd()">
          <svg class="ic"><use href="#i-help"/></svg>
          <span>{{ t('postMore.ad.why') }}</span>
        </button>
        <button class="menu-btn" @click="toggleFollowAuthor(app.morePost.author)">
          <svg class="ic"><use :href="isFollowed(app.morePost.author) ? '#i-check' : '#i-user-plus'"/></svg>
          <span>{{ isFollowed(app.morePost.author) ? t('post.unfollow') : t('post.follow') }} {{ app.morePost.author }}</span>
        </button>
        <button class="menu-btn" @click="muteAdAuthor()">
          <svg class="ic"><use href="#i-mute"/></svg>
          <span>{{ t('postMore.ad.mute', { name: app.morePost.author }) }}</span>
        </button>
        <button class="menu-btn" @click="blockAdAuthor()">
          <svg class="ic"><use href="#i-block"/></svg>
          <span>{{ t('postMore.ad.block') }} {{ app.morePost.author }}</span>
        </button>
        <button class="menu-btn" @click="reportAd()">
          <svg class="ic"><use href="#i-flag"/></svg>
          <span>{{ t('postMore.ad.report') }}</span>
        </button>
      </template>
      <!-- 普通帖子 -->
      <template v-else>
        <button class="menu-btn" @click="notInterested()">
          <svg class="ic"><use href="#i-meh"/></svg>
          <span>{{ t('postMore.notInterested') }}</span>
        </button>
        <button class="menu-btn" @click="toggleFollowAuthor(app.morePost.author)">
          <svg class="ic"><use :href="isFollowed(app.morePost.author) ? '#i-check' : '#i-user-plus'"/></svg>
          <span>{{ isFollowed(app.morePost.author) ? t('post.unfollow') : t('post.follow') }} {{ app.morePost.author }}</span>
        </button>
        <button class="menu-btn" @click="reportPost()">
          <svg class="ic"><use href="#i-flag"/></svg>
          <span>{{ t('postMore.report') }}</span>
        </button>
      </template>
    </template>
  </div>
</template>
