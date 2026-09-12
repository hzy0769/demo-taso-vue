<script setup lang="ts">
import { computed, ref } from 'vue'
import { app, back, toast } from '../store'
import { pay, cardBrand, cardOk, cardLast4, fmtCardNumber, fmtExp, markPaid } from '../pay'
import { t } from '../i18n'
import PageHeader from '../components/PageHeader.vue'

/** 银行卡支付(卡号/有效期/安全码 + 实时格式化与品牌识别;演示态不外发) */

const req = computed(() => pay.cardReq)
const brand = computed(() => cardBrand(pay.cardDraft.number))
const ok = computed(() => cardOk(pay.cardDraft))
const paying = ref(false)

const brandName = computed(() =>
  brand.value === 'visa' ? 'VISA' : brand.value === 'mastercard' ? 'Mastercard' : brand.value === 'amex' ? 'AmEx' : '',
)

function payNow() {
  const r = req.value
  if (!r || paying.value) return
  if (!ok.value) {
    toast(t('pay.card.errInvalid'))
    return
  }
  paying.value = true
  // 演示态:模拟收单机构处理(§31 支付按钮需有明确 Loading 状态)
  const purpose = r.purpose
  setTimeout(() => {
    paying.value = false
    markPaid('card', '', cardLast4(pay.cardDraft))
    pay.cardReq = null
    r.onSuccess()
    // 充值场景回到充值页展示成功态;卡申请场景由 onSuccess 自行跳转 card-success
    if (purpose === 'topup') back()
  }, 1200)
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'pay-card' }" data-screen="pay-card">
    <PageHeader :title="t('pay.card.title')" />
    <div v-if="req" style="margin-top:8px">
      <div class="card">
        <div v-for="(l, i) in req.lines" :key="i" class="kv">
          <span class="k">{{ l.label }}</span><span class="v num">{{ l.money }}</span>
        </div>
        <div class="kv">
          <span class="k" style="font-weight:600;color:var(--fg)">{{ t('pay.sheet.total') }}</span>
          <span class="v num" style="font-weight:700">{{ req.totalText }}</span>
        </div>
      </div>

      <div class="field" style="margin-top:16px">
        <label>{{ t('pay.card.number') }}</label>
        <div class="cardnum-wrap">
          <input
            v-model="pay.cardDraft.number" class="input num" style="padding-right:86px"
            inputmode="numeric" autocomplete="cc-number" :placeholder="t('pay.card.numberPh')"
            @input="pay.cardDraft.number = fmtCardNumber(pay.cardDraft.number)"
          />
          <span v-if="brandName" class="cardbrand" :class="brand">{{ brandName }}</span>
        </div>
      </div>
      <div class="grid-2" style="margin-top:14px">
        <div class="field">
          <label>{{ t('pay.card.exp') }}</label>
          <input
            v-model="pay.cardDraft.exp" class="input num" inputmode="numeric"
            autocomplete="cc-exp" :placeholder="t('pay.card.expPh')" maxlength="5"
            @input="pay.cardDraft.exp = fmtExp(pay.cardDraft.exp)"
          />
        </div>
        <div class="field">
          <label>{{ t('pay.card.cvc') }}</label>
          <input
            v-model="pay.cardDraft.cvc" class="input num" inputmode="numeric"
            autocomplete="cc-csc" :placeholder="t('pay.card.cvcPh')"
            :maxlength="brand === 'amex' ? 4 : 3"
            @input="pay.cardDraft.cvc = pay.cardDraft.cvc.replace(/\D/g, '')"
          />
        </div>
      </div>
      <button class="ckrow" style="margin-top:10px" @click="pay.cardDraft.save = !pay.cardDraft.save">
        <span class="ckbox" :class="{ on: pay.cardDraft.save }">
          <svg v-if="pay.cardDraft.save" class="ic sm" style="color:var(--surface)"><use href="#i-check"/></svg>
        </span>
        <span>{{ t('pay.card.save') }}</span>
      </button>

      <button class="btn btn-p" style="margin-top:18px" :disabled="!ok || paying" @click="payNow">
        <span v-if="paying" class="spin"></span>
        {{ paying ? t('pay.processing') : t('pay.payNow', { amount: req.totalText }) }}
      </button>
      <button class="btn btn-o" style="margin-top:10px" :disabled="paying" @click="back()">{{ t('common.cancel') }}</button>
      <p class="meta" style="margin-top:12px">{{ t('pay.card.note') }}</p>
    </div>

    <div v-else class="card" style="margin-top:20px;text-align:center">
      <p style="font-size:14px;color:var(--muted)">{{ t('pay.noRequest') }}</p>
      <button class="btn btn-o" style="margin-top:14px" @click="back()">{{ t('common.back') }}</button>
    </div>
  </section>
</template>
