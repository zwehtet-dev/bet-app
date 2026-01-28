<template>
  <div class="container mx-auto p-4 space-y-6">

    <!-- Selected Matches Card -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <CardTitle class="text-base">
            Selected Matches <Badge variant="secondary" class="ml-2">{{ selectedCount }}/10</Badge>
          </CardTitle>
          <Button v-if="selectedCount > 0" @click="clearAll" variant="ghost" size="sm">
            Clear All
          </Button>
        </div>
        <CardDescription class="text-xs">Minimum: 3 matches, Maximum: 10 matches</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="flex flex-wrap gap-2 min-h-[32px]">
          <Badge v-for="s in selectedBets" :key="s.key" class="text-sm">
            {{ s.label }}
            <button @click="removeSelection(s.key)" class="ml-1.5 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100">
              <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </Badge>
          <span v-if="!selectedCount" class="text-sm text-muted-foreground py-0.5">
            Select matches below
          </span>
        </div>
      </CardContent>
    </Card>

    <!-- Matches List -->
    <div class="space-y-3">
      
      <Card v-for="match in demoMatches" :key="match.id">
        <CardHeader>
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <CardTitle class="text-base">{{ match.home }} vs {{ match.away }}</CardTitle>
              <CardDescription class="text-xs">{{ match.league }} • {{ match.time }}</CardDescription>
            </div>
            <Badge v-if="match.live" variant="default" class="bg-green-500">
              <span class="h-1.5 w-1.5 bg-white rounded-full animate-pulse mr-1"></span>
              LIVE
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-2 gap-2">
            <Button 
              @click="toggleSelection(match.id, 'home', match.home, match.homeOdds)"
              :variant="isSelected(match.id, 'home') ? 'default' : 'outline'"
              class="h-auto py-4 flex flex-col relative"
            >
              <span class="font-bold">{{ match.home }}</span>
              <Badge class="absolute -top-2 -right-2">{{ match.homeOdds }}</Badge>
            </Button>
            <Button 
              @click="toggleSelection(match.id, 'away', match.away, match.awayOdds)"
              :variant="isSelected(match.id, 'away') ? 'default' : 'outline'"
              class="h-auto py-4 flex flex-col relative"
            >
              <span class="font-bold">{{ match.away }}</span>
              <Badge class="absolute -top-2 -right-2">{{ match.awayOdds }}</Badge>
            </Button>
            <Button 
              @click="toggleSelection(match.id, 'over', 'Over', match.overOdds)"
              :variant="isSelected(match.id, 'over') ? 'default' : 'outline'"
              class="h-auto py-4 flex flex-col relative"
            >
              <span class="font-bold">Over</span>
              <Badge class="absolute -top-2 -right-2">{{ match.overOdds }}</Badge>
            </Button>
            <Button 
              @click="toggleSelection(match.id, 'under', 'Under', match.underOdds)"
              :variant="isSelected(match.id, 'under') ? 'default' : 'outline'"
              class="h-auto py-4 flex flex-col relative"
            >
              <span class="font-bold">Under</span>
              <Badge class="absolute -top-2 -right-2">{{ match.underOdds }}</Badge>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Amount Selection -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <CardTitle class="text-base">Bet Amount (for all selections)</CardTitle>
          <span class="text-lg font-bold">{{ formatBalance(amount) }} MMK</span>
        </div>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="grid grid-cols-4 gap-2">
          <Button 
            v-for="a in [5000, 10000, 20000, 50000]" 
            :key="a" 
            @click="amount = a" 
            :variant="amount === a ? 'default' : 'outline'"
            size="sm"
          >
            {{ formatBalance(a) }}
          </Button>
        </div>
        
        <div class="flex items-center gap-3">
          <Button @click="amount = Math.max(1000, amount - 1000)" variant="outline" size="icon">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
            </svg>
          </Button>
          <Input v-model="amount" type="number" min="1000" step="1000" class="text-center font-semibold" />
          <Button @click="amount += 1000" variant="outline" size="icon">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Bet Summary -->
    <Card v-if="canBet">
      <CardContent class="pt-6 space-y-3">
        <div class="flex justify-between items-center">
          <span class="text-sm text-muted-foreground">Total Bet</span>
          <span class="text-xl font-bold">{{ formatBalance(amount) }} MMK</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-muted-foreground">Combined Odds</span>
          <span class="text-lg font-bold text-orange-600 dark:text-orange-400">{{ combinedOdds.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between items-center pt-3 border-t">
          <span class="text-sm text-muted-foreground">Potential Win</span>
          <span class="text-xl font-bold text-green-600 dark:text-green-400">{{ formatBalance(potentialWin) }} MMK</span>
        </div>
        <Button @click="placeBetHandler" class="w-full" size="lg">
          Place Maung Bet
        </Button>
      </CardContent>
    </Card>

    <!-- Empty/Invalid State -->
    <Card v-else>
      <CardContent class="py-12 text-center">
        <div class="h-16 w-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
          <svg class="h-8 w-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-sm text-muted-foreground">{{ emptyStateMessage }}</p>
        <p class="text-xs text-muted-foreground mt-1">Select between 3-10 matches to place a parlay bet</p>
      </CardContent>
    </Card>

    <!-- Toast -->
    <Teleport to="body">
      <Transition name="slide">
        <div v-if="toast" class="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto">
          <div :class="[
            'p-4 rounded-lg text-center text-sm font-medium shadow-lg',
            toast.type === 'success' ? 'bg-primary text-primary-foreground' : 'bg-destructive text-destructive-foreground'
          ]">
            {{ toast.msg }}
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

definePageMeta({
  keepalive: true
})

const toast = ref(null)
const selectedBets = ref([])
const amount = ref(10000)

const demoMatches = [
  { id: 1, home: 'Man United', away: 'Liverpool', league: 'Premier League', time: 'Today 8:00 PM', homeOdds: '1.85', awayOdds: '2.10', overOdds: '1.90', underOdds: '1.95', live: true },
  { id: 2, home: 'Barcelona', away: 'Real Madrid', league: 'La Liga', time: 'Tomorrow 10:00 PM', homeOdds: '1.95', awayOdds: '2.05', overOdds: '1.88', underOdds: '1.98', live: false },
  { id: 3, home: 'Bayern', away: 'Dortmund', league: 'Bundesliga', time: 'Jan 29, 9:00 PM', homeOdds: '1.75', awayOdds: '2.25', overOdds: '1.92', underOdds: '1.93', live: false },
  { id: 4, home: 'PSG', away: 'Monaco', league: 'Ligue 1', time: 'Jan 30, 9:00 PM', homeOdds: '1.80', awayOdds: '2.15', overOdds: '1.85', underOdds: '2.00', live: false }
]

const selectedCount = computed(() => selectedBets.value.length)
const canBet = computed(() => selectedCount.value >= 3 && selectedCount.value <= 10)
const combinedOdds = computed(() => {
  if (selectedCount.value === 0) return 0
  return selectedBets.value.reduce((acc, bet) => acc * parseFloat(bet.odds), 1)
})
const potentialWin = computed(() => Math.floor(amount.value * combinedOdds.value))
const emptyStateMessage = computed(() => {
  if (selectedCount.value === 0) return 'No matches selected yet'
  if (selectedCount.value < 3) return `Select ${3 - selectedCount.value} more match${3 - selectedCount.value > 1 ? 'es' : ''}`
  if (selectedCount.value > 10) return 'Maximum 10 matches allowed'
  return 'Ready to place bet'
})

const formatBalance = (n) => new Intl.NumberFormat('en-US').format(n || 0)

const isSelected = (matchId, side) => {
  return selectedBets.value.some(bet => bet.matchId === matchId && bet.side === side)
}

const toggleSelection = (matchId, side, team, odds) => {
  const key = `${matchId}-${side}`
  const existingIndex = selectedBets.value.findIndex(bet => bet.matchId === matchId)
  
  // If this match already has a selection
  if (existingIndex > -1) {
    // If clicking the same side, remove it
    if (selectedBets.value[existingIndex].side === side) {
      selectedBets.value.splice(existingIndex, 1)
      return
    }
    // If clicking different side, update it
    selectedBets.value[existingIndex] = {
      matchId,
      side,
      team,
      odds,
      key,
      label: team
    }
  } else {
    // Add new selection if under limit
    if (selectedCount.value < 10) {
      selectedBets.value.push({
        matchId,
        side,
        team,
        odds,
        key,
        label: team
      })
    } else {
      showToast('Maximum 10 matches allowed', 'error')
    }
  }
}

const removeSelection = (key) => {
  selectedBets.value = selectedBets.value.filter(bet => bet.key !== key)
}

const clearAll = () => {
  selectedBets.value = []
  showToast('All selections cleared', 'success')
}

const placeBetHandler = () => {
  if (!canBet.value) return
  showToast(`Maung bet placed! ${selectedCount.value} matches - ${formatBalance(amount.value)} MMK`, 'success')
  setTimeout(() => {
    selectedBets.value = []
    amount.value = 10000
  }, 1500)
}

const showToast = (msg, type = 'success') => {
  toast.value = { msg, type }
  setTimeout(() => toast.value = null, 3000)
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
