<template>
  <div class="text-white">
    <!-- Balance Card -->
    <section class="px-4 py-3">
      <div class="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl p-4 border border-green-500/20">
        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="text-xs text-white/60 mb-1">{{ t('availableBalance') }}</p>
            <p class="text-3xl font-bold text-white">{{ formatBalance(userBalance) }}</p>
            <p class="text-xs text-white/50">{{ t('mmk') }}</p>
          </div>
          <div class="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <button @click="showDepositModal = true" class="bg-green-500 hover:bg-green-600 text-white rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            {{ t('deposit') }}
          </button>
          <button @click="showWithdrawModal = true" class="bg-white/10 hover:bg-white/20 text-white rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors border border-white/10">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
            </svg>
            {{ t('withdraw') }}
          </button>
        </div>
      </div>
    </section>

    <!-- Quick Stats -->
    <section class="px-4 py-2">
      <div class="grid grid-cols-3 gap-2">
        <div class="bg-white/5 rounded-xl p-3 text-center border border-white/5">
          <p class="text-base font-bold text-green-400">{{ formatBalance(monthlyStats.totalDeposits) }}</p>
          <p class="text-[10px] text-white/50">{{ t('deposits') }}</p>
        </div>
        <div class="bg-white/5 rounded-xl p-3 text-center border border-white/5">
          <p class="text-base font-bold text-red-400">{{ formatBalance(monthlyStats.totalWithdrawals) }}</p>
          <p class="text-[10px] text-white/50">{{ t('withdrawals') }}</p>
        </div>
        <div class="bg-white/5 rounded-xl p-3 text-center border border-white/5">
          <p class="text-base font-bold text-blue-400">{{ monthlyStats.totalTransactions }}</p>
          <p class="text-[10px] text-white/50">{{ t('transactions') }}</p>
        </div>
      </div>
    </section>

    <!-- Transaction History -->
    <section class="px-4 py-3">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-sm font-semibold text-white/80">{{ t('transactionHistory') }}</h2>
        <select v-model="transactionFilter" class="bg-white/5 text-white text-xs rounded-lg px-2 py-1.5 border border-white/10">
          <option value="all">{{ t('allTransactions') }}</option>
          <option value="deposit">{{ t('deposits') }}</option>
          <option value="withdrawal">{{ t('withdrawals') }}</option>
        </select>
      </div>
      
      <div class="space-y-2">
        <div v-for="tx in filteredTransactions" :key="tx.id" class="bg-white/5 rounded-xl p-3 border border-white/5">
          <div class="flex items-center gap-3">
            <div :class="['w-10 h-10 rounded-xl flex items-center justify-center', tx.type === 'deposit' ? 'bg-green-500/20' : 'bg-red-500/20']">
              <svg class="w-5 h-5" :class="tx.type === 'deposit' ? 'text-green-400' : 'text-red-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="tx.type === 'deposit'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate">{{ tx.paymentMethod }}</p>
              <p class="text-[10px] text-white/50">{{ formatDateTime(tx.createdAt) }}</p>
            </div>
            <div class="text-right">
              <p :class="['text-sm font-bold', tx.type === 'deposit' ? 'text-green-400' : 'text-red-400']">
                {{ tx.type === 'deposit' ? '+' : '-' }}{{ formatBalance(tx.amount) }}
              </p>
              <span :class="['text-[10px] px-1.5 py-0.5 rounded', getStatusClass(tx.status)]">{{ tx.status }}</span>
            </div>
          </div>
        </div>
        
        <div v-if="filteredTransactions.length === 0" class="text-center py-8">
          <div class="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg class="w-6 h-6 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p class="text-sm text-white/50">{{ t('noTransactionsFound') }}</p>
        </div>
      </div>
    </section>

    <!-- Deposit Modal -->
    <Teleport to="body">
      <div v-if="showDepositModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div class="bg-slate-800 rounded-2xl p-5 w-full max-w-sm border border-white/10 max-h-[85vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold">{{ t('deposit') }}</h3>
            <button @click="closeDepositModal" class="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10">
              <svg class="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="space-y-4">
            <div>
              <label class="block text-xs text-white/60 mb-2">{{ t('amount') }} ({{ t('mmk') }})</label>
              <input v-model.number="depositForm.amount" type="number" min="1000"
                     class="w-full bg-white/5 text-white rounded-xl px-4 py-3 text-sm border border-white/10 focus:border-green-500 focus:outline-none">
              <div class="flex gap-2 mt-2">
                <button v-for="amt in [10000, 50000, 100000]" :key="amt" @click="depositForm.amount = amt"
                        class="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs transition-colors">
                  {{ formatBalance(amt) }}
                </button>
              </div>
            </div>
            
            <div>
              <label class="block text-xs text-white/60 mb-2">{{ t('paymentMethod') }}</label>
              <select v-model="depositForm.paymentMethodId" class="w-full bg-white/5 text-white rounded-xl px-4 py-3 text-sm border border-white/10">
                <option value="">{{ t('selectPaymentMethod') }}</option>
                <option v-for="m in paymentMethods" :key="m.id" :value="m.id">{{ m.name }}</option>
              </select>
            </div>

            <div v-if="selectedDepositMethod" class="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
              <p class="text-xs text-blue-300 mb-2">{{ t('paymentInformation') }}</p>
              <div class="space-y-1 text-xs">
                <div class="flex justify-between"><span class="text-white/60">Account:</span><span class="font-bold text-amber-400">{{ selectedDepositMethod.adminAccount }}</span></div>
                <div class="flex justify-between"><span class="text-white/60">Name:</span><span>{{ selectedDepositMethod.adminName }}</span></div>
              </div>
            </div>
            
            <div v-if="selectedDepositMethod">
              <label class="block text-xs text-white/60 mb-2">{{ t('transactionId') }}</label>
              <input v-model="depositForm.transactionId" type="text" maxlength="20" placeholder="Last 6 digits"
                     class="w-full bg-white/5 text-white rounded-xl px-4 py-3 text-sm border border-white/10 focus:border-green-500 focus:outline-none">
            </div>
            
            <button @click="processDeposit" :disabled="!canProcessDeposit || loading"
                    class="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-500/30 text-white py-3 rounded-xl font-semibold transition-colors">
              {{ loading ? t('processing') : t('deposit') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Withdraw Modal -->
    <Teleport to="body">
      <div v-if="showWithdrawModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div class="bg-slate-800 rounded-2xl p-5 w-full max-w-sm border border-white/10 max-h-[85vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold">{{ t('withdraw') }}</h3>
            <button @click="closeWithdrawModal" class="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10">
              <svg class="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="space-y-4">
            <div class="bg-white/5 rounded-xl p-3 border border-white/5">
              <p class="text-xs text-white/60">{{ t('availableBalance') }}</p>
              <p class="text-xl font-bold">{{ formatBalance(userBalance) }} {{ t('mmk') }}</p>
            </div>
            
            <div>
              <label class="block text-xs text-white/60 mb-2">{{ t('withdrawAmount') }}</label>
              <input v-model.number="withdrawForm.amount" type="number" min="1000" :max="userBalance"
                     class="w-full bg-white/5 text-white rounded-xl px-4 py-3 text-sm border border-white/10 focus:border-red-500 focus:outline-none">
              <div class="flex gap-2 mt-2">
                <button v-for="pct in [25, 50, 75, 100]" :key="pct" @click="withdrawForm.amount = Math.floor(userBalance * pct / 100)"
                        class="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs transition-colors">
                  {{ pct }}%
                </button>
              </div>
            </div>
            
            <div>
              <label class="block text-xs text-white/60 mb-2">{{ t('withdrawTo') }}</label>
              <select v-model="withdrawForm.paymentMethodId" class="w-full bg-white/5 text-white rounded-xl px-4 py-3 text-sm border border-white/10">
                <option value="">{{ t('selectPaymentMethod') }}</option>
                <option v-for="m in paymentMethods" :key="m.id" :value="m.id">{{ m.name }}</option>
              </select>
            </div>

            <div v-if="withdrawForm.paymentMethodId">
              <label class="block text-xs text-white/60 mb-2">{{ t('yourAccountNumber') }}</label>
              <input v-model="withdrawForm.accountNumber" type="text" placeholder="09123456789"
                     class="w-full bg-white/5 text-white rounded-xl px-4 py-3 text-sm border border-white/10 focus:border-red-500 focus:outline-none">
            </div>

            <div v-if="withdrawForm.paymentMethodId">
              <label class="block text-xs text-white/60 mb-2">{{ t('yourAccountName') }}</label>
              <input v-model="withdrawForm.accountName" type="text" placeholder="Your Name"
                     class="w-full bg-white/5 text-white rounded-xl px-4 py-3 text-sm border border-white/10 focus:border-red-500 focus:outline-none">
            </div>
            
            <button @click="processWithdraw" :disabled="!canProcessWithdraw || loading"
                    class="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-500/30 text-white py-3 rounded-xl font-semibold transition-colors">
              {{ loading ? t('processing') : t('withdraw') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Toast -->
    <Teleport to="body">
      <div v-if="toast.show" class="fixed top-4 left-4 right-4 z-50 max-w-[400px] mx-auto">
        <div :class="['p-4 rounded-xl text-center font-medium text-sm', toast.type === 'success' ? 'bg-green-500' : 'bg-red-500']">
          {{ toast.message }}
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLanguage } from '~/composables/useLanguage'
import { useAuth } from '~/composables/useAuth'

const { t } = useLanguage()
const { userBalance, isLoggedIn } = useAuth()

const showDepositModal = ref(false)
const showWithdrawModal = ref(false)
const loading = ref(false)
const transactionFilter = ref('all')
const toast = ref({ show: false, message: '', type: 'success' })

const paymentMethods = [
  { id: 1, name: 'KBZ Pay', adminAccount: '09123456789', adminName: 'Admin KBZ' },
  { id: 2, name: 'Wave Money', adminAccount: '09987654321', adminName: 'Admin Wave' },
  { id: 3, name: 'CB Pay', adminAccount: '09555666777', adminName: 'Admin CB' },
  { id: 4, name: 'AYA Pay', adminAccount: '09444555666', adminName: 'Admin AYA' }
]

const transactions = ref([
  { id: 1, type: 'deposit', amount: 50000, status: 'completed', paymentMethod: 'KBZ Pay', createdAt: '2024-12-20T10:00:00Z' },
  { id: 2, type: 'withdrawal', amount: 25000, status: 'pending', paymentMethod: 'Wave Money', createdAt: '2024-12-22T14:30:00Z' }
])

const depositForm = ref({ amount: 10000, paymentMethodId: '', transactionId: '' })
const withdrawForm = ref({ amount: 0, paymentMethodId: '', accountNumber: '', accountName: '' })

const monthlyStats = computed(() => {
  const deposits = transactions.value.filter(t => t.type === 'deposit')
  const withdrawals = transactions.value.filter(t => t.type === 'withdrawal')
  return {
    totalDeposits: deposits.reduce((sum, t) => sum + t.amount, 0),
    totalWithdrawals: withdrawals.reduce((sum, t) => sum + t.amount, 0),
    totalTransactions: transactions.value.length
  }
})

const filteredTransactions = computed(() => {
  if (transactionFilter.value === 'all') return transactions.value
  return transactions.value.filter(t => t.type === transactionFilter.value)
})

const selectedDepositMethod = computed(() => {
  if (!depositForm.value.paymentMethodId) return null
  return paymentMethods.find(m => m.id == depositForm.value.paymentMethodId)
})

const canProcessDeposit = computed(() => 
  depositForm.value.amount >= 1000 && depositForm.value.paymentMethodId && depositForm.value.transactionId.length >= 6 && isLoggedIn.value
)

const canProcessWithdraw = computed(() => 
  withdrawForm.value.amount >= 1000 && withdrawForm.value.amount <= userBalance.value && 
  withdrawForm.value.paymentMethodId && withdrawForm.value.accountNumber.length >= 6 && 
  withdrawForm.value.accountName.length >= 2 && isLoggedIn.value
)

const formatBalance = (n) => new Intl.NumberFormat('en-US').format(n || 0)
const formatDateTime = (d) => new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
const getStatusClass = (s) => s === 'completed' ? 'bg-green-500/20 text-green-400' : s === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => toast.value.show = false, 3000)
}

const closeDepositModal = () => {
  showDepositModal.value = false
  depositForm.value = { amount: 10000, paymentMethodId: '', transactionId: '' }
}

const closeWithdrawModal = () => {
  showWithdrawModal.value = false
  withdrawForm.value = { amount: 0, paymentMethodId: '', accountNumber: '', accountName: '' }
}

const processDeposit = async () => {
  if (!canProcessDeposit.value) return
  loading.value = true
  await new Promise(r => setTimeout(r, 1000))
  transactions.value.unshift({
    id: Date.now(), type: 'deposit', amount: depositForm.value.amount, status: 'pending',
    paymentMethod: paymentMethods.find(m => m.id == depositForm.value.paymentMethodId)?.name,
    createdAt: new Date().toISOString()
  })
  showToast(t('depositRequestSubmitted'), 'success')
  closeDepositModal()
  loading.value = false
}

const processWithdraw = async () => {
  if (!canProcessWithdraw.value) return
  loading.value = true
  await new Promise(r => setTimeout(r, 1000))
  transactions.value.unshift({
    id: Date.now(), type: 'withdrawal', amount: withdrawForm.value.amount, status: 'pending',
    paymentMethod: paymentMethods.find(m => m.id == withdrawForm.value.paymentMethodId)?.name,
    createdAt: new Date().toISOString()
  })
  showToast(t('withdrawalRequestSubmitted'), 'success')
  closeWithdrawModal()
  loading.value = false
}
</script>
