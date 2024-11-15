<script lang="ts">
	import '../app.css';
	import {
		PUBLIC_PLAUSIBLE_SCRIPT_DATA_DOMAIN,
		PUBLIC_PLAUSIBLE_SCRIPT_SRC
	} from '$env/static/public';

	let { children } = $props();
</script>

<svelte:head>
	<script
		defer
		data-domain={PUBLIC_PLAUSIBLE_SCRIPT_DATA_DOMAIN}
		src={PUBLIC_PLAUSIBLE_SCRIPT_SRC}
	></script>
	<script>
		window.plausible =
			window.plausible ||
			function () {
				(window.plausible.q = window.plausible.q || []).push(arguments);
			};
	</script>
</svelte:head>

{@render children()}
