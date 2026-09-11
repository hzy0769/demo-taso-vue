<script setup lang="ts">
import { app, toast } from '../store'
import { t } from '../i18n'
import PageHeader from '../components/PageHeader.vue'

/**
 * 演示态二维码:按 Taso ID 确定性生成的二维码样式图形(含定位角 + 时序线),
 * 非可扫描编码,真实实现由客户端编码 `https://taso.app/u/{id}`(PRD §73.8)
 */
const SIZE = 25

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function buildQrPath(id: string) {
  let h = 2166136261
  for (const ch of id) {
    h ^= ch.charCodeAt(0)
    h = Math.imul(h, 16777619)
  }
  const rand = mulberry32(h >>> 0)
  const m: boolean[][] = Array.from({ length: SIZE }, () => Array(SIZE).fill(false))
  const drawFinder = (r0: number, c0: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const edge = r === 0 || r === 6 || c === 0 || c === 6
        const core = r >= 2 && r <= 4 && c >= 2 && c <= 4
        m[r0 + r][c0 + c] = edge || core
      }
    }
  }
  drawFinder(0, 0)
  drawFinder(0, SIZE - 7)
  drawFinder(SIZE - 7, 0)
  for (let i = 8; i < SIZE - 8; i++) {
    m[6][i] = i % 2 === 0
    m[i][6] = i % 2 === 0
  }
  const reserved = (r: number, c: number) =>
    (r < 8 && c < 8) || (r < 8 && c >= SIZE - 8) || (r >= SIZE - 8 && c < 8) || r === 6 || c === 6
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (!reserved(r, c)) m[r][c] = rand() < 0.44
    }
  }
  let d = ''
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (m[r][c]) d += `M${c} ${r}h1v1h-1z`
    }
  }
  return d
}

const qrPath = buildQrPath('@alex')
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'my-qrcode' }" data-screen="my-qrcode">
    <PageHeader :title="t('qrcode.title')" />
    <div class="card" style="margin-top:16px;padding:26px 20px;text-align:center">
      <span class="avatar lg" style="margin:0 auto">A</span>
      <div class="row" style="justify-content:center;gap:6px;margin-top:10px">
        <b style="font-size:17px">Alex</b>
        <span class="vfy"><svg class="ic sm f"><use href="#i-check"/></svg>{{ t('verify.creator') }}</span>
      </div>
      <p class="meta" style="margin-top:2px">@alex · Tokyo</p>
      <div class="qr" role="img" :aria-label="t('qrcode.cardAlt')">
        <svg :viewBox="`0 0 ${SIZE} ${SIZE}`" shape-rendering="crispEdges"><path :d="qrPath" fill="currentColor" /></svg>
      </div>
      <p class="meta">{{ t('qrcode.scanHint') }}</p>
    </div>
    <div class="row" style="margin-top:16px">
      <button class="btn btn-o" @click="toast(t('qrcode.scanToast'))"><svg class="ic"><use href="#i-qrcode"/></svg>{{ t('qrcode.scan') }}</button>
      <button class="btn btn-o" @click="toast(t('qrcode.savedToast'))"><svg class="ic"><use href="#i-image"/></svg>{{ t('qrcode.saveImg') }}</button>
    </div>
    <p class="meta" style="margin-top:14px;text-align:center">{{ t('qrcode.urlNote', { url: 'https://taso.app/u/alex' }) }}</p>
  </section>
</template>
