<script setup lang="ts">
import { app, show } from '../store'
import PageHeader from '../components/PageHeader.vue'
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'discover' }" data-screen="discover">
    <PageHeader title="发现" :back-btn="false">
      <template #right>
        <button class="bk" aria-label="通知" @click="show('notifications')"><svg class="ic"><use href="#i-bell"/></svg></button>
      </template>
    </PageHeader>
    <button class="row input" style="width:100%;text-align:left;color:var(--muted)" @click="show('search')">
      <svg class="ic"><use href="#i-search"/></svg>搜索用户、商家、地点、话题…
    </button>
    <div class="chips" style="margin-top:12px">
      <button class="chip on">附近</button><button class="chip">城市</button><button class="chip">美食</button><button class="chip">旅行</button><button class="chip">热门</button><button class="chip">商家优惠</button>
    </div>
    <h3 style="font-size:15px;font-weight:600;margin:18px 0 10px">热门城市</h3>
    <div class="grid-2">
      <button class="tile img-wrap" @click="show('place')">
        <img src="/assets/taso-tokyo.jpg" width="720" height="467" alt="东京" />
        <span class="cap">Tokyo <span class="sub">热度 98</span></span>
      </button>
      <button class="tile img-wrap" @click="show('place')">
        <img src="/assets/taso-hongkong.jpg" width="720" height="450" alt="香港" />
        <span class="cap">Hong Kong <span class="sub">热度 92</span></span>
      </button>
      <button class="tile img-wrap" @click="show('place')">
        <img src="/assets/taso-bangkok.jpg" width="720" height="557" alt="曼谷" />
        <span class="cap">Bangkok <span class="sub">热度 91</span></span>
      </button>
      <button class="tile img-wrap" @click="show('place')">
        <img src="/assets/taso-seoul.jpg" width="720" height="1117" alt="首尔" />
        <span class="cap">Seoul <span class="sub">热度 89</span></span>
      </button>
    </div>
    <h3 style="font-size:15px;font-weight:600;margin:18px 0 10px">今日热门</h3>
    <div class="stack">
      <button class="li" @click="show('merchant')">
        <span class="li-ic"><svg class="ic"><use href="#i-store"/></svg></span>
        <span class="li-title">焼肉Taso</span><span class="li-sub">Shibuya · ★4.7</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" @click="show('merchant')">
        <span class="li-ic"><svg class="ic"><use href="#i-store"/></svg></span>
        <span class="li-title">鮨 Taso</span><span class="li-sub">Tokyo · ★4.8</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" @click="show('merchant')">
        <span class="li-ic"><svg class="ic"><use href="#i-store"/></svg></span>
        <span class="li-title">Taso Coffee</span><span class="li-sub">Hong Kong · ★4.6</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
    </div>
    <h3 style="font-size:15px;font-weight:600;margin:18px 0 10px">大家都在搜</h3>
    <div class="chips">
      <button class="chip">拉面</button><button class="chip">烧肉</button><button class="chip">酒店</button><button class="chip">温泉</button><button class="chip">咖啡</button>
    </div>
  </section>
</template>
