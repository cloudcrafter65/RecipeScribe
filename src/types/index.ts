// RecipeScribe Type Definitions

export interface RecipeData {
  id: string
  timestamp: Date
  rawTranscription: string
  recipeName: string
  sinhaleseRecipeName: string
  englishIngredients: string[]
  englishInstructions: string[]
  sinhaleseIngredients: string[]
  sinhaleseInstructions: string[]
  audioBlob?: Blob
  processingTime?: number
}

export interface AudioRecording {
  blob: Blob
  duration: number
  size: number
  mimeType: string
}

export interface TranscriptionResponse {
  text: string
  confidence?: number
  language?: string
  duration?: number
}

export interface ProcessingResponse {
  recipeName: string
  sinhaleseRecipeName: string
  englishIngredients: string[]
  englishInstructions: string[]
  sinhaleseIngredients: string[]
  sinhaleseInstructions: string[]
  processingTime: number
}

export interface ApiError {
  message: string
  code?: string
  status?: number
  details?: any
}

export type RecordingState = 'idle' | 'recording' | 'processing' | 'completed' | 'error'

export interface RecordingSession {
  state: RecordingState
  startTime?: Date
  endTime?: Date
  duration?: number
  error?: ApiError
}

export interface AppConfig {
  groqApiKey: string
  groqApiBaseUrl: string
  maxRecordingDuration: number
  audioSampleRate: number
  audioChannels: number
}

export interface AudioVisualizerData {
  frequencyData: Uint8Array
  timeData: Uint8Array
  volume: number
}

// Groq API Types
export interface GroqTranscriptionRequest {
  file: Blob
  model: string
  language?: string
  prompt?: string
  response_format?: 'json' | 'text' | 'srt' | 'verbose_json' | 'vtt'
  temperature?: number
}

export interface GroqChatRequest {
  messages: GroqMessage[]
  model: string
  temperature?: number
  max_tokens?: number
  top_p?: number
  stream?: boolean
}

export interface GroqMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface GroqChatResponse {
  id: string
  object: string
  created: number
  model: string
  choices: GroqChoice[]
  usage: GroqUsage
}

export interface GroqChoice {
  index: number
  message: GroqMessage
  finish_reason: string
}

export interface GroqUsage {
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
}

// UI Component Props
export interface RecordingButtonProps {
  isRecording: boolean
  isProcessing: boolean
  onStartRecording: () => void
  onStopRecording: () => void
  disabled?: boolean
}

export interface AudioVisualizerProps {
  isActive: boolean
  audioData?: AudioVisualizerData
  className?: string
}

export interface ResultsDisplayProps {
  recipeData: RecipeData
  isLoading: boolean
  onNewRecording: () => void
  onCopyText: (text: string, section: string) => void
}

export interface ErrorMessageProps {
  error: ApiError
  onRetry?: () => void
  onDismiss?: () => void
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>
}

export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
