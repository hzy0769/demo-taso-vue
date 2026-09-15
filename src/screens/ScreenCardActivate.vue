<script setup lang="ts">
import { computed, ref } from 'vue'
import { app, save, show, toast } from '../store'
import { card, activateCard, cardPanMasked } from '../card'
import { t, prefs, FX_UPDATED_AT, currencyFlag } from '../i18n'
import { fmtMoney, fmtDate, fmtMoneyEstimate, fmtLocalDateShort } from '../i18n/format'
import {
  PAY_METHODS, pay, payMethodName, startCard, startCrypto, startWallet, lastPaidText,
  cardBrand, fmtCardNumber, hkdToUsd, HKD_USD_RATE, type PayRequest, type Quote,
} from '../pay'
import PageHeader from '../components/PageHeader.vue'
import TasoCard from '../components/TasoCard.vue'
import QuoteDisclosure from '../components/QuoteDisclosure.vue'

/**
 * 會員卡 App 內激活(V3.2 · P401B 三步):
 * ① 填寫卡號(實時分組 + 品牌識別,複用 pay.ts 銀行卡輸入輔助)
 * ② 設置卡密碼(6 位數字 × 兩次一致;僅在流程內使用,不落任何存儲)
 * ③ 首次充值(與快捷充值同口徑:HK$ 計價 + 16% 手續費 + 匯率換匯美元入賬;
 *    五種支付方式經統一支付模塊,支付成功即完成激活)。
 * 未激活態由 P401A / P401 的「激活會員卡」入口進入;入口僅在未激活時展示。
 */

type Step = 'no' | 'pin' | 'pay'
const step = ref<Step>('no')
const stepList: { k: Step; key: string }[] = [
  { k: 'no', key: 'activate.step1' },
  { k: 'pin', key: 'activate.step2' },
  { k: 'pay', key: 'activate.step3' },
]
const stepIdx = computed(() => stepList.findIndex(s => s.k === step.value))

/* ── ① 卡號 ─────────────────────────────────────────────────────────── */

const cardNo = ref('')
const brand = computed(() => cardBrand(cardNo.value))
const brandName = computed(() =>
  brand.value === 'visa' ? 'VISA' : brand.value === 'mastercard' ? 'Mastercard' : brand.value === 'amex' ? 'AmEx' : '',
)
/** 卡號格式:品牌可識別且位數正確(Visa / MC 16 位,AmEx 15 位) */
const noOk = computed(() => {
  const n = cardNo.value.replace(/\D/g, '')
  const len = brand.value === 'amex' ? 15 : brand.value ? 16 : 0
  return len > 0 && n.length === len
})
const noErr = ref(false)

/** 演示卡號一鍵填入(同登入 OTP「演示驗證碼 123456」的演示提示慣例) */
function fillDemoNo() {
  cardNo.value = '4242 4242 4242 4242'
  noErr.value = false
}

const maskedNo = computed(() => `•••• ${cardNo.value.replace(/\D/g, '').slice(-4)}`)

/* ── ② 卡密碼 ───────────────────────────────────────────────────────── */

const pin = ref('')
const pin2 = ref('')
const pinErr = ref(false)
const matchErr = ref(false)
const onlyDigits = (v: string) => v.replace(/\D/g, '').slice(0, 6)

/* ── ③ 首次充值(與 ScreenTopupFiat 同口徑)─────────────────────────── */

const amt = ref('1,000.00')
const PRESETS = [100, 500, 1000, 5000]
const FEE_RATE = 0.16

const parsed = computed(() => parseFloat(amt.value.replace(/,/g, '')) || 0)
const fee = computed(() => parsed.value * FEE_RATE)
const total = computed(() => parsed.value * (1 + FEE_RATE))
const HKD = (n: number) => fmtMoney({ amount: n, currency: 'HKD' })
const USD = (n: number) => fmtMoney({ amount: n, currency: 'USD' })

const rateText = HKD_USD_RATE.toFixed(4)
const rateTime = fmtDate(FX_UPDATED_AT)
const creditUSD = computed(() => hkdToUsd(parsed.value))

const localCurrency = computed(() => prefs.displayCurrency)
const localAmtEst = computed(() => fmtMoneyEstimate({ amount: parsed.value, currency: 'HKD' }, localCurrency.value))
const localTotalEst = computed(() => fmtMoneyEstimate({ amount: total.value, currency: 'HKD' }, localCurrency.value))

