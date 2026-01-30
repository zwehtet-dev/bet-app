<template>
  <div class="space-y-4">
    <!-- Number Grid -->
    <div class="grid grid-cols-10 gap-1">
      <button
        v-for="num in numbers"
        :key="num"
        @click="selectNumber(num)"
        :class="[
          'aspect-square rounded-lg font-semibold text-sm transition-all',
          getNumberClass(num),
          selectedNumbers.includes(num) && 'ring-2 ring-primary ring-offset-2'
        ]"
        :disabled="isNumberBlocked(num)"
      >
        {{ num }}
      </button>
    </div>

    <!-- Legend -->
    <div class="flex flex-wrap gap-3 text-xs">
      <div class="flex items-center gap-1.5">
        <div class="w-4 h-4 rounded bg-green-500/20 border border-green-500/30"></div>
        <span class="text-muted-foreground">Available</span>
      </div>
      <div class="flex items-center gap-1.5">
        <div class="w-4 h-4 rounded bg-yellow-500/20 border border-yellow-500/30"></div>
        <span class="text-muted-foreground">70-90% Full</span>
      </div>
      <div class="flex items-center gap-1.5">
        <div class="w-4 h-4 rounded bg-orange-500/20 border border-orange-500/30"></div>
        <span class="text-muted-foreground">90-100% Full</span>
      </div>
      <div class="flex items-center gap-1.5">
        <div class="w-4 h-4 rounded bg-red-500/20 border border-red-500/30"></div>
        <span class="text-muted-foreground">Blocked/Full</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  digitStatus?: Record<string, any>
  blockedNumbers?: string[]
}>()

const emit = defineEmits<{
  (e: 'select', number: string): void
}>()

const selectedNumbers = ref<string[]>([])

// Generate numbers 00-99
const numbers = computed(() => {
  return Array.from({ length: 100 }, (_, i) => i.toString().padStart(2, '0'))
})

const selectNumber = (num: string) => {
  if (isNumberBlocked(num)) return
  
  const index = selectedNumbers.value.indexOf(num)
  if (index > -1) {
    selectedNumbers.value.splice(index, 1)
  } else {
    selectedNumbers.value.push(num)
  }
  
  emit('select', num)
}

const isNumberBlocked = (num: string) => {
  if (props.blockedNumbers?.includes(num)) return true
  
  const status = props.digitStatus?.[num]
  return status?.status === 'blocked' || status?.status === 'full'
}

const getNumberClass = (num: string) => {
  if (isNumberBlocked(num)) {
    return 'bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 cursor-not-allowed opacity-50'
  }
  
  const status = props.digitStatus?.[num]
  
  if (!status) {
    return 'bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 hover:bg-green-500/20'
  }
  
  const percentage = (status.current_amount / status.brake_amount) * 100
  
  if (percentage >= 90) {
    return 'bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 hover:bg-orange-500/20'
  } else if (percentage >= 70) {
    return 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/20'
  } else {
    return 'bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 hover:bg-green-500/20'
  }
}

// Expose selected numbers for parent component
defineExpose({
  selectedNumbers,
  clearSelection: () => {
    selectedNumbers.value = []
  }
})
</script>
