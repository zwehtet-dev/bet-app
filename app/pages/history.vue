<template>
  <div class="container mx-auto p-4 space-y-6">

    <!-- Tab Switcher -->
    <div class="flex gap-2">
      <Button 
        @click="activeTab = '2d3d'" 
        :variant="activeTab === '2d3d' ? 'default' : 'outline'"
        class="flex-1"
        size="sm"
      >
        <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
        </svg>
        2D/3D
      </Button>
      <Button 
        @click="activeTab = 'soccer'" 
        :variant="activeTab === 'soccer' ? 'default' : 'outline'"
        class="flex-1"
        size="sm"
      >
        <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Football
      </Button>
    </div>

    <!-- 2D/3D Bets -->
    <div v-if="activeTab === '2d3d'" class="space-y-3">
      <Card v-for="bet in demoBets" :key="bet.id">
        <CardContent class="p-4">
          <div class="flex items-start gap-3 mb-4">
            <div :class="[
              'h-12 w-12 rounded-lg flex items-center justify-center',
              bet.gameType === '2D' ? 'bg-blue-500/10' : 'bg-purple-500/10'
            ]">
              <span :class="[
                'text-lg font-bold',
                bet.gameType === '2D' ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'
              ]">
                {{ bet.gameType }}
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <h3 class="text-sm font-semibold">{{ bet.gameType }} Lottery</h3>
                <Badge 
                  :variant="bet.status === 'won' ? 'default' : bet.status === 'lost' ? 'destructive' : 'secondary'"
                  class="text-[10px] px-1.5 py-0"
                >
                  {{ bet.status.toUpperCase() }}
                </Badge>
              </div>
              <p class="text-xs text-muted-foreground">{{ bet.date }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-semibold">{{ formatBalance(bet.amount) }} <span class="text-xs text-muted-foreground">MMK</span></p>
              <p v-if="bet.status === 'won'" class="text-sm font-bold text-green-600 dark:text-green-400">
                +{{ formatBalance(bet.winAmount) }}
              </p>
            </div>
          </div>
          
          <Separator class="mb-3" />
          
          <div class="space-y-2">
            <p class="text-xs text-muted-foreground">Selected Numbers</p>
            <div class="flex flex-wrap gap-2">
              <Badge 
                v-for="n in bet.numbers" 
                :key="n"
                :variant="bet.gameType === '2D' ? 'default' : 'secondary'"
                class="font-mono font-bold"
              >
                {{ n }}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Empty State -->
      <Card v-if="demoBets.length === 0" class="border-dashed">
        <CardContent class="flex flex-col items-center justify-center py-12">
          <div class="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <svg class="h-8 w-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p class="text-sm font-medium mb-1">No betting history</p>
          <p class="text-xs text-muted-foreground">Your 2D/3D bets will appear here</p>
        </CardContent>
      </Card>
    </div>

    <!-- Football Bets -->
    <div v-else class="space-y-3">
      <Card 
        v-for="bet in demoSoccerBets" 
        :key="bet.id"
        class="cursor-pointer hover:shadow-lg transition-all active:scale-[0.98]"
        @click="$router.push('/soccer-bet-details')"
      >
        <CardContent class="p-4">
          <div class="flex items-center gap-3">
            <div :class="[
              'h-12 w-12 rounded-lg flex items-center justify-center overflow-hidden',
              bet.type === 'Maung' ? 'bg-orange-500/10' : 'bg-green-500/10'
            ]">
              <img 
                :src="bet.type === 'Maung' ? '/images/maung_icon.png' : '/images/bawdi_icon.png'" 
                :alt="bet.type"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <h3 class="text-sm font-semibold">{{ bet.type }}</h3>
                <Badge 
                  :variant="bet.status === 'won' ? 'default' : bet.status === 'lost' ? 'destructive' : 'secondary'"
                  class="text-[10px] px-1.5 py-0"
                >
                  {{ bet.status.toUpperCase() }}
                </Badge>
              </div>
              <p class="text-xs text-muted-foreground">{{ bet.date }}</p>
            </div>
            <div class="text-right flex items-center gap-2">
              <div>
                <p class="text-sm font-semibold">{{ formatBalance(bet.amount) }} <span class="text-xs text-muted-foreground">MMK</span></p>
                <p v-if="bet.status === 'won'" class="text-xs font-bold text-green-600 dark:text-green-400">
                  +{{ formatBalance(bet.winAmount) }}
                </p>
              </div>
              <svg class="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Empty State -->
      <Card v-if="demoSoccerBets.length === 0" class="border-dashed">
        <CardContent class="flex flex-col items-center justify-center py-12">
          <div class="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <svg class="h-8 w-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-sm font-medium mb-1">No betting history</p>
          <p class="text-xs text-muted-foreground">Your football bets will appear here</p>
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
import { Separator } from '@/components/ui/separator'

definePageMeta({
  keepalive: true
})

const activeTab = ref('2d3d')

const demoBets = [
  { id: 1, gameType: '2D', status: 'won', amount: 5000, winAmount: 425000, date: 'Jan 27, 12:01 PM', numbers: ['47', '82', '35'] },
  { id: 2, gameType: '3D', status: 'pending', amount: 3000, date: 'Jan 26, 04:30 PM', numbers: ['456', '789'] },
  { id: 3, gameType: '2D', status: 'lost', amount: 2000, date: 'Jan 25, 12:01 PM', numbers: ['12', '34'] }
]

const demoSoccerBets = [
  { id: 1, type: 'Bawdi', status: 'won', amount: 10000, winAmount: 18500, date: 'Jan 27, 03:00 PM' },
  { id: 2, type: 'Maung', status: 'pending', amount: 15000, date: 'Jan 26, 07:00 PM' },
  { id: 3, type: 'Bawdi', status: 'lost', amount: 8000, date: 'Jan 25, 02:30 PM' }
]

const formatBalance = (n) => new Intl.NumberFormat('en-US').format(n || 0)
</script>
