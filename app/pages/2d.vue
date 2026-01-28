<template>
  <div class="text-white">
    <!-- Selected Numbers -->
    <div class="px-4 py-2">
      <div class="bg-white/5 rounded-xl p-4 border border-white/5">
        <div class="flex items-center justify-between mb-3">
          <p class="text-xs text-white/50">Selected Numbers <span class="text-blue-400">({{ selected.length }})</span></p>
          <button v-if="selected.length" @click="selected = []" class="text-[10px] text-red-400 font-medium touch-manipulation">Clear All</button>
        </div>
        <div class="flex flex-wrap gap-1.5 min-h-[32px] max-h-24 overflow-y-auto">
          <span v-for="n in selected" :key="n" class="bg-blue-500 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1">{{ n.toString().padStart(2, '0') }}<button @click="toggle(n)" class="text-white/60 hover:text-white touch-manipulation">×</button></span>
          <span v-if="!selected.length" class="text-xs text-white/30">Tap numbers below</span>
        </div>
        <div v-if="reverseNums.length" class="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
          <div class="flex items-center gap-2 flex-wrap"><span class="text-[10px] text-white/40">R:</span><span v-for="n in reverseNums.slice(0, 5)" :key="n" class="text-[10px] bg-orange-500/20 text-orange-300 px-1.5 py-0.5 rounded">{{ n.toString().padStart(2, '0') }}</span><span v-if="reverseNums.length > 5" class="text-[10px] text-white/30">+{{ reverseNums.length - 5 }}</span></div>
          <button @click="addReverse" class="text-[10px] bg-orange-500 px-2.5 py-1 rounded-lg font-bold active:scale-95 touch-manipulation">+R</button>
        </div>
      </div>
    </div>

    <!-- Number Grid -->
    <div class="px-4 py-2">
      <div class="grid grid-cols-10 gap-1">
        <button 
          v-for="n in 100" 
          :key="n-1" 
          @click="toggle(n-1)" 
          :class="[
            'aspect-square rounded-lg text-[11px] font-bold transition-colors active:scale-90 touch-manipulation',
            selectedSet.has(n-1) ? 'bg-blue-500 shadow-lg shadow-blue-500/30' : 'bg-white/5 text-white/60'
          ]"
        >{{ (n-1).toString().padStart(2, '0') }}</button>
      </div>
    </div>

    <!-- Amount Selection -->
    <div class="px-4 py-3">
      <div class="bg-white/5 rounded-xl p-4 border border-white/5">
        <div class="flex items-center justify-between mb-3"><p class="text-xs text-white/50">Amount Per Number</p><p class="text-sm font-black text-amber-400">{{ formatBalance(amount) }} MMK</p></div>
        <div class="flex gap-2 mb-3"><button v-for="a in [100, 500, 1000, 5000]" :key="a" @click="amount = a" :class="['flex-1 py-2 rounded-lg text-xs font-bold transition-colors active:scale-95 touch-manipulation', amount === a ? 'bg-amber-500 text-black' : 'bg-white/5 text-white/60']">{{ formatBalance(a) }}</button></div>
        <div class="flex items-center gap-2">
          <button @click="amount = Math.max(100, amount - 100)" class="w-11 h-11 bg-red-500/20 text-red-400 rounded-xl text-lg font-bold active:scale-95 touch-manipulation">−</button>
          <input v-model.number="amount" type="number" min="100" class="flex-1 bg-white/5 rounded-xl px-3 py-2.5 text-center text-sm font-bold border border-white/10 focus:border-blue-500 focus:outline-none">
          <button @click="amount += 100" class="w-11 h-11 bg-green-500/20 text-green-400 rounded-xl text-lg font-bold active:scale-95 touch-manipulation">+</button>
        </div>
      </div>
    </div>

    <!-- Bet Summary & Submit -->
    <div class="px-4 py-2 pb-6">
      <div class="bg-white/5 rounded-xl p-4 border border-white/5 mb-4">
        <div class="flex justify-between text-sm mb-2"><span class="text-white/50">Total Bet:</span><span class="font-black text-amber-400">{{ formatBalance(total) }} MMK</span></div>
        <div class="flex justify-between text-sm"><span class="text-white/50">Potential Win:</span><span class="font-black text-green-400">{{ formatBalance(total * 85) }} MMK</span></div>
      </div>
      <button @click="placeBetHandler" :disabled="!canBet" :class="['w-full py-4 rounded-xl text-sm font-bold transition-colors active:scale-[0.98] touch-manipulation', canBet ? 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/25' : 'bg-white/10 text-white/30']">{{ betText }}</button>
    </div>

    <Teleport to="body">
      <Transition name="slide">
        <div v-if="toast" class="fixed top-4 left-4 right-4 z-50 max-w-[400px] mx-auto"><div :class="['p-4 rounded-xl text-center font-medium text-sm shadow-xl', toast.type === 'success' ? 'bg-green-500' : 'bg-red-500']">{{ toast.msg }}</div></div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

definePageMeta({
  keepalive: true
})

const selected = ref([])
const amount = ref(1000)
const toast = ref(null)

const selectedSet = computed(() => new Set(selected.value))
const total = computed(() => selected.value.length * amount.value)
const canBet = computed(() => selected.value.length > 0)
const betText = computed(() => {
  if (!selected.value.length) return 'Select Numbers'
  return `Place Bet - ${formatBalance(total.value)} MMK`
})
const reverseNums = computed(() => selected.value.map(n => (n % 10) * 10 + Math.floor(n / 10)).filter(r => !selected.value.includes(r)))

const formatBalance = (n) => new Intl.NumberFormat('en-US').format(n || 0)
const toggle = (n) => { const i = selected.value.indexOf(n); i > -1 ? selected.value.splice(i, 1) : selected.value.push(n) }
const addReverse = () => reverseNums.value.forEach(n => { if (!selected.value.includes(n)) selected.value.push(n) })
const showToast = (msg, type = 'success') => { toast.value = { msg, type }; setTimeout(() => toast.value = null, 3000) }

const placeBetHandler = () => {
  if (!canBet.value) return
  showToast(`Demo: Bet placed for ${selected.value.length} numbers!`, 'success')
  selected.value = []
}
</script>

<style>
.slide-enter-active, .slide-leave-active { transition: all 0.3s; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-20px); }
.touch-manipulation { touch-action: manipulation; }
</style>
