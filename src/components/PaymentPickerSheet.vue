<script setup lang="ts">
import { computed } from 'vue'
import { PAY_METHODS, closePicker, pay } from '../pay'
import { t } from '../i18n'

/**
 * 支付方式选择弹层(卡申请 P04 入口;充值页内联同款结构):
 * 顶部钱包快捷行 + 其余方式单选列表,选择即写回 pay.method(记住上次使用)。
 */
const methods = computed(() => PAY_METHODS.filter(m => m.available))
const wallets = computed(() => methods.value.filter(m => m.kind === 'wallet'))
const others = computed(() => methods.value.filter(m => m.kind !== 'wallet'))

function pick(id: typeof PAY_METHODS[number]['id']) {
  pay.method = id
  closePicker()
}
</script>

<template>
  <div class="paypick-veil" :class="{ on: pay.pickerOpen }" @click="closePicker">
    <div class="sheet paypick" :class="{ on: pay.pickerOpen }" role="dialog" @click.stop>
      <div class="grip"></div>
      <b style="font-size:16px">{{ t('pay.methodTitle') }}</b>

      <!-- 钱包快捷行:仅剩一个钱包时全宽 -->
      <div class="wrow" :class="{ single: wallets.length === 1 }">
        <button
          v-for="w in wallets" :key="w.id"
          class="wbtn" :class="{ on: pay.method === w.id }"
          :aria-label="t(w.nameKey)"
          @click="pick(w.id)"
        >
          <svg class="wbtn-mark" viewBox="0 0 24 24" aria-hidden="true"><use :href="w.id === 'apple-pay' ? '#logo-apple' : '#logo-google'"/></svg>
          <span>Pay</span>
          <svg v-if="pay.method === w.id" class="ic sm on-ic"><use href="#i-check"/></svg>
        </button>
      </div>

      <div class="paydiv"><span>{{ t('pay.otherWays') }}</span></div>

      <div class="pm-list">
        <button
          v-for="m in others" :key="m.id"
          class="pm-row" :class="{ on: pay.method === m.id }"
          @click="pick(m.id)"
        >
          <span class="pm-ic" :class="m.id">
            <svg v-if="m.id === 'card'" class="ic"><use href="#i-card"/></svg>
            <svg v-else-if="m.id === 'usdt'" class="pm-logo" viewBox="0 0 24 24" aria-hidden="true"><use href="#pm-usdt"/></svg>
            <svg v-else class="pm-logo" viewBox="0 0 24 24" aria-hidden="true"><use href="#pm-usdc"/></svg>
          </span>
          <span style="flex:1;min-width:0">
            <span class="pm-name">{{ t(m.nameKey) }}</span>
            <span v-if="m.subKey" class="pm-sub">{{ t(m.subKey) }}</span>
          </span>
          <span class="ckdot" :class="{ on: pay.method === m.id }"></span>
        </button>
      </div>

      <p class="meta" style="margin-top:12px">{{ t('pay.pickerNote') }}</p>
    </div>
  </div>
</template>
