<script setup lang="ts">
import { app } from '../store'
import { t } from '../i18n'
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'splash' }" data-screen="splash">
    <div style="min-height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;text-align:center">
      <div style="font-family:var(--font-mono);font-weight:700;letter-spacing:.22em;font-size:34px">TASO</div>
      <div style="font-size:15px;letter-spacing:.5em;color:var(--muted);margin-left:.5em">特 搜</div>
      <div class="meta" style="margin-top:6px">{{ t('splash.tagline') }}</div>
      <div class="meta" style="margin-top:48px;display:flex;gap:8px;align-items:center"><span class="badge soft">{{ t('splash.loading') }}</span></div>
    </div>
  </section>
</template>
