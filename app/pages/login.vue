<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <Card class="w-full max-w-md">
      <CardHeader class="space-y-1 text-center">
        <div class="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-4">
          <img src="/images/logo.jpg" alt="2D3D Logo" class="w-full h-full object-cover">
        </div>
        <CardTitle class="text-2xl font-semibold">Welcome Back</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      
      <CardContent class="space-y-4">
        <div v-if="errorMessage" class="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
          {{ errorMessage }}
        </div>

        <div class="space-y-2">
          <label for="identifier" class="text-sm font-medium">Phone / Email </label>
          <Input
            id="identifier"
            v-model="identifier"
            type="text"
            placeholder="09xxxxxxxxx or email or username"
            class="w-full"
            @keyup.enter="handleLogin"
          />
        </div>

        <div class="space-y-2">
          <label for="password" class="text-sm font-medium">Password</label>
          <Input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter your password"
            class="w-full"
            @keyup.enter="handleLogin"
          />
        </div>

        <Button 
          @click="handleLogin" 
          class="w-full"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Signing in...' : 'Sign In' }}
        </Button>

        <Separator />

        <div class="text-center text-sm">
          <span class="text-muted-foreground">Don't have an account? </span>
          <NuxtLink to="/signup" class="font-medium hover:underline">
            Sign up
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

const { login } = useAuth()
const identifier = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  if (!identifier.value || !password.value) {
    errorMessage.value = 'Please enter your phone/email/username and password'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  
  try {
    const result = await login(identifier.value, password.value)
    
    if (result?.success) {
      navigateTo('/')
    } else {
      errorMessage.value = result?.error || 'Login failed. Please try again.'
    }
  } catch (error: any) {
    errorMessage.value = error.message || 'An error occurred. Please try again.'
  } finally {
    isLoading.value = false
  }
}

useHead({
  title: 'Login - 2D3D'
})
</script>
