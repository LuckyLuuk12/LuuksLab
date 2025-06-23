<script lang="ts">
  export let text = "Obfuscated!";
  export let revealOnHover = false;

  let display = text.split('');
  let interval: any;

  function randomChar() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()[]{}<>?/\\|~`±§÷×¤¢£¥©®™✓★☆☀☁☂☃☄☯☢☣☠☮☭☾☽♠♣♥♦♪♫♬♭♯';
    return chars[Math.floor(Math.random() * chars.length)];
  }

  function obfuscate() {
    display = text.split('').map((c) => (c === ' ' ? ' ' : randomChar()));
  }

  function startObfuscate() {
    interval = setInterval(obfuscate, 30);
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
  role="note"
>
  {#each display as c}
    <span class="obfuscated-char">{c}</span>
  {/each}
</span>

<style lang="scss">
  .obfuscated-char {
    width: 1ch;
    display: inline-block;
    transition: color 0.3s, transform 0.3s;
    &:first-of-type, &:last-of-type {
      margin-right: 0.2rem; /* Adjust spacing for last character */
    }
  }
</style>