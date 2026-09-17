<script>
  import { onMount } from 'svelte';
  import InView from '$lib/components/wrappers/in_view/module.svelte'
  import x_svg from './x.svg?raw'
  /* import Popover from '$lib/components/gloabal/popover.svelte';
     let id = null;
     <Popover bind:id /> */


  let {
    children,
    what = null, // Default is AUTO
    id = Math.random().toString(36).substring(2, 7),
    width = 500,
    btn = null } = $props(); // Button ID (virtual click)

  let inner = $state(0)
  let element;
  let auto = $derived(inner >= 800 ? 'auto' : 'manual');
  let popover = $derived(what ?? auto);
  

  function syncUrl(open) {
    const url = new URL(window.location.href);
    if (open) url.searchParams.set('popover', id);
    else if (url.searchParams.get('popover') === id) url.searchParams.delete('popover');
    history.replaceState(history.state, '', `${url.pathname}${url.search}${url.hash}`);
  }

  function handleToggle(event) {
    syncUrl(event.newState === 'open' || element?.matches?.(':popover-open'));
  }

  onMount(() => {
    if (new URL(window.location.href).searchParams.get('popover') === id) {
      requestAnimationFrame(() => element?.showPopover?.());
    }
  });
</script>


<svelte:window bind:innerWidth={ inner } />


<item bind:this={element} {popover} {id} style="--w: {width}px" ontoggle={handleToggle}>
  <InView>
    <button popovertarget={id} id={btn}>{@html x_svg}</button>     
    {@render children?.()}
  </InView>
</item>


<style>
  [popover]{
    --center_padding: 0;

    background: unset;
    padding: 0;
    scrollbar-width: none;

    width: min(100%, 100dvw);
    height: 100dvh;
    overflow: hidden auto;

    button {
      padding: 0;
      position: fixed;
      top: 15px;
      right: 15px;
      aspect-ratio: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
