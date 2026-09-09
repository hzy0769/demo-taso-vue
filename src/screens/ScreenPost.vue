<script setup lang="ts">
import { ref } from 'vue'
import { app, show, toast, openSheet } from '../store'
import PageHeader from '../components/PageHeader.vue'

const following = ref(false)
const liked = ref(false)
const saved = ref(false)
const showOriginal = ref(false)

function toggleFollow() {
  following.value = !following.value
  toast(following.value ? '已关注 @alex' : '已取消关注')
}
function toggleLike() {
  liked.value = !liked.value
  toast(liked.value ? '已点赞' : '已取消点赞')
}
function toggleBookmark() {
  saved.value = !saved.value
  toast(saved.value ? '已收藏' : '已取消收藏')
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'post' }" data-screen="post">
    <PageHeader title="帖子">
      <template #right>
        <button class="bk" aria-label="分享" @click="toast('分享链接已复制')"><svg class="ic"><use href="#i-share"/></svg></button>
      </template>
    </PageHeader>
    <div class="row-b">
      <div class="row">
        <span class="avatar">T</span>
        <div>
          <div class="row" style="gap:5px">
            <b>@tokyofood</b>
            <span class="vfy"><svg class="ic sm f"><use href="#i-check"/></svg>Verified Purchase</span>
          </div>
          <span class="meta">Tokyo · 2h ago</span>
        </div>
      </div>
      <button
        class="btn" :class="following ? 'btn-o' : 'btn-p'"
        style="width:auto;min-height:40px;padding:7px 14px;font-size:13px"
        @click="toggleFollow"
      >{{ following ? '已关注' : '关注' }}</button>
    </div>
    <p style="margin-top:12px;font-size:16px">Shibuya 这家烧肉真的值得来吗？入口即化的和牛，人均只要 ¥3,800。</p>
    <div class="row" style="margin-top:8px">
      <button class="tag" @click="showOriginal = !showOriginal">{{ showOriginal ? '收起' : '查看原文 · View original' }}</button>
    </div>
    <div v-if="showOriginal" style="margin-top:8px;padding:10px 12px;background:var(--fg-soft);border-radius:12px;font-size:14px">原文：Is this yakiniku in Shibuya really worth it? Melt-in-your-mouth wagyu at ¥3,800 per person.</div>
    <div class="img-wrap" style="margin-top:12px">
      <img src="/assets/taso-yakiniku.jpg" width="720" height="481" alt="Shibuya 焼肉Taso 和牛烧肉" />
    </div>
    <button class="card row-b" style="width:100%;margin-top:12px;text-align:left" @click="show('merchant')">
      <div class="row">
        <span class="li-ic"><svg class="ic"><use href="#i-store"/></svg></span>
        <div>
          <div style="font-weight:600">焼肉Taso</div>
          <div class="meta">Tokyo Shibuya · ★4.7 · ¥3,800/人</div>
        </div>
      </div>
      <span class="badge soft">合作商家</span>
    </button>
    <div class="row-b" style="margin-top:14px">
      <button class="row" style="gap:6px;min-height:44px" @click="toggleLike">
        <svg class="ic" :class="{ f: liked }" :style="liked ? 'color:var(--danger)' : ''"><use href="#i-heart"/></svg>
        <span class="num">1.2K</span>
      </button>
      <button class="row" style="gap:6px;min-height:44px" @click="openSheet('comments')">
        <svg class="ic"><use href="#i-comment"/></svg>
        <span class="num">82</span>
      </button>
      <button class="row" style="gap:6px;min-height:44px" @click="toast('分享链接已复制')">
        <svg class="ic"><use href="#i-share"/></svg>
        <span class="num">214</span>
      </button>
      <button class="row" style="gap:6px;min-height:44px" @click="toggleBookmark">
        <svg class="ic" :class="{ f: saved }"><use href="#i-bookmark"/></svg>
      </button>
    </div>
    <hr style="border:0;border-top:1px solid var(--border);margin:16px 0" />
    <h3 style="font-size:15px;font-weight:600">评论 82</h3>
    <div class="card" style="margin-top:10px">
      <div class="row">
        <span class="avatar">A</span>
        <div style="flex:1">
          <b style="font-size:13px">@alex</b>
          <p style="font-size:14px;margin-top:2px">这里排队多久？</p>
          <div class="row" style="margin-top:6px;gap:14px">
            <span class="meta">大概30分钟</span>
            <button class="tag" style="border:0;padding:0" @click="toast('已点赞')">赞 23</button>
          </div>
        </div>
      </div>
    </div>
    <div class="card" style="margin-top:10px">
      <div class="row">
        <span class="avatar">M</span>
        <div style="flex:1">
          <b style="font-size:13px">@mia</b>
          <p style="font-size:14px;margin-top:2px">人均大概多少？</p>
          <div class="row" style="margin-top:6px;gap:14px"><span class="meta">作者回复：3800日元</span></div>
        </div>
      </div>
    </div>
    <button class="btn btn-o" style="margin-top:14px" @click="openSheet('comments')">查看全部 82 条评论</button>
    <h3 style="font-size:15px;font-weight:600;margin-top:20px">相关推荐</h3>
    <div class="grid-2" style="margin-top:10px">
      <button class="tile img-wrap" @click="show('post')">
        <img src="/assets/taso-ramen.jpg" width="720" height="720" alt="东京拉面" />
        <span class="cap">深夜拉面 <span class="sub">★4.8</span></span>
      </button>
      <button class="tile img-wrap" @click="show('post')">
        <img src="/assets/taso-sushi.jpg" width="720" height="480" alt="寿司" />
        <span class="cap">鮨 Taso <span class="sub">★4.8</span></span>
      </button>
    </div>
  </section>
</template>
