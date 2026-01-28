<template>
  <div class="container mx-auto p-4 space-y-6">
    
    <!-- Mode Selection -->
    <div class="grid grid-cols-2 gap-2">
      <Button 
        @click="mode = 'manual'" 
        :variant="mode === 'manual' ? 'default' : 'outline'"
        size="lg"
      >
        Manual Input
      </Button>
      <Button 
        @click="mode = 'grid'" 
        :variant="mode === 'grid' ? 'default' : 'outline'"
        size="lg"
      >
        Number Grid
      </Button>
    </div>

    <!-- Manual Input Mode -->
    <Card v-if="mode === 'manual'">
      <CardHeader>
        <CardTitle class="text-base">Enter Your 3D Number</CardTitle>
      </CardHeader>
      <CardContent class="space-y-6">
        <div class="flex justify-center gap-3">
          <Input 
            v-for="i in 3" 
            :key="i" 
            v-model="digits[i-1]" 
            @input="onDigit($event, i-1)" 
            maxlength="1" 
            class="w-16 h-16 text-center text-2xl font-bold"
          />
        </div>
        <div class="text-center pt-4 border-t">
          <p class="text-sm text-muted-foreground mb-2">Your 3D Number</p>
          <p class="text-4xl font-bold">{{ currentNum }}</p>
        </div>
      </CardContent>
    </Card>

    <!-- Grid Selection Mode -->
    <template v-if="mode === 'grid'">
      <!-- Selected Numbers Card -->
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <CardTitle class="text-base">Selected Numbers</CardTitle>
            <Button v-if="selected.length" @click="selected = []" variant="ghost" size="sm">
              Clear All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div class="flex flex-wrap gap-2 min-h-[25px]">
            <Badge v-for="n in selected.slice(0, 20)" :key="n" class="text-sm">
              {{ n.toString().padStart(3, '0') }}
              <button @click="removeSelected(n)" class="ml-1.5 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100">
                <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </Badge>
            <span v-if="!selected.length" class="text-sm text-muted-foreground py-0.5">
              Select numbers below
            </span>
          </div>
        </CardContent>
      </Card>

      <!-- Number Grid -->
      <Card>
        <CardHeader>
          <CardTitle class="text-base">Pick Your Numbers (000-099)</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-10 gap-1.5">
            <Button 
              v-for="n in 100" 
              :key="n-1" 
              @click="toggleGrid(n-1)" 
              :variant="selectedSet.has(n-1) ? 'default' : 'outline'"
              size="sm"
              class="aspect-square p-0 text-xs font-semibold"
            >
              {{ (n-1).toString().padStart(3, '0') }}
            </Button>
          </div>
        </CardContent>
      </Card>
    </template>

    <!-- Amount Selection -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <CardTitle class="text-base">Amount Per Number</CardTitle>
          <span class="text-lg font-bold">{{ formatBalance(amount) }} MMK</span>
        </div>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="grid grid-cols-4 gap-2">
          <Button 
            v-for="a in [500, 1000, 2000, 5000]" 
            :key="a" 
            @click="amount = a" 
            :variant="amount === a ? 'default' : 'outline'"
            size="sm"
          >
            {{ formatBalance(a) }}
          </Button>
        </div>
        
        <div class="flex items-center gap-3">
          <Button @click="amount = Math.max(100, amount - 100)" variant="outline" size="icon">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
            </svg>
          </Button>
          <Input v-model="amount" type="number" min="100" step="100" class="text-center font-semibold" />
          <Button @click="amount += 100" variant="outline" size="icon">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Bet Summary -->
    <Card>
      <CardContent class="pt-6 space-y-3">
        <div class="flex justify-between items-center">
          <span class="text-sm text-muted-foreground">Total Bet</span>
          <span class="text-xl font-bold">{{ formatBalance(total) }} MMK</span>
        </div>
        <div class="flex justify-between items-center pt-3 border-t">
          <span class="text-sm text-muted-foreground">Potential Win</span>
          <span class="text-xl font-bold text-green-600 dark:text-green-400">{{ formatBalance(total * 500) }} MMK</span>
        </div>
        <Button @click="placeBetHandler" :disabled="!canBet" class="w-full" size="lg">
          {{ betText }}
        </Button>
      </CardContent>
    </Card>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

definePageMeta({
  keepalive: true
})

const mode = ref('manual')
const digits = ref(['', '', ''])
const selected = ref([])
const amount = ref(1000)

const selectedSet = computed(() => new Set(selected.value))
const currentNum = computed(() => digits.value.map(d => d || '0').join(''))
const isValid = computed(() => digits.value.every(d => d !== ''))
const count = computed(() => mode.value === 'manual' ? (isValid.value ? 1 : 0) : selected.value.length)
const total = computed(() => count.value * amount.value)
const canBet = computed(() => count.value > 0)
const betText = computed(() => {
  if (!count.value) return mode.value === 'manual' ? 'Enter 3 Digits' : 'Select Numbers'
  return `Place Bet - ${formatBalance(total.value)} MMK`
})

const formatBalance = (n) => new Intl.NumberFormat('en-US').format(n || 0)
const onDigit = (e, i) => { 
  if (!/^[0-9]$/.test(e.target.value) && e.target.value !== '') { 
    e.target.value = ''
    digits.value[i] = '' 
  } 
}
const toggleGrid = (n) => { 
  const i = selected.value.indexOf(n)
  i > -1 ? selected.value.splice(i, 1) : selected.value.push(n) 
}
const removeSelected = (n) => { 
  selected.value = selected.value.filter(x => x !== n) 
}

const placeBetHandler = () => {
  if (!canBet.value) return
  alert(`Bet placed successfully for ${count.value} number(s)!`)
  setTimeout(() => {
    digits.value = ['', '', '']
    selected.value = []
    amount.value = 1000
  }, 500)
}
</script>
