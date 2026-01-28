<template>
  <div class="min-h-screen flex items-center justify-center p-4 text-white">
    <div class="w-full max-w-sm">
      <div class="text-center mb-8">
        <div class="w-20 h-20 rounded-3xl overflow-hidden mx-auto mb-6 shadow-2xl shadow-orange-500/25">
          <img src="/images/logo.jpg" alt="2D3D Logo" class="w-full h-full object-cover">
        </div>
        <h1 class="text-3xl font-black text-white mb-2">Welcome Back!</h1>
        <p class="text-white/60">Demo Mode - No login required</p>
      </div>

      <div class="bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
        <div class="bg-blue-500/20 border border-blue-500/30 rounded-xl p-3 mb-6 text-center">
          <p class="text-sm text-blue-300">This is a demo version. Click "Demo Sign In" to explore!</p>
        </div>

        <button 
          @click="handleDemoLogin" 
          class="w-full bg-gradient-to-r from-amber-500 to-orange-500 py-4 rounded-xl font-bold text-white shadow-lg shadow-orange-500/25 active:scale-[0.98] transition-all mb-4"
        >
          Demo Sign In
        </button>

        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-white/10"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-slate-800/50 text-white/40">Demo Features</span>
          </div>
        </div>

        <div class="space-y-2 text-sm text-white/60">
          <p>✓ Full UI/UX preview</p>
          <p>✓ Sample betting interface</p>
          <p>✓ Demo balance: 500,000 MMK</p>
          <p>✓ No real transactions</p>
        </div>
      </div>

      <div class="text-center mt-6">
        <NuxtLink 
          to="/" 
          class="inline-flex items-center gap-2 text-white/60 hover:text-white/80 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'auth'
})

const handleDemoLogin = () => {
  navigateTo('/')
}

useHead({
  title: 'Login - 2D3D Demo'
})
</script>
