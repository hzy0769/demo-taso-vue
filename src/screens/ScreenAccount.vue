<script setup lang="ts">
import { computed } from 'vue'
import { app, show } from '../store'
import PageHeader from '../components/PageHeader.vue'

/** AUTH-012 账号与安全：登录方式 / 账号信息 / 设备会话 / 删除账号（AUTH PRD §13.4） */
const u = computed(() => app.auth.user)
const COUNTRY: Record<string, string> = { HK: 'Hong Kong', JP: 'Japan', US: 'United States', KR: 'Korea', SG: 'Singapore', TH: 'Thailand' }
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'account' }" data-screen="account">
    <PageHeader title="账号与安全" />

    <template v-if="u">
      <div class="card" style="margin-top:8px">
        <div class="row" style="gap:14px">
          <span class="avatar lg">{{ u.nickname.slice(0, 1).toUpperCase() }}</span>
          <div style="flex:1;min-width:0">
            <b style="font-size:17px">{{ u.nickname }}</b>
            <p class="meta">TASO ID · {{ u.id }}</p>
          </div>
          <span class="badge ok">正常</span>
        </div>
        <div style="margin-top:12px">
          <div class="kv"><span class="k">国家 / 地区</span><span class="v">{{ COUNTRY[u.countryCode] ?? u.countryCode }}</span></div>
          <div class="kv"><span class="k">界面语言</span><span class="v">{{ u.language }}</span></div>
          <div class="kv"><span class="k">时区</span><span class="v">{{ u.timezone }}</span></div>
          <div class="kv"><span class="k">注册时间</span><span class="v">{{ u.createdAt }}</span></div>
        </div>
      </div>

      <div class="card" style="margin-top:14px;padding:4px 14px">
        <button class="li" style="border:0" @click="show('auth-methods')">
          <span class="li-ic"><svg class="ic"><use href="#i-shield"/></svg></span>
          <span class="li-title">登录方式</span>
          <span class="li-val">已绑定 {{ u.identities.length }} 项</span>
          <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
        </button>
        <button class="li" style="border:0" @click="show('auth-sessions')">
          <span class="li-ic"><svg class="ic"><use href="#i-monitor"/></svg></span>
          <span class="li-title">设备会话</span>
          <span class="li-val">3 台设备</span>
          <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
        </button>
      </div>

      <div class="card" style="margin-top:14px;padding:4px 14px">
        <button class="li" style="border:0" @click="show('auth-delete')">
          <span class="li-ic" style="background:var(--danger-soft);color:var(--danger)"><svg class="ic"><use href="#i-trash"/></svg></span>
          <span class="li-title danger">删除账号</span>
          <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
        </button>
      </div>

      <p class="meta" style="margin-top:16px;font-size:11px;text-align:center">账号体系为前端演示：账号数据仅存于浏览器本地</p>
    </template>
  </section>
</template>
