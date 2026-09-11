<script setup lang="ts">
import { computed, ref } from 'vue'
import { t } from '../i18n'
import { toast } from '../store'

const props = defineProps<{ label: string; modelValue?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

/** 未受控时的内部状态 */
const inner = ref(true)
const on = computed(() => (props.modelValue == null ? inner.value : props.modelValue))

function toggle() {
  const next = !on.value
  if (props.modelValue == null) inner.value = next
  emit('update:modelValue', next)
  toast(next ? t('common.switchOn') : t('common.switchOff'))
}
</script>

<template>
  <button class="switch" :class="{ on }" :aria-label="label" @click="toggle" />
</template>
