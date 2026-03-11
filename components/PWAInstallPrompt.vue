<template>
  <ClientOnly>
    <div v-if="pwa.showInstallPrompt.value && !pwa.isInstalled.value" class="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom">
      <Card class="border-primary/20 bg-card/95 backdrop-blur">
        <CardContent class="p-4">
          <div class="flex items-start gap-3">
            <div class="flex-1">
              <h3 class="font-semibold text-sm mb-1">Install 2D3D App</h3>
              <p class="text-xs text-muted-foreground">Install our app for a better experience and quick access</p>
            </div>
            <Button size="sm" @click="pwa.installApp">
              Install
            </Button>
            <Button size="sm" variant="ghost" @click="pwa.dismissInstallPrompt">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              </svg>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { usePWA } from '~/composables/usePWA';

const pwa = usePWA();
</script>
