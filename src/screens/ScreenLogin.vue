<script setup lang="ts">
import { computed, ref } from 'vue'
import { app, oauthBegin, show, showDialog, syncAccountPrefs } from '../store'
import { t, prefs, UI_LANGS, uiLocaleLabel } from '../i18n'

/** AUTH-002 注册登录首页:注册与登录统一为「继续使用 TASO」(AUTH PRD §2.1) */
const busy = ref<'' | 'apple' | 'google' | 'x'>('')

function go(p: 'apple' | 'google' | 'x') {
  if (busy.value) return
  busy.value = p
  setTimeout(() => {
    busy.value = ''
    oauthBegin(p)
  }, 450)
}

function legal() {
  showDialog(t('auth.legalTitle'), t('auth.legalBody'))
}

/** 语言快捷入口(§4.2:设备语言仅建议;显式选择即时生效并标记 user) */
const langSheetOpen = ref(false)
const langName = computed(() => uiLocaleLabel(prefs.uiLocale))

function pickLang(code: string) {
  prefs.uiLocale = code
  prefs.sources.uiLocale = 'user'
  syncAccountPrefs()
  langSheetOpen.value = false
}
</script>

<template>
  <section class="scr" :class="{ on: app.screen === 'login' }" data-screen="login">
    <div style="min-height:100%;display:flex;flex-direction:column;padding:56px 4px 10px">
      <div style="text-align:center">
        <div style="font-family:var(--font-mono);font-weight:700;letter-spacing:.22em;font-size:34px">TASO</div>
        <p class="meta" style="margin-top:8px">{{ t('auth.tagline') }}</p>
      </div>

      <div style="flex:1"></div>

      <div class="stack">
        <button class="oauth-btn apple" :disabled="!!busy" @click="go('apple')">
          <span v-if="busy === 'apple'" class="spin"></span>
          <svg v-else class="logo"><use href="#logo-apple"/></svg>
          <span>{{ t('auth.continueWith', { provider: 'Apple' }) }}</span>
        </button>
        <button class="oauth-btn google" :disabled="!!busy" @click="go('google')">
          <span v-if="busy === 'google'" class="spin"></span>
          <svg v-else class="logo"><use href="#logo-google"/></svg>
          <span>{{ t('auth.continueWith', { provider: 'Google' }) }}</span>
        </button>
        <button class="oauth-btn x" :disabled="!!busy" @click="go('x')">
          <span v-if="busy === 'x'" class="spin"></span>
          <svg v-else class="logo"><use href="#logo-x"/></svg>
          <span>{{ t('auth.continueWith', { provider: 'X' }) }}</span>
        </button>
      </div>

      <div class="row" style="margin:18px 0 4px">
        <hr style="flex:1;border:0;border-top:1px solid var(--border)" />
        <span class="meta" style="padding:0 10px">{{ t('auth.or') }}</span>
        <hr style="flex:1;border:0;border-top:1px solid var(--border)" />
      </div>
      <button style="min-height:44px;font-weight:600;font-size:15px" @click="show('auth-entry')">
        {{ t('auth.continueEmailPhone') }}
      </button>

      <p style="margin-top:18px;font-size:11.5px;color:var(--muted);text-align:center;line-height:1.7">
        {{ t('auth.legalPrefix') }}
        <button class="lnk" @click="legal">{{ t('auth.terms') }}</button> ·
        <button class="lnk" @click="legal">{{ t('auth.privacy') }}</button>
      </p>

      <div style="display:flex;justify-content:center;margin-top:14px">
        <button class="tag" style="min-height:34px;gap:6px;font-size:12px" @click="langSheetOpen = true">
          <svg class="ic sm"><use href="#i-globe"/></svg>
          <span>{{ langName }}</span>
        </button>
      </div>

      <!-- 语言快捷选择(演示:正式版为底部弹层) -->
      <div v-if="langSheetOpen" class="card" style="margin-top:12px;padding:10px 14px">
        <p class="meta" style="margin-bottom:8px">{{ t('auth.langBody') }}</p>
        <div class="chips" style="flex-wrap:wrap;gap:8px">
          <button
            v-for="l in UI_LANGS" :key="l.code"
            class="chip" :class="{ on: prefs.uiLocale === l.code }"
            @click="pickLang(l.code)"
          >{{ l.name }}</button>
        </div>
      </div>
    </div>
  </section>
</template>
