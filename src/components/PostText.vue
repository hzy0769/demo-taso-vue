<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import type { Post } from '../data'

/**
 * 帖子正文（X 式）：翻译行「翻译自 XX · 显示原文 / 显示翻译」，
 * 超长文本先按 8 行截断、点「更多」展开；详情页传 lg 显示全文。
 */
const props = defineProps<{ post: Post; clamp?: boolean; lg?: boolean }>()

const showOriginal = ref(false)
const expanded = ref(false)
const el = ref<HTMLElement | null>(null)
/** 渲染后实测：文本被截断才显示「更多」 */
const truncated = ref(false)

const body = computed(() => (showOriginal.value ? props.post.original ?? props.post.text : props.post.text))

function measure() {
  const node = el.value
  truncated.value = !!props.clamp && !expanded.value && !!node && node.scrollHeight > node.clientHeight + 1
}

watch([showOriginal, expanded], () => nextTick(measure))
onMounted(() => {
  nextTick(measure)
  document.fonts?.ready.then(() => nextTick(measure))
})

function toggleOriginal() {
  showOriginal.value = !showOriginal.value
  expanded.value = false
}
</script>

<template>
  <div class="post-body" :class="{ lg }">
    <div v-if="post.original" class="tr-ln">
      <svg class="ic"><use href="#i-translate"/></svg>
      <span v-if="!showOriginal">翻译自{{ post.lang ?? '英语' }}</span>
      <button class="tr-link" @click.stop="toggleOriginal">{{ showOriginal ? '显示翻译' : '显示原文' }}</button>
    </div>
    <p ref="el" class="post-text" :class="{ clamp: clamp && !expanded }">
      <template v-if="showOriginal">{{ body }}</template>
      <template v-else>{{ post.text }}<span v-if="post.link" class="gold"> {{ post.link }}</span><span v-if="post.goldTag" class="gold">{{ post.goldTag }}</span></template>
    </p>
    <button v-if="truncated" class="tr-link" @click.stop="expanded = true">更多</button>
  </div>
</template>
