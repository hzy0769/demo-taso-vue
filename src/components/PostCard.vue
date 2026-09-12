<script setup lang="ts">
import { computed, ref } from 'vue'
import { show, showDialog, toast, openSheet, openPost, openPostMore } from '../store'
import { t, prefs } from '../i18n'
import { fmtMoney, fmtMoneyEstimate, compact } from '../i18n/format'
import { postMeta } from '../i18n/content'
import type { Post } from '../data'
import PostText from './PostText.vue'

const props = defineProps<{ post: Post }>()

const liked = ref(false)
const saved = ref(false)

/** 已核销消费:可点开说明页(评审 §5.3:解释验证含义,不只放标记) */
function explainVerified() {
  showDialog(t('verify.vpTitle'), t('verify.vpBody'), undefined, t('common.gotIt'))
}

/** 商家价格:原币种始终可见;展示货币不同且可换算时附估算辅信息(§9.1) */
const priceText = computed(() => (props.post.merchant ? t('money.perPerson', { price: fmtMoney(props.post.merchant.price) }) : ''))
const priceEst = computed(() => {
  const m = props.post.merchant
  return m ? fmtMoneyEstimate(m.price, prefs.displayCurrency) : null
})

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
  <article class="card">
    <div class="row-b">
      <div class="row">
        <span class="avatar">{{ post.avatar }}</span>
        <div>
          <div class="row" style="gap:5px">
            <b style="font-size:14px">{{ post.author }}</b>
            <button
              v-if="post.verifyKey === 'verifiedPurchase'"
              class="vfy" style="border:0;background:none;padding:0"
              :aria-label="t('verify.vpTitle')" @click.stop="explainVerified"
            ><svg class="ic sm f"><use href="#i-check"/></svg>{{ t(`verify.${post.verifyKey}`) }}</button>
            <span v-else class="vfy"><svg class="ic sm f"><use href="#i-check"/></svg>{{ t(`verify.${post.verifyKey}`) }}</span>
          </div>
          <span class="meta">{{ postMeta(post) }}</span>
        </div>
      </div>
      <div class="row" style="gap:4px">
        <span v-if="post.ad" class="ad-tag">{{ t('post.adTag') }}</span>
        <button class="bk" :aria-label="t('a11y.more')" @click.stop="openPostMore(post)"><svg class="ic"><use href="#i-more"/></svg></button>
      </div>
    </div>
    <div @click="openPost(post)">
      <PostText :post="post" clamp />
      <div class="img-wrap" style="display:block;width:100%;margin-top:12px">
        <img :src="post.image" :width="post.imgW" :height="post.imgH" :alt="post.author" />
      </div>
      <div v-if="post.ad" class="ad-from">{{ t('post.adFrom', { domain: post.ad }) }}</div>
    </div>
    <button v-if="post.merchant" class="row-b" style="width:100%;margin-top:12px;padding:10px 12px;border:1px solid var(--border);border-radius:12px;background:var(--surface);text-align:left" @click="show('merchant')">
      <div class="row">
        <span class="li-ic"><svg class="ic"><use href="#i-pin"/></svg></span>
        <div>
          <div style="font-weight:600;font-size:14px">{{ post.merchant.title }}</div>
          <div class="meta">{{ priceText }} · ★{{ post.merchant.rating }}<template v-if="priceEst"> · ≈{{ priceEst.text }}({{ priceEst.rateNote }})</template></div>
        </div>
      </div>
      <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
    </button>
    <div class="row-b" style="margin-top:12px">
      <button class="row" style="gap:6px;min-height:44px;color:var(--muted)" @click="toggleLike">
        <svg class="ic" :class="{ f: liked }" :style="liked ? 'color:var(--danger)' : ''"><use href="#i-heart"/></svg>
        <span class="num">{{ compact(post.likes) }}</span>
      </button>
      <button class="row" style="gap:6px;min-height:44px;color:var(--muted)" @click="openSheet('comments')">
        <svg class="ic"><use href="#i-comment"/></svg>
        <span class="num">{{ compact(post.comments) }}</span>
      </button>
      <button class="row" style="gap:6px;min-height:44px;color:var(--muted)" @click="toast(t('post.shareCopied'))">
        <svg class="ic"><use href="#i-share"/></svg>
        <span v-if="post.shares" class="num">{{ compact(post.shares) }}</span>
      </button>
      <button class="row" style="gap:6px;min-height:44px;color:var(--muted)" @click="toggleBookmark">
        <svg class="ic" :class="{ f: saved }"><use href="#i-bookmark"/></svg>
      </button>
    </div>
  </article>
</template>
