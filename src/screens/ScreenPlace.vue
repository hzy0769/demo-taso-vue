<script setup lang="ts">
import { app, show, toast, openPostById } from '../store'
import { t } from '../i18n'
import PageHeader from '../components/PageHeader.vue'
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'place' }" data-screen="place">
    <PageHeader :title="t('place.title')">
      <template #right>
        <button class="bk" :aria-label="t('a11y.share')" @click="toast(t('post.shareCopied'))"><svg class="ic"><use href="#i-share"/></svg></button>
      </template>
    </PageHeader>
    <div class="tile img-wrap">
      <img src="/assets/taso-tokyo.jpg" width="720" height="467" :alt="t('img.tokyo')" />
      <span class="cap">Shibuya <span class="sub">Tokyo · {{ t('discover.heat', { n: 98 }) }}</span></span>
    </div>
    <div class="chips" style="margin-top:12px">
      <button class="chip on">{{ t('place.tabAll') }}</button><button class="chip">{{ t('place.tabFood') }}</button><button class="chip">{{ t('place.tabShopping') }}</button><button class="chip">{{ t('place.tabNight') }}</button><button class="chip">{{ t('place.tabEvents') }}</button>
    </div>
    <h3 style="font-size:15px;font-weight:600;margin:18px 0 10px">{{ t('place.hotContent') }}</h3>
    <div class="grid-2">
      <button class="tile img-wrap" @click="openPostById(1)">
        <img src="/assets/taso-yakiniku.jpg" width="720" height="481" :alt="t('img.yakiniku')" /><span class="cap">{{ t('post.tileWagyu') }}</span>
      </button>
      <button class="tile img-wrap" @click="openPostById(4)">
        <img src="/assets/taso-ramen.jpg" width="720" height="720" :alt="t('img.ramen')" /><span class="cap">{{ t('post.tileLateRamen') }}</span>
      </button>
      <button class="tile img-wrap" @click="toast(t('post.related'))">
        <img src="/assets/taso-sushi.jpg" width="720" height="480" :alt="t('img.sushi')" /><span class="cap">鮨 Taso</span>
      </button>
      <button class="tile img-wrap" @click="openPostById(2)">
        <img src="/assets/taso-coffee.jpg" width="720" height="480" :alt="t('img.coffee')" /><span class="cap">{{ t('post.tilePourOver') }}</span>
      </button>
    </div>
    <h3 style="font-size:15px;font-weight:600;margin:18px 0 10px">{{ t('place.hotMerchants') }}</h3>
    <div class="stack">
      <button class="li" @click="show('merchant')">
        <span class="li-ic"><svg class="ic"><use href="#i-store"/></svg></span>
        <span class="li-title">焼肉Taso</span><span class="li-sub">★4.7 · {{ t('merchant.off95') }}</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" @click="show('merchant')">
        <span class="li-ic"><svg class="ic"><use href="#i-store"/></svg></span>
        <span class="li-title">鮨 Taso</span><span class="li-sub">★4.8 · {{ t('merchant.memberDrink') }}</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
    </div>
  </section>
</template>
