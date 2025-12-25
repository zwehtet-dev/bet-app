<template>
  <div class="text-white">
    <!-- Profile Header -->
    <section class="px-4 py-4">
      <div class="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-5 text-center border border-white/10">
        <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
          <span class="text-2xl font-bold">{{ userInitials }}</span>
        </div>
        <h2 class="text-lg font-bold mb-0.5">{{ userName || 'User' }}</h2>
        <p class="text-sm text-white/50 mb-3">{{ userPhone || 'Phone not set' }}</p>
        <div class="bg-white/5 rounded-xl px-4 py-2 inline-block">
          <p class="text-xs text-white/50">{{ t('balance') }}</p>
          <p class="text-lg font-bold text-amber-400">{{ formatBalance(userBalance) }} <span class="text-xs text-white/50">{{ t('mmk') }}</span></p>
        </div>
      </div>
    </section>

    <!-- Language Settings -->
    <section class="px-4 py-2">
      <h3 class="text-sm font-semibold text-white/80 mb-3">{{ t('languageSettings') }}</h3>
      <div class="grid grid-cols-2 gap-3">
        <button @click="changeLanguage('english')" 
                :class="['p-3 rounded-xl text-sm font-medium transition-all border', 
                         currentLanguage === 'english' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10']">
          <span class="text-lg mr-2">🇺🇸</span> English
        </button>
        <button @click="changeLanguage('myanmar')" 
                :class="['p-3 rounded-xl text-sm font-medium transition-all border', 
                         currentLanguage === 'myanmar' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10']">
          <span class="text-lg mr-2">🇲🇲</span> မြန်မာ
        </button>
      </div>
    </section>

    <!-- Menu Items -->
    <section class="px-4 py-3">
      <h3 class="text-sm font-semibold text-white/80 mb-3">{{ t('settings') }}</h3>
      <div class="space-y-2">
        <button @click="showChangePassword = true" class="w-full bg-white/5 hover:bg-white/10 rounded-xl p-4 flex items-center gap-3 transition-colors border border-white/5">
          <div class="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div class="flex-1 text-left">
            <p class="text-sm font-medium">{{ t('changePassword') }}</p>
            <p class="text-[10px] text-white/50">{{ t('updatePassword') }}</p>
          </div>
          <svg class="w-5 h-5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <NuxtLink to="/results" class="w-full bg-white/5 hover:bg-white/10 rounded-xl p-4 flex items-center gap-3 transition-colors border border-white/5">
          <div class="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div class="flex-1 text-left">
            <p class="text-sm font-medium">{{ t('results') }}</p>
            <p class="text-[10px] text-white/50">{{ t('viewAllResults') }}</p>
          </div>
          <svg class="w-5 h-5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </NuxtLink>
      </div>
    </section>

    <!-- Logout -->
    <section class="px-4 py-4">
      <button @click="handleLogout" class="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 py-3 rounded-xl text-sm font-semibold transition-colors border border-red-500/20">
        {{ t('signOut') }}
      </button>
    </section>

    <!-- Change Password Modal -->
    <Teleport to="body">
      <div v-if="showChangePassword" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div class="bg-slate-800 rounded-2xl p-5 w-full max-w-sm border border-white/10">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold">{{ t('changePassword') }}</h3>
            <button @click="closePasswordModal" class="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10">
              <svg class="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="space-y-4">
            <div>
              <label class="block text-xs text-white/60 mb-2">{{ t('currentPassword') }}</label>
              <input v-model="passwordForm.oldPassword" type="password"
                     class="w-full bg-white/5 text-white rounded-xl px-4 py-3 text-sm border border-white/10 focus:border-purple-500 focus:outline-none">
            </div>
            <div>
              <label class="block text-xs text-white/60 mb-2">{{ t('newPassword') }}</label>
              <input v-model="passwordForm.newPassword" type="password"
                     class="w-full bg-white/5 text-white rounded-xl px-4 py-3 text-sm border border-white/10 focus:border-purple-500 focus:outline-none">
            </div>
            <button @click="updatePassword" :disabled="!canChangePassword || loading"
                    class="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/30 text-white py-3 rounded-xl font-semibold transition-colors">
              {{ loading ? t('updating') : t('changePassword') }}
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

const { t, setLanguage, currentLanguage } = useLanguage()
const { userBalance, logout, userName, userPhone } = useAuth()

const showChangePassword = ref(false)
const loading = ref(false)
const toast = ref({ show: false, message: '', type: 'success' })
const passwordForm = ref({ oldPassword: '', newPassword: '' })

const userInitials = computed(() => {
  const name = userName.value || 'User'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const canChangePassword = computed(() => 
  passwordForm.value.oldPassword.length >= 6 && passwordForm.value.newPassword.length >= 6
)

const formatBalance = (n) => new Intl.NumberFormat('en-US').format(n || 0)

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => toast.value.show = false, 3000)
}

const changeLanguage = (lang) => {
  setLanguage(lang)
  showToast(t('languageChanged'), 'success')
}

const closePasswordModal = () => {
  showChangePassword.value = false
  passwordForm.value = { oldPassword: '', newPassword: '' }
}

const updatePassword = async () => {
  if (!canChangePassword.value) return
  loading.value = true
  await new Promise(r => setTimeout(r, 1000))
  showToast(t('passwordChanged'), 'success')
  closePasswordModal()
  loading.value = false
}

const handleLogout = () => {
  logout()
  showToast(t('loggedOut'), 'success')
}
</script>
