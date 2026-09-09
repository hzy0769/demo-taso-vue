<script setup lang="ts">
import { ref } from 'vue'
import { toast } from '../store'

defineProps<{ label: string }>()
const on = ref(true)

function toggle() {
  on.value = !on.value
  toast(on.value ? '已开启' : '已关闭')
}
</script>

<template>
  <button class="switch" :class="{ on }" :aria-label="label" @click="toggle" />
</template>
