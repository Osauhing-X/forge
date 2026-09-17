import { browser } from '$app/environment';
import { goto } from '$app/navigation';


import { get_saved_language } from '$lib/site/core_scripts/language.js';

export function load({ params, url }) {
  // Auto language
	if (browser && params.language === '@' ) {
		const language = get_saved_language();
		const newUrl = url.pathname.replace('/@', `/${language}`);
		goto(newUrl, {replaceState: true});
	}

	return {};
}



import { supported } from '$lib/site/core_scripts/language.js'

/** @type {import('./$types').EntryGenerator} */
export const entries = async () => {
  return supported.map(lang => ({ language: lang })) };