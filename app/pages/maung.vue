<template>
  <div class="container mx-auto p-4 space-y-6 pb-32">
    <!-- Header -->
    <!-- <div>
      <h1 class="text-2xl font-bold">Maung Betting</h1>
      <p class="text-muted-foreground">Parlay betting (minimum 3 matches)</p>
    </div> -->

    <!-- Selected Matches Summary -->
    <Card v-if="selectedMatches.length > 0" class="border-primary">
      <CardHeader>
        <CardTitle class="flex items-center justify-between">
          <span>Selected Matches ({{ selectedMatches.length }})</span>
          <Button @click="clearAllSelections" variant="ghost" size="sm">Clear All</Button>
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-2">
        <div v-for="(selection, index) in selectedMatches" :key="index" class="p-3 rounded-lg bg-muted/50 flex items-center justify-between">
          <div class="flex-1">
            <p class="text-sm font-medium">{{ selection.match.home_team.name }} vs {{ selection.match.away_team.name }}</p>
            <p class="text-xs text-muted-foreground">{{ selection.market.odds_display }} - {{ selection.selection.toUpperCase() }}</p>
          </div>
          <Button @click="removeSelection(index)" variant="ghost" size="sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>
        <div v-if="selectedMatches.length < 3" class="text-sm text-amber-600 dark:text-amber-400">
          ⚠️ Select at least {{ 3 - selectedMatches.length }} more match(es) to place a Maung bet
        </div>
      </CardContent>
    </Card>

    <!-- Matches List -->
    <div class="space-y-3">
      <SkeletonLoader v-if="isLoadingMatches" type="list-item" />
      <SkeletonLoader v-if="isLoadingMatches" type="list-item" />
      
      <div v-else-if="matches.length > 0" class="space-y-3">
        <Card v-for="match in matches" :key="match.id">
          <CardContent class="pt-6">
            <!-- Match Info -->
            <div class="mb-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs text-muted-foreground">{{ match.league.name }}</span>
                <span class="text-xs text-muted-foreground">{{ formatDateTime(match.kickoff_time) }}</span>
              </div>
              <div class="grid grid-cols-3 gap-2 items-center">
                <div class="text-center">
                  <p class="font-semibold">{{ match.home_team.name }}</p>
                </div>
                <div class="text-center text-xs text-muted-foreground">VS</div>
                <div class="text-center">
                  <p class="font-semibold">{{ match.away_team.name }}</p>
                </div>
              </div>
            </div>

            <!-- Markets -->
            <div v-if="match.markets && match.markets.length > 0" class="space-y-3">
              <div v-for="market in match.markets" :key="market.id" class="p-3 rounded-lg bg-muted/50">
                <p class="text-sm font-medium mb-2">{{ market.odds_display }}</p>
                <div class="grid grid-cols-2 gap-2">
                  <Button
                    v-for="selection in market.available_selections"
                    :key="selection"
                    @click="toggleSelection(match, market, selection)"
                    :variant="isSelected(match.id, market.id, selection) ? 'default' : 'outline'"
                    :disabled="isMatchSelected(match.id) && !isSelected(match.id, market.id, selection)"
                    size="sm"
                  >
                    {{ selection.toUpperCase() }}
                  </Button>
                </div>
              </div>
            </div>
            <p v-else class="text-sm text-muted-foreground text-center py-2">No markets available</p>
          </CardContent>
        </Card>
      </div>

      <div v-else class="text-center py-12">
        <svg class="w-16 h-16 mx-auto text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p class="text-muted-foreground">No matches available</p>
      </div>
    </div>

    <!-- Bet Slip (Fixed Bottom) -->
    <div v-if="selectedMatches.length >= 3" class="fixed bottom-0 left-0 right-0 p-4 bg-background border-t shadow-lg pb-14">
      <Card>
        <CardContent class="pt-6 space-y-4">
          <div>
            <p class="text-sm text-muted-foreground">Parlay Bet</p>
            <p class="font-semibold">{{ selectedMatches.length }} Matches Selected</p>
            <p class="text-xs text-muted-foreground">All selections must win</p>
          </div>

          <div>
            <label class="text-sm font-medium mb-2 block">Bet Amount (MMK)</label>
            <Input
              v-model.number="betAmount"
              type="number"
              placeholder="Enter amount"
              min="1000"
              step="1000"
            />
          </div>

          <div class="flex gap-2">
            <Button
              @click="placeBet"
              class="flex-1"
              :disabled="isPlacingBet || !betAmount || selectedMatches.length < 3"
            >
              {{ isPlacingBet ? 'Placing...' : 'Place Parlay Bet' }}
            </Button>
            <Button @click="clearAllSelections" variant="outline">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import SkeletonLoader from '@/components/SkeletonLoader.vue'

