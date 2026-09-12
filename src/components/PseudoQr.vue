<script setup lang="ts">
/**
 * 演示用伪二维码:按字符串确定性生成点阵(含三个定位角),
 * 仅作收款地址的视觉示意,原型不接入真实二维码库。
 */
const props = withDefaults(defineProps<{ seed: string; size?: number }>(), { size: 168 })

const N = 21

function hashAt(i: number, j: number, seed: string): boolean {
  let h = 2166136261 ^ (i * 73856093) ^ (j * 19349663)
  for (let k = 0; k < seed.length; k++) {
    h ^= seed.charCodeAt(k) + k
    h = Math.imul(h, 16777619)
  }
  h ^= h >>> 13
  return ((h >>> 0) % 100) < 50
}

interface Cell { x: number; y: number; on: boolean }

const cells: Cell[] = []
const inFinder = (i: number, j: number) =>
  (i < 7 && j < 7) || (i < 7 && j >= N - 7) || (i >= N - 7 && j < 7)

for (let i = 0; i < N; i++) {
  for (let j = 0; j < N; j++) {
    if (inFinder(i, j)) continue
    if (hashAt(i, j, props.seed)) cells.push({ x: j, y: i, on: true })
  }
}

/** 三个定位角(7×7 外框 + 3×3 实心) */
function finderCells(fi: number, fj: number): Cell[] {
  const out: Cell[] = []
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 7; j++) {
      const edge = i === 0 || i === 6 || j === 0 || j === 6
      const core = i >= 2 && i <= 4 && j >= 2 && j <= 4
      if (edge || core) out.push({ x: fj + j, y: fi + i, on: true })
    }
  }
  return out
}

const all = [...cells, ...finderCells(0, 0), ...finderCells(0, N - 7), ...finderCells(N - 7, 0)]
</script>

<template>
  <svg
    :width="size" :height="size" :viewBox="`-1 -1 ${N + 2} ${N + 2}`"
    shape-rendering="crispEdges" role="img" aria-hidden="true"
  >
    <rect :x="-1" :y="-1" :width="N + 2" :height="N + 2" rx="1.5" fill="var(--surface)" />
    <rect v-for="c in all" :key="`${c.x}-${c.y}`" :x="c.x" :y="c.y" width="1" height="1" fill="var(--fg)" />
  </svg>
</template>
