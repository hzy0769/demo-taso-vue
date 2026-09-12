<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { app, isFollowed, toggleFollowAuthor, notInterested, reportPost, dislikeAd, whyThisAd, muteAdAuthor, blockAdAuthor, reportAd, overlayFocusIn, overlayFocusOut } from '../store'
import { t } from '../i18n'

const open = computed(() => app.sheet === 'post-more')
/** 弹层无障碍(评审 §6.4):关闭态 inert;打开焦点进入,关闭焦点复位 */
const root = ref<HTMLElement | null>(null)
watch(open, v => {
  if (v) overlayFocusIn(root.value)
  else overlayFocusOut(root.value)
})
</script>

<template>
  <div
    ref="root"
    class="sheet" :class="{ on: open }"
    :inert="!open" tabindex="-1"
    role="dialog" aria-modal="true" :aria-label="app.morePost?.ad ? t('postMore.ad.report') : t('postMore.report')"
  >
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
