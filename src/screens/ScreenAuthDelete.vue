<script setup lang="ts">
import { computed } from 'vue'
import { app, deleteAccount, showDialog } from '../store'
import PageHeader from '../components/PageHeader.vue'

/** AUTH-016/017 删除账号：风险提示 → 二次确认 → 执行（AUTH PRD §18.3） */
const u = computed(() => app.auth.user)

const SCOPE = [
  '账号信息与 TASO ID',
  '全部帖子、评论、点赞与收藏',
  '好友关系与聊天记录',
  '会员卡、钱包余额与消费权益',
]

function confirmDelete() {
  showDialog(
    '确认删除账号？',
    '该操作不可撤销。删除后 14 天内可通过重新登录发起恢复（演示原型将立即清空本地数据并回到首次启动）。',
    deleteAccount,
  )
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'auth-delete' }" data-screen="auth-delete">
    <PageHeader title="删除账号" />

    <div class="card row" style="margin-top:8px;gap:12px;border-color:color-mix(in oklch,var(--danger) 35%,transparent)">
      <span style="display:grid;place-items:center;width:40px;height:40px;border-radius:12px;background:var(--danger-soft);color:var(--danger);flex:none">
        <svg class="ic"><use href="#i-alert"/></svg>
      </span>
      <p style="font-size:13.5px;line-height:1.6">删除账号是高危操作。请确认你了解删除范围与恢复窗口后再继续。</p>
    </div>

    <div v-if="u" class="card" style="margin-top:14px">
      <div class="kv"><span class="k">账号</span><span class="v">{{ u.nickname }} · TASO ID {{ u.id }}</span></div>
      <div class="kv"><span class="k">删除范围</span><span class="v">全部个人数据</span></div>
      <div class="kv"><span class="k">恢复窗口</span><span class="v">14 天</span></div>
      <div class="kv"><span class="k">会话处理</span><span class="v">撤销全部设备会话</span></div>
    </div>

    <div class="card" style="margin-top:14px;padding:4px 14px">
      <div v-for="s in SCOPE" :key="s" class="li" style="border:0">
        <span class="li-ic" style="background:var(--danger-soft);color:var(--danger)"><svg class="ic"><use href="#i-x"/></svg></span>
        <span class="li-title" style="font-weight:400;font-size:14px">{{ s }}</span>
      </div>
    </div>

    <button class="btn btn-danger" style="margin-top:20px" @click="confirmDelete">删除我的账号</button>
    <p class="meta" style="margin-top:14px;font-size:11px;text-align:center">
      演示态：删除将清空浏览器本地的账号、社交与余额数据
    </p>
  </section>
</template>
