<script>
  import { chapters } from '../data/chapters';
  import { currentChapter, currentVerse } from '../stores/gita';
  
  let dropdownOpen = false;
  
  function selectChapter(num) {
    currentChapter.set(num);
    currentVerse.set(1);
    dropdownOpen = false;
  }
  
  function handleClickOutside(event) {
    if (dropdownOpen && !event.target.closest('.chapter-dropdown')) {
      dropdownOpen = false;
    }
  }
  
  $: selectedChapter = chapters.find(c => c.number === $currentChapter);
</script>

<svelte:window on:click={handleClickOutside} />

<div class="relative chapter-dropdown">
  <button
    on:click|stopPropagation={() => dropdownOpen = !dropdownOpen}
    class="w-full sm:w-auto flex items-center justify-between gap-2 bg-orange-100 hover:bg-orange-200 px-4 py-2 rounded-lg transition text-orange-800 font-semibold"
  >
    <span>Chapter {$currentChapter}: {selectedChapter?.name || ''}</span>
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform {dropdownOpen ? 'rotate-180' : ''}">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  </button>
  
  {#if dropdownOpen}
    <div class="absolute top-full left-0 mt-2 w-full sm:w-96 bg-white border rounded-lg shadow-xl max-h-96 overflow-y-auto z-50">
      {#each chapters as chapter}
        <button
          on:click|stopPropagation={() => selectChapter(chapter.number)}
          class="w-full text-left px-4 py-3 hover:bg-orange-50 transition border-b last:border-b-0 {chapter.number === $currentChapter ? 'bg-orange-100' : ''}"
        >
          <div class="font-semibold text-gray-800">Chapter {chapter.number}: {chapter.name}</div>
          <div class="text-sm text-gray-600">{chapter.englishName}</div>
          <div class="text-xs text-gray-500 mt-1">{chapter.verses} verses</div>
        </button>
      {/each}
    </div>
  {/if}
  
  <p class="text-gray-600 text-sm mt-2">{selectedChapter?.englishName || ''}</p>
</div>
