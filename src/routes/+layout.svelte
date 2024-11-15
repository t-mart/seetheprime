<script lang="ts">
	import '../app.css';
	import { PUBLIC_PLAUSIBLE_TAG } from '$env/static/public';

	let { children } = $props();

	if (import.meta.env.MODE === 'development') {
		globalThis.plausible = () => {};
	}
</script>

<svelte:head>
	{@html PUBLIC_PLAUSIBLE_TAG}
</svelte:head>

{@render children()}
