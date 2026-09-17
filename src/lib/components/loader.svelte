<script>
  import { online } from '$lib/site/core_scripts/no_internet'
  import { onMount, onDestroy } from 'svelte';
  import { loaded } from '$lib/assets/store.js'

  
  

  let timeout;

  onMount(() => {
    // Remove loader
    setTimeout(() => $loaded = true, 500)

    timeout = setTimeout(() => {
      // loading stuck -> reload
      if (!$loaded) { location.reload() }
    }, 5_000);
  });

  onDestroy(() => {
    clearTimeout(timeout) });

</script>


<svelte:head>
  {#if !$loaded}
    <style>
      html { overflow: hidden; }
    </style>
  {/if}
</svelte:head>


{#if !$online}
  <div id="internet" role="status" aria-label="No internet" {VERSION} class="loading-screen flex _center _y"></div>
{:else if !$loaded}
  <div id="loader" role="status" aria-label="Loading" {VERSION} class="loading-screen flex _center _y"></div>
{/if}

<style>
  .loading-screen {
    position: fixed;
    top: 0;
    left: 0;
    height: 100dvh;
    width: 100vw;
    justify-content: center;
    z-index: 999; }

  #loader {
    background: url("/ui_resources/loading.gif") #000 no-repeat center center; }

  #internet {
    background: #000; }
    #internet::before {
      animation: text 5s linear infinite;
      content: "No internet...";
      color: #fff;
      font-family: 'modern_sans';
      font-size: clamp(24px, 4vw, 4em); }
      @keyframes text {
        to {content: "No internet..."}
        50% {content: "No internet.."}
        from {content: "No internet."} }



  .loading-screen[version]::after {
    position: fixed;
    bottom: 10px; right: 10px;
    font-family: monospace;
    content: "v" attr(version);
    color: #aaa;
  }
</style>
