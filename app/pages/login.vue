<template>
  <div class="min-h-screen flex items-center justify-center p-4 text-white">
    <div class="w-full max-w-sm">
      <!-- Logo and Header -->
      <div class="text-center mb-8">
        <div class="w-20 h-20 rounded-3xl overflow-hidden mx-auto mb-6 shadow-2xl shadow-orange-500/25">
          <img src="/images/logo.jpg" alt="2D3D Logo" class="w-full h-full object-cover">
        </div>
        <h1 class="text-3xl font-black text-white mb-2">Welcome Back!</h1>
        <p class="text-white/60">Sign in to continue betting</p>
      </div>

      <!-- Login Form -->
      <div class="bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
        <!-- Error Message -->
        <div v-if="loginError" class="bg-red-500/20 border border-red-500/30 rounded-xl p-3 mb-6 text-center">
          <p class="text-sm text-red-400">{{ loginError }}</p>
        </div>

        <!-- Form Fields -->
        <div class="space-y-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-white/70 mb-2">Phone / Email</label>
            <input 
              v-model="loginForm.phone" 
              type="text" 
              placeholder="Enter your phone or email"
              class="w-full bg-white/10 rounded-xl px-4 py-4 text-white placeholder-white/40 border border-white/10 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
              :disabled="authLoading"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-white/70 mb-2">Password</label>
            <div class="relative">
              <input 
                v-model="loginForm.password" 
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password"
                class="w-full bg-white/10 rounded-xl px-4 py-4 pr-12 text-white placeholder-white/40 border border-white/10 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                :disabled="authLoading"
                @keyup.enter="handleLogin"
              >
              <button 
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-white/40 hover:text-white/60 transition-colors"
              >
                <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Remember Me -->
        <div class="flex items-center mb-6">
          <label class="flex items-center cursor-pointer group">
            <input 
              v-model="rememberMe" 
              type="checkbox" 
              class="sr-only peer"
            >
            <div class="w-5 h-5 rounded-md border-2 border-white/20 bg-white/5 flex items-center justify-center transition-all peer-checked:bg-amber-500 peer-checked:border-amber-500 group-hover:border-white/40">
              <svg class="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span class="ml-2 text-sm text-white/60 group-hover:text-white/80 transition-colors">Remember me</span>
          </label>
        </div>

        <!-- Login Button -->
        <button 
          @click="handleLogin" 
          :disabled="authLoading || !loginForm.phone || !loginForm.password"
          class="w-full bg-gradient-to-r from-amber-500 to-orange-500 py-4 rounded-xl font-bold text-white shadow-lg shadow-orange-500/25 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 mb-4"
        >
          <span v-if="authLoading" class="flex items-center justify-center gap-2">
            <svg class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Signing In...
          </span>
          <span v-else>Sign In</span>
        </button>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-white/10"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-slate-800/50 text-white/40">Don't have an account?</span>
          </div>
        </div>

        <!-- Sign Up Link -->
        <NuxtLink 
          to="/signup" 
          class="w-full bg-white/10 hover:bg-white/15 py-4 rounded-xl font-medium text-white/80 hover:text-white border border-white/10 hover:border-white/20 transition-all active:scale-[0.98] flex items-center justify-center"
        >
          Create New Account
        </NuxtLink>
      </div>

      <!-- Back to Home -->
      <div class="text-center mt-6">
        <NuxtLink 
          to="/" 
          class="inline-flex items-center gap-2 text-white/60 hover:text-white/80 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'

// Use auth layout
definePageMeta({
  layout: 'auth'
})

const { login, authLoading, isLoggedIn } = useAuth()

// Redirect if already logged in
if (isLoggedIn.value) {
  await navigateTo('/')
}

const loginForm = ref({
  phone: '',
  password: ''
})

const loginError = ref('')
const showPassword = ref(false)
const rememberMe = ref(true)

const handleLogin = async () => {
  if (!loginForm.value.phone || !loginForm.value.password) {
    loginError.value = 'Please fill in all fields'
    return
  }

  loginError.value = ''
  
  const result = await login(loginForm.value.phone, loginForm.value.password, rememberMe.value)
  
  if (result.success) {
    await navigateTo('/')
  } else {
    loginError.value = result.error || 'Login failed. Please try again.'
  }
}

useHead({
  title: 'Login - 2D3D Betting'
})
</script>