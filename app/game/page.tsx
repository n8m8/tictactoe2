'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { MainBoard } from '@/components/game/MainBoard'
import { GameOverlay } from '@/components/game/GameOverlay'
import { Button } from '@/components/ui/Button'
import { useGameState } from '@/hooks/useGameState'
import { useP2PConnection } from '@/hooks/useP2PConnection'
import type { P2PMessage } from '@/types/signaling'
import type { Player } from '@/types/game'
import { isValidMove } from '@/lib/game-rules'

export default function GamePage() {
  const router = useRouter()
  const [isHost, setIsHost] = useState(false)
  const [joinCode, setJoinCode] = useState<string | null>(null)
  const [peerId, setPeerId] = useState<string | null>(null)
  const [myPlayer, setMyPlayer] = useState<Player>('X')
  const [connectionReady, setConnectionReady] = useState(false)

  const { gameState, dispatch, resetGame } = useGameState('X')

  // Load session info
  useEffect(() => {
    const storedPeerId = sessionStorage.getItem('peerId')
    const storedJoinCode = sessionStorage.getItem('joinCode')
    const storedIsHost = sessionStorage.getItem('isHost') === 'true'

    if (!storedPeerId || !storedJoinCode) {
      router.push('/')
      return
    }

    setPeerId(storedPeerId)
    setJoinCode(storedJoinCode)
    setIsHost(storedIsHost)
    setMyPlayer(storedIsHost ? 'X' : 'O')
  }, [router])

  // Handle incoming P2P messages
  const handleMessage = useCallback(
    (message: P2PMessage) => {
      if (message.type === 'game-action') {
        dispatch(message.action)
      } else if (message.type === 'chat') {
        // TODO: Handle chat messages in future version
        // Chat functionality not yet implemented
      }
    },
    [dispatch]
  )

  // P2P connection
  const { status, sendAction, disconnect } = useP2PConnection({
    isHost,
    joinCode: joinCode || '',
    peerId: peerId || '',
    onMessage: handleMessage,
    enabled: !!peerId && !!joinCode,
  })

  // Update connection ready state
  useEffect(() => {
    setConnectionReady(status === 'connected')
  }, [status])

  // Handle move
  const handleMove = (miniGameIndex: number, cellIndex: number) => {
    // Check if it's my turn
    if (gameState.currentTurn !== myPlayer) {
      return
    }

    // Validate move
    const moveValidation = isValidMove(gameState, {
      seq: gameState.moveHistory.length + 1,
      player: myPlayer,
      miniGameIndex: miniGameIndex as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
      cellIndex: cellIndex as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
      timestamp: Date.now(),
      resultingState: 'continue',
    })

    if (!moveValidation.valid) {
      return
    }

    // Create action
    const action = {
      type: 'MAKE_MOVE' as const,
      miniGameIndex,
      cellIndex,
      player: myPlayer,
    }

    // Apply locally
    dispatch(action)

    // Send to peer
    sendAction(action)
  }

  // Handle play again
  const handlePlayAgain = () => {
    // Increment score for the winner
    if (gameState.winner) {
      dispatch({
        type: 'INCREMENT_SCORE',
        player: gameState.winner,
      })

      // Send score increment to peer
      sendAction({
        type: 'INCREMENT_SCORE',
        player: gameState.winner,
      })
    }

    // Determine starting player (alternate from previous game)
    const startingPlayer = gameState.winner === 'X' ? 'O' : 'X'

    // Reset locally (this preserves scores)
    resetGame(startingPlayer)

    // Send reset to peer
    sendAction({
      type: 'RESET_GAME',
      startingPlayer,
    })
  }

  // Handle quit
  const handleQuit = () => {
    disconnect()
    sessionStorage.clear()
    router.push('/')
  }

  // Show loading if not ready
  if (!peerId || !joinCode) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-handwritten">Loading...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-marker text-whiteboard-marker-black">
              Ultimate Tic Tac Toe
            </h1>
            <p className="text-lg font-handwritten text-whiteboard-marker-black/70">
              You are Player {myPlayer} (
              {myPlayer === 'X' ? 'Blue' : 'Red'})
            </p>
          </div>

          {/* Connection status */}
          <div className="text-right">
            <p className="text-sm font-handwritten text-whiteboard-marker-black/70">
              Join Code: <span className="font-marker">{joinCode}</span>
            </p>
            <p
              className={`text-sm font-handwritten ${
                connectionReady
                  ? 'text-whiteboard-marker-green'
                  : 'text-whiteboard-marker-red'
              }`}
            >
              {connectionReady ? '● Connected' : '○ Connecting...'}
            </p>
          </div>
        </div>

        {/* Game board */}
        <div className="flex justify-center">
          <MainBoard
            mainBoard={gameState.mainBoard}
            currentTurn={gameState.currentTurn}
            onMove={handleMove}
            isPlayable={connectionReady && gameState.gamePhase === 'playing'}
          />
        </div>

        {/* Score display */}
        <div className="flex justify-center gap-8 font-handwritten text-lg">
          <div className="text-center">
            <p className="text-whiteboard-marker-blue">Player X</p>
            <p className="text-3xl font-marker">{gameState.hostScore}</p>
          </div>
          <div className="text-center">
            <p className="text-whiteboard-marker-red">Player O</p>
            <p className="text-3xl font-marker">{gameState.guestScore}</p>
          </div>
          <div className="text-center">
            <p className="text-whiteboard-marker-black/70">Draws</p>
            <p className="text-3xl font-marker">{gameState.drawCount}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center">
          <Button onClick={handleQuit} variant="outline">
            Quit to Menu
          </Button>
        </div>
      </div>

      {/* Game over overlay */}
      <GameOverlay
        winner={gameState.winner}
        onPlayAgain={handlePlayAgain}
        onQuit={handleQuit}
        hostScore={gameState.hostScore}
        guestScore={gameState.guestScore}
        drawCount={gameState.drawCount}
      />
    </main>
  )
}
