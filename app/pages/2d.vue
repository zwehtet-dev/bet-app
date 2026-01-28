<template>
  <div class="container mx-auto p-4 space-y-6">
    
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
      <CardContent class="space-y-4">
        <div class="flex flex-wrap gap-2 min-h-[25px]">
          <Badge v-for="n in selected" :key="n" class="text-sm">
            {{ n.toString().padStart(2, '0') }}
            <button @click="toggle(n)" class="ml-1.5 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100">
              <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </Badge>
          <span v-if="!selected.length" class="text-sm text-muted-foreground py-0.5">
            Select numbers below
          </span>
        </div>
        
        <div v-if="reverseNums.length" class="pt-4 border-t space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium">Reverse Numbers</span>
            <Button @click="addReverse" size="sm" variant="outline">
              Add All ({{ reverseNums.length }})
            </Button>
          </div>
          <div class="flex flex-wrap gap-2">
            <Badge v-for="n in reverseNums.slice(0, 10)" :key="n" variant="secondary" class="text-xs">
              {{ n.toString().padStart(2, '0') }}
            </Badge>
            <span v-if="reverseNums.length > 10" class="text-xs text-muted-foreground py-0.5">
              +{{ reverseNums.length - 10 }} more
            </span>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Number Grid -->
    <Card>
      <CardHeader>
        <CardTitle class="text-base">Pick Your Numbers</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-10 gap-1.5">
          <Button 
            v-for="n in 100" 
            :key="n-1" 
            @click="toggle(n-1)" 
            :variant="selectedSet.has(n-1) ? 'default' : 'outline'"
            size="sm"
            class="aspect-square p-0 text-xs font-semibold"
          >{{ (n-1).toString().padStart(2, '0') }}</Button>
        </div>
      </CardContent>
    </Card>

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
          <Button v-for="a in [100, 500, 1000, 5000]" :key="a" @click="amount = a" 
            :variant="amount === a ? 'default' : 'outline'"
            size="sm">
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
          <span class="text-xl font-bold text-green-600 dark:text-green-400">{{ formatBalance(total * 85) }} MMK</span>
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

const selected = ref([])
const amount = ref(1000)

const selectedSet = computed(() => new Set(selected.value))
const total = computed(() => selected.value.length * amount.value)
const canBet = computed(() => selected.value.length > 0)
const betText = computed(() => {
  if (!selected.value.length) return 'Select Numbers First'
  return `Place Bet - ${formatBalance(total.value)} MMK`
})
const reverseNums = computed(() => selected.value.map(n => (n % 10) * 10 + Math.floor(n / 10)).filter(r => !selected.value.includes(r)))

const formatBalance = (n) => new Intl.NumberFormat('en-US').format(n || 0)
const toggle = (n) => { const i = selected.value.indexOf(n); i > -1 ? selected.value.splice(i, 1) : selected.value.push(n) }
const addReverse = () => reverseNums.value.forEach(n => { if (!selected.value.includes(n)) selected.value.push(n) })

const placeBetHandler = () => {
  if (!canBet.value) return
  alert(`Bet placed successfully for ${selected.value.length} numbers!`)
  setTimeout(() => {
    selected.value = []
    amount.value = 1000
  }, 500)
}
</script>
