<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { app, closeSheets, toast, overlayFocusIn, overlayFocusOut } from '../store'
import { t, prefs } from '../i18n'
import { fmtMoney, fmtDateTime } from '../i18n/format'
import ToggleSwitch from './ToggleSwitch.vue'

const open = computed(() => app.sheet === 'composer')
/** 弹层无障碍(评审 §6.4):关闭态 inert 不可聚焦;打开焦点进入,关闭焦点复位 */
const root = ref<HTMLElement | null>(null)
watch(open, v => {
  if (v) overlayFocusIn(root.value)
  else overlayFocusOut(root.value)
})

const ctab = ref<'text' | 'video' | 'checkin'>('text')
const tabs = computed(() => ([
  { k: 'text', label: t('composer.tabText') },
  { k: 'video', label: t('composer.tabVideo') },
  { k: 'checkin', label: t('composer.tabCheckin') },
] as const))

const postText = ref('')
const photos = ['/assets/taso-yakiniku.jpg', '/assets/taso-ramen.jpg', '/assets/taso-coffee.jpg']
const picked = ref<number[]>([])
const rating = ref(4)
const verdict = ref<'worth' | 'average' | 'bad'>('worth')
const useCard = ref(true)
const spend = { amount: 3800, currency: 'JPY' }

const verdicts = computed(() => ([
  { k: 'worth', label: t('composer.verdictWorth') },
  { k: 'average', label: t('composer.verdictAverage') },
  { k: 'bad', label: t('composer.verdictNotRecommended') },
] as const))

function pickPhoto(i: number) {
  if (!picked.value.includes(i)) picked.value.push(i)
  toast(t('composer.photoPicked'))
}

function publish() {
  closeSheets()
  toast(t('composer.published'))
  app.foryou.unshift({
    id: Date.now(),
    avatar: 'A',
    author: '@alex',
    verifyKey: 'creator',
    createdAt: new Date().toISOString(),
    placeCityId: 'tokyo',
    // 發佈內容即原文:以當前介面語言的書寫語系記錄(§8.1 用戶可發布後確認)
    original: { text: postText.value || t('composer.placeholder'), locale: prefs.uiLocale.split('-').slice(0, 2).join('-') },
    translations: [],
    image: '/assets/taso-yakiniku.jpg',
    imgW: 720,
    imgH: 481,
    likes: 0,
    comments: 0,
  })
}
</script>

