<script>
  import { onMount } from 'svelte';
  import { getVerse, getChapterVerses } from '$lib/api/gita';
  
  let selectedChapter = null;
  let showChapterView = true;
  let selectedVerse = null;
  let mobileMenuOpen = false;
  let showScrollTop = false;
  
  // Modal/Dialog state
  let showModal = false;
  let verseData = null;
  let loadingVerse = false;
  
  // Font size control
  let fontSize = 17;
  let showFontControl = false;
  
  // Dropdown states
  let ayurvedaOpen = false;
  let yogasutrasOpen = false;
  let upanisadsOpen = false;
  let sanskritOpen = false;
  
  const chapters = [
    { number: 1, name: "Arjuna Viṣāda Yoga", verses: 47 },
    { number: 2, name: "Sāṅkhya Yoga", verses: 72 },
    { number: 3, name: "Karma Yoga", verses: 43 },
    { number: 4, name: "Jñāna Karma Sannyāsa Yoga", verses: 42 },
    { number: 5, name: "Karma Sannyāsa Yoga", verses: 29 },
    { number: 6, name: "Dhyāna Yoga", verses: 47 },
    { number: 7, name: "Jñāna Vijñāna Yoga", verses: 30 },
    { number: 8, name: "Akṣara Brahma Yoga", verses: 28 },
    { number: 9, name: "Rāja Vidyā Rāja Guhya Yoga", verses: 34 },
    { number: 10, name: "Vibhūti Yoga", verses: 42 },
    { number: 11, name: "Viśvarūpa Darśana Yoga", verses: 55 },
    { number: 12, name: "Bhakti Yoga", verses: 20 },
    { number: 13, name: "Kṣetra Kṣetrajña Vibhāga Yoga", verses: 35 },
    { number: 14, name: "Guṇatraya Vibhāga Yoga", verses: 27 },
    { number: 15, name: "Puruṣottama Yoga", verses: 20 },
    { number: 16, name: "Daivāsura Sampad Vibhāga Yoga", verses: 24 },
    { number: 17, name: "Śraddhātraya Vibhāga Yoga", verses: 28 },
    { number: 18, name: "Mokṣa Sannyāsa Yoga", verses: 78 }
  ];

  const ayurvedaItems = ["Introduction", "Timing", "Food"];
  const upanisadItems = ["ĪŚOPANIṢAD", "TAITTIRĪYOPANIṢAD", "MĀṆḌŪKYOPANIṢAD", "KENOPANIṢAD", "KAṬHOPANIṢAD", "AITAREYOPANIṢAD", "MUṆḌAKOPANIṢAD", "PRAŚNOPANIṢAD"];
  
  function selectChapter(chapter) {
    selectedChapter = chapter;
    showChapterView = false;
    selectedVerse = null;
  }
  
  function backToChapters() {
    showChapterView = true;
    selectedChapter = null;
    selectedVerse = null;
    verseData = null;
  }
  
  async function selectVerse(verseNum) {
    selectedVerse = verseNum;
    showModal = true;
    loadingVerse = true;
    verseData = null;
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    try {
      if (verseNum === 0) {
        // Whole chapter - fetch all verses
        const verses = await getChapterVerses(selectedChapter.number);
        verseData = {
          isWholeChapter: true,
          verses: verses.filter(v => v.verseNo > 0),
          chapterNo: selectedChapter.number
        };
      } else {
        // Single verse
        verseData = await getVerse(selectedChapter.number, verseNum);
      }
    } catch (error) {
      console.error('Error fetching verse:', error);
      verseData = {
        sanskrit: 'Error loading verse',
        transliteration: '',
        translation: 'Please try again later.'
      };
    }
    
    loadingVerse = false;
  }
  
  function closeModal() {
    showModal = false;
    selectedVerse = null;
    verseData = null;
    showFontControl = false;
    document.body.style.overflow = 'auto';
  }
  
  function toggleFontControl() {
    showFontControl = !showFontControl;
  }
  
  function handleKeydown(event) {
    if (event.key === 'Escape' && showModal) {
      closeModal();
    }
  }
  
  async function navigateVerse(direction) {
    const newVerse = selectedVerse + direction;
    if (newVerse >= 1 && newVerse <= selectedChapter.verses) {
      await selectVerse(newVerse);
    }
  }
  
  function closeAllDropdowns() {
    ayurvedaOpen = false;
    yogasutrasOpen = false;
    upanisadsOpen = false;
    sanskritOpen = false;
  }
  
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  onMount(() => {
    const handleScroll = () => {
      showScrollTop = window.scrollY > 300;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });
</script>

<svelte:window on:keydown={handleKeydown} on:click={closeAllDropdowns} />

<svelte:head>
  <title>Bhagavad Gītā - Sanskrit.ie</title>
  <meta name="description" content="Read the Bhagavad Gita in Sanskrit with transliteration and English translation" />
</svelte:head>

<div class="min-h-screen" style="background: linear-gradient(180deg, #f5f0e6 0%, #e8dcc8 50%, #f5ecd8 100%);">
  <!-- Header -->
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <div class="container mx-auto px-4 py-3">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <a href="/" class="flex items-center">
          <img 
            src="/images/logo.png" 
            alt="Logo"
            class="h-12 w-auto"
          />
        </a>
        
        <!-- Desktop Navigation -->
        <nav class="hidden lg:flex items-center gap-6">
          <!-- Search Icon -->
          <button class="text-gray-600 hover:text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          
          <!-- ĀYURVEDA Dropdown -->
          <div class="relative">
            <button 
              class="nav-link"
              on:click|stopPropagation={() => { closeAllDropdowns(); ayurvedaOpen = !ayurvedaOpen; }}
            >
              ĀYURVEDA
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {#if ayurvedaOpen}
              <div class="dropdown-menu">
                {#each ayurvedaItems as item}
                  <a href="/" class="dropdown-item">{item}</a>
                {/each}
              </div>
            {/if}
          </div>
          
          <!-- YOGASŪTRAS Dropdown -->
          <div class="relative">
            <button 
              class="nav-link"
              on:click|stopPropagation={() => { closeAllDropdowns(); yogasutrasOpen = !yogasutrasOpen; }}
            >
              YOGASŪTRAS
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {#if yogasutrasOpen}
              <div class="dropdown-menu">
                <a href="/" class="dropdown-item">Introduction</a>
                <a href="/" class="dropdown-item">Obstacles</a>
                <a href="/" class="dropdown-item">Practices</a>
                <a href="/" class="dropdown-item">Yogāsana</a>
                <a href="/" class="dropdown-item">Glossary</a>
              </div>
            {/if}
          </div>
          
          <!-- BHAGAVAD GĪTĀ -->
          <a href="/" class="nav-link active">BHAGAVAD GĪTĀ</a>
          
          <!-- UPANIṢADS Dropdown -->
          <div class="relative">
            <button 
              class="nav-link"
              on:click|stopPropagation={() => { closeAllDropdowns(); upanisadsOpen = !upanisadsOpen; }}
            >
              UPANIṢADS
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {#if upanisadsOpen}
              <div class="dropdown-menu">
                {#each upanisadItems as item}
                  <a href="/" class="dropdown-item">{item}</a>
                {/each}
              </div>
            {/if}
          </div>
          
          <!-- SANSKRIT Dropdown -->
          <div class="relative">
            <button 
              class="nav-link"
              on:click|stopPropagation={() => { closeAllDropdowns(); sanskritOpen = !sanskritOpen; }}
            >
              SANSKRIT
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {#if sanskritOpen}
              <div class="dropdown-menu">
                <a href="/" class="dropdown-item">Resources</a>
                <a href="/" class="dropdown-item">Learn Sanskrit</a>
              </div>
            {/if}
          </div>
          
          <!-- CONTACT US -->
          <a href="/" class="nav-link">CONTACT US</a>
        </nav>
        
        <!-- Mobile Menu Button -->
        <button 
          class="lg:hidden text-gray-600 p-2"
          on:click|stopPropagation={() => mobileMenuOpen = !mobileMenuOpen}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      <!-- Mobile Navigation -->
      {#if mobileMenuOpen}
        <nav class="lg:hidden mt-4 pb-4 border-t pt-4 flex flex-col gap-3">
          <a href="/" class="nav-link">ĀYURVEDA</a>
          <a href="/" class="nav-link">YOGASŪTRAS</a>
          <a href="/" class="nav-link active">BHAGAVAD GĪTĀ</a>
          <a href="/" class="nav-link">UPANIṢADS</a>
          <a href="/" class="nav-link">SANSKRIT</a>
          <a href="/" class="nav-link">CONTACT US</a>
        </nav>
      {/if}
    </div>
  </header>

  <!-- Main Content -->
  <main class="pt-20">
    {#if showChapterView}
      <!-- Hero Section with Title -->
      <section class="relative" style="background: linear-gradient(180deg, #f5f0e6 0%, #e8dcc8 100%);">
        <!-- Krishna Arjuna Image -->
        <div class="w-full">
          <img 
            src="/images/gita_banner.png" 
            alt="Krishna and Arjuna on the battlefield"
            class="w-full h-auto object-cover"
            style="max-height: 450px;"
          />
        </div>
        
        <!-- Title with semi-transparent white bar - overlaid on image -->
        <div class="absolute top-0 left-0 right-0 w-full py-1 md:py-1 z-10" style="background: rgba(255, 255, 255, 0.75); transform: translateY(-50%);">
          <h2 class="main-title text-center">
            BHAGAVAD GITA
          </h2>
        </div>
        
        <!-- Open Book Image -->
        <div class="flex justify-center -mt-20 relative z-10">
          <img 
            src="/images/gita_open.png" 
            alt="Open Bhagavad Gita Book"
            class="h-36 md:h-44 w-auto drop-shadow-lg"
          />
        </div>
      </section>
      
      <!-- GITA CHAPTERS Section -->
      <section class="py-12 px-4">
        <div class="text-center mb-12">
          <h2 class="inline-block text-xl md:text-2xl tracking-widest pb-2 border-b-2 border-red-500" style="color: #c41e3a; font-family: 'Times New Roman', serif; letter-spacing: 0.15em;">
            GITA CHAPTERS
          </h2>
        </div>
        
        <!-- Diamond Grid -->
        <div class="max-w-7xl mx-auto px-4">
          <!-- Row 1: 5 chapters -->
          <div class="flex flex-wrap justify-center gap-16 md:gap-20 lg:gap-28 mb-16 md:mb-24">
            {#each chapters.slice(0, 5) as chapter}
              <button class="diamond-card" on:click={() => selectChapter(chapter)}>
                <div class="diamond-card-inner">
                  <img 
                    src="/images/gita_book.jpg" 
                    alt="Chapter {chapter.number}"
                  />
                  <div class="chapter-banner">
                    <span class="chapter-number">{chapter.number}</span>
                  </div>
                </div>
              </button>
            {/each}
          </div>
          
          <!-- Row 2: 5 chapters -->
          <div class="flex flex-wrap justify-center gap-16 md:gap-20 lg:gap-28 mb-16 md:mb-24">
            {#each chapters.slice(5, 10) as chapter}
              <button class="diamond-card" on:click={() => selectChapter(chapter)}>
                <div class="diamond-card-inner">
                  <img 
                    src="/images/gita_book.jpg" 
                    alt="Chapter {chapter.number}"
                  />
                  <div class="chapter-banner">
                    <span class="chapter-number">{chapter.number}</span>
                  </div>
                </div>
              </button>
            {/each}
          </div>
          
          <!-- Row 3: 5 chapters -->
          <div class="flex flex-wrap justify-center gap-16 md:gap-20 lg:gap-28 mb-16 md:mb-24">
            {#each chapters.slice(10, 15) as chapter}
              <button class="diamond-card" on:click={() => selectChapter(chapter)}>
                <div class="diamond-card-inner">
                  <img 
                    src="/images/gita_book.jpg" 
                    alt="Chapter {chapter.number}"
                  />
                  <div class="chapter-banner">
                    <span class="chapter-number">{chapter.number}</span>
                  </div>
                </div>
              </button>
            {/each}
          </div>
          
          <!-- Row 4: 3 chapters -->
          <div class="flex flex-wrap justify-center gap-16 md:gap-20 lg:gap-28">
            {#each chapters.slice(15, 18) as chapter}
              <button class="diamond-card" on:click={() => selectChapter(chapter)}>
                <div class="diamond-card-inner">
                  <img 
                    src="/images/gita_book.jpg" 
                    alt="Chapter {chapter.number}"
                  />
                  <div class="chapter-banner">
                    <span class="chapter-number">{chapter.number}</span>
                  </div>
                </div>
              </button>
            {/each}
          </div>
        </div>
      </section>
      
    {:else}
      <!-- Chapter View -->
      <section class="relative" style="background: linear-gradient(180deg, #f5f0e6 0%, #e8dcc8 100%);">
        <!-- Krishna Arjuna Image ---->
        <div class="w-full">
          <img 
            src="/images/gita_banner.png" 
            alt="Krishna and Arjuna on the battlefield"
            class="w-full h-auto object-cover"
            style="max-height: 450px;"
          />
        </div>
        
        <!-- Title with semi-transparent white bar - overlaid on image -->
        <div class="absolute top-0 left-0 right-0 w-full py-6 md:py-10 z-10" style="background: rgba(255, 255, 255, 0.75); transform: translateY(-50%);">
          <h1 class="main-title text-center">
            BHAGAVAD GITA
          </h1>
        </div>
        
        <!-- Open Book Image -->
        <div class="flex justify-center -mt-20 relative z-10">
          <img 
            src="/images/gita_open.png" 
            alt="Open Bhagavad Gita Book"
            class="h-36 md:h-44 w-auto drop-shadow-lg"
          />
        </div>
      </section>
      
      <!-- Back button and Chapter Title -->
      <section class="py-8 px-4">
        <div class="max-w-6xl mx-auto">
          <!-- Back Link -->
          <button 
            on:click={backToChapters}
            class="text-blue-600 hover:text-blue-800 mb-8 flex items-center gap-1 text-sm"
          >
            <span>&lt;</span> Back
          </button>
          
          <!-- Chapter Title -->
          <div class="text-center mb-8">
            <h2 class="inline-block text-xl md:text-2xl tracking-widest pb-2 border-b-2 border-red-500" style="color: #c41e3a; font-family: 'Times New Roman', serif; letter-spacing: 0.15em;">
              CHAPTER {selectedChapter.number}
            </h2>
          </div>
          
          <!-- Red divider -->
          <div class="border-t-2 border-red-400 mb-4"></div>
          
          <!-- Verse label -->
          <div class="mb-8">
            <span class="text-red-500 text-lg" style="font-family: 'Times New Roman', serif;">Verse</span>
            <div class="border-b-2 border-red-400 mt-2 w-full"></div>
          </div>
          
          <!-- Verse Scroll Cards Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 justify-items-center">
            <!-- Whole Chapter Card -->
            <button 
              class="verse-card"
              on:click={() => selectVerse(0)}
            >
              <img src="/images/sletter.png" alt="Scroll" class="w-full h-full object-contain" />
              <div class="verse-card-content">
                <div class="text-base md:text-lg font-medium leading-tight">Whole</div>
                <div class="text-base md:text-lg font-medium">Chapter</div>
                <div class="verse-card-play mt-3">
                  <svg class="w-4 h-4 text-white/80 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </button>
            
            <!-- Individual Verse Cards -->
            {#each Array(Math.min(selectedChapter.verses, 47)) as _, i}
              <button 
                class="verse-card"
                on:click={() => selectVerse(i + 1)}
              >
                <img src="/images/sletter.png" alt="Scroll" class="w-full h-full object-contain" />
                <div class="verse-card-content">
                  <div class="text-xl md:text-2xl font-medium">{i + 1}</div>
                  <div class="verse-card-play mt-3">
                    <svg class="w-4 h-4 text-white/80 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </button>
            {/each}
          </div>
          
          <!-- Show more indicator if there are more verses -->
          {#if selectedChapter.verses > 47}
            <div class="text-center mt-8 text-gray-500">
              Showing 47 of {selectedChapter.verses} verses. More will be loaded via API.
            </div>
          {/if}
        </div>
      </section>
    {/if}
  </main>

  <!-- Verse Modal/Dialog -->
  {#if showModal}
    <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
    <div 
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      on:click={closeModal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/60"></div>
      
      <!-- Modal Content -->
      <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
      <div 
        class="relative bg-[#fef3e2] rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
        on:click|stopPropagation
      >
        <!-- Close Button -->
        <button 
          on:click={closeModal}
          class="absolute top-4 right-4 z-10 text-gray-600 hover:text-gray-900 text-2xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/50 transition"
        >
          ✕
        </button>
        
        <!-- Projector Icon for Font Control -->
        <button 
          on:click={toggleFontControl}
          class="absolute top-4 right-16 z-10 hover:opacity-80 transition"
          title="Font Size Control"
        >
          <img src="/images/projector_black.png" alt="Font Control" class="w-8 h-8" />
        </button>
        
        <!-- Font Size Control Slider -->
        {#if showFontControl}
          <div class="absolute top-16 right-4 z-20 bg-white rounded-lg shadow-lg p-4 w-64">
            <div class="flex items-center gap-2 mb-2">
              <b class="text-sm">Font Size:</b>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm">12px</span>
              <input 
                type="range" 
                min="12" 
                max="65" 
                bind:value={fontSize}
                class="flex-1 accent-orange-600"
              />
              <span class="text-sm">65px</span>
            </div>
            <div class="text-center text-xs text-gray-500 mt-1">Current: {fontSize}px</div>
          </div>
        {/if}
        
        <!-- Scrollable Content -->
        <div class="overflow-y-auto max-h-[90vh] p-6 sm:p-8">
          {#if loadingVerse}
            <div class="text-center py-16">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
              <p class="mt-4 text-gray-600">Loading verse...</p>
            </div>
          {:else if verseData}
            {#if verseData.isWholeChapter}
              <!-- Whole Chapter in Modal -->
              <div class="space-y-8 pt-8">
                {#each verseData.verses as verse, i}
                  <div class="border-b border-orange-200 pb-6 last:border-0">
                    <p class="text-center text-orange-700 font-medium mb-4">Verse {verse.verseNo}</p>
                    
                    <!-- Sanskrit -->
                    <p class="text-center text-xl sm:text-2xl leading-relaxed text-gray-800 font-serif mb-4">
                      {verse.sanskrit}
                    </p>
                    
                    <!-- Transliteration -->
                    {#if verse.transliteration}
                      <p class="text-center text-base sm:text-lg leading-relaxed mb-4" style="color: #c41e3a;">
                        {verse.transliteration}
                      </p>
                    {/if}
                    
                    <!-- Translation -->
                    {#if verse.translation}
                      <p class="text-center text-base leading-relaxed text-gray-700 italic">
                        '{verse.translation}'
                      </p>
                    {/if}
                    
                    {#if verse.audioUrl}
                      <div class="mt-4">
                        <audio controls class="w-full h-10">
                          <source src={verse.audioUrl} type="audio/mpeg">
                        </audio>
                      </div>
                    {/if}
                  </div>
                {/each}
              </div>
            {:else}
              <!-- Single Verse Display - Like Screenshot with HTML content -->
              <div class="text-center pt-6 verse-content" style="font-size: {fontSize}px;">
                <!-- Raw HTML Content from API (with colors and formatting) -->
                {#if verseData.rawContent}
                  <div class="lyrics-content leading-relaxed">
                    {@html verseData.rawContent}
                  </div>
                {:else}
                  <!-- Fallback to parsed content -->
                  <!-- Sanskrit (Devanagari) -->
                  <p class="leading-relaxed text-gray-800 font-serif mb-6">
                    {verseData.sanskrit}
                  </p>
                  
                  <!-- Transliteration -->
                  {#if verseData.transliteration}
                    <p class="leading-relaxed mb-6" style="color: #c41e3a;">
                      {verseData.transliteration}
                    </p>
                  {/if}
                  
                  <!-- Verse Reference -->
                  <p class="text-sm text-gray-500 mb-4">
                    {selectedChapter.number}.{selectedVerse}
                  </p>
                  
                  <!-- Translation -->
                  {#if verseData.translation}
                    <p class="leading-relaxed text-gray-700 italic mb-8">
                      '{verseData.translation}'
                    </p>
                  {/if}
                {/if}
                
                <!-- Audio Player -->
                {#if verseData.audioUrl}
                  <div class="mt-6 bg-[#e8d5c4] rounded-full p-2">
                    <audio controls class="w-full h-10" style="background: transparent;">
                      <source src={verseData.audioUrl} type="audio/mpeg">
                      Your browser does not support audio playback.
                    </audio>
                  </div>
                {/if}
              </div>
              
              <!-- Navigation Arrows -->
              <div class="flex justify-between items-center mt-8">
                {#if selectedVerse > 1}
                  <button 
                    on:click={() => navigateVerse(-1)}
                    class="p-2 text-orange-700 hover:bg-orange-100 rounded-full transition"
                  >
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                {:else}
                  <div class="w-12"></div>
                {/if}
                
                {#if selectedVerse < selectedChapter.verses}
                  <button 
                    on:click={() => navigateVerse(1)}
                    class="p-2 text-orange-700 hover:bg-orange-100 rounded-full transition"
                  >
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                {:else}
                  <div class="w-12"></div>
                {/if}
              </div>
            {/if}
          {:else}
            <div class="text-center py-16 text-gray-500">
              <p>No verse data available.</p>
              <p class="text-sm mt-2">Please try again later.</p>
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/if}

  <!-- Footer -->
  <footer class="mt-12" style="background-color: #4a5540;">
    <div class="container mx-auto px-4 py-10">
      <!-- Connect Section -->
      <div class="flex items-center justify-center gap-3 mb-8">
        <span class="text-white text-lg md:text-xl italic mr-2" style="font-family: 'Times New Roman', serif;">Connect</span>
        
        <a href="https://www.facebook.com/rutger.kortenhorst" target="_blank" rel="noopener noreferrer" class="social-icon-footer">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
          </svg>
        </a>
        <a href="https://twitter.com/RutgerSanskrit" target="_blank" rel="noopener noreferrer" class="social-icon-footer">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
          </svg>
        </a>
        <a href="https://www.youtube.com/channel/UCfORACtw16NKTrAG7ThVAjw" target="_blank" rel="noopener noreferrer" class="social-icon-footer">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
          </svg>
        </a>
        <a href="http://www.johnscottus.ie/" target="_blank" rel="noopener noreferrer" class="social-icon-footer">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" fill="none" stroke="currentColor" stroke-width="2"/>
          </svg>
        </a>
      </div>
      
      <!-- Logo -->
      <div class="flex flex-col items-center mb-6">
        <img 
          src="/images/android-chrome-192x192.png" 
          alt="Wellbeing Svasti Logo"
          class="w-20 h-20 mb-3"
        />
        <h3 class="text-2xl md:text-3xl tracking-widest" style="font-family: 'Times New Roman', serif; color: #9a9a7a; letter-spacing: 0.25em;">
          <span style="color: #9a9a7a;">WELLBEING</span><span style="color: #9a9a7a;">~</span><span style="color: #9a9a7a;">SVASTI</span>
        </h3>
      </div>
      
      <!-- Copyright -->
      <div class="text-center">
        <p class="text-gray-400 text-xs md:text-sm">
          © 2025 Rutger Kortenhorst. All Rights Reserved | Design and Developed by
        </p>
        <a href="https://burningdesire.ie" target="_blank" rel="noopener noreferrer" class="text-orange-400 hover:text-orange-300 text-xs md:text-sm">
          Burning Desire Inclusive
        </a>
      </div>
    </div>
  </footer>

  <!-- Scroll to Top Button -->
  {#if showScrollTop}
    <button 
      class="scroll-top-btn"
      on:click={scrollToTop}
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  {/if}
</div>
