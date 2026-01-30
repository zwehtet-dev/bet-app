<template>
  <div class="container mx-auto p-4 space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold">Results</h1>
      <p class="text-muted-foreground">View all lottery results</p>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2">
      <Button
        @click="activeTab = '2d'"
        :variant="activeTab === '2d' ? 'default' : 'outline'"
        size="sm"
      >
        2D
      </Button>
      <Button
        @click="activeTab = '3d'"
        :variant="activeTab === '3d' ? 'default' : 'outline'"
        size="sm"
      >
        3D
      </Button>
    </div>

    <!-- 2D Results -->
    <div v-if="activeTab === '2d'" class="space-y-4">
      <!-- Today's Results -->
      <Card>
        <CardHeader>
          <CardTitle>Today's Results</CardTitle>
          <CardDescription>{{ formatDate(new Date()) }}</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-2 gap-4">
            <div class="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center">
              <p class="text-sm text-muted-foreground mb-2">Morning (12:00 PM)</p>
              <p class="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {{ todayResults.morning || '--' }}
              </p>
            </div>
            <div class="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20 text-center">
              <p class="text-sm text-muted-foreground mb-2">Evening (4:30 PM)</p>
              <p class="text-4xl font-bold text-purple-600 dark:text-purple-400">
                {{ todayResults.evening || '--' }}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Recent 2D Results -->
      <Card>
        <CardHeader>
          <CardTitle>Recent 2D Results</CardTitle>
        </CardHeader>
        <CardContent>
          <SkeletonLoader v-if="isLoading2D" type="list-item" />
          <div v-else-if="results2D.length > 0" class="space-y-2">
            <div
              v-for="result in results2D"
              :key="result.session_code"
              class="flex items-center justify-between p-3 rounded-lg bg-muted/50"
            >
              <div>
                <p class="font-medium">{{ result.session_type }} Session</p>
                <p class="text-sm text-muted-foreground">
                  {{ formatDate(result.session_date) }} • {{ formatTime(result.result_time) }}
                </p>
              </div>
              <div class="text-3xl font-bold text-primary">{{ result.result_number }}</div>
            </div>
          </div>
          <p v-else class="text-center text-muted-foreground py-4">No results yet</p>
        </CardContent>
      </Card>

      <!-- Statistics -->
      <Card>
        <CardHeader>
          <CardTitle>Hot Numbers (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-5 gap-2">
            <div
              v-for="num in hotNumbers2D"
              :key="num.number"
              class="aspect-square rounded-lg bg-primary/10 flex flex-col items-center justify-center"
            >
              <span class="text-2xl font-bold text-primary">{{ num.number }}</span>
              <span class="text-xs text-muted-foreground">{{ num.count }}x</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- 3D Results -->
    <div v-else class="space-y-4">
      <!-- Latest 3D Result -->
      <Card>
        <CardHeader>
          <CardTitle>Latest 3D Result</CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="latest3D" class="text-center py-6">
            <p class="text-sm text-muted-foreground mb-2">{{ latest3D.session_type }}</p>
            <p class="text-6xl font-bold text-primary mb-2">{{ latest3D.result_number }}</p>
            <p class="text-sm text-muted-foreground">
              {{ formatDate(latest3D.session_date) }} • {{ formatTime(latest3D.result_time) }}
            </p>
          </div>
          <p v-else class="text-center text-muted-foreground py-8">No result yet</p>
        </CardContent>
      </Card>

      <!-- Recent 3D Results -->
      <Card>
        <CardHeader>
          <CardTitle>Recent 3D Results</CardTitle>
        </CardHeader>
        <CardContent>
          <SkeletonLoader v-if="isLoading3D" type="list-item" />
          <div v-else-if="results3D.length > 0" class="space-y-3">
            <div
              v-for="result in results3D"
              :key="result.session_code"
              class="p-4 rounded-lg bg-muted/50"
            >
              <div class="flex items-center justify-between mb-2">
                <div>
                  <p class="font-medium">{{ result.session_type }}</p>
                  <p class="text-sm text-muted-foreground">
                    {{ formatDate(result.session_date) }}
                  </p>
                </div>
                <div class="text-4xl font-bold text-primary">{{ result.result_number }}</div>
              </div>
              
              <!-- Win Analysis -->
              <div class="grid grid-cols-3 gap-2 mt-3 pt-3 border-t">
                <div class="text-center">
                  <p class="text-xs text-muted-foreground">Exact</p>
                  <p class="font-semibold text-green-600 dark:text-green-400">500x</p>
                </div>
                <div class="text-center">
                  <p class="text-xs text-muted-foreground">Permutation</p>
                  <p class="font-semibold text-blue-600 dark:text-blue-400">10x</p>
                </div>
                <div class="text-center">
                  <p class="text-xs text-muted-foreground">Near</p>
                  <p class="font-semibold text-purple-600 dark:text-purple-400">10x</p>
                </div>
              </div>
            </div>
          </div>
          <p v-else class="text-center text-muted-foreground py-4">No results yet</p>
        </CardContent>
      </Card>

      <!-- Statistics -->
      <Card>
        <CardHeader>
          <CardTitle>Hot Numbers (Last 6 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-4 gap-2">
            <div
              v-for="num in hotNumbers3D"
              :key="num.number"
              class="aspect-square rounded-lg bg-primary/10 flex flex-col items-center justify-center"
            >
              <span class="text-xl font-bold text-primary">{{ num.number }}</span>
              <span class="text-xs text-muted-foreground">{{ num.count }}x</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import SkeletonLoader from '@/components/SkeletonLoader.vue'

const { getRecentResults: get2DResults } = use2DBetting()
const { getRecentResults: get3DResults } = use3DBetting()

const activeTab = ref('2d')
const results2D = ref<any[]>([])
const results3D = ref<any[]>([])
const hotNumbers2D = ref<any[]>([])
const hotNumbers3D = ref<any[]>([])
const isLoading2D = ref(false)
const isLoading3D = ref(false)

const todayResults = computed(() => {
  const today = new Date().toDateString()
  const todayResults = results2D.value.filter(r => 
    new Date(r.session_date).toDateString() === today
  )
  
  return {
    morning: todayResults.find(r => r.session_type === 'morning')?.result_number,
    evening: todayResults.find(r => r.session_type === 'evening')?.result_number
  }
})

const latest3D = computed(() => {
  return results3D.value[0] || null
})

const load2DResults = async () => {
  isLoading2D.value = true
  try {
    results2D.value = await get2DResults(30)
    
    // Calculate hot numbers
    const numberCount: Record<string, number> = {}
    results2D.value.forEach(r => {
      numberCount[r.result_number] = (numberCount[r.result_number] || 0) + 1
    })
    
    hotNumbers2D.value = Object.entries(numberCount)
      .map(([number, count]) => ({ number, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  } catch (error) {
    console.error('Failed to load 2D results:', error)
  } finally {
    isLoading2D.value = false
  }
}

const load3DResults = async () => {
  isLoading3D.value = true
  try {
    results3D.value = await get3DResults(20)
    
    // Calculate hot numbers
    const numberCount: Record<string, number> = {}
    results3D.value.forEach(r => {
      numberCount[r.result_number] = (numberCount[r.result_number] || 0) + 1
    })
    
    hotNumbers3D.value = Object.entries(numberCount)
      .map(([number, count]) => ({ number, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)
  } catch (error) {
    console.error('Failed to load 3D results:', error)
  } finally {
    isLoading3D.value = false
  }
}

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatTime = (time: string) => {
  return new Date(time).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

watch(activeTab, (newTab) => {
  if (newTab === '2d' && results2D.value.length === 0) {
    load2DResults()
  } else if (newTab === '3d' && results3D.value.length === 0) {
    load3DResults()
  }
})

onMounted(() => {
  load2DResults()
})

useHead({
  title: 'Results - 2D3D'
})
</script>
