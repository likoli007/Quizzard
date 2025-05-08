export function debounce<F extends (...args: any[]) => void>(
	fn: F,
	delay: number
): (...args: Parameters<F>) => void {
	let timeoutId: ReturnType<typeof setTimeout>;

	return (...args: Parameters<F>) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			fn(...args);
		}, delay);
	};
}

// First call is executed immediately, then subsequent calls are debounced
export function debounceLeading<F extends (...args: any[]) => void>(
	fn: F,
	delay: number
): (...args: Parameters<F>) => void {
	let timer: ReturnType<typeof setTimeout> | null = null;

	return (...args: Parameters<F>) => {
		if (timer === null) {
			fn(...args);
		}

		clearTimeout(timer as any);

		timer = setTimeout(() => {
			timer = null;
		}, delay);
	};
}
