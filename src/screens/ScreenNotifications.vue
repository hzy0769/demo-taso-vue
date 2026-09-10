<script setup lang="ts">
import { app } from '../store'
import PageHeader from '../components/PageHeader.vue'

const items = [
  { icon: '#i-heart', title: 'Alex 赞了你的帖子', sub: '「东京深夜拉面攻略」· 2m' },
  { icon: '#i-user-plus', title: 'Sora 请求添加你为好友', sub: '好友申请 · 5m' },
  { icon: '#i-check', title: 'Taso 消费凭证审核已通过', sub: '焼肉Taso · 1h' },
  { icon: '#i-wallet', title: '今日消费权益 US$0.40 已入账', sub: '报销结算 · 3h' },
  { icon: '#i-card', title: '会员卡充值 US$10,000 已成功', sub: 'Taso Card · 昨天' },
  { icon: '#i-globe', title: '你的帖子已被翻译为日语', sub: '自动翻译 · 昨天' },
]
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'notifications' }" data-screen="notifications">
    <PageHeader title="通知中心" />
    <div class="chips" style="margin-top:8px">
      <button class="chip on">全部</button><button class="chip">互动</button><button class="chip">关注</button><button class="chip">订单/权益</button><button class="chip">审核</button><button class="chip">系统</button>
    </div>
    <div class="stack" style="margin-top:14px">
      <div v-for="it in items" :key="it.title" class="card">
        <div class="row">
          <span class="li-ic"><svg class="ic"><use :href="it.icon"/></svg></span>
          <div style="flex:1">
            <b style="font-size:14px">{{ it.title }}</b>
            <p class="meta">{{ it.sub }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
