import { error } from '@sveltejs/kit';

import { getLanguages } from '$lib/server/github/file_map.js';

import {
	fetchGithub,
	resolveGithubSources
} from '$lib/server/github/fetch.js';

import { system_language } from '$lib/site/core_scripts/language.js';

export async function load({ params, locals, fetch }) {
	// Leia route'i GitHub kaust ja selle failid
	const path = params.github ? `${params.github}/` : '/';
	const files = locals.github?.[path];

	if (!files) error(404, 'Not found');

	// Leia saadaval keeled ja vali kasutatav keel
	const languages = getLanguages(files);
	if (!languages.length) error(404, 'Not found');

	const language = system_language(params.language, languages);
	const file = `${language}.md`;

	// Kontrolli, kas valitud keelefail eksisteerib
	if (!files.includes(file)) error(404, 'Not found');

	// Fetchi keelefail GitHubist
	const filePath = path === '/' ? file : `${path}${file}`;
	let html = await fetchGithub(fetch, filePath);

	if (html === null) error(404, 'Not found');

	// Lahenda lokaalsed src viited
	html = resolveGithubSources(html, path);

	return { languages, language, html };
}