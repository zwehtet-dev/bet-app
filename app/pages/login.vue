<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <Card class="w-full max-w-md">
      <CardHeader class="space-y-1 text-center">
        <div class="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-4">
          <img src="/images/logo.png" alt="2D3D Logo" class="w-full h-full object-cover">
        </div>
        <CardTitle class="text-2xl font-semibold">{{ t('Welcome Back', 'ပြန်လည်ကြိုဆိုပါတယ်') }}</CardTitle>
        <CardDescription>
          {{ t('Enter your credentials to access your account', 'သင့်အကောင့်ကို ဝင်ရောက်ရန် အချက်အလက်များ ထည့်သွင်းပါ') }}
        </CardDescription>
      </CardHeader>
      
      <CardContent class="space-y-4">
        <div v-if="errorMessage" class="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
          {{ errorMessage }}
        </div>

        <div class="space-y-2">
          <label for="identifier" class="text-sm font-medium">{{ t('Phone / Email', 'ဖုန်း / အီးမေးလ်') }}</label>
          <Input
            id="identifier"
            v-model="identifier"
            type="text"
            :placeholder="t('09xxxxxxxxx or email or username', '09xxxxxxxxx သို့မဟုတ် အီးမေးလ် သို့မဟုတ် အသုံးပြုသူအမည်')"
            class="w-full"
            @keyup.enter="handleLogin"
          />
        </div>

        <div class="space-y-2">
          <label for="password" class="text-sm font-medium">{{ t('Password', 'စကားဝှက်') }}</label>
          <Input
            id="password"
            v-model="password"
            type="password"
            :placeholder="t('Enter your password', 'စကားဝှက်ထည့်ပါ')"
            class="w-full"
            @keyup.enter="handleLogin"
          />
        </div>

        <Button 
          @click="handleLogin" 
          class="w-full"
          :disabled="isLoading"
        >
          {{ isLoading ? t('Signing in...', 'ဝင်ရောက်နေသည်...') : t('Sign In', 'ဝင်ရောက်မည်') }}
        </Button>

        <Separator />

        <div class="text-center text-sm">
          <span class="text-muted-foreground">{{ t("Don't have an account?", 'အကောင့်မရှိသေးဘူးလား?') }} </span>
          <NuxtLink to="/signup" class="font-medium hover:underline">
            {{ t('Sign up', 'အကောင့်ဖွင့်မည်') }}
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
const { locale, t } = useLanguage()
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
