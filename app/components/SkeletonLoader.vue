<template>
  <div class="animate-pulse">
    <!-- Card Skeleton -->
    <div v-if="type === 'card'" class="bg-white/5 rounded-xl border border-white/5 overflow-hidden">
      <div class="p-4">
        <div class="h-4 bg-white/10 rounded w-1/3 mb-3"></div>
        <div class="h-8 bg-white/10 rounded w-1/2"></div>
      </div>
    </div>

    <!-- Result Card Skeleton (2D) -->
    <div v-else-if="type === 'result-2d'" class="space-y-3">
      <div class="flex justify-center">
        <div class="h-7 bg-white/10 rounded-full w-28"></div>
      </div>
      <div class="bg-white/5 rounded-xl border border-white/5 overflow-hidden">
        <div class="text-center py-2.5 border-b border-white/5 bg-white/5">
          <div class="h-5 bg-white/10 rounded w-20 mx-auto"></div>
        </div>
        <div class="grid grid-cols-3 py-4 px-3">
          <div class="text-center">
            <div class="h-3 bg-white/10 rounded w-8 mx-auto mb-2"></div>
            <div class="h-5 bg-white/10 rounded w-16 mx-auto"></div>
          </div>
          <div class="text-center border-x border-white/5">
            <div class="h-3 bg-white/10 rounded w-8 mx-auto mb-2"></div>
            <div class="h-5 bg-white/10 rounded w-16 mx-auto"></div>
          </div>
          <div class="text-center">
            <div class="h-3 bg-white/10 rounded w-8 mx-auto mb-2"></div>
            <div class="h-8 bg-white/10 rounded w-12 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Result Card Skeleton (3D) -->
    <div v-else-if="type === 'result-3d'" class="bg-white/5 rounded-xl border border-white/5 overflow-hidden">
      <div class="flex items-center justify-between px-4 py-4">
        <div>
          <div class="h-3 bg-white/10 rounded w-10 mb-1"></div>
          <div class="h-5 bg-white/10 rounded w-24"></div>
        </div>
        <div class="text-right">
          <div class="h-3 bg-white/10 rounded w-16 mb-1 ml-auto"></div>
          <div class="h-10 bg-white/10 rounded w-20"></div>
        </div>
      </div>
    </div>

    <!-- Balance Card Skeleton -->
    <div v-else-if="type === 'balance'" class="bg-white/5 rounded-2xl border border-white/5 p-5">
      <div class="flex justify-between items-start mb-4">
        <div>
          <div class="h-3 bg-white/10 rounded w-24 mb-2"></div>
          <div class="h-8 bg-white/10 rounded w-32 mb-1"></div>
          <div class="h-3 bg-white/10 rounded w-12"></div>
        </div>
        <div class="w-14 h-14 bg-white/10 rounded-2xl"></div>
      </div>
      <div class="h-12 bg-white/10 rounded-xl"></div>
    </div>

    <!-- Carousel Skeleton -->
    <div v-else-if="type === 'carousel'" class="h-40 bg-white/5 rounded-2xl"></div>

    <!-- Game Card Skeleton -->
    <div v-else-if="type === 'game-card'" class="bg-white/5 rounded-xl border border-white/5 p-4 text-center">
      <div class="w-12 h-12 bg-white/10 rounded-xl mx-auto mb-2"></div>
      <div class="h-4 bg-white/10 rounded w-16 mx-auto mb-1"></div>
      <div class="h-3 bg-white/10 rounded w-20 mx-auto"></div>
    </div>

    <!-- Today Results Skeleton -->
    <div v-else-if="type === 'today-results'" class="bg-white/5 rounded-xl border border-white/5 p-4">
      <div class="flex items-center gap-2 mb-3">
        <div class="w-7 h-7 bg-white/10 rounded-lg"></div>
        <div class="h-3 bg-white/10 rounded w-12"></div>
      </div>
      <div class="space-y-2">
        <div class="flex justify-between items-center">
          <div class="h-3 bg-white/10 rounded w-10"></div>
          <div class="h-6 bg-white/10 rounded w-12"></div>
        </div>
        <div class="flex justify-between items-center">
          <div class="h-3 bg-white/10 rounded w-10"></div>
          <div class="h-6 bg-white/10 rounded w-12"></div>
        </div>
      </div>
    </div>

    <!-- List Item Skeleton -->
    <div v-else-if="type === 'list-item'" class="bg-white/5 rounded-xl border border-white/5 p-4 flex items-center gap-3">
      <div class="w-10 h-10 bg-white/10 rounded-lg flex-shrink-0"></div>
      <div class="flex-1">
        <div class="h-4 bg-white/10 rounded w-24 mb-2"></div>
        <div class="h-3 bg-white/10 rounded w-32"></div>
      </div>
      <div class="h-5 bg-white/10 rounded w-16"></div>
    </div>

    <!-- Text Line Skeleton -->
    <div v-else-if="type === 'text'" class="h-4 bg-white/10 rounded" :class="widthClass"></div>

    <!-- Default Box Skeleton -->
    <div v-else class="bg-white/10 rounded" :class="[heightClass, widthClass]"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'box'
  },
  width: {
    type: String,
    default: 'full'
  },
  height: {
    type: String,
    default: '4'
  }
})

const widthClass = computed(() => {
  const widths = {
    'full': 'w-full',
    '3/4': 'w-3/4',
    '2/3': 'w-2/3',
    '1/2': 'w-1/2',
    '1/3': 'w-1/3',
    '1/4': 'w-1/4'
  }
  return widths[props.width] || 'w-full'
})

const heightClass = computed(() => {
  return `h-${props.height}`
})
</script>
