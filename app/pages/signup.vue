<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <Card class="w-full max-w-md">
      <CardHeader class="space-y-1 text-center">
        <div class="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-4">
          <img src="/images/logo.jpg" alt="2D3D Logo" class="w-full h-full object-cover">
        </div>
        <CardTitle class="text-2xl font-semibold">Create Account</CardTitle>
        <CardDescription>
          Sign up to start betting
        </CardDescription>
      </CardHeader>
      
      <CardContent class="space-y-4">
        <div v-if="errorMessage" class="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
          {{ errorMessage }}
        </div>

        <div class="space-y-2">
          <label for="username" class="text-sm font-medium">Username</label>
          <Input
            id="username"
            v-model="formData.username"
            type="text"
            placeholder="johndoe"
            class="w-full"
          />
        </div>

        <div class="space-y-2">
          <label for="email" class="text-sm font-medium">Email</label>
          <Input
            id="email"
            v-model="formData.email"
            type="email"
            placeholder="john@example.com"
            class="w-full"
          />
        </div>

        <div class="space-y-2">
          <label for="phone" class="text-sm font-medium">Phone Number</label>
          <Input
            id="phone"
            v-model="formData.phone"
            type="tel"
            placeholder="09xxxxxxxxx"
            class="w-full"
          />
        </div>

        <div class="space-y-2">
          <label for="password" class="text-sm font-medium">Password</label>
          <Input
            id="password"
            v-model="formData.password"
            type="password"
            placeholder="Minimum 8 characters"
            class="w-full"
          />
        </div>

        <div class="space-y-2">
          <label for="password_confirmation" class="text-sm font-medium">Confirm Password</label>
          <Input
            id="password_confirmation"
            v-model="formData.password_confirmation"
            type="password"
            placeholder="Re-enter password"
            class="w-full"
            @keyup.enter="handleSignup"
          />
        </div>

        <Button 
          @click="handleSignup" 
          class="w-full"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Creating Account...' : 'Sign Up' }}
        </Button>

        <Separator />

        <div class="text-center text-sm">
          <span class="text-muted-foreground">Already have an account? </span>
          <NuxtLink to="/login" class="font-medium hover:underline">
            Sign in
          </NuxtLink>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

definePageMeta({
  layout: false
})

const api = useApi()

const formData = ref({
  name: '',
  username: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: ''
})

const isLoading = ref(false)
const errorMessage = ref('')

const handleSignup = async () => {
  errorMessage.value = ''

  // Validation
  if ( !formData.value.username || !formData.value.email || 
      !formData.value.phone || !formData.value.password || !formData.value.password_confirmation) {
    errorMessage.value = 'All fields are required'
    return
  }

  if (formData.value.password.length < 8) {
    errorMessage.value = 'Password must be at least 8 characters'
    return
  }

  if (formData.value.password !== formData.value.password_confirmation) {
    errorMessage.value = 'Passwords do not match'
    return
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formData.value.email)) {
    errorMessage.value = 'Please enter a valid email address'
    return
  }

  // Phone validation (Myanmar format)
  const phoneRegex = /^09\d{7,9}$/
  if (!phoneRegex.test(formData.value.phone)) {
    errorMessage.value = 'Please enter a valid phone number (09xxxxxxxxx)'
    return
  }

  isLoading.value = true
  
  try {
    const response: any = await api.post('/api/auth/register', formData.value)
    
    if (response.success) {
      // Auto-login after registration
      const { user } = useAuth()
      user.value = response.data.user
      
      alert('Account created successfully!')
      navigateTo('/')
    } else {
      errorMessage.value = response.message || 'Registration failed. Please try again.'
    }
  } catch (error: any) {
    if (error?.response?.data?.errors) {
      // Laravel validation errors
      const errors = Object.values(error.response.data.errors).flat()
      errorMessage.value = errors[0] as string
    } else {
      errorMessage.value = error?.response?.data?.message || error?.message || 'An error occurred. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}

useHead({
  title: 'Sign Up - 2D3D'
})
</script>
