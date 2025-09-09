import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { RecipeData, RecordingState, ApiError, AudioRecording } from '@/types'

export const useRecipeStore = defineStore('recipe', () => {
  // State
  const currentRecipe = ref<RecipeData | null>(null)
  const recordingState = ref<RecordingState>('idle')
  const currentRecording = ref<AudioRecording | null>(null)
  const error = ref<ApiError | null>(null)
  const processingStartTime = ref<Date | null>(null)

  // Computed
  const isRecording = computed(() => recordingState.value === 'recording')
  const isProcessing = computed(() => recordingState.value === 'processing')
  const isCompleted = computed(() => recordingState.value === 'completed')
  const hasError = computed(() => recordingState.value === 'error')
  const isIdle = computed(() => recordingState.value === 'idle')

  // Actions
  const setRecordingState = (state: RecordingState) => {
    recordingState.value = state
    if (state === 'processing') {
      processingStartTime.value = new Date()
    }
  }

  const setCurrentRecording = (recording: AudioRecording | null) => {
    currentRecording.value = recording
  }

  const setCurrentRecipe = (recipe: RecipeData) => {
    currentRecipe.value = recipe
    setRecordingState('completed')
  }

  const updateCurrentRecipe = (recipe: RecipeData) => {
    currentRecipe.value = recipe
  }

  const setError = (apiError: ApiError) => {
    error.value = apiError
    setRecordingState('error')
  }

  const clearError = () => {
    error.value = null
    if (recordingState.value === 'error') {
      setRecordingState('idle')
    }
  }

  const resetCurrentRecipe = () => {
    currentRecipe.value = null
    currentRecording.value = null
    error.value = null
    processingStartTime.value = null
    setRecordingState('idle')
  }

  const startRecording = () => {
    clearError()
    setRecordingState('recording')
  }

  const stopRecording = (recording: AudioRecording) => {
    setCurrentRecording(recording)
    setRecordingState('processing')
  }

  const getProcessingDuration = (): number => {
    if (!processingStartTime.value) return 0
    return Date.now() - processingStartTime.value.getTime()
  }

  return {
    // State
    currentRecipe,
    recordingState,
    currentRecording,
    error,
    processingStartTime,
    
    // Computed
    isRecording,
    isProcessing,
    isCompleted,
    hasError,
    isIdle,
    
    // Actions
    setRecordingState,
    setCurrentRecording,
    setCurrentRecipe,
    updateCurrentRecipe,
    setError,
    clearError,
    resetCurrentRecipe,
    startRecording,
    stopRecording,
    getProcessingDuration
  }
})
