import { ref, computed } from 'vue'
import type { AudioRecording } from '@/types'

export function useAudioRecorder() {
  const mediaRecorder = ref<MediaRecorder | null>(null)
  const audioStream = ref<MediaStream | null>(null)
  const audioChunks = ref<Blob[]>([])
  const isRecording = ref(false)
  const recordingStartTime = ref<Date | null>(null)

  // Check if audio recording is supported
  const isSupported = computed(() => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder)
  })

  // Request microphone permissions
  const requestPermissions = async (): Promise<void> => {
    if (!isSupported.value) {
      throw new Error('Audio recording is not supported in this browser')
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000,
          channelCount: 1
        }
      })
      
      // Test that we can create a MediaRecorder
      const testRecorder = new MediaRecorder(stream)
      testRecorder.stop()
      stream.getTracks().forEach(track => track.stop())
      
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          throw new Error('Microphone permission denied. Please allow microphone access and try again.')
        } else if (error.name === 'NotFoundError') {
          throw new Error('No microphone found. Please connect a microphone and try again.')
        } else if (error.name === 'NotReadableError') {
          throw new Error('Microphone is already in use by another application.')
        }
      }
      throw new Error('Failed to access microphone. Please check your browser settings.')
    }
  }

  // Start recording
  const startRecording = async (): Promise<void> => {
    if (!isSupported.value) {
      throw new Error('Audio recording is not supported')
    }

    try {
      // Get audio stream
      audioStream.value = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000,
          channelCount: 1
        }
      })

      // Clear previous chunks
      audioChunks.value = []

      // Create MediaRecorder
      const mimeType = getSupportedMimeType()
      mediaRecorder.value = new MediaRecorder(audioStream.value, {
        mimeType,
        audioBitsPerSecond: 128000
      })

      // Set up event handlers
      mediaRecorder.value.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.value.push(event.data)
        }
      }

      mediaRecorder.value.onerror = (event) => {
        console.error('MediaRecorder error:', event)
        throw new Error('Recording failed due to an internal error')
      }

      // Start recording
      recordingStartTime.value = new Date()
      mediaRecorder.value.start(1000) // Collect data every second
      isRecording.value = true

    } catch (error) {
      // Clean up on error
      stopAudioStream()
      throw error
    }
  }

  // Stop recording
  const stopRecording = async (): Promise<AudioRecording | null> => {
    if (!mediaRecorder.value || !isRecording.value) {
      return null
    }

    return new Promise((resolve, reject) => {
      if (!mediaRecorder.value) {
        reject(new Error('No active recording'))
        return
      }

      mediaRecorder.value.onstop = () => {
        try {
          const mimeType = mediaRecorder.value?.mimeType || 'audio/webm'
          const audioBlob = new Blob(audioChunks.value, { type: mimeType })
          
          const endTime = new Date()
          const duration = recordingStartTime.value 
            ? (endTime.getTime() - recordingStartTime.value.getTime()) / 1000
            : 0

          const recording: AudioRecording = {
            blob: audioBlob,
            duration,
            size: audioBlob.size,
            mimeType
          }

          // Clean up
          cleanup()
          resolve(recording)
        } catch (error) {
          cleanup()
          reject(error)
        }
      }

      mediaRecorder.value.onerror = (event) => {
        cleanup()
        reject(new Error('Failed to stop recording'))
      }

      // Stop the recorder
      mediaRecorder.value.stop()
      isRecording.value = false
    })
  }

  // Get supported MIME type for recording
  const getSupportedMimeType = (): string => {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/ogg;codecs=opus',
      'audio/ogg'
    ]

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type
      }
    }

    return 'audio/webm' // Fallback
  }

  // Stop audio stream
  const stopAudioStream = () => {
    if (audioStream.value) {
      audioStream.value.getTracks().forEach(track => track.stop())
      audioStream.value = null
    }
  }

  // Clean up resources
  const cleanup = () => {
    stopAudioStream()
    mediaRecorder.value = null
    audioChunks.value = []
    recordingStartTime.value = null
    isRecording.value = false
  }

  // Convert audio blob to different format if needed
  const convertAudioFormat = async (blob: Blob, targetMimeType: string): Promise<Blob> => {
    // For now, return the original blob
    // In a production app, you might want to implement audio conversion
    return blob
  }

  // Get audio duration from blob
  const getAudioDuration = async (blob: Blob): Promise<number> => {
    return new Promise((resolve, reject) => {
      const audio = new Audio()
      const url = URL.createObjectURL(blob)
      
      audio.addEventListener('loadedmetadata', () => {
        URL.revokeObjectURL(url)
        resolve(audio.duration)
      })
      
      audio.addEventListener('error', () => {
        URL.revokeObjectURL(url)
        reject(new Error('Failed to load audio metadata'))
      })
      
      audio.src = url
    })
  }

  return {
    // State
    isRecording: computed(() => isRecording.value),
    isSupported,
    
    // Methods
    requestPermissions,
    startRecording,
    stopRecording,
    cleanup,
    convertAudioFormat,
    getAudioDuration
  }
}
