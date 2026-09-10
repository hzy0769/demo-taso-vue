<script setup lang="ts">
import { app, isFollowed, toggleFollowAuthor, notInterested, reportPost, dislikeAd, whyThisAd, muteAdAuthor, blockAdAuthor, reportAd } from '../store'
</script>

<template>
  <div class="sheet" :class="{ on: app.sheet === 'post-more' }" role="dialog" :aria-label="app.morePost?.ad ? '广告操作' : '帖子操作'">
    <div class="grip"></div>
    <template v-if="app.morePost">
      <!-- 广告帖：参考 X 的广告菜单 -->
      <template v-if="app.morePost.ad">
        <button class="menu-btn" @click="dislikeAd()">
          <svg class="ic"><use href="#i-meh"/></svg>
          <span>我不喜欢这个广告</span>
        </button>
        <button class="menu-btn" @click="whyThisAd()">
          <svg class="ic"><use href="#i-help"/></svg>
          <span>为什么我会看到这个广告?</span>
        </button>
        <button class="menu-btn" @click="toggleFollowAuthor(app.morePost.author)">
          <svg class="ic"><use :href="isFollowed(app.morePost.author) ? '#i-check' : '#i-user-plus'"/></svg>
          <span>{{ isFollowed(app.morePost.author) ? '取消关注' : '关注' }} {{ app.morePost.author }}</span>
        </button>
        <button class="menu-btn" @click="muteAdAuthor()">
          <svg class="ic"><use href="#i-mute"/></svg>
          <span>隐藏 {{ app.morePost.author }}</span>
        </button>
        <button class="menu-btn" @click="blockAdAuthor()">
          <svg class="ic"><use href="#i-block"/></svg>
          <span>屏蔽 {{ app.morePost.author }}</span>
        </button>
        <button class="menu-btn" @click="reportAd()">
          <svg class="ic"><use href="#i-flag"/></svg>
          <span>举报广告</span>
        </button>
      </template>
      <!-- 普通帖子 -->
      <template v-else>
        <button class="menu-btn" @click="notInterested()">
          <svg class="ic"><use href="#i-meh"/></svg>
          <span>对这条帖子不感兴趣</span>
        </button>
        <button class="menu-btn" @click="toggleFollowAuthor(app.morePost.author)">
          <svg class="ic"><use :href="isFollowed(app.morePost.author) ? '#i-check' : '#i-user-plus'"/></svg>
          <span>{{ isFollowed(app.morePost.author) ? '取消关注' : '关注' }} {{ app.morePost.author }}</span>
        </button>
        <button class="menu-btn" @click="reportPost()">
          <svg class="ic"><use href="#i-flag"/></svg>
          <span>举报帖子</span>
        </button>
      </template>
    </template>
  </div>
</template>
