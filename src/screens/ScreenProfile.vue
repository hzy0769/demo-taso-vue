<script setup lang="ts">
import { ref } from 'vue'
import { app, toast } from '../store'
import PageHeader from '../components/PageHeader.vue'

const following = ref(false)
const seg = ref('Posts')

function toggleFollow() {
  following.value = !following.value
  toast(following.value ? '已关注 @alex' : '已取消关注')
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'profile' }" data-screen="profile">
    <PageHeader title="用户主页">
      <template #right>
        <button class="bk" aria-label="更多" @click="toast('更多操作：不感兴趣 / 屏蔽 / 举报')"><svg class="ic"><use href="#i-more"/></svg></button>
      </template>
    </PageHeader>
    <div style="text-align:center;margin-top:8px">
      <span class="avatar lg" style="margin:0 auto">A</span>
      <div class="row" style="justify-content:center;gap:6px;margin-top:10px">
        <b style="font-size:18px">Alex · Tokyo</b>
        <span class="vfy"><svg class="ic sm f"><use href="#i-check"/></svg>Creator</span>
      </div>
      <p class="meta" style="margin-top:4px">12.8K Followers · 1,243 Following</p>
    </div>
    <div class="row" style="justify-content:center;gap:10px;margin-top:14px">
      <button class="btn" :class="following ? 'btn-o' : 'btn-p'" style="width:auto" @click="toggleFollow">{{ following ? '已关注' : '关注' }}</button>
      <button class="btn btn-o" style="width:auto" @click="toast('分享链接已复制')">分享主页</button>
    </div>
    <div class="seg" style="margin-top:16px">
      <button v-for="s in ['Posts', 'Reviews', 'Media']" :key="s" :class="{ on: seg === s }" @click="seg = s">{{ s }}</button>
    </div>
    <div class="masonry" style="margin-top:12px">
      <div class="img-wrap"><img src="/assets/taso-ramen.jpg" width="720" height="720" alt="东京拉面" /></div>
      <div class="img-wrap"><img src="/assets/taso-coffee.jpg" width="720" height="480" alt="香港手冲咖啡" /></div>
      <div class="img-wrap"><img src="/assets/taso-sushi.jpg" width="720" height="480" alt="寿司" /></div>
      <div class="img-wrap"><img src="/assets/taso-onsen.jpg" width="720" height="480" alt="温泉" /></div>
    </div>
  </section>
</template>
