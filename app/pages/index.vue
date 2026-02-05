<template>
  <div class="container mx-auto p-4 space-y-6">
    
    <!-- Announcements Marquee -->
    <div v-if="announcements.length > 0" class="relative overflow-hidden rounded-lg border bg-muted/50 py-3">
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
            <CardDescription>{{ user?.role === 'agent' ? 'Agent Balance' : 'Available Balance' }}</CardDescription>
            <CardTitle class="text-3xl font-bold">{{ formatBalance(balance) }} <span class="text-lg text-muted-foreground font-normal">MMK</span></CardTitle>
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
            {{ user?.role === 'agent' ? 'View Details' : 'Add Funds' }}
          </Button>
        </NuxtLink>
      </CardContent>
    </Card>

    <!-- Carousel -->
    <Carousel v-if="slides.length > 0" class="w-full" :opts="{ loop: true }">
      <CarouselContent>
        <CarouselItem v-for="(slide, index) in slides" :key="index">
          <div v-if="slide.image" class="aspect-[2/1] w-full">
            <img :src="slide.image" :alt="slide.title" class="w-full h-full object-cover rounded-lg" />
          </div>
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
          <Card class="hover:bg-accent transition-colors cursor-pointer gap-0 p-0">
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

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'

definePageMeta({
  keepalive: true
})

const { user, fetchUser } = useAuth()
const { get } = useApi()

const announcements = ref([])
const slides = ref([])
const loading = ref(true)

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

const balance = computed(() => {
  // For agents, show calculated balance (winnings + commission - credits)
  if (user.value?.role === 'agent' && user.value?.agent) {
    return user.value.agent.calculated_balance || 0
  }
  // For regular users, show wallet balance
  return user.value?.wallet?.balance || 0
})

const formatBalance = (n) => new Intl.NumberFormat('en-US').format(n || 0)

const fetchHomeData = async () => {
  try {
    loading.value = true
    
    // Fetch app content (carousels and announcements)
    const contentResponse = await get('/api/app-content')
    
    if (contentResponse.carousels) {
      slides.value = contentResponse.carousels.map(c => ({
        title: c.title,
        subtitle: c.description || '',
        image: c.image_url,
        link: c.link_url
      }))
    }
    
    if (contentResponse.announcements) {
      announcements.value = contentResponse.announcements.map(a => ({
        message: a.content,
        type: a.type
      }))
    }
    
    // Fetch user data to get latest balance
    if (user.value) {
      await fetchUser()
    }
  } catch (error) {
    console.error('Failed to fetch home data:', error)
    // Set fallback data
    announcements.value = [
      { message: 'Welcome to our betting platform!', type: 'info' }
    ]
    slides.value = [
      { title: 'Welcome', subtitle: 'Start betting today' }
    ]
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchHomeData()
})
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
