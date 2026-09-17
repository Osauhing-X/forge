import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { error } from '@sveltejs/kit';

import { system_language } from '$lib/site/core_scripts/language.js';

export function load({ params, url, data }) {
	let language = params.language
	let list = data.languages

	// Exceptions & prerender
	if (!browser || "_app" == language)
		return data

	// Auto language
	if (language === '@') {
		const language = system_language(null, list);
		const newUrl = url.pathname.replace( '/@', `/${language}` );
		goto(newUrl, { replaceState: true }); }

	if(language && !list.includes(language))
		error(404, 'Not found');

	return data;
}


/** @type {import('./$types').EntryGenerator} */
export const entries = async ({ data }) => {
  return data.languages.map(lang => ({ language: lang })) };


