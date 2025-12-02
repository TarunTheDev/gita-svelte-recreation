import { writable, derived } from 'svelte/store';
import { chapters } from '../data/chapters';

export const currentChapter = writable(1);
export const currentVerse = writable(1);
export const showTransliteration = writable(true);
export const showTranslation = writable(true);
export const mobileMenuOpen = writable(false);

export const currentChapterData = derived(
  currentChapter,
  $currentChapter => chapters.find(c => c.number === $currentChapter)
);
