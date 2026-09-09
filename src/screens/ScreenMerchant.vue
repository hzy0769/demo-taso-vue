<script setup lang="ts">
import { ref } from 'vue'
import { app, show, toast } from '../store'
import PageHeader from '../components/PageHeader.vue'

const saved = ref(false)
const seg = ref('Posts')

function toggleSave() {
  saved.value = !saved.value
  toast(saved.value ? '已收藏商家' : '已取消收藏')
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'merchant' }" data-screen="merchant">
    <PageHeader title="商家详情">
      <template #right>
        <button class="bk" aria-label="分享" @click="toast('分享链接已复制')"><svg class="ic"><use href="#i-share"/></svg></button>
      </template>
    </PageHeader>
    <div class="img-wrap"><img src="/assets/taso-yakiniku.jpg" width="720" height="481" alt="焼肉Taso 门店" /></div>
    <div style="margin-top:14px">
      <div class="row" style="gap:6px">
        <h2 style="font-size:21px;font-weight:700">焼肉Taso</h2><span class="badge soft">合作商家</span>
      </div>
      <div class="row" style="margin-top:6px">
        <span class="num" style="font-weight:600">★4.7</span><span class="meta">2,381 reviews</span>
      </div>
      <p class="row meta" style="margin-top:6px"><svg class="ic sm"><use href="#i-pin"/></svg>Tokyo · Shibuya 1-2-3</p>
    </div>
    <div class="row" style="margin-top:14px;gap:10px">
      <button class="btn btn-o" style="flex:1" @click="toast('已唤起地图导航（演示）')">导航</button>
      <button class="btn btn-o" style="flex:1" @click="toggleSave">收藏</button>
      <button class="btn btn-o" style="flex:1" @click="toast('分享链接已复制')">分享</button>
    </div>
    <div class="card" style="margin-top:14px;border-color:color-mix(in oklch,var(--accent) 55%,var(--border));background:color-mix(in oklch,var(--accent) 7%,var(--surface))">
      <div class="row-b">
        <span class="meta">Taso Card Benefit</span>
        <span class="vfy"><svg class="ic sm f"><use href="#i-card"/></svg>会员专享</span>
      </div>
      <div style="font-weight:700;font-size:16px;margin-top:6px">95 折 + 免费饮品 1 杯</div>
      <p class="meta" style="margin-top:4px">有效期至 2026-12-31 · 出示会员卡二维码核销</p>
    </div>
    <div class="row-b" style="margin-top:14px;font-size:14px"><span class="meta">今日营业</span><b>11:00 – 23:00</b></div>
    <div class="seg" style="margin-top:14px">
      <button v-for="s in ['Posts', 'Reviews', 'Offers']" :key="s" :class="{ on: seg === s }" @click="seg = s">{{ s }}</button>
    </div>
    <div class="stack" style="margin-top:12px">
      <button class="card" style="text-align:left;width:100%" @click="show('post')">
        <div class="row">
          <img src="/assets/taso-ramen.jpg" width="56" height="56" alt="" style="border-radius:12px;width:56px;height:56px;object-fit:cover" />
          <div><b style="font-size:14px">@alex</b><p style="font-size:13px;color:var(--muted);margin-top:2px">和牛入口即化，午市套餐超值。</p></div>
        </div>
      </button>
      <button class="card" style="text-align:left;width:100%" @click="show('post')">
        <div class="row">
          <img src="/assets/taso-yakiniku.jpg" width="56" height="56" alt="" style="border-radius:12px;width:56px;height:56px;object-fit:cover" />
          <div><b style="font-size:14px">@tokyofood</b><p style="font-size:13px;color:var(--muted);margin-top:2px">Shibuya 这家烧肉真的值得来吗？</p></div>
        </div>
      </button>
    </div>
  </section>
</template>
