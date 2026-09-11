<script setup lang="ts">
import { computed } from 'vue'
import { app, show, toast } from '../store'
import { card, etaText, isoLocalDateOf } from '../card'
import { t } from '../i18n'
import { fmtLocalDate, fmtLocalDateShort } from '../i18n/format'
import PageHeader from '../components/PageHeader.vue'

/** P06 配送追踪(全球配送 PRD §18,V1.8 取代 V1.7「申请进度」页)
 *  演示态固定停在「已发货」:申请确认 / 制卡完成 / 已发货已完成,运输中 / 已送达待更新 */

const order = computed(() => card.order)

const DONE = 3
const TOTAL = 5

const nodes = computed(() => {
  const o = order.value
  if (!o) return []
  const plus = (n: number) => fmtLocalDateShort(isoLocalDateOf(o.createdAt, n))
  return [
    { nameKey: 'card.tracking.node1', date: plus(0), state: 'done' as const, noteKey: 'card.tracking.node1Note' },
    { nameKey: 'card.tracking.node2', date: plus(1), state: 'done' as const, noteKey: 'card.tracking.node2Note' },
    { nameKey: 'card.tracking.node3', date: plus(3), state: 'done' as const, noteKey: 'card.tracking.node3Note' },
    { nameKey: 'card.tracking.node4', date: '', state: 'todo' as const, noteKey: '' },
    { nameKey: 'card.tracking.node5', date: '', state: 'todo' as const, noteKey: 'card.tracking.node5Note' },
  ]
})
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'card-tracking' }" data-screen="card-tracking">
    <PageHeader :title="t('card.tracking.title')" />

    <template v-if="order">
      <div class="card" style="margin-top:8px">
        <div class="row-b">
          <div>
            <b style="font-size:14px">{{ t('card.review.product') }}</b>
            <p class="meta" style="margin-top:2px">{{ t('card.tracking.orderSub', { id: order.id }) }} · {{ fmtLocalDate(order.createdAt) }}</p>
          </div>
          <span class="badge ok">{{ t('card.tracking.statusBadge') }}</span>
        </div>
        <div class="kv" style="margin-top:8px"><span class="k">{{ t('card.tracking.carrier') }}</span><span class="v">{{ order.carrier }}</span></div>
        <div class="kv"><span class="k">{{ t('card.tracking.trackingNo') }}</span><span class="v num">{{ order.trackingNo }}</span></div>
        <div class="kv"><span class="k">{{ t('card.tracking.eta') }}</span><span class="v num">{{ etaText(order.etaFrom, order.etaTo) }}</span></div>
      </div>

      <div class="card" style="margin-top:12px">
        <div class="row-b" style="margin-bottom:12px">
          <span class="meta">{{ t('card.tracking.progress') }}</span>
          <span class="num" style="font-weight:600">{{ t('card.tracking.progressNum', { done: DONE, total: TOTAL }) }}</span>
        </div>
        <div v-for="(s, i) in nodes" :key="s.nameKey" style="display:flex;gap:12px">
          <div style="display:flex;flex-direction:column;align-items:center;flex:none">
            <span
              class="num"
              :style="{
                width: '22px', height: '22px', borderRadius: '50%', display: 'grid', placeItems: 'center',
                fontSize: '11px', fontWeight: 700,
                background: s.state === 'todo' ? 'var(--fg-soft)' : 'var(--ok)',
                color: s.state === 'todo' ? 'var(--muted)' : 'var(--fg)',
              }"
            >{{ s.state === 'done' ? '✓' : i + 1 }}</span>
            <span v-if="i < nodes.length - 1" :style="{ width: '2px', flex: 1, minHeight: '18px', background: s.state === 'done' ? 'var(--ok)' : 'var(--fg-soft)' }"></span>
          </div>
          <div style="padding-bottom:14px;flex:1">
            <div class="row-b">
              <b :style="{ fontSize: '14px', fontWeight: s.state === 'todo' ? 400 : 600 }">{{ t(s.nameKey) }}</b>
              <span class="meta" :class="{ ok: s.state === 'done' }">{{ s.date || t('card.tracking.pending') }}</span>
            </div>
            <p v-if="s.noteKey" class="meta" style="margin-top:2px">{{ t(s.noteKey) }}</p>
          </div>
        </div>
      </div>

      <button class="btn btn-o" style="margin-top:4px" @click="toast(t('card.tracking.carrierToast'))">{{ t('card.tracking.viewCarrier') }}</button>
      <p class="meta" style="margin-top:12px">{{ t('card.tracking.note') }}</p>
    </template>

    <div v-else class="card" style="margin-top:20px;text-align:center">
      <p style="font-size:14px;color:var(--muted)">{{ t('card.tracking.noOrder') }}</p>
      <button class="btn btn-gold" style="margin-top:14px" @click="show('card-apply')">{{ t('card.success.goApply') }}</button>
    </div>
  </section>
</template>
