<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="sticky top-0 z-10 bg-background border-b">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <!-- <Button variant="ghost" size="icon" @click="$router.back()">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </Button> -->
            <div>
              <!-- <h1 class="text-xl font-bold">Notifications</h1> -->
              <p class="text-sm text-muted-foreground">{{ unreadCount }} unread</p>
            </div>
          </div>
          <Button v-if="unreadCount > 0" @click="markAllAsRead" variant="ghost" size="sm">
            Mark All Read
          </Button>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="border-b bg-background">
      <div class="container mx-auto px-4 py-3">
        <div class="flex gap-2 overflow-x-auto">
          <Button @click="filterType = ''" :variant="filterType === '' ? 'default' : 'outline'" size="sm">
            All
          </Button>
          <Button @click="filterType = 'bet_result'" :variant="filterType === 'bet_result' ? 'default' : 'outline'" size="sm">
            Bet Results
          </Button>
          <Button @click="filterType = 'payment_request'" :variant="filterType === 'payment_request' ? 'default' : 'outline'" size="sm">
            Payments
          </Button>
          <Button @click="filterType = 'bet_status'" :variant="filterType === 'bet_status' ? 'default' : 'outline'" size="sm">
            Bet Status
          </Button>
        </div>
      </div>
    </div>

    <!-- Notifications List -->
    <div class="container mx-auto px-4 py-4">
      <div v-if="isLoading" class="space-y-3">
        <SkeletonLoader type="list-item" />
        <SkeletonLoader type="list-item" />
        <SkeletonLoader type="list-item" />
      </div>

      <div v-else-if="filteredNotifications.length > 0" class="space-y-2">
        <div
          v-for="notification in filteredNotifications"
          :key="notification.id"
          :class="[
            'p-4 rounded-lg border transition-colors cursor-pointer',
            !notification.read_at ? 'bg-primary/5 border-primary/20' : 'bg-card'
          ]"
          @click="markAsRead(notification)"
        >
          <div class="flex items-start gap-3">
            <div :class="['flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center', getNotificationColor(notification.type)]">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="notification.type === 'bet_result'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path v-else-if="notification.type === 'payment_request'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                <path v-else-if="notification.type === 'bet_status'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2">
                <h3 class="font-semibold text-sm">{{ notification.title }}</h3>
                <div v-if="!notification.read_at" class="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-1"></div>
              </div>
              <p class="text-sm text-muted-foreground mt-1">{{ notification.message }}</p>
              <p class="text-xs text-muted-foreground mt-2">{{ formatDateTime(notification.created_at) }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-16">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
          <svg class="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <p class="text-muted-foreground">No notifications</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import SkeletonLoader from '@/components/SkeletonLoader.vue'

definePageMeta({
  middleware: 'auth'
})

const api = useApi()

const notifications = ref<any[]>([])
const filterType = ref('')
const isLoading = ref(false)

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read_at).length
})

const filteredNotifications = computed(() => {
  if (!filterType.value) return notifications.value
  return notifications.value.filter(n => n.type === filterType.value)
})

const loadNotifications = async () => {
  isLoading.value = true
  try {
    const response: any = await api.get('/api/notifications')
    notifications.value = response.data || []
  } catch (error) {
    console.error('Failed to load notifications:', error)
  } finally {
    isLoading.value = false
  }
}

const markAsRead = async (notification: any) => {
  if (notification.read_at) return

  try {
    await api.post(`/api/notifications/${notification.id}/read`, {})
    notification.read_at = new Date().toISOString()
  } catch (error) {
    console.error('Failed to mark as read:', error)
  }
}

const markAllAsRead = async () => {
  try {
    await api.post('/api/notifications/read-all', {})
    notifications.value.forEach(n => {
      if (!n.read_at) {
        n.read_at = new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Failed to mark all as read:', error)
  }
}

const getNotificationColor = (type: string) => {
  const colors: Record<string, string> = {
    bet_result: 'bg-blue-500/10 text-blue-600',
    payment_request: 'bg-green-500/10 text-green-600',
    bet_status: 'bg-purple-500/10 text-purple-600'
  }
  return colors[type] || 'bg-gray-500/10 text-gray-600'
}

const formatDateTime = (date: string) => {
  const now = new Date()
  const notifDate = new Date(date)
  const diffMs = now.getTime() - notifDate.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  
  return notifDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: notifDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  })
}

onMounted(() => {
  loadNotifications()
})

useHead({
  title: 'Notifications - 2D3D'
})
</script>
