export function getLocalStorage<T>(key: string, defaultValue: T): T {
	const storedValue = localStorage.getItem(key);

	if (storedValue === null) {
		return defaultValue;
	}

	try {
		return JSON.parse(storedValue) as T;
	} catch {
		return defaultValue;
	}
}

export function setLocalStorage<T>(key: string, value: T): void {
	localStorage.setItem(key, JSON.stringify(value));
}