const methods = computed(() => PAY_METHODS.filter(m => m.available))
const wallets = computed(() => methods.value.filter(m => m.kind === 'wallet'))
const others = computed(() => methods.value.filter(m => m.kind !== 'wallet'))

const quote = computed<Quote>(() => ({
  priceCurrency: 'HKD',
  chargeCurrency: 'HKD',
  fxNote: t('quote.fxNote', { rate: rateText, time: rateTime }),
  platformFee: { label: t('topup.fee', { rate: 16 }), money: HKD(fee.value) },
  networkFee: undefined,
  tax: { label: t('quote.tax'), money: t('quote.taxIncluded') },
  arrival: { label: t('topup.creditAmount'), money: USD(creditUSD.value) },
  refund: t('quote.refundTopup'),
  payee: t('quote.payee'),
  support: t('quote.support'),
}))

const done = ref<{ credit: number; via: string } | null>(null)

function setPreset(n: number) {
  amt.value = `${n}.00`
}

/* ── 步驟流轉 ───────────────────────────────────────────────────────── */

function toPin() {
  if (!noOk.value) { noErr.value = true; return }
  noErr.value = false
  step.value = 'pin'
}

function toPay() {
  pinErr.value = !/^\d{6}$/.test(pin.value)
  matchErr.value = !pinErr.value && pin.value !== pin2.value
  if (pinErr.value || matchErr.value) return
  step.value = 'pay'
}

function prev() {
  if (step.value === 'pin') step.value = 'no'
  else if (step.value === 'pay') step.value = 'pin'
}

function buildRequest(): PayRequest {
  return {
    purpose: 'topup',
    lines: [
      { label: t('topup.amount'), money: HKD(parsed.value) },
      { label: t('topup.fee', { rate: 16 }), money: HKD(fee.value) },
    ],
    totalText: HKD(total.value),
    amountUSD: hkdToUsd(total.value),
    quote: quote.value,
    onSuccess: () => {
      if (!card.activation) activateCard(cardNo.value.replace(/\D/g, ''))
      app.bal += creditUSD.value
      save()
      toast(t('activate.successToast'))
      done.value = { credit: creditUSD.value, via: lastPaidText() }
    },
  }
}

function valid() {
  if (!parsed.value || parsed.value <= 0) {
    toast(t('topup.invalid'))
    return false
  }
  return true
}

function expressPay(m: 'apple-pay' | 'google-pay') {
  if (!valid()) return
  pay.method = m
  startWallet(m, buildRequest())
}

