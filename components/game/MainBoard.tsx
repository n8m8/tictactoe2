import React from 'react'
import { MiniGame } from './MiniGame'
import type { MainBoard as MainBoardType, Player } from '@/types/game'

interface MainBoardProps {
  mainBoard: MainBoardType
  currentTurn: Player
  onMove: (miniGameIndex: number, cellIndex: number) => void
  isPlayable?: boolean
}

export function MainBoard({
  mainBoard,
  currentTurn,
  onMove,
  isPlayable = true,
}: MainBoardProps) {
  const { miniGames, activeMiniGame } = mainBoard

  const handleCellClick = (miniGameIndex: number, cellIndex: number) => {
    if (!isPlayable) return
    onMove(miniGameIndex, cellIndex)
  }

  const isMiniGameActive = (index: number): boolean => {
    // If no active mini-game constraint, all incomplete mini-games are active
    if (activeMiniGame === null) {
      return !miniGames[index].isComplete
    }
    // Otherwise, only the specified mini-game is active
    return activeMiniGame === index
  }

  const isMiniGamePlayable = (index: number): boolean => {
    if (!isPlayable) return false
    return isMiniGameActive(index)
  }

  return (
    <div className="game-grid">
      {miniGames.map((miniGame, index) => (
        <div key={index} className="relative">
          <MiniGame
            miniGame={miniGame}
            onCellClick={(cellIndex) => handleCellClick(index, cellIndex)}
            isActive={isMiniGameActive(index)}
            isPlayable={isMiniGamePlayable(index)}
          />
        </div>
      ))}

      {/* Current turn indicator */}
      {isPlayable && (
        <div className="absolute -top-16 left-0 right-0 text-center">
          <p className="text-2xl font-marker text-whiteboard-marker-black">
            Current Turn:{' '}
            <span
              className={
                currentTurn === 'X'
                  ? 'text-whiteboard-marker-blue'
                  : 'text-whiteboard-marker-red'
              }
            >
              {currentTurn}
            </span>
          </p>
        </div>
      )}
    </div>
  )
}