definePageMeta({
  middleware: 'auth'
})

const { getMatches, placeMaungBet } = useFootballBetting()
const toast = useToast()

const matches = ref<any[]>([])
const selectedMatches = ref<any[]>([])
const betAmount = ref(10000)
const isLoadingMatches = ref(false)
const isPlacingBet = ref(false)

const loadMatches = async () => {
  isLoadingMatches.value = true
  try {
    matches.value = await getMatches()
  } catch (error) {
    console.error('Failed to load matches:', error)
    toast.error('Failed to load matches')
  } finally {
    isLoadingMatches.value = false
  }
}

const toggleSelection = (match: any, market: any, selection: string) => {
  const existingIndex = selectedMatches.value.findIndex(
    s => s.match.id === match.id && s.market.id === market.id && s.selection === selection
  )

  if (existingIndex >= 0) {
    // Remove if already selected
    selectedMatches.value.splice(existingIndex, 1)
  } else {
    // Remove any other selection from the same match
    selectedMatches.value = selectedMatches.value.filter(s => s.match.id !== match.id)
    // Add new selection
    selectedMatches.value.push({ match, market, selection })
  }
}

const isSelected = (matchId: number, marketId: number, selection: string) => {
  return selectedMatches.value.some(
    s => s.match.id === matchId && s.market.id === marketId && s.selection === selection
  )
}

const isMatchSelected = (matchId: number) => {
  return selectedMatches.value.some(s => s.match.id === matchId)
}

const removeSelection = (index: number) => {
  selectedMatches.value.splice(index, 1)
}

const clearAllSelections = () => {
  selectedMatches.value = []
}

const placeBet = async () => {
  if (selectedMatches.value.length < 3 || !betAmount.value) return

  isPlacingBet.value = true
  try {
    const items = selectedMatches.value.map(s => ({
      market_id: s.market.id,
      selection: s.selection
    }))

    const response = await placeMaungBet(items, betAmount.value)

    // Show success toast with bet slip details
    const slipNumber = response.data?.slip_number || 'N/A'
    const totalStake = response.data?.total_stake || betAmount.value
    const potentialWin = response.data?.potential_win
    const status = response.data?.status
    
    let message = `Slip: ${slipNumber} | Stake: ${formatCurrency(totalStake)} MMK`
    if (potentialWin) {
      message += ` | Potential Win: ${formatCurrency(potentialWin)} MMK`
    }
    if (status === 'accepted') {
      message += ' | Status: Accepted'
    } else if (status === 'pending') {
      message += ' | Status: Pending Approval'
    }
    
    toast.success('Parlay bet placed successfully!', message)
    
    clearAllSelections()
    betAmount.value = 10000
  } catch (error: any) {
    console.error('Failed to place bet:', error)
    const message = error?.message || 'Failed to place bet'
    toast.error(message)
  } finally {
    isPlacingBet.value = false
  }
}

const formatDateTime = (date: string) => {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US').format(amount)
}

onMounted(() => {
  loadMatches()
})

useHead({
  title: 'Maung Betting - 2D3D'
})
</script>
