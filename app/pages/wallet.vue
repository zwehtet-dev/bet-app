<template>
  <div class="text-white">
    <!-- Loading Skeleton State -->
    <div v-if="!pageReady" class="animate-pulse">
      <!-- Balance Card Skeleton -->
      <div class="px-4 py-3">
        <div class="relative bg-white/5 rounded-2xl p-5 border border-white/5">
          <div class="flex justify-between items-start mb-5">
            <div>
              <div class="h-3 bg-white/10 rounded w-24 mb-2"></div>
              <div class="h-8 bg-white/10 rounded w-32 mb-1"></div>
              <div class="h-3 bg-white/10 rounded w-12"></div>
            </div>
            <div class="w-14 h-14 bg-white/10 rounded-2xl"></div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="h-12 bg-white/10 rounded-xl"></div>
            <div class="h-12 bg-white/10 rounded-xl"></div>
          </div>
        </div>
      </div>
      <!-- Stats Skeleton -->
      <div class="px-4 py-2">
        <div class="grid grid-cols-3 gap-2">
          <div class="bg-white/5 rounded-xl p-3 text-center border border-white/5">
            <div class="h-5 bg-white/10 rounded w-16 mx-auto mb-1"></div>
            <div class="h-3 bg-white/10 rounded w-12 mx-auto"></div>
          </div>
          <div class="bg-white/5 rounded-xl p-3 text-center border border-white/5">
            <div class="h-5 bg-white/10 rounded w-16 mx-auto mb-1"></div>
            <div class="h-3 bg-white/10 rounded w-12 mx-auto"></div>
          </div>
          <div class="bg-white/5 rounded-xl p-3 text-center border border-white/5">
            <div class="h-5 bg-white/10 rounded w-10 mx-auto mb-1"></div>
            <div class="h-3 bg-white/10 rounded w-12 mx-auto"></div>
          </div>
        </div>
      </div>
      <!-- Payment Methods Skeleton -->
      <div class="px-4 py-3">
        <div class="h-4 bg-white/10 rounded w-28 mb-3"></div>
        <div class="grid grid-cols-4 gap-2">
          <div v-for="i in 4" :key="i" class="bg-white/5 rounded-xl p-2.5 text-center border border-white/5">
            <div class="w-9 h-9 bg-white/10 rounded-lg mx-auto mb-1.5"></div>
            <div class="h-3 bg-white/10 rounded w-12 mx-auto"></div>
          </div>
        </div>
      </div>
      <!-- Transaction History Skeleton -->
      <div class="px-4 py-3">
        <div class="flex items-center justify-between mb-3">
          <div class="h-4 bg-white/10 rounded w-32"></div>
          <div class="h-7 bg-white/10 rounded w-20"></div>
        </div>
        <div class="space-y-2">
          <div v-for="i in 3" :key="i" class="bg-white/5 rounded-xl p-3.5 border border-white/5 flex items-center gap-3">
            <div class="w-10 h-10 bg-white/10 rounded-xl"></div>
            <div class="flex-1">
              <div class="h-4 bg-white/10 rounded w-20 mb-1"></div>
              <div class="h-3 bg-white/10 rounded w-24"></div>
            </div>
            <div class="text-right">
              <div class="h-4 bg-white/10 rounded w-16 mb-1 ml-auto"></div>
              <div class="h-4 bg-white/10 rounded w-12 ml-auto"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template v-else>
    <!-- Blocked Warning -->
    <div v-if="isBlocked" class="px-4 py-3">
      <div class="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center"><svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div>
          <div><p class="text-sm font-bold text-red-400">Transactions Blocked</p><p class="text-[10px] text-white/50">{{ blockReason }}</p></div>
        </div>
      </div>
    </div>

    <div class="px-4 py-3">
      <div class="relative bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-transparent rounded-2xl p-5 border border-green-500/20 overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div class="relative flex justify-between items-start mb-5">
          <div><p class="text-xs text-white/50 mb-1">{{ t('availableBalance') }}</p><p class="text-3xl font-black">{{ formatAmount(userBalance) }}</p><p class="text-xs text-white/40">{{ t('mmk') }}</p></div>
          <div class="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl shadow-green-500/25"><svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg></div>
        </div>
        <div class="relative grid grid-cols-2 gap-3">
          <button @click="modal = 'deposit'" class="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-green-500/25 active:scale-[0.98]"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" /></svg>{{ t('deposit') }}</button>
          <button @click="modal = 'withdraw'" class="flex items-center justify-center gap-2 bg-white/10 py-3.5 rounded-xl text-sm font-bold border border-white/10 active:scale-[0.98]"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M20 12H4" /></svg>{{ t('withdraw') }}</button>
        </div>
      </div>
    </div>

    <div class="px-4 py-2">
      <div class="grid grid-cols-3 gap-2">
        <div class="bg-white/5 rounded-xl p-3 text-center border border-white/5"><p class="text-base font-black text-green-400">{{ formatAmount(totalDeposits) }}</p><p class="text-[10px] text-white/40">{{ t('deposits') }}</p></div>
        <div class="bg-white/5 rounded-xl p-3 text-center border border-white/5"><p class="text-base font-black text-red-400">{{ formatAmount(totalWithdrawals) }}</p><p class="text-[10px] text-white/40">{{ t('withdrawals') }}</p></div>
        <div class="bg-white/5 rounded-xl p-3 text-center border border-white/5"><p class="text-base font-black text-blue-400">{{ totalTransactions }}</p><p class="text-[10px] text-white/40">{{ t('transactions') }}</p></div>
      </div>
    </div>

    <div class="px-4 py-3">
      <h2 class="text-sm font-bold mb-3">{{ t('paymentMethods') }}</h2>
      <div v-if="paymentMethodsLoading" class="grid grid-cols-4 gap-2">
        <div v-for="i in 4" :key="i" class="bg-white/5 rounded-xl p-2.5 text-center border border-white/5 animate-pulse">
          <div class="w-9 h-9 bg-white/10 rounded-lg mx-auto mb-1.5"></div>
          <div class="h-3 bg-white/10 rounded w-12 mx-auto"></div>
        </div>
      </div>
      <div v-else class="grid grid-cols-4 gap-2">
        <div v-for="m in activePaymentMethods" :key="m.id" class="bg-white/5 rounded-xl p-2.5 text-center border border-white/5">
          <div class="w-9 h-9 rounded-lg overflow-hidden mx-auto mb-1.5 bg-white/10">
            <img v-if="m.imageLink" :src="m.imageLink" :alt="m.name" class="w-full h-full object-cover" @error="handleImageError">
            <div v-else class="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white">
              {{ m.name.slice(0, 2) }}
            </div>
          </div>
          <p class="text-[10px] font-medium truncate">{{ m.name }}</p>
        </div>
      </div>
    </div>

    <div class="px-4 py-3">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-sm font-bold">{{ t('transactionHistory') }}</h2>
        <select v-model="filter" class="bg-white/5 text-xs rounded-lg px-2 py-1.5 border border-white/10"><option value="all">All</option><option value="deposit">Deposits</option><option value="withdrawal">Withdrawals</option></select>
      </div>
      <div v-if="transactionLoading && !transactions.length" class="space-y-2">
        <div v-for="i in 3" :key="i" class="bg-white/5 rounded-xl p-3.5 border border-white/5 flex items-center gap-3 animate-pulse">
          <div class="w-10 h-10 bg-white/10 rounded-xl"></div>
          <div class="flex-1">
            <div class="h-4 bg-white/10 rounded w-20 mb-1"></div>
            <div class="h-3 bg-white/10 rounded w-24"></div>
          </div>
          <div class="text-right">
            <div class="h-4 bg-white/10 rounded w-16 mb-1 ml-auto"></div>
            <div class="h-4 bg-white/10 rounded w-12 ml-auto"></div>
          </div>
        </div>
      </div>
      <div v-else class="space-y-2">
        <div v-for="tx in filteredTx" :key="tx.id" class="bg-white/5 rounded-xl p-3.5 border border-white/5 flex items-center gap-3">
          <div :class="['w-10 h-10 rounded-xl flex items-center justify-center', tx.type === 'deposit' ? 'bg-green-500/20' : 'bg-red-500/20']"><svg class="w-5 h-5" :class="tx.type === 'deposit' ? 'text-green-400' : 'text-red-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path v-if="tx.type === 'deposit'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" /><path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M20 12H4" /></svg></div>
          <div class="flex-1 min-w-0"><p class="text-sm font-medium">{{ tx.paymentMethod }}</p><p class="text-[10px] text-white/40">{{ formatDate(tx.createdAt) }}</p></div>
          <div class="text-right"><p :class="['text-sm font-black', tx.type === 'deposit' ? 'text-green-400' : 'text-red-400']">{{ tx.type === 'deposit' ? '+' : '-' }}{{ formatAmount(tx.amount) }}</p><span :class="['text-[10px] px-1.5 py-0.5 rounded', getStatusBadgeColor(tx.status)]">{{ tx.status }}</span></div>
        </div>
        <div v-if="!filteredTx.length" class="text-center py-10"><p class="text-sm text-white/40">No transactions</p></div>
      </div>
    </div>
    </template>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="modal" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="modal = null">
          <div class="bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl p-5 w-full max-w-sm border border-white/10 max-h-[85vh] overflow-y-auto text-white">
            <div class="flex items-center justify-between mb-5"><h3 class="text-lg font-bold text-white">{{ modal === 'deposit' ? t('deposit') : t('withdraw') }}</h3><button @click="modal = null" class="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20"><svg class="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button></div>
            
            <div v-if="modal === 'deposit'" class="space-y-4">
              <div><label class="block text-xs text-white/60 mb-2">Payment Method</label><select v-model="form.methodId" class="w-full bg-white/10 rounded-xl px-4 py-3 text-sm text-white border border-white/10"><option value="" class="bg-slate-800 text-white">Select method</option><option v-for="m in activePaymentMethods" :key="m.id" :value="m.id" class="bg-slate-800 text-white">{{ m.name }}</option></select></div>
              <div v-if="selectedMethod" class="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
                <div class="flex items-center gap-3 mb-2">
                  <div class="w-8 h-8 rounded-lg overflow-hidden bg-white/10">
                    <img v-if="selectedMethod.imageLink" :src="selectedMethod.imageLink" :alt="selectedMethod.name" class="w-full h-full object-cover" @error="handleImageError">
                    <div v-else class="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-[8px] font-bold text-white">
                      {{ selectedMethod.name.slice(0, 2) }}
                    </div>
                  </div>
                  <div>
                    <p class="text-xs text-blue-300">Transfer to:</p>
                    <p class="text-xs text-white/60">{{ selectedMethod.name }}</p>
                  </div>
                </div>
                <div class="space-y-1">
                  <p v-for="phone in selectedMethod.phoneNoList" :key="phone" class="text-sm font-bold text-amber-400">{{ phone }}</p>
                </div>
              </div>
              <div v-if="selectedMethod"><label class="block text-xs text-white/60 mb-2">Transaction ID (last 6 digits)</label><input v-model="form.txId" type="text" maxlength="20" placeholder="123456" class="w-full bg-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/40 border border-white/10 focus:border-green-500 focus:outline-none"></div>
              <button @click="submitDeposit" :disabled="!canDeposit || loading" class="w-full bg-gradient-to-r from-green-500 to-emerald-600 py-3.5 rounded-xl font-bold text-white shadow-lg shadow-green-500/25 active:scale-[0.98] disabled:opacity-50">{{ loading ? 'Processing...' : t('deposit') }}</button>
            </div>
            
            <div v-if="modal === 'withdraw'" class="space-y-4">
              <div class="bg-white/10 rounded-xl p-3 border border-white/10"><p class="text-xs text-white/60">Available</p><p class="text-xl font-black text-white">{{ formatAmount(userBalance) }} {{ t('mmk') }}</p></div>
              <div><label class="block text-xs text-white/60 mb-2">Amount</label><input v-model.number="form.amount" type="number" min="1000" :max="userBalance" class="w-full bg-white/10 rounded-xl px-4 py-3 text-sm text-white border border-white/10 focus:border-red-500 focus:outline-none"><div class="flex gap-2 mt-2"><button v-for="p in [25, 50, 75, 100]" :key="p" @click="form.amount = Math.floor(userBalance * p / 100)" class="flex-1 py-2 bg-white/10 rounded-lg text-xs font-medium text-white/80 hover:bg-white/15">{{ p }}%</button></div></div>
              <div><label class="block text-xs text-white/60 mb-2">Withdraw to</label><select v-model="form.methodId" class="w-full bg-white/10 rounded-xl px-4 py-3 text-sm text-white border border-white/10"><option value="" class="bg-slate-800 text-white">Select method</option><option v-for="m in activePaymentMethods" :key="m.id" :value="m.id" class="bg-slate-800 text-white flex items-center gap-2">{{ m.name }}</option></select></div>
              <div v-if="form.methodId"><label class="block text-xs text-white/60 mb-2">Your Account Number</label><input v-model="form.accNum" type="text" placeholder="09123456789" class="w-full bg-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/40 border border-white/10 focus:border-red-500 focus:outline-none"></div>
              <button @click="submitWithdraw" :disabled="!canWithdraw || loading" class="w-full bg-gradient-to-r from-red-500 to-rose-600 py-3.5 rounded-xl font-bold text-white shadow-lg shadow-red-500/25 active:scale-[0.98] disabled:opacity-50">{{ loading ? 'Processing...' : t('withdraw') }}</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition name="slide">
        <div v-if="toast" class="fixed top-4 left-4 right-4 z-50 max-w-[400px] mx-auto"><div :class="['p-4 rounded-xl text-center font-medium text-sm shadow-xl', toast.type === 'success' ? 'bg-green-500' : 'bg-red-500']">{{ toast.msg }}</div></div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useLanguage } from '~/composables/useLanguage'
