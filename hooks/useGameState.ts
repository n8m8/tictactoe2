import { useReducer, useCallback } from 'react'
import { gameReducer } from '@/lib/game-state'
import { createInitialGameState } from '@/lib/game-rules'
import type { GameState, GameAction, Player } from '@/types/game'

export interface UseGameStateReturn {
  gameState: GameState
  dispatch: (action: GameAction) => void
  resetGame: (startingPlayer?: Player) => void
}

/**
 * React hook for managing game state with reducer
 */
export function useGameState(
  initialPlayer: Player = 'X'
): UseGameStateReturn {
  const [gameState, dispatch] = useReducer(
    gameReducer,
    createInitialGameState(initialPlayer)
  )

  const resetGame = useCallback((startingPlayer: Player = 'X') => {
    dispatch({
      type: 'RESET_GAME',
      startingPlayer,
    })
  }, [])

  return {
    gameState,
    dispatch,
    resetGame,
  }
}
