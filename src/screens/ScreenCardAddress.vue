<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { app, show, toast } from '../store'
import { COUNTRIES, card, countryOf, validateAddress, type AddrFieldConf } from '../card'
import PageHeader from '../components/PageHeader.vue'

/** P02 配送地址（全球配送 PRD §5）：国家/地区驱动的动态地址表单（§22 配置驱动） */

type Row = { type: 'single'; f: AddrFieldConf } | { type: 'pair'; a: AddrFieldConf; b: AddrFieldConf }

const errs = reactive<Record<string, string>>({})

// 切换国家后字段名与规则已变，旧错误文案不再适用
watch(() => card.draft.countryCode, () => {
  for (const k of Object.keys(errs)) delete errs[k]
})

const country = computed(() => countryOf(card.draft.countryCode))

/** 字段按配置顺序排布；pair 标记的相邻字段（First/Last name）合并为一行（§28.1） */
const rows = computed<Row[]>(() => {
  const flds = country.value?.fields ?? []
  const out: Row[] = []
  for (let i = 0; i < flds.length; i++) {
    if (flds[i].pair && flds[i + 1]?.pair) {
      out.push({ type: 'pair', a: flds[i], b: flds[i + 1] })
      i++
    } else {
      out.push({ type: 'single', f: flds[i] })
    }
  }
  return out
})

/** 区号下拉候选：全部国家区号 + 当前值去重排序（§9 可手动修改区号） */
const dials = computed(() => [...new Set([...COUNTRIES.map(c => c.dial), card.draft.dial])].sort())

function cont() {
  for (const k of Object.keys(errs)) delete errs[k]
  Object.assign(errs, validateAddress())
  if (Object.keys(errs).length) {
    toast('请检查地址信息后重试')
    return
  }
  show('card-shipping')
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'card-address' }" data-screen="card-address">
    <PageHeader title="配送地址" />
    <div class="field" style="margin-top:8px">
      <label>配送至 / Deliver to</label>
      <button class="input ctry" @click="show('card-country')">
        <template v-if="country">
          <span>{{ country.flag }} {{ country.zh }}</span>
          <span class="meta" style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ country.en }}</span>
        </template>
        <span v-else style="flex:1;color:var(--muted)">请选择国家 / 地区</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
    </div>

    <!-- 国家不支持配送（§15.1） -->
    <div v-if="country && !country.shippable" class="alertbar" style="margin-top:12px">
      <svg class="ic" style="flex:none;margin-top:2px"><use href="#i-alert"/></svg>
      <span>实体卡暂不支持配送至该国家 / 地区（Shipping unavailable），请选择其他地址。</span>
    </div>
    <p v-if="errs.country && country?.shippable" class="ferr" style="margin-top:6px">{{ errs.country }}</p>

    <template v-if="country">
      <template v-for="r in rows" :key="r.type === 'pair' ? r.a.key : r.f.key">
        <div v-if="r.type === 'pair'" class="field addr-field">
          <div class="grid-2" style="gap:10px">
            <div>
              <label>{{ r.a.label }}</label>
              <input v-model="card.draft.values[r.a.key]" class="input" :class="{ err: errs[r.a.key] }" @input="delete errs[r.a.key]">
              <p v-if="errs[r.a.key]" class="ferr">{{ errs[r.a.key] }}</p>
            </div>
            <div>
              <label>{{ r.b.label }}</label>
              <input v-model="card.draft.values[r.b.key]" class="input" :class="{ err: errs[r.b.key] }" @input="delete errs[r.b.key]">
              <p v-if="errs[r.b.key]" class="ferr">{{ errs[r.b.key] }}</p>
            </div>
          </div>
        </div>
        <div v-else class="field addr-field">
          <label>{{ r.f.label }}</label>
          <select
            v-if="r.f.type === 'select'"
            v-model="card.draft.values[r.f.key]"
            class="input"
            :class="{ err: errs[r.f.key] }"
            @change="delete errs[r.f.key]"
          >
            <option value="" disabled>请选择</option>
            <option v-for="o in r.f.options" :key="o" :value="o">{{ o }}</option>
          </select>
          <input
            v-else
            v-model="card.draft.values[r.f.key]"
            class="input"
            :class="{ err: errs[r.f.key] }"
            :placeholder="r.f.key === 'postalCode' && country.postalExample ? `如 ${country.postalExample}` : ''"
            @input="delete errs[r.f.key]"
          >
          <p v-if="errs[r.f.key]" class="ferr">{{ errs[r.f.key] }}</p>
        </div>
      </template>

      <!-- 电话：区号 + 号码拆开（§9），区号随国家带入、可手动修改 -->
      <div class="field addr-field">
        <label>电话号码 / Phone number</label>
        <div class="row" style="align-items:flex-start">
          <select v-model="card.draft.dial" class="input dial">
            <option v-for="d in dials" :key="d" :value="d">{{ d }}</option>
          </select>
          <div style="flex:1">
            <input v-model="card.draft.phone" class="input" :class="{ err: errs.phone }" inputmode="tel" placeholder="如 90 1234 5678" @input="delete errs.phone">
            <p v-if="errs.phone" class="ferr">{{ errs.phone }}</p>
          </div>
        </div>
      </div>

      <button class="ckrow" style="margin-top:16px" @click="card.saveDefault = !card.saveDefault">
        <span class="ckbox" :class="{ on: card.saveDefault }">
          <svg v-if="card.saveDefault" class="ic sm" style="color:var(--surface)"><use href="#i-check"/></svg>
        </span>
        <span>保存为默认地址，下次申请直接使用</span>
      </button>
    </template>

    <button class="btn btn-gold" style="margin-top:18px" :disabled="!country || !country.shippable" @click="cont">继续 Continue</button>
  </section>
</template>
