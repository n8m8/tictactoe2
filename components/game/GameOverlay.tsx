import React from 'react'
import { Button } from '@/components/ui/Button'
import type { Player } from '@/types/game'

interface GameOverlayProps {
  winner: Player | 'draw' | null
  onPlayAgain?: () => void
  onQuit?: () => void
  hostScore?: number
  guestScore?: number
  drawCount?: number
}

export function GameOverlay({
  winner,
  onPlayAgain,
  onQuit,
  hostScore = 0,
  guestScore = 0,
  drawCount = 0,
}: GameOverlayProps) {
  if (!winner) return null

  const getWinnerMessage = (): string => {
    if (winner === 'draw') {
      return "It's a Draw!"
    }
    return `Player ${winner} Wins!`
  }

  const getWinnerColor = (): string => {
    if (winner === 'X') return 'text-whiteboard-marker-blue'
    if (winner === 'O') return 'text-whiteboard-marker-red'
    return 'text-whiteboard-marker-black'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-whiteboard-bg rounded-lg shadow-marker p-8 max-w-md w-full mx-4">
        {/* Winner announcement */}
        <div className="text-center mb-6">
          <h2
            className={`text-5xl md:text-6xl font-marker mb-4 ${getWinnerColor()}`}
          >
            {getWinnerMessage()}
          </h2>

          {/* Session scores */}
          <div className="space-y-2 font-handwritten text-lg">
            <div className="flex justify-between items-center px-4">
              <span className="text-whiteboard-marker-blue">Player X:</span>
              <span className="font-marker text-2xl">{hostScore}</span>
            </div>
            <div className="flex justify-between items-center px-4">
              <span className="text-whiteboard-marker-red">Player O:</span>
              <span className="font-marker text-2xl">{guestScore}</span>
            </div>
            {drawCount > 0 && (
              <div className="flex justify-between items-center px-4">
                <span className="text-whiteboard-marker-black/70">Draws:</span>
                <span className="font-marker text-2xl">{drawCount}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {onPlayAgain && (
            <Button onClick={onPlayAgain} className="w-full">
              Play Again
            </Button>
          )}
          {onQuit && (
            <Button onClick={onQuit} variant="outline" className="w-full">
              Quit to Menu
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
