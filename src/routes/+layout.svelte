<script lang="ts">
	import '../app.css';
	import { PUBLIC_PLAUSIBLE_DOMAIN, PUBLIC_PLAUSIBLE_SOURCE_URL } from '$env/static/public';

	let { children } = $props();
</script>

<svelte:head>
	<script defer data-domain={PUBLIC_PLAUSIBLE_DOMAIN} src={PUBLIC_PLAUSIBLE_SOURCE_URL}></script>
</svelte:head>

{@render children()}
