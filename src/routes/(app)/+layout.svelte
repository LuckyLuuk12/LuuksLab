<script lang="ts">
  import '$lib/styles/global.scss'; // DO NOT REMOVE - YOU WILL REGRET IT
  import Navbar from '$lib/components/Navbar.svelte';
  export let data;
</script>

<Navbar {data}>
  <slot />
</Navbar>