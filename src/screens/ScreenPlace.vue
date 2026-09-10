<script setup lang="ts">
import { app, show, toast, openPostById } from '../store'
import PageHeader from '../components/PageHeader.vue'
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'place' }" data-screen="place">
    <PageHeader title="地点详情">
      <template #right>
        <button class="bk" aria-label="分享" @click="toast('分享链接已复制')"><svg class="ic"><use href="#i-share"/></svg></button>
      </template>
    </PageHeader>
    <div class="tile img-wrap">
      <img src="/assets/taso-tokyo.jpg" width="720" height="467" alt="Shibuya 涩谷" />
      <span class="cap">Shibuya <span class="sub">Tokyo · 热度 98</span></span>
    </div>
    <div class="chips" style="margin-top:12px">
      <button class="chip on">全部</button><button class="chip">美食</button><button class="chip">购物</button><button class="chip">夜景</button><button class="chip">活动</button>
    </div>
    <h3 style="font-size:15px;font-weight:600;margin:18px 0 10px">热门内容</h3>
    <div class="grid-2">
      <button class="tile img-wrap" @click="openPostById(1)">
        <img src="/assets/taso-yakiniku.jpg" width="720" height="481" alt="烧肉" /><span class="cap">和牛烧肉</span>
      </button>
      <button class="tile img-wrap" @click="openPostById(4)">
        <img src="/assets/taso-ramen.jpg" width="720" height="720" alt="拉面" /><span class="cap">深夜拉面</span>
      </button>
      <button class="tile img-wrap" @click="toast('相关帖子（演示）')">
        <img src="/assets/taso-sushi.jpg" width="720" height="480" alt="寿司" /><span class="cap">鮨 Taso</span>
      </button>
      <button class="tile img-wrap" @click="openPostById(2)">
        <img src="/assets/taso-coffee.jpg" width="720" height="480" alt="咖啡" /><span class="cap">手冲咖啡</span>
      </button>
    </div>
    <h3 style="font-size:15px;font-weight:600;margin:18px 0 10px">热门商家</h3>
    <div class="stack">
      <button class="li" @click="show('merchant')">
        <span class="li-ic"><svg class="ic"><use href="#i-store"/></svg></span>
        <span class="li-title">焼肉Taso</span><span class="li-sub">★4.7 · 95折</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" @click="show('merchant')">
        <span class="li-ic"><svg class="ic"><use href="#i-store"/></svg></span>
        <span class="li-title">鮨 Taso</span><span class="li-sub">★4.8 · 会员饮品</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
    </div>
  </section>
</template>
