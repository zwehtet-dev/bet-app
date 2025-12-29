<template>
  <div 
    ref="containerRef"
    class="grid gap-1 overflow-hidden"
    :style="gridStyle"
  >
    <button 
      v-for="n in visibleNumbers" 
      :key="n"
      @click="$emit('toggle', n)"
      :class="[
        'aspect-square rounded-lg font-bold transition-colors active:scale-90 touch-manipulation',
        textSizeClass,
        selected.includes(n) 
          ? `${selectedClass} shadow-lg` 
          : 'bg-white/5 text-white/60 hover:bg-white/10'
      ]"
    >
      {{ formatNumber(n) }}
    </button>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'

const props = defineProps({
  total: { type: Number, required: true }, // 100 for 2D, 1000 for 3D
  selected: { type: Array, default: () => [] },
  columns: { type: Number, default: 10 },
  selectedClass: { type: String, default: 'bg-blue-500' },
  digits: { type: Number, default: 2 } // 2 for 2D, 3 for 3D
})

const emit = defineEmits(['toggle'])

const containerRef = ref(null)

// Generate all numbers
const allNumbers = computed(() => 
  Array.from({ length: props.total }, (_, i) => i)
)

// For now, show all numbers (can be optimized with intersection observer for very large grids)
const visibleNumbers = computed(() => allNumbers.value)

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${props.columns}, minmax(0, 1fr))`
}))

const textSizeClass = computed(() => 
  props.digits === 3 ? 'text-[8px]' : 'text-[11px]'
)

const formatNumber = (n) => n.toString().padStart(props.digits, '0')
</script>
