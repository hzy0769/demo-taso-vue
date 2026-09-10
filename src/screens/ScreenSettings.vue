<script setup lang="ts">
import { app, logout, showDialog, show } from '../store'
import PageHeader from '../components/PageHeader.vue'
import ToggleSwitch from '../components/ToggleSwitch.vue'
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'settings' }" data-screen="settings">
    <PageHeader title="设置" />
    <div class="card" style="margin-top:8px;padding:4px 14px">
      <button class="li" style="border:0" @click="show('account')">
        <span class="li-ic"><svg class="ic"><use href="#i-user"/></svg></span>
        <span class="li-title">账号与安全</span>
        <span class="li-val">{{ app.auth.user?.nickname ?? '未登录' }}</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" style="border:0" @click="show('language')">
        <span class="li-ic"><svg class="ic"><use href="#i-globe"/></svg></span>
        <span class="li-title">语言与地区</span><span class="li-val">简体中文 · HK</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" style="border:0" @click="show('security')">
        <span class="li-ic"><svg class="ic"><use href="#i-shield"/></svg></span>
        <span class="li-title">安全与隐私</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" style="border:0" @click="show('kyc')">
        <span class="li-ic"><svg class="ic"><use href="#i-check"/></svg></span>
        <span class="li-title">实名 / KYC 状态</span><span class="badge ok">已通过</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <button class="li" style="border:0" @click="show('notifications')">
        <span class="li-ic"><svg class="ic"><use href="#i-bell"/></svg></span>
        <span class="li-title">通知中心</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
      <div class="li" style="border:0">
        <span class="li-ic"><svg class="ic"><use href="#i-globe"/></svg></span>
        <span class="li-title">自动翻译</span>
        <ToggleSwitch label="自动翻译" />
      </div>
      <div class="li" style="border:0">
        <span class="li-ic"><svg class="ic"><use href="#i-bell"/></svg></span>
        <span class="li-title">推送通知</span>
        <ToggleSwitch label="推送通知" />
      </div>
    </div>
    <button
      class="btn btn-danger"
      style="margin-top:20px"
      @click="showDialog('退出登录？', '将撤销当前设备的 TASO 会话，账号与绑定关系保留。', logout)"
    >退出登录</button>
  </section>
</template>
