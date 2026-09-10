<script setup lang="ts">
import { computed, ref } from 'vue'
import { app, show, toast, openSheet, openPost } from '../store'
import { followingPosts, foryouSeed } from '../data'
import PageHeader from '../components/PageHeader.vue'
import PostText from '../components/PostText.vue'

/** 详情页展示 openPost 设置的帖子，未知 id（刷新恢复等）回退热帖 */
const post = computed(() =>
  [...app.foryou, ...app.following].find(p => p.id === app.postId) ?? foryouSeed[0],
)

const following = ref(false)
const liked = ref(false)
const saved = ref(false)

function toggleFollow() {
  following.value = !following.value
  toast(following.value ? `已关注 ${post.value.author}` : '已取消关注')
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
        <span class="avatar">{{ post.avatar }}</span>
        <div>
          <div class="row" style="gap:5px">
            <b>{{ post.author }}</b>
            <span class="vfy"><svg class="ic sm f"><use href="#i-check"/></svg>{{ post.verify }}</span>
          </div>
          <span class="meta">{{ post.meta }}</span>
        </div>
      </div>
      <button
        class="btn" :class="following ? 'btn-o' : 'btn-p'"
        style="width:auto;min-height:40px;padding:7px 14px;font-size:13px"
        @click="toggleFollow"
      >{{ following ? '已关注' : '关注' }}</button>
    </div>
    <PostText :post="post" lg />
    <div class="img-wrap" style="margin-top:12px">
      <img :src="post.image" :width="post.imgW" :height="post.imgH" :alt="post.author" />
    </div>
    <button v-if="post.merchant" class="card row-b" style="width:100%;margin-top:12px;text-align:left" @click="show('merchant')">
      <div class="row">
        <span class="li-ic"><svg class="ic"><use href="#i-store"/></svg></span>
        <div>
          <div style="font-weight:600">{{ post.merchant.title }}</div>
          <div class="meta">{{ post.merchant.meta }}</div>
        </div>
      </div>
      <span class="badge soft">合作商家</span>
    </button>
    <div class="row-b" style="margin-top:14px">
      <button class="row" style="gap:6px;min-height:44px" @click="toggleLike">
        <svg class="ic" :class="{ f: liked }" :style="liked ? 'color:var(--danger)' : ''"><use href="#i-heart"/></svg>
        <span class="num">{{ post.likeCount }}</span>
      </button>
      <button class="row" style="gap:6px;min-height:44px" @click="openSheet('comments')">
        <svg class="ic"><use href="#i-comment"/></svg>
        <span class="num">{{ post.commentCount }}</span>
      </button>
      <button class="row" style="gap:6px;min-height:44px" @click="toast('分享链接已复制')">
        <svg class="ic"><use href="#i-share"/></svg>
        <span v-if="post.shareCount" class="num">{{ post.shareCount }}</span>
      </button>
      <button class="row" style="gap:6px;min-height:44px" @click="toggleBookmark">
        <svg class="ic" :class="{ f: saved }"><use href="#i-bookmark"/></svg>
      </button>
    </div>
    <hr style="border:0;border-top:1px solid var(--border);margin:16px 0" />
    <h3 style="font-size:15px;font-weight:600">评论 {{ post.commentCount }}</h3>
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
    <button class="btn btn-o" style="margin-top:14px" @click="openSheet('comments')">查看全部 {{ post.commentCount }} 条评论</button>
    <h3 style="font-size:15px;font-weight:600;margin-top:20px">相关推荐</h3>
    <div class="grid-2" style="margin-top:10px">
      <button class="tile img-wrap" @click="openPost(followingPosts[0])">
        <img src="/assets/taso-ramen.jpg" width="720" height="720" alt="东京拉面" />
        <span class="cap">深夜拉面 <span class="sub">★4.8</span></span>
      </button>
      <button class="tile img-wrap" @click="toast('相关帖子（演示）')">
        <img src="/assets/taso-sushi.jpg" width="720" height="480" alt="寿司" />
        <span class="cap">鮨 Taso <span class="sub">★4.8</span></span>
      </button>
    </div>
  </section>
</template>
