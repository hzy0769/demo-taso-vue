<script setup lang="ts">
import { computed, ref } from 'vue'
import { app, closeSheets, show, toast, sendReq, revokeReq, reqState } from '../store'
import { MEMBERS } from '../data'

const q = ref('')

const found = computed(() => {
  const k = q.value.trim().replace(/^@/, '').toLowerCase()
  if (!k) return null
  return (
    Object.values(MEMBERS).find(
      m => m.id === k || m.handle.toLowerCase() === '@' + k || m.nick.toLowerCase() === k,
    ) ?? null
  )
})
</script>

<template>
  <div class="sheet" :class="{ on: app.sheet === 'add-friend' }" role="dialog" aria-label="添加好友">
    <div class="grip"></div>
    <div class="row-b">
      <b style="font-size:17px">添加好友</b>
      <button class="tag" style="border:0;padding:0" @click="closeSheets()">关闭</button>
    </div>
    <input v-model="q" class="input" placeholder="输入 Taso ID 或昵称，如 @sora" style="margin-top:14px" />
    <div style="margin-top:12px">
      <p v-if="!q.trim()" class="meta">输入对方的 Taso ID 或昵称进行搜索</p>
      <p v-else-if="!found" class="meta">未找到该用户</p>
      <div v-else class="card">
        <div class="row">
          <span class="avatar">{{ found.avatar }}<span v-if="found.online" class="av-dot"></span></span>
          <div style="flex:1;min-width:0">
            <div class="row" style="gap:5px">
              <b style="font-size:15px">{{ found.nick }}</b>
              <span class="vfy"><svg class="ic sm f"><use href="#i-check"/></svg>{{ found.verify }}</span>
            </div>
            <p class="meta">{{ found.handle }} · {{ found.city }} · {{ found.bio }}</p>
          </div>
          <button v-if="reqState(found.id) === 'none'" class="btn btn-p" style="width:auto;min-height:36px;padding:6px 14px;font-size:13px" @click="sendReq(found.id)">加好友</button>
          <button v-else-if="reqState(found.id) === 'out'" class="btn btn-o" style="width:auto;min-height:36px;padding:6px 14px;font-size:13px" @click="revokeReq(found.id)">撤回申请</button>
          <span v-else class="badge ok">已是好友</span>
        </div>
      </div>
    </div>

    <div class="card" style="margin-top:16px;padding:4px 14px">
      <div class="row" style="min-height:52px">
        <span class="li-ic"><svg class="ic"><use href="#i-user"/></svg></span>
        <div style="flex:1">
          <div style="font-size:15px;font-weight:500">我的 Taso ID</div>
          <p class="meta">@alex</p>
        </div>
        <button class="tag" @click="toast('已复制：@alex')">复制</button>
      </div>
      <div class="row" style="min-height:52px;border-top:1px solid var(--border)">
        <span class="li-ic"><svg class="ic"><use href="#i-image"/></svg></span>
        <div style="flex:1">
          <div style="font-size:15px;font-weight:500">二维码名片</div>
          <p class="meta">面对面扫码添加</p>
        </div>
        <button class="tag" @click="closeSheets(); show('my-qrcode')">查看</button>
      </div>
    </div>

    <p class="meta" style="margin-top:12px">对方同意后即成为好友，可以开始聊天</p>
  </div>
</template>
