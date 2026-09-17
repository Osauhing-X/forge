<script>
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	// Style
	import '$lib/assets/wcag.scss'

	// Components
	import Popover from '$lib/components/wrappers/popover/module.svelte';
	import Wcag from '$lib/components/wcag.svelte';
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>




{@render children()}


<popover-list>
	<Popover id="wcag"><Wcag /></Popover>
</popover-list>