<script setup lang="ts">
import AppHeader from '~/components/AppHeader.vue';

</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="w-full min-h-screen max-w-[430px] overflow-hidden relative mx-auto bg-cover bg-center bg-no-repeat" 
         style="background-image: url('/images/bg-14.jpeg');">
      <!-- Background overlay for better text readability -->
      <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30"></div>
      
      <!-- Content -->
      <div class="relative z-10">
        <slot />
      </div>
    </div>
  </div>
</template>
