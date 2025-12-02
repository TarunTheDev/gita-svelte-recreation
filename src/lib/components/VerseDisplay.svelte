<script>
  import { onMount } from 'svelte';
  import { currentChapter, currentVerse, showTransliteration, showTranslation } from '../stores/gita';
  import { getVerse } from '../api/gita';
  
  let verseData = { sanskrit: '', transliteration: '', translation: '' };
  let loading = false;
  
  async function loadVerse() {
    loading = true;
    verseData = await getVerse($currentChapter, $currentVerse);
    loading = false;
  }
  
  $: $currentChapter, $currentVerse, loadVerse();
  
  onMount(() => {
    loadVerse();
  });
</script>

<div class="bg-white rounded-lg shadow-md p-6 sm:p-8">
  <div class="flex flex-wrap gap-4 mb-6 pb-4 border-b">
    <label class="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" bind:checked={$showTransliteration} class="w-4 h-4 text-orange-600 rounded accent-orange-600" />
      <span class="text-sm font-medium text-gray-700">Show Transliteration</span>
    </label>
    
    <label class="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" bind:checked={$showTranslation} class="w-4 h-4 text-orange-600 rounded accent-orange-600" />
      <span class="text-sm font-medium text-gray-700">Show Translation</span>
    </label>
  </div>
  
  {#if loading}
    <div class="text-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
      <p class="mt-2 text-gray-500">Loading verse...</p>
    </div>
  {:else}
    <div class="mb-8">
      <h3 class="text-sm font-semibold text-orange-800 mb-3 uppercase tracking-wide">Sanskrit (Devanagari)</h3>
      <div class="bg-orange-50 p-6 rounded-lg">
        <p class="text-2xl sm:text-3xl leading-relaxed text-gray-800 font-serif whitespace-pre-line">
          {verseData.sanskrit}
        </p>
      </div>
    </div>
    
    {#if $showTransliteration}
      <div class="mb-8">
        <h3 class="text-sm font-semibold text-orange-800 mb-3 uppercase tracking-wide">Transliteration (IAST)</h3>
        <div class="bg-yellow-50 p-6 rounded-lg">
          <p class="text-lg sm:text-xl leading-relaxed text-gray-700 italic whitespace-pre-line">
            {verseData.transliteration}
          </p>
        </div>
      </div>
    {/if}
    
    {#if $showTranslation}
      <div>
        <h3 class="text-sm font-semibold text-orange-800 mb-3 uppercase tracking-wide">English Translation</h3>
        <div class="bg-blue-50 p-6 rounded-lg">
          <p class="text-lg leading-relaxed text-gray-800">
            {verseData.translation}
          </p>
        </div>
      </div>
    {/if}
  {/if}
</div>
