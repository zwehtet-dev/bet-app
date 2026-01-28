<template>
  <div class="container mx-auto p-4 space-y-3">
    
    <div v-if="notifications.length > 0" class="space-y-3">
      <div 
        v-for="notif in notifications" 
        :key="notif.id"
        class="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
      >
        <div class="flex items-start justify-between gap-2 mb-1">
          <p class="text-sm font-medium">{{ notif.title }}</p>
          <span class="text-xs text-muted-foreground">{{ notif.time }}</span>
        </div>
        <p class="text-sm text-muted-foreground">{{ notif.message }}</p>
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center py-20">
      <p class="text-sm text-muted-foreground">No notifications</p>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({
  keepalive: true
})

const notifications = ref([
  {
    id: 1,
    title: 'Congratulations!',
    message: 'You won 50,000 MMK on 2D lottery',
    time: '2h ago'
  },
  {
    id: 2,
    title: 'Deposit Successful',
    message: 'Your account has been credited with 100,000 MMK',
    time: '5h ago'
  },
  {
    id: 3,
    title: 'Welcome Bonus',
    message: 'You received 20% bonus on your first deposit',
    time: '1d ago'
  },
  {
    id: 4,
    title: '3D Results Announced',
    message: 'Latest 3D result: 456. Check if you won!',
    time: '1d ago'
  },
  {
    id: 5,
    title: 'Bet Placed',
    message: 'Your bet on number 35 has been confirmed',
    time: '2d ago'
  }
])
</script>
