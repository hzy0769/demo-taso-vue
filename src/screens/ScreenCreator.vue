<script setup lang="ts">
import { app, toast, openPostById } from '../store'
import PageHeader from '../components/PageHeader.vue'

const contents = [
  { img: '/assets/taso-ramen.jpg', title: '东京深夜拉面攻略', stat: '124K views · US$120', pid: 4 },
  { img: '/assets/taso-yakiniku.jpg', title: 'Shibuya 烧肉探店', stat: '62K views · US$80', pid: 1 },
  { img: '/assets/taso-coffee.jpg', title: '香港咖啡地图', stat: '18K views · US$23', pid: 2 },
]
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'creator' }" data-screen="creator">
    <PageHeader title="创作中心" />
    <div class="row" style="gap:8px;margin-top:8px">
      <div class="card" style="flex:1;padding:12px"><div class="num gold" style="font-weight:700">620</div><div class="meta">本月收益 US$</div></div>
      <div class="card" style="flex:1;padding:12px"><div class="num warn" style="font-weight:700">180</div><div class="meta">待结算</div></div>
      <div class="card" style="flex:1;padding:12px"><div class="num ok" style="font-weight:700">440</div><div class="meta">已结算</div></div>
    </div>
    <h3 style="font-size:15px;font-weight:600;margin:18px 0 10px">内容表现</h3>
    <div class="card" style="padding:4px 14px">
      <button v-for="c in contents" :key="c.title" class="li" style="border:0" @click="openPostById(c.pid)">
        <img :src="c.img" width="44" height="44" alt="" style="border-radius:10px;width:44px;height:44px;object-fit:cover" />
        <span class="li-title">{{ c.title }}</span>
        <span class="li-val num">{{ c.stat }}</span>
      </button>
    </div>
    <p class="meta" style="margin-top:12px">创作收益按有效曝光、完成率、收藏、评论质量与原创性综合计算，非“曝光=固定现金”。</p>
    <button class="btn btn-o" style="margin-top:16px" @click="toast('收益规则 V1.2 已加载')">收益规则</button>
  </section>
</template>
