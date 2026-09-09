<script setup lang="ts">
import { ref } from 'vue'
import { app, show } from '../store'
import PageHeader from '../components/PageHeader.vue'

const interests = ref(['拉面', '烧肉', '咖啡', '甜品', '温泉', '海岛', '火锅', '酒店', '咖啡店', '城市漫步'].map(label => ({ label, on: false })))
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'interests' }" data-screen="interests">
    <PageHeader title="选择你的兴趣">
      <template #right><span class="meta">可多选</span></template>
    </PageHeader>
    <p style="margin:6px 0 16px;color:var(--muted);font-size:13px">选择 3 个以上，Feed 会更懂你的口味。</p>
    <div class="chips" style="flex-wrap:wrap;gap:10px">
      <button
        v-for="item in interests" :key="item.label"
        class="chip" :class="{ on: item.on }"
        @click="item.on = !item.on"
      >{{ item.label }}</button>
    </div>
    <button class="btn btn-p" style="margin-top:28px" @click="show('home')">进入首页</button>
  </section>
</template>
