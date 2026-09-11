<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { app, sendMsg, toast } from '../store'
import { MEMBERS, type ChatMsg } from '../data'
import { t } from '../i18n'
import { chatDayLabel } from '../i18n/format'
import PageHeader from '../components/PageHeader.vue'

const draft = ref('')
const listEl = ref<HTMLElement | null>(null)

const member = computed(() => MEMBERS[app.chatWith])
const conv = computed(() => app.social.convs.find(c => c.id === app.chatWith))

/** 按「今天 / 昨天 / 日期」分组:由用户时区即時計算(§8.2) */
const groups = computed(() => {
  const out: { day: string; msgs: ChatMsg[] }[] = []
  for (const m of conv.value?.msgs ?? []) {
    const key = chatDayLabel(m.at)
    const last = out[out.length - 1]
    if (last && last.day === key) last.msgs.push(m)
    else out.push({ day: key, msgs: [m] })
  }
  return out
})

/** 最后一条「我的消息」id:其下展示 已送达/已读 */
const lastMineId = computed(() => {
  const msgs = conv.value?.msgs ?? []
  for (let i = msgs.length - 1; i >= 0; i--) if (msgs[i].mine) return msgs[i].id
  return -1
})

function scrollBottom() {
  void nextTick(() => {
    if (listEl.value) listEl.value.scrollTop = listEl.value.scrollHeight
  })
}

watch(() => app.screen, s => { if (s === 'chat') scrollBottom() })
watch(() => conv.value?.msgs.length, () => { if (app.screen === 'chat') scrollBottom() })

function send() {
  const trimmed = draft.value.trim()
  if (!trimmed) return
  sendMsg(trimmed)
  draft.value = ''
  scrollBottom()
}
</script>

<template>
  <section class="scr chat" :class="{ on: app.screen === 'chat' }" data-screen="chat">
    <PageHeader>
      <template #title>
        <div v-if="member" style="min-width:0">
          <div class="hd-title">{{ member.nick }}</div>
          <p class="hd-sub" :class="member.online ? 'ok' : ''">{{ t(member.online ? 'chat.online' : 'chat.offline') }}</p>
        </div>
      </template>
      <template #right>
        <button class="bk" :aria-label="t('a11y.chatSettings')" @click="toast(t('chat.settingsToast'))"><svg class="ic"><use href="#i-more"/></svg></button>
      </template>
    </PageHeader>

    <div ref="listEl" class="chat-list">
      <template v-if="member">
        <div v-if="!conv || !conv.msgs.length" class="day"><span>{{ t('chat.hello') }}</span></div>
        <template v-for="g in groups" :key="g.day + g.msgs[0].id">
          <div class="day"><span>{{ g.day }}</span></div>
          <div v-for="m in g.msgs" :key="m.id" class="msg" :class="m.mine ? 'me' : 'o'">
            <span v-if="!m.mine" class="avatar">{{ member.avatar }}</span>
            <div class="col">
              <div class="bub">{{ m.text }}</div>
              <span v-if="m.mine && m.id === lastMineId" class="st">{{ t(m.read ? 'chat.read' : 'chat.delivered') }}</span>
            </div>
          </div>
        </template>
      </template>
    </div>

    <div class="chat-bar">
      <input v-model="draft" class="input" :placeholder="t('chat.placeholder')" style="flex:1" @keyup.enter="send" />
      <button class="send" :disabled="!draft.trim()" :aria-label="t('a11y.send')" @click="send"><svg class="ic"><use href="#i-send"/></svg></button>
    </div>
  </section>
</template>
