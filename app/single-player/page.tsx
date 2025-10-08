'use client'

import { useRouter } from 'next/navigation'
import { MainBoard } from '@/components/game/MainBoard'
import { GameOverlay } from '@/components/game/GameOverlay'
import { Button } from '@/components/ui/Button'
import { useGameState } from '@/hooks/useGameState'

export default function SinglePlayerPage() {
  const router = useRouter()
  const { gameState, dispatch, resetGame } = useGameState('X')

  // Handle move - alternating turns between X and O locally
  const handleMove = (miniGameIndex: number, cellIndex: number) => {
    if (gameState.gamePhase !== 'playing') {
      return
    }

    // Validate move
    const moveValidation = {
      valid:
        !gameState.mainBoard.miniGames[miniGameIndex].isComplete &&
        gameState.mainBoard.miniGames[miniGameIndex].cells[cellIndex] === null,
    }

    if (!moveValidation.valid) {
      return
    }

    // Make the move with current turn's player
    dispatch({
      type: 'MAKE_MOVE',
      miniGameIndex,
      cellIndex,
      player: gameState.currentTurn,
    })
  }

  // Handle play again
  const handlePlayAgain = () => {
    // Increment score for the winner
    if (gameState.winner) {
      dispatch({
        type: 'INCREMENT_SCORE',
        player: gameState.winner,
      })
    }

    // Determine starting player (alternate from previous game)
    const startingPlayer = gameState.winner === 'X' ? 'O' : 'X'

    // Reset game (this preserves scores)
    resetGame(startingPlayer)
  }

  // Handle back to menu
  const handleBackToMenu = () => {
    router.push('/')
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-marker text-whiteboard-marker-black">
            Local Multiplayer
          </h1>
          <p className="text-lg font-handwritten text-whiteboard-marker-black/70">
            Take turns on the same device
          </p>
        </div>

        {/* Game board */}
        <div className="flex justify-center">
          <MainBoard
            mainBoard={gameState.mainBoard}
            currentTurn={gameState.currentTurn}
            onMove={handleMove}
            isPlayable={gameState.gamePhase === 'playing'}
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
