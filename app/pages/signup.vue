<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <Card class="w-full max-w-md">
      <CardHeader class="space-y-1 text-center">
        <div class="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-4">
          <img src="/images/logo.jpg" alt="2D3D Logo" class="w-full h-full object-cover">
        </div>
        <CardTitle class="text-2xl font-semibold">Create Account</CardTitle>
        <CardDescription>
          Enter your information to get started
        </CardDescription>
      </CardHeader>
      
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <label for="name" class="text-sm font-medium">Full Name</label>
          <Input
            id="name"
            v-model="name"
            type="text"
            placeholder="Enter your name"
            class="w-full"
          />
        </div>

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
            placeholder="Create a password"
            class="w-full"
          />
        </div>

        <div class="space-y-2">
          <label for="confirmPassword" class="text-sm font-medium">Confirm Password</label>
          <Input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            class="w-full"
          />
        </div>

        <Button 
          @click="handleSignup" 
          class="w-full"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Creating account...' : 'Sign Up' }}
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

<script setup>
import { ref } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

definePageMeta({
  layout: false
})

const name = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)

const handleSignup = async () => {
  if (password.value !== confirmPassword.value) {
    alert('Passwords do not match')
    return
  }

  isLoading.value = true
  
  // Simulate API call
  setTimeout(() => {
    console.log('Signup:', { 
      name: name.value, 
      phone: phone.value, 
      password: password.value 
    })
    isLoading.value = false
    navigateTo('/login')
  }, 1000)
}

useHead({
  title: 'Sign Up - 2D3D'
})
</script>
