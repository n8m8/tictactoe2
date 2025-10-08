'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MainBoard } from '@/components/game/MainBoard'
import { GameOverlay } from '@/components/game/GameOverlay'
import { Button } from '@/components/ui/Button'
import { useGameState } from '@/hooks/useGameState'
import { AIOpponent, AIDifficulty } from '@/lib/ai-opponent'
import { isValidMove } from '@/lib/game-rules'
import type { Player } from '@/types/game'

export default function SinglePlayerPage() {
  const router = useRouter()
  const [difficulty, setDifficulty] = useState<AIDifficulty | null>(null)
  const [aiOpponent, setAiOpponent] = useState<AIOpponent | null>(null)
  const [isAiThinking, setIsAiThinking] = useState(false)

  const myPlayer: Player = 'X'
  const aiPlayer: Player = 'O'

  const { gameState, dispatch, resetGame } = useGameState(myPlayer)

  // Initialize AI when difficulty is selected
  useEffect(() => {
    if (difficulty) {
      setAiOpponent(new AIOpponent(difficulty, aiPlayer))
    }
  }, [difficulty])

  // AI makes a move when it's their turn
  useEffect(() => {
    if (
      gameState.gamePhase === 'playing' &&
      gameState.currentTurn === aiPlayer &&
      aiOpponent &&
      !isAiThinking
    ) {
      setIsAiThinking(true)

      // Add a slight delay to make AI feel more natural
      setTimeout(() => {
        const move = aiOpponent.getMove(gameState.mainBoard)

        if (move) {
          dispatch({
            type: 'MAKE_MOVE',
            miniGameIndex: move.miniGameIndex,
            cellIndex: move.cellIndex,
            player: aiPlayer,
          })
        }

        setIsAiThinking(false)
      }, 500)
    }
  }, [gameState, aiOpponent, isAiThinking, aiPlayer, dispatch])

  // Handle player move
  const handleMove = (miniGameIndex: number, cellIndex: number) => {
    if (gameState.currentTurn !== myPlayer || isAiThinking) {
      return
    }

    if (
      !isValidMove(
        gameState.mainBoard,
        miniGameIndex,
        cellIndex,
        gameState.currentTurn
      )
    ) {
      return
    }

    dispatch({
      type: 'MAKE_MOVE',
      miniGameIndex,
      cellIndex,
      player: myPlayer,
    })
  }

  // Handle play again
  const handlePlayAgain = () => {
    resetGame('X')
  }

  // Handle quit
  const handleQuit = () => {
    setDifficulty(null)
    setAiOpponent(null)
    resetGame('X')
  }

  // Handle back to menu
  const handleBackToMenu = () => {
    router.push('/')
  }

  // Difficulty selection screen
  if (!difficulty) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-5xl font-marker text-whiteboard-marker-black mb-2">
              Single Player
            </h1>
            <p className="text-lg font-handwritten text-whiteboard-marker-black/70">
              Choose your difficulty
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => setDifficulty('easy')}
              className="w-full"
              variant="primary"
            >
              Easy - Random Moves
            </Button>

            <Button
              onClick={() => setDifficulty('medium')}
              className="w-full"
              variant="secondary"
            >
              Medium - Defensive Play
            </Button>

            <Button
              onClick={() => setDifficulty('hard')}
              className="w-full"
              variant="outline"
            >
              Hard - Strategic AI
            </Button>
          </div>

          <Button onClick={handleBackToMenu} variant="outline" className="w-full">
            Back to Menu
          </Button>
        </div>
      </main>
    )
  }

  // Game screen
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-marker text-whiteboard-marker-black">
              Single Player
            </h1>
            <p className="text-lg font-handwritten text-whiteboard-marker-black/70">
              Difficulty: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </p>
          </div>

          {/* AI status */}
          <div className="text-right">
            <p className="text-lg font-handwritten text-whiteboard-marker-black/70">
              {isAiThinking ? '🤔 AI is thinking...' : ''}
            </p>
          </div>
        </div>

        {/* Game board */}
        <div className="flex justify-center">
          <MainBoard
            mainBoard={gameState.mainBoard}
            currentTurn={gameState.currentTurn}
            onMove={handleMove}
            isPlayable={gameState.gamePhase === 'playing' && !isAiThinking}
          />
        </div>

        {/* Score display */}
        <div className="flex justify-center gap-8 font-handwritten text-lg">
          <div className="text-center">
            <p className="text-whiteboard-marker-blue">You (X)</p>
            <p className="text-3xl font-marker">{gameState.hostScore}</p>
          </div>
          <div className="text-center">
            <p className="text-whiteboard-marker-red">AI (O)</p>
            <p className="text-3xl font-marker">{gameState.guestScore}</p>
          </div>
          <div className="text-center">
            <p className="text-whiteboard-marker-black/70">Draws</p>
            <p className="text-3xl font-marker">{gameState.drawCount}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Button onClick={handleQuit} variant="outline">
            Change Difficulty
          </Button>
          <Button onClick={handleBackToMenu} variant="outline">
            Back to Menu
          </Button>
        </div>
      </div>

      {/* Game over overlay */}
      <GameOverlay
        winner={gameState.winner}
        onPlayAgain={handlePlayAgain}
        onQuit={handleBackToMenu}
        hostScore={gameState.hostScore}
        guestScore={gameState.guestScore}
        drawCount={gameState.drawCount}
      />
    </main>
  )
}
