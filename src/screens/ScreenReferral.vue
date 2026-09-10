<script setup lang="ts">
import { app, toast } from '../store'
import PageHeader from '../components/PageHeader.vue'

function copyLink() {
  if (navigator.clipboard) {
    navigator.clipboard.writeText('https://taso.app/r/A8K29').catch(() => {})
  }
  toast('推广链接已复制')
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'referral' }" data-screen="referral">
    <PageHeader title="推广中心" />
    <div class="row" style="gap:8px;margin-top:8px">
      <div class="card" style="flex:1;padding:12px"><div class="num" style="font-weight:700">128</div><div class="meta">邀请人数</div></div>
      <div class="card" style="flex:1;padding:12px"><div class="num" style="font-weight:700">32</div><div class="meta">直接邀请</div></div>
      <div class="card" style="flex:1;padding:12px"><div class="num gold" style="font-weight:700">2,380</div><div class="meta">总奖励 US$</div></div>
      <div class="card" style="flex:1;padding:12px"><div class="num warn" style="font-weight:700">420</div><div class="meta">待结算</div></div>
    </div>
    <div class="card" style="margin-top:14px">
      <div class="meta">我的推广链接</div>
      <div class="row-b" style="margin-top:8px"><span class="num" style="font-size:13px;word-break:break-all">https://taso.app/r/A8K29</span></div>
      <div class="row" style="margin-top:12px;gap:10px">
        <button class="btn btn-o" style="flex:1" @click="copyLink">复制</button>
        <button class="btn btn-p" style="flex:1" @click="toast('分享链接已复制')">分享</button>
      </div>
    </div>
    <div class="card" style="margin-top:14px">
      <div class="row-b"><b style="font-size:14px">奖励结构</b><span class="badge soft">仅展示当前适用规则</span></div>
      <div class="kv" style="margin-top:6px"><span class="k">一级</span><span class="v num">按地区方案</span></div>
      <div class="kv"><span class="k">二级</span><span class="v num">按地区方案</span></div>
      <div class="kv"><span class="k">三级</span><span class="v num">按地区方案</span></div>
      <button class="btn btn-o" style="margin-top:12px" @click="toast('规则以后台审核通过的方案为准')">查看详细规则</button>
    </div>
    <p class="meta" style="margin-top:12px">推广奖励不构成收益承诺，具体方案按国家/地区、用户类型与合规状态动态配置。</p>
  </section>
</template>
