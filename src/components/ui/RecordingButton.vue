<template>
  <button
    :class="buttonClasses"
    :disabled="disabled"
    @click="handleClick"
    :aria-label="ariaLabel"
  >
    <div class="flex items-center justify-center space-x-3">
      <!-- Icon -->
      <div :class="iconClasses">
        <svg v-if="!isRecording && !isProcessing" 
             class="w-8 h-8" 
             fill="currentColor" 
             viewBox="0 0 24 24">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
          <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
        </svg>
        
        <svg v-else-if="isRecording" 
             class="w-8 h-8" 
             fill="currentColor" 
             viewBox="0 0 24 24">
          <rect x="6" y="6" width="12" height="12" rx="2"/>
        </svg>
        
        <svg v-else-if="isProcessing" 
             class="w-8 h-8 animate-spin" 
             fill="none" 
             viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
        </svg>
      </div>
      
      <!-- Text -->
      <span class="font-semibold text-lg">
        {{ buttonText }}
      </span>
    </div>
    
    <!-- Recording pulse effect -->
    <div v-if="isRecording" 
         class="absolute inset-0 rounded-full bg-accent-500 opacity-30 animate-ping">
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  isRecording: boolean
  isProcessing: boolean
  disabled?: boolean
}

interface Emits {
  (e: 'start-recording'): void
  (e: 'stop-recording'): void
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

const emit = defineEmits<Emits>()

const buttonText = computed(() => {
  if (props.isProcessing) return 'Processing...'
  if (props.isRecording) return 'Stop Recording'
  return 'Start Recording'
})

const ariaLabel = computed(() => {
  if (props.isProcessing) return 'Processing your recipe'
  if (props.isRecording) return 'Stop recording recipe'
  return 'Start recording recipe'
})

const buttonClasses = computed(() => {
  const baseClasses = 'relative w-64 h-16 rounded-2xl font-medium text-lg transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-primary-200 disabled:opacity-50 disabled:cursor-not-allowed'
  
  if (props.disabled) {
    return `${baseClasses} bg-secondary-300 text-secondary-500`
  }
  
  if (props.isRecording) {
    return `${baseClasses} bg-accent-500 hover:bg-accent-600 text-white shadow-large hover:scale-105 active:scale-95`
  }
  
  if (props.isProcessing) {
    return `${baseClasses} bg-primary-400 text-white cursor-wait`
  }
  
  return `${baseClasses} btn-primary hover:scale-105 active:scale-95`
})

const iconClasses = computed(() => {
  const baseClasses = 'flex items-center justify-center'
  
  if (props.isRecording) {
    return `${baseClasses} text-white`
  }
  
  return `${baseClasses} text-current`
})

const handleClick = () => {
  if (props.disabled || props.isProcessing) return
  
  if (props.isRecording) {
    emit('stop-recording')
  } else {
    emit('start-recording')
  }
}
</script>
