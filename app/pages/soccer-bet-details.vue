<template>
  <div class="container mx-auto p-4 space-y-6">
    
    <!-- Bet Summary -->
    <Card>
      <CardHeader>
        <div class="flex items-center gap-3">
          <div class="h-12 w-12 rounded-lg overflow-hidden bg-muted">
            <img :src="betData.icon" :alt="betData.type" class="w-full h-full object-cover" />
          </div>
          <div class="flex-1">
            <CardDescription>{{ betData.id }}</CardDescription>
            <CardTitle class="text-lg">{{ betData.type }}</CardTitle>
          </div>
          <Badge :variant="getStatusVariant(betData.status)">
            {{ betData.status.toUpperCase() }}
          </Badge>
        </div>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-muted-foreground mb-1">Stake</p>
            <p class="text-2xl font-bold">{{ formatBalance(betData.totalAmount) }} <span class="text-sm text-muted-foreground font-normal">MMK</span></p>
          </div>
          <div>
            <p class="text-sm text-muted-foreground mb-1">
              {{ betData.status === 'won' ? 'Won' : 'Potential' }}
            </p>
            <p :class="[
              'text-2xl font-bold',
              betData.status === 'won' ? 'text-green-600 dark:text-green-400' : ''
            ]">
              {{ formatBalance(betData.potentialWin) }} <span class="text-sm text-muted-foreground font-normal">MMK</span>
            </p>
          </div>
        </div>

        <div v-if="betData.status === 'won'" class="flex items-center gap-2 p-3 rounded-lg bg-green-500/10">
          <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-sm text-green-600 dark:text-green-400 font-medium">You won this bet!</p>
        </div>
      </CardContent>
    </Card>

    <!-- Matches -->
    <div class="space-y-3">
      <Card v-for="(match, index) in betData.matches" :key="index">
        <CardHeader>
          <div class="flex items-start justify-between gap-3">
            <div class="flex-1 min-w-0">
              <CardTitle class="text-base">{{ match.homeTeam }} vs {{ match.awayTeam }}</CardTitle>
              <CardDescription>{{ match.league }}</CardDescription>
            </div>
            <Badge :variant="getBetTypeVariant(match.betType)" class="shrink-0">
              {{ match.betType }}
            </Badge>
          </div>
        </CardHeader>
        <CardContent class="space-y-3">
          <div class="flex items-center justify-between text-sm">
            <span class="text-muted-foreground">{{ match.kickoff }}</span>
            <span class="font-bold">{{ match.odds }}</span>
          </div>

          <div v-if="match.score" class="p-4 rounded-lg bg-muted/50 flex items-center justify-center gap-6">
            <div class="text-center">
              <p class="text-3xl font-bold">{{ match.score.home }}</p>
            </div>
            <span class="text-muted-foreground font-bold">-</span>
            <div class="text-center">
              <p class="text-3xl font-bold">{{ match.score.away }}</p>
            </div>
          </div>

          <Separator />

          <div class="flex items-center justify-between text-sm">
            <span class="text-muted-foreground">{{ formatBalance(match.amount) }} MMK</span>
            <Badge v-if="match.result" :variant="match.result === 'won' ? 'default' : 'destructive'">
              {{ match.result === 'won' ? 'Won' : 'Lost' }}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>


  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

definePageMeta({
  keepalive: true
})

// Demo data - In production, this would come from route params or API
const betData = ref({
  id: '#BET2026012701',
  type: 'Bawdi',
  title: 'Body Style Mix',
  betStyle: 'Body Style',
  icon: '/images/bawdi_icon.png',
  status: 'pending', // 'pending', 'won', 'lost'
  totalAmount: 10000,
  potentialWin: 18500,
  totalOdds: '1.85',
  placedDate: 'Jan 27, 2026 3:00 PM',
  matches: [
    {
      homeTeam: 'Man United',
      awayTeam: 'Liverpool',
      league: 'Premier League',
      betType: 'Home Win',
      odds: '1.85',
      amount: 5000,
      kickoff: 'Jan 28, 8:00 PM',
      score: null, // { home: 2, away: 1 } when finished
      result: null // 'won' or 'lost' when finished
    },
    {
      homeTeam: 'Barcelona',
      awayTeam: 'Real Madrid',
      league: 'La Liga',
      betType: 'Away Win',
      odds: '2.05',
      amount: 5000,
      kickoff: 'Jan 28, 10:00 PM',
      score: null,
      result: null
    }
  ]
})

const formatBalance = (n) => new Intl.NumberFormat('en-US').format(n || 0)

const getStatusVariant = (status) => {
  switch (status) {
    case 'won': return 'default'
    case 'lost': return 'destructive'
    case 'pending': return 'secondary'
    default: return 'outline'
  }
}

const getBetTypeVariant = (betType) => {
  if (betType.includes('Home')) return 'default'
  if (betType.includes('Away')) return 'secondary'
  return 'outline'
}

useHead({
  title: `${betData.value.type} Bet Details - 2D3D Demo`
})
</script>
