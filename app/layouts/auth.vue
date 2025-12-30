<template>
  <div class="min-h-screen min-h-[100dvh] flex items-center justify-center">
    <div class="w-full min-h-screen min-h-[100dvh] max-w-[430px] relative mx-auto bg-cover bg-center bg-fixed" 
         style="background-image: url('/images/bg-10.jpeg');">
      <div class="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black/90 pointer-events-none"></div>
      <div class="relative z-10">
        <slot />
      </div>
    </div>
  </div>
</template>
