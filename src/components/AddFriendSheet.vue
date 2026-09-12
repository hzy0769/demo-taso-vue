<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { app, closeSheets, show, toast, sendReq, revokeReq, reqState, overlayFocusIn, overlayFocusOut } from '../store'
import { MEMBERS } from '../data'
import { t, localName, regionName } from '../i18n'

const q = ref('')

const open = computed(() => app.sheet === 'add-friend')
/** 弹层无障碍(评审 §6.4):关闭态 inert;打开焦点进入,关闭焦点复位 */
const root = ref<HTMLElement | null>(null)
watch(open, v => {
  if (v) overlayFocusIn(root.value)
  else overlayFocusOut(root.value)
})

const found = computed(() => {
  const k = q.value.trim().replace(/^@/, '').toLowerCase()
  if (!k) return null
  return (
    Object.values(MEMBERS).find(
      m => m.id === k || m.handle.toLowerCase() === '@' + k || m.nick.toLowerCase() === k,
    ) ?? null
  )
})

const cityOf = (cityId: string) => regionName({ country: '', cityId })
</script>

<template>
  <div
    ref="root"
    class="sheet" :class="{ on: open }"
    :inert="!open" tabindex="-1"
    role="dialog" aria-modal="true" :aria-label="t('addFriend.title')"
  >
    <div class="grip"></div>
    <div class="row-b">
      <b style="font-size:17px">{{ t('addFriend.title') }}</b>
      <button class="tag" style="border:0;padding:0" @click="closeSheets()">{{ t('common.close') }}</button>
    </div>
    <input v-model="q" class="input" :placeholder="t('addFriend.placeholder')" style="margin-top:14px" />
    <div style="margin-top:12px">
      <p v-if="!q.trim()" class="meta">{{ t('addFriend.hint') }}</p>
      <p v-else-if="!found" class="meta">{{ t('addFriend.notFound') }}</p>
      <div v-else class="card">
        <div class="row">
          <span class="avatar">{{ found.avatar }}<span v-if="found.online" class="av-dot"></span></span>
          <div style="flex:1;min-width:0">
            <div class="row" style="gap:5px">
              <b style="font-size:15px">{{ found.nick }}</b>
              <span class="vfy"><svg class="ic sm f"><use href="#i-check"/></svg>{{ t(`verify.${found.verifyKey}`) }}</span>
            </div>
            <p class="meta">{{ found.handle }} · {{ cityOf(found.cityId) }} · {{ localName(found.bio) }}</p>
          </div>
          <button v-if="reqState(found.id) === 'none'" class="btn btn-p" style="width:auto;min-height:36px;padding:6px 14px;font-size:13px" @click="sendReq(found.id)">{{ t('addFriend.add') }}</button>
          <button v-else-if="reqState(found.id) === 'out'" class="btn btn-o" style="width:auto;min-height:36px;padding:6px 14px;font-size:13px" @click="revokeReq(found.id)">{{ t('addFriend.revoke') }}</button>
          <span v-else class="badge ok">{{ t('addFriend.isFriend') }}</span>
        </div>
      </div>
    </div>

    <div class="card" style="margin-top:16px;padding:4px 14px">
      <div class="row" style="min-height:52px">
        <span class="li-ic"><svg class="ic"><use href="#i-user"/></svg></span>
        <div style="flex:1">
          <div style="font-size:15px;font-weight:500">{{ t('addFriend.myId') }}</div>
          <p class="meta">@alex</p>
        </div>
        <button class="tag" @click="toast(t('addFriend.copied', { id: '@alex' }))">{{ t('common.copy') }}</button>
      </div>
      <div class="row" style="min-height:52px;border-top:1px solid var(--border)">
        <span class="li-ic"><svg class="ic"><use href="#i-image"/></svg></span>
        <div style="flex:1">
          <div style="font-size:15px;font-weight:500">{{ t('addFriend.qrCard') }}</div>
          <p class="meta">{{ t('addFriend.qrCardSub') }}</p>
        </div>
        <button class="tag" @click="closeSheets(); show('my-qrcode')">{{ t('common.view') }}</button>
      </div>
    </div>

    <p class="meta" style="margin-top:12px">{{ t('addFriend.note') }}</p>
  </div>
</template>
