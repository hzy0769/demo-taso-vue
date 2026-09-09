<script setup lang="ts">
import { back } from '../store'

withDefaults(defineProps<{ title?: string; backBtn?: boolean }>(), { title: '', backBtn: true })
</script>

<template>
  <header class="hd">
    <button v-if="backBtn" class="bk" aria-label="返回" @click="back()"><svg class="ic"><use href="#i-back"/></svg></button>
    <div v-if="title" class="hd-title">{{ title }}</div>
    <slot v-else name="title" />
    <slot name="right" />
  </header>
</template>
