<script setup lang="ts">
import { computed } from 'vue'
import { app, back, toast } from '../store'
import { pay, CRYPTO_NETS, chooseCryptoNet, cryptoAddress, cryptoSent, finishCrypto, netOf } from '../pay'
import { prefs, t } from '../i18n'
import PageHeader from '../components/PageHeader.vue'
import PseudoQr from '../components/PseudoQr.vue'

/**
 * USDT / USDC 支付(Kraken / Crypto.com 入金模式):
 * ① 选网络(费用与到账提示、推荐标记)→ ② 地址 + 二维码 + 复制 + 网络警示
 * → ③ 等待区块确认(演示:定时递增)→ ④ 到账完成。
 * 确认期间锁定返回,避免申请单在支付未完成时丢失。
 */

const req = computed(() => pay.cryptoReq)
const step = computed(() => req.value?.step ?? 'network')
const net = computed(() => netOf(req.value?.network ?? ''))
const address = computed(() => (req.value ? cryptoAddress() : ''))
const assetName = computed(() => (req.value?.asset === 'usdt' ? 'USDT' : 'USDC'))

/** 代币金额:稳定币按 ≈US$1:1 结算,直接以 USD 金额展示为代币数量 */
const tokenAmount = computed(() => {
  const n = req.value?.amountUSD ?? 0
  return `${n.toLocaleString(prefs.uiLocale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${assetName.value}`
})

const locked = computed(() => step.value === 'pending' || step.value === 'done')

function copyAddress() {
  const a = address.value
  if (!a) return
  navigator.clipboard?.writeText(a)
    .then(() => toast(t('pay.crypto.copied')))
    .catch(() => toast(a))
}

/** 到账完成:充值场景回到充值页展示成功态;卡申请场景由 onSuccess 跳转 card-success */
function doneFlow() {
  const purpose = req.value?.purpose
  finishCrypto()
  if (purpose === 'topup') back()
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'pay-crypto' }" data-screen="pay-crypto">
    <PageHeader :title="t('pay.crypto.title', { asset: assetName })" :back-btn="!locked" />

    <div v-if="req" style="margin-top:8px">
      <!-- ① 选择网络 -->
      <template v-if="step === 'network'">
        <p class="meta" style="margin:2px 2px 10px">{{ t('pay.crypto.step1') }}</p>
        <button
          v-for="n in CRYPTO_NETS" :key="n.id"
          class="opt" :class="{ on: req.network === n.id }"
          @click="chooseCryptoNet(n.id)"
        >
          <span class="dot"></span>
          <span style="flex:1;min-width:0">
            <span class="row" style="gap:8px">
              <span class="net-chip" :class="n.id.toLowerCase()">{{ n.id }}</span>
              <b style="font-size:14px">{{ n.label }}</b>
              <span v-if="n.recommended" class="badge ok">{{ t('pay.crypto.recommended') }}</span>
            </span>
            <span class="li-sub" style="display:block;margin-top:3px">{{ t(n.subKey) }}</span>
          </span>
        </button>
        <div class="alertbar" style="margin-top:14px">
          <svg class="ic sm" style="margin-top:2px"><use href="#i-alert"/></svg>
          <span>{{ t('pay.crypto.netWarn') }}</span>
        </div>
      </template>

      <!-- ② 转账信息 -->
      <template v-else-if="step === 'transfer'">
        <p class="meta" style="margin:2px 2px 10px">{{ t('pay.crypto.step2') }}</p>
        <div class="card" style="display:flex;flex-direction:column;align-items:center;padding:18px 14px">
          <div class="row-b" style="width:100%">
            <span class="k" style="font-size:13px;color:var(--muted)">{{ t('pay.crypto.payAmount') }}</span>
            <span class="badge soft">{{ net.label }}</span>
          </div>
          <b class="num" style="font-size:22px;margin-top:4px">{{ tokenAmount }}</b>
          <p class="meta" style="margin-top:4px">{{ t('pay.crypto.rateNote', { asset: assetName }) }}</p>

          <div class="qr-frame">
            <PseudoQr :seed="address" :size="164" />
          </div>

          <span class="k" style="font-size:12px;color:var(--muted);align-self:flex-start">{{ t('pay.crypto.address') }}</span>
          <p class="num crypto-addr">{{ address }}</p>
          <button class="btn btn-o" style="margin-top:8px" @click="copyAddress">
            <svg class="ic sm"><use href="#i-copy"/></svg>{{ t('pay.crypto.copy') }}
          </button>
        </div>

        <div class="alertbar" style="margin-top:14px">
          <svg class="ic sm" style="margin-top:2px"><use href="#i-alert"/></svg>
          <span>{{ t('pay.crypto.warn', { asset: assetName, network: net.label }) }}</span>
        </div>

        <button class="btn btn-p" style="margin-top:18px" @click="cryptoSent">{{ t('pay.crypto.sent') }}</button>
        <p class="meta" style="margin-top:12px">{{ t('pay.crypto.arrivalNote') }}</p>
      </template>

      <!-- ③ 等待区块确认 -->
      <template v-else-if="step === 'pending'">
        <div class="card" style="display:flex;flex-direction:column;align-items:center;padding:26px 16px;text-align:center">
          <span class="net-pulse" :class="req.network.toLowerCase()">
            <svg class="ic" style="width:28px;height:28px"><use href="#i-refresh"/></svg>
          </span>
          <b style="font-size:16px;margin-top:14px">{{ t('pay.crypto.pending', { asset: assetName }) }}</b>
          <p class="num meta" style="margin-top:6px">{{ t('pay.crypto.confs', { n: req.confs, max: net.confs }) }}</p>
          <div class="prog" style="width:100%;margin-top:14px"><i :style="{ width: `${Math.min(100, req.confs / net.confs * 100)}%` }"></i></div>
          <p class="meta" style="margin-top:10px">{{ t('pay.crypto.eta') }}</p>
          <p class="meta" style="margin-top:14px;word-break:break-all">{{ t('pay.crypto.txid') }} · {{ req.txid }}</p>
        </div>
      </template>

      <!-- ④ 到账 -->
      <template v-else>
        <div class="card" style="display:flex;flex-direction:column;align-items:center;padding:26px 16px;text-align:center">
          <span style="width:76px;height:76px;border-radius:50%;background:var(--ok-soft);display:grid;place-items:center">
            <svg class="ic" style="width:36px;height:36px;color:var(--ok);stroke-width:2.4"><use href="#i-check"/></svg>
          </span>
          <b style="font-size:16px;margin-top:14px">{{ t('pay.crypto.done', { asset: assetName }) }}</b>
          <b class="num" style="font-size:20px;margin-top:4px">{{ tokenAmount }}</b>
        </div>
        <button class="btn btn-p" style="margin-top:18px" @click="doneFlow">{{ t('common.done') }}</button>
      </template>
    </div>

    <div v-else class="card" style="margin-top:20px;text-align:center">
      <p style="font-size:14px;color:var(--muted)">{{ t('pay.noRequest') }}</p>
      <button class="btn btn-o" style="margin-top:14px" @click="back()">{{ t('common.back') }}</button>
    </div>
  </section>
</template>
