// language.js
import { writable, get } from 'svelte/store'


export const supported = ['et', 'en']
export const language = writable('en')
export const STORAGE_KEY = 'preference:i18n'


// Browser language
export function system_language(input){
  // Url Includes Language
  if(supported.includes(input)) return input
  // Get Client Language
  const browser_lang = typeof navigator !== 'undefined'
    ? (navigator.language || navigator.userLanguage).split('-')[0]
    : 'en'
  // Client or Fallback
  return supported.includes(browser_lang) ? browser_lang : 'en'
}


export function get_saved_language(fallback = system_language()) {
  if (typeof localStorage === 'undefined') return fallback

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const value = raw ? JSON.parse(raw)?.site?.lang : null
    return supported.includes(value) ? value : fallback
  } catch {
    return fallback
  }
}
