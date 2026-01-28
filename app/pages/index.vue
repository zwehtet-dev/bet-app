<template>
  <div class="container mx-auto p-4 space-y-6">
    
    <!-- Announcements Marquee -->
    <div class="relative overflow-hidden rounded-lg border bg-muted/50 py-3">
      <div class="flex animate-marquee whitespace-nowrap">
        <span v-for="(a, i) in [...announcements, ...announcements]" :key="i" class="mx-8 text-sm text-muted-foreground">
          <span class="text-primary font-medium">•</span> {{ a.message }}
        </span>
      </div>
    </div>

    <!-- Balance Card -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <CardDescription>Available Balance</CardDescription>
            <CardTitle class="text-3xl font-bold">{{ formatBalance(demoBalance) }} <span class="text-lg text-muted-foreground font-normal">MMK</span></CardTitle>
          </div>
          <div class="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <svg class="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <NuxtLink to="/wallet">
          <Button class="w-full" size="lg">
            <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Funds
          </Button>
        </NuxtLink>
      </CardContent>
    </Card>

    <!-- Carousel -->
    <Carousel class="w-full" :opts="{ loop: true }">
      <CarouselContent>
        <CarouselItem v-for="(slide, index) in slides" :key="index">
          <Card>
            <CardContent class="flex aspect-[2/1] items-center justify-center p-6">
              <div class="text-center space-y-2">
                <h3 class="text-2xl font-bold">{{ slide.title }}</h3>
                <p class="text-sm text-muted-foreground">{{ slide.subtitle }}</p>
              </div>
            </CardContent>
          </Card>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious class="left-4" />
      <CarouselNext class="right-4" />
    </Carousel>

    <!-- Games Section -->
    <div class="space-y-3">
      <h2 class="text-xl font-semibold">Games</h2>
      
      <div class="grid grid-cols-2 gap-4">
        <NuxtLink v-for="g in games" :key="g.path" :to="g.path">
          <Card class="hover:bg-accent transition-colors cursor-pointer gap-0">
            <CardContent class="flex flex-col items-center justify-center py-8 space-y-3">
              <div class="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                {{ g.label }}
              </div>
              <CardTitle class="text-base">{{ g.title }}</CardTitle>
            </CardContent>
          </Card>
        </NuxtLink>
      </div>
    </div>

    <!-- Live Results -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold">Live Results</h2>
        <NuxtLink to="/results">
          <Button variant="ghost" size="sm">
            View All
            <svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </NuxtLink>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <!-- 2D Results Card -->
        <Card class="gap-3">
          <CardHeader>
            <div class="flex items-center gap-2">
              <div class="h-8 w-8 rounded-md bg-blue-500/10 flex items-center justify-center">
                <span class="text-sm font-bold text-blue-600 dark:text-blue-400">2D</span>
              </div>
              <CardDescription>Today</CardDescription>
            </div>
          </CardHeader>
          <CardContent class="space-y-2">
            <div class="flex justify-between items-center text-sm">
              <span class="text-muted-foreground">12:00 PM</span>
              <span class="font-bold text-blue-600 dark:text-blue-400">{{ results.morning2D }}</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-muted-foreground">4:30 PM</span>
              <span class="font-bold text-blue-600 dark:text-blue-400">{{ results.evening2D }}</span>
            </div>
            <div class="flex justify-between items-center text-sm pt-2 border-t">
              <span class="text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                <span class="h-1.5 w-1.5 bg-green-600 dark:bg-green-400 rounded-full animate-pulse"></span>
                LIVE
              </span>
              <span class="font-bold text-green-600 dark:text-green-400">{{ results.live2D }}</span>
            </div>
          </CardContent>
        </Card>

        <!-- 3D Results Card -->
        <Card class="gap-3">
          <CardHeader>
            <div class="flex items-center gap-2">
              <div class="h-8 w-8 rounded-md bg-purple-500/10 flex items-center justify-center">
                <span class="text-sm font-bold text-purple-600 dark:text-purple-400">3D</span>
              </div>
              <CardDescription>Latest</CardDescription>
            </div>
          </CardHeader>
          <CardContent class="flex flex-col items-center justify-center py-2">
            <p class="text-3xl font-bold text-purple-600 dark:text-purple-400">{{ results.latest3D }}</p>
            <p class="text-xs text-muted-foreground mt-1">{{ results.latest3DDate }}</p>
          </CardContent>
        </Card>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'

definePageMeta({
  keepalive: true
})

const demoBalance = ref(500000)

const announcements = [
  { message: 'Welcome! Get 20% bonus on your first deposit' },
  { message: 'New football betting features available' },
  { message: 'Check today\'s hot numbers and win big' }
]

const slides = [
  { title: 'Welcome Bonus', subtitle: 'Get 20% on first deposit' },
  { title: 'Lucky Numbers', subtitle: 'Check today\'s predictions' },
  { title: 'Football Betting', subtitle: 'Bet on your favorite teams' }
]

const results = ref({
  morning2D: '47',
  evening2D: '82',
  live2D: '35',
  latest3D: '456',
  latest3DDate: '16 Jan 2026'
})

const games = [
  { 
    path: '/2d',
    label: '2D',
    title: '2D Lottery'
  },
  { 
    path: '/3d',
    label: '3D',
    title: '3D Lottery'
  },
  { 
    path: '/bawdi',
    label: 'BD',
    title: 'Bawdi'
  },
  { 
    path: '/maung',
    label: 'MG',
    title: 'Maung'
  }
]

const formatBalance = (n) => new Intl.NumberFormat('en-US').format(n || 0)
</script>

<style scoped>
@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-marquee {
  animation: marquee 30s linear infinite;
}

.animate-marquee:hover {
  animation-play-state: paused;
}
</style>
