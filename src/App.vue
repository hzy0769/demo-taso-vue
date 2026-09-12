<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { app, ROOTS, show, openSheet, closeSheets, closeDialog, dialogOk, bootstrap, overlayFocusIn, overlayFocusOut } from './store'
import { t, prefs } from './i18n'
import { pay, walletCancel, closePicker } from './pay'
import IconSprite from './components/IconSprite.vue'
import ComposerSheet from './components/ComposerSheet.vue'
import CommentsSheet from './components/CommentsSheet.vue'
import AddFriendSheet from './components/AddFriendSheet.vue'
import PostMoreSheet from './components/PostMoreSheet.vue'
import PaymentPickerSheet from './components/PaymentPickerSheet.vue'
import WalletPaySheet from './components/WalletPaySheet.vue'

import ScreenSplash from './screens/ScreenSplash.vue'
import ScreenWelcome from './screens/ScreenWelcome.vue'
import ScreenLogin from './screens/ScreenLogin.vue'
import ScreenAuthOauth from './screens/ScreenAuthOauth.vue'
import ScreenAuthEntry from './screens/ScreenAuthEntry.vue'
import ScreenAuthOtp from './screens/ScreenAuthOtp.vue'
import ScreenAuthError from './screens/ScreenAuthError.vue'
import ScreenAuthNickname from './screens/ScreenAuthNickname.vue'
import ScreenInterests from './screens/ScreenInterests.vue'
import ScreenHome from './screens/ScreenHome.vue'
import ScreenPost from './screens/ScreenPost.vue'
import ScreenProfile from './screens/ScreenProfile.vue'
import ScreenDiscover from './screens/ScreenDiscover.vue'
import ScreenSearch from './screens/ScreenSearch.vue'
import ScreenMerchant from './screens/ScreenMerchant.vue'
import ScreenPlace from './screens/ScreenPlace.vue'
import ScreenBenefits from './screens/ScreenBenefits.vue'
import ScreenMyCard from './screens/ScreenMyCard.vue'
import ScreenCardApply from './screens/ScreenCardApply.vue'
import ScreenCardAddress from './screens/ScreenCardAddress.vue'
import ScreenCardCountry from './screens/ScreenCardCountry.vue'
import ScreenCardShipping from './screens/ScreenCardShipping.vue'
import ScreenCardReview from './screens/ScreenCardReview.vue'
import ScreenCardSuccess from './screens/ScreenCardSuccess.vue'
import ScreenCardTracking from './screens/ScreenCardTracking.vue'
import ScreenCardDetail from './screens/ScreenCardDetail.vue'
import ScreenTopup from './screens/ScreenTopup.vue'
import ScreenPayCard from './screens/ScreenPayCard.vue'
import ScreenPayCrypto from './screens/ScreenPayCrypto.vue'
import ScreenWallet from './screens/ScreenWallet.vue'
import ScreenDividend from './screens/ScreenDividend.vue'
import ScreenTransactions from './screens/ScreenTransactions.vue'
import ScreenWalletTransactions from './screens/ScreenWalletTransactions.vue'
import ScreenReimburse from './screens/ScreenReimburse.vue'
import ScreenReimburseDetail from './screens/ScreenReimburseDetail.vue'
import ScreenWithdraw from './screens/ScreenWithdraw.vue'
import ScreenReferral from './screens/ScreenReferral.vue'
import ScreenReferralRules from './screens/ScreenReferralRules.vue'
import ScreenCreator from './screens/ScreenCreator.vue'
import ScreenMe from './screens/ScreenMe.vue'
import ScreenSettings from './screens/ScreenSettings.vue'
import ScreenLanguage from './screens/ScreenLanguage.vue'
import ScreenContentRegion from './screens/ScreenContentRegion.vue'
import ScreenSecurity from './screens/ScreenSecurity.vue'
import ScreenKyc from './screens/ScreenKyc.vue'
import ScreenNotifications from './screens/ScreenNotifications.vue'
import ScreenMyPosts from './screens/ScreenMyPosts.vue'
import ScreenMySaves from './screens/ScreenMySaves.vue'
import ScreenMyFollows from './screens/ScreenMyFollows.vue'
import ScreenMyHistory from './screens/ScreenMyHistory.vue'
import ScreenFriends from './screens/ScreenFriends.vue'
import ScreenMessages from './screens/ScreenMessages.vue'
import ScreenChat from './screens/ScreenChat.vue'
import ScreenMyQrcode from './screens/ScreenMyQrcode.vue'
import ScreenAccount from './screens/ScreenAccount.vue'
import ScreenAuthMethods from './screens/ScreenAuthMethods.vue'
import ScreenAuthSessions from './screens/ScreenAuthSessions.vue'
import ScreenAuthDelete from './screens/ScreenAuthDelete.vue'

const clock = ref('9:41')
function tick() {
  const d = new Date()
  clock.value = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0')
}

const isRoot = computed(() => ROOTS.includes(app.screen))
const veilOn = computed(() => !!app.sheet || !!app.dialog)
/** 任意弹层打开时背景内容 inert(评审 §6.4:弹层打开后只有其中内容可被聚焦) */
const overlayOn = computed(() => veilOn.value || pay.pickerOpen || !!pay.wallet)

function veilClick() {
  closeSheets()
  closeDialog()
}

/** Escape 逐层关闭:对话框 → 钱包支付单 → 支付方式选择 → 内容弹层 */
function onKeydown(e: KeyboardEvent) {
  if (e.key !== 'Escape') return
  if (app.dialog) closeDialog()
  else if (pay.wallet && pay.wallet.phase === 'review') walletCancel()
  else if (pay.pickerOpen) closePicker()
  else if (app.sheet) closeSheets()
}

