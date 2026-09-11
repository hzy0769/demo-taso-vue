<script setup lang="ts">
import { computed, ref } from 'vue'
import { app, back, toast } from '../store'
import { COUNTRIES, card, switchCountry, type Country } from '../card'
import PageHeader from '../components/PageHeader.vue'

/** 国家/地区选择器（全球配送 PRD §8）：搜索 + 推荐国家 + 覆盖范围标记 */

const q = ref('')

/** 支持中/英文名与 ISO 代码搜索（§8.2） */
const hit = computed(() => {
  const k = q.value.trim().toLowerCase()
  if (!k) return COUNTRIES
  return COUNTRIES.filter(c =>
    c.zh.includes(q.value.trim()) || c.en.toLowerCase().includes(k) || c.code.toLowerCase() === k,
  )
})
const recommended = computed(() => hit.value.filter(c => c.rec))
const others = computed(() => hit.value.filter(c => !c.rec).sort((a, b) => a.zh.localeCompare(b.zh, 'zh')))

function pick(c: Country) {
  const same = c.code === card.draft.countryCode
  if (!same) {
    const had = switchCountry(c.code)
    if (had) toast('已切换国家 / 地区，部分地址字段已重新调整')
  }
  back()
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'card-country' }" data-screen="card-country">
    <PageHeader title="国家 / 地区" />
    <div class="row" style="margin-top:8px;gap:10px">
      <svg class="ic" style="color:var(--muted);flex:none"><use href="#i-search"/></svg>
      <input v-model="q" class="input" placeholder="搜索国家或地区 Search country or region">
    </div>

    <div v-if="recommended.length" class="card" style="margin-top:14px">
      <p class="meta" style="margin-bottom:2px">推荐 Recommended</p>
      <button v-for="c in recommended" :key="c.code" class="ctry-row" @click="pick(c)">
        <span class="fl">{{ c.flag }}</span>
        <span class="nm">{{ c.zh }}<span class="en">{{ c.en }}</span></span>
        <svg v-if="c.code === card.draft.countryCode" class="ic" style="color:var(--accent)"><use href="#i-check"/></svg>
        <span v-else-if="!c.shippable" class="badge" style="background:var(--danger-soft);color:var(--danger)">暂不支持配送</span>
      </button>
    </div>

    <div v-if="others.length" class="card" style="margin-top:10px">
      <p class="meta" style="margin-bottom:2px">全部国家 / 地区 All countries</p>
      <button v-for="c in others" :key="c.code" class="ctry-row" @click="pick(c)">
        <span class="fl">{{ c.flag }}</span>
        <span class="nm">{{ c.zh }}<span class="en">{{ c.en }}</span></span>
        <svg v-if="c.code === card.draft.countryCode" class="ic" style="color:var(--accent)"><use href="#i-check"/></svg>
        <span v-else-if="!c.shippable" class="badge" style="background:var(--danger-soft);color:var(--danger)">暂不支持配送</span>
      </button>
    </div>

    <p v-if="!hit.length" class="meta" style="margin-top:20px;text-align:center">未找到匹配的国家 / 地区</p>
    <p class="meta" style="margin-top:14px">地址字段将随国家 / 地区自动切换；标有「暂不支持配送」的地区无法提交实体卡申请。</p>
  </section>
</template>
