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
          class="cursor-pointer hover:bg-white/5 transition-all active:scale-[0.99] bg-white/3 backdrop-blur-md border border-white/5 rounded-lg py-1" 
          @click="viewBetDetails(bet)"
        >
          <CardContent class="p-2.5">
            <!-- 2D/3D Bet Info -->
            <div v-if="activeTab === '2d' || activeTab === '3d'">
              <!-- Single Line Header -->
              <div class="flex items-center justify-between mb-1.5">
                <div class="flex items-center gap-1.5">
                  <span class="text-[10px] text-muted-foreground">{{ formatDateTime(bet.created_at) }}</span>
                  <span class="text-[9px] text-muted-foreground/60">·</span>
                  <span class="text-[10px] text-primary/80">{{ bet.session?.type }}</span>
                  <div :class="[
                    'px-1.5 py-0.5 rounded text-[9px] font-bold uppercase',
                    getStatusClass(bet.status)
                  ]">
                    {{ bet.status }}
                  </div>
                </div>
                <span class="text-base font-bold">{{ formatBalance(bet.total_amount) }}</span>
              </div>
              
              <!-- Compact Numbers -->
              <div v-if="bet.items && bet.items.length > 0" class="flex flex-wrap gap-1">
                <span 
                  v-for="(item, idx) in bet.items.slice(0, 15)" 
                  :key="idx"
                  :class="[
                    'px-1.5 py-0.5 rounded text-xs font-bold',
                    item.is_winner ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-foreground/80'
                  ]"
                >
                  {{ item.number }}
                </span>
                <span v-if="bet.items.length > 15" class="px-1.5 py-0.5 text-[10px] text-muted-foreground">
                  +{{ bet.items.length - 15 }}
                </span>
              </div>
            </div>

            <!-- Football Bet Info -->
            <div v-else>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1.5">
                  <span class="text-[10px] text-muted-foreground">{{ formatDateTime(bet.created_at) }}</span>
                  <span class="text-[9px] text-muted-foreground/60">·</span>
                  <span class="px-1.5 py-0.5 rounded bg-primary/20 text-primary text-[9px] font-bold uppercase">{{ bet.bet_type }}</span>
                  <div :class="[
                    'px-1.5 py-0.5 rounded text-[9px] font-bold uppercase',
                    getStatusClass(bet.status)
                  ]">
                    {{ bet.status }}
                  </div>
                </div>
                <span class="text-base font-bold">{{ formatBalance(bet.total_stake) }}</span>
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
            {{ t('Loading more...', 'နောက်ထပ်ရယူနေသည်...') }}
          </div>
        </div>

        <!-- End of list indicator -->
        <div v-else-if="hasReachedEnd" class="py-4 text-center">
          <p class="text-sm text-muted-foreground">{{ t('No more bets to load', 'နောက်ထပ်လောင်းကစားမှုမရှိတော့ပါ') }}</p>
        </div>
      </div>

      <div v-else-if="!isInitialLoading" class="text-center py-16">
        <svg class="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="text-muted-foreground">{{ t('No bets found', 'လောင်းကစားမှုမရှိပါ') }}</p>
        <p class="text-sm text-muted-foreground/70 mt-1">{{ t('Start betting to see your history', 'သင့်မှတ်တမ်းကြည့်ရန် လောင်းကစားစတင်ပါ') }}</p>
      </div>
    </div>

    <!-- Bet Details Modal -->
    <div v-if="selectedBet" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" @click.self="selectedBet = null">
      <Card class="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white/5 backdrop-blur-xl border-white/10">
        <CardHeader>
          <div class="flex items-center justify-between">
            <CardTitle>{{ t('Bet Details', 'လောင်းကစားအသေးစိတ်') }}</CardTitle>
            <Button variant="ghost" size="icon" @click="selectedBet = null">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
        </CardHeader>
        <CardContent class="space-y-4">
          <div>
            <p class="text-sm text-muted-foreground">{{ t('Slip Number', 'စလစ်နံပါတ်') }}</p>
            <p class="font-semibold">{{ selectedBet.slip_number }}</p>
          </div>
          
          <div>
            <p class="text-sm text-muted-foreground">{{ t('Status', 'အခြေအနေ') }}</p>
            <div :class="['inline-block px-2 py-1 rounded-full text-xs font-medium', getStatusClass(selectedBet.status)]">
              {{ selectedBet.status.toUpperCase() }}
            </div>
          </div>

          <div>
            <p class="text-sm text-muted-foreground">{{ t('Created At', 'ဖန်တီးသည့်အချိန်') }}</p>
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
              <span class="text-muted-foreground">{{ t('Total Stake', 'စုစုပေါင်းလောင်းငွေ') }}</span>
              <span class="font-semibold">{{ formatBalance(selectedBet.total_amount || selectedBet.total_stake) }} {{ t('MMK', 'ကျပ်') }}</span>
            </div>
            <div v-if="selectedBet.actual_win !== null && selectedBet.actual_win !== undefined" class="flex justify-between">
              <span class="text-muted-foreground">{{ t('Settlement', 'ရလဒ်') }}</span>
              <span 
                class="font-semibold"
                :class="selectedBet.actual_win > 0 ? 'text-green-600 dark:text-green-400' : selectedBet.actual_win < 0 ? 'text-red-600 dark:text-red-400' : ''"
              >
                {{ formatBalance(selectedBet.actual_win) }} {{ t('MMK', 'ကျပ်') }}
              </span>
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

const { getBetHistory: get2DBetHistory } = use2DBetting()
const { getBetHistory: get3DBetHistory } = use3DBetting()
const { getBetHistory: getFootballBetHistory } = useFootballBetting()
const { locale, t } = useLanguage()

const tabs = [
  { label: '2D', value: '2d' },
  { label: '3D', value: '3d' },
  { label: t('Body', 'ဘော်ဒီ'), value: 'body' },
  { label: t('Maung', 'မောင်:'), value: 'maung' }
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
