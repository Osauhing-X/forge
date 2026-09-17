import { browser } from '$app/environment';
import { error } from '@sveltejs/kit';
import { system_language } from '$lib/site/core_scripts/language.js'

export function load({ params }) {
 // For Prerender
  if (!browser) return

 // exceptions
	/* "GET" access to build "_app" files */ 
	/* [...github] handles the "@" switch */ 
	if(["_app", "@"].includes(params.language)) return

 // Criteria
	let home = !params.language
	let lang = system_language(params.language)
	let pass = lang === params.language

 // Path Exists
	if(home || pass) return
	else throw error(404, 'Not found');
}