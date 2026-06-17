// Theme controller for the renderer popup.
//
// Color comes from Fluent 2 design tokens (styles/generated/_fluent-tokens.css)
// plus app-specific variables (styles/_app-theme.css). Those partials expose
// three resolutions, selected by the documentElement's `data-theme` attribute:
//   - "system" : light by default, dark via @media (prefers-color-scheme: dark)
//   - "light"  : forced light
//   - "dark"   : forced dark
// System mode needs no JS to react to OS changes — the CSS media query updates
// live — so this module only persists the user's choice and reflects it on the
// root element. Persistence uses localStorage to match the rest of the popup
// (see renderer.ts), which avoids adding a "storage" manifest permission.

export type ThemeChoice = "system" | "light" | "dark";

const STORAGE_KEY = "themePreference";
const CHOICES: ThemeChoice[] = ["system", "light", "dark"];

export function isThemeChoice(value: string | null | undefined): value is ThemeChoice {
	return value === "system" || value === "light" || value === "dark";
}

export function getStoredTheme(): ThemeChoice {
	try {
		let stored = localStorage.getItem(STORAGE_KEY);
		if (isThemeChoice(stored)) {
			return stored;
		}
	} catch (e) { /* localStorage unavailable — fall through to default */ }
	return "system";
}

export function applyTheme(choice: ThemeChoice): void {
	document.documentElement.setAttribute("data-theme", choice);
}

export function setTheme(choice: ThemeChoice): void {
	try { localStorage.setItem(STORAGE_KEY, choice); } catch (e) { /* ignore */ }
	applyTheme(choice);
}

// Advances System -> Light -> Dark -> System and persists the result.
export function cycleTheme(current: ThemeChoice): ThemeChoice {
	let next = CHOICES[(CHOICES.indexOf(current) + 1) % CHOICES.length];
	setTheme(next);
	return next;
}

// Applies the persisted choice on load and returns it (for wiring the toggle UI).
export function initTheme(): ThemeChoice {
	let choice = getStoredTheme();
	applyTheme(choice);
	return choice;
}
