<script setup lang="ts">
import { computed, ref } from 'vue'
import { app, bindProvider, PROVIDER_NAME, showDialog, unbindProvider, type Provider } from '../store'
import PageHeader from '../components/PageHeader.vue'

/** AUTH-013/015 登录方式管理：绑定 / 解绑；最后一个登录方式不可解绑（AUTH PRD §14） */
const ROWS: { p: Provider; icon: string; logo: boolean }[] = [
  { p: 'apple', icon: 'logo-apple', logo: true },
  { p: 'google', icon: 'logo-google', logo: true },
  { p: 'x', icon: 'logo-x', logo: true },
  { p: 'email', icon: 'i-mail', logo: false },
  { p: 'phone', icon: 'i-smartphone', logo: false },
]

const u = computed(() => app.auth.user)
const binding = ref<Provider | null>(null)

function boundOf(p: Provider) {
  return u.value?.identities.find(i => i.provider === p)
}

function tap(p: Provider) {
  if (binding.value) return
  const bound = boundOf(p)
  const name = PROVIDER_NAME[p]
  if (bound) {
    if ((u.value?.identities.length ?? 0) <= 1) {
      unbindProvider(p) // 内部弹「唯一登录方式」拦截对话框
      return
    }
    showDialog(`解绑${name}？`, `解绑后将无法使用${name}登录 TASO。其他已绑定的登录方式不受影响。`, () => unbindProvider(p))
  } else {
    // 演示态：模拟一次 OAuth / OTP 校验后即时绑定
    binding.value = p
    setTimeout(() => {
      binding.value = null
      bindProvider(p)
    }, 800)
  }
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'auth-methods' }" data-screen="auth-methods">
    <PageHeader title="登录方式" />
    <p class="meta" style="margin:6px 0 12px;font-size:12px;line-height:1.7">
      一个 TASO 账号可绑定多种登录方式；系统按「认证方式 → 身份」识别账号，而非邮箱地址。
    </p>

    <div class="card" style="padding:4px 14px">
      <button
        v-for="r in ROWS"
        :key="r.p"
        class="li"
        style="border:0;width:100%"
        @click="tap(r.p)"
      >
        <span class="li-ic">
          <svg v-if="r.logo" class="logo"><use :href="'#' + r.icon"/></svg>
          <svg v-else class="ic"><use :href="'#' + r.icon"/></svg>
        </span>
        <span style="flex:1;min-width:0;text-align:left">
          <span class="li-title" style="display:block">{{ PROVIDER_NAME[r.p] }}</span>
          <span v-if="boundOf(r.p)" class="li-sub">{{ boundOf(r.p)!.label }} · 绑定于 {{ boundOf(r.p)!.boundAt }}</span>
        </span>
        <span v-if="binding === r.p" class="spin" style="color:var(--muted)"></span>
        <span v-else-if="boundOf(r.p)" class="badge ok">已绑定</span>
        <span v-else class="badge soft">未绑定</span>
        <svg class="ic" style="color:var(--muted)"><use href="#i-right"/></svg>
      </button>
    </div>

    <p class="meta" style="margin-top:14px;font-size:11px;text-align:center">
      点击未绑定项即时完成绑定演示；解绑最后一个登录方式将被拦截
    </p>
  </section>
</template>
