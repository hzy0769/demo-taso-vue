<script setup lang="ts">
import { computed, ref } from 'vue'
import { app, showDialog, save, toast, fmt } from '../store'
import PageHeader from '../components/PageHeader.vue'

type Method = 'bank' | 'usdt' | 'usdc'

const method = ref<Method>('bank')
const amt = ref('500.00')

/** 提现渠道：银行卡 / USDT 数字钱包 / USDC 数字钱包（钱包收益账户） */
const methods: { id: Method; title: string; sub: string; icon: string }[] = [
  { id: 'bank', title: '绑定银行卡', sub: '尾号 2021 · 预计 1–3 个工作日', icon: '#i-card' },
  { id: 'usdt', title: 'USDT 数字钱包', sub: 'TRC-20 · TQ5n…9Kx2', icon: '#i-wallet' },
  { id: 'usdc', title: 'USDC 数字钱包', sub: 'ERC-20 · 0x4f2…8Ac1', icon: '#i-wallet' },
]

const parsed = computed(() => parseFloat(amt.value.replace(/,/g, '')) || 0)

const feeText = computed(() =>
  method.value === 'bank' ? 'US$ 8.00' : '通道费 1%（以合作通道实际费率为准）',
)

function confirm() {
  if (!parsed.value || parsed.value <= 0) {
    toast('请输入有效金额')
    return
  }
  if (parsed.value > app.wd) {
    toast('超过可提现余额')
    return
  }
  const name = methods.find(m => m.id === method.value)?.title ?? ''
  showDialog('确认提现', `提现 US$${fmt(parsed.value)} 至${name}，手续费按页面展示为准。确认后进入审核，到账时间以渠道为准。`, () => {
    app.wd -= parsed.value
    save()
    toast('提现申请已提交')
  })
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'withdraw' }" data-screen="withdraw">
    <PageHeader title="提现" />
    <div class="card" style="margin-top:8px">
      <div class="row-b">
        <div>
          <div class="meta">可提现余额（钱包）</div>
          <div class="num" style="font-size:28px;font-weight:700">US$ {{ fmt(app.wd) }}</div>
        </div>
        <span class="badge soft">收益账户</span>
      </div>
      <p class="meta" style="margin-top:8px">仅钱包收益可提现；会员卡余额为独立账户，不可提现。</p>
    </div>
    <div class="field" style="margin-top:16px">
      <label>提现至</label>
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
      <label>金额</label>
      <input v-model="amt" class="input num" inputmode="decimal" />
    </div>
    <div class="card" style="margin-top:16px">
      <div class="kv"><span class="k">手续费</span><span class="v num">{{ feeText }}</span></div>
      <div class="kv"><span class="k">到账时间</span><span class="v">{{ method === 'bank' ? '预计 1–3 个工作日' : '链上到账，以网络确认时间为准' }}</span></div>
    </div>
    <p class="meta" style="margin-top:12px">首次提现需完成实名验证；新绑定银行卡/钱包地址有冷却期；数字资产提现仅在合规合作架构下开放，并接受链上风险筛查。</p>
    <button class="btn btn-p" style="margin-top:20px" @click="confirm">提交提现</button>
  </section>
</template>
