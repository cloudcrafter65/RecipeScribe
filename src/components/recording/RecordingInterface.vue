<template>
  <div class="card text-center space-y-6">
    <!-- Recording Button -->
    <div class="flex flex-col items-center space-y-4">
      <RecordingButton
        :is-recording="recipeStore.isRecording"
        :is-processing="recipeStore.isProcessing"
        :disabled="recipeStore.hasError"
        @start-recording="handleStartRecording"
        @stop-recording="handleStopRecording"
      />
      
      <!-- Recording Status -->
      <div class="min-h-[2rem]">
        <p v-if="recipeStore.isRecording" class="text-accent-600 font-medium animate-pulse">
          🎤 Recording... Speak your recipe naturally
        </p>
        <p v-else-if="recipeStore.isProcessing" class="text-primary-600 font-medium">
          ⚡ Processing your recipe...
        </p>
        <p v-else-if="recipeStore.hasError" class="text-red-600 font-medium">
          ❌ {{ recipeStore.error?.message }}
        </p>
        <p v-else class="text-secondary-500">
          Click the button to start recording your recipe
        </p>
      </div>
    </div>

    <!-- Audio Visualizer -->
    <div v-if="recipeStore.isRecording" class="flex justify-center">
      <AudioVisualizer :is-active="recipeStore.isRecording" />
    </div>

    <!-- Recording Timer -->
    <div v-if="recipeStore.isRecording && recordingDuration > 0" 
         class="text-secondary-600 font-mono text-lg">
      {{ formatDuration(recordingDuration) }}
    </div>

    <!-- Error Handling -->
    <div v-if="recipeStore.hasError" class="space-y-4">
      <ErrorMessage 
        :error="recipeStore.error!"
        @retry="handleRetry"
        @dismiss="recipeStore.clearError"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRecipeStore } from '@/stores/recipeStore'
import { useAudioRecorder } from '@/composables/useAudioRecorder'
import { useRecipeProcessor } from '@/composables/useRecipeProcessor'
import RecordingButton from '@/components/ui/RecordingButton.vue'
import AudioVisualizer from '@/components/ui/AudioVisualizer.vue'
import ErrorMessage from '@/components/ui/ErrorMessage.vue'

const recipeStore = useRecipeStore()
const { startRecording, stopRecording, isSupported, requestPermissions } = useAudioRecorder()
const { processRecipe } = useRecipeProcessor()

const recordingDuration = ref(0)
let recordingTimer: number | null = null

const handleStartRecording = async () => {
  try {
    if (!isSupported.value) {
      throw new Error('Audio recording is not supported in this browser')
    }

    await requestPermissions()
    recipeStore.startRecording()
    await startRecording()
    
    // Start timer
    recordingDuration.value = 0
    recordingTimer = setInterval(() => {
      recordingDuration.value += 1
    }, 1000)
    
  } catch (error) {
    recipeStore.setError({
      message: error instanceof Error ? error.message : 'Failed to start recording',
      code: 'RECORDING_START_ERROR'
    })
  }
}

const handleStopRecording = async () => {
  try {
    // Stop timer
    if (recordingTimer) {
      clearInterval(recordingTimer)
      recordingTimer = null
    }

    const recording = await stopRecording()
    if (recording) {
      recipeStore.stopRecording(recording)
      
      // Process the recording
      const recipe = await processRecipe(recording)
      recipeStore.setCurrentRecipe(recipe)
    }
  } catch (error) {
    recipeStore.setError({
      message: error instanceof Error ? error.message : 'Failed to process recording',
      code: 'RECORDING_PROCESS_ERROR'
    })
  }
}

const handleRetry = () => {
  recipeStore.clearError()
  recordingDuration.value = 0
}

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

onMounted(() => {
  // Check for audio support on mount
  if (!isSupported.value) {
    recipeStore.setError({
      message: 'Audio recording is not supported in this browser. Please use a modern browser like Chrome, Firefox, or Safari.',
      code: 'BROWSER_NOT_SUPPORTED'
    })
  }
})

onUnmounted(() => {
  if (recordingTimer) {
    clearInterval(recordingTimer)
  }
})
</script>
