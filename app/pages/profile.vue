<template>
  <div class="min-h-screen text-white">
    <!-- Profile Header -->
    <div class="px-4 py-4">
      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
        <div class="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-2xl font-bold">{{ userInitials }}</span>
        </div>
        <h2 class="text-xl font-bold mb-1">{{ userName || 'User' }}</h2>
        <p class="text-sm opacity-70 mb-3">{{ userPhone || 'Phone not set' }}</p>
        <div class="flex items-center justify-center space-x-4 text-sm">
          <div class="text-center">
            <p class="font-bold text-green-400">{{ formatBalance(userBalance) }}</p>
            <p class="opacity-70">{{ t('balance') }} ({{ t('mmk') }})</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Language Settings -->
    <div class="px-4 py-2">
      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
        <h3 class="text-lg font-bold mb-3">{{ t('languageSettings') }}</h3>
        <div class="grid grid-cols-2 gap-3">
          <button @click="changeLanguage('english')" 
                  :class="[
                    'p-3 rounded-lg text-sm font-semibold transition-colors border',
                    currentLanguage === 'english' 
                      ? 'bg-blue-500 border-blue-400 text-white' 
                      : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  ]">
            <div class="flex items-center justify-center space-x-2">
              <span class="text-lg">🇺🇸</span>
              <span>English</span>
            </div>
          </button>
          <button @click="changeLanguage('myanmar')" 
                  :class="[
                    'p-3 rounded-lg text-sm font-semibold transition-colors border',
                    currentLanguage === 'myanmar' 
                      ? 'bg-blue-500 border-blue-400 text-white' 
                      : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  ]">
            <div class="flex items-center justify-center space-x-2">
              <span class="text-lg">🇲🇲</span>
              <span>မြန်မာ</span>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="px-4 py-2">
      <h3 class="text-lg font-bold mb-3">{{ t('quickActions') }}</h3>
      <div class="space-y-2">
        <NuxtLink to="/wallet" 
                  class="w-full bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between hover:bg-white/20 transition-colors block">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div class="text-left">
              <p class="text-sm font-semibold">{{ t('wallet') }}</p>
              <p class="text-xs opacity-70">{{ t('manageBalance') }}</p>
            </div>
          </div>
          <svg class="w-5 h-5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </NuxtLink>

        <NuxtLink to="/history" 
                  class="w-full bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between hover:bg-white/20 transition-colors block">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div class="text-left">
              <p class="text-sm font-semibold">{{ t('betHistory') }}</p>
              <p class="text-xs opacity-70">{{ t('viewBetHistory') }}</p>
            </div>
          </div>
          <svg class="w-5 h-5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </NuxtLink>

        <button @click="showChangePassword = true" 
                class="w-full bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between hover:bg-white/20 transition-colors">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div class="text-left">
              <p class="text-sm font-semibold">{{ t('changePassword') }}</p>
              <p class="text-xs opacity-70">{{ t('updatePassword') }}</p>
            </div>
          </div>
          <svg class="w-5 h-5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Logout Button -->
    <div class="px-4 py-4 pb-6">
      <button @click="handleLogout" 
              class="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl text-sm font-semibold transition-colors">
        {{ t('signOut') }}
      </button>
    </div>

    <!-- Change Password Modal -->
    <div v-if="showChangePassword" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 w-full max-w-md border border-white/20">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold">{{ t('changePassword') }}</h3>
          <button @click="closePasswordModal" class="text-white/70 hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">{{ t('currentPassword') }}</label>
            <input v-model="passwordForm.oldPassword" type="password"
                   class="w-full bg-white/20 text-white rounded-lg px-3 py-3 placeholder-white/50 border border-white/30 focus:border-purple-500 focus:outline-none">
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">{{ t('newPassword') }}</label>
            <input v-model="passwordForm.newPassword" type="password"
                   class="w-full bg-white/20 text-white rounded-lg px-3 py-3 placeholder-white/50 border border-white/30 focus:border-purple-500 focus:outline-none">
          </div>
          
          <div class="flex gap-3 pt-4">
            <button @click="updatePassword" 
                    :disabled="!canChangePassword || passwordLoading"
                    class="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50">
              {{ passwordLoading ? t('updating') : t('changePassword') }}
            </button>
            <button @click="closePasswordModal" 
                    class="flex-1 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors">
              {{ t('cancel') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success/Error Messages -->
    <div v-if="message" class="fixed top-4 left-4 right-4 z-50">
      <div :class="[
        'p-4 rounded-lg text-center font-semibold',
        messageType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      ]">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLanguage } from '~/composables/useLanguage'
import { useAuth } from '~/composables/useAuth'
import { useApi } from '~/composables/useApi'

const { t, setLanguage, currentLanguage } = useLanguage()
const { userBalance, isLoggedIn, logout, userName, userPhone } = useAuth()
const api = useApi()

// Modal states
const showChangePassword = ref(false)
const message = ref('')
const messageType = ref('success')

// Loading states
const passwordLoading = ref(false)

// Form state
const passwordForm = ref({
  oldPassword: '',
  newPassword: ''
})

// Computed properties
const userInitials = computed(() => {
  const name = userName.value || 'User'
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
})

const canChangePassword = computed(() => {
  return passwordForm.value.oldPassword.length >= 6 && 
         passwordForm.value.newPassword.length >= 6
})

// Utility functions
const formatBalance = (balance) => {
  return new Intl.NumberFormat('en-US').format(balance || 0)
}

// Language functions
const changeLanguage = (lang) => {
  setLanguage(lang)
  showMessage(t('languageChanged'), 'success')
}

// Password functions
const updatePassword = async () => {
  if (!canChangePassword.value) return
  
  passwordLoading.value = true
  
  try {
    const result = await api.changePassword(
      passwordForm.value.oldPassword, 
      passwordForm.value.newPassword
    )
    
    if (result.msgState === 'data') {
      showMessage(t('passwordChanged'), 'success')
      closePasswordModal()
    } else {
      showMessage(t('passwordChangeFailed'), 'error')
    }
  } catch (error) {
    showMessage(t('passwordChangeFailed'), 'error')
  } finally {
    passwordLoading.value = false
  }
}

const closePasswordModal = () => {
  showChangePassword.value = false
  passwordForm.value = { oldPassword: '', newPassword: '' }
}

const handleLogout = () => {
  logout()
  showMessage(t('loggedOut'), 'success')
}

const showMessage = (msg, type = 'success') => {
  message.value = msg
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 3000)
}
</script>