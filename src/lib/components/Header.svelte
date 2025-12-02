<script>
  import { mobileMenuOpen } from '../stores/gita';
  
  function toggleMenu() {
    mobileMenuOpen.update(v => !v);
  }
</script>

<header class="bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg sticky top-0 z-50">
  <div class="container mx-auto px-4">
    <div class="flex items-center justify-between py-4">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold">श्रीमद् भगवद्गीता</h1>
        <p class="text-sm opacity-90 hidden sm:block">Bhagavad Gita</p>
      </div>
      
      <nav class="hidden md:flex gap-6">
        <a href="#home" class="hover:text-yellow-200 transition">Home</a>
        <a href="#about" class="hover:text-yellow-200 transition">About</a>
        <a href="#chapters" class="hover:text-yellow-200 transition">Chapters</a>
        <a href="#contact" class="hover:text-yellow-200 transition">Contact</a>
      </nav>
      
      <button on:click={toggleMenu} class="md:hidden p-2" aria-label="Toggle menu">
        {#if $mobileMenuOpen}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        {/if}
      </button>
    </div>
    
    {#if $mobileMenuOpen}
      <nav class="md:hidden pb-4 border-t border-orange-500 pt-4 flex flex-col gap-3">
        <a href="#home" class="hover:text-yellow-200 transition" on:click={() => mobileMenuOpen.set(false)}>Home</a>
        <a href="#about" class="hover:text-yellow-200 transition" on:click={() => mobileMenuOpen.set(false)}>About</a>
        <a href="#chapters" class="hover:text-yellow-200 transition" on:click={() => mobileMenuOpen.set(false)}>Chapters</a>
        <a href="#contact" class="hover:text-yellow-200 transition" on:click={() => mobileMenuOpen.set(false)}>Contact</a>
      </nav>
    {/if}
  </div>
</header>
