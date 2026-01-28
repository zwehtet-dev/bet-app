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
        <div class="space-y-2">
          <label for="phone" class="text-sm font-medium">Phone Number</label>
          <Input
            id="phone"
            v-model="phone"
            type="tel"
            placeholder="09xxxxxxxxx"
            class="w-full"
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

<script setup>
import { ref } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

definePageMeta({
  layout: false
})

const phone = ref('')
const password = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  isLoading.value = true
  
  // Simulate API call
  setTimeout(() => {
    console.log('Login:', { phone: phone.value, password: password.value })
    isLoading.value = false
    navigateTo('/')
  }, 1000)
}

useHead({
  title: 'Login - 2D3D'
})
</script>
