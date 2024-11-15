<script lang="ts">
	import '../app.css';
	import { PUBLIC_PLAUSIBLE_TAG } from '$env/static/public';

	let { children } = $props();
</script>

<svelte:head>
	<script
		defer
		data-domain="seetheprime.vercel.app"
		src="https://a.flutica.com/js/script.file-downloads.hash.outbound-links.pageview-props.revenue.tagged-events.js"
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
