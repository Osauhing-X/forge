// no_internet.js
// -----------------------------
// Reactive Svelte store 'online' indicates current network status
// Updates automatically when the browser goes online/offline
// Usage:
// import { online } from '$lib/core/no_internet.js';
// $: if (!$online) console.log('No internet connection');


import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const online = writable(true);

if (browser) {
  online.set(navigator.onLine);

  const updateOnlineStatus = () => {
    online.set(navigator.onLine);
  };

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
}