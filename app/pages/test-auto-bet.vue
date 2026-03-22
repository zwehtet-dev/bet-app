<template>
  <div class="container mx-auto p-4 space-y-6 pb-24">
    <!-- Header -->
    <Card>
      <CardHeader>
        <CardTitle class="text-lg">Auto Bet Testing</CardTitle>
        <p class="text-sm text-muted-foreground">Test 2D and 3D automatic betting</p>
      </CardHeader>
    </Card>

    <!-- Bet Type Selection -->
    <Card>
      <CardContent class="pt-6">
        <div class="flex gap-2">
          <Button
            @click="betType = '2d'"
            :variant="betType === '2d' ? 'default' : 'outline'"
            class="flex-1"
          >
            2D Betting
          </Button>
          <Button
            @click="betType = '3d'"
            :variant="betType === '3d' ? 'default' : 'outline'"
            class="flex-1"
          >
            3D Betting
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Session Info -->
    <Card v-if="currentSession">
      <CardContent class="pt-6">
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-sm text-muted-foreground">Session Code</span>
            <span class="text-sm font-semibold">{{ currentSession.session_code }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-muted-foreground">Type</span>
            <span class="text-sm font-semibold">{{ currentSession.session_type }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-muted-foreground">Status</span>
            <Badge :variant="currentSession.status === 'open' ? 'default' : 'secondary'">
              {{ currentSession.status }}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Auto Bet Configuration -->
    <Card>
      <CardHeader>
        <CardTitle class="text-base">Auto Bet Configuration</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <!-- Number Range -->
        <div>
          <label class="text-sm font-medium mb-2 block">Number Range</label>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <Input
                v-model.number="config.startNumber"
                type="number"
                :min="0"
                :max="betType === '2d' ? 99 : 999"
                placeholder="Start"
              />
            </div>
            <div>
              <Input
                v-model.number="config.endNumber"
                type="number"
                :min="0"
                :max="betType === '2d' ? 99 : 999"
                placeholder="End"
              />
            </div>
          </div>
        </div>

        <!-- Amount Per Number -->
        <div>
          <label class="text-sm font-medium mb-2 block">Amount Per Number (MMK)</label>
          <Input
            v-model.number="config.amount"
            type="number"
            min="100"
            step="100"
            placeholder="Enter amount"
          />
        </div>

        <!-- Bet Count -->
        <div>
          <label class="text-sm font-medium mb-2 block">Number of Bets to Place</label>
          <Input
            v-model.number="config.betCount"
            type="number"
            min="1"
            max="100"
            placeholder="How many numbers to bet"
          />
        </div>

        <!-- Delay Between Bets -->
        <div>
          <label class="text-sm font-medium mb-2 block">Delay Between Bets (ms)</label>
          <Input
            v-model.number="config.delay"
            type="number"
            min="0"
            step="100"
            placeholder="Delay in milliseconds"
          />
        </div>

        <!-- Random Selection -->
        <div class="flex items-center gap-2">
          <input
            v-model="config.randomSelection"
            type="checkbox"
            id="random"
            class="w-4 h-4"
          />
          <label for="random" class="text-sm">Random number selection</label>
        </div>
      </CardContent>
    </Card>

    <!-- Preview -->
    <Card v-if="previewNumbers.length > 0">
      <CardHeader>
        <CardTitle class="text-base">Preview Numbers</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
          <Badge v-for="num in previewNumbers" :key="num" variant="secondary">
            {{ formatNumber(num) }}
          </Badge>
        </div>
        <div class="mt-3 pt-3 border-t">
          <div class="flex justify-between text-sm">
            <span class="text-muted-foreground">Total Numbers:</span>
            <span class="font-semibold">{{ previewNumbers.length }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-muted-foreground">Total Amount:</span>
            <span class="font-semibold text-amber-500">{{ formatCurrency(totalAmount) }} MMK</span>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Control Buttons -->
    <Card>
      <CardContent class="pt-6 space-y-3">
        <Button
          @click="generatePreview"
          variant="outline"
          class="w-full"
          :disabled="!canGenerate"
        >
          Generate Preview
        </Button>
        
        <Button
          @click="startAutoBet"
          class="w-full"
          :disabled="!canStart || isRunning"
        >
          {{ isRunning ? 'Running...' : 'Start Auto Bet' }}
        </Button>
        
        <Button
          v-if="isRunning"
          @click="stopAutoBet"
          variant="destructive"
          class="w-full"
        >
          Stop Auto Bet
        </Button>
      </CardContent>
    </Card>

    <!-- Progress -->
    <Card v-if="isRunning || progress.total > 0">
      <CardHeader>
        <CardTitle class="text-base">Progress</CardTitle>
      </CardHeader>
      <CardContent class="space-y-3">
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span>Completed:</span>
            <span class="font-semibold">{{ progress.completed }} / {{ progress.total }}</span>
          </div>
          <div class="w-full bg-muted rounded-full h-2">
            <div
              class="bg-primary h-2 rounded-full transition-all"
              :style="{ width: `${progressPercentage}%` }"
            />
          </div>
        </div>
        
        <div class="space-y-1">
          <div class="flex justify-between text-sm">
            <span class="text-green-600">Success:</span>
            <span class="font-semibold">{{ progress.success }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-red-600">Failed:</span>
            <span class="font-semibold">{{ progress.failed }}</span>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Results Log -->
    <Card v-if="results.length > 0">
      <CardHeader>
        <div class="flex justify-between items-center">
          <CardTitle class="text-base">Results Log</CardTitle>
          <Button @click="results = []" variant="ghost" size="sm">
            Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div class="space-y-2 max-h-64 overflow-y-auto">
          <div
            v-for="(result, index) in results"
            :key="index"
            class="text-xs p-2 rounded"
            :class="result.success ? 'bg-green-50 text-green-900' : 'bg-red-50 text-red-900'"
          >
            <div class="flex justify-between">
              <span class="font-semibold">{{ formatNumber(result.number) }}</span>
              <span>{{ result.amount }} MMK</span>
            </div>
            <div class="text-[10px] opacity-75 mt-1">
              {{ result.message }}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

const { getCurrentSession: get2DSession, placeBet: place2DBet } = use2DBetting()
const { getCurrentSession: get3DSession, placeBet: place3DBet } = use3DBetting()
const toast = useToast()

const betType = ref<'2d' | '3d'>('2d')
const currentSession = ref<any>(null)
const isRunning = ref(false)
const previewNumbers = ref<number[]>([])

const config = ref({
  startNumber: 0 as number,
  endNumber: 99 as number,
  amount: 1000 as number,
  betCount: 10 as number,
  delay: 500 as number,
  randomSelection: true
})

const progress = ref({
  completed: 0,
  total: 0,
  success: 0,
  failed: 0
})

const results = ref<Array<{
  number: number
  amount: number
  success: boolean
  message: string
}>>([])

const maxNumber = computed(() => betType.value === '2d' ? 99 : 999)
const totalAmount = computed(() => previewNumbers.value.length * config.value.amount)
const progressPercentage = computed(() => 
  progress.value.total > 0 ? (progress.value.completed / progress.value.total) * 100 : 0
)

const canGenerate = computed(() => {
  return config.value.startNumber >= 0 &&
    config.value.endNumber <= maxNumber.value &&
    config.value.startNumber <= config.value.endNumber &&
    config.value.betCount > 0 &&
    config.value.amount >= 100
})

const canStart = computed(() => {
  return previewNumbers.value.length > 0 && currentSession.value?.status === 'open'
})

const formatNumber = (num: number) => {
  const digits = betType.value === '2d' ? 2 : 3
  return num.toString().padStart(digits, '0')
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US').format(amount)
}

const generatePreview = () => {
  const { startNumber, endNumber, betCount, randomSelection } = config.value
  const numbers: number[] = []

  if (randomSelection) {
    // Generate random numbers
    const availableNumbers = Array.from(
      { length: endNumber - startNumber + 1 },
      (_, i) => startNumber + i
    )
    
    for (let i = 0; i < Math.min(betCount, availableNumbers.length); i++) {
      const randomIndex = Math.floor(Math.random() * availableNumbers.length)
      numbers.push(availableNumbers[randomIndex])
      availableNumbers.splice(randomIndex, 1)
    }
  } else {
    // Sequential numbers
    for (let i = 0; i < betCount && startNumber + i <= endNumber; i++) {
      numbers.push(startNumber + i)
    }
  }

  previewNumbers.value = numbers.sort((a, b) => a - b)
  toast.success(`Generated ${numbers.length} numbers`)
}

const loadSession = async () => {
  try {
    const data = betType.value === '2d' 
      ? await get2DSession()
      : await get3DSession()
    
    currentSession.value = data
  } catch (error: any) {
    console.error('Failed to load session:', error)
    toast.error(error?.message || 'Failed to load session')
  }
}

const placeSingleBet = async (number: number, amount: number) => {
  const items = [{
    number: formatNumber(number),
    amount
  }]

  const placeBet = betType.value === '2d' ? place2DBet : place3DBet
  return await placeBet(items)
}

const startAutoBet = async () => {
  if (!canStart.value || isRunning.value) return

  isRunning.value = true
  progress.value = {
    completed: 0,
    total: previewNumbers.value.length,
    success: 0,
    failed: 0
  }
  results.value = []

  toast.info('Starting auto bet...')

  for (let i = 0; i < previewNumbers.value.length && isRunning.value; i++) {
    const number = previewNumbers.value[i]
    
    try {
      const response = await placeSingleBet(number, config.value.amount)
      
      if (response.success) {
        progress.value.success++
        results.value.unshift({
          number,
          amount: config.value.amount,
          success: true,
          message: `Slip: ${response.data?.slip_number || 'N/A'}`
        })
      } else {
        progress.value.failed++
        results.value.unshift({
          number,
          amount: config.value.amount,
          success: false,
          message: response.message || 'Failed'
        })
      }
    } catch (error: any) {
      progress.value.failed++
      results.value.unshift({
        number,
        amount: config.value.amount,
        success: false,
        message: error?.message || 'Error occurred'
      })
    }

    progress.value.completed++

    // Delay before next bet
    if (i < previewNumbers.value.length - 1 && config.value.delay > 0) {
      await new Promise(resolve => setTimeout(resolve, config.value.delay))
    }
  }

  isRunning.value = false
  
  toast.success(
    `Auto bet completed! Success: ${progress.value.success}, Failed: ${progress.value.failed}`
  )

  // Refresh user balance
  const { fetchUser } = useAuth()
  await fetchUser()
}

const stopAutoBet = () => {
  isRunning.value = false
  toast.warning('Auto bet stopped')
}

// Watch bet type changes
watch(betType, async () => {
  // Reset config based on bet type
  config.value.endNumber = betType.value === '2d' ? 99 : 999
  previewNumbers.value = []
  
  // Load new session
  await loadSession()
})

onMounted(async () => {
  await loadSession()
})

useHead({
  title: 'Auto Bet Testing - 2D3D'
})
</script>
