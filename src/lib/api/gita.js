import { verses as mockVerses } from '../data/verses';

// Use local API proxy to avoid CORS issues
const API_BASE_URL = '/api/gita';

/**
 * Parse HTML content from API response to extract Sanskrit, transliteration, and translation
 * @param {string} lyrics - HTML content from API
 * @returns {{sanskrit: string, transliteration: string, translation: string}}
 */
function parseVerseContent(lyrics) {
  if (!lyrics) {
    return {
      sanskrit: '',
      transliteration: '',
      translation: ''
    };
  }

  // Remove HTML tags but preserve text content
  const stripHtml = (html) => {
    return html
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };
  
  // The lyrics contain mixed content - Sanskrit (Devanagari), transliteration (Roman), and translation
  const cleanText = stripHtml(lyrics);
  
  // Try to identify Sanskrit (Devanagari characters)
  const devanagariRegex = /[\u0900-\u097F]+[^\u0041-\u007A\u00C0-\u024F]*/g;
  const devanagariMatches = cleanText.match(devanagariRegex);
  const sanskrit = devanagariMatches ? devanagariMatches.join(' ').trim() : '';
  
  // Extract transliteration (Roman text with diacritics, typically follows Sanskrit)
  // Look for text with special characters like ā, ī, ū, etc.
  const transliterationRegex = /[a-zA-Z\u0100-\u017F\u1E00-\u1EFF]+[^।॥]*/g;
  const romanMatches = cleanText.match(transliterationRegex);
  
  // Separate transliteration from translation based on patterns
  let transliteration = '';
  let translation = '';
  
  if (romanMatches) {
    // Typically, text with lots of diacritics is transliteration
    // Text that reads like English sentences is translation
    const textParts = romanMatches.join(' ').split(/\d+\.\d+|\d+\s/);
    
    // Simple heuristic: shorter segments with special chars are transliteration
    // Longer prose is translation
    transliteration = textParts.filter(p => 
      p.length < 100 && /[āīūṛṝḷḹēōṃḥṅñṭḍṇśṣ]/.test(p)
    ).join(' ').trim();
    
    translation = textParts.filter(p => 
      p.length >= 20 && !/^[a-z]+\s[a-z]+$/i.test(p.trim())
    ).join(' ').trim();
  }
  
  return {
    sanskrit: sanskrit || cleanText.substring(0, 100),
    transliteration: transliteration || '',
    translation: translation || cleanText
  };
}

/**
 * Fetch all verses for a chapter from the Sanskrit.ie API
 * @param {number} chapter - Chapter number (1-18)
 * @returns {Promise<Array>}
 */
export async function getChapterVerses(chapter) {
  try {
    const response = await fetch(`${API_BASE_URL}/${chapter}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      console.warn(`API returned status ${response.status}, using fallback data`);
      return getFallbackChapterVerses(chapter);
    }
    
    const data = await response.json();
    
    if (data.status === 200 && data.data && Array.isArray(data.data)) {
      const verses = data.data.map(verse => ({
        id: verse.geeta_id,
        chapterNo: parseInt(verse.chapter_no),
        verseNo: parseInt(verse.shlok_no),
        rawContent: verse.lyrics,
        audioUrl: verse.music ? `https://sanskrit.ie/${verse.music}` : null,
        qrUrl: verse.qr ? `https://sanskrit.ie/${verse.qr}` : null,
        ...parseVerseContent(verse.lyrics)
      }));
      
      console.log(`Fetched ${verses.length} verses for chapter ${chapter}`);
      return verses;
    }
    
    console.warn('Invalid API response structure, using fallback data');
    return getFallbackChapterVerses(chapter);
  } catch (error) {
    console.error('Error fetching chapter verses:', error.message);
    // Fallback to mock data
    return getFallbackChapterVerses(chapter);
  }
}

/**
 * Fetch a specific verse from the API
 * @param {number} chapter - Chapter number (1-18)
 * @param {number} verse - Verse number
 * @returns {Promise<{sanskrit: string, transliteration: string, translation: string}>}
 */
export async function getVerse(chapter, verse) {
  try {
    const verses = await getChapterVerses(chapter);
    const targetVerse = verses.find(v => v.verseNo === verse);
    
    if (targetVerse) {
      return targetVerse;
    }
    
    throw new Error('Verse not found');
  } catch (error) {
    console.error('Error fetching verse:', error);
    // Fallback to mock data
    return getFallbackVerse(chapter, verse);
  }
}

/**
 * Fetch chapter details
 * @param {number} chapter - Chapter number (1-18)
 * @returns {Promise<Object>}
 */
export async function getChapter(chapter) {
  try {
    const verses = await getChapterVerses(chapter);
    // Filter out shlok_no === 0 (chapter intro) to get actual verse count
    const verseCount = verses.filter(v => v.verseNo > 0).length;
    
    return {
      number: chapter,
      name: getChapterName(chapter),
      verseCount: verseCount,
      verses: verses
    };
  } catch (error) {
    console.error('Error fetching chapter:', error);
    return {
      number: chapter,
      name: getChapterName(chapter),
      verseCount: 0,
      verses: []
    };
  }
}

/**
 * Get chapter name by number
 * @param {number} chapter - Chapter number
 * @returns {string}
 */
function getChapterName(chapter) {
  const chapterNames = {
    1: "Arjuna Viṣāda Yoga",
    2: "Sāṅkhya Yoga",
    3: "Karma Yoga",
    4: "Jñāna Karma Sannyāsa Yoga",
    5: "Karma Sannyāsa Yoga",
    6: "Dhyāna Yoga",
    7: "Jñāna Vijñāna Yoga",
    8: "Akṣara Brahma Yoga",
    9: "Rāja Vidyā Rāja Guhya Yoga",
    10: "Vibhūti Yoga",
    11: "Viśvarūpa Darśana Yoga",
    12: "Bhakti Yoga",
    13: "Kṣetra Kṣetrajña Vibhāga Yoga",
    14: "Guṇatraya Vibhāga Yoga",
    15: "Puruṣottama Yoga",
    16: "Daivāsura Sampad Vibhāga Yoga",
    17: "Śraddhātraya Vibhāga Yoga",
    18: "Mokṣa Sannyāsa Yoga"
  };
  return chapterNames[chapter] || `Chapter ${chapter}`;
}

/**
 * Fallback function to get verses from mock data
 */
function getFallbackChapterVerses(chapter) {
  const chapterVerses = mockVerses[chapter] || {};
  return Object.entries(chapterVerses).map(([num, data]) => ({
    id: `mock-${chapter}-${num}`,
    chapterNo: chapter,
    verseNo: parseInt(num),
    ...data
  }));
}

/**
 * Fallback function to get a single verse from mock data
 */
function getFallbackVerse(chapter, verse) {
  const verseData = mockVerses[chapter]?.[verse] || {
    sanskrit: "श्लोक उपलब्ध नहीं है",
    transliteration: "Verse not available",
    translation: "This verse is not yet available in our database. Please check back later."
  };
  return {
    id: `mock-${chapter}-${verse}`,
    chapterNo: chapter,
    verseNo: verse,
    ...verseData
  };
}
