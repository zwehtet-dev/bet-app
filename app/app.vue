<template>
  <div class="app-wrapper">
    <NuxtLayout>
      <NuxtPage />
      <PWAInstallPrompt />
    </NuxtLayout>
  </div>
</template>

<style>
* { 
  -webkit-tap-highlight-color: transparent;
}

.app-wrapper {
  min-height: 100vh;
  /* background-image: url('bg-1.jpeg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  background-repeat: no-repeat; */
}

.app-wrapper::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: -1;
}
</style>
