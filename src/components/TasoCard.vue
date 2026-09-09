<script setup lang="ts">
defineProps<{ pan: string }>()
</script>

<template>
  <div class="taso-card">
    <div class="row-b">
      <span class="brand">TASO CARD</span>
      <slot name="top-right">
        <span class="visa">VISA</span>
      </slot>
    </div>
    <div>
      <div class="pan">{{ pan }}</div>
      <slot />
    </div>
  </div>
</template>