/** 对话框焦点管理:打开进入、关闭复位(评审 §6.4) */
const dialogEl = ref<HTMLElement | null>(null)
watch(() => app.dialog, on => {
  if (on) overlayFocusIn(dialogEl.value)
  else overlayFocusOut(dialogEl.value)
})

onMounted(() => {
  tick()
  setInterval(tick, 30000)
  window.addEventListener('keydown', onKeydown)
  bootstrap()
})
</script>

<template>
  <div class="stage">
    <div class="phone" :lang="prefs.uiLocale" :dir="prefs.uiLocale.startsWith('he') || prefs.uiLocale.startsWith('ar') ? 'rtl' : 'ltr'">
      <div class="statusbar">
        <span>{{ clock }}</span>
        <span class="sb-icons">
          <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor"><rect x="0" y="6" width="3" height="5" rx="1"/><rect x="4.5" y="4" width="3" height="7" rx="1"/><rect x="9" y="2" width="3" height="9" rx="1"/><rect x="13.5" y="0" width="3" height="11" rx="1"/></svg>
          <svg width="24" height="11" viewBox="0 0 24 11"><rect x="0" y="0" width="21" height="11" rx="3" fill="none" stroke="currentColor"/><rect x="2" y="2" width="14" height="7" rx="1.5" fill="currentColor"/><path d="M23 3v5" stroke="currentColor" stroke-width="1.4"/></svg>
        </span>
      </div>

      <div class="viewport" :inert="overlayOn">
        <ScreenSplash />
        <ScreenWelcome />
        <ScreenLogin />
        <ScreenAuthOauth />
        <ScreenAuthEntry />
        <ScreenAuthOtp />
        <ScreenAuthError />
        <ScreenAuthNickname />
        <ScreenInterests />
        <ScreenHome />
        <ScreenPost />
        <ScreenProfile />
        <ScreenDiscover />
        <ScreenSearch />
        <ScreenMerchant />
        <ScreenPlace />
        <ScreenBenefits />
        <ScreenMyCard />
        <ScreenCardApply />
        <ScreenCardAddress />
        <ScreenCardCountry />
        <ScreenCardShipping />
        <ScreenCardReview />
        <ScreenCardSuccess />
        <ScreenCardTracking />
        <ScreenCardDetail />
        <ScreenTopup />
        <ScreenPayCard />
        <ScreenPayCrypto />
        <ScreenWallet />
        <ScreenDividend />
        <ScreenTransactions />
        <ScreenWalletTransactions />
        <ScreenReimburse />
        <ScreenReimburseDetail />
        <ScreenWithdraw />
        <ScreenReferral />
        <ScreenReferralRules />
        <ScreenCreator />
        <ScreenMe />
        <ScreenSettings />
        <ScreenLanguage />
        <ScreenContentRegion />
        <ScreenSecurity />
        <ScreenKyc />
        <ScreenNotifications />
        <ScreenMyPosts />
        <ScreenMySaves />
        <ScreenMyFollows />
        <ScreenMyHistory />
        <ScreenFriends />
        <ScreenMessages />
        <ScreenChat />
        <ScreenMyQrcode />
        <ScreenAccount />
        <ScreenAuthMethods />
        <ScreenAuthSessions />
        <ScreenAuthDelete />
      </div>

      <nav class="tabbar" v-show="isRoot" :inert="overlayOn">
        <button class="tab" :class="{ on: app.screen === 'home' }" @click="show('home')"><svg class="ic"><use href="#i-home"/></svg>{{ t('nav.home') }}</button>
        <button class="tab" :class="{ on: app.screen === 'discover' }" @click="show('discover')"><svg class="ic"><use href="#i-compass"/></svg>{{ t('nav.discover') }}</button>
        <button class="tab-plus" :aria-label="t('nav.post')" @click="openSheet('composer')"><svg class="ic"><use href="#i-plus"/></svg></button>
        <button class="tab" :class="{ on: app.screen === 'benefits' }" @click="show('benefits')"><svg class="ic"><use href="#i-card"/></svg>{{ t('nav.benefits') }}</button>
        <button class="tab" :class="{ on: app.screen === 'me' }" @click="show('me')"><svg class="ic"><use href="#i-user"/></svg>{{ t('nav.me') }}</button>
      </nav>

      <div class="veil" :class="{ on: veilOn }" @click="veilClick"></div>

      <ComposerSheet />
      <CommentsSheet />
      <AddFriendSheet />
      <PostMoreSheet />

      <PaymentPickerSheet />
      <WalletPaySheet />

      <div
        ref="dialogEl"
        class="dialog" :class="{ on: !!app.dialog }"
        :inert="!app.dialog"
        role="alertdialog" aria-modal="true" :aria-label="app.dialog?.title ?? t('common.ok')"
        tabindex="-1"
      >
        <b style="font-size:16px">{{ app.dialog?.title }}</b>
        <p style="color:var(--muted);font-size:14px;margin-top:8px;white-space:pre-line">{{ app.dialog?.text }}</p>
        <div class="row" style="margin-top:18px;gap:10px">
          <button class="btn btn-o" @click="closeDialog()">{{ t('common.cancel') }}</button>
          <button class="btn btn-p" @click="dialogOk()">{{ app.dialog?.okText ?? t('common.ok') }}</button>
        </div>
      </div>

      <div class="toast" :class="{ on: app.toastOn }" role="status">{{ app.toast }}</div>

      <IconSprite />
    </div>
  </div>
</template>
