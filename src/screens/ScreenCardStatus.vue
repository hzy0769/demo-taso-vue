<script setup lang="ts">
import { app } from '../store'
import PageHeader from '../components/PageHeader.vue'
import TasoCard from '../components/TasoCard.vue'

/**
 * 实体卡申请进度：申请支付 → 审核 → 制卡 → 配送 → 激活（PRD P402 Step）
 * 演示态固定停在「制卡中」，配送/激活展示待开始状态
 */
const steps = [
  { name: '申请支付', date: '09/11', state: 'done' as const },
  { name: '审核', date: '09/11', state: 'done' as const },
  { name: '制卡', date: '进行中', state: 'doing' as const },
  { name: '配送', date: '待开始', state: 'todo' as const },
  { name: '激活', date: '待开始', state: 'todo' as const },
]
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'card-status' }" data-screen="card-status">
    <PageHeader title="申请进度" />
    <div class="card" style="margin-top:8px">
      <div class="row-b">
        <div>
          <b style="font-size:14px">实体会员卡申请</b>
          <p class="meta">申请单号 APP-20260911-0001 · 2026-09-11</p>
        </div>
        <span class="badge ok">办理费已支付</span>
      </div>
      <div class="kv" style="margin-top:8px"><span class="k">办理费</span><span class="v num">HK$ 1,000 / 张</span></div>
      <div class="kv"><span class="k">发卡机构</span><span class="v">持牌发卡机构（Visa）</span></div>
    </div>
    <div class="card" style="margin-top:14px">
      <div class="row-b"><span class="meta">流程进度</span><span class="num" style="font-weight:600">3 / 5</span></div>
      <div style="margin-top:12px">
        <div v-for="(s, i) in steps" :key="s.name" style="display:flex;gap:12px">
          <div style="display:flex;flex-direction:column;align-items:center;flex:none">
            <span
              class="num"
              :style="{
                width: 22, height: 22, borderRadius: '50%', display: 'grid', placeItems: 'center',
                fontSize: 11, fontWeight: 700,
                background: s.state === 'todo' ? 'var(--fg-soft)' : s.state === 'doing' ? 'var(--accent)' : 'var(--ok)',
                color: s.state === 'todo' ? 'var(--muted)' : 'var(--fg)',
              }"
            >{{ s.state === 'done' ? '✓' : i + 1 }}</span>
            <span v-if="i < steps.length - 1" :style="{ width: 2, flex: 1, minHeight: 18, background: s.state === 'done' ? 'var(--ok)' : 'var(--fg-soft)' }"></span>
          </div>
          <div style="padding-bottom:14px;flex:1">
            <div class="row-b">
              <b style="font-size:14px;font-weight:s.state==='todo'?400:600">{{ s.name }}</b>
              <span class="meta" :class="{ ok: s.state === 'done', gold: s.state === 'doing' }">{{ s.date }}</span>
            </div>
            <p v-if="s.state === 'doing'" class="meta" style="margin-top:2px">卡片正在制作，预计 09/14 完成</p>
            <p v-else-if="s.name === '配送'" class="meta" style="margin-top:2px">制卡完成后交由承运商配送</p>
            <p v-else-if="s.name === '激活'" class="meta" style="margin-top:2px">收到实体卡后在 App 内激活</p>
          </div>
        </div>
      </div>
    </div>
    <div class="card" style="margin-top:2px">
      <div class="row-b">
        <span class="meta">制卡状态</span>
        <span class="badge warn">制卡中</span>
      </div>
      <p class="meta" style="margin-top:8px">卡号由发卡机构在制卡完成时分配；Taso 不保存完整卡号、CVV 等高敏感支付数据。</p>
    </div>
    <div class="card" style="margin-top:10px">
      <div class="row-b">
        <span class="meta">配送状态</span>
        <span class="badge soft">待配送</span>
      </div>
      <div class="kv" style="margin-top:8px"><span class="k">收件地址</span><span class="v">香港中环皇后大道中 99 号 12 楼</span></div>
      <div class="kv"><span class="k">承运商 / 单号</span><span class="v">配送开始后显示</span></div>
      <div class="kv"><span class="k">预计送达</span><span class="v">配送开始后显示</span></div>
    </div>
    <TasoCard pan="•••• •••• •••• ••••" style="margin-top:14px">
      <div class="row-b" style="margin-top:14px">
        <span class="meta" style="color:color-mix(in oklch,var(--fg) 62%,transparent)">Taso Visa 联名会员卡</span>
        <span class="meta" style="color:color-mix(in oklch,var(--fg) 62%,transparent)">制作中</span>
      </div>
    </TasoCard>
    <p class="meta" style="margin-top:12px">如需修改账单地址，请在制卡完成前联系客服；配送范围与时效以发卡机构及承运商为准。</p>
  </section>
</template>
