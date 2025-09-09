<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <!-- Header -->
    <header class="text-center mb-12">
      <h1 class="text-4xl md:text-5xl font-bold text-gradient mb-4">
        RecipeScribe
      </h1>
      <p class="text-lg md:text-xl text-secondary-600 max-w-2xl mx-auto text-balance">
        Transform your spoken recipes into beautifully formatted instructions in English and Sinhalese
      </p>
    </header>

    <!-- Main Content -->
    <main class="flex flex-col items-center space-y-8">
      <!-- Recording Section -->
      <div class="w-full max-w-2xl">
        <RecordingInterface />
      </div>

      <!-- Results Section -->
      <div v-if="recipeStore.currentRecipe" class="w-full">
        <ResultsDisplay 
          :recipe-data="recipeStore.currentRecipe"
          :is-loading="recipeStore.isProcessing"
          @new-recording="handleNewRecording"
          @copy-text="handleCopyText"
          @update-recipe="handleUpdateRecipe"
        />
      </div>

      <!-- Instructions -->
      <div v-if="!recipeStore.currentRecipe && !recipeStore.isRecording" 
           class="card max-w-2xl text-center fade-in">
        <h2 class="text-xl font-semibold text-secondary-800 mb-4">
          How it works
        </h2>
        <div class="grid md:grid-cols-3 gap-6 text-sm">
          <div class="flex flex-col items-center space-y-2">
            <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <span class="text-primary-600 font-bold">1</span>
            </div>
            <h3 class="font-medium text-secondary-700">Record</h3>
            <p class="text-secondary-500">Speak your recipe naturally</p>
          </div>
          <div class="flex flex-col items-center space-y-2">
            <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <span class="text-primary-600 font-bold">2</span>
            </div>
            <h3 class="font-medium text-secondary-700">Process</h3>
            <p class="text-secondary-500">AI formats your instructions</p>
          </div>
          <div class="flex flex-col items-center space-y-2">
            <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <span class="text-primary-600 font-bold">3</span>
            </div>
            <h3 class="font-medium text-secondary-700">Translate</h3>
            <p class="text-secondary-500">Get results in both languages</p>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="text-center mt-16 text-secondary-400 text-sm">
      <p>Made with ❤️ for home cooks everywhere</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useRecipeStore } from '@/stores/recipeStore'
import RecordingInterface from '@/components/recording/RecordingInterface.vue'
import ResultsDisplay from '@/components/results/ResultsDisplay.vue'
import type { RecipeData } from '@/types'

const recipeStore = useRecipeStore()

const handleNewRecording = () => {
  recipeStore.resetCurrentRecipe()
}

const handleCopyText = (text: string, section: string) => {
  navigator.clipboard.writeText(text).then(() => {
    // TODO: Add toast notification for successful copy
    console.log(`Copied ${section} to clipboard`)
  }).catch((err) => {
    console.error('Failed to copy text:', err)
  })
}

const handleUpdateRecipe = (updatedRecipe: RecipeData) => {
  recipeStore.updateCurrentRecipe(updatedRecipe)
}
</script>
