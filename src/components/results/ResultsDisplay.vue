<template>
  <div class="space-y-6 fade-in">
    <!-- Header -->
    <div class="text-center">
      <h2 class="text-2xl font-bold text-secondary-800 mb-2">
        Your Recipe is Ready! 🎉
      </h2>
      <p class="text-secondary-600">
        Here's your recipe formatted in both English and Sinhalese
      </p>
    </div>

    <!-- Results Grid -->
    <div class="grid gap-6">
      <!-- Raw Transcription -->
      <div class="card-hover">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-secondary-800">
            Raw Transcription
          </h3>
          <CopyButton 
            :text="recipeData.rawTranscription"
            section="raw transcription"
            @copy="handleCopy"
          />
        </div>
        <div class="text-sm text-secondary-600 leading-relaxed">
          {{ recipeData.rawTranscription }}
        </div>
      </div>

      <!-- English Recipe -->
      <div class="grid gap-6 lg:grid-cols-2">
        <div class="card-hover">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-secondary-800">
              English Recipe
            </h3>
            <div class="flex items-center space-x-2">
              <button
                v-if="!isEditing"
                @click="startEditing"
                class="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Edit</span>
              </button>
              <CopyButton 
                :text="englishRecipeText"
                section="English recipe"
                @copy="handleCopy"
              />
            </div>
          </div>
          
          <!-- Recipe Name -->
          <div class="mb-4">
            <input
              v-if="isEditing"
              v-model="editableRecipeName"
              class="w-full text-xl font-bold text-primary-700 text-center bg-transparent border-b-2 border-primary-300 focus:border-primary-500 focus:outline-none"
              placeholder="Recipe Name"
            />
            <h2 v-else class="text-xl font-bold text-primary-700 text-center">
              {{ recipeData.recipeName }}
            </h2>
          </div>
          
          <!-- English Ingredients -->
          <div class="mb-6">
            <div class="flex items-center justify-between mb-3">
              <h4 class="font-medium text-secondary-700 flex items-center">
                <span class="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                Ingredients
              </h4>
              <button
                v-if="isEditing"
                @click="addIngredient"
                class="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                + Add
              </button>
            </div>
            
            <!-- Edit Mode -->
            <div v-if="isEditing" class="space-y-2">
              <div 
                v-for="(ingredient, index) in editableIngredients" 
                :key="index"
                class="flex items-center space-x-2"
              >
                <span class="text-primary-500">•</span>
                <input
                  v-model="editableIngredients[index]"
                  class="flex-1 text-sm text-secondary-600 bg-transparent border-b border-secondary-300 focus:border-primary-500 focus:outline-none"
                  placeholder="Enter ingredient with quantity"
                />
                <button
                  @click="removeIngredient(index)"
                  class="text-red-500 hover:text-red-700 text-xs"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <!-- View Mode -->
            <ul v-else class="space-y-1 text-sm text-secondary-600">
              <li 
                v-for="(ingredient, index) in recipeData.englishIngredients" 
                :key="index"
                class="flex items-start space-x-2"
              >
                <span class="text-primary-500 mt-1">•</span>
                <span>{{ ingredient }}</span>
              </li>
            </ul>
          </div>

          <!-- English Instructions -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <h4 class="font-medium text-secondary-700 flex items-center">
                <span class="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                Instructions
              </h4>
              <button
                v-if="isEditing"
                @click="addInstruction"
                class="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                + Add
              </button>
            </div>
            
            <!-- Edit Mode -->
            <div v-if="isEditing" class="space-y-2">
              <div 
                v-for="(instruction, index) in editableInstructions" 
                :key="index"
                class="flex items-start space-x-2"
              >
                <span class="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium mt-1">
                  {{ index + 1 }}
                </span>
                <textarea
                  v-model="editableInstructions[index]"
                  class="flex-1 text-sm text-secondary-600 bg-transparent border border-secondary-300 rounded p-2 focus:border-primary-500 focus:outline-none resize-none"
                  placeholder="Enter cooking instruction"
                  rows="2"
                />
                <button
                  @click="removeInstruction(index)"
                  class="text-red-500 hover:text-red-700 text-xs mt-2"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <!-- View Mode -->
            <ol v-else class="space-y-2 text-sm text-secondary-600">
              <li 
                v-for="(instruction, index) in recipeData.englishInstructions" 
                :key="index"
                class="flex items-start space-x-2"
              >
                <span class="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium">
                  {{ index + 1 }}
                </span>
                <span class="leading-relaxed">{{ instruction }}</span>
              </li>
            </ol>
          </div>
          
          <!-- Edit Actions -->
          <div v-if="isEditing" class="mt-6 flex justify-end space-x-2">
            <button
              @click="cancelEditing"
              class="px-4 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="saveEdits"
              :disabled="isTranslating"
              class="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {{ isTranslating ? 'Updating...' : 'Save & Translate' }}
            </button>
          </div>
        </div>

        <!-- Sinhalese Recipe -->
        <div class="card-hover">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-secondary-800">
              Sinhalese Recipe
            </h3>
            <CopyButton 
              :text="sinhaleseRecipeText"
              section="Sinhalese recipe"
              @copy="handleCopy"
            />
          </div>
          
          <!-- Sinhalese Recipe Name -->
          <div class="mb-4">
            <h2 class="text-xl font-bold text-primary-700 text-center">
              {{ recipeData.sinhaleseRecipeName }}
            </h2>
          </div>
          
          <!-- Sinhalese Ingredients -->
          <div class="mb-6">
            <h4 class="font-medium text-secondary-700 mb-3 flex items-center">
              <span class="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
              අමුද්‍රව්‍ය
            </h4>
            <ul class="space-y-1 text-sm text-secondary-600">
              <li 
                v-for="(ingredient, index) in recipeData.sinhaleseIngredients" 
                :key="index"
                class="flex items-start space-x-2"
              >
                <span class="text-primary-500 mt-1">•</span>
                <span>{{ ingredient }}</span>
              </li>
            </ul>
          </div>

          <!-- Sinhalese Instructions -->
          <div>
            <h4 class="font-medium text-secondary-700 mb-3 flex items-center">
              <span class="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
              උපදෙස්
            </h4>
            <ol class="space-y-2 text-sm text-secondary-600">
              <li 
                v-for="(instruction, index) in recipeData.sinhaleseInstructions" 
                :key="index"
                class="flex items-start space-x-2"
              >
                <span class="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium">
                  {{ index + 1 }}
                </span>
                <span class="leading-relaxed">{{ instruction }}</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>

    <!-- Processing Info -->
    <div v-if="recipeData.processingTime" class="text-center text-xs text-secondary-400">
      Processed in {{ (recipeData.processingTime / 1000).toFixed(1) }}s
    </div>

    <!-- Actions -->
    <div class="flex justify-center space-x-4">
      <button
        @click="handleCopy(combinedRecipeText, 'both recipes')"
        class="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <span>Copy Both Languages</span>
      </button>
      <button
        @click="$emit('newRecording')"
        class="btn-primary"
      >
        Record Another Recipe
      </button>
      <button
        @click="shareRecipe"
        class="btn-secondary"
      >
        Share Recipe
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { RecipeData } from '@/types'
import CopyButton from '@/components/ui/CopyButton.vue'
import { useGroqAPI } from '@/composables/useGroqAPI'

