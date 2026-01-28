<template>
  <div class="container mx-auto p-4 space-y-6">
    
    <!-- Profile -->
    <div class="flex w-full justify-between">
      <div class="flex items-center gap-4">
        <Avatar class="h-16 w-16">
          <AvatarFallback class="bg-primary text-primary-foreground text-xl font-bold">
            DU
          </AvatarFallback>
        </Avatar>
        <div class="flex-1">
          <h1 class="text-lg font-semibold">Demo User</h1>
          <p class="text-sm text-muted-foreground">demo@2d3d.com</p>
        </div>
      </div>
      <div class="flex items-center">
        <Badge>Agent</Badge>
      </div>
    </div>

    <!-- Menu -->
    
    <div class="pt-6 space-y-2">
      <NuxtLink 
        to="/profile-edit?from=/profile"
        class="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
      >
        <div class="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <UserRoundPen class="w-5 h-5" />
        </div>
        <div class="flex-1 text-left">
          <p class="text-sm font-medium">Edit Profile</p>
        </div>
        <svg class="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </NuxtLink>

      <NuxtLink 
        to="/change-password?from=/profile"
        class="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
      >
        <div class="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div class="flex-1 text-left">
          <p class="text-sm font-medium">Change Password</p>
        </div>
        <svg class="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </NuxtLink>

      <NuxtLink 
        to="/results"
        class="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
      >
        <div class="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div class="flex-1 text-left">
          <p class="text-sm font-medium">Results</p>
        </div>
        <svg class="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </NuxtLink>
    </div>
    

    <!-- Support -->
    <Card>
      <CardHeader>Customer Support</CardHeader>
      <CardContent class="">
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <div class="flex-1">
            <!-- <p class="text-xs text-muted-foreground">Customer Support</p> -->
            <p class="text-xs font-semibold">09-123-456-789</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Logout -->
    <Button 
      @click="handleLogout"
      variant="destructive"
      class="w-full"
      size="lg"
    >
      Sign Out
    </Button>

    <!-- Toast -->
    <Teleport to="body">
      <Transition name="slide">
        <div v-if="toast" class="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto">
          <div :class="[
            'p-4 rounded-lg text-center text-sm font-medium shadow-lg',
            toast.type === 'success' ? 'bg-primary text-primary-foreground' : 'bg-destructive text-destructive-foreground'
          ]">
            {{ toast.msg }}
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import Badge from '~/components/ui/badge/Badge.vue'
import { UserRoundPen } from 'lucide-vue-next'

definePageMeta({
  keepalive: true
})

const toast = ref(null)

const showToast = (msg, type = 'success') => {
  toast.value = { msg, type }
  setTimeout(() => toast.value = null, 3000)
}

const handleLogout = () => {
  showToast('Logged out successfully', 'success')
  setTimeout(() => navigateTo('/login'), 1000)
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
