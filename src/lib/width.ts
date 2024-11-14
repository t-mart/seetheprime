/**
 * Get the width of a chunk of digits in pixels as it would be rendered.
 *
 * This is super specific to our implementation and probably not a good general
 * strategy.
 *
 * This function is useful for us to determine the translation length for our
 * ticker tape of digit chunks immediately. Because we use
 * transitions/animations on our actual ticker tape, it becomes difficult to
 * measure the width of those visible DOM elements.
 *
 * Under the hood, this function creates a temporary DOM element, applies the
 * various styles and classes to it, adds it to the DOM, measures its width, and
 * then removes it from the DOM.
 *
 * @param chunk The chunk of digits (a string) to render
 *
 * @param fontClass The font class to apply to the chunk
 *
 * @param fontSizeRem The font size to apply to the chunk
 *
 * @returns The width of the chunk in pixels
 */
export function getChunkWidthPx(chunk: string, fontClass: string, fontSizeRem: number): number {
	const tempElement = document.createElement('div');
	tempElement.classList.add(fontClass);
	tempElement.style.fontSize = `${fontSizeRem}rem`;
	tempElement.style.position = 'absolute';
	tempElement.style.visibility = 'hidden';
	tempElement.textContent = chunk;
	document.body.appendChild(tempElement);
	const boundingBox = tempElement.getBoundingClientRect();
	const width = boundingBox.width;
	tempElement.remove();
	return width;
}

/**
 * Gets the length of a number of ems in pixels.
 *
 * @param ems The number of ems to convert to pixels
 * 
 * @returns The width of the ems in pixels
 */
export function getEmWidth(ems: number, fontClass: string, fontSizeRem: number) {
	const tempElement = document.createElement('div');
	tempElement.classList.add(fontClass);
	tempElement.style.fontSize = `${fontSizeRem}rem`;
	tempElement.style.width = `${ems}em`;
	tempElement.style.position = 'absolute';
	tempElement.style.visibility = 'hidden';
	document.body.appendChild(tempElement);
	const boundingBox = tempElement.getBoundingClientRect();
	const width = boundingBox.width;
	tempElement.remove();
	return width;
}
