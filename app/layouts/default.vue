<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { Bell, Languages } from 'lucide-vue-next'

const route = useRoute()
const { unreadCount, fetchUnreadCount, setupWebSocketListeners } = useNotifications()
const { isAuthenticated } = useAuth()
const { connect, disconnect } = useWebSocket()
const { locale, toggleLocale, t } = useLanguage()

let cleanupListeners: (() => void) | undefined

// Fetch on mount and setup WebSocket
onMounted(() => {
  if (isAuthenticated.value) {
    fetchUnreadCount()
    connect()
    cleanupListeners = setupWebSocketListeners()
    
    // Load user settings
    const { loadSettings } = useToast()
    loadSettings()
  }
})

// Cleanup on unmount
onUnmounted(() => {
  disconnect()
  if (cleanupListeners) {
    cleanupListeners()
  }
})

// Fetch on every route change
watch(() => route.path, () => {
  if (isAuthenticated.value) {
    fetchUnreadCount()
  }
})

const pageConfig: Record<string, { title: { en: string, mm: string } }> = {
  'index': { title: { en: 'Welcome Back!', mm: 'ပြန်လည်ကြိုဆိုပါတယ်!' } },
  '2d': { title: { en: '2D Lottery', mm: '2D ထီ' } },
  '3d': { title: { en: '3D Lottery', mm: '3D ထီ' } },
  'bawdi': { title: { en: 'Bawdi', mm: 'ဘော်ဒီ' } },
  'maung': { title: { en: 'Maung', mm: 'မောင်:' } },
  'wallet': { title: { en: 'Wallet', mm: 'ပိုက်ဆံအိတ်' } },
  'history': { title: { en: 'History', mm: 'မှတ်တမ်း' } },
  'profile': { title: { en: 'Account', mm: 'အကောင့်' } },
  'results': { title: { en: 'Results', mm: 'ရလဒ်များ' } },
  'notifications': { title: { en: 'Notifications', mm: 'အသိပေးချက်များ' } },
  'soccer-bet-details': { title: { en: 'Bet Details', mm: 'လောင်းကြေးအသေးစိတ်' } },
  'profile-edit': { title: { en: 'Edit Profile', mm: 'ပရိုဖိုင်းပြင်ဆင်ရန်' } },
  'change-password': { title: { en: 'Change Password', mm: 'စကားဝှက်ပြောင်းရန်' } }
}

const currentPage = computed(() => {
  const config = pageConfig[route.name as string]
  if (!config) return { title: locale.value === 'mm' ? 'နောက်သို့' : 'Back' }
  return { title: config.title[locale.value] }
})

const isMainPage = computed(() => ['index', 'wallet', 'history', 'profile'].includes(route.name as string))
const backRoute = computed(() => route.query.from as string || '/')

const navItems = [
  { name: 'index', path: '/', icon: 'LayoutDashboard', label: { en: 'Home', mm: 'ပင်မ' }, activeColor: 'text-yellow-500', inactiveColor: 'text-gray-500' },
  { name: 'wallet', path: '/wallet', icon: 'Wallet', label: { en: 'Wallet', mm: 'ပိုက်ဆံ' }, activeColor: 'text-blue-500', inactiveColor: 'text-gray-500' },
  { name: 'history', path: '/history', icon: 'Clock', label: { en: 'History', mm: 'မှတ်တမ်း' }, activeColor: 'text-green-500', inactiveColor: 'text-gray-500' },
  { name: 'profile', path: '/profile', icon: 'User', label: { en: 'Account', mm: 'အကောင့်' }, activeColor: 'text-red-500', inactiveColor: 'text-gray-500' }
]
</script>

<template>
  <div class="min-h-screen">
    <div class="w-full min-h-screen max-w-[480px] mx-auto flex flex-col " style="background: url('images/bg-9.jpeg');background-size:cover;background-attachment:fixed;background-repeat: no-repeat;" >
      
      <!-- Header -->
      <header class="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div class="flex h-16 items-center justify-between px-4">
          <div class="flex items-center gap-3">
            <NuxtLink v-if="!isMainPage" :to="backRoute" 
              class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </NuxtLink>
            <div>
              <h1 class="text-lg font-semibold">{{ currentPage.title }}</h1>
            </div>
          </div>
          
          <div class="flex items-center gap-2">
            <!-- Language Toggle -->
            <button 
              @click="toggleLocale"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-3 gap-1"
            >
              <Languages class="h-5 w-5" />
              <span class="text-xs font-semibold">{{ locale === 'mm' ? 'မြန်မာ' : 'EN' }}</span>
            </button>

            <!-- Notification Button -->
            <NuxtLink to="/notifications" class="relative inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10">
              <Bell class="h-5 w-5" />
              <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {{ unreadCount > 99 ? '99+' : unreadCount }}
              </span>
            </NuxtLink>
          </div>
        </div>
      </header>
      
      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto pb-20">
        <slot />
      </main>

      <!-- Bottom Navigation -->
      <nav class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div class="flex h-16 items-center justify-around px-2">
          <NuxtLink v-for="item in navItems" :key="item.name" :to="item.path" 
            :class="[
              'inline-flex flex-col items-center justify-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-all focus-visible:outline-none',
              route.name === item.name ? item.activeColor : item.inactiveColor
            ]">
            <component :is="item.icon === 'LayoutDashboard' ? 'svg' : 'svg'" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="item.icon === 'LayoutDashboard'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              <path v-else-if="item.icon === 'Wallet'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              <path v-else-if="item.icon === 'Clock'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path v-else-if="item.icon === 'User'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </component>
            <span class="text-xs">{{ item.label[locale] }}</span>
          </NuxtLink>
        </div>
      </nav>
      
      <!-- Toast Container -->
      <ToastContainer />
    </div>
  </div>
</template>