<template>
  <div
    ref="root"
    class="sheet" :class="{ on: open }"
    :inert="!open" tabindex="-1"
    role="dialog" aria-modal="true" :aria-label="t('composer.title')"
  >
    <div class="grip"></div>
    <div class="row-b">
      <b style="font-size:17px">{{ t('composer.title') }}</b>
      <button class="bk" :aria-label="t('a11y.close')" @click="closeSheets()"><svg class="ic"><use href="#i-x"/></svg></button>
    </div>
    <div class="composer-tabs" style="margin-top:12px">
      <button v-for="tb in tabs" :key="tb.k" :class="{ on: ctab === tb.k }" @click="ctab = tb.k">{{ tb.label }}</button>
    </div>

    <!-- 图文 -->
    <div v-show="ctab === 'text'" class="stack" style="margin-top:14px">
      <textarea v-model="postText" class="textarea" :placeholder="t('composer.placeholder')"></textarea>
      <div class="chips" style="flex-wrap:wrap;gap:8px">
        <button
          v-for="(p, i) in photos" :key="p"
          class="chip"
          :style="picked.includes(i) ? 'outline:2px solid var(--accent)' : ''"
          @click="pickPhoto(i)"
        ><img :src="p" width="64" height="64" :alt="t('composer.photoAlt')" style="border-radius:10px;width:64px;height:64px;object-fit:cover" /></button>
        <button class="chip" style="width:64px;height:64px;justify-content:center"><svg class="ic"><use href="#i-plus"/></svg></button>
      </div>
      <button class="pick" @click="toast(t('composer.placePicked'))"><svg class="ic"><use href="#i-pin"/></svg>{{ t('composer.addPlace') }}<span class="v">Shibuya</span></button>
      <button class="pick" @click="toast(t('composer.merchantBound'))"><svg class="ic"><use href="#i-store"/></svg>{{ t('composer.addMerchant') }}<span class="v">焼肉Taso</span></button>
      <button class="pick" @click="toast(t('composer.ratingToast', { rating: 4.7 }))"><svg class="ic"><use href="#i-star"/></svg>{{ t('composer.addRating') }}<span class="v">★4.7</span></button>
      <button class="pick" @click="toast(t('composer.spendToast', { price: fmtMoney(spend) }))"><svg class="ic"><use href="#i-wallet"/></svg>{{ t('composer.addSpend') }}<span class="v">{{ fmtMoney(spend) }}</span></button>
      <div class="pick"><svg class="ic"><use href="#i-globe"/></svg>{{ t('composer.visibility') }}<span class="v">{{ t('composer.visibilityAll') }}</span></div>
      <button class="btn btn-p" @click="publish">{{ t('composer.publish') }}</button>
    </div>

    <!-- 视频 -->
    <div v-show="ctab === 'video'" class="stack" style="margin-top:14px">
      <button class="img-wrap" style="display:block;width:100%;position:relative" @click="toast(t('composer.videoAdded'))">
        <img src="/assets/taso-ramen.jpg" width="720" height="720" :alt="t('composer.videoCoverAlt')" />
        <span style="position:absolute;inset:0;display:grid;place-items:center;color:var(--surface);background:color-mix(in oklch,var(--fg) 30%,transparent)">
          <svg class="ic" style="width:44px;height:44px"><use href="#i-film"/></svg>
        </span>
      </button>
      <textarea class="textarea" :placeholder="t('composer.videoPlaceholder')"></textarea>
      <button class="btn btn-p" @click="publish">{{ t('composer.publishVideo') }}</button>
    </div>

    <!-- 打卡 / 评分 -->
    <div v-show="ctab === 'checkin'" class="stack" style="margin-top:14px">
      <div class="kv"><span class="k">{{ t('composer.merchant') }}</span><span class="v">焼肉Taso</span></div>
      <div class="kv"><span class="k">{{ t('composer.place') }}</span><span class="v">Shibuya</span></div>
      <div class="kv"><span class="k">{{ t('composer.spendTime') }}</span><span class="v num">{{ fmtDateTime('2026-09-08T19:30:00+09:00') }}</span></div>
      <div class="kv"><span class="k">{{ t('composer.perPerson') }}</span><span class="v num">{{ fmtMoney(spend) }}</span></div>
      <div class="row-b">
        <span class="k" style="color:var(--muted)">{{ t('composer.rating') }}</span>
        <div class="rate">
          <button v-for="n in 5" :key="n" :class="{ on: n <= rating }" @click="rating = n"><svg class="ic f"><use href="#i-star"/></svg></button>
        </div>
      </div>
      <div class="chips" style="flex-wrap:wrap;gap:8px">
        <button
          v-for="v in verdicts" :key="v.k"
          class="chip" :class="{ on: verdict === v.k }"
          @click="verdict = v.k"
        >{{ v.label }}</button>
      </div>
      <textarea class="textarea" :placeholder="t('composer.reviewPlaceholder')"></textarea>
      <div class="row-b">
        <span style="font-size:14px">{{ t('composer.useCard') }}</span>
        <ToggleSwitch v-model="useCard" :label="t('composer.useCardLabel')" />
      </div>
      <button class="pick" @click="toast(t('composer.receiptUploaded'))"><svg class="ic"><use href="#i-receipt"/></svg>{{ t('composer.receipt') }}<span class="v">IMG_0921.jpg</span></button>
      <p class="meta">{{ t('composer.note') }}</p>
      <button class="btn btn-p" @click="publish">{{ t('composer.publishReview') }}</button>
    </div>
  </div>
</template>
