<template>
  <div class="text-white">
    <div class="px-4 py-4">
      <div class="bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-transparent rounded-2xl p-5 border border-green-500/20">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
            <img src="/images/bawdi_icon.png" alt="Bawdi" class="w-full h-full object-cover" />
          </div>
          <div class="flex-1">
            <p class="text-sm text-white/50">Bet ID: #DEMO123</p>
            <p class="text-lg font-black">Bawdi Bet</p>
          </div>
          <span class="bg-yellow-500 text-black px-3 py-1 rounded-lg text-xs font-bold">PENDING</span>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <p class="text-xs text-white/40">Total Amount</p>
            <p class="text-xl font-black text-amber-400">10,000 MMK</p>
          </div>
          <div>
            <p class="text-xs text-white/40">Potential Win</p>
            <p class="text-xl font-black text-green-400">18,500 MMK</p>
          </div>
        </div>
      </div>
    </div>

    <div class="px-4 py-3">
      <h3 class="text-sm font-bold mb-3">Bet Details</h3>
      <div class="space-y-2">
        <div class="bg-white/5 rounded-xl p-4 border border-white/5">
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm font-bold">Man United vs Liverpool</p>
            <span class="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-bold">Home Win</span>
          </div>
          <div class="flex items-center justify-between text-xs">
            <span class="text-white/40">Premier League</span>
            <span class="text-white/60">Odds: 1.85</span>
          </div>
          <div class="mt-2 pt-2 border-t border-white/10 flex justify-between text-xs">
            <span class="text-white/40">Bet Amount:</span>
            <span class="font-bold">5,000 MMK</span>
          </div>
        </div>

        <div class="bg-white/5 rounded-xl p-4 border border-white/5">
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm font-bold">Barcelona vs Real Madrid</p>
            <span class="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-bold">Away Win</span>
          </div>
          <div class="flex items-center justify-between text-xs">
            <span class="text-white/40">La Liga</span>
            <span class="text-white/60">Odds: 2.05</span>
          </div>
          <div class="mt-2 pt-2 border-t border-white/10 flex justify-between text-xs">
            <span class="text-white/40">Bet Amount:</span>
            <span class="font-bold">5,000 MMK</span>
          </div>
        </div>
      </div>
    </div>

    <div class="px-4 py-3">
      <div class="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
        <p class="text-xs text-blue-300 mb-2">📌 Bet Information</p>
        <div class="space-y-1 text-xs">
          <div class="flex justify-between"><span class="text-white/50">Placed:</span><span>Jan 27, 2026 3:00 PM</span></div>
          <div class="flex justify-between"><span class="text-white/50">Status:</span><span class="text-yellow-400">Pending</span></div>
          <div class="flex justify-between"><span class="text-white/50">Type:</span><span>Bawdi (Body Style)</span></div>
        </div>
      </div>
    </div>

    <div class="px-4 py-4">
      <NuxtLink to="/history" class="w-full bg-white/10 hover:bg-white/15 py-3.5 rounded-xl text-sm font-bold border border-white/10 flex items-center justify-center active:scale-[0.98]">
        Back to History
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  keepalive: true
})

useHead({
  title: 'Bet Details - 2D3D Demo'
})
</script>
