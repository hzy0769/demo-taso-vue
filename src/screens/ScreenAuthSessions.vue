<script setup lang="ts">
import { ref } from 'vue'
import { app, showDialog, toast } from '../store'
import PageHeader from '../components/PageHeader.vue'

/** AUTH-014 设备会话管理（AUTH PRD §15.3）：演示态设备列表 */
const devices = ref([
  { id: 1, name: 'iPhone 17 Pro', meta: '香港 · Taso App · 在线', icon: 'i-smartphone', current: true },
  { id: 2, name: 'MacBook Pro', meta: '2 分钟前 · Safari · 香港', icon: 'i-monitor', current: false },
  { id: 3, name: 'Windows PC', meta: '昨天 21:04 · Chrome · 东京', icon: 'i-monitor', current: false },
])

function signOutOthers() {
  showDialog('退出其他设备？', '当前设备将保持登录，其余设备的 TASO 会话将被撤销。', () => {
    devices.value = devices.value.filter(d => d.current)
    toast('已退出其他 2 台设备')
  })
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'auth-sessions' }" data-screen="auth-sessions">
    <PageHeader title="设备会话" />
    <p class="meta" style="margin:6px 0 12px;font-size:12px;line-height:1.7">
      以下设备持有你的 TASO 会话。发现陌生设备时，建议立即退出并修改密码。
    </p>

    <div class="card" style="padding:4px 14px">
      <div v-for="d in devices" :key="d.id" class="li" style="border:0">
        <span class="li-ic"><svg class="ic"><use :href="'#' + d.icon"/></svg></span>
        <span style="flex:1;min-width:0">
          <span class="li-title" style="display:block">{{ d.name }}</span>
          <span class="li-sub">{{ d.meta }}</span>
        </span>
        <span v-if="d.current" class="badge ok">当前设备</span>
        <span v-else class="badge soft">可撤销</span>
      </div>
    </div>

    <button
      v-if="devices.length > 1"
      class="btn btn-danger"
      style="margin-top:20px"
      @click="signOutOthers"
    >退出其他设备</button>

    <p class="meta" style="margin-top:14px;font-size:11px;text-align:center">
      注销账号时将自动撤销全部设备会话（AUTH PRD §15.2）
    </p>
  </section>
</template>
