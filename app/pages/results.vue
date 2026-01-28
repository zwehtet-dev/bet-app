<template>
  <div class="container mx-auto p-4 space-y-6">
    
    <!-- Tab Switcher -->
    <div class="flex gap-2">
      <Button 
        @click="activeTab = '2d'" 
        :variant="activeTab === '2d' ? 'default' : 'outline'"
        class="flex-1"
        size="sm"
      >
        <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
        </svg>
        2D Results
      </Button>
      <Button 
        @click="activeTab = '3d'" 
        :variant="activeTab === '3d' ? 'default' : 'outline'"
        class="flex-1"
        size="sm"
      >
        <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        3D Results
      </Button>
    </div>

    <!-- 2D Results -->
    <div v-if="activeTab === '2d'" class="space-y-3">
      <Card v-for="result in demo2DResults" :key="result.date">
        <CardContent class="p-4">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-sm font-semibold">{{ result.date }}</h3>
              <p class="text-xs text-muted-foreground">{{ result.day }}</p>
            </div>
            <Badge v-if="result.isLive" variant="default" class="bg-green-500 hover:bg-green-600">
              <span class="relative flex h-2 w-2 mr-1">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              LIVE
            </Badge>
          </div>
          
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-muted rounded-lg p-4">
              <p class="text-xs text-muted-foreground mb-2">12:01 PM</p>
              <p class="text-3xl font-bold text-blue-600 dark:text-blue-400">{{ result.morning }}</p>
            </div>
            <div class="bg-muted rounded-lg p-4">
              <p class="text-xs text-muted-foreground mb-2">4:30 PM</p>
              <p class="text-3xl font-bold text-blue-600 dark:text-blue-400">{{ result.evening }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- 3D Results -->
    <div v-else class="space-y-3">
      <Card v-for="result in demo3DResults" :key="result.date">
        <CardContent class="p-4">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <h3 class="text-sm font-semibold mb-1">{{ result.date }}</h3>
              <p class="text-xs text-muted-foreground">{{ result.session }}</p>
            </div>
            <div class="text-right">
              <p class="text-4xl font-bold text-purple-600 dark:text-purple-400">{{ result.number }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

definePageMeta({
  keepalive: true
})

const activeTab = ref('2d')

const demo2DResults = [
  { date: 'Jan 28, 2026', day: 'Today', morning: '47', evening: '82', isLive: true },
  { date: 'Jan 27, 2026', day: 'Yesterday', morning: '35', evening: '91', isLive: false },
  { date: 'Jan 26, 2026', day: 'Sunday', morning: '12', evening: '56', isLive: false }
]

const demo3DResults = [
  { date: 'Jan 16, 2026', session: 'Second Draw', number: '456' },
  { date: 'Jan 1, 2026', session: 'First Draw', number: '789' },
  { date: 'Dec 16, 2025', session: 'Second Draw', number: '123' }
]
</script>
