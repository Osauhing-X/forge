import { env } from '$env/dynamic/private';

const github = {
	owner: 'Osauhing-X',
	repo: 'forge',
	branch: 'www'
};

let fileMap = null;

export async function handle({ event, resolve }) {
	if (!fileMap) {
		const url =
			`https://api.github.com/repos/` +
			`${github.owner}/${github.repo}/git/trees/` +
			`${github.branch}?recursive=1`;

		const headers = {
			Accept: 'application/vnd.github+json',
			'X-GitHub-Api-Version': '2022-11-28' };

		/* Token on optional. Kui olemas, kasuta authenticated GitHub API-t. */
		if (env.GITHUB_TOKEN) {
			headers.Authorization =
				`Bearer ${env.GITHUB_TOKEN}`; }

		const response = await event.fetch(url, {
			headers });

		if (!response.ok) {
			console.error(
				'[GitHub] Tree fetch failed:',
				response.status,
				response.statusText
			);
		} else {
			const data = await response.json();

			fileMap = (data.tree ?? [])
				.filter((item) => item.type === 'blob')
				.map((item) => item.path);

			console.log(
				'[GitHub] fileMap keys:',
				fileMap
			);
		}
	}

	event.locals.github = fileMap ?? [];

	return resolve(event);
}