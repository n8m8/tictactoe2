'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { SignalingClient } from '@/lib/signaling-client'

export default function JoinPage() {
  const router = useRouter()
  const [joinCode, setJoinCode] = useState('')
  const [isJoining, setIsJoining] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleJoinCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Auto-uppercase and limit to 6 characters
    const value = e.target.value.toUpperCase().slice(0, 6)
    setJoinCode(value)
    setError(null)
  }

  const joinRoom = async () => {
    if (joinCode.length !== 6) {
      setError('Join code must be 6 characters')
      return
    }

    setIsJoining(true)
    setError(null)

    try {
      const signalingClient = new SignalingClient()
      const peerId = generatePeerId()
      const response = await signalingClient.joinRoom(joinCode, peerId)

      // Store guest info in session storage
      sessionStorage.setItem('peerId', peerId)
      sessionStorage.setItem('joinCode', response.joinCode)
      sessionStorage.setItem('isHost', 'false')

      // Navigate to game
      router.push('/game')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join room')
    } finally {
      setIsJoining(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      joinRoom()
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-marker text-whiteboard-marker-black mb-2">
            Join Game
          </h1>
          <p className="text-lg font-handwritten text-whiteboard-marker-black/70">
            Enter the 6-character join code
          </p>
        </div>

        {/* Join code input */}
        <div className="space-y-4">
          <Input
            label="Join Code"
            value={joinCode}
            onChange={handleJoinCodeChange}
            onKeyPress={handleKeyPress}
            placeholder="ABC123"
            maxLength={6}
            error={error || undefined}
            disabled={isJoining}
            autoFocus
          />
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={joinRoom}
            disabled={joinCode.length !== 6 || isJoining}
            className="w-full"
          >
            {isJoining ? 'Joining...' : 'Join Game'}
          </Button>

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
          <p>Ask your friend for the join code</p>
          <p className="mt-2">You will be Player O (Red)</p>
        </div>
      </div>
    </main>
  )
}

function generatePeerId(): string {
  return `peer-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}
