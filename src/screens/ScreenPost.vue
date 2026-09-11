<script setup lang="ts">
import { computed, ref } from 'vue'
import { app, show, toast, openSheet, openPost } from '../store'
import { foryouSeed, followingPosts } from '../data'
import { t, prefs } from '../i18n'
import { fmtMoney, compact, fmtMoneyEstimate } from '../i18n/format'
import { postMeta } from '../i18n/content'
import PageHeader from '../components/PageHeader.vue'
import PostText from '../components/PostText.vue'

/** 详情页展示 openPost 设置的帖子,未知 id(刷新恢复等)回退热帖 */
const post = computed(() =>
  [...app.foryou, ...app.following].find(p => p.id === app.postId) ?? foryouSeed[0],
)

const following = ref(false)
const liked = ref(false)
const saved = ref(false)

const priceText = computed(() => (post.value.merchant ? t('money.perPerson', { price: fmtMoney(post.value.merchant.price) }) : ''))
const priceEst = computed(() => (post.value.merchant ? fmtMoneyEstimate(post.value.merchant.price, prefs.displayCurrency) : null))

function toggleFollow() {
  following.value = !following.value
  toast(t(following.value ? 'post.followedAuthor' : 'post.unfollowedAuthor', { name: post.value.author }))
}
function toggleLike() {
  liked.value = !liked.value
  toast(t(liked.value ? 'post.liked' : 'post.unliked'))
}
function toggleBookmark() {
  saved.value = !saved.value
  toast(t(saved.value ? 'post.saved' : 'post.unsaved'))
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'post' }" data-screen="post">
    <PageHeader :title="t('post.title')">
      <template #right>
        <button class="bk" :aria-label="t('a11y.share')" @click="toast(t('post.shareCopied'))"><svg class="ic"><use href="#i-share"/></svg></button>
      </template>
    </PageHeader>
    <div class="row-b">
      <div class="row">
        <span class="avatar">{{ post.avatar }}</span>
        <div>
          <div class="row" style="gap:5px">
            <b>{{ post.author }}</b>
            <span class="vfy"><svg class="ic sm f"><use href="#i-check"/></svg>{{ t(`verify.${post.verifyKey}`) }}</span>
          </div>
          <span class="meta">{{ postMeta(post) }}</span>
        </div>
      </div>
      <button
        class="btn" :class="following ? 'btn-o' : 'btn-p'"
        style="width:auto;min-height:40px;padding:7px 14px;font-size:13px"
        @click="toggleFollow"
      >{{ following ? t('post.following') : t('post.follow') }}</button>
    </div>
    <PostText :post="post" lg />
    <div class="img-wrap" style="margin-top:12px">
      <img :src="post.image" :width="post.imgW" :height="post.imgH" :alt="post.author" />
    </div>
    <button v-if="post.merchant" class="card row-b" style="width:100%;margin-top:12px;text-align:left" @click="show('merchant')">
      <div class="row">
        <span class="li-ic"><svg class="ic"><use href="#i-store"/></svg></span>
        <div>
          <div style="font-weight:600">{{ post.merchant.title }}</div>
          <div class="meta">{{ priceText }} · ★{{ post.merchant.rating }}<template v-if="priceEst"> · ≈{{ priceEst.text }}({{ priceEst.rateNote }})</template></div>
        </div>
      </div>
      <span class="badge soft">{{ t('post.partnerMerchant') }}</span>
    </button>
    <div class="row-b" style="margin-top:14px">
      <button class="row" style="gap:6px;min-height:44px" @click="toggleLike">
        <svg class="ic" :class="{ f: liked }" :style="liked ? 'color:var(--danger)' : ''"><use href="#i-heart"/></svg>
        <span class="num">{{ compact(post.likes) }}</span>
      </button>
      <button class="row" style="gap:6px;min-height:44px" @click="openSheet('comments')">
        <svg class="ic"><use href="#i-comment"/></svg>
        <span class="num">{{ compact(post.comments) }}</span>
      </button>
      <button class="row" style="gap:6px;min-height:44px" @click="toast(t('post.shareCopied'))">
        <svg class="ic"><use href="#i-share"/></svg>
        <span v-if="post.shares" class="num">{{ compact(post.shares) }}</span>
      </button>
      <button class="row" style="gap:6px;min-height:44px" @click="toggleBookmark">
        <svg class="ic" :class="{ f: saved }"><use href="#i-bookmark"/></svg>
      </button>
    </div>
    <hr style="border:0;border-top:1px solid var(--border);margin:16px 0" />
    <h3 style="font-size:15px;font-weight:600">{{ t('post.commentsCount', { count: post.comments }) }}</h3>
    <div class="card" style="margin-top:10px">
      <div class="row">
        <span class="avatar">A</span>
        <div style="flex:1">
          <b style="font-size:13px">@alex</b>
          <p style="font-size:14px;margin-top:2px">{{ t('comments.q1') }}</p>
          <div class="row" style="margin-top:6px;gap:14px">
            <span class="meta">{{ t('comments.a1') }}</span>
            <button class="tag" style="border:0;padding:0" @click="toast(t('comments.liked'))">{{ t('comments.likeCount', { n: 23 }) }}</button>
          </div>
        </div>
      </div>
    </div>
    <div class="card" style="margin-top:10px">
      <div class="row">
        <span class="avatar">M</span>
        <div style="flex:1">
          <b style="font-size:13px">@mia</b>
          <p style="font-size:14px;margin-top:2px">{{ t('comments.q2') }}</p>
          <div class="row" style="margin-top:6px;gap:14px"><span class="meta">{{ t('comments.a2') }}</span></div>
        </div>
      </div>
    </div>
    <button class="btn btn-o" style="margin-top:14px" @click="openSheet('comments')">{{ t('post.viewAllComments', { count: post.comments }) }}</button>
    <h3 style="font-size:15px;font-weight:600;margin-top:20px">{{ t('post.related') }}</h3>
    <div class="grid-2" style="margin-top:10px">
      <button class="tile img-wrap" @click="openPost(followingPosts[0])">
        <img src="/assets/taso-ramen.jpg" width="720" height="720" :alt="t('img.ramen')" />
        <span class="cap">{{ t('post.tileLateRamen') }} <span class="sub">★4.8</span></span>
      </button>
      <button class="tile img-wrap" @click="toast(t('post.related'))">
        <img src="/assets/taso-sushi.jpg" width="720" height="480" :alt="t('img.sushi')" />
        <span class="cap">鮨 Taso <span class="sub">★4.8</span></span>
      </button>
    </div>
  </section>
</template>
