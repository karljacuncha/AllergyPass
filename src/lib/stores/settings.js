import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Helper to detect browser locale
function detectLocale() {
	if (!browser) return 'en';
	const locale = (navigator.language || 'en').toLowerCase();
	const localeMap = { en:'en', es:'es', fr:'fr', de:'de', it:'it', pt:'pt', ja:'ja', zh:'zh', ar:'ar', hi:'hi' };
	const prefix = locale.split('-')[0];
	return localeMap[prefix] || 'en';
}

// Helper to create a persistent writable store
function persistent(key, initial) {
	const stored = browser ? localStorage.getItem(key) : null;
	const data = stored ? JSON.parse(stored) : initial;
	
	const store = writable(data);
	
	if (browser) {
		store.subscribe(value => {
			localStorage.setItem(key, JSON.stringify(value));
		});
	}
	
	return store;
}

// Stores
export const interfaceLanguage = persistent('ac_interfaceLang', detectLocale());
export const cardLanguageShortlist = persistent('ac_cardShortlist', ['en', 'es', 'fr', 'de', 'ja']);
export const activeCardLanguage = persistent('ac_activeCardLang', 'en');
export const profiles = persistent('ac_profiles', []);
export const activeProfileId = persistent('ac_activeProfile', null);
