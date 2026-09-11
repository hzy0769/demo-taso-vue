<script setup lang="ts">
import { computed, ref } from 'vue'
import { app, openChat, acceptReq, rejectReq, sendReq, revokeReq, openSheet } from '../store'
import { MEMBERS, type Member } from '../data'
import { t, localName, regionName } from '../i18n'
import { relTime } from '../i18n/format'
import PageHeader from '../components/PageHeader.vue'

const q = ref('')

const cityOf = (cityId: string) => regionName({ country: '', cityId })

const friends = computed<Member[]>(() =>
  app.social.friends
    .map(id => MEMBERS[id])
    .filter(m => {
      const k = q.value.trim().toLowerCase()
      return m && (!k || (m.nick + m.handle + cityOf(m.cityId)).toLowerCase().includes(k))
    }),
)

const reqOutM = computed<Member[]>(() => app.social.reqOut.map(id => MEMBERS[id]).filter(Boolean))

/** 推荐名单:排除好友 / 已发出申请 / 已有待处理申请的成员 */
const recos = computed<Member[]>(() => {
  const skip = new Set<string>([...app.social.friends, ...app.social.reqOut, ...app.social.reqIn.map(r => r.member)])
  return Object.values(MEMBERS).filter(m => !skip.has(m.id))
})
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'friends' }" data-screen="friends">
    <PageHeader :title="t('friends.title')">
      <template #right>
        <button class="bk" :aria-label="t('a11y.addFriend')" @click="openSheet('add-friend')"><svg class="ic"><use href="#i-user-plus"/></svg></button>
      </template>
    </PageHeader>

    <input v-model="q" class="input" :placeholder="t('friends.searchPlaceholder')" style="margin-top:8px" />
    <div class="seg" style="margin-top:12px">
      <button :class="{ on: app.friendsTab === 'friends' }" @click="app.friendsTab = 'friends'">{{ t('friends.tabFriends') }} {{ friends.length }}</button>
      <button :class="{ on: app.friendsTab === 'requests' }" @click="app.friendsTab = 'requests'">{{ t('friends.tabRequests') }}<i v-if="app.social.reqIn.length" class="sup">{{ app.social.reqIn.length }}</i></button>
      <button :class="{ on: app.friendsTab === 'recos' }" @click="app.friendsTab = 'recos'">{{ t('friends.tabRecos') }}</button>
    </div>

    <div v-if="app.friendsTab === 'friends'">
      <div v-if="friends.length" class="card" style="margin-top:12px;padding:4px 14px">
        <div v-for="m in friends" :key="m.id" class="conv" @click="openChat(m.id)">
          <span class="avatar">{{ m.avatar }}<span v-if="m.online" class="av-dot"></span></span>
          <div class="t">
            <div class="row" style="gap:5px">
              <b style="font-size:15px">{{ m.nick }}</b>
              <span class="vfy"><svg class="ic sm f"><use href="#i-check"/></svg>{{ t(`verify.${m.verifyKey}`) }}</span>
            </div>
            <p class="prev">{{ cityOf(m.cityId) }} · {{ t(m.online ? 'friends.online' : 'friends.offline') }}</p>
          </div>
          <button class="btn btn-o" style="width:auto;min-height:36px;padding:6px 14px;font-size:13px" @click.stop="openChat(m.id)">{{ t('friends.sendMsg') }}</button>
        </div>
      </div>
      <div v-else class="card" style="margin-top:12px;text-align:center;padding:28px 14px">
        <b>{{ t(q.trim() ? 'friends.emptyNoMatch' : 'friends.emptyNoFriends') }}</b>
        <p class="meta" style="margin-top:6px">{{ t('friends.emptyHint') }}</p>
        <button v-if="!q.trim()" class="btn btn-p" style="width:auto;margin-top:14px" @click="app.friendsTab = 'recos'">{{ t('friends.goRecos') }}</button>
      </div>
    </div>

    <div v-else-if="app.friendsTab === 'requests'" class="stack" style="margin-top:12px">
      <div v-for="r in app.social.reqIn" :key="r.id" class="card">
        <div class="row">
          <span class="avatar">{{ MEMBERS[r.member].avatar }}</span>
          <div style="flex:1;min-width:0">
            <div class="row" style="gap:5px">
              <b style="font-size:15px">{{ MEMBERS[r.member].nick }}</b>
              <span class="vfy"><svg class="ic sm f"><use href="#i-check"/></svg>{{ t(`verify.${MEMBERS[r.member].verifyKey}`) }}</span>
            </div>
            <p class="meta" style="margin-top:2px">{{ t(`friends.reqNote.${r.noteKey}`) }} · {{ relTime(r.at) }}</p>
          </div>
        </div>
        <div class="row" style="justify-content:flex-end;gap:10px;margin-top:12px">
          <button class="btn btn-o" style="width:auto;min-height:38px;padding:7px 18px;font-size:14px" @click="rejectReq(r.id)">{{ t('friends.reject') }}</button>
          <button class="btn btn-p" style="width:auto;min-height:38px;padding:7px 18px;font-size:14px" @click="acceptReq(r.id)">{{ t('friends.accept') }}</button>
        </div>
      </div>
      <div v-if="!app.social.reqIn.length && !reqOutM.length" class="card" style="text-align:center;padding:28px 14px">
        <b>{{ t('friends.noRequests') }}</b>
      </div>
      <template v-if="reqOutM.length">
        <p class="meta" style="margin-top:4px">{{ t('friends.myOutgoing') }}</p>
        <div class="card" style="padding:4px 14px">
          <div v-for="m in reqOutM" :key="m.id" class="conv">
            <span class="avatar">{{ m.avatar }}</span>
            <div class="t">
              <b style="font-size:15px">{{ m.nick }}</b>
              <p class="prev">{{ t('friends.waiting') }}</p>
            </div>
            <button class="tag" @click="revokeReq(m.id)">{{ t('friends.revoke') }}</button>
          </div>
        </div>
      </template>
    </div>

    <div v-else class="stack" style="margin-top:12px">
      <div v-for="m in recos" :key="m.id" class="card">
        <div class="row">
          <span class="avatar">{{ m.avatar }}<span v-if="m.online" class="av-dot"></span></span>
          <div style="flex:1;min-width:0">
            <div class="row" style="gap:5px">
              <b style="font-size:15px">{{ m.nick }}</b>
              <span class="vfy"><svg class="ic sm f"><use href="#i-check"/></svg>{{ t(`verify.${m.verifyKey}`) }}</span>
            </div>
            <p class="prev">{{ m.handle }} · {{ cityOf(m.cityId) }} · {{ localName(m.bio) }}</p>
          </div>
          <button class="btn btn-p" style="width:auto;min-height:36px;padding:6px 14px;font-size:13px" @click="sendReq(m.id)">{{ t('addFriend.add') }}</button>
        </div>
      </div>
      <div v-if="!recos.length" class="card" style="text-align:center;padding:28px 14px">
        <b>{{ t('friends.noRecos') }}</b>
        <p class="meta" style="margin-top:6px">{{ t('friends.noRecosHint') }}</p>
      </div>
      <p class="meta" style="text-align:center">{{ t('friends.recoBasis') }}</p>
    </div>
  </section>
</template>
