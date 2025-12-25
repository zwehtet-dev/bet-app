<script setup lang="ts">
import { Bell, Globe } from 'lucide-vue-next';

</script>

<template>
  <div class="px-5 py-4 flex items-center justify-between color-white bg-theme-primary/80">
      <div class="flex items-center space-x-3">
        <div class="w-11 h-11 bg-yellow-500 rounded-xl flex items-center justify-center font-black text-white text-lg">
          2d3d
        </div>
      </div>
      <div class="flex items-center space-x-3">
        <Button class=" text-white">
            APP
        </Button>
        
        
        <DropdownMenu >
            <DropdownMenuTrigger as-child>
                <Globe color="#fff"/>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="bg-transparent text-white">
                <DropdownMenuItem>English</DropdownMenuItem>
                <DropdownMenuSeparator />     
                <DropdownMenuItem>Myanmar</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        <button class="relative p-2">
            <Bell color="#fff"/>
        </button>
      </div>
    </div>
</template>