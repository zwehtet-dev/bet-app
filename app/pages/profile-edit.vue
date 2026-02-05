<template>
  <div class="container mx-auto p-4 space-y-6">
    
    <!-- Profile Picture -->
    <!-- <div class="flex flex-col items-center gap-4">
      <Avatar class="h-24 w-24">
        <AvatarFallback class="bg-primary text-primary-foreground text-2xl font-bold">
          {{ getInitials(form.name) }}
        </AvatarFallback>
      </Avatar>
      <Button 
        @click="showToast('Demo: Change profile picture feature')"
        variant="outline" 
        size="sm"
      >
        Change Photo
      </Button>
    </div> -->

    <!-- Edit Form -->
    
    <div class="pt-6 space-y-4">
      <div class="space-y-2">
        <label class="text-sm font-medium">User Name</label>
        <Input 
          v-model="form.username"
          placeholder="Enter your name"
          :disabled="isLoading"
        />
      </div>

      <div class="space-y-2">
        <label class="text-sm font-medium">Email</label>
        <Input 
          v-model="form.email"
          type="email"
          placeholder="Enter your email"
          :disabled="isLoading"
        />
      </div>

      <div class="space-y-2">
        <label class="text-sm font-medium">Phone Number</label>
        <Input 
          v-model="form.phone"
          type="tel"
          placeholder="Enter your phone number"
          :disabled="isLoading"
        />
      </div>

      <!-- <div class="space-y-2">
        <label class="text-sm font-medium">Role</label>
        <Input 
          v-model="form.role"
          disabled
          class="bg-muted"
        />
      </div> -->
    </div>

    <!-- Save Button -->
    <Button 
      @click="handleSave"
      class="w-full"
      size="lg"
      :disabled="isLoading"
    >
      {{ isLoading ? 'Saving...' : 'Save Changes' }}
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
import { ref, onMounted } from 'vue'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

definePageMeta({
  middleware: 'auth',
  keepalive: true
})

const { user, fetchUser } = useAuth()
const api = useApi()

const form = ref({
  name: '',
  email: '',
  phone: '',
  role: ''
})

const isLoading = ref(false)
const toast = ref(null)

const getInitials = (name) => {
  if (!name) return '?'
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const showToast = (msg, type = 'success') => {
  toast.value = { msg, type }
  setTimeout(() => toast.value = null, 3000)
}

const loadUserData = () => {
  if (user.value) {
    form.value = {
      username: user.value.username || '',
      email: user.value.email || '',
      phone: user.value.phone || '',
      role: user.value.role?.toUpperCase() || 'USER'
    }
  }
}

const handleSave = async () => {
  isLoading.value = true
  try {
    const response = await api.put('/api/auth/profile', {
      username: form.value.username,
      email: form.value.email,
      phone: form.value.phone
    })
    
    if (response.success) {
      // Refresh user data
      await fetchUser()
      showToast('Profile updated successfully', 'success')
      setTimeout(() => navigateTo('/profile'), 1000)
    }
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || 'Failed to update profile'
    showToast(message, 'error')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadUserData()
})

useHead({
  title: 'Edit Profile - 2D3D'
})
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
