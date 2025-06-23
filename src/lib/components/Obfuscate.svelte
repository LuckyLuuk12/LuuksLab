<script lang="ts">
  export let text = "Obfuscated!";
  export let revealOnHover = false;

  let display = text.split('');
  let interval: any;

  function randomChar() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    return chars[Math.floor(Math.random() * chars.length)];
  }

  function obfuscate() {
    display = text.split('').map((c) => (c === ' ' ? ' ' : randomChar()));
  }

  function startObfuscate() {
    interval = setInterval(obfuscate, 60);
  }

  function stopObfuscate() {
    clearInterval(interval);
    display = text.split('');
  }

  // Always obfuscate unless revealOnHover is true and hovered
  if (!revealOnHover) {
    startObfuscate();
  }

  // Clean up interval on destroy
  import { onDestroy } from 'svelte';
  onDestroy(() => clearInterval(interval));
</script>

<span
  on:mouseenter={() => {
    if (revealOnHover) {
      stopObfuscate();
    }
  }}
  on:mouseleave={() => {
    if (revealOnHover) {
      startObfuscate();
    }
  }}
  style="font-family: monospace; cursor: pointer; padding: 0 0.1rem;"
  role="note"
>
  {#each display as c}{c}{/each}
</span>