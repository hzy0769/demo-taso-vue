<script setup lang="ts">
import { ref } from 'vue'
import { app, show } from '../store'
import PostCard from '../components/PostCard.vue'

const feed = ref<'foryou' | 'following'>('foryou')
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'home' }" data-screen="home">
    <header class="hd">
      <div style="font-family:var(--font-mono);font-weight:700;letter-spacing:.18em;font-size:18px">TASO</div>
      <div style="flex:1"></div>
      <button class="bk" aria-label="搜索" @click="show('search')"><svg class="ic"><use href="#i-search"/></svg></button>
      <button class="bk" aria-label="通知" @click="show('notifications')"><svg class="ic"><use href="#i-bell"/></svg></button>
    </header>
    <div class="feed-tab">
      <button :class="{ on: feed === 'foryou' }" @click="feed = 'foryou'">For You</button>
      <button :class="{ on: feed === 'following' }" @click="feed = 'following'">Following</button>
    </div>
    <div v-show="feed === 'foryou'" class="stack">
      <PostCard v-for="post in app.foryou" :key="post.id" :post="post" />
    </div>
    <div v-show="feed === 'following'" class="stack">
      <PostCard v-for="post in app.following" :key="post.id" :post="post" />
    </div>
  </section>
</template>
