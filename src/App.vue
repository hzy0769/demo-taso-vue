<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { app, ROOTS, show, openSheet, closeSheets, closeDialog, dialogOk, bootstrap } from './store'
import IconSprite from './components/IconSprite.vue'
import ComposerSheet from './components/ComposerSheet.vue'
import CommentsSheet from './components/CommentsSheet.vue'

import ScreenSplash from './screens/ScreenSplash.vue'
import ScreenWelcome from './screens/ScreenWelcome.vue'
import ScreenLogin from './screens/ScreenLogin.vue'
import ScreenInterests from './screens/ScreenInterests.vue'
import ScreenHome from './screens/ScreenHome.vue'
import ScreenPost from './screens/ScreenPost.vue'
import ScreenProfile from './screens/ScreenProfile.vue'
import ScreenDiscover from './screens/ScreenDiscover.vue'
import ScreenSearch from './screens/ScreenSearch.vue'
import ScreenMerchant from './screens/ScreenMerchant.vue'
import ScreenPlace from './screens/ScreenPlace.vue'
import ScreenBenefits from './screens/ScreenBenefits.vue'
import ScreenCardApply from './screens/ScreenCardApply.vue'
import ScreenCardDetail from './screens/ScreenCardDetail.vue'
import ScreenTopup from './screens/ScreenTopup.vue'
import ScreenWallet from './screens/ScreenWallet.vue'
import ScreenTransactions from './screens/ScreenTransactions.vue'
import ScreenReimburse from './screens/ScreenReimburse.vue'
import ScreenReimburseDetail from './screens/ScreenReimburseDetail.vue'
import ScreenWithdraw from './screens/ScreenWithdraw.vue'
import ScreenReferral from './screens/ScreenReferral.vue'
import ScreenCreator from './screens/ScreenCreator.vue'
import ScreenMe from './screens/ScreenMe.vue'
import ScreenSettings from './screens/ScreenSettings.vue'
import ScreenLanguage from './screens/ScreenLanguage.vue'
import ScreenSecurity from './screens/ScreenSecurity.vue'
import ScreenKyc from './screens/ScreenKyc.vue'
import ScreenNotifications from './screens/ScreenNotifications.vue'

const clock = ref('9:41')
function tick() {
  const d = new Date()
  clock.value = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0')
}

const isRoot = computed(() => ROOTS.includes(app.screen))
const veilOn = computed(() => !!app.sheet || !!app.dialog)

function veilClick() {
  closeSheets()
  closeDialog()
}

onMounted(() => {
  tick()
  setInterval(tick, 30000)
  bootstrap()
})
</script>

<template>
  <div class="stage">
    <div class="phone">
      <div class="statusbar">
        <span>{{ clock }}</span>
        <span class="sb-icons">
          <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor"><rect x="0" y="6" width="3" height="5" rx="1"/><rect x="4.5" y="4" width="3" height="7" rx="1"/><rect x="9" y="2" width="3" height="9" rx="1"/><rect x="13.5" y="0" width="3" height="11" rx="1"/></svg>
          <svg width="24" height="11" viewBox="0 0 24 11"><rect x="0" y="0" width="21" height="11" rx="3" fill="none" stroke="currentColor"/><rect x="2" y="2" width="14" height="7" rx="1.5" fill="currentColor"/><path d="M23 3v5" stroke="currentColor" stroke-width="1.4"/></svg>
        </span>
      </div>

      <div class="viewport">
        <ScreenSplash />
        <ScreenWelcome />
        <ScreenLogin />
        <ScreenInterests />
        <ScreenHome />
        <ScreenPost />
        <ScreenProfile />
        <ScreenDiscover />
        <ScreenSearch />
        <ScreenMerchant />
        <ScreenPlace />
        <ScreenBenefits />
        <ScreenCardApply />
        <ScreenCardDetail />
        <ScreenTopup />
        <ScreenWallet />
        <ScreenTransactions />
        <ScreenReimburse />
        <ScreenReimburseDetail />
        <ScreenWithdraw />
        <ScreenReferral />
        <ScreenCreator />
        <ScreenMe />
        <ScreenSettings />
        <ScreenLanguage />
        <ScreenSecurity />
        <ScreenKyc />
        <ScreenNotifications />
      </div>

      <nav class="tabbar" v-show="isRoot">
        <button class="tab" :class="{ on: app.screen === 'home' }" @click="show('home')"><svg class="ic"><use href="#i-home"/></svg>首页</button>
        <button class="tab" :class="{ on: app.screen === 'discover' }" @click="show('discover')"><svg class="ic"><use href="#i-compass"/></svg>发现</button>
        <button class="tab-plus" aria-label="发布" @click="openSheet('composer')"><svg class="ic"><use href="#i-plus"/></svg></button>
        <button class="tab" :class="{ on: app.screen === 'benefits' }" @click="show('benefits')"><svg class="ic"><use href="#i-card"/></svg>权益</button>
        <button class="tab" :class="{ on: app.screen === 'me' }" @click="show('me')"><svg class="ic"><use href="#i-user"/></svg>我的</button>
      </nav>

      <div class="veil" :class="{ on: veilOn }" @click="veilClick"></div>

      <ComposerSheet />
      <CommentsSheet />

      <div class="dialog" :class="{ on: !!app.dialog }" role="alertdialog">
        <b style="font-size:16px">{{ app.dialog?.title }}</b>
        <p style="color:var(--muted);font-size:14px;margin-top:8px">{{ app.dialog?.text }}</p>
        <div class="row" style="margin-top:18px;gap:10px">
          <button class="btn btn-o" @click="closeDialog()">取消</button>
          <button class="btn btn-p" @click="dialogOk()">确认</button>
        </div>
      </div>

      <div class="toast" :class="{ on: app.toastOn }" role="status">{{ app.toast }}</div>

      <IconSprite />
    </div>
  </div>
</template>
