import { ref } from 'vue'
import type { 
  TranscriptionResponse, 
  ProcessingResponse, 
  GroqTranscriptionRequest,
  GroqChatRequest,
  GroqChatResponse,
  ApiError 
} from '@/types'

export function useGroqAPI() {
  const isLoading = ref(false)
  const apiKey = import.meta.env.VITE_GROQ_API_KEY
  const baseUrl = import.meta.env.VITE_GROQ_API_BASE_URL

  if (!apiKey) {
    console.warn('VITE_GROQ_API_KEY not found in environment variables')
  }

  const transcribeAudio = async (audioBlob: Blob): Promise<TranscriptionResponse> => {
    if (!apiKey) {
      throw new Error('Groq API key not configured. Please add your API key to the environment variables.')
    }

    isLoading.value = true

    try {
      // Convert blob to File for FormData
      const audioFile = new File([audioBlob], 'recording.webm', { 
        type: audioBlob.type || 'audio/webm' 
      })

      const formData = new FormData()
      formData.append('file', audioFile)
      formData.append('model', 'whisper-large-v3')
      formData.append('language', 'en')
      formData.append('response_format', 'json')
      formData.append('temperature', '0')

      const response = await fetch(`${baseUrl}/audio/transcriptions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `Transcription failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      return {
        text: data.text || '',
        confidence: data.confidence,
        language: data.language || 'en',
        duration: data.duration
      }

    } catch (error) {
      console.error('Transcription error:', error)
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'Failed to transcribe audio. Please check your internet connection and try again.'
      )
    } finally {
      isLoading.value = false
    }
  }

  const processWithLLM = async (transcriptionText: string): Promise<ProcessingResponse> => {
    if (!apiKey) {
      throw new Error('Groq API key not configured')
    }

    const startTime = Date.now()
    isLoading.value = true

    try {
      const systemPrompt = `You are a helpful cooking assistant that formats recipe instructions and translates them to Sinhalese. 

Your task:
1. Take the raw transcribed recipe text and generate a descriptive recipe name based on the main ingredients and cooking method
2. Extract ingredients and cooking instructions separately
3. Format ingredients as a clear list with quantities
4. Convert cooking steps into clear, numbered step-by-step instructions in English
5. Translate the recipe name, ingredients and instructions into Sinhalese
6. Return the results in the exact JSON format specified below

Return your response in this exact JSON format:
{
  "recipeName": "Descriptive Recipe Name",
  "sinhaleseRecipeName": "විස්තරාත්මක වට්ටෝරුවේ නම",
  "englishIngredients": ["Ingredient 1 with quantity", "Ingredient 2 with quantity", ...],
  "englishInstructions": ["Step 1 text", "Step 2 text", ...],
  "sinhaleseIngredients": ["අමුද්‍රව්‍ය 1 ප්‍රමාණය සමඟ", "අමුද්‍රව්‍ය 2 ප්‍රමාණය සමඟ", ...],
  "sinhaleseInstructions": ["පියවර 1 text", "පියවර 2 text", ...]
}

Guidelines:
- Separate ingredients from cooking instructions clearly
- For ingredients: include quantities, measurements, and preparation notes (e.g., "2 cups rice, washed", "1 onion, chopped")
- For instructions: use clear, actionable language (e.g., "Heat oil in a pan" not "You want to heat some oil")
- Each step should be concise but complete
- Maintain cooking terminology and measurements
- For Sinhalese translation, use proper culinary terms and natural phrasing
- If the transcription doesn't seem to be a recipe, still try to format it as cooking instructions`

      const chatRequest: GroqChatRequest = {
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Please format this recipe transcription into step-by-step instructions in both English and Sinhalese:\n\n${transcriptionText}`
          }
        ],
        model: 'groq/compound',
        temperature: 0.3,
        max_tokens: 2000
      }

      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(chatRequest)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `LLM processing failed: ${response.status} ${response.statusText}`)
      }

      const data: GroqChatResponse = await response.json()
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response from LLM')
      }

      const content = data.choices[0].message.content
      
      // Parse the JSON response
      let parsedResponse
      try {
        // Extract JSON from the response (in case there's extra text)
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          parsedResponse = JSON.parse(jsonMatch[0])
        } else {
          parsedResponse = JSON.parse(content)
        }
      } catch (parseError) {
        console.error('Failed to parse LLM response:', content)
        throw new Error('Failed to parse recipe instructions. Please try again.')
      }

      // Validate the response structure
      if (!parsedResponse.recipeName || !parsedResponse.sinhaleseRecipeName ||
          !parsedResponse.englishIngredients || !parsedResponse.englishInstructions || 
          !parsedResponse.sinhaleseIngredients || !parsedResponse.sinhaleseInstructions) {
        throw new Error('Invalid response format from LLM')
      }

      if (!Array.isArray(parsedResponse.englishIngredients) || !Array.isArray(parsedResponse.englishInstructions) ||
          !Array.isArray(parsedResponse.sinhaleseIngredients) || !Array.isArray(parsedResponse.sinhaleseInstructions)) {
        throw new Error('All recipe components must be arrays')
      }

      const processingTime = Date.now() - startTime

      return {
        recipeName: parsedResponse.recipeName,
        sinhaleseRecipeName: parsedResponse.sinhaleseRecipeName,
        englishIngredients: parsedResponse.englishIngredients,
        englishInstructions: parsedResponse.englishInstructions,
        sinhaleseIngredients: parsedResponse.sinhaleseIngredients,
        sinhaleseInstructions: parsedResponse.sinhaleseInstructions,
        processingTime
      }

    } catch (error) {
      console.error('LLM processing error:', error)
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'Failed to process recipe with AI. Please try again.'
      )
    } finally {
      isLoading.value = false
    }
  }

  const translateToSinhalese = async (recipeName: string, ingredients: string[], instructions: string[]): Promise<{ sinhaleseRecipeName: string; sinhaleseIngredients: string[]; sinhaleseInstructions: string[] }> => {
    if (!apiKey) {
      throw new Error('Groq API key not configured')
    }

    isLoading.value = true

    try {
      const systemPrompt = `You are a helpful cooking assistant that translates English recipes to Sinhalese.

Your task:
1. Translate the provided English recipe name to Sinhalese
2. Translate each ingredient with quantities to Sinhalese
3. Translate each cooking instruction to Sinhalese
4. Maintain proper culinary terminology and natural phrasing
5. Return the results in the exact JSON format specified below

Return your response in this exact JSON format:
{
  "sinhaleseRecipeName": "විස්තරාත්මක වට්ටෝරුවේ නම",
  "sinhaleseIngredients": ["අමුද්‍රව්‍ය 1 ප්‍රමාණය සමඟ", "අමුද්‍රව්‍ය 2 ප්‍රමාණය සමඟ", ...],
  "sinhaleseInstructions": ["පියවර 1 text", "පියවර 2 text", ...]
}`

      const englishRecipeText = `Recipe Name: ${recipeName}

Ingredients:
${ingredients.map(ing => `• ${ing}`).join('\n')}

Instructions:
${instructions.map((inst, idx) => `${idx + 1}. ${inst}`).join('\n')}`

      const chatRequest: GroqChatRequest = {
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Please translate this English recipe to Sinhalese:\n\n${englishRecipeText}`
          }
        ],
        model: 'compound-beta',
        temperature: 0.3,
        max_tokens: 2000
      }

      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(chatRequest)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`Translation failed: ${errorData.error?.message || response.statusText}`)
      }

      const data: GroqChatResponse = await response.json()
      const content = data.choices[0]?.message?.content

      if (!content) {
        throw new Error('No translation response received')
      }

      let parsedResponse: any
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          parsedResponse = JSON.parse(jsonMatch[0])
        } else {
          parsedResponse = JSON.parse(content)
        }
      } catch (parseError) {
        console.error('Failed to parse translation response:', content)
        throw new Error('Failed to parse translation. Please try again.')
      }

      if (!parsedResponse.sinhaleseRecipeName || !parsedResponse.sinhaleseIngredients || !parsedResponse.sinhaleseInstructions) {
        throw new Error('Invalid translation response format')
      }

      if (!Array.isArray(parsedResponse.sinhaleseIngredients) || !Array.isArray(parsedResponse.sinhaleseInstructions)) {
        throw new Error('Translation components must be arrays')
      }

      return {
        sinhaleseRecipeName: parsedResponse.sinhaleseRecipeName,
        sinhaleseIngredients: parsedResponse.sinhaleseIngredients,
        sinhaleseInstructions: parsedResponse.sinhaleseInstructions
      }

    } catch (error) {
      console.error('Translation error:', error)
      throw new Error(
        error instanceof Error 
          ? `Translation failed: ${error.message}`
          : 'Translation failed due to an unknown error'
      )
    } finally {
      isLoading.value = false
    }
  }

  const testConnection = async (): Promise<boolean> => {
    if (!apiKey) {
      return false
    }

    try {
      const response = await fetch(`${baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      })
      return response.ok
    } catch {
      return false
    }
  }

  return {
    isLoading,
    transcribeAudio,
    processWithLLM,
    translateToSinhalese,
    testConnection
  }
}
