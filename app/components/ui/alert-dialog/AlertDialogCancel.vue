<script setup lang="ts">
import { AlertDialogCancel } from 'radix-vue'
</script>

<template>
  <AlertDialogCancel as-child>
    <slot />
  </AlertDialogCancel>
</template>
