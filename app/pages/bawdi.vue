<template>
  <div class="container mx-auto p-4 space-y-6">
  

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
        <CardContent class="space-y-3">
          <!-- Team Selection -->
          <div class="grid grid-cols-2 gap-2">
            <Button 
              @click="selectTeam(match.id, 'home', match.home, match.homeOdds)"
              :variant="isSelected(match.id, 'home') ? 'default' : 'outline'"
              class="h-auto py-4 flex flex-col relative"
            >
              <span class="font-bold">{{ match.home }}</span>
              <Badge class="absolute -top-2 -right-2">{{ match.homeOdds }}</Badge>
            </Button>
            <Button 
              @click="selectTeam(match.id, 'away', match.away, match.awayOdds)"
              :variant="isSelected(match.id, 'away') ? 'default' : 'outline'"
              class="h-auto py-4 flex flex-col relative"
            >
              <span class="font-bold">{{ match.away }}</span>
              <Badge class="absolute -top-2 -right-2">{{ match.awayOdds }}</Badge>
            </Button>
            <Button 
              @click="selectTeam(match.id, 'over', 'Over', match.overOdds)"
              :variant="isSelected(match.id, 'over') ? 'default' : 'outline'"
              class="h-auto py-4 flex flex-col relative"
            >
              <span class="font-bold">Over</span>
              <Badge class="absolute -top-2 -right-2">{{ match.overOdds }}</Badge>
            </Button>
            <Button 
              @click="selectTeam(match.id, 'under', 'Under', match.underOdds)"
              :variant="isSelected(match.id, 'under') ? 'default' : 'outline'"
              class="h-auto py-4 flex flex-col relative"
            >
              <span class="font-bold">Under</span>
              <Badge class="absolute -top-2 -right-2">{{ match.underOdds }}</Badge>
            </Button>
          </div>

          <!-- Amount Input (shown when team is selected) -->
          <div v-if="getSelectedBet(match.id)" class="pt-3 border-t space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">Bet Amount</span>
              <span class="text-sm font-bold">{{ formatBalance(getSelectedBet(match.id).amount) }} MMK</span>
            </div>
            
            <div class="grid grid-cols-4 gap-2">
              <Button 
                v-for="a in [1000, 5000, 10000, 50000]" 
                :key="a" 
                @click="updateAmount(match.id, a)" 
                :variant="getSelectedBet(match.id).amount === a ? 'default' : 'outline'"
                size="sm"
              >
                {{ formatBalance(a) }}
              </Button>
            </div>

            <div class="flex items-center gap-3">
              <Button 
                @click="updateAmount(match.id, Math.max(1000, getSelectedBet(match.id).amount - 1000))" 
                variant="outline" 
                size="icon"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                </svg>
              </Button>
              <Input 
                :model-value="getSelectedBet(match.id).amount" 
                @update:model-value="updateAmount(match.id, $event)"
                type="number" 
                min="1000" 
                step="1000" 
                class="text-center font-semibold" 
              />
              <Button 
                @click="updateAmount(match.id, getSelectedBet(match.id).amount + 1000)" 
                variant="outline" 
                size="icon"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </Button>
            </div>

            <div class="flex justify-between items-center pt-2 border-t">
              <span class="text-xs text-muted-foreground">Potential Win</span>
              <span class="text-sm font-bold text-green-600 dark:text-green-400">
                {{ formatBalance(calculateWin(match.id)) }} MMK
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Selected Bets Summary -->
    <Card v-if="selectedBets.length">
      <CardHeader>
        <div class="flex items-center justify-between">
          <CardTitle class="text-base">Bet Summary</CardTitle>
          <Button @click="clearAllBets" variant="ghost" size="sm">
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent class="space-y-3">
        <div class="space-y-2">
          <div v-for="bet in selectedBets" :key="bet.matchId" class="flex justify-between items-center text-sm">
            <div class="flex-1">
              <p class="font-medium">{{ bet.team }}</p>
              <p class="text-xs text-muted-foreground">Odds: {{ bet.odds }}</p>
            </div>
            <div class="text-right">
              <p class="font-bold">{{ formatBalance(bet.amount) }} MMK</p>
              <p class="text-xs text-green-600 dark:text-green-400">Win: {{ formatBalance(calculateWin(bet.matchId)) }}</p>
            </div>
          </div>
        </div>

        <div class="pt-3 border-t space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-sm text-muted-foreground">Total Bets</span>
            <span class="text-lg font-bold">{{ selectedBets.length }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-muted-foreground">Total Amount</span>
            <span class="text-xl font-bold">{{ formatBalance(totalAmount) }} MMK</span>
          </div>
          <div class="flex justify-between items-center pt-2 border-t">
            <span class="text-sm text-muted-foreground">Potential Win</span>
            <span class="text-xl font-bold text-green-600 dark:text-green-400">{{ formatBalance(totalPotentialWin) }} MMK</span>
          </div>
        </div>

        <Button @click="placeBetHandler" :disabled="!canPlaceBet" class="w-full" size="lg">
          Place Bawdi Bet
        </Button>
      </CardContent>
    </Card>

    <!-- Empty State -->
    <Card v-else>
      <CardContent class="py-12 text-center">
        <div class="h-16 w-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
          <svg class="h-8 w-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-sm text-muted-foreground">No bets selected yet</p>
        <p class="text-xs text-muted-foreground mt-1">Select teams from matches above to start betting</p>
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

const demoMatches = [
  { id: 1, home: 'Man United', away: 'Liverpool', league: 'Premier League', time: 'Today 8:00 PM', homeOdds: '1.85', awayOdds: '2.10', overOdds: '1.90', underOdds: '1.95', live: true },
  { id: 2, home: 'Barcelona', away: 'Real Madrid', league: 'La Liga', time: 'Tomorrow 10:00 PM', homeOdds: '1.95', awayOdds: '2.05', overOdds: '1.88', underOdds: '1.98', live: false },
  { id: 3, home: 'Bayern', away: 'Dortmund', league: 'Bundesliga', time: 'Jan 29, 9:00 PM', homeOdds: '1.75', awayOdds: '2.25', overOdds: '1.92', underOdds: '1.93', live: false }
]

const totalAmount = computed(() => selectedBets.value.reduce((sum, bet) => sum + bet.amount, 0))
const totalPotentialWin = computed(() => selectedBets.value.reduce((sum, bet) => sum + (bet.amount * parseFloat(bet.odds)), 0))
const canPlaceBet = computed(() => selectedBets.value.length > 0)

const formatBalance = (n) => new Intl.NumberFormat('en-US').format(n || 0)

const isSelected = (matchId, side) => {
  return selectedBets.value.some(bet => bet.matchId === matchId && bet.side === side)
}

const getSelectedBet = (matchId) => {
  return selectedBets.value.find(bet => bet.matchId === matchId)
}

const selectTeam = (matchId, side, team, odds) => {
  const existingBetIndex = selectedBets.value.findIndex(bet => bet.matchId === matchId)
  
  if (existingBetIndex > -1) {
    // If same side clicked, remove bet
    if (selectedBets.value[existingBetIndex].side === side) {
      selectedBets.value.splice(existingBetIndex, 1)
      return
    }
    // If different side clicked, update bet
    selectedBets.value[existingBetIndex] = {
      matchId,
      side,
      team,
      odds,
      amount: selectedBets.value[existingBetIndex].amount
    }
  } else {
    // Add new bet
    selectedBets.value.push({
      matchId,
      side,
      team,
      odds,
      amount: 5000
    })
  }
}

const updateAmount = (matchId, newAmount) => {
  const bet = selectedBets.value.find(b => b.matchId === matchId)
  if (bet) {
    bet.amount = parseInt(newAmount) || 1000
  }
}

const calculateWin = (matchId) => {
  const bet = getSelectedBet(matchId)
  if (!bet) return 0
  return Math.floor(bet.amount * parseFloat(bet.odds))
}

const clearAllBets = () => {
  selectedBets.value = []
  showToast('All bets cleared', 'success')
}

const placeBetHandler = () => {
  if (!canPlaceBet.value) return
  showToast(`Bet placed successfully! Total: ${formatBalance(totalAmount.value)} MMK`, 'success')
  setTimeout(() => {
    selectedBets.value = []
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
