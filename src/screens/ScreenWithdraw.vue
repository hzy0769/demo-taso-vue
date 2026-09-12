<script setup lang="ts">
import { computed, ref } from 'vue'
import { app, showDialog, save, toast } from '../store'
import { t } from '../i18n'
import { fmtMoney } from '../i18n/format'
import PageHeader from '../components/PageHeader.vue'

type Method = 'bank' | 'usdt' | 'usdc'

const method = ref<Method>('bank')
const amt = ref('500.00')

const USD = (n: number) => fmtMoney({ amount: n, currency: 'USD' })

/** 提现渠道:银行卡 / USDT 数字钱包 / USDC 数字钱包(钱包收益账户) */
const methods = computed(() => ([
  { id: 'bank' as Method, title: t('withdraw.bank'), sub: t('withdraw.bankSub', { last4: '2021', a: 1, b: 3 }), icon: '#i-card' },
  { id: 'usdt' as Method, title: t('withdraw.usdt'), sub: t('withdraw.usdtSub', { addr: 'TQ5n…9Kx2' }), icon: '#i-wallet' },
  { id: 'usdc' as Method, title: t('withdraw.usdc'), sub: t('withdraw.usdcSub', { addr: '0x4f2…8Ac1' }), icon: '#i-wallet' },
]))

const parsed = computed(() => parseFloat(amt.value.replace(/,/g, '')) || 0)

const feeText = computed(() =>
  method.value === 'bank' ? t('withdraw.feeBank', { amount: USD(8) }) : t('withdraw.feeCrypto'),
)
const arrivalText = computed(() =>
  method.value === 'bank' ? t('withdraw.arrivalBank', { a: 1, b: 3 }) : t('withdraw.arrivalCrypto'),
)

function confirm() {
  if (!parsed.value || parsed.value <= 0) {
    toast(t('withdraw.invalid'))
    return
  }
  if (parsed.value > app.wd) {
    toast(t('withdraw.overBalance'))
    return
  }
  const name = methods.value.find(m => m.id === method.value)?.title ?? ''
  showDialog(t('withdraw.confirmTitle'), t('withdraw.confirmBody', { amount: USD(parsed.value), name }), () => {
    app.wd -= parsed.value
    save()
    toast(t('withdraw.submitted'))
  })
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'withdraw' }" data-screen="withdraw">
    <PageHeader :title="t('withdraw.title')" />
    <!-- 能力矩阵示例(评审 §3.2:提现渠道按账户地区/KYC 开放;原型全量展示) -->
    <div class="demo-bar" role="note">
      <svg class="ic sm" style="flex:none;margin-top:1px"><use href="#i-alert"/></svg>
      <span>{{ t('withdraw.demoBanner') }}</span>
    </div>
    <div class="card" style="margin-top:8px">
      <div class="row-b">
        <div>
          <div class="meta">{{ t('withdraw.available') }}</div>
          <div class="num" style="font-size:28px;font-weight:700">{{ USD(app.wd) }}</div>
        </div>
        <span class="badge soft">{{ t('wallet.accountBadge') }}</span>
      </div>
      <p class="meta" style="margin-top:8px">{{ t('withdraw.note') }}</p>
    </div>
    <div class="field" style="margin-top:16px">
      <label>{{ t('withdraw.to') }}</label>
      <div class="card" style="padding:6px 14px">
        <button v-for="m in methods" :key="m.id" class="li" style="border:0" @click="method = m.id">
          <span class="li-ic"><svg class="ic"><use :href="m.icon"/></svg></span>
          <span style="flex:1;text-align:left">
            <span class="li-title" style="display:block">{{ m.title }}</span>
            <span class="li-sub" style="display:block">{{ m.sub }}</span>
          </span>
          <svg class="ic" :style="method === m.id ? 'color:var(--fg)' : 'color:var(--muted)'"><use href="#i-check"/></svg>
        </button>
      </div>
    </div>
    <div class="field" style="margin-top:16px">
      <label>{{ t('withdraw.amount') }}</label>
      <input v-model="amt" class="input num" inputmode="decimal" />
    </div>
    <div class="card" style="margin-top:16px">
      <div class="kv"><span class="k">{{ t('withdraw.feeLabel') }}</span><span class="v num">{{ feeText }}</span></div>
      <div class="kv"><span class="k">{{ t('withdraw.arrival') }}</span><span class="v">{{ arrivalText }}</span></div>
    </div>
    <p class="meta" style="margin-top:12px">{{ t('withdraw.complianceNote') }}</p>
    <button class="btn btn-p" style="margin-top:20px" @click="confirm">{{ t('withdraw.btn') }}</button>
  </section>
</template>
