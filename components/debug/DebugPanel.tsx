import React, { useState } from 'react'
import type { GameState } from '@/types/game'

interface DebugPanelProps {
  gameState: GameState
  isHost?: boolean
  connectionStatus?: string
}

export function DebugPanel({
  gameState,
  isHost,
  connectionStatus,
}: DebugPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-sm">
      {/* Toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-whiteboard-marker-black text-white px-4 py-2 rounded-t-lg font-handwritten text-sm hover:bg-whiteboard-marker-black/80 transition-colors w-full text-left"
      >
        🐛 Debug Panel {isExpanded ? '▼' : '▲'}
      </button>

      {/* Panel content */}
      {isExpanded && (
        <div className="bg-white border-4 border-whiteboard-marker-black rounded-b-lg p-4 space-y-3 max-h-96 overflow-y-auto">
          {/* Game Phase */}
          <div>
            <h4 className="font-marker text-sm text-whiteboard-marker-blue">
              Game Phase
            </h4>
            <p className="font-handwritten text-xs">{gameState.gamePhase}</p>
          </div>

          {/* Current Turn */}
          <div>
            <h4 className="font-marker text-sm text-whiteboard-marker-blue">
              Current Turn
            </h4>
            <p className="font-handwritten text-xs">
              {gameState.currentTurn} {isHost !== undefined && (isHost ? gameState.currentTurn === 'X' : gameState.currentTurn === 'O') ? '(You)' : '(Opponent)'}
            </p>
          </div>

          {/* Active Mini-Game */}
          <div>
            <h4 className="font-marker text-sm text-whiteboard-marker-blue">
              Active Mini-Game
            </h4>
            <p className="font-handwritten text-xs">
              {gameState.mainBoard.activeMiniGame !== null
                ? `#${gameState.mainBoard.activeMiniGame}`
                : 'Any incomplete mini-game'}
            </p>
          </div>

          {/* Connection Status */}
          {connectionStatus !== undefined && (
            <div>
              <h4 className="font-marker text-sm text-whiteboard-marker-blue">
                Connection
              </h4>
              <p className="font-handwritten text-xs">{connectionStatus}</p>
            </div>
          )}

          {/* Move Count */}
          <div>
            <h4 className="font-marker text-sm text-whiteboard-marker-blue">
              Total Moves
            </h4>
            <p className="font-handwritten text-xs">
              {gameState.moveHistory.length}
            </p>
          </div>

          {/* Scores */}
          <div>
            <h4 className="font-marker text-sm text-whiteboard-marker-blue">
              Session Scores
            </h4>
            <p className="font-handwritten text-xs">
              X: {gameState.hostScore} | O: {gameState.guestScore} | Draws:{' '}
              {gameState.drawCount}
            </p>
          </div>

          {/* Mini-Game States */}
          <div>
            <h4 className="font-marker text-sm text-whiteboard-marker-blue">
              Mini-Game States
            </h4>
            <div className="grid grid-cols-3 gap-1 text-xs font-handwritten">
              {gameState.mainBoard.miniGames.map((mini, idx) => (
                <div
                  key={idx}
                  className={`border border-whiteboard-grid p-1 rounded text-center ${
                    mini.isComplete ? 'bg-whiteboard-grid/30' : ''
                  }`}
                >
                  {idx}: {mini.winner || 'Playing'}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Moves */}
          <div>
            <h4 className="font-marker text-sm text-whiteboard-marker-blue">
              Last 5 Moves
            </h4>
            <div className="space-y-1">
              {gameState.moveHistory
                .slice(-5)
                .reverse()
                .map((move, idx) => (
                  <div
                    key={move.seq}
                    className="text-xs font-handwritten border-l-2 border-whiteboard-grid pl-2"
                  >
                    #{move.seq}: {move.player} → Mini {move.miniGameIndex}, Cell{' '}
                    {move.cellIndex}
                    {move.resultingState !== 'continue' && (
                      <span className="text-whiteboard-marker-blue">
                        {' '}
                        ({move.resultingState})
                      </span>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
