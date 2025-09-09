<template>
  <div class="bg-red-50 border border-red-200 rounded-xl p-4 space-y-3">
    <div class="flex items-start space-x-3">
      <div class="flex-shrink-0">
        <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
        </svg>
      </div>
      <div class="flex-1">
        <h3 class="text-sm font-medium text-red-800">
          Something went wrong
        </h3>
        <p class="text-sm text-red-700 mt-1">
          {{ error.message }}
        </p>
        <div v-if="error.code" class="text-xs text-red-600 mt-1 font-mono">
          Error Code: {{ error.code }}
        </div>
      </div>
    </div>
    
    <div class="flex space-x-3">
      <button
        v-if="onRetry"
        @click="onRetry"
        class="text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-lg transition-colors duration-200"
      >
        Try Again
      </button>
      <button
        v-if="onDismiss"
        @click="onDismiss"
        class="text-sm text-red-600 hover:text-red-800 transition-colors duration-200"
      >
        Dismiss
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApiError } from '@/types'

interface Props {
  error: ApiError
  onRetry?: () => void
  onDismiss?: () => void
}

defineProps<Props>()
</script>
