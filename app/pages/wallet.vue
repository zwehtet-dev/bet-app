<template>
  <div class="container mx-auto p-4 space-y-6">
    
    <!-- Balance Card -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <CardDescription>Total Balance</CardDescription>
            <CardTitle class="text-4xl font-bold">{{ formatAmount(demoBalance) }} <span class="text-lg text-muted-foreground font-normal">MMK</span></CardTitle>
          </div>
          <div class="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center">
            <svg class="h-7 w-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      </CardHeader>
      <CardContent class="grid grid-cols-2 gap-3">
        <Button @click="handleAction('deposit')" size="lg">
          <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Deposit
        </Button>
        <Button @click="handleAction('withdraw')" variant="outline" size="lg">
          <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
          </svg>
          Withdraw
        </Button>
      </CardContent>
    </Card>

    <!-- Stats -->
    <div class="grid grid-cols-3 gap-4">
      <Card class="gap-0">
        <CardContent class="text-center">
          <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ formatAmount(150000) }}</p>
          <p class="text-xs text-muted-foreground mt-1">Total Deposits</p>
        </CardContent>
      </Card>
      <Card class="gap-0">
        <CardContent class="text-center">
          <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ formatAmount(50000) }}</p>
          <p class="text-xs text-muted-foreground mt-1">Withdrawals</p>
        </CardContent>
      </Card>
      <Card class="gap-0">
        <CardContent class="text-center">
          <p class="text-2xl font-bold">{{ demoTransactions.length }}</p>
          <p class="text-xs text-muted-foreground mt-1">Transactions</p>
        </CardContent>
      </Card>
    </div>

    <!-- Payment Methods -->
    <div class="space-y-3">
      <h2 class="text-xl font-semibold">Payment Methods</h2>
      <div class="grid grid-cols-4 gap-3">
        <Button v-for="m in paymentMethods" :key="m.id" variant="outline" class="h-auto flex-col gap-2 p-4">
          <div class="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
            <span class="text-sm font-bold text-primary">{{ m.name.slice(0, 2) }}</span>
          </div>
          <span class="text-xs font-medium truncate w-full">{{ m.name }}</span>
        </Button>
      </div>
    </div>

    <!-- Transaction History -->
    <div class="space-y-3">
      <h2 class="text-xl font-semibold">Recent Transactions</h2>
      <div class="space-y-3">
        <Card v-for="tx in demoTransactions" :key="tx.id" class="gap-0">
          <CardContent class="flex items-center gap-4">
            <div :class="[
              'h-10 w-10 rounded-md flex items-center justify-center flex-shrink-0',
              tx.type === 'deposit' ? 'bg-green-500/10' : 'bg-red-500/10'
            ]">
              <svg class="h-5 w-5" :class="tx.type === 'deposit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'" 
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="tx.type === 'deposit'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
              </svg>
            </div>
            
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold">{{ tx.method }}</p>
              <p class="text-xs text-muted-foreground">{{ tx.date }}</p>
            </div>
            
            <div class="text-right flex-shrink-0">
              <p :class="[
                'text-base font-bold mb-1',
                tx.type === 'deposit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              ]">
                {{ tx.type === 'deposit' ? '+' : '-' }}{{ formatAmount(tx.amount) }}
              </p>
              <Badge :variant="tx.status === 'completed' ? 'default' : 'secondary'" class="text-xs">
                {{ tx.status }}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

definePageMeta({
  keepalive: true
})

const demoBalance = ref(500000)

const paymentMethods = [
  { id: 1, name: 'KBZ Pay' },
  { id: 2, name: 'Wave Money' },
  { id: 3, name: 'CB Pay' },
  { id: 4, name: 'AYA Pay' }
]

const demoTransactions = [
  { id: 1, type: 'deposit', method: 'KBZ Pay', amount: 100000, date: 'Jan 27, 10:30 AM', status: 'completed' },
  { id: 2, type: 'withdraw', method: 'Wave Money', amount: 50000, date: 'Jan 26, 03:15 PM', status: 'completed' },
  { id: 3, type: 'deposit', method: 'CB Pay', amount: 50000, date: 'Jan 25, 11:20 AM', status: 'pending' }
]

const formatAmount = (n) => new Intl.NumberFormat('en-US').format(n || 0)
const handleAction = (action) => {
  alert(`${action.charAt(0).toUpperCase() + action.slice(1)} feature coming soon`)
}
</script>
