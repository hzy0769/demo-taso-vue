<script setup lang="ts">
import { ref } from 'vue'
import { app, closeSheets, toast } from '../store'
import ToggleSwitch from './ToggleSwitch.vue'

const ctab = ref<'text' | 'video' | 'checkin'>('text')
const tabs = [
  { k: 'text', label: '文字 / 图片' },
  { k: 'video', label: '视频' },
  { k: 'checkin', label: '打卡 / 评分' },
] as const

const postText = ref('')
const photos = ['/assets/taso-yakiniku.jpg', '/assets/taso-ramen.jpg', '/assets/taso-coffee.jpg']
const picked = ref<number[]>([])
const rating = ref(4)
const verdict = ref('值得')

function pickPhoto(i: number) {
  if (!picked.value.includes(i)) picked.value.push(i)
  toast('已选择照片（演示）')
}

function publish() {
  closeSheets()
  toast('发布成功，进入审核流（演示）')
  app.foryou.unshift({
    id: Date.now(),
    avatar: 'A',
    author: '@alex',
    verify: 'Creator',
    meta: '刚刚',
    text: postText.value || '今天去了一家很不错的烧肉店…',
    image: '/assets/taso-yakiniku.jpg',
    imgW: 720,
    imgH: 481,
    likeCount: '0',
    commentCount: '0',
  })
}
</script>

<template>
  <div class="sheet" :class="{ on: app.sheet === 'composer' }" role="dialog" aria-label="发布内容">
    <div class="grip"></div>
    <div class="row-b">
      <b style="font-size:17px">发布内容</b>
      <button class="bk" aria-label="关闭" @click="closeSheets()"><svg class="ic"><use href="#i-x"/></svg></button>
    </div>
    <div class="composer-tabs" style="margin-top:12px">
      <button v-for="t in tabs" :key="t.k" :class="{ on: ctab === t.k }" @click="ctab = t.k">{{ t.label }}</button>
    </div>

    <!-- 文字 / 图片 -->
    <div v-show="ctab === 'text'" class="stack" style="margin-top:14px">
      <textarea v-model="postText" class="textarea" placeholder="今天去了一家很不错的烧肉店…"></textarea>
      <div class="chips" style="flex-wrap:wrap;gap:8px">
        <button
          v-for="(p, i) in photos" :key="p"
          class="chip"
          :style="picked.includes(i) ? 'outline:2px solid var(--accent)' : ''"
          @click="pickPhoto(i)"
        ><img :src="p" width="64" height="64" alt="选择照片" style="border-radius:10px;width:64px;height:64px;object-fit:cover" /></button>
        <button class="chip" style="width:64px;height:64px;justify-content:center"><svg class="ic"><use href="#i-plus"/></svg></button>
      </div>
      <button class="pick" @click="toast('已选择地点：Shibuya')"><svg class="ic"><use href="#i-pin"/></svg>添加地点<span class="v">Shibuya</span></button>
      <button class="pick" @click="toast('已绑定商家：焼肉Taso')"><svg class="ic"><use href="#i-store"/></svg>添加商家<span class="v">焼肉Taso</span></button>
      <button class="pick" @click="toast('评分 ★4.7')"><svg class="ic"><use href="#i-star"/></svg>添加评分<span class="v">★4.7</span></button>
      <button class="pick" @click="toast('消费金额 ¥3,800 / 人')"><svg class="ic"><use href="#i-wallet"/></svg>添加消费金额<span class="v">¥3,800</span></button>
      <div class="pick"><svg class="ic"><use href="#i-globe"/></svg>谁可以看<span class="v">所有人 ▾</span></div>
      <button class="btn btn-p" @click="publish">发布</button>
    </div>

    <!-- 视频 -->
    <div v-show="ctab === 'video'" class="stack" style="margin-top:14px">
      <button class="img-wrap" style="display:block;width:100%;position:relative" @click="toast('视频已加入（演示）')">
        <img src="/assets/taso-ramen.jpg" width="720" height="720" alt="视频封面" />
        <span style="position:absolute;inset:0;display:grid;place-items:center;color:var(--surface);background:color-mix(in oklch,var(--fg) 30%,transparent)">
          <svg class="ic" style="width:44px;height:44px"><use href="#i-film"/></svg>
        </span>
      </button>
      <textarea class="textarea" placeholder="写点视频介绍…"></textarea>
      <button class="btn btn-p" @click="publish">发布视频</button>
    </div>

    <!-- 打卡 / 评分 -->
    <div v-show="ctab === 'checkin'" class="stack" style="margin-top:14px">
      <div class="kv"><span class="k">商家</span><span class="v">焼肉Taso</span></div>
      <div class="kv"><span class="k">地点</span><span class="v">Shibuya</span></div>
      <div class="kv"><span class="k">消费时间</span><span class="v num">2026-09-08 19:30</span></div>
      <div class="kv"><span class="k">人均</span><span class="v num">¥3,800</span></div>
      <div class="row-b">
        <span class="k" style="color:var(--muted)">评分</span>
        <div class="rate">
          <button v-for="n in 5" :key="n" :class="{ on: n <= rating }" @click="rating = n"><svg class="ic f"><use href="#i-star"/></svg></button>
        </div>
      </div>
      <div class="chips" style="flex-wrap:wrap;gap:8px">
        <button
          v-for="v in ['值得', '一般', '不推荐']" :key="v"
          class="chip" :class="{ on: verdict === v }"
          @click="verdict = v"
        >{{ v }}</button>
      </div>
      <textarea class="textarea" placeholder="体验：写下真实感受…"></textarea>
      <div class="row-b">
        <span style="font-size:14px">是否使用 Taso 会员卡</span>
        <ToggleSwitch label="使用会员卡" />
      </div>
      <button class="pick" @click="toast('凭证已上传，OCR 识别中')"><svg class="ic"><use href="#i-receipt"/></svg>消费凭证（可选）<span class="v">IMG_0921.jpg</span></button>
      <p class="meta">发布内容 ≠ 自动获得报销；报销必须另行提交符合要求的消费凭证并完成审核。</p>
      <button class="btn btn-p" @click="publish">发布体验</button>
    </div>
  </div>
</template>
