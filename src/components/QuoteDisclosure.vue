<script setup lang="ts">
import type { Quote } from '../pay'
import { t } from '../i18n'

/**
 * 付款前固定披露(评审 §3.4):确认页、银行卡屏、加密转账步与钱包支付单
 * 复述同一份 Quote —— 币种、汇率、费用、到账、退款、收款主体、客服入口。
 */
defineProps<{ quote: Quote }>()
</script>

<template>
  <div class="quote-box">
    <div class="quote-h">
      <svg class="ic sm" aria-hidden="true"><use href="#i-alert"/></svg>
      <b>{{ t('quote.title') }}</b>
    </div>
    <div class="kv"><span class="k">{{ t('quote.priceCur') }}</span><span class="v num">{{ quote.priceCurrency }}</span></div>
    <div class="kv"><span class="k">{{ t('quote.chargeCur') }}</span><span class="v num">{{ quote.chargeCurrency }}</span></div>
    <div v-if="quote.fxNote" class="kv"><span class="k">{{ t('quote.fx') }}</span><span class="v">{{ quote.fxNote }}</span></div>
    <div class="kv"><span class="k">{{ quote.platformFee.label }}</span><span class="v num">{{ quote.platformFee.money }}</span></div>
    <div v-if="quote.networkFee" class="kv"><span class="k">{{ quote.networkFee.label }}</span><span class="v num">{{ quote.networkFee.money }}</span></div>
    <div class="kv"><span class="k">{{ quote.tax.label }}</span><span class="v num">{{ quote.tax.money }}</span></div>
    <div class="kv"><span class="k">{{ quote.arrival.label }}</span><span class="v num" style="font-weight:700">{{ quote.arrival.money }}</span></div>
    <div class="kv"><span class="k">{{ t('quote.refund') }}</span><span class="v">{{ quote.refund }}</span></div>
    <div class="kv"><span class="k">{{ t('quote.payeeLabel') }}</span><span class="v">{{ quote.payee }}</span></div>
    <div class="kv"><span class="k">{{ t('quote.supportLabel') }}</span><span class="v">{{ quote.support }}</span></div>
  </div>
</template>
