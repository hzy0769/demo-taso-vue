<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import type { Post } from '../data'
import { t, prefs } from '../i18n'
import { localeMatches, pickTranslation, postView } from '../i18n/content'
import { toast } from '../store'

/**
 * 帖子正文(§8.1):原文保真、译文可控——
 * - 原文语言 = 翻译目标 → 直接显示原文,无翻译行;
 * - 有译文 →「由{语言}翻译」+ 显示原文 / (显示)翻译;
 * - 无译文 → 显示原文 +「翻译」操作,演示态提示暂不可用,绝不把原文标为译文。
 * 超长文本先按 8 行截断、点「更多」展开;详情页传 lg 显示全文。
 */
const props = defineProps<{ post: Post; clamp?: boolean; lg?: boolean }>()

/** 自动翻译关闭时,用户手动请求翻译 */
const manualTranslated = ref(false)
/** 从译文切回原文 */
const showOriginal = ref(false)
const expanded = ref(false)
const el = ref<HTMLElement | null>(null)
/** 渲染后实测:文本被截断才显示「更多」 */
const truncated = ref(false)

const sameLanguage = computed(() =>
  !!props.post.original.locale && localeMatches(prefs.uiLocale, props.post.original.locale))
const hasTranslation = computed(() => !!pickTranslation(props.post) && !sameLanguage.value)
const view = computed(() => postView(props.post, manualTranslated.value, showOriginal.value))
/** 金色话题/落地链接只在主视图追加:译文视图追加;原文视图若已内含落地链接则不重复 */
const appendExtras = computed(() => {
  if (view.value.showingTranslation) return true
  if (props.post.link && props.post.original.text.includes(props.post.link)) return false
  return true
})

watch(() => props.post.id, () => {
  manualTranslated.value = false
  showOriginal.value = false
  expanded.value = false
})

function measure() {
  const node = el.value
  truncated.value = !!props.clamp && !expanded.value && !!node && node.scrollHeight > node.clientHeight + 1
}

watch([showOriginal, expanded, () => prefs.uiLocale], () => nextTick(measure))
onMounted(() => {
  nextTick(measure)
  document.fonts?.ready.then(() => nextTick(measure))
})

/** 翻譯行操作:顯示譯文 →「顯示原文」;顯示原文 →「(顯示)翻譯」 */
function toggleTranslation() {
  if (view.value.showingTranslation) {
    showOriginal.value = true
  } else if (showOriginal.value) {
    showOriginal.value = false
  } else {
    manualTranslated.value = true
  }
  expanded.value = false
}

/** 无可用译文时的「翻译」操作:演示态返回可恢复的失败提示 */
function requestTranslation() {
  toast(t('post.translateUnavailable'))
}
</script>

<template>
  <div class="post-body" :class="{ lg }">
    <div v-if="hasTranslation" class="tr-ln">
      <svg class="ic"><use href="#i-translate"/></svg>
      <span v-if="view.showingTranslation">{{ t('post.translatedFrom', { language: view.fromLanguage }) }}</span>
      <button class="tr-link" @click.stop="toggleTranslation">
        {{ view.showingTranslation ? t('post.showOriginal') : showOriginal ? t('post.showTranslation') : t('post.translate') }}
      </button>
    </div>
    <div v-else-if="!sameLanguage" class="tr-ln">
      <svg class="ic"><use href="#i-translate"/></svg>
      <button class="tr-link" @click.stop="requestTranslation">{{ t('post.translate') }}</button>
    </div>
    <p ref="el" class="post-text" :class="{ clamp: clamp && !expanded }">
      <template v-if="appendExtras">{{ view.text }}<span v-if="post.link" class="gold"> {{ post.link }}</span><span v-if="post.goldTag" class="gold">{{ post.goldTag }}</span></template>
      <template v-else>{{ view.text }}</template>
    </p>
    <button v-if="truncated" class="tr-link" @click.stop="expanded = true">{{ t('post.more') }}</button>
  </div>
</template>
