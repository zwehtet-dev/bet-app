<template>
  <div class="text-white">
    <div class="px-4 py-3">
      <div class="relative bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-transparent rounded-2xl p-5 border border-green-500/20 overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div class="relative flex justify-between items-start mb-5">
          <div><p class="text-xs text-white/50 mb-1">Available Balance</p><p class="text-3xl font-black">{{ formatAmount(demoBalance) }}</p><p class="text-xs text-white/40">MMK</p></div>
          <div class="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl shadow-green-500/25"><svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg></div>
        </div>
        <div class="relative grid grid-cols-2 gap-3">
          <button @click="showToast('Demo: Deposit feature', 'success')" class="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-green-500/25 active:scale-[0.98]"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" /></svg>Deposit</button>
          <button @click="showToast('Demo: Withdraw feature', 'success')" class="flex items-center justify-center gap-2 bg-white/10 py-3.5 rounded-xl text-sm font-bold border border-white/10 active:scale-[0.98]"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M20 12H4" /></svg>Withdraw</button>
        </div>
      </div>
    </div>

    <div class="px-4 py-2">
      <div class="grid grid-cols-3 gap-2">
        <div class="bg-white/5 rounded-xl p-3 text-center border border-white/5"><p class="text-base font-black text-green-400">{{ formatAmount(150000) }}</p><p class="text-[10px] text-white/40">Deposits</p></div>
        <div class="bg-white/5 rounded-xl p-3 text-center border border-white/5"><p class="text-base font-black text-red-400">{{ formatAmount(50000) }}</p><p class="text-[10px] text-white/40">Withdrawals</p></div>
        <div class="bg-white/5 rounded-xl p-3 text-center border border-white/5"><p class="text-base font-black text-blue-400">{{ demoTransactions.length }}</p><p class="text-[10px] text-white/40">Transactions</p></div>
      </div>
    </div>

    <div class="px-4 py-3">
      <h2 class="text-sm font-bold mb-3">Payment Methods</h2>
      <div class="grid grid-cols-4 gap-2">
        <div v-for="m in paymentMethods" :key="m.id" class="bg-white/5 rounded-xl p-2.5 text-center border border-white/5">
          <div class="w-9 h-9 rounded-lg overflow-hidden mx-auto mb-1.5 bg-white/10 flex items-center justify-center text-xs font-bold">{{ m.name.slice(0, 2) }}</div>
          <p class="text-[10px] font-medium truncate">{{ m.name }}</p>
        </div>
      </div>
    </div>

    <div class="px-4 py-3">
      <h2 class="text-sm font-bold mb-3">Transaction History</h2>
      <div class="space-y-2">
        <div v-for="tx in demoTransactions" :key="tx.id" class="bg-white/5 rounded-xl p-3.5 border border-white/5 flex items-center gap-3">
          <div :class="['w-10 h-10 rounded-xl flex items-center justify-center', tx.type === 'deposit' ? 'bg-green-500/20' : 'bg-red-500/20']"><svg class="w-5 h-5" :class="tx.type === 'deposit' ? 'text-green-400' : 'text-red-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path v-if="tx.type === 'deposit'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" /><path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M20 12H4" /></svg></div>
          <div class="flex-1 min-w-0"><p class="text-sm font-medium">{{ tx.method }}</p><p class="text-[10px] text-white/40">{{ tx.date }}</p></div>
          <div class="text-right"><p :class="['text-sm font-black', tx.type === 'deposit' ? 'text-green-400' : 'text-red-400']">{{ tx.type === 'deposit' ? '+' : '-' }}{{ formatAmount(tx.amount) }}</p><span :class="['text-[10px] px-1.5 py-0.5 rounded', tx.status === 'completed' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black']">{{ tx.status }}</span></div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="slide">
        <div v-if="toast" class="fixed top-4 left-4 right-4 z-50 max-w-[400px] mx-auto"><div :class="['p-4 rounded-xl text-center font-medium text-sm shadow-xl', toast.type === 'success' ? 'bg-green-500' : 'bg-red-500']">{{ toast.msg }}</div></div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({
  keepalive: true
})

const demoBalance = ref(500000)
const toast = ref(null)

const paymentMethods = [
  { id: 1, name: 'KBZ Pay' },
  { id: 2, name: 'Wave Money' },
  { id: 3, name: 'CB Pay' },
  { id: 4, name: 'AYA Pay' }
]

const demoTransactions = [
  { id: 1, type: 'deposit', method: 'KBZ Pay', amount: 100000, date: 'Jan 27, 10:30 AM', status: 'completed' },
  { id: 2, type: 'withdraw', method: 'Wave Money', amount: 50000, date: 'Jan 26, 03:15 PM', status: 'completed' },
  { id: 3, type: 'deposit', method: 'CB Pay', amount: 50000, date: 'Jan 25, 11:20 AM', status: 'pending' }
]

const formatAmount = (n) => new Intl.NumberFormat('en-US').format(n || 0)
const showToast = (msg, type = 'success') => { toast.value = { msg, type }; setTimeout(() => toast.value = null, 3000) }
</script>

<style>
.slide-enter-active, .slide-leave-active { transition: all 0.3s; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-20px); }
</style>
