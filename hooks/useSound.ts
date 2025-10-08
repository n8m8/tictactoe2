import { useEffect, useRef, useState } from 'react'

export type SoundType =
  | 'move'
  | 'win-mini'
  | 'win-game'
  | 'draw'
  | 'button-click'
  | 'error'

/**
 * Hook for playing sound effects
 * Sound files should be placed in /public/sounds/
 */
export function useSound() {
  const [isMuted, setIsMuted] = useState(false)
  const audioContextRef = useRef<Map<SoundType, HTMLAudioElement>>(new Map())

  useEffect(() => {
    // Check if sound is enabled in localStorage
    const soundEnabled = localStorage.getItem('soundEnabled')
    if (soundEnabled === 'false') {
      setIsMuted(true)
    }
  }, [])

  const play = (sound: SoundType) => {
    if (isMuted) return

    try {
      // Check if audio file exists (in production, these would be real files)
      const soundFile = `/sounds/${sound}.mp3`

      // Try to get cached audio element
      let audio = audioContextRef.current.get(sound)

      if (!audio) {
        audio = new Audio(soundFile)
        audioContextRef.current.set(sound, audio)
      }

      // Reset and play
      audio.currentTime = 0
      audio.play().catch((error) => {
        // Silently fail if sound can't play (e.g., no file, browser restrictions)
        console.warn(`Failed to play sound: ${sound}`, error)
      })
    } catch (error) {
      console.warn(`Sound error:`, error)
    }
  }

  const toggleMute = () => {
    const newMuted = !isMuted
    setIsMuted(newMuted)
    localStorage.setItem('soundEnabled', String(!newMuted))
  }

  return {
    play,
    isMuted,
    toggleMute,
  }
}
