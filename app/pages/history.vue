<template>
  <div class="container mx-auto p-4 pb-20">
    <!-- Tabs -->
    <div class="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-4 -mx-4 px-4 mb-4">
      <div class="grid grid-cols-4 gap-2">
        <Button
          v-for="tab in tabs"
          :key="tab.value"
          @click="switchTab(tab.value)"
          :variant="activeTab === tab.value ? 'default' : 'outline'"
          size="sm"
          class="w-full"
        >
          {{ tab.label }}
        </Button>
      </div>
    </div>

    <!-- Bet List -->
    <div class="space-y-3" ref="scrollContainer">
      <div v-if="isInitialLoading" class="space-y-3">
        <SkeletonLoader type="list-item" />
        <SkeletonLoader type="list-item" />
        <SkeletonLoader type="list-item" />
      </div>
      
      <div v-else-if="bets.length > 0" class="space-y-3">
        <Card 
          v-for="bet in bets" 
          :key="bet.id" 
          class="cursor-pointer hover:bg-accent/50 transition-colors active:scale-[0.98]" 
          @click="viewBetDetails(bet)"
        >
          <CardContent class="p-4">
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-sm truncate">{{ bet.slip_number }}</p>
                <p class="text-xs text-muted-foreground">{{ formatDateTime(bet.created_at) }}</p>
              </div>
              <div :class="[
                'px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2',
                getStatusClass(bet.status)
              ]">
                {{ bet.status.toUpperCase() }}
              </div>
            </div>

            <!-- 2D/3D Bet Info -->
            <div v-if="activeTab === '2d' || activeTab === '3d'" class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted-foreground">Session</span>
                <span class="font-medium text-xs">{{ bet.session?.type }} - {{ formatDate(bet.session?.date) }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted-foreground">Numbers</span>
                <span class="font-medium">{{ bet.items?.length || 0 }} numbers</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-muted-foreground">Total Bet</span>
                <span class="font-semibold text-base">{{ formatBalance(bet.total_amount) }} <span class="text-xs text-muted-foreground">MMK</span></span>
              </div>
              <div v-if="bet.status === 'won'" class="flex items-center justify-between pt-2 border-t">
                <span class="text-sm text-muted-foreground">Win Amount</span>
                <span class="font-bold text-base text-green-600 dark:text-green-400">+{{ formatBalance(bet.actual_win) }} <span class="text-xs">MMK</span></span>
              </div>
              <div v-if="bet.session?.result" class="flex items-center justify-between pt-2 border-t">
                <span class="text-sm text-muted-foreground">Result</span>
                <span class="text-2xl font-bold text-primary">{{ bet.session.result }}</span>
              </div>
            </div>

            <!-- Football Bet Info -->
            <div v-else class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted-foreground">Type</span>
                <span class="font-medium">{{ bet.bet_type?.toUpperCase() }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted-foreground">Matches</span>
                <span class="font-medium">{{ bet.total_matches || 0 }} matches</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-muted-foreground">Total Stake</span>
                <span class="font-semibold text-base">{{ formatBalance(bet.total_stake) }} <span class="text-xs text-muted-foreground">MMK</span></span>
              </div>
              <div v-if="bet.status === 'settled' && bet.actual_win > 0" class="flex items-center justify-between pt-2 border-t">
                <span class="text-sm text-muted-foreground">Win Amount</span>
                <span class="font-bold text-base text-green-600 dark:text-green-400">+{{ formatBalance(bet.actual_win) }} <span class="text-xs">MMK</span></span>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Loading more indicator -->
        <div v-if="isLoadingMore" class="py-4 text-center">
          <div class="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading more...
          </div>
        </div>

        <!-- End of list indicator -->
        <div v-else-if="hasReachedEnd" class="py-4 text-center">
          <p class="text-sm text-muted-foreground">No more bets to load</p>
        </div>
      </div>

      <div v-else-if="!isInitialLoading" class="text-center py-16">
        <svg class="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="text-muted-foreground">No bets found</p>
        <p class="text-sm text-muted-foreground/70 mt-1">Start betting to see your history</p>
      </div>
    </div>

    <!-- Bet Details Modal -->
    <div v-if="selectedBet" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" @click.self="selectedBet = null">
      <Card class="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div class="flex items-center justify-between">
            <CardTitle>Bet Details</CardTitle>
            <Button variant="ghost" size="icon" @click="selectedBet = null">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
        </CardHeader>
        <CardContent class="space-y-4">
          <div>
            <p class="text-sm text-muted-foreground">Slip Number</p>
            <p class="font-semibold">{{ selectedBet.slip_number }}</p>
          </div>
          
          <div>
            <p class="text-sm text-muted-foreground">Status</p>
            <div :class="['inline-block px-2 py-1 rounded-full text-xs font-medium', getStatusClass(selectedBet.status)]">
              {{ selectedBet.status.toUpperCase() }}
            </div>
          </div>

          <div>
            <p class="text-sm text-muted-foreground">Created At</p>
            <p class="font-medium">{{ formatDateTime(selectedBet.created_at) }}</p>
          </div>

          <!-- Items -->
          <div v-if="selectedBet.items && selectedBet.items.length">
            <p class="text-sm text-muted-foreground mb-2">
              {{ activeTab === '2d' || activeTab === '3d' ? 'Bet Items' : 'Match Selections' }}
            </p>
            <div class="space-y-2">
              <!-- 2D/3D Items -->
              <template v-if="activeTab === '2d' || activeTab === '3d'">
                <div v-for="(item, index) in selectedBet.items" :key="index" class="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <span class="font-semibold">{{ item.number }}</span>
                  <div class="text-right">
                    <p class="font-medium">{{ formatBalance(item.amount) }} MMK</p>
                    <p v-if="item.is_winner" class="text-xs text-green-600 dark:text-green-400">Won: {{ formatBalance(item.actual_win) }} MMK</p>
                  </div>
                </div>
              </template>

              <!-- Football Items -->
              <template v-else>
                <div v-for="(item, index) in selectedBet.items" :key="index" class="p-3 rounded-lg bg-muted/50 space-y-2">
                  <div class="flex items-center justify-between">
                    <div class="flex-1">
                      <p class="text-xs text-muted-foreground mb-1">{{ item.match?.league || 'League' }}</p>
                      <p class="font-semibold text-sm">
                        {{ item.match?.home_team || 'Home' }} vs {{ item.match?.away_team || 'Away' }}
                      </p>
                    </div>
                    <div v-if="item.status" :class="[
                      'px-2 py-0.5 rounded text-xs font-medium',
                      item.status === 'won' ? 'bg-green-500/10 text-green-600 dark:text-green-400' :
                      item.status === 'lost' ? 'bg-red-500/10 text-red-600 dark:text-red-400' :
                      item.status === 'void' ? 'bg-gray-500/10 text-gray-600 dark:text-gray-400' :
                      'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                    ]">
                      {{ item.status }}
                    </div>
                  </div>
                  <div class="flex items-center justify-between text-xs">
                    <span class="text-muted-foreground">Selection: <span class="font-medium text-foreground">{{ item.selection?.toUpperCase() }}</span></span>
                    <span class="text-muted-foreground">Odds: <span class="font-medium text-foreground">{{ item.odds }}</span></span>
                  </div>
                  <div v-if="item.match?.home_score !== null && item.match?.away_score !== null" class="flex items-center justify-between text-xs pt-2 border-t">
                    <span class="text-muted-foreground">Score</span>
                    <span class="font-bold">{{ item.match.home_score }} - {{ item.match.away_score }}</span>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <div class="pt-4 border-t space-y-2">
            <div class="flex justify-between">
              <span class="text-muted-foreground">Total Amount</span>
              <span class="font-semibold">{{ formatBalance(selectedBet.total_amount || selectedBet.total_stake) }} MMK</span>
            </div>
            <div v-if="selectedBet.actual_win" class="flex justify-between">
              <span class="text-muted-foreground">Win Amount</span>
              <span class="font-semibold text-green-600 dark:text-green-400">{{ formatBalance(selectedBet.actual_win) }} MMK</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import SkeletonLoader from '@/components/SkeletonLoader.vue'

definePageMeta({
  middleware: 'auth'
})

const { getBetHistory: get2DBetHistory } = use2DBetting()
const { getBetHistory: get3DBetHistory } = use3DBetting()
const { getBetHistory: getFootballBetHistory } = useFootballBetting()

const tabs = [
  { label: '2D', value: '2d' },
  { label: '3D', value: '3d' },
  { label: 'Body', value: 'body' },
  { label: 'Maung', value: 'maung' }
]

const activeTab = ref('2d')
const perPage = ref(10)
const currentPage = ref(1)
const bets = ref<any[]>([])
const totalPages = ref(1)
const isInitialLoading = ref(false)
const isLoadingMore = ref(false)
const hasReachedEnd = ref(false)
const selectedBet = ref<any>(null)
const scrollContainer = ref<HTMLElement | null>(null)

const loadBets = async (append = false) => {
  if (append) {
    isLoadingMore.value = true
  } else {
    isInitialLoading.value = true
  }

  try {
    let response: any

    if (activeTab.value === '2d') {
      response = await get2DBetHistory(currentPage.value, perPage.value, '')
    } else if (activeTab.value === '3d') {
      response = await get3DBetHistory(currentPage.value, perPage.value, '')
    } else if (activeTab.value === 'body') {
      response = await getFootballBetHistory(currentPage.value, perPage.value, '', 'body')
    } else if (activeTab.value === 'maung') {
      response = await getFootballBetHistory(currentPage.value, perPage.value, '', 'maung')
    } else {
      response = { data: [], meta: { last_page: 1, current_page: 1 } }
    }

    if (append) {
      bets.value = [...bets.value, ...response.data]
    } else {
      bets.value = response.data
    }

    totalPages.value = response.meta?.last_page || 1
    hasReachedEnd.value = currentPage.value >= totalPages.value
  } catch (error) {
    console.error('Failed to load bets:', error)
    if (!append) {
      bets.value = []
    }
  } finally {
    isInitialLoading.value = false
    isLoadingMore.value = false
  }
}

const loadMore = async () => {
  if (isLoadingMore.value || hasReachedEnd.value) return
  
  currentPage.value++
  await loadBets(true)
}

const switchTab = (tab: string) => {
  if (activeTab.value === tab) return
  
  activeTab.value = tab
  currentPage.value = 1
  hasReachedEnd.value = false
  bets.value = []
  loadBets()
}

const handleScroll = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const scrollHeight = document.documentElement.scrollHeight
  const clientHeight = window.innerHeight
  
  // Load more when user is 200px from bottom
  if (scrollTop + clientHeight >= scrollHeight - 200) {
    loadMore()
  }
}

const viewBetDetails = (bet: any) => {
  selectedBet.value = bet
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    accepted: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    rejected: 'bg-red-500/10 text-red-600 dark:text-red-400',
    won: 'bg-green-500/10 text-green-600 dark:text-green-400',
    lost: 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
    settled: 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
  }
  return classes[status] || 'bg-gray-500/10 text-gray-600 dark:text-gray-400'
}

const formatBalance = (amount: number) => {
  return new Intl.NumberFormat('en-US').format(amount || 0)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const formatDateTime = (date: string) => {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  loadBets()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

useHead({
  title: 'Bet History - 2D3D'
})
</script>