function payNow() {
  if (!valid()) return
  const m = pay.method
  const req = buildRequest()
  if (m === 'apple-pay' || m === 'google-pay') startWallet(m as 'apple-pay' | 'google-pay', req)
  else if (m === 'usdt' || m === 'usdc') { startCrypto(m, req); show('pay-crypto') }
  else { startCard(req); show('pay-card') }
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'card-activate' }" data-screen="card-activate">
    <PageHeader :title="t('activate.title')" />

    <template v-if="!done">
      <!-- 三步進度(chips:當前高亮,已完成帶勾) -->
      <div class="chips steps" style="margin-top:6px">
        <span
          v-for="(s, i) in stepList" :key="s.k"
          class="chip gold" :class="{ on: stepIdx >= i }"
          :aria-current="stepIdx === i ? 'step' : undefined"
        >
          <svg v-if="stepIdx > i" class="ic sm" style="color:inherit"><use href="#i-check"/></svg>
          <span v-else class="num">{{ i + 1 }}</span>
          {{ t(s.key) }}
        </span>
      </div>

      <!-- ① 填寫卡號 -->
      <template v-if="step === 'no'">
        <p class="meta" style="margin:12px 2px 0">{{ t('activate.intro') }}</p>
        <div class="card" style="margin-top:12px">
          <div class="field">
            <label>{{ t('activate.cardNoLabel') }}</label>
            <div class="cardnum-wrap">
              <input
                v-model="cardNo" class="input num" :class="{ err: noErr }" style="padding-right:86px"
                inputmode="numeric" autocomplete="off" :placeholder="t('activate.cardNoPh')"
                @input="cardNo = fmtCardNumber(cardNo); noErr = false"
              />
              <span v-if="brandName" class="cardbrand" :class="brand">{{ brandName }}</span>
            </div>
            <p v-if="noErr" class="ferr">{{ t('activate.cardNoErr') }}</p>
            <p class="meta" style="margin-top:10px">{{ t('activate.cardNoNote') }}</p>
            <div style="margin-top:10px">
              <span
                class="badge soft" role="button" tabindex="0" style="cursor:pointer"
                :aria-label="t('activate.demoCardNo')"
                @click="fillDemoNo" @keydown.enter="fillDemoNo"
              >{{ t('activate.demoCardNo') }}</span>
            </div>
          </div>
        </div>
        <button class="btn btn-p" style="margin-top:16px" @click="toPin">{{ t('activate.next') }}</button>
      </template>

      <!-- ② 設置卡密碼 -->
      <template v-else-if="step === 'pin'">
        <div class="row-b" style="margin:12px 2px 0;padding:0 2px">
          <span class="meta">{{ t('activate.cardNoLabel') }}</span>
          <span class="row" style="gap:8px">
            <span v-if="brandName" class="badge soft">{{ brandName }}</span>
            <b class="num" style="font-size:15px">{{ maskedNo }}</b>
          </span>
        </div>
        <div class="card" style="margin-top:12px">
          <div class="field">
            <label>{{ t('activate.pinLabel') }}</label>
            <input
              v-model="pin" class="input num" :class="{ err: pinErr || matchErr }"
              type="password" inputmode="numeric" maxlength="6" autocomplete="off" :placeholder="t('activate.pinPh')"
              @input="pin = onlyDigits(pin); pinErr = false; matchErr = false"
            />
            <p v-if="pinErr" class="ferr">{{ t('activate.pinErr') }}</p>
          </div>
          <div class="field" style="margin-top:14px">
            <label>{{ t('activate.pinConfirmLabel') }}</label>
            <input
              v-model="pin2" class="input num" :class="{ err: matchErr }"
              type="password" inputmode="numeric" maxlength="6" autocomplete="off" :placeholder="t('activate.pinPh')"
              @input="pin2 = onlyDigits(pin2); matchErr = false"
            />
            <p v-if="matchErr" class="ferr">{{ t('activate.pinMatchErr') }}</p>
          </div>
          <p class="meta" style="margin-top:12px">{{ t('activate.pinNote') }}</p>
        </div>
        <div class="row" style="margin-top:16px;gap:10px">
          <button class="btn btn-o" style="flex:1" @click="prev">{{ t('activate.prev') }}</button>
          <button class="btn btn-p" style="flex:1" @click="toPay">{{ t('activate.next') }}</button>
        </div>
      </template>

      <!-- ③ 首次充值(港幣計價 + 16% 手續費 + 匯率換匯美元入賬,與快捷充值同口徑) -->
      <template v-else>
        <p class="meta" style="margin:12px 2px 0">{{ t('activate.payNote') }}</p>

        <div class="amt-box">
          <div class="row-b">
            <span class="meta">{{ t('topup.amount') }}</span>
            <span class="meta" style="font-size:11px">{{ t('topup.customHint') }}</span>
          </div>
          <div class="amt-row">
            <span class="amt-cur">HK$</span>
            <input v-model="amt" class="amt-input num" inputmode="decimal" :aria-label="t('topup.amount')" />
          </div>
          <div v-if="localAmtEst" class="loc-conv">
            <span class="flag" aria-hidden="true">{{ currencyFlag(localCurrency) }}</span>
            <span class="lbl">{{ t('topup.localConv') }}</span>
            <b class="amt num">{{ localAmtEst.text }}</b>
            <span class="cur num">{{ localCurrency }}</span>
          </div>
          <div class="chips" style="margin-top:12px">
            <button v-for="p in PRESETS" :key="p" class="chip gold" :class="{ on: parsed === p }" @click="setPreset(p)">
              <span class="num">{{ p.toLocaleString(prefs.uiLocale) }}</span>
            </button>
          </div>
        </div>

        <div class="card">
          <div class="kv">
            <span class="k">
              {{ t('topup.creditAmount') }}
              <span class="meta" style="display:block;margin-top:2px;font-size:11px">{{ t('topup.creditConverted', { rate: rateText }) }}</span>
            </span>
            <span class="v num">{{ USD(creditUSD) }}</span>
          </div>
          <div class="kv"><span class="k">{{ t('topup.fee', { rate: 16 }) }}</span><span class="v num">{{ HKD(fee) }}</span></div>
          <div class="kv">
            <span class="k">
              {{ t('topup.estPay') }}
              <span v-if="localTotalEst" class="meta" style="display:block;margin-top:2px;font-size:11px">
                <span aria-hidden="true">{{ currencyFlag(localCurrency) }}</span>
                ≈ <b class="num" style="color:var(--accent-ink)">{{ localTotalEst.text }}</b> · {{ localTotalEst.rateNote }}
              </span>
            </span>
            <span class="v num" style="font-weight:700">{{ HKD(total) }}</span>
          </div>
        </div>

        <QuoteDisclosure :quote="quote" style="margin-top:10px" />

        <div class="sec-h" style="margin-top:18px"><span>{{ t('topup.payWith') }}</span></div>
        <div class="wrow" :class="{ single: wallets.length === 1 }">
          <button
            v-for="w in wallets" :key="w.id"
            class="wbtn" :aria-label="t(w.nameKey)"
            @click="expressPay(w.id as 'apple-pay' | 'google-pay')"
          >
            <svg class="wbtn-mark" viewBox="0 0 24 24" aria-hidden="true"><use :href="w.id === 'apple-pay' ? '#logo-apple' : '#logo-google'"/></svg>
            <span>Pay</span>
          </button>
        </div>

        <div class="paydiv"><span>{{ t('pay.otherWays') }}</span></div>

        <button
          v-for="m in others" :key="m.id"
          class="pm-row" :class="{ on: pay.method === m.id }"
          @click="pay.method = m.id"
        >
          <span class="pm-ic" :class="m.id">
            <svg class="ic"><use href="#i-card"/></svg>
          </span>
          <span style="flex:1;min-width:0">
            <span class="pm-name">{{ t(m.nameKey) }}</span>
            <span v-if="m.subKey" class="pm-sub">{{ t(m.subKey) }}</span>
          </span>
          <span class="ckdot" :class="{ on: pay.method === m.id }"></span>
        </button>

        <div class="paybar">
          <button class="paybar-mth" @click="payNow">
            <span class="pm-ic sm card">
              <svg class="ic"><use href="#i-card"/></svg>
            </span>
            <span class="paybar-mth-t">
              <b>{{ HKD(total) }}</b>
              <span>{{ payMethodName(pay.method) }}</span>
            </span>
          </button>
          <button class="btn btn-p paybar-btn" :disabled="!parsed" @click="payNow">{{ t('activate.payBtn') }}</button>
        </div>
      </template>
    </template>

    <!-- 激活完成 -->
    <div v-else style="display:flex;flex-direction:column;align-items:center;padding-top:24px;text-align:center">
      <span style="width:76px;height:76px;border-radius:50%;background:var(--ok-soft);display:grid;place-items:center">
        <svg class="ic" style="width:36px;height:36px;color:var(--ok);stroke-width:2.4"><use href="#i-check"/></svg>
      </span>
      <h2 style="font-size:20px;font-weight:700;margin-top:16px">{{ t('activate.successTitle') }}</h2>
      <p class="meta" style="margin-top:4px">{{ t('activate.successSub') }}</p>
      <TasoCard :pan="cardPanMasked()" style="width:100%;margin-top:16px">
        <template #top-right>
          <span class="badge ok">{{ t('mycard.activated') }}</span>
        </template>
        <div class="row-b" style="margin-top:14px">
          <span class="meta" style="color:color-mix(in oklch,var(--fg) 62%,transparent)">Alex · 09/28</span>
          <span class="visa">VISA</span>
        </div>
      </TasoCard>
      <div class="card" style="margin-top:14px;width:100%;text-align:left">
        <div class="kv"><span class="k">{{ t('activate.firstCredit') }}</span><span class="v num" style="font-weight:700">+{{ USD(done.credit) }}</span></div>
        <div class="kv"><span class="k">{{ t('pay.paidVia') }}</span><span class="v">{{ done.via }}</span></div>
        <div class="kv"><span class="k">{{ t('benefits.cardBalance') }}</span><span class="v num">{{ USD(app.bal) }}</span></div>
        <div class="kv"><span class="k">{{ t('activate.activatedOn') }}</span><span class="v num">{{ fmtLocalDateShort(card.activation?.activatedAt ?? '') }}</span></div>
      </div>
      <button class="btn btn-p" style="margin-top:20px" @click="show('my-card')">{{ t('common.done') }}</button>
    </div>
  </section>
</template>
