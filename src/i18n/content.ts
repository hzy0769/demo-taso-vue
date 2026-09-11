/**
 * UGC 呈現層(設計方案 §8.1)
 *
 * 規則:
 * - 原文優先保真:original 永遠可顯示,譯文按 translationLocale 作為派生資源;
 * - 原文語言與翻譯目標相同 → 直接顯示原文,不出現「由 X 翻譯」行;
 * - 自動翻譯開啟且譯文可用 → 預設顯示譯文 + 「由{語言}翻譯」+ 「顯示原文」;
 * - 自動翻譯關閉 → 顯示原文 + 手動「翻譯」;
 * - 譯文不可用 → 顯示原文 + 「翻譯」操作(演示態提示暫不可用),絕不把原文標為譯文。
 */
import type { Post, PostTranslation } from '../data'
import { prefs, regionName, languageName } from './index'
import { relTime } from './format'

/** locale 等價判定:zh-Hant-HK 接受 zh-Hant 譯文,en 接受 en */
export function localeMatches(target: string, available: string): boolean {
  if (target === available) return true
  const [tLang, tScript] = target.split('-')
  const [aLang, aScript] = available.split('-')
  if (tLang !== aLang) return false
  if (tScript && aScript) return tScript === aScript
  return true
}

/** 按當前翻譯目標語言挑選譯文(精確 → 語言/文字) */
export function pickTranslation(post: Post): PostTranslation | null {
  return (
    post.translations.find(tr => tr.locale === prefs.translationLocale) ??
    post.translations.find(tr => localeMatches(prefs.translationLocale, tr.locale)) ??
    null
  )
}

export interface PostView {
  /** 當前顯示文本 */
  text: string
  /** 顯示的是譯文還是原文 */
  showingTranslation: boolean
  /** 是否渲染「由 X 翻譯」行 */
  hasTranslationLine: boolean
  /** 原文語言顯示名(有翻譯行時) */
  fromLanguage: string
  /** 是否存在可用譯文(決定「翻譯」按鈕可否成功) */
  translationAvailable: boolean
}

/** manualTranslated:自動翻譯關閉時用戶手動點過「翻譯」;forceOriginal:點了「顯示原文」 */
export function postView(post: Post, manualTranslated = false, forceOriginal = false): PostView {
  const originalLocale = post.original.locale
  const tr = pickTranslation(post)
  const sameLanguage = originalLocale ? localeMatches(prefs.translationLocale, originalLocale) : false
  const available = !!tr && !sameLanguage
  const showingTranslation = available && !forceOriginal && (prefs.autoTranslate || manualTranslated)
  return {
    text: showingTranslation ? tr!.text : post.original.text,
    showingTranslation,
    hasTranslationLine: available,
    fromLanguage: originalLocale ? languageName(originalLocale) : '',
    translationAvailable: available,
  }
}

/** 帖子元信息行:地區本地化名 · 相對時間 */
export function postMeta(post: Post): string {
  const place = post.placeCityId ? regionName({ country: '', cityId: post.placeCityId }) : ''
  return [place, relTime(post.createdAt)].filter(Boolean).join(' · ')
}
