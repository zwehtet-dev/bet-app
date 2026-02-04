<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import {
  AlertDialogRoot,
  type AlertDialogRootEmits,
  type AlertDialogRootProps,
  useForwardPropsEmits,
} from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<AlertDialogRootProps & { class?: HTMLAttributes['class'] }>()
const emits = defineEmits<AlertDialogRootEmits>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <AlertDialogRoot v-bind="forwarded">
    <slot />
  </AlertDialogRoot>
</template>
