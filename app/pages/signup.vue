<template>
  <div class="min-h-screen flex items-center justify-center p-4 text-white">
    <div class="w-full max-w-sm">
      <!-- Logo and Header -->
      <div class="text-center mb-8">
        <div class="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-orange-500/25">
          <span class="text-2xl font-black text-white">2D</span>
        </div>
        <h1 class="text-3xl font-black text-white mb-2">Join Us Today!</h1>
        <p class="text-white/60">Create your account to start betting</p>
      </div>

      <!-- Signup Form -->
      <div class="bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
        <!-- Error Message -->
        <div v-if="signupError" class="bg-red-500/20 border border-red-500/30 rounded-xl p-3 mb-6 text-center">
          <p class="text-sm text-red-400">{{ signupError }}</p>
        </div>

        <!-- Form Fields -->
        <div class="space-y-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-white/70 mb-2">Full Name</label>
            <input 
              v-model="signupForm.name" 
              type="text" 
              placeholder="Enter your full name"
              class="w-full bg-white/10 rounded-xl px-4 py-4 text-white placeholder-white/40 border border-white/10 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
              :disabled="authLoading"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-white/70 mb-2">Phone Number</label>
            <input 
              v-model="signupForm.phone" 
              type="tel" 
              placeholder="Enter your phone number"
              class="w-full bg-white/10 rounded-xl px-4 py-4 text-white placeholder-white/40 border border-white/10 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
              :disabled="authLoading"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-white/70 mb-2">Email Address</label>
            <input 
              v-model="signupForm.email" 
              type="email" 
              placeholder="Enter your email address"
              class="w-full bg-white/10 rounded-xl px-4 py-4 text-white placeholder-white/40 border border-white/10 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
              :disabled="authLoading"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-white/70 mb-2">Password</label>
            <div class="relative">
              <input 
                v-model="signupForm.password" 
                :type="showPassword ? 'text' : 'password'"
                placeholder="Create a strong password"
                class="w-full bg-white/10 rounded-xl px-4 py-4 pr-12 text-white placeholder-white/40 border border-white/10 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                :disabled="authLoading"
                @keyup.enter="handleSignup"
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
            <!-- Password strength indicator -->
            <div v-if="signupForm.password" class="mt-2">
              <div class="flex gap-1 mb-1">
                <div 
                  v-for="i in 4" 
                  :key="i"
                  class="h-1 flex-1 rounded-full transition-colors"
                  :class="i <= passwordStrength ? getStrengthColor(passwordStrength) : 'bg-white/10'"
                ></div>
              </div>
              <p class="text-xs" :class="getStrengthTextColor(passwordStrength)">
                {{ getStrengthText(passwordStrength) }}
              </p>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-white/70 mb-2">Confirm Password</label>
            <input 
              v-model="confirmPassword" 
              type="password" 
              placeholder="Confirm your password"
              class="w-full bg-white/10 rounded-xl px-4 py-4 text-white placeholder-white/40 border border-white/10 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
              :disabled="authLoading"
              @keyup.enter="handleSignup"
            >
            <p v-if="confirmPassword && signupForm.password !== confirmPassword" class="text-xs text-red-400 mt-1">
              Passwords do not match
            </p>
          </div>
        </div>

        <!-- Terms and Conditions -->
        <div class="mb-6">
          <label class="flex items-start gap-3 cursor-pointer">
            <input 
              v-model="acceptTerms" 
              type="checkbox" 
              class="w-5 h-5 rounded border-white/20 bg-white/10 text-amber-500 focus:ring-amber-500/20 focus:ring-2 mt-0.5"
            >
            <span class="text-sm text-white/70">
              I agree to the 
              <a href="#" class="text-amber-400 hover:text-amber-300 underline">Terms of Service</a> 
              and 
              <a href="#" class="text-amber-400 hover:text-amber-300 underline">Privacy Policy</a>
            </span>
          </label>
        </div>

        <!-- Signup Button -->
        <button 
          @click="handleSignup" 
          :disabled="!canSignup"
          class="w-full bg-gradient-to-r from-amber-500 to-orange-500 py-4 rounded-xl font-bold text-white shadow-lg shadow-orange-500/25 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 mb-4"
        >
          <span v-if="authLoading" class="flex items-center justify-center gap-2">
            <svg class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Creating Account...
          </span>
          <span v-else>Create Account</span>
        </button>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-white/10"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-slate-800/50 text-white/40">Already have an account?</span>
          </div>
        </div>

        <!-- Login Link -->
        <NuxtLink 
          to="/login" 
          class="w-full bg-white/10 hover:bg-white/15 py-4 rounded-xl font-medium text-white/80 hover:text-white border border-white/10 hover:border-white/20 transition-all active:scale-[0.98] flex items-center justify-center"
        >
          Sign In Instead
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
import { ref, computed } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useRouter } from 'vue-router'

const { signup, authLoading, isLoggedIn } = useAuth()
const router = useRouter()

// Redirect if already logged in
if (isLoggedIn.value) {
  await navigateTo('/')
}

const signupForm = ref({
  name: '',
  phone: '',
  email: '',
  password: ''
})

const confirmPassword = ref('')
const signupError = ref('')
const showPassword = ref(false)
const acceptTerms = ref(false)

// Password strength calculation
const passwordStrength = computed(() => {
  const password = signupForm.value.password
  if (!password) return 0
  
  let strength = 0
  if (password.length >= 8) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^A-Za-z0-9]/.test(password)) strength++
  
  return Math.min(strength, 4)
})

const canSignup = computed(() => {
  return signupForm.value.name &&
         signupForm.value.phone &&
         signupForm.value.email &&
         signupForm.value.password &&
         confirmPassword.value &&
         signupForm.value.password === confirmPassword.value &&
         acceptTerms.value &&
         !authLoading.value
})

const getStrengthColor = (strength) => {
  switch (strength) {
    case 1: return 'bg-red-500'
    case 2: return 'bg-orange-500'
    case 3: return 'bg-yellow-500'
    case 4: return 'bg-green-500'
    default: return 'bg-white/10'
  }
}

const getStrengthTextColor = (strength) => {
  switch (strength) {
    case 1: return 'text-red-400'
    case 2: return 'text-orange-400'
    case 3: return 'text-yellow-400'
    case 4: return 'text-green-400'
    default: return 'text-white/40'
  }
}

const getStrengthText = (strength) => {
  switch (strength) {
    case 1: return 'Weak password'
    case 2: return 'Fair password'
    case 3: return 'Good password'
    case 4: return 'Strong password'
    default: return 'Enter password'
  }
}

const handleSignup = async () => {
  if (!canSignup.value) {
    signupError.value = 'Please fill in all fields correctly'
    return
  }

  signupError.value = ''
  
  const result = await signup(
    signupForm.value.name,
    signupForm.value.email, // Using email as secretName
    signupForm.value.password,
    signupForm.value.phone
  )
  
  if (result.success) {
    // Redirect to home page on successful signup
    await navigateTo('/')
  } else {
    signupError.value = result.error || 'Registration failed. Please try again.'
  }
}

// Set page title
useHead({
  title: 'Sign Up - 2D3D Betting'
})
</script>