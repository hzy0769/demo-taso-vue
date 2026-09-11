<script setup lang="ts">
import { ref } from 'vue'
import { app, showDialog, toast } from '../store'
import { t, countryName } from '../i18n'
import { relTime } from '../i18n/format'
import PageHeader from '../components/PageHeader.vue'

/** AUTH-014 设备会话管理(AUTH PRD §15.3):演示态设备列表;时间/地区结构化 */
const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString()

type Device = { id: number; name: string; icon: string; current: boolean; metaKey: 'current' | 'mac' | 'pc'; at?: string; browser?: string; country?: string }
const seedDevices: Device[] = [
  { id: 1, name: 'iPhone 17 Pro', icon: 'i-smartphone', current: true, metaKey: 'current', country: 'HK' },
  { id: 2, name: 'MacBook Pro', icon: 'i-monitor', current: false, metaKey: 'mac', at: minutesAgo(2), browser: 'Safari', country: 'HK' },
  { id: 3, name: 'Windows PC', icon: 'i-monitor', current: false, metaKey: 'pc', at: '2026-09-10T21:04:00+09:00', browser: 'Chrome', country: 'JP' },
]
const devices = ref(seedDevices)
const metaOf = (d: Device) =>
  d.metaKey === 'current'
    ? t('sessions.currentMeta', { region: countryName(d.country!) })
    : t('sessions.otherMeta', { time: relTime(d.at!), browser: d.browser!, region: countryName(d.country!) })

function signOutOthers() {
  showDialog(t('sessions.signOutTitle'), t('sessions.signOutBody'), () => {
    devices.value = devices.value.filter(d => d.current)
    toast(t('sessions.signedOut', { n: 2 }))
  })
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'auth-sessions' }" data-screen="auth-sessions">
    <PageHeader :title="t('sessions.title')" />
    <p class="meta" style="margin:6px 0 12px;font-size:12px;line-height:1.7">
      {{ t('sessions.intro') }}
    </p>

    <div class="card" style="padding:4px 14px">
      <div v-for="d in devices" :key="d.id" class="li" style="border:0">
        <span class="li-ic"><svg class="ic"><use :href="'#' + d.icon"/></svg></span>
        <span style="flex:1;min-width:0">
          <span class="li-title" style="display:block">{{ d.name }}</span>
          <span class="li-sub">{{ metaOf(d) }}</span>
        </span>
        <span v-if="d.current" class="badge ok">{{ t('sessions.current') }}</span>
        <span v-else class="badge soft">{{ t('sessions.revocable') }}</span>
      </div>
    </div>

    <button
      v-if="devices.length > 1"
      class="btn btn-danger"
      style="margin-top:20px"
      @click="signOutOthers"
    >{{ t('sessions.signOutOthers') }}</button>

    <p class="meta" style="margin-top:14px;font-size:11px;text-align:center">
      {{ t('sessions.note') }}
    </p>
  </section>
</template>
