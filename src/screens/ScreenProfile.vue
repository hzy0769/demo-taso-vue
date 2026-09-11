<script setup lang="ts">
import { computed, ref } from 'vue'
import { app, toast } from '../store'
import { t, regionName } from '../i18n'
import { compact } from '../i18n/format'
import PageHeader from '../components/PageHeader.vue'

const following = ref(false)
const seg = ref<'posts' | 'reviews' | 'media'>('posts')

const segs = computed(() => ([
  { k: 'posts', label: t('profile.segPosts') },
  { k: 'reviews', label: t('profile.segReviews') },
  { k: 'media', label: t('profile.segMedia') },
] as const))

const statsLine = computed(() => t('profile.followersLine', { followers: compact(12800), following: compact(1243) }))

function toggleFollow() {
  following.value = !following.value
  toast(t(following.value ? 'post.followedAuthor' : 'post.unfollowedAuthor', { name: '@alex' }))
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'profile' }" data-screen="profile">
    <PageHeader :title="t('profile.title')">
      <template #right>
        <button class="bk" :aria-label="t('a11y.more')" @click="toast(t('profile.moreToast'))"><svg class="ic"><use href="#i-more"/></svg></button>
      </template>
    </PageHeader>
    <div style="text-align:center;margin-top:8px">
      <span class="avatar lg" style="margin:0 auto">A</span>
      <div class="row" style="justify-content:center;gap:6px;margin-top:10px">
        <b style="font-size:18px">Alex · {{ regionName({ country: '', cityId: 'tokyo' }) }}</b>
        <span class="vfy"><svg class="ic sm f"><use href="#i-check"/></svg>{{ t('verify.creator') }}</span>
      </div>
      <p class="meta" style="margin-top:4px">{{ statsLine }}</p>
    </div>
    <div class="row" style="justify-content:center;gap:10px;margin-top:14px">
      <button class="btn" :class="following ? 'btn-o' : 'btn-p'" style="width:auto" @click="toggleFollow">{{ following ? t('post.following') : t('post.follow') }}</button>
      <button class="btn btn-o" style="width:auto" @click="toast(t('post.shareCopied'))">{{ t('profile.shareProfile') }}</button>
    </div>
    <div class="seg" style="margin-top:16px">
      <button v-for="s in segs" :key="s.k" :class="{ on: seg === s.k }" @click="seg = s.k">{{ s.label }}</button>
    </div>
    <div class="masonry" style="margin-top:12px">
      <div class="img-wrap"><img src="/assets/taso-ramen.jpg" width="720" height="720" :alt="t('img.ramen')" /></div>
      <div class="img-wrap"><img src="/assets/taso-coffee.jpg" width="720" height="480" :alt="t('img.coffee')" /></div>
      <div class="img-wrap"><img src="/assets/taso-sushi.jpg" width="720" height="480" :alt="t('img.sushi')" /></div>
      <div class="img-wrap"><img src="/assets/taso-onsen.jpg" width="720" height="480" :alt="t('img.onsen')" /></div>
    </div>
  </section>
</template>
