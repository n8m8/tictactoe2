import React from 'react'
import type { MiniGame as MiniGameType, Player, CellState } from '@/types/game'

interface MiniGameProps {
  miniGame: MiniGameType
  onCellClick?: (cellIndex: number) => void
  isActive?: boolean
  isPlayable?: boolean
}

export function MiniGame({
  miniGame,
  onCellClick,
  isActive = false,
  isPlayable = true,
}: MiniGameProps) {
  const { cells, winner, isComplete } = miniGame

  const getCellContent = (cell: CellState): string => {
    if (cell === 'X' || cell === 'O') return cell
    return ''
  }

  const getCellClasses = (cell: CellState, index: number): string => {
    const baseClasses = 'game-cell relative transition-all duration-200'
    const classes = [baseClasses]

    // Cell state classes with animations
    if (cell === 'X') {
      classes.push('text-whiteboard-marker-blue animate-drawX')
    }
    if (cell === 'O') {
      classes.push('text-whiteboard-marker-red animate-drawO')
    }

    // Disabled if mini-game is complete or not playable
    const isDisabled = isComplete || !isPlayable || cell !== null
    if (isDisabled) {
      classes.push('cursor-not-allowed opacity-50')
    } else {
      classes.push('cursor-pointer hover:bg-whiteboard-grid hover:scale-105')
    }

    return classes.join(' ')
  }

  const getMiniGameClasses = (): string => {
    const baseClasses = 'mini-game-grid relative'
    const classes = [baseClasses]

    // Active mini-game highlight
    if (isActive && !isComplete) {
      classes.push('ring-4 ring-whiteboard-marker-blue ring-opacity-50')
    }

    // Completed mini-game overlay
    if (isComplete) {
      classes.push('opacity-75')
    }

    return classes.join(' ')
  }

  const handleCellClick = (index: number) => {
    if (!onCellClick || !isPlayable || isComplete || cells[index] !== null) {
      return
    }
    onCellClick(index)
  }

  return (
    <div className={getMiniGameClasses()}>
      {/* Cells */}
      {cells.map((cell, index) => (
        <button
          key={index}
          className={getCellClasses(cell, index)}
          onClick={() => handleCellClick(index)}
          disabled={!isPlayable || isComplete || cell !== null}
          aria-label={`Mini game ${miniGame.position}, cell ${index}`}
        >
          {getCellContent(cell)}
        </button>
      ))}

      {/* Winner overlay */}
      {winner && (
        <div className="absolute inset-0 flex items-center justify-center bg-whiteboard-bg/80 pointer-events-none animate-fadeIn">
          <span
            className={`text-6xl font-marker animate-pulseCell ${
              winner === 'X'
                ? 'text-whiteboard-marker-blue'
                : winner === 'O'
                ? 'text-whiteboard-marker-red'
                : 'text-whiteboard-marker-black/50'
            }`}
          >
            {winner === 'draw' ? '—' : winner}
          </span>
        </div>
      )}
    </div>
  )
}
