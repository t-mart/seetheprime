<script lang="ts">
	import { Digits } from '$lib/digits';
	import { checkDigits } from '$lib/check';
	import { getLocalStorage, setLocalStorage } from '$lib/localStorage';

	const defaultChunkSize = 3;
	const chunkSizeKey = 'chunk-size';
	const defaultChunkPaddingEms = 0.5;
	const chunkPaddingKey = 'chunk-padding';

	let digitsValue = $state(getHashDigitsValue());
	let digits = $derived(Digits.fromString(digitsValue));
	let chunkSize = $state(getLocalStorage(chunkSizeKey, defaultChunkSize));
	let chunkPaddingEm = $state(getLocalStorage(chunkPaddingKey, defaultChunkPaddingEms));
	let chunks = $derived([...digits.chunks(chunkSize)]);
	// let chunkWidths = $state([] as number[]);
	let index = $state(0);
	let translateOffset = $derived.by(() => {
		chunkPaddingEm;
		chunkSize;
		const chunkElements = chunkListElement?.children;
		if (!chunkElements) return 0;
		let children = Array.from(chunkElements) as HTMLLIElement[];
		return (
			children.slice(0, index).reduce((acc, child) => acc + child.clientWidth, 0) +
			children[index].clientWidth / 2
		);
	});
	let digitsInput: HTMLInputElement | null;
	let chunkListElement: HTMLOListElement | null = $state(null);

	function getHashDigitsValue() {
		return window.location.hash.slice(1).replace(/\D/g, '');
	}

	$effect(() => {
		window.location.hash = digitsValue;
	});

	$effect(() => {
		setLocalStorage(chunkSizeKey, chunkSize);
	});

	$effect(() => {
		setLocalStorage(chunkPaddingKey, chunkPaddingEm);
	});

	$effect(() => {
		checkDigits(digitsValue).then((isValid) => {
			digitsInput?.setCustomValidity(
				isValid ? '' : 'Entered digits do not hash to a known chunk of prime'
			);
		});
	});

	$effect(() => {
		// dependency no-ops. (this sucks. is this the best way?)
		digits;
		chunkSize;
		// chunkPaddingEm;

		index = 0;
	});

	function clampedIndexAdd(delta: number) {
		index = Math.max(0, Math.min(chunks.length - 1, index + delta));
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement)
			return;

		if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
			clampedIndexAdd(-1);
		} else if (event.key === 'ArrowRight' || event.key === 'ArrowDown' || event.key === ' ') {
			clampedIndexAdd(1);
		}
	}
</script>

<svelte:window
	onwheel={(event) => {
		clampedIndexAdd(event.deltaY > 0 ? 1 : -1);
	}}
	onkeydown={handleKeyDown}
/>

<svelte:head>
	<title>See the Prime</title>
</svelte:head>

<header
	class="fixed inset-x-0 top-0 z-10 flex flex-wrap items-center justify-center gap-4 bg-white p-4"
>
	<div class="flex items-center gap-2">
		<form>
			<label for="digits">Digits:</label>
			<input
				type="text"
				id="digits"
				bind:this={digitsInput}
				bind:value={digitsValue}
				placeholder="Paste digits here"
				class="rounded border border-black px-4 py-2 invalid:border-red-500"
				oninput={() => {
					digitsValue = digitsValue.replace(/\D/g, '');
				}}
			/>
		</form>
	</div>

	<div class="flex items-center gap-2">
		<label for="chunk-size">Digits per chunk:</label>
		<input type="range" min="1" max="7" id="chunk-size" bind:value={chunkSize} />
	</div>

	<div class="flex items-center gap-2">
		<label for="chunk-padding">Chunk padding:</label>
		<input
			type="range"
			min="0"
			max="2"
			step="0.25"
			id="chunk-padding"
			bind:value={chunkPaddingEm}
		/>
	</div>
</header>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<main
	class="h-screen w-screen"
	onclick={() => {
		clampedIndexAdd(1);
	}}
>
	<div class="fixed inset-0 my-auto flex h-fit flex-col items-center justify-center gap-8">
		{#if chunks.length > 0}
			<p class="px-4 text-center">{index + 1} of {chunks.length}</p>

			<ol
				class="flex select-none font-mono text-9xl duration-100"
				style:transform={`translateX(calc(50% - ${translateOffset}px))`}
				bind:this={chunkListElement}
			>
				{#each chunks as chunk, i (`${i}-${chunk}`)}
					<li
						class="block transition-all"
						class:opacity-20={index !== i}
						class:font-bold={index == i}
						style:padding-inline={`${chunkPaddingEm}em`}
					>
						{chunk}
					</li>
				{/each}
			</ol>

			<div class="flex flex-wrap items-center justify-center gap-2 px-4 text-gray-500">
				<p class="text-center">Advance with tap/click, mouse wheel, arrow keys, or spacebar.</p>

				{#if index > 0}
					<button
						class="underline"
						onclick={(e) => {
							e.stopPropagation();
							clampedIndexAdd(-1);
						}}
					>
						Back one
					</button>
				{/if}

				{#if index === chunks.length - 1 && chunks.length > 1}
					<button
						class="underline"
						onclick={(e) => {
							e.stopPropagation();
							index = 0;
						}}>Restart</button
					>
				{/if}
			</div>
		{/if}
	</div>
</main>

<footer
	class="fixed inset-x-0 bottom-0 z-10 flex items-center justify-center bg-white p-4 text-center"
>
	<span>Tim Martin</span>
	<span class="mx-4 select-none">&bull;</span>
	<a class="underline" href="https://github.com/t-mart/seetheprime">Source code</a>
</footer>
