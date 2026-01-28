<template>
  <div class="text-white">
    <div class="px-4 py-2">
      <div class="bg-white/5 rounded-xl p-1 flex gap-1 border border-white/5">
        <button @click="mode = 'manual'" :class="['flex-1 py-2.5 rounded-lg text-xs font-bold transition-all', mode === 'manual' ? 'bg-purple-500 shadow-lg' : 'text-white/50']">Manual Input</button>
        <button @click="mode = 'grid'" :class="['flex-1 py-2.5 rounded-lg text-xs font-bold transition-all', mode === 'grid' ? 'bg-purple-500 shadow-lg' : 'text-white/50']">Number Grid</button>
      </div>
    </div>

    <div v-if="mode === 'manual'" class="px-4 py-3">
      <div class="bg-white/5 rounded-xl p-5 border border-white/5">
        <div class="flex justify-center gap-3 mb-4">
          <input v-for="i in 3" :key="i" v-model="digits[i-1]" @input="onDigit($event, i-1)" maxlength="1" class="w-14 h-14 bg-white/10 rounded-xl text-2xl font-black text-center border-2 border-white/20 focus:border-purple-400 focus:outline-none">
        </div>
        <div class="text-center"><p class="text-xs text-white/40 mb-1">Your 3D Number</p><p class="text-4xl font-black text-purple-400">{{ currentNum }}</p></div>
      </div>
    </div>

    <div v-if="mode === 'grid'" class="px-4 py-2">
      <div class="bg-white/5 rounded-xl p-4 border border-white/5 mb-3">
        <div class="flex items-center justify-between mb-3"><p class="text-xs text-white/50">Selected Numbers <span class="text-purple-400">({{ selected.length }})</span></p><button v-if="selected.length" @click="selected = []" class="text-[10px] text-red-400 font-medium">Clear All</button></div>
        <div class="flex flex-wrap gap-1.5 min-h-[32px]">
          <span v-for="n in selected.slice(0, 20)" :key="n" class="bg-purple-500 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1">{{ n.toString().padStart(3, '0') }}<button @click="removeSelected(n)" class="text-white/60 hover:text-white">×</button></span>
          <span v-if="!selected.length" class="text-xs text-white/30">Tap numbers below</span>
        </div>
      </div>
      <div class="bg-white/5 rounded-xl p-3 border border-white/5">
        <p class="text-[10px] text-white/40 mb-2">000-099</p>
        <div class="grid grid-cols-10 gap-1">
          <button v-for="n in 100" :key="n-1" @click="toggleGrid(n-1)" :class="['aspect-square rounded text-[8px] font-bold transition-colors active:scale-90', selectedSet.has(n-1) ? 'bg-purple-500' : 'bg-white/5 text-white/40']">{{ (n-1).toString().padStart(3, '0') }}</button>
        </div>
      </div>
    </div>

    <div class="px-4 py-3">
      <div class="bg-white/5 rounded-xl p-4 border border-white/5">
        <div class="flex items-center justify-between mb-3"><p class="text-xs text-white/50">Amount Per Number</p><p class="text-sm font-black text-amber-400">{{ formatBalance(amount) }} MMK</p></div>
        <div class="flex gap-2 mb-3"><button v-for="a in [500, 1000, 2000, 5000]" :key="a" @click="amount = a" :class="['flex-1 py-2 rounded-lg text-xs font-bold transition-all active:scale-95', amount === a ? 'bg-amber-500 text-black' : 'bg-white/5 text-white/60']">{{ formatBalance(a) }}</button></div>
      </div>
    </div>

    <div class="px-4 py-2 pb-6">
      <div class="bg-white/5 rounded-xl p-4 border border-white/5 mb-4">
        <div class="flex justify-between text-sm mb-2"><span class="text-white/50">Total Bet:</span><span class="font-black text-amber-400">{{ formatBalance(total) }} MMK</span></div>
        <div class="flex justify-between text-sm"><span class="text-white/50">Potential Win:</span><span class="font-black text-green-400">{{ formatBalance(total * 500) }} MMK</span></div>
      </div>
      <button @click="placeBetHandler" :disabled="!canBet" :class="['w-full py-4 rounded-xl text-sm font-bold transition-all active:scale-[0.98]', canBet ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25' : 'bg-white/10 text-white/30']">{{ betText }}</button>
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

const mode = ref('manual')
const digits = ref(['', '', ''])
const selected = ref([])
const amount = ref(1000)
const toast = ref(null)

const selectedSet = computed(() => new Set(selected.value))
const currentNum = computed(() => digits.value.map(d => d || '0').join(''))
const isValid = computed(() => digits.value.every(d => d !== ''))
const count = computed(() => mode.value === 'manual' ? (isValid.value ? 1 : 0) : selected.value.length)
const total = computed(() => count.value * amount.value)
const canBet = computed(() => count.value > 0)
const betText = computed(() => {
  if (!count.value) return mode.value === 'manual' ? 'Enter 3 Digits' : 'Select Numbers'
  return `Place Bet - ${formatBalance(total.value)} MMK`
})

const formatBalance = (n) => new Intl.NumberFormat('en-US').format(n || 0)
const onDigit = (e, i) => { if (!/^[0-9]$/.test(e.target.value) && e.target.value !== '') { e.target.value = ''; digits.value[i] = '' } }
const toggleGrid = (n) => { const i = selected.value.indexOf(n); i > -1 ? selected.value.splice(i, 1) : selected.value.push(n) }
const removeSelected = (n) => { selected.value = selected.value.filter(x => x !== n) }
const showToast = (msg, type = 'success') => { toast.value = { msg, type }; setTimeout(() => toast.value = null, 3000) }

const placeBetHandler = () => {
  if (!canBet.value) return
  showToast(`Demo: 3D bet placed!`, 'success')
  digits.value = ['', '', '']
  selected.value = []
}
</script>

<style>
.slide-enter-active, .slide-leave-active { transition: all 0.3s; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-20px); }
</style>
