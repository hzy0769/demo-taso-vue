<script setup lang="ts">
import { app, toast } from '../store'
import PageHeader from '../components/PageHeader.vue'
import ToggleSwitch from '../components/ToggleSwitch.vue'

const items = [
  { icon: '#i-refresh', title: '登录设备', msg: '当前设备：iPhone 16 Pro · 香港' },
  { icon: '#i-lock', title: '修改密码', msg: '密码修改链接已发送' },
  { icon: '#i-user', title: '手机 / 邮箱', msg: '手机 +852 9123 4567' },
  { icon: '#i-wallet', title: '提现安全', msg: '提现安全：已开启高金额人工审核' },
  { icon: '#i-copy', title: '钱包地址管理', msg: '已管理 2 个钱包地址' },
  { icon: '#i-card', title: '银行卡管理', msg: '已绑定银行卡 · 尾号 2021' },
  { icon: '#i-check', title: '授权管理', msg: '已授权 3 个第三方应用' },
  { icon: '#i-x', title: '拉黑 / 屏蔽', msg: '拉黑 / 屏蔽列表' },
  { icon: '#i-image', title: '下载个人数据', msg: '个人数据包将在 24 小时内生成' },
]
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'security' }" data-screen="security">
    <PageHeader title="安全与隐私" />
    <div class="card" style="margin-top:8px;padding:4px 14px">
      <button v-for="it in items" :key="it.title" class="li" style="border:0" @click="toast(it.msg)">
        <span class="li-ic"><svg class="ic"><use :href="it.icon"/></svg></span>
        <span class="li-title">{{ it.title }}</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <div class="li" style="border:0">
        <span class="li-ic"><svg class="ic"><use href="#i-shield"/></svg></span>
        <span class="li-title">两步验证（2FA）</span>
        <ToggleSwitch label="2FA" />
      </div>
    </div>
    <button class="btn btn-danger" style="margin-top:20px" @click="toast('注销为不可逆操作，需人工确认')">注销账户</button>
  </section>
</template>
