<script setup lang="ts">
import { app, show, showDialog, toast } from '../store'
import PageHeader from '../components/PageHeader.vue'

function submit() {
  showDialog('提交消费账单', '请上传消费凭证，OCR 将识别商家、日期与金额；重复凭证与金额不一致会进入人工审核。', () =>
    toast('凭证已提交，进入审核（演示）'),
  )
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'reimburse' }" data-screen="reimburse">
    <PageHeader title="消费报销" />
    <div class="row" style="gap:8px;margin-top:8px">
      <div class="card" style="flex:1;padding:12px"><div class="num" style="font-weight:700">12</div><div class="meta">已审核</div></div>
      <div class="card" style="flex:1;padding:12px"><div class="num warn" style="font-weight:700">8</div><div class="meta">结算中</div></div>
      <div class="card" style="flex:1;padding:12px"><div class="num ok" style="font-weight:700">21</div><div class="meta">已完成</div></div>
    </div>
    <button class="btn btn-p" style="margin-top:14px" @click="submit">+ 提交消费账单</button>
    <h3 style="font-size:15px;font-weight:600;margin:18px 0 10px">结算中</h3>
    <div class="card">
      <div class="row-b"><b>焼肉Taso</b><span class="badge warn">SETTLING</span></div>
      <div class="kv" style="margin-top:6px"><span class="k">消费</span><span class="v num">HK$ 800.00</span></div>
      <div class="kv"><span class="k">可结算上限</span><span class="v num">HK$ 928.00</span></div>
      <div class="kv"><span class="k">已结算</span><span class="v num ok">HK$ 120.00</span></div>
      <div class="kv"><span class="k">剩余</span><span class="v num">HK$ 808.00</span></div>
      <p class="meta" style="margin-top:8px">日结规则：按平台公布规则执行（0.05%/日，按审核通过金额独立结算）。</p>
      <button class="btn btn-o" style="margin-top:12px" @click="show('reimburse-detail')">查看详情</button>
    </div>
    <p class="meta" style="margin-top:12px">发布内容 ≠ 自动获得报销；报销必须另行提交符合要求的消费凭证并完成审核。</p>
  </section>
</template>
