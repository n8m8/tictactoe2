'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { SignalingClient } from '@/lib/signaling-client'

export default function HostPage() {
  const router = useRouter()
  const [joinCode, setJoinCode] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Auto-create room on mount
    createRoom()
  }, [])

  const createRoom = async () => {
    setIsCreating(true)
    setError(null)

    try {
      const signalingClient = new SignalingClient()
      const peerId = generatePeerId()
      const response = await signalingClient.createRoom(peerId)

      setJoinCode(response.joinCode)

      // Store host info in session storage
      sessionStorage.setItem('peerId', peerId)
      sessionStorage.setItem('joinCode', response.joinCode)
      sessionStorage.setItem('isHost', 'true')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create room')
    } finally {
      setIsCreating(false)
    }
  }

  const copyJoinCode = async () => {
    if (!joinCode) return

    try {
      await navigator.clipboard.writeText(joinCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const startGame = () => {
    if (!joinCode) return
    router.push('/game')
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-marker text-whiteboard-marker-black mb-2">
            Host Game
          </h1>
          <p className="text-lg font-handwritten text-whiteboard-marker-black/70">
            Share the join code with your friend
          </p>
        </div>

        {/* Loading state */}
        {isCreating && (
          <div className="text-center">
            <p className="text-lg font-handwritten text-whiteboard-marker-black/70">
              Creating room...
            </p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-whiteboard-marker-red/10 border-2 border-whiteboard-marker-red rounded-lg p-4">
            <p className="text-whiteboard-marker-red font-handwritten">
              {error}
            </p>
          </div>
        )}

        {/* Join code display */}
        {joinCode && (
          <div className="space-y-4">
            <div className="bg-white border-4 border-whiteboard-grid rounded-lg p-6 text-center">
              <p className="text-sm font-handwritten text-whiteboard-marker-black/70 mb-2">
                Join Code
              </p>
              <p className="text-6xl font-marker text-whiteboard-marker-blue tracking-wider">
                {joinCode}
              </p>
            </div>

            <Button onClick={copyJoinCode} variant="outline" className="w-full">
              {copied ? '✓ Copied!' : 'Copy Join Code'}
            </Button>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          {joinCode && (
            <Button onClick={startGame} className="w-full">
              Start Game
            </Button>
          )}

          <Button
            onClick={() => router.push('/')}
            variant="outline"
            className="w-full"
          >
            Back to Menu
          </Button>
        </div>

        {/* Instructions */}
        <div className="text-center text-sm font-handwritten text-whiteboard-marker-black/50">
          <p>Waiting for your friend to join...</p>
          <p className="mt-2">You will be Player X (Blue)</p>
        </div>
      </div>
    </main>
  )
}

function generatePeerId(): string {
  return `peer-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}
