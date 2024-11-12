<script lang="ts">
	import { Digits } from '$lib/digits';

	let digitsValue = $state(getHashDigitsValue());
	let digits = $derived(Digits.fromString(digitsValue));
	let chunkSize = $state(5);
	let chunks = $derived([...digits.chunks(chunkSize)]);
	let chunkWidths = $state([] as number[]);
	let index = $state(0);
	let translateOffset = $derived(
		chunkWidths.slice(0, index).reduce((acc, width) => acc + width, 0) + chunkWidths[index] / 2
	);

	function getHashDigitsValue() {
		return window.location.hash.slice(1);
	}

	$effect(() => {
		window.location.hash = digits.toString();
	});

	function registerWidth(node: HTMLLIElement, chunkIndex: number) {
		$effect(() => {
			chunkWidths[chunkIndex] = node.clientWidth;

			return () => {
				chunkWidths[chunkIndex] = 0;
			};
		});
	}

	function nudgeIndex(direction: 'forward' | 'backward') {
		const newIndex = index + (direction === 'forward' ? 1 : -1);

		index = Math.max(0, Math.min(chunks.length - 1, newIndex));
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
			nudgeIndex('backward');
			event.preventDefault();
		} else if (event.key === 'ArrowRight' || event.key === 'ArrowDown' || event.key === ' ') {
			nudgeIndex('forward');
			event.preventDefault();
		}
	}
</script>

<svelte:window
	onhashchange={() => {
		index = 0;
		digitsValue = getHashDigitsValue();
	}}
	onwheel={(event) => {
		nudgeIndex(event.deltaY > 0 ? 'forward' : 'backward');
	}}
	onkeydown={handleKeyDown}
/>

<header
	class="fixed inset-x-0 top-0 z-10 flex flex-wrap items-center justify-center gap-4 bg-white p-4"
>
	<div class="flex items-center gap-2">
		<label for="digits" class="ml-4">Digits:</label>
		<input
			type="text"
			id="digits"
			bind:value={digitsValue}
			placeholder="Paste digits here"
			class="rounded border border-black px-4 py-2"
		/>
	</div>

	<div class="flex items-center gap-2">
		<label for="chunk-size" class="ml-4">Chunk size:</label>
		<input type="range" min="1" max="7" id="chunk-size" bind:value={chunkSize} />
	</div>
</header>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<main
	class="fixed inset-0 my-auto flex h-fit flex-col gap-8"
	onclick={() => {
		nudgeIndex('forward');
	}}
>
	{#if chunks.length > 0}
		<p class="text-center px-4">
			{index + 1} of {chunks.length}
		</p>

		<ol
			class="flex select-none font-mono text-9xl duration-200"
			style:transform={`translateX(calc(50% - ${translateOffset}px))`}
		>
			{#each chunks as chunk, i (`${i}-${chunk}`)}
				<li
					class="block px-[1em] transition-all duration-500"
					use:registerWidth={i}
					class:opacity-20={index !== i}
					class:font-bold={index == i}
				>
					{chunk}
				</li>
			{/each}
		</ol>

		<p class="text-center text-gray-500 px-4">
			Advance with tap/click, mouse wheel, arrow keys, or spacebar. 
		</p>
	{/if}
</main>

<footer class="fixed inset-x-0 bottom-0 z-10 flex justify-center bg-white p-4">
	<span>Tim Martin</span>
	<span class="mx-4 select-none">&bull;</span>
	<a class="underline" href="https://github.com/t-mart/seetheprime">Source code</a>
</footer>
