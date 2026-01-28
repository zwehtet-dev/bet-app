<template>
  <div class="text-white">
    <div class="px-4 py-3">
      <div class="bg-white/5 rounded-xl p-1 flex gap-1 border border-white/5">
        <button @click="activeTab = '2d'" :class="['flex-1 py-2.5 rounded-lg text-xs font-bold transition-all', activeTab === '2d' ? 'bg-blue-500 shadow-lg' : 'text-white/50']">2D Results</button>
        <button @click="activeTab = '3d'" :class="['flex-1 py-2.5 rounded-lg text-xs font-bold transition-all', activeTab === '3d' ? 'bg-purple-500 shadow-lg' : 'text-white/50']">3D Results</button>
      </div>
    </div>

    <div v-if="activeTab === '2d'" class="px-4 py-3 space-y-3">
      <div v-for="result in demo2DResults" :key="result.date" class="bg-white/5 rounded-xl p-4 border border-white/5">
        <div class="flex items-center justify-between mb-3">
          <div>
            <p class="text-sm font-bold">{{ result.date }}</p>
            <p class="text-[10px] text-white/40">{{ result.day }}</p>
          </div>
          <div v-if="result.isLive" class="bg-green-500/20 px-2 py-1 rounded-lg">
            <p class="text-[10px] font-bold text-green-400">LIVE</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div class="bg-white/5 rounded-lg p-3">
            <p class="text-[10px] text-white/40 mb-1">12:01 PM</p>
            <p class="text-2xl font-black text-blue-400">{{ result.morning }}</p>
          </div>
          <div class="bg-white/5 rounded-lg p-3">
            <p class="text-[10px] text-white/40 mb-1">4:30 PM</p>
            <p class="text-2xl font-black text-blue-400">{{ result.evening }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="px-4 py-3 space-y-3">
      <div v-for="result in demo3DResults" :key="result.date" class="bg-white/5 rounded-xl p-4 border border-white/5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-bold">{{ result.date }}</p>
            <p class="text-[10px] text-white/40">{{ result.session }}</p>
          </div>
          <div>
            <p class="text-3xl font-black text-purple-400">{{ result.number }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({
  keepalive: true
})

const activeTab = ref('2d')

const demo2DResults = [
  { date: 'Jan 28, 2026', day: 'Today', morning: '47', evening: '82', isLive: true },
  { date: 'Jan 27, 2026', day: 'Yesterday', morning: '35', evening: '91', isLive: false },
  { date: 'Jan 26, 2026', day: 'Sunday', morning: '12', evening: '56', isLive: false }
]

const demo3DResults = [
  { date: 'Jan 16, 2026', session: 'Second Draw', number: '456' },
  { date: 'Jan 1, 2026', session: 'First Draw', number: '789' },
  { date: 'Dec 16, 2025', session: 'Second Draw', number: '123' }
]
</script>
