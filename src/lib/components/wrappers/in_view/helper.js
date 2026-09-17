import { writable } from 'svelte/store'

export const show_override = writable(false)

export function criteria() {
  let forceTimeout
  let hoverTimeout
  let linkObserver


  /* --- # Hash lehe laadimisel
   Triggerib kõik InView-d 5 sekundiks, kui leht avatakse hashiga */

  if (window.location.hash) {
    show_override.set(true)
    forceTimeout = setTimeout(() => { show_override.set(false) }, 20000) }


  /* --- # Lingi hover
   Triggerib hoveril true ja läheb 5s pärast hiire eemaldamist tagasi false */

  function handlePointerOver(event) {
    const link = event.target.closest?.('a[href*="#"]')
    if (!link) return
    clearTimeout(hoverTimeout)
    show_override.set(true) }

  function handlePointerOut(event) {
    const link = event.target.closest?.('a[href*="#"]')
    if (!link || link.contains(event.relatedTarget)) return
    clearTimeout(hoverTimeout)
    hoverTimeout = setTimeout(() => { show_override.set(false) }, 5000) }

  document.addEventListener('pointerover', handlePointerOver)
  document.addEventListener('pointerout', handlePointerOut)


  /* --- # Hash-link viewportis telefonil
   Triggerib alla 800px true; tagasi desktopile minnes eemaldab mobile override */

  function handleMobile() {
    linkObserver?.disconnect()
    linkObserver = null

    if (window.innerWidth >= 800) {
      show_override.set(false)
      return }
    const visible = new Set()
    const links = document.querySelectorAll('a[href*="#"]')
    linkObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) { visible.add(entry.target) }
          else { visible.delete(entry.target) } })
        show_override.set(visible.size > 0) },
      { threshold: 0.01 } )
    links.forEach(link => { linkObserver.observe(link) }) }

  handleMobile()
  window.addEventListener('resize', handleMobile)


  /* --- # Cleanup
   Eemaldab observerid, listenerid ja timeoutid */

  return {
    destroy() {
      linkObserver?.disconnect()
      window.removeEventListener('resize', handleMobile)
      document.removeEventListener('pointerover', handlePointerOver)
      document.removeEventListener('pointerout', handlePointerOut)
      clearTimeout(forceTimeout)
      clearTimeout(hoverTimeout) } }
}