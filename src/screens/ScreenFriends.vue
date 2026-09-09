<script setup lang="ts">
import { computed, ref } from 'vue'
import { app, openChat, acceptReq, rejectReq, sendReq, revokeReq, openSheet } from '../store'
import { MEMBERS, type Member } from '../data'
import PageHeader from '../components/PageHeader.vue'

const q = ref('')

const friends = computed<Member[]>(() =>
  app.social.friends
    .map(id => MEMBERS[id])
    .filter(m => {
      const k = q.value.trim().toLowerCase()
      return m && (!k || (m.nick + m.handle + m.city).toLowerCase().includes(k))
    }),
)

const reqOutM = computed<Member[]>(() => app.social.reqOut.map(id => MEMBERS[id]).filter(Boolean))

/** 推荐名单：排除好友 / 已发出申请 / 已有待处理申请的成员 */
const recos = computed<Member[]>(() => {
  const skip = new Set<string>([...app.social.friends, ...app.social.reqOut, ...app.social.reqIn.map(r => r.member)])
  return Object.values(MEMBERS).filter(m => !skip.has(m.id))
})
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'friends' }" data-screen="friends">
    <PageHeader title="好友">
      <template #right>
        <button class="bk" aria-label="添加好友" @click="openSheet('add-friend')"><svg class="ic"><use href="#i-user-plus"/></svg></button>
      </template>
    </PageHeader>

    <input v-model="q" class="input" placeholder="搜索好友 / Taso ID" style="margin-top:8px" />
    <div class="seg" style="margin-top:12px">
      <button :class="{ on: app.friendsTab === '好友' }" @click="app.friendsTab = '好友'">好友 {{ friends.length }}</button>
      <button :class="{ on: app.friendsTab === '请求' }" @click="app.friendsTab = '请求'">新请求<i v-if="app.social.reqIn.length" class="sup">{{ app.social.reqIn.length }}</i></button>
      <button :class="{ on: app.friendsTab === '推荐' }" @click="app.friendsTab = '推荐'">推荐</button>
    </div>

    <div v-if="app.friendsTab === '好友'">
      <div v-if="friends.length" class="card" style="margin-top:12px;padding:4px 14px">
        <div v-for="m in friends" :key="m.id" class="conv" @click="openChat(m.id)">
          <span class="avatar">{{ m.avatar }}<span v-if="m.online" class="av-dot"></span></span>
          <div class="t">
            <div class="row" style="gap:5px">
              <b style="font-size:15px">{{ m.nick }}</b>
              <span class="vfy"><svg class="ic sm f"><use href="#i-check"/></svg>{{ m.verify }}</span>
            </div>
            <p class="prev">{{ m.city }} · {{ m.online ? '在线' : '离线' }}</p>
          </div>
          <button class="btn btn-o" style="width:auto;min-height:36px;padding:6px 14px;font-size:13px" @click.stop="openChat(m.id)">发消息</button>
        </div>
      </div>
      <div v-else class="card" style="margin-top:12px;text-align:center;padding:28px 14px">
        <b>{{ q.trim() ? '没有匹配的好友' : '还没有好友' }}</b>
        <p class="meta" style="margin-top:6px">去「推荐」或「⊕」认识新朋友</p>
        <button v-if="!q.trim()" class="btn btn-p" style="width:auto;margin-top:14px" @click="app.friendsTab = '推荐'">去看看推荐</button>
      </div>
    </div>

    <div v-else-if="app.friendsTab === '请求'" class="stack" style="margin-top:12px">
      <div v-for="r in app.social.reqIn" :key="r.id" class="card">
        <div class="row">
          <span class="avatar">{{ MEMBERS[r.member].avatar }}</span>
          <div style="flex:1;min-width:0">
            <div class="row" style="gap:5px">
              <b style="font-size:15px">{{ MEMBERS[r.member].nick }}</b>
              <span class="vfy"><svg class="ic sm f"><use href="#i-check"/></svg>{{ MEMBERS[r.member].verify }}</span>
            </div>
            <p class="meta" style="margin-top:2px">{{ r.note }} · {{ r.time }}</p>
          </div>
        </div>
        <div class="row" style="justify-content:flex-end;gap:10px;margin-top:12px">
          <button class="btn btn-o" style="width:auto;min-height:38px;padding:7px 18px;font-size:14px" @click="rejectReq(r.id)">拒绝</button>
          <button class="btn btn-p" style="width:auto;min-height:38px;padding:7px 18px;font-size:14px" @click="acceptReq(r.id)">接受</button>
        </div>
      </div>
      <div v-if="!app.social.reqIn.length && !reqOutM.length" class="card" style="text-align:center;padding:28px 14px">
        <b>没有新的好友申请</b>
        <p class="meta" style="margin-top:6px">通过 ID 搜索或二维码名片添加好友</p>
      </div>
      <template v-if="reqOutM.length">
        <p class="meta" style="margin-top:4px">我发出的申请</p>
        <div class="card" style="padding:4px 14px">
          <div v-for="m in reqOutM" :key="m.id" class="conv">
            <span class="avatar">{{ m.avatar }}</span>
            <div class="t">
              <b style="font-size:15px">{{ m.nick }}</b>
              <p class="prev">等待对方通过</p>
            </div>
            <button class="tag" @click="revokeReq(m.id)">撤回</button>
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
              <span class="vfy"><svg class="ic sm f"><use href="#i-check"/></svg>{{ m.verify }}</span>
            </div>
            <p class="prev">{{ m.handle }} · {{ m.city }} · {{ m.bio }}</p>
          </div>
          <button class="btn btn-p" style="width:auto;min-height:36px;padding:6px 14px;font-size:13px" @click="sendReq(m.id)">加好友</button>
        </div>
      </div>
      <div v-if="!recos.length" class="card" style="text-align:center;padding:28px 14px">
        <b>暂无推荐</b>
        <p class="meta" style="margin-top:6px">已覆盖全部可推荐成员</p>
      </div>
      <p class="meta" style="text-align:center">推荐依据：共同好友 · 同城 · 共同关注</p>
    </div>
  </section>
</template>
