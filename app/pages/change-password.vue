<template>
  <div class="container mx-auto p-4">
    <Card class="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>Update your account password</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div v-if="errorMessage" class="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
          {{ errorMessage }}
        </div>

        <div v-if="successMessage" class="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm">
          {{ successMessage }}
        </div>

        <div class="space-y-2">
          <label for="current_password" class="text-sm font-medium">Current Password</label>
          <Input
            id="current_password"
            v-model="currentPassword"
            type="password"
            placeholder="Enter current password"
            @keyup.enter="handleSubmit"
          />
        </div>

        <div class="space-y-2">
          <label for="new_password" class="text-sm font-medium">New Password</label>
          <Input
            id="new_password"
            v-model="newPassword"
            type="password"
            placeholder="Enter new password"
            @keyup.enter="handleSubmit"
          />
          <p class="text-xs text-muted-foreground">Minimum 8 characters</p>
        </div>

        <div class="space-y-2">
          <label for="confirm_password" class="text-sm font-medium">Confirm New Password</label>
          <Input
            id="confirm_password"
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            @keyup.enter="handleSubmit"
          />
        </div>

        <div class="flex gap-3 pt-4">
          <Button
            @click="handleSubmit"
            class="flex-1"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? 'Updating...' : 'Update Password' }}
          </Button>
          <Button
            @click="navigateTo('/profile')"
            variant="outline"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

definePageMeta({
  middleware: 'auth'
})

const api = useApi()

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const isSubmitting = ref(false)

const handleSubmit = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  // Validation
  if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
    errorMessage.value = 'All fields are required'
    return
  }

  if (newPassword.value.length < 8) {
    errorMessage.value = 'New password must be at least 8 characters'
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = 'New passwords do not match'
    return
  }

  isSubmitting.value = true
  try {
    await api.put('/api/auth/change-password', {
      current_password: currentPassword.value,
      new_password: newPassword.value,
      new_password_confirmation: confirmPassword.value
    })

    successMessage.value = 'Password updated successfully!'
    
    // Clear form
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''

    // Redirect after 2 seconds
    setTimeout(() => {
      navigateTo('/profile')
    }, 2000)
  } catch (error: any) {
    errorMessage.value = error?.response?.data?.message || error?.message || 'Failed to update password. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

useHead({
  title: 'Change Password - 2D3D'
})
</script>
