<script setup lang="ts">
import { computed } from 'vue'
import { app, show, toast } from '../store'
import { card, etaText } from '../card'
import PageHeader from '../components/PageHeader.vue'

/** P06 配送追踪（全球配送 PRD §18，V1.8 取代 V1.7「申请进度」页）
 *  演示态固定停在「已发货」：申请确认 / 制卡完成 / 已发货已完成，运输中 / 已送达待更新（对应 P06 原型） */

const order = computed(() => card.order)

const nodes = computed(() => {
  const o = order.value
  if (!o) return []
  const plus = (n: number) => {
    const d = new Date(o.createdAt)
    d.setDate(d.getDate() + n)
    return `${d.getMonth() + 1}/${String(d.getDate()).padStart(2, '0')}`
  }
  return [
    { name: '申请已确认', date: plus(0), state: 'done' as const, note: '办理费支付成功，申请单已成立' },
    { name: '制卡完成', date: plus(1), state: 'done' as const, note: '卡号已由发卡机构分配并写入卡片' },
    { name: '已发货', date: plus(3), state: 'done' as const, note: '包裹已交由承运商揽收' },
    { name: '运输中', date: '待更新', state: 'todo' as const, note: '' },
    { name: '已送达', date: '待更新', state: 'todo' as const, note: '收到实体卡后请在 App 内激活' },
  ]
})
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'card-tracking' }" data-screen="card-tracking">
    <PageHeader title="配送追踪" />

    <template v-if="order">
      <div class="card" style="margin-top:8px">
        <div class="row-b">
          <div>
            <b style="font-size:14px">实体会员卡 Physical Member Card</b>
            <p class="meta" style="margin-top:2px">申请编号 {{ order.id }} · {{ order.createdAt }}</p>
          </div>
          <span class="badge ok">已发货</span>
        </div>
        <div class="kv" style="margin-top:8px"><span class="k">承运商</span><span class="v">{{ order.carrier }}</span></div>
        <div class="kv"><span class="k">运单号 Tracking No.</span><span class="v num">{{ order.trackingNo }}</span></div>
        <div class="kv"><span class="k">预计送达</span><span class="v num">{{ etaText(order.etaFrom, order.etaTo) }}</span></div>
      </div>

      <div class="card" style="margin-top:12px">
        <div class="row-b" style="margin-bottom:12px">
          <span class="meta">物流状态</span>
          <span class="num" style="font-weight:600">3 / 5</span>
        </div>
        <div v-for="(s, i) in nodes" :key="s.name" style="display:flex;gap:12px">
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
              <b :style="{ fontSize: '14px', fontWeight: s.state === 'todo' ? 400 : 600 }">{{ s.name }}</b>
              <span class="meta" :class="{ ok: s.state === 'done' }">{{ s.date }}</span>
            </div>
            <p v-if="s.note" class="meta" style="margin-top:2px">{{ s.note }}</p>
          </div>
        </div>
      </div>

      <button class="btn btn-o" style="margin-top:4px" @click="toast('已打开承运商物流查询页（演示）')">查看承运商物流 View carrier tracking</button>
      <p class="meta" style="margin-top:12px">物流信息由承运商同步更新；如需在制卡完成前修改收件地址，请联系客服。</p>
    </template>

    <div v-else class="card" style="margin-top:20px;text-align:center">
      <p style="font-size:14px;color:var(--muted)">暂无进行中的申请</p>
      <button class="btn btn-gold" style="margin-top:14px" @click="show('card-apply')">去申请实体卡</button>
    </div>
  </section>
</template>
