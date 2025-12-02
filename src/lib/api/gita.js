import { verses as mockVerses } from '../data/verses';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Fetch a specific verse from the API
 * @param {number} chapter - Chapter number (1-18)
 * @param {number} verse - Verse number
 * @returns {Promise<{sanskrit: string, transliteration: string, translation: string}>}
 */
export async function getVerse(chapter, verse) {
  // TODO: Replace with real API call when API is provided
  // const response = await fetch(`${API_BASE_URL}/api/chapters/${chapter}/verses/${verse}`);
  // return await response.json();
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const verseData = mockVerses[chapter]?.[verse] || {
        sanskrit: "श्लोक उपलब्ध नहीं है",
        transliteration: "Verse not available",
        translation: "This verse is not yet available in our database. Please check back later."
      };
      resolve(verseData);
    }, 100);
  });
}

/**
 * Fetch all verses for a chapter
 * @param {number} chapter - Chapter number (1-18)
 * @returns {Promise<Array>}
 */
export async function getChapterVerses(chapter) {
  // TODO: Replace with real API call
  // const response = await fetch(`${API_BASE_URL}/api/chapters/${chapter}/verses`);
  // return await response.json();
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const chapterVerses = mockVerses[chapter] || {};
      resolve(Object.entries(chapterVerses).map(([num, data]) => ({
        number: parseInt(num),
        ...data
      })));
    }, 100);
  });
}

/**
 * Fetch chapter details
 * @param {number} chapter - Chapter number (1-18)
 * @returns {Promise<Object>}
 */
export async function getChapter(chapter) {
  // TODO: Replace with real API call
  // const response = await fetch(`${API_BASE_URL}/api/chapters/${chapter}`);
  // return await response.json();
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        number: chapter,
        name: `Chapter ${chapter}`,
        verses: mockVerses[chapter] ? Object.keys(mockVerses[chapter]).length : 0
      });
    }, 100);
  });
}
