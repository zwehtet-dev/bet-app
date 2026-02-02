<template>
  <div class="min-h-screen bg-background">
    <div class="container mx-auto px-4 py-6 max-w-2xl">
      <div class="space-y-6">
        <!-- Notifications Section -->
        <div class="bg-card rounded-lg border p-6">
          <h2 class="text-lg font-semibold mb-4">Notifications</h2>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <h3 class="font-medium">Push Notifications</h3>
                <p class="text-sm text-muted-foreground">Receive real-time notifications for bets and updates</p>
              </div>
              <button
                @click="toggleNotifications"
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  notificationsEnabled ? 'bg-primary' : 'bg-muted'
                ]"
              >
                <span
                  :class="[
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                  ]"
                />
              </button>
            </div>
          </div>
        </div>

        <!-- About Section -->
        <div class="bg-card rounded-lg border p-6">
          <h2 class="text-lg font-semibold mb-4">About</h2>
          <div class="space-y-2 text-sm text-muted-foreground">
            <p>Version: 1.0.0</p>
            <p>© 2026 2D3D Betting Platform</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { notificationsEnabled, toggleNotifications } = useToast()

useHead({
  title: 'Settings - 2D3D'
})
</script>
