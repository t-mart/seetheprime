<script lang="ts">
	import { Digits } from '$lib/digits';

	let digitsValue = $state(getHashDigitsValue());
	let digits = $derived(Digits.fromString(digitsValue));
	let chunkSize = $state(5);
	let chunks = $derived([...digits.chunks(chunkSize)]);
	let chunkWidths = $state([] as number[]);
	let index = $state(0);
	let marginLeftOffset = $derived(
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

	function updateIndex(increment: boolean) {
		const newIndex = index + (increment ? 1 : -1);

		index = Math.max(0, Math.min(chunks.length - 1, newIndex));
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
			updateIndex(false);
			event.preventDefault();
		} else if (event.key === 'ArrowRight' || event.key === 'ArrowDown' || event.key === ' ') {
			updateIndex(true);
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
		updateIndex(event.deltaY > 0);
	}}
	onkeydown={handleKeyDown}
/>

<div class="min-h-screen">
	<header class="flex justify-center p-4">
		<input
			bind:value={digitsValue}
			placeholder="Enter digits here"
			class="rounded border border-black px-4 py-2"
		/>
	</header>

	<main class="container mx-auto flex flex-col px-12 py-8">
		{#if chunks.length > 0}
			<p class="flex justify-center">
				{index + 1} of {chunks.length}
			</p>
		{/if}

		<ol
			class="flex w-full items-center font-mono text-9xl transition-[margin-left] duration-200"
			style:margin-left={`calc(50% - ${marginLeftOffset}px)`}
		>
			{#each chunks as chunk, i (`${i}-${chunk}`)}
				<li
					class="block px-4 transition-all duration-500"
					use:registerWidth={i}
					class:opacity-20={index !== i}
					class:font-bold={index == i}
				>
					{chunk}
				</li>
			{/each}
		</ol>

		{#if chunks.length > 0}
			<p class="mt-12 flex justify-center text-gray-500">
				Advance with right arrow, down arrow, mouse wheel, or spacebar.
			</p>
		{/if}

		<p class="flex justify-center">
			<a class="underline" href="https://github.com/t-mart/seetheprime">Source code</a>
		</p>
	</main>
</div>
