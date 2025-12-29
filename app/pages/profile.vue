<template>
  <div class="text-white">
    <div class="px-4 py-4">
      <div class="relative bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-transparent rounded-2xl p-6 text-center border border-white/10 overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div class="relative">
          <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-xl shadow-purple-500/25 ring-4 ring-white/10"><span class="text-2xl font-black">{{ initials }}</span></div>
          <h2 class="text-lg font-black mb-0.5">{{ userName || 'User' }}</h2>
          <p class="text-sm text-white/40 mb-4">{{ userPhone || 'Phone not set' }}</p>
          <div class="inline-block bg-white/10 rounded-xl px-4 py-2"><p class="text-[10px] text-white/40">BALANCE</p><p class="text-lg font-black text-amber-400">{{ formatBalance(userBalance) }} <span class="text-xs text-white/40">{{ t('mmk') }}</span></p></div>
        </div>
      </div>
    </div>

    <div class="px-4 py-3">
      <h3 class="text-sm font-bold mb-3">{{ t('languageSettings') }}</h3>
      <div class="grid grid-cols-2 gap-3">
        <button @click="setLang('english')" :class="['p-3.5 rounded-xl text-sm font-bold border transition-all active:scale-[0.98]', currentLanguage === 'english' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-white/5 border-white/10 text-white/60']">🇺🇸 English</button>
        <button @click="setLang('myanmar')" :class="['p-3.5 rounded-xl text-sm font-bold border transition-all active:scale-[0.98]', currentLanguage === 'myanmar' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-white/5 border-white/10 text-white/60']">🇲🇲 မြန်မာ</button>
      </div>
    </div>

    <div class="px-4 py-3">
      <h3 class="text-sm font-bold mb-3">{{ t('settings') }}</h3>
      <div class="space-y-2">
        <button @click="showPwModal = true" class="w-full bg-white/5 hover:bg-white/10 rounded-xl p-4 flex items-center gap-3 border border-white/5 active:scale-[0.98]">
          <div class="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center"><svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg></div>
          <div class="flex-1 text-left"><p class="text-sm font-bold">{{ t('changePassword') }}</p><p class="text-[10px] text-white/40">Update your password</p></div>
          <svg class="w-5 h-5 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </button>
        
        <NuxtLink to="/results" class="w-full bg-white/5 hover:bg-white/10 rounded-xl p-4 flex items-center gap-3 border border-white/5 active:scale-[0.98]">
          <div class="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center"><svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg></div>
          <div class="flex-1 text-left"><p class="text-sm font-bold">{{ t('results') }}</p><p class="text-[10px] text-white/40">View all results</p></div>
          <svg class="w-5 h-5 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </NuxtLink>
      </div>
    </div>

    <!-- Customer Service -->
    <div v-if="servicePhones.length" class="px-4 py-3">
      <h3 class="text-sm font-bold mb-3">📞 Customer Service</h3>
      <div class="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
        <p class="text-xs text-white/50 mb-2">Contact us for support:</p>
        <div class="space-y-2">
          <a v-for="phone in servicePhones" :key="phone" :href="'tel:' + phone" class="flex items-center gap-3 bg-white/5 rounded-lg p-3 active:bg-white/10">
            <div class="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center"><svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg></div>
            <span class="text-sm font-bold text-green-400">{{ phone }}</span>
          </a>
        </div>
      </div>
    </div>

    <div class="px-4 py-4">
      <button @click="handleLogout" class="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 py-3.5 rounded-xl text-sm font-bold border border-red-500/20 active:scale-[0.98]">{{ t('signOut') }}</button>
    </div>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showPwModal" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="showPwModal = false">
          <div class="bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl p-5 w-full max-w-sm border border-white/10 text-white">
            <div class="flex items-center justify-between mb-5"><h3 class="text-lg font-bold text-white">{{ t('changePassword') }}</h3><button @click="showPwModal = false" class="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20"><svg class="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button></div>
            <div class="space-y-4">
              <div><label class="block text-xs text-white/60 mb-2">Current Password</label><input v-model="pwForm.old" type="password" class="w-full bg-white/10 rounded-xl px-4 py-3 text-sm text-white border border-white/10 focus:border-purple-500 focus:outline-none"></div>
              <div><label class="block text-xs text-white/60 mb-2">New Password</label><input v-model="pwForm.new" type="password" class="w-full bg-white/10 rounded-xl px-4 py-3 text-sm text-white border border-white/10 focus:border-purple-500 focus:outline-none"></div>
              <button @click="changePw" :disabled="!canChangePw || loading" class="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-3.5 rounded-xl font-bold text-white shadow-lg shadow-purple-500/25 active:scale-[0.98] disabled:opacity-50">{{ loading ? 'Updating...' : t('changePassword') }}</button>
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
import { useApi } from '~/composables/useApi'

const { t, setLanguage, currentLanguage } = useLanguage()
const { userBalance, logout, userName, userPhone, changePassword: apiChangePassword } = useAuth()
const api = useApi()

const showPwModal = ref(false)
const loading = ref(false)
const toast = ref(null)
const pwForm = ref({ old: '', new: '' })
const servicePhones = ref([])

const initials = computed(() => (userName.value || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2))
const canChangePw = computed(() => pwForm.value.old.length >= 6 && pwForm.value.new.length >= 6)

const formatBalance = (n) => new Intl.NumberFormat('en-US').format(n || 0)
const showToast = (msg, type = 'success') => { toast.value = { msg, type }; setTimeout(() => toast.value = null, 3000) }

const setLang = (lang) => { setLanguage(lang); showToast('Language changed!', 'success') }

const changePw = async () => {
  if (!canChangePw.value) return
  loading.value = true
  const result = await apiChangePassword(pwForm.value.old, pwForm.value.new)
  if (result.success) { showToast('Password changed!', 'success'); showPwModal.value = false; pwForm.value = { old: '', new: '' } }
  else { showToast(result.error || 'Failed to change password', 'error') }
  loading.value = false
}

const handleLogout = () => { logout(); showToast('Logged out!', 'success') }

const loadServicePhone = async () => {
  const result = await api.getServicePhone()
  if (result.msgState === 'data' && result.data) {
    servicePhones.value = result.data.split(',').map(p => p.trim())
  }
}

onMounted(() => loadServicePhone())
</script>

<style>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-enter-active, .slide-leave-active { transition: all 0.3s; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-20px); }
</style>