import { useAuth } from '~/composables/useAuth'
import { useWallet } from '~/composables/useWallet'
import { useApi } from '~/composables/useApi'

definePageMeta({
  keepalive: true
})

const { t } = useLanguage()
const { userBalance, isLoggedIn, refreshProfile, initAuth } = useAuth()
const { paymentMethods, transactions, paymentMethodsLoading, transactionLoading, loadPaymentMethods, loadTransactionHistory, requestDeposit, requestWithdrawal, activePaymentMethods, totalTransactions, totalDeposits, totalWithdrawals, getStatusBadgeColor, formatAmount } = useWallet()
const api = useApi()

const modal = ref(null)
const filter = ref('all')
const loading = ref(false)
const toast = ref(null)
const form = ref({ amount: 10000, methodId: '', txId: '', accNum: '' })
const isBlocked = ref(false)
const blockReason = ref('')
const pageReady = ref(false)

const filteredTx = computed(() => filter.value === 'all' ? transactions.value : transactions.value.filter(t => t.type === filter.value))
const selectedMethod = computed(() => activePaymentMethods.value.find(m => m.id == form.value.methodId))
const canDeposit = computed(() => form.value.methodId && form.value.txId.length >= 6 && isLoggedIn.value && !isBlocked.value)
const canWithdraw = computed(() => form.value.amount >= 1000 && form.value.amount <= userBalance.value && form.value.methodId && form.value.accNum.length >= 6 && isLoggedIn.value && !isBlocked.value)

