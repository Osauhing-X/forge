import { get } from 'svelte/store';
import { sitemap } from '$lib/site/core_scripts/routes_list';
import { supported } from '$lib/site/core_scripts/language';
import { CANONICAL_ORIGIN } from '$lib/site/core_scripts/canonical';

function canonicalOrigin(origin) {
  return CANONICAL_ORIGIN;
}

function routeUrl(origin, lang, path = '/') {
  const cleanPath = path === '/' ? '/' : `/${String(path).replace(/^\/+/, '')}`;
  return cleanPath === '/'
    ? `${origin}/${lang}/`
    : `${origin}/${lang}${cleanPath}`;
}

function breadcrumbName(routes, path, lang) {
  const seo = routes[path]?.meta?.seo?.[lang];
  const fallback = path === '/' ? 'Extaas' : path.split('/').filter(Boolean).at(-1);
  return String(seo?.title || fallback || 'Extaas').replace(/-/g, ' ').trim();
}

/**
 * MAIN SCHEMA ENTRY
 */
export function _schema(origin, pathname) {
  const routes = get(sitemap);
  if (!routes) return null;

  const parts = pathname.split('/').filter(Boolean);
  const canonical = canonicalOrigin(origin);
  const lang = supported.includes(parts[0]) ? parts[0] : 'et';
  const pathParts = supported.includes(parts[0]) ? parts.slice(1) : parts;
  const fullPath = '/' + pathParts.join('/');

  const entry = routes[fullPath] || routes['/'];
  const meta = entry?.meta ?? {};
  const seo = meta?.seo ?? {};
  const localeSeo = seo?.[lang] ?? {};

  return [
    breadcrumb(routes, fullPath, canonical, lang),
    organization(canonical),
    website(canonical, lang),
    article({ origin: canonical, meta, seo, localeSeo, lang, fullPath })
  ].join('');
}



// 📌 BREADCRUMB
function breadcrumb(routes, full, origin, lang) {
  const items = Object.keys(routes)
    .filter(path => path === '/' || full === path || full.startsWith(`${path}/`))
    .sort((a, b) => a.length - b.length)
    .map((path, i) => {
      return {
        '@type': 'ListItem',
        position: i + 1,
        name: breadcrumbName(routes, path, lang),
        item: routeUrl(origin, lang, path)
      };
    });

  if (!items.length) return '';

  return `
    <script type="application/ld+json">
      ${JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items
      }, null, 2)}
    </script>
  `;
}



// 📌 ORGANIZATION
function organization(origin) {
  return `
    <script type="application/ld+json">
      ${JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Osaühing X',
        alternateName: 'Extaas',
        url: origin,
        logo: `${origin}/corporate_visual_identity/favicon.ico`,
        sameAs: [
          'https://www.facebook.com/ex7aas',
          'https://github.com/Osauhing-X/' ]
      }, null, 2)}
    </script>
  `;
}



// 📌 WEBSITE SEARCH
function website(origin, lang) {
  return `
    <script type="application/ld+json">
      ${JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Extaas',
        url: origin,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${origin}/${lang}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      }, null, 2)}
    </script>
  `;
}



// 📌 ARTICLE
function article({ origin, meta, seo, localeSeo, lang, fullPath }) {
  // 🔒 GUARD: ainult article tüübi puhul
  if (seo?.type !== 'article') return "";

  const sitemap = meta?.sitemap ?? {};

  return `
    <script type="application/ld+json">
      ${JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',

        headline: localeSeo?.title || '',
        description: localeSeo?.description || '',
        image: seo?.image || '',

        author: {
          '@type': 'Person',
          name: seo?.author || '' },

        publisher: {
          '@type': 'Organization',
          name: 'Osaühing X',
          logo: {
            '@type': 'ImageObject',
            url: `${origin}/corporate_visual_identity/favicon.ico` } },

        datePublished: sitemap?.published || '',
        dateModified: sitemap?.lastmod || '',

        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': routeUrl(origin, lang, fullPath)
        }
      }, null, 2)}
    </script>
  `;
}


// Avalehe teenuste loend aitab nii otsingul kui vastusemootoril mõista, mida sait pakub.
function serviceCatalog({ origin, lang, fullPath, site }) {
	if (fullPath !== '/' && fullPath !== '') return '';

	const isExtaas = site === 'Extaas';
	const items = isExtaas
		? [
			{ name: 'Extaas Workspace', description: 'Modular business portal for customers, bookings, forms and workflows.', url: 'https://workspace.extaas.com' },
			{ name: 'Home Assistant applications', description: 'Applications and integrations that extend Home Assistant.', url: routeUrl(origin, lang, '/read') }
		]
		: [
			{ name: 'Software development', description: 'Business software, integrations and automation built around practical workflows.', url: routeUrl(origin, lang, '/') },
			{ name: 'Systems integration', description: 'Connections between web services, payments, data sources and Home Assistant.', url: routeUrl(origin, lang, '/read') }
		];

	return `
		<script type="application/ld+json">
			${JSON.stringify({
				'@context': 'https://schema.org',
				'@type': 'ItemList',
				name: isExtaas ? 'Extaas products and services' : 'OUX services',
				itemListElement: items.map((item, index) => ({
					'@type': 'ListItem', position: index + 1,
					item: { '@type': 'Service', provider: { '@type': 'Organization', name: 'Osaühing X' }, ...item }
				}))
			}, null, 2)}
		</script>
	`;
}