interface Props {
  recipeData: RecipeData
  isLoading: boolean
}

interface Emits {
  (e: 'newRecording'): void
  (e: 'copyText', text: string, section: string): void
  (e: 'updateRecipe', updatedRecipe: RecipeData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { translateToSinhalese, isLoading: isTranslating } = useGroqAPI()

// Edit mode state
const isEditing = ref(false)
const editableRecipeName = ref('')
const editableIngredients = ref<string[]>([])
const editableInstructions = ref<string[]>([])

const startEditing = () => {
  isEditing.value = true
  editableRecipeName.value = props.recipeData.recipeName
  editableIngredients.value = [...props.recipeData.englishIngredients]
  editableInstructions.value = [...props.recipeData.englishInstructions]
}

const cancelEditing = () => {
  isEditing.value = false
  editableRecipeName.value = ''
  editableIngredients.value = []
  editableInstructions.value = []
}

const saveEdits = async () => {
  try {
    // Translate the edited English recipe to Sinhalese
    const translation = await translateToSinhalese(
      editableRecipeName.value,
      editableIngredients.value,
      editableInstructions.value
    )

    // Create updated recipe data
    const updatedRecipe: RecipeData = {
      ...props.recipeData,
      recipeName: editableRecipeName.value,
      englishIngredients: editableIngredients.value,
      englishInstructions: editableInstructions.value,
      sinhaleseRecipeName: translation.sinhaleseRecipeName,
      sinhaleseIngredients: translation.sinhaleseIngredients,
      sinhaleseInstructions: translation.sinhaleseInstructions
    }

    emit('updateRecipe', updatedRecipe)
    isEditing.value = false
  } catch (error) {
    console.error('Failed to update recipe:', error)
    // Could add error handling UI here
  }
}

const addIngredient = () => {
  editableIngredients.value.push('')
}

const removeIngredient = (index: number) => {
  editableIngredients.value.splice(index, 1)
}

const addInstruction = () => {
  editableInstructions.value.push('')
}

const removeInstruction = (index: number) => {
  editableInstructions.value.splice(index, 1)
}

const englishRecipeText = computed(() => {
  const ingredients = props.recipeData.englishIngredients
    .map(ingredient => `• ${ingredient}`)
    .join('\n')
  
  const instructions = props.recipeData.englishInstructions
    .map((instruction, index) => `${index + 1}. ${instruction}`)
    .join('\n')
  
  return `${props.recipeData.recipeName}\n\nIngredients:\n${ingredients}\n\nInstructions:\n${instructions}`
})

const sinhaleseRecipeText = computed(() => {
  const ingredients = props.recipeData.sinhaleseIngredients
    .map(ingredient => `• ${ingredient}`)
    .join('\n')
  
  const instructions = props.recipeData.sinhaleseInstructions
    .map((instruction, index) => `${index + 1}. ${instruction}`)
    .join('\n')
  
  return `${props.recipeData.sinhaleseRecipeName}\n\nඅමුද්‍රව්‍ය:\n${ingredients}\n\nඋපදෙස්:\n${instructions}`
})

const combinedRecipeText = computed(() => {
  return `${englishRecipeText.value}\n\n---\n\n${sinhaleseRecipeText.value}\n\nCreated with RecipeScribe`
})

const handleCopy = (text: string, section: string) => {
  emit('copyText', text, section)
}

const shareRecipe = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: `Recipe: ${props.recipeData.recipeName}`,
        text: combinedRecipeText.value
      })
    } catch (error) {
      // Fallback to clipboard
      navigator.clipboard.writeText(combinedRecipeText.value)
    }
  } else {
    // Fallback to clipboard
    navigator.clipboard.writeText(combinedRecipeText.value)
  }
}
</script>
