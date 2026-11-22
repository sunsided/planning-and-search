// The visitor's theme choice. `auto` follows the system and is stored as nothing at all; the
// inline script in app.html applies a stored choice before first paint.

export type Theme = 'auto' | 'light' | 'dark';
export const THEMES: Theme[] = ['auto', 'light', 'dark'];
const KEY = 'theme';

export function storedTheme(): Theme {
	try {
		const t = localStorage.getItem(KEY);
		return t === 'light' || t === 'dark' ? t : 'auto';
	} catch {
		return 'auto';
	}
}

export function applyTheme(theme: Theme) {
	const root = document.documentElement;
	if (theme === 'auto') delete root.dataset.theme;
	else root.dataset.theme = theme;
	try {
		if (theme === 'auto') localStorage.removeItem(KEY);
		else localStorage.setItem(KEY, theme);
	} catch {
		// Storage blocked: the choice holds for this page only.
	}
}