const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
const showToast = (msg, type = 'success') => { toast.value = { msg, type }; setTimeout(() => toast.value = null, 3000) }
const resetForm = () => { form.value = { amount: 10000, methodId: '', txId: '', accNum: '' } }
const handleImageError = (event) => { 
  event.target.style.display = 'none'
  const fallback = event.target.nextElementSibling
  if (fallback) fallback.style.display = 'flex'
}

const checkBlocked = async () => {
  const result = await api.checkTransactionBlocked()
  if (result.msgState === 'data' && result.data.blocked) {
    isBlocked.value = true
    blockReason.value = result.data.description || 'Your transactions are blocked'
  }
}

const submitDeposit = async () => {
  if (!canDeposit.value) return
  loading.value = true
  const result = await requestDeposit(form.value.methodId, form.value.txId)
  if (result.success) { showToast(result.message || 'Deposit submitted!', 'success'); modal.value = null; resetForm() }
  else { showToast(result.error || 'Failed to submit deposit', 'error') }
  loading.value = false
}

const submitWithdraw = async () => {
  if (!canWithdraw.value) return
  loading.value = true
  const result = await requestWithdrawal(form.value.methodId, form.value.amount, form.value.accNum)
  if (result.success) { showToast(result.message || 'Withdrawal submitted!', 'success'); modal.value = null; resetForm(); await refreshProfile() }
  else { showToast(result.error || 'Failed to submit withdrawal', 'error') }
  loading.value = false
}

onMounted(async () => {
  // Initialize auth first
  await initAuth()
  
  // Check if logged in after auth is initialized
  if (!isLoggedIn.value) {
    await navigateTo('/login')
    return
  }
  
  pageReady.value = true
  await loadPaymentMethods()
  await loadTransactionHistory()
  await checkBlocked()
})
</script>

<style>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-enter-active, .slide-leave-active { transition: all 0.3s; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-20px); }
</style>
