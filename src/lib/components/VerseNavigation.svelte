<script>
  import { currentChapter, currentVerse, currentChapterData } from '../stores/gita';
  import { chapters } from '../data/chapters';
  
  function nextVerse() {
    const chapter = $currentChapterData;
    if ($currentVerse < chapter.verses) {
      currentVerse.update(v => v + 1);
    } else if ($currentChapter < 18) {
      currentChapter.update(c => c + 1);
      currentVerse.set(1);
    }
  }
  
  function prevVerse() {
    if ($currentVerse > 1) {
      currentVerse.update(v => v - 1);
    } else if ($currentChapter > 1) {
      const prevChapter = chapters.find(c => c.number === $currentChapter - 1);
      currentChapter.update(c => c - 1);
      currentVerse.set(prevChapter?.verses || 1);
    }
  }
  
  $: isFirst = $currentChapter === 1 && $currentVerse === 1;
  $: isLast = $currentChapter === 18 && $currentVerse === $currentChapterData?.verses;
</script>

<div class="flex items-center gap-3">
  <button
    on:click={prevVerse}
    disabled={isFirst}
    class="p-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
    aria-label="Previous verse"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  </button>
  
  <div class="text-center min-w-24">
    <div class="font-bold text-lg">Verse {$currentVerse}</div>
    <div class="text-xs text-gray-600">of {$currentChapterData?.verses || 0}</div>
  </div>
  
  <button
    on:click={nextVerse}
    disabled={isLast}
    class="p-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
    aria-label="Next verse"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  </button>
</div>
