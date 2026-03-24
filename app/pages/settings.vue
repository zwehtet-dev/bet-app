<template>
  <div class="min-h-screen bg-background">
    <div class="container mx-auto px-4 py-6 max-w-2xl">
      <div class="space-y-6">
        <!-- Notifications Section -->
        <div class="bg-card rounded-lg border p-6">
          <h2 class="text-lg font-semibold mb-4">{{ t('Notifications', 'အသိပေးချက်များ') }}</h2>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <h3 class="font-medium">{{ t('Push Notifications', 'အသိပေးချက်များ') }}</h3>
                <p class="text-sm text-muted-foreground">{{ t('Receive real-time notifications for bets and updates', 'လောင်းကစားမှုနှင့် အပ်ဒိတ်များအတွက် အချိန်နှင့်တပြေးညီ အသိပေးချက်များရယူပါ') }}</p>
              </div>
              <button
                @click="toggleNotifications"
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  notificationsEnabled ? 'bg-primary' : 'bg-muted'
                ]"
              >
                <span
                  :class="[
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                  ]"
                />
              </button>
            </div>
          </div>
        </div>

        <!-- About Section -->
        <div class="bg-card rounded-lg border p-6">
          <h2 class="text-lg font-semibold mb-4">{{ t('About', 'အကြောင်း') }}</h2>
          <div class="space-y-2 text-sm text-muted-foreground">
            <p>{{ t('Version', 'ဗားရှင်း') }}: 1.0.0</p>
            <p>© 2026 Soccer King</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { notificationsEnabled, toggleNotifications } = useToast()
const { locale, t } = useLanguage()

useHead({
  title: 'Settings - 2D3D'
})
</script>
