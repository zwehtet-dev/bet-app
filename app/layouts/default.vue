<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { Bell, Sun, Moon } from 'lucide-vue-next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const route = useRoute()
const selectedLanguage = ref('en')
const { theme, toggleTheme } = useTheme()
const { unreadCount, fetchUnreadCount, setupWebSocketListeners } = useNotifications()
const { isAuthenticated } = useAuth()
const { connect, disconnect } = useWebSocket()

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

const pageConfig: Record<string, { title: string }> = {
  'index': { title: 'Welcome Back!' },
  '2d': { title: '2D Lottery' },
  '3d': { title: '3D Lottery' },
  'bawdi': { title: 'Bawdi' },
  'maung': { title: 'Maung' },
  'wallet': { title: 'Wallet' },
  'history': { title: 'History' },
  'profile': { title: 'Account' },
  'results': { title: 'Results' },
  'notifications': { title: 'Notifications' },
  'soccer-bet-details': { title: 'Bet Details' },
  'profile-edit': { title: 'Edit Profile' },
  'change-password': { title: 'Change Password' }
}

const currentPage = computed(() => pageConfig[route.name as string] || { title: 'Back' })
const isMainPage = computed(() => ['index', 'wallet', 'history', 'profile'].includes(route.name as string))
const backRoute = computed(() => route.query.from as string || '/')

const navItems = [
  { name: 'index', path: '/', icon: 'LayoutDashboard', label: 'Home' },
  { name: 'wallet', path: '/wallet', icon: 'Wallet', label: 'Wallet' },
  { name: 'history', path: '/history', icon: 'Clock', label: 'History' },
  { name: 'profile', path: '/profile', icon: 'User', label: 'Account' }
]

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'mm', name: 'မြန်မာ', flag: '🇲🇲' }
]

const currentLanguage = computed(() => 
  languages.find(lang => lang.code === selectedLanguage.value) || languages[0]
)

const selectLanguage = (code: string) => {
  selectedLanguage.value = code
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <div class="w-full min-h-screen max-w-[480px] mx-auto flex flex-col bg-background" >
      
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
            <!-- Theme Toggle -->
            <button 
              @click="toggleTheme"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10"
            >
              <Sun v-if="theme === 'dark'" class="h-5 w-5" />
              <Moon v-else class="h-5 w-5" />
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
              'inline-flex flex-col items-center justify-center gap-1 rounded-md px-3 py-2 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
              route.name === item.name ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            ]">
            <component :is="item.icon === 'LayoutDashboard' ? 'svg' : 'svg'" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="item.icon === 'LayoutDashboard'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              <path v-else-if="item.icon === 'Wallet'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              <path v-else-if="item.icon === 'Clock'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path v-else-if="item.icon === 'User'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </component>
            <span class="text-xs">{{ item.label }}</span>
          </NuxtLink>
        </div>
      </nav>
      
      <!-- Toast Container -->
      <ToastContainer />
    </div>
  </div>
</template>
