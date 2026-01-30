<template>
  <div class="container mx-auto p-4 space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold">Body Betting</h1>
      <p class="text-muted-foreground">Single match football betting</p>
    </div>

    <!-- Agent Selection -->
    <Card>
      <CardHeader>
        <CardTitle>Select Agent</CardTitle>
      </CardHeader>
      <CardContent>
        <select v-model="selectedAgent" class="w-full p-2 rounded-lg border bg-background">
          <option value="">Choose an agent</option>
          <option v-for="agent in agents" :key="agent.id" :value="agent.id">
            {{ agent.name }} ({{ agent.code }}) - Commission: {{ agent.commission_rate }}%
          </option>
        </select>
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
                    @click="selectBet(match, market, selection)"
                    :variant="isSelected(match.id, market.id, selection) ? 'default' : 'outline'"
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

    <!-- Bet Slip -->
    <div v-if="selectedBet" class="fixed bottom-0 left-0 right-0 p-4 bg-background border-t shadow-lg">
      <Card>
        <CardContent class="pt-6 space-y-4">
          <div>
            <p class="text-sm text-muted-foreground">Selected Match</p>
            <p class="font-semibold">{{ selectedBet.match.home_team.name }} vs {{ selectedBet.match.away_team.name }}</p>
            <p class="text-sm text-muted-foreground">{{ selectedBet.market.odds_display }} - {{ selectedBet.selection.toUpperCase() }}</p>
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
              :disabled="isPlacingBet || !selectedAgent || !betAmount"
            >
              {{ isPlacingBet ? 'Placing...' : 'Place Bet' }}
            </Button>
            <Button @click="clearSelection" variant="outline">
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

const { getMatches, getAgents, placeBodyBet } = useFootballBetting()

const matches = ref<any[]>([])
const agents = ref<any[]>([])
const selectedAgent = ref('')
const selectedBet = ref<any>(null)
const betAmount = ref(10000)
const isLoadingMatches = ref(false)
const isPlacingBet = ref(false)

const loadMatches = async () => {
  isLoadingMatches.value = true
  try {
    matches.value = await getMatches('upcoming')
  } catch (error) {
    console.error('Failed to load matches:', error)
  } finally {
    isLoadingMatches.value = false
  }
}

const loadAgents = async () => {
  try {
    agents.value = await getAgents()
  } catch (error) {
    console.error('Failed to load agents:', error)
  }
}

const selectBet = (match: any, market: any, selection: string) => {
  selectedBet.value = { match, market, selection }
}

const isSelected = (matchId: number, marketId: number, selection: string) => {
  return selectedBet.value?.match.id === matchId &&
    selectedBet.value?.market.id === marketId &&
    selectedBet.value?.selection === selection
}

const clearSelection = () => {
  selectedBet.value = null
}

const placeBet = async () => {
  if (!selectedAgent.value || !selectedBet.value || !betAmount.value) return

  isPlacingBet.value = true
  try {
    const response = await placeBodyBet(
      Number(selectedAgent.value),
      selectedBet.value.match.id,
      selectedBet.value.market.id,
      selectedBet.value.selection,
      betAmount.value
    )

    alert(`Bet placed successfully! Slip Number: ${response.data.slip_number}`)
    
    clearSelection()
    betAmount.value = 10000
  } catch (error: any) {
    alert(error.data?.message || 'Failed to place bet. Please try again.')
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

onMounted(async () => {
  await Promise.all([loadMatches(), loadAgents()])
})

useHead({
  title: 'Body Betting - 2D3D'
})
</script>
