<template>
  <div class="flex items-center justify-center space-x-1 h-16">
    <div 
      v-for="i in 5" 
      :key="i"
      :class="waveClasses"
      :style="{ animationDelay: `${(i - 1) * 0.1}s` }"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  isActive: boolean
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  className: ''
})

const waveClasses = computed(() => {
  const baseClasses = 'w-1 bg-primary-500 rounded-full transition-all duration-200'
  const activeClasses = props.isActive 
    ? 'h-8 audio-wave' 
    : 'h-2'
  
  return `${baseClasses} ${activeClasses} ${props.className}`
})
</script>
