'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

export default function OptionsPage() {
  const router = useRouter()
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [debugMode, setDebugMode] = useState(false)

  // Load settings from localStorage
  useEffect(() => {
    const savedSound = localStorage.getItem('soundEnabled')
    const savedDebug = localStorage.getItem('debugMode')

    if (savedSound !== null) {
      setSoundEnabled(savedSound === 'true')
    }
    if (savedDebug !== null) {
      setDebugMode(savedDebug === 'true')
    }
  }, [])

  const toggleSound = () => {
    const newValue = !soundEnabled
    setSoundEnabled(newValue)
    localStorage.setItem('soundEnabled', String(newValue))
  }

  const toggleDebug = () => {
    const newValue = !debugMode
    setDebugMode(newValue)
    localStorage.setItem('debugMode', String(newValue))
  }

  const resetSettings = () => {
    setSoundEnabled(true)
    setDebugMode(false)
    localStorage.setItem('soundEnabled', 'true')
    localStorage.setItem('debugMode', 'false')
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-5xl font-marker text-whiteboard-marker-black mb-2">
            Options
          </h1>
          <p className="text-lg font-handwritten text-whiteboard-marker-black/70">
            Customize your game experience
          </p>
        </div>

        {/* Settings */}
        <div className="bg-white border-4 border-whiteboard-grid rounded-lg p-6 space-y-6">
          {/* Sound Setting */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-marker text-whiteboard-marker-black">
                Sound Effects
              </h3>
              <p className="text-sm font-handwritten text-whiteboard-marker-black/70">
                Play sounds during gameplay
              </p>
            </div>
            <button
              onClick={toggleSound}
              className={`w-14 h-8 rounded-full transition-colors duration-200 relative ${
                soundEnabled
                  ? 'bg-whiteboard-marker-blue'
                  : 'bg-whiteboard-grid'
              }`}
              aria-label={`Sound ${soundEnabled ? 'enabled' : 'disabled'}`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform duration-200 ${
                  soundEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Debug Mode Setting */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-marker text-whiteboard-marker-black">
                Debug Mode
              </h3>
              <p className="text-sm font-handwritten text-whiteboard-marker-black/70">
                Show game state and move history
              </p>
            </div>
            <button
              onClick={toggleDebug}
              className={`w-14 h-8 rounded-full transition-colors duration-200 relative ${
                debugMode
                  ? 'bg-whiteboard-marker-blue'
                  : 'bg-whiteboard-grid'
              }`}
              aria-label={`Debug mode ${debugMode ? 'enabled' : 'disabled'}`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform duration-200 ${
                  debugMode ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="pt-4 border-t-2 border-whiteboard-grid">
            <Button onClick={resetSettings} variant="outline" className="w-full">
              Reset to Defaults
            </Button>
          </div>
        </div>

        {/* Info */}
        <div className="bg-whiteboard-marker-blue/10 border-2 border-whiteboard-marker-blue rounded-lg p-4">
          <p className="text-sm font-handwritten text-whiteboard-marker-blue">
            💡 Debug mode shows detailed game information during play. Useful for
            understanding game mechanics or troubleshooting.
          </p>
        </div>

        {/* Back Button */}
        <Button onClick={() => router.push('/')} variant="outline" className="w-full">
          Back to Menu
        </Button>
      </div>
    </main>
  )
}
