<template>
  <div class="text-white">
    <!-- Loading Skeleton -->
    <div v-if="loading" class="px-4 py-4 space-y-4">
      <div class="bg-white/5 rounded-xl p-4 border border-white/5 animate-pulse">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 bg-white/10 rounded-xl"></div>
          <div class="flex-1">
            <div class="h-4 w-24 bg-white/10 rounded mb-2"></div>
            <div class="h-3 w-32 bg-white/10 rounded"></div>
          </div>
          <div class="h-6 w-16 bg-white/10 rounded"></div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-white/5 rounded-lg p-3 h-16"></div>
          <div class="bg-white/5 rounded-lg p-3 h-16"></div>
        </div>
      </div>
      <div v-for="i in 3" :key="i" class="bg-white/5 rounded-xl p-4 border border-white/5 animate-pulse">
        <div class="h-4 w-32 bg-white/10 rounded mb-3"></div>
        <div class="flex justify-between mb-4">
          <div class="h-4 w-20 bg-white/10 rounded"></div>
          <div class="h-4 w-8 bg-white/10 rounded"></div>
          <div class="h-4 w-20 bg-white/10 rounded"></div>
        </div>
        <div class="space-y-2">
          <div class="h-10 bg-white/10 rounded-lg"></div>
          <div class="h-10 bg-white/10 rounded-lg"></div>
        </div>
      </div>
    </div>

    <!-- Bet Not Found -->
    <div v-else-if="!bet" class="px-4 py-12 text-center">
      <p class="text-sm text-white/50">{{ t('betNotFound') }}</p>
      <button @click="goBack" class="mt-4 px-4 py-2 bg-white/10 rounded-lg text-sm">{{ t('back') }}</button>
    </div>

    <!-- Bet Details -->
    <div v-else class="px-4 py-4 space-y-4">
      <!-- Summary -->
      <div class="bg-white/5 rounded-xl p-4 border border-white/5">
        <div class="flex items-center gap-3 mb-4">
          <div :class="['w-12 h-12 rounded-xl flex items-center justify-center shadow-lg overflow-hidden', bet.gameType === 'Maung' ? 'bg-orange-500' : 'bg-green-500']">
            <img :src="bet.gameType === 'Maung' ? '/images/maung_icon.png' : '/images/bawdi_icon.png'" class="w-full h-full object-cover" />
          </div>
          <div class="flex-1">
            <p class="text-base font-bold">{{ bet.gameType === 'Body' ? t('bawdi') : t('maung') }}</p>
            <p class="text-xs text-white/50">{{ formatDate(bet.createdDateInMilliSeconds) }}</p>
          </div>
          <span :class="['text-xs px-2 py-1 rounded font-bold', getStatusStyle(bet.status)]">
            {{ getStatusText(bet.status) }}
          </span>
        </div>
        
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-white/5 rounded-lg p-3 text-center">
            <p class="text-lg font-bold">{{ formatBalance(bet.amount) }}</p>
            <p class="text-[10px] text-white/40">{{ t('betAmount') }}</p>
          </div>
          <div class="bg-white/5 rounded-lg p-3 text-center">
            <p class="text-lg font-bold" :class="bet.status === 'won' ? 'text-green-400' : ''">
              {{ formatBalance(totalWinAmount) }}
            </p>
            <p class="text-[10px] text-white/40">{{ t('winAmount') }}</p>
          </div>
        </div>
      </div>

      <!-- Match List -->
      <div v-for="(detail, index) in bet.soccerBetDetails" :key="index" class="bg-white/5 rounded-xl p-4 border border-white/5">
        <div class="flex items-center justify-between mb-3">
          <span class="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
            {{ detail.game?.leagueGroupName || t('football') }}
          </span>
        </div>
        
        <!-- Clickable Team Names showing selection -->
        <div class="flex items-center justify-between mb-4">
          <div :class="['flex-1 text-center py-2 rounded-lg border transition-colors',
            isHomeSelected(detail) ? 'bg-green-500/20 border-green-500' : 'border-transparent']">
            <p class="text-sm font-bold">{{ detail.game?.homeTeam?.nameInMM || detail.game?.homeTeam?.nameInEng }}</p>
            <p class="text-[10px] text-amber-400">{{ detail.game?.homeBet || '0' }}</p>
          </div>
          <span class="px-3 text-xs text-white/40">VS</span>
          <div :class="['flex-1 text-center py-2 rounded-lg border transition-colors',
            isAwaySelected(detail) ? 'bg-green-500/20 border-green-500' : 'border-transparent']">
            <p class="text-sm font-bold">{{ detail.game?.awayTeam?.nameInMM || detail.game?.awayTeam?.nameInEng }}</p>
            <p class="text-[10px] text-amber-400">{{ detail.game?.homeBet || '0' }}</p>
          </div>
        </div>

        <!-- Over/Under selection display -->
        <div class="flex items-center gap-2">
          <div :class="['flex-1 py-2 rounded-lg text-xs font-bold text-center border', isOverSelected(detail) ? 'bg-green-500 border-green-500' : 'bg-white/10 border-white/20 text-white/50']">
            ဂိုးပေါ်
          </div>
          <div class="text-xs text-amber-400 font-bold min-w-[50px] text-center">{{ detail.game?.gp || '0' }}</div>
          <div :class="['flex-1 py-2 rounded-lg text-xs font-bold text-center border', isUnderSelected(detail) ? 'bg-green-500 border-green-500' : 'bg-white/10 border-white/20 text-white/50']">
            ဂိုးအောက်
          </div>
        </div>

        <div v-if="bet.gameType === 'Body' && detail.amount" class="mt-3 flex justify-between text-xs bg-white/5 rounded-lg p-2">
          <span class="text-white/50">{{ t('betAmount') }}</span>
          <span class="text-amber-400 font-bold">{{ formatBalance(detail.amount) }} {{ t('kyat') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useLanguage } from '~/composables/useLanguage'

definePageMeta({ keepalive: false })

const route = useRoute()
const router = useRouter()
const { getSoccerBetDetail } = useApi()
const { t, currentLanguage } = useLanguage()

const loading = ref(true)
const bet = ref(null)

const formatBalance = (n) => new Intl.NumberFormat('en-US').format(n || 0)
const formatDate = (ms) => {
  if (!ms) return ''
  const locale = currentLanguage.value === 'myanmar' ? 'my-MM' : 'en-US'
  return new Date(ms).toLocaleDateString(locale, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const getStatusStyle = (status) => {
  if (status === 'won' || status === 'Pay') return 'bg-green-500/20 text-green-400'
  if (status === 'lost' || status === 'Gain') return 'bg-red-500/20 text-red-400'
  return 'bg-yellow-500/20 text-yellow-400'
}

const getStatusText = (status) => {
  if (status === 'won' || status === 'Pay') return t('won')
  if (status === 'lost' || status === 'Gain') return t('lost')
  return t('pending')
}

const totalWinAmount = computed(() => {
  if (!bet.value?.soccerBetDetails) return 0
  return bet.value.soccerBetDetails.reduce((sum, d) => sum + (d.payAmount || 0), 0)
})

// API Logic:
// - betUnder = false: Team bet (home/away based on betTeamId)
// - betUnder = true + betTeamId = homeTeamId: Over bet
// - betUnder = true + betTeamId = awayTeamId: Under bet
const isHomeSelected = (detail) => !detail.betUnder && detail.betTeamId === detail.game?.homeTeamId
const isAwaySelected = (detail) => !detail.betUnder && detail.betTeamId === detail.game?.awayTeamId
const isOverSelected = (detail) => detail.betUnder && detail.betTeamId === detail.game?.homeTeamId
const isUnderSelected = (detail) => detail.betUnder && detail.betTeamId === detail.game?.awayTeamId

const goBack = () => router.push('/history')

onMounted(async () => {
  const betId = route.query.id
  if (!betId) { loading.value = false; return }
  
  try {
    const response = await getSoccerBetDetail(betId)
    if (response.msgState === 'data' && response.data) {
      const data = response.data
      bet.value = {
        ...data,
        status: data.status === 'Pay' ? 'won' : data.status === 'Gain' ? 'lost' : 'pending'
      }
    }
  } catch (e) {
    console.error('Error:', e)
  } finally {
    loading.value = false
  }
})
</script>
