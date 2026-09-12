<script setup lang="ts">
import { computed } from 'vue'
import { app, show, toggleFollowAuthor } from '../store'
import { MEMBERS, type Member } from '../data'
import { t, localName, regionName } from '../i18n'
import PageHeader from '../components/PageHeader.vue'

/** 关注的作者:handle 优先在成员表补全资料,查不到时兜底展示 handle */
const followed = computed(() =>
  app.follows.map(handle => {
    const m = MEMBERS[handle.replace(/^@/, '')]
    return {
      handle,
      member: m ?? null,
      avatar: m?.avatar ?? (handle.replace(/^@/, '').charAt(0).toUpperCase() || '?'),
    }
  }),
)

const cityOf = (m: Member | null) => (m ? regionName({ country: '', cityId: m.cityId }) : '')
const bioOf = (m: Member | null) => (m ? localName(m.bio) : '')
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'my-follows' }" data-screen="my-follows">
    <PageHeader :title="t('me.myFollows')" />
    <p class="meta" style="margin-top:6px">{{ t('myFollows.count', { n: followed.length }) }}</p>
    <div v-if="followed.length" class="card" style="margin-top:12px;padding:4px 14px">
      <div v-for="f in followed" :key="f.handle" class="conv" role="button" tabindex="0" @click="show('profile')" @keydown.enter.prevent="show('profile')">
        <span class="avatar">{{ f.avatar }}</span>
        <div class="t">
          <div class="row" style="gap:5px">
            <b style="font-size:15px">{{ f.member ? f.member.nick : f.handle }}</b>
            <span v-if="f.member" class="vfy"><svg class="ic sm f"><use href="#i-check"/></svg>{{ t(`verify.${f.member.verifyKey}`) }}</span>
          </div>
          <p class="prev">{{ f.handle }}<template v-if="f.member"> · {{ cityOf(f.member) }} · {{ bioOf(f.member) }}</template></p>
        </div>
        <button class="btn btn-o" style="width:auto;min-height:36px;padding:6px 14px;font-size:13px" @click.stop="toggleFollowAuthor(f.handle)">{{ t('post.following') }}</button>
      </div>
    </div>
    <div v-else class="card" style="margin-top:12px;text-align:center;padding:28px 14px">
      <b>{{ t('myFollows.empty') }}</b>
      <p class="meta" style="margin-top:6px">{{ t('myFollows.emptyHint') }}</p>
      <button class="btn btn-p" style="width:auto;margin-top:14px" @click="show('discover')">{{ t('myFollows.goDiscover') }}</button>
    </div>
    <p class="meta" style="margin-top:12px">{{ t('myFollows.note') }}</p>
  </section>
</template>
