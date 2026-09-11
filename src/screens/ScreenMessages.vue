<script setup lang="ts">
import { computed } from 'vue'
import { app, show, openChat } from '../store'
import { MEMBERS } from '../data'
import { t } from '../i18n'
import { convTime } from '../i18n/format'
import PageHeader from '../components/PageHeader.vue'

const list = computed(() =>
  app.social.convs.map(c => {
    const last = c.msgs.length ? c.msgs[c.msgs.length - 1] : null
    return { conv: c, m: MEMBERS[c.id], last }
  }),
)

const reqNames = computed(() =>
  app.social.reqIn.map(r => MEMBERS[r.member]?.nick).filter(Boolean).join(t('common.listSeparator')),
)
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'messages' }" data-screen="messages">
    <PageHeader :title="t('messages.title')">
      <template #right>
        <button class="bk" :aria-label="t('a11y.friends')" @click="app.friendsTab = 'friends'; show('friends')"><svg class="ic"><use href="#i-users"/></svg></button>
      </template>
    </PageHeader>

    <button v-if="app.social.reqIn.length" class="card row" style="width:100%;text-align:left;margin-top:8px" @click="app.friendsTab = 'requests'; show('friends')">
      <span class="li-ic"><svg class="ic"><use href="#i-user-plus"/></svg></span>
      <div style="flex:1;min-width:0">
        <b style="font-size:14px">{{ t('messages.reqBanner', { count: app.social.reqIn.length }) }}</b>
        <p class="meta" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{{ t('messages.from', { names: reqNames }) }}</p>
      </div>
      <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
    </button>

    <div v-if="list.length" class="card" style="margin-top:12px;padding:4px 14px">
      <div v-for="it in list" :key="it.conv.id" class="conv" @click="openChat(it.conv.id)">
        <span class="avatar">{{ it.m.avatar }}<span v-if="it.m.online" class="av-dot"></span></span>
        <div class="t">
          <div class="row" style="gap:5px">
            <b style="font-size:15px">{{ it.m.nick }}</b>
            <span class="vfy"><svg class="ic sm f"><use href="#i-check"/></svg>{{ t(`verify.${it.m.verifyKey}`) }}</span>
          </div>
          <p class="prev">{{ it.last ? (it.last.mine ? t('messages.me') : '') + it.last.text : t('messages.sayHi') }}</p>
        </div>
        <div class="tm">
          <span class="meta">{{ it.last ? convTime(it.last.at) : '' }}</span>
          <span v-if="it.conv.unread" class="rdot">{{ it.conv.unread }}</span>
        </div>
      </div>
    </div>

    <div v-else class="card" style="margin-top:12px;text-align:center;padding:28px 14px">
      <b>{{ t('messages.empty') }}</b>
      <p class="meta" style="margin-top:6px">{{ t('messages.emptyHint') }}</p>
      <button class="btn btn-p" style="width:auto;margin-top:14px" @click="show('friends')">{{ t('messages.goAdd') }}</button>
    </div>

    <p class="meta" style="margin-top:14px;text-align:center">{{ t('messages.friendsOnly') }}</p>
  </section>
</template>
