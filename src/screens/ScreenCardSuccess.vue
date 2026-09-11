<script setup lang="ts">
import { app, show, toast } from '../store'
import { card, etaText } from '../card'
import PageHeader from '../components/PageHeader.vue'

/** P05 申请成功（全球配送 PRD §17）：申请编号 + 预计送达 + 追踪入口 */

function copyId() {
  const id = card.order?.id
  if (!id) return
  navigator.clipboard?.writeText(id)
    .then(() => toast('申请编号已复制'))
    .catch(() => toast(id))
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'card-success' }" data-screen="card-success">
    <PageHeader title="申请成功" :back-btn="false" />
    <div v-if="card.order" style="display:flex;flex-direction:column;align-items:center;padding-top:40px;text-align:center">
      <span style="width:76px;height:76px;border-radius:50%;background:var(--ok-soft);display:grid;place-items:center">
        <svg class="ic" style="width:36px;height:36px;color:var(--ok);stroke-width:2.4"><use href="#i-check"/></svg>
      </span>
      <h2 style="font-size:20px;font-weight:700;margin-top:16px">申请已提交</h2>
      <p style="font-size:14px;color:var(--muted);margin-top:6px">你的实体会员卡正在制作准备中<br>Application submitted</p>

      <div class="card" style="margin-top:22px;width:100%;text-align:left">
        <div class="row-b">
          <span class="k" style="font-size:13px;color:var(--muted)">申请编号 Application ID</span>
          <button class="edit-btn" aria-label="复制申请编号" @click="copyId"><svg class="ic sm"><use href="#i-copy"/></svg></button>
        </div>
        <p class="num" style="font-size:16px;font-weight:700;margin-top:2px">{{ card.order.id }}</p>
        <div class="kv" style="margin-top:8px"><span class="k">预计送达 Estimated delivery</span><span class="v num">{{ etaText(card.order.etaFrom, card.order.etaTo) }}</span></div>
        <div class="kv"><span class="k">办理费（已支付）</span><span class="v num">HK$ 1,000.00</span></div>
        <div class="kv"><span class="k">配送费（已支付）</span><span class="v num">{{ card.order.shippingFee ? `US$ ${card.order.shippingFee.toFixed(2)}` : '免费' }}</span></div>
      </div>

      <button class="btn btn-p" style="margin-top:20px" @click="show('card-tracking')">查看配送追踪 Track shipment</button>
      <button class="btn btn-o" style="margin-top:10px" @click="show('benefits')">完成 Done</button>
    </div>

    <div v-else class="card" style="margin-top:20px;text-align:center">
      <p style="font-size:14px;color:var(--muted)">暂无申请记录</p>
      <button class="btn btn-gold" style="margin-top:14px" @click="show('card-apply')">去申请实体卡</button>
    </div>
  </section>
</template>
