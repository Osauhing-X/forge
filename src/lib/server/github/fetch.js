import { env } from '$env/dynamic/private';
import { github } from '$lib/server/github/config.js';

/**
 * Koostab GitHub API URL-i faili jaoks.
 */
function getGithubUrl(path) {
	// Eemalda path-i algusest "/"
	const cleanPath = path.replace(/^\/+/, '');

	return (
		`https://api.github.com/repos/` +
		`${github.owner}/${github.repo}/contents/` +
		`${cleanPath}?ref=${github.branch}`
	);
}

/**
 * Koostab GitHub API headers.
 *
 * GITHUB_TOKEN on optional.
 */
function getGithubHeaders() {
	const headers = {
		Accept: 'application/vnd.github.raw+json',
		'X-GitHub-Api-Version': '2022-11-28'
	};

	// Lisa token ainult siis, kui see on olemas
	if (env.GITHUB_TOKEN) {
		headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`;
	}

	return headers;
}

/**
 * Fetchib GitHub repost ühe faili sisu.
 */
export async function fetchGithub(fetch, path) {
	const cleanPath = path.replace(/^\/+/, '');

	const response = await fetch(
		getGithubUrl(cleanPath),
		{
			headers: getGithubHeaders()
		}
	);

	// Faili laadimine ebaõnnestus
	if (!response.ok) {
		console.error(
			'[GitHub] Fetch failed:',
			cleanPath,
			response.status,
			response.statusText
		);

		return null;
	}

	// Tagasta faili sisu
	return response.text();
}

/**
 * Asendab HTML-is lokaalsed src="..." failid
 * GitHub API URL-idega.
 *
 * Näiteks:
 *
 * path = "/"
 * <img src="avatar-min.png">
 *
 * path = "path_1/path_2/"
 * <img src="image.png">
 */
export function resolveGithubSources(html, path = '/') {
	if (!html) return html;

	const directory =
		path === '/'
			? ''
			: path;

	return html.replace(
		/src=(["'])(?!https?:\/\/|data:|blob:|#)([^"']+)\1/gi,
		(match, quote, src) => {
			// Absoluutset path-i ära muuda
			if (src.startsWith('/')) {
				return match;
			}

			const filePath = `${directory}${src}`;

			return `src=${quote}${getGithubUrl(filePath)}${quote}`;
		}
	);
}