import { error } from '@sveltejs/kit';

//export async function load({
//	params,
//	locals
//}) {
//	const language =
//		params.language ?? 'et';
//
//	const path =
//		params.github || 'home';
//
//	const content =
//		await locals.github.fetch(
//			`${path}/${language}.md`
//		);
//
//	if (!content) {
//		error(404, 'Page not found');
//	}
//
//	return {
//		content
//	};
//}