<template>
  <div class="container mx-auto p-4 space-y-6">
    
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
const { success, error } = useToast()
const api = useApi()

const form = ref({
  name: '',
  email: '',
  phone: '',
  role: ''
})

const isLoading = ref(false)

const getInitials = (name) => {
  if (!name) return '?'
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
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
      success('Profile updated successfully')
      setTimeout(() => navigateTo('/profile'), 1000)
    }
  } catch (err) {
    const message = err?.response?.data?.message || err?.message || 'Failed to update profile'
    error(message)
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
