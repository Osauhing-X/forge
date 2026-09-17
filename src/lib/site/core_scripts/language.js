// language.js
import { writable, get } from 'svelte/store'


export const language = writable('en')
export const STORAGE_KEY = 'preference:i18n'

// Browser language
export function system_language(input = null, list = []) {
	// Loe salvestatud keele preference
	let saved = null;

	if (typeof localStorage !== 'undefined') {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			saved = raw ? JSON.parse(raw)?.site?.lang : null; } 
    catch {
			saved = null; } }


 /* 1. URL-i keel, kui see on lehel olemas
    └─ kui preference puudub → salvesta see */
	if (list.includes(input)) {
		if (!saved && typeof localStorage !== 'undefined') {
			try {
				localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ site: { lang: input } }) );
				saved = input; } 
      catch {} }
		return input;
	}


 /* 2. Esmakülastus + browser language
    └─ kui browser language on olemas → kasuta seda */
	if (!saved && typeof navigator !== 'undefined') {
		const browser_language = ( navigator.language || navigator.userLanguage )?.split('-')[0];
		if (list && list.includes(browser_language)) { return browser_language; } }


 /* 3. Salvestatud preference
    └─ kui see on sellel lehel olemas → kasuta seda */
	if (list.includes(saved)) { return saved; }


 /* 4. "en"
    └─ kui see on olemas */
	if (list.includes('en')) { return 'en'; }


 // Backup
	return list.length > 0 ? list[0] : null;
}
