<template>
  <button
    @click="copyToClipboard"
    :class="buttonClasses"
    :aria-label="`Copy ${section} to clipboard`"
  >
    <svg v-if="!copied" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
    </svg>
    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
    </svg>
    <span class="ml-1 text-xs">{{ copied ? 'Copied!' : 'Copy' }}</span>
  </button>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  text: string
  section: string
}

interface Emits {
  (e: 'copy', text: string, section: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const copied = ref(false)

const buttonClasses = computed(() => {
  const baseClasses = 'flex items-center px-2 py-1 rounded-lg text-xs font-medium transition-all duration-200'
  
  if (copied.value) {
    return `${baseClasses} bg-green-100 text-green-700`
  }
  
  return `${baseClasses} bg-secondary-100 hover:bg-secondary-200 text-secondary-600 hover:text-secondary-700`
})

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.text)
    copied.value = true
    emit('copy', props.text, props.section)
    
    // Reset copied state after 2 seconds
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (error) {
    console.error('Failed to copy text:', error)
  }
}
</script>
