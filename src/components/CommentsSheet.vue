<script setup lang="ts">
import { ref } from 'vue'
import { app, closeSheets, toast } from '../store'

const order = ref('热门')
const draft = ref('')
</script>

<template>
  <div class="sheet" :class="{ on: app.sheet === 'comments' }" role="dialog" aria-label="评论">
    <div class="grip"></div>
    <div class="row-b">
      <b style="font-size:17px">评论 82</b>
      <div class="seg" style="width:auto">
        <button v-for="o in ['热门', '最新', '作者回复']" :key="o" :class="{ on: order === o }" @click="order = o">{{ o }}</button>
      </div>
    </div>
    <div class="stack" style="margin-top:14px">
      <div class="card">
        <div class="row">
          <span class="avatar">A</span>
          <div style="flex:1">
            <b style="font-size:13px">@alex</b>
            <p style="font-size:14px;margin-top:2px">这里排队多久？</p>
            <div class="row" style="margin-top:6px;gap:14px">
              <span class="meta">大概30分钟</span>
              <button class="tag" style="border:0;padding:0" @click="toast('已点赞')">赞 23</button>
              <button class="tag" style="border:0;padding:0" @click="toast('已回复 @alex')">回复</button>
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="row">
          <span class="avatar">M</span>
          <div style="flex:1">
            <b style="font-size:13px">@mia</b>
            <p style="font-size:14px;margin-top:2px">人均大概多少？</p>
            <div class="row" style="margin-top:6px;gap:14px">
              <span class="meta">作者回复：3800日元</span>
              <button class="tag" style="border:0;padding:0" @click="toast('已点赞')">赞 12</button>
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="row">
          <span class="avatar">S</span>
          <div style="flex:1">
            <b style="font-size:13px">@sora</b>
            <p style="font-size:14px;margin-top:2px">午市和晚市菜单一样吗？</p>
            <div class="row" style="margin-top:6px;gap:14px"><span class="meta">不一样，午市更划算</span></div>
          </div>
        </div>
      </div>
    </div>
    <div class="row" style="margin-top:16px">
      <input v-model="draft" class="input" placeholder="写下你的评论…" style="flex:1" />
      <button class="btn btn-p" style="width:auto" @click="toast('评论已发布（演示）'); closeSheets()">发送</button>
    </div>
  </div>
</template>
