<script setup lang="ts">
import { computed } from 'vue'
import { app } from '../store'
import { t } from '../i18n'
import { DEMO_MARKET, marketCapabilities, type FeatureId } from '../capability'
import PageHeader from '../components/PageHeader.vue'

/**
 * KYC 与账户能力(评审 §3.1 映射表):
 * - 状态从单一「已通过」扩展为 未开始 / 审核中 / 通过 / 需补件 / 受地区限制 五态演示;
 * - 解锁能力读取市场能力矩阵(账户国家 + KYC),不由 UI 语言或内容地区推导(§10.1)。
 */
const STATES = [
  { k: 'none', icon: '#i-user' },
  { k: 'review', icon: '#i-refresh' },
  { k: 'ok', icon: '#i-check' },
  { k: 'resubmit', icon: '#i-alert' },
  { k: 'restricted', icon: '#i-block' },
] as const

const DEMO_STATE = 'ok'

/** 能力矩阵演示行:本演示账号 KYC 地区为香港 */
const FEATURE_ICONS: Record<FeatureId, string> = {
  card: '#i-card', topup: '#i-wallet', withdraw: '#i-receipt',
  crypto: '#i-wallet', referral: '#i-gift', dividend: '#i-star',
}
const features = computed(() => {
  const caps = marketCapabilities(DEMO_MARKET)
  return (Object.keys(FEATURE_ICONS) as FeatureId[]).map(id => ({
    id,
    icon: FEATURE_ICONS[id],
    label: t(`kyc.feature.${id}`),
    state: caps[id],
  }))
})
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'kyc' }" data-screen="kyc">
    <PageHeader :title="t('kyc.title')" />
    <div class="card" style="margin-top:8px;text-align:center;padding:22px 16px">
      <div class="badge ok" style="font-size:13px;justify-content:center"><svg class="ic sm"><use href="#i-check"/></svg>{{ t('kyc.statusLabel') }}</div>
      <div class="row-b" style="margin-top:16px;text-align:left"><span class="meta">{{ t('kyc.name') }}</span><b>******</b></div>
      <div class="row-b" style="margin-top:10px;text-align:left"><span class="meta">{{ t('kyc.region') }}</span><b>Hong Kong</b></div>
    </div>

    <!-- 状态五态示例(评审 §3.1:KYC 状态机演示;当前演示账号为「通过」) -->
    <div class="card" style="margin-top:14px;padding:12px 14px">
      <div class="row-b" style="margin-bottom:6px">
        <b style="font-size:13px">{{ t('kyc.stateTitle') }}</b>
        <span class="badge soft">{{ t('demo.tag') }}</span>
      </div>
      <div v-for="s in STATES" :key="s.k" class="kv">
        <span class="k">
          <svg class="ic sm" :style="s.k === 'ok' ? 'color:var(--ok)' : 'color:var(--muted)'"><use :href="s.icon"/></svg>
          {{ t(`kyc.state.${s.k}`) }}
        </span>
        <span v-if="s.k === DEMO_STATE" class="badge ok">{{ t('kyc.state.current') }}</span>
      </div>
    </div>

    <!-- 能力矩阵:同一矩阵驱动入口、深链与客服话术(评审 §3.1) -->
    <div class="card" style="margin-top:14px;padding:12px 14px">
      <div class="row-b" style="margin-bottom:6px">
        <b style="font-size:13px">{{ t('kyc.matrixTitle') }}</b>
        <span class="badge soft">HK · Demo</span>
      </div>
      <div v-for="f in features" :key="f.id" class="kv">
        <span class="k"><svg class="ic sm"><use :href="f.icon"/></svg>{{ f.label }}</span>
        <span class="v">
          <span v-if="f.state === 'available'" class="badge ok">{{ t('capability.availableShort') }}</span>
          <span v-else-if="f.state === 'kycRequired'" class="badge warn">{{ t('capability.kycRequiredShort') }}</span>
          <span v-else class="badge warn">{{ t('capability.regionLockedShort') }}</span>
        </span>
      </div>
      <p class="meta" style="margin-top:8px">{{ t('kyc.matrixNote') }}</p>
    </div>
    <p class="meta" style="margin-top:12px">{{ t('kyc.note') }}</p>
  </section>
</template>
