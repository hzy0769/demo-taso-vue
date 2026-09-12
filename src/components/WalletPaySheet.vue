<script setup lang="ts">
import { computed } from 'vue'
import { pay, walletAuthorize, walletCancel } from '../pay'
import { t } from '../i18n'

/**
 * 系统钱包支付单模拟弹层(参考 iOS PKPaymentSheet / Google Pay 支付单):
 * 商家、明细行、默认卡、侧边按钮双击或确认付款 → 成功勾 → 自动关闭回调。
 * Apple Pay 与 Google Pay 仅品牌头与确认按钮文案不同;挂载于手机框内。
 */

const req = computed(() => pay.wallet)
const isApple = computed(() => pay.wallet?.method === 'apple-pay')
</script>

<template>
  <div v-if="req" class="wps-veil" @click="req.phase === 'review' && walletCancel()">
    <div class="wps" role="dialog" aria-modal="true" @click.stop>
      <div class="wps-brand" :class="{ apple: isApple, google: !isApple }">
        <svg class="wps-mark" viewBox="0 0 24 24" aria-hidden="true"><use href="#logo-apple" /></svg><span>Pay</span>
      </div>

      <div class="wps-body">
        <div class="wps-row">
          <span class="wps-k">{{ t('pay.sheet.merchant') }}</span>
          <b>TASO</b>
        </div>
        <div v-for="(l, i) in req.lines" :key="i" class="wps-row">
          <span class="wps-k">{{ l.label }}</span>
          <span class="num">{{ l.money }}</span>
        </div>
        <div class="wps-row wps-total">
          <span class="wps-k">{{ t('pay.sheet.total') }}</span>
          <b class="num">{{ req.totalText }}</b>
        </div>
        <div class="wps-row">
          <span class="wps-k">{{ t('pay.sheet.card') }}</span>
          <span class="row" style="gap:8px">
            <span class="wps-chip">{{ isApple ? 'Apple Pay' : 'Google Pay' }}</span>
            <span class="num">•••• 3812</span>
          </span>
        </div>
      </div>

      <!-- 确认阶段:Apple 双击侧边按钮 / Google 确认付款 -->
      <button
        v-if="req.phase === 'review'"
        class="wps-confirm"
        @click="walletAuthorize"
      >
        <svg v-if="isApple" class="ic"><use href="#i-faceid"/></svg>
        {{ isApple ? t('pay.sheet.confirmFace') : t('pay.sheet.confirmG') }}
      </button>

      <!-- 认证中 -->
      <div v-else-if="req.phase === 'auth'" class="wps-state">
        <span class="spin"></span>
        <span style="font-size:13px;color:var(--muted)">{{ t('pay.sheet.paying') }}</span>
      </div>

      <!-- 完成 -->
      <div v-else class="wps-state">
        <span class="wps-ok"><svg class="ic" style="width:26px;height:26px;color:var(--ok);stroke-width:2.4"><use href="#i-check"/></svg></span>
        <span style="font-size:14px;font-weight:600">{{ t('pay.sheet.done') }}</span>
      </div>

      <button v-if="req.phase === 'review'" class="wps-cancel" @click="walletCancel">{{ t('common.cancel') }}</button>
    </div>
  </div>
</template>
