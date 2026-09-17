export function createFileMap(files) {
	return files.reduce((map, path) => {
		// Leia path-ist viimase "/" asukoht
		const i = path.lastIndexOf('/');
		// Määra kaust; kui "/" puudub, asub fail root kaustas
		const dir = i < 0 ? '/' : path.slice(0, i + 1);
		// Võta path-ist ainult faili nimi
		const file = path.slice(i + 1);
		// Loo kausta array, kui seda veel pole, ja lisa fail
		(map[dir] ??= []).push(file);
		// Tagasta koostatud kirje üldobjecti
		return map; }, {}); }

		
export function getLanguages(files = []) {
	return files
		// Filtreeri failid kujul "xx.md"
		.filter((file) => /^[a-zA-Z]{2}\.md$/.test(file))
		// Eemalda ".md" faililaiend
		.map((file) => file.slice(0, -3));
}