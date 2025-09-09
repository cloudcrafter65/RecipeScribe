import { ref } from 'vue'
import type { AudioRecording, RecipeData, TranscriptionResponse, ProcessingResponse } from '@/types'
import { useGroqAPI } from '@/composables/useGroqAPI'

export function useRecipeProcessor() {
  const { transcribeAudio, processWithLLM } = useGroqAPI()
  const isProcessing = ref(false)

  const processRecipe = async (recording: AudioRecording): Promise<RecipeData> => {
    isProcessing.value = true
    
    try {
      // Step 1: Transcribe audio to text
      const transcription = await transcribeAudio(recording.blob)
      
      // Step 2: Process with LLM to get structured instructions and translation
      const processing = await processWithLLM(transcription.text)
      
      // Step 3: Create recipe data object
      const recipeData: RecipeData = {
        id: generateRecipeId(),
        timestamp: new Date(),
        rawTranscription: transcription.text,
        recipeName: processing.recipeName,
        sinhaleseRecipeName: processing.sinhaleseRecipeName,
        englishIngredients: processing.englishIngredients,
        englishInstructions: processing.englishInstructions,
        sinhaleseIngredients: processing.sinhaleseIngredients,
        sinhaleseInstructions: processing.sinhaleseInstructions,
        audioBlob: recording.blob,
        processingTime: processing.processingTime
      }
      
      return recipeData
      
    } catch (error) {
      throw new Error(`Failed to process recipe: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      isProcessing.value = false
    }
  }

  const generateRecipeId = (): string => {
    return `recipe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  const validateRecipeText = (text: string): boolean => {
    // Basic validation for recipe content
    const minLength = 10
    const maxLength = 5000
    
    if (text.length < minLength) {
      throw new Error('Recipe text is too short. Please speak for at least a few seconds.')
    }
    
    if (text.length > maxLength) {
      throw new Error('Recipe text is too long. Please try breaking it into smaller parts.')
    }
    
    // Check for cooking-related keywords
    const cookingKeywords = [
      'cook', 'bake', 'fry', 'boil', 'mix', 'add', 'heat', 'stir', 'cut', 'chop',
      'ingredient', 'recipe', 'dish', 'food', 'prepare', 'serve', 'season', 'taste'
    ]
    
    const hasKeywords = cookingKeywords.some(keyword => 
      text.toLowerCase().includes(keyword)
    )
    
    if (!hasKeywords) {
      console.warn('No cooking keywords detected in transcription')
    }
    
    return true
  }

  const formatInstructions = (instructions: string[]): string[] => {
    return instructions
      .filter(instruction => instruction.trim().length > 0)
      .map(instruction => {
        // Clean up instruction text
        let cleaned = instruction.trim()
        
        // Ensure proper capitalization
        cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
        
        // Ensure proper punctuation
        if (!cleaned.endsWith('.') && !cleaned.endsWith('!') && !cleaned.endsWith('?')) {
          cleaned += '.'
        }
        
        return cleaned
      })
  }

  const estimateProcessingTime = (audioBlob: Blob): number => {
    // Rough estimate based on audio size and duration
    const sizeInMB = audioBlob.size / (1024 * 1024)
    return Math.max(5000, sizeInMB * 2000) // Minimum 5 seconds, ~2 seconds per MB
  }

  return {
    isProcessing,
    processRecipe,
    validateRecipeText,
    formatInstructions,
    estimateProcessingTime
  }
}
