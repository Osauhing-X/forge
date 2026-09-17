<script>
  import { page } from '$app/stores';
  import { system_language } from '$lib/site/core_scripts/language.js'
  

  import pack from '$lib/assets/error.json'

  let language = system_language($page.params?.language, pack.list)

  let source = pack?.[$page.status] || pack[500]

  let { title = null, message = null } = source[language]
  
</script>



<svelte:head>
  <title>{$page.status}</title>
  <meta name='description' content={title}>
</svelte:head>

<main>

<article>
    <h1>{title}</h1>
    <small>{@html message}</small>
  </article>
</main>
  
<style>
  main {
    height: 100dvh;
    align-content: center;
    justify-self: center;

    article {
      padding: 1em;
      width: max-content;

      h1 {
        font-size: clamp(2em, 5vw, 3em);
        font-weight: bolder;
        font-family: monospace;

  } } }

  
    

</style>
