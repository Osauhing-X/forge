<script>
  import { show_override as global } from "./helper.js"

  let {
    children,
    elem,
    show = $bindable(false)
  } = $props()


  let final_result = $derived($global || show)

  function observe(node) {

  /* --- # Viewport
   Triggerib, kui InView marker jõuab viewporti või on juba kasutajast üleval */

    const observer = new IntersectionObserver(
      ([entry]) => {
        const rect = entry.boundingClientRect
        const outsideX = rect.right < 0 || rect.left > window.innerWidth
        if (outsideX) { show = false }
        else if (entry.isIntersecting) { show = true }
        else if (rect.bottom < 0) { show = true }
        else if (rect.top > window.innerHeight) { show = false } },
      { threshold: 0.01,
        rootMargin: "300px 0px" } )
    observer.observe(node)


  /* --- # Cleanup
   Eemaldab observeri */

    return {
      destroy() { observer.disconnect() } } }
</script>


<link
  use:observe
  bind:this={elem}
  style:height={final_result ? "1px" : "90vh"}
/>


{#if final_result}
  {@render children?.()}
{/if}


<style>
  link {
    display: block;
    width: 1px; }

</style>