// SEO väärtused tulevad staatilisest sisust; HTML escaping hoiab meta märgendid tervena.
function escapeHtml(value = '') {
	return String(value)
		.replaceAll('&', '&amp;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;');
}

export function _seo(seo) {
	if (!seo) return '';

	const { title, description, keywords, image, type, name } = seo;
	const tags = [
		'<meta name="publisher" content="Osaühing X">',
		'<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">',
		'<meta property="og:type" content="' + escapeHtml(type || 'website') + '">'
	];

	if (name) tags.push(
		'<meta property="og:site_name" content="' + escapeHtml(name) + '">'
	);
	if (keywords) tags.push('<meta name="keywords" content="' + escapeHtml(keywords) + '">');
	if (title) tags.push(
		'<title>' + escapeHtml(title) + '</title>',
		'<meta name="twitter:title" content="' + escapeHtml(title) + '">',
		'<meta property="og:title" content="' + escapeHtml(title) + '">'
	);
	if (description) tags.push(
		'<meta name="description" content="' + escapeHtml(description) + '">',
		'<meta name="twitter:description" content="' + escapeHtml(description) + '">',
		'<meta property="og:description" content="' + escapeHtml(description) + '">'
	);
	if (image) tags.push(
		'<meta name="twitter:image" content="' + escapeHtml(image) + '">',
		'<meta name="twitter:card" content="summary_large_image">',
		'<meta property="og:image" content="' + escapeHtml(image) + '">'
	);

	return tags.join('\n');
}
