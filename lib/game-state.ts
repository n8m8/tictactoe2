import type { GameState, GameAction, Player, MoveResult } from '@/types/game'
import {
  checkMiniGameWin,
  checkMainBoardWin,
  isMiniGameDraw,
  isGameDraw,
  createInitialGameState,
} from './game-rules'

/**
 * Game state reducer - pure function for state management
 */
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'MAKE_MOVE': {
      const { miniGameIndex, cellIndex, player } = action

      // Clone the state
      const newState = JSON.parse(JSON.stringify(state)) as GameState

      // Update the cell
      const miniGame = newState.mainBoard.miniGames[miniGameIndex]
      miniGame.cells[cellIndex] = player

      // Check if this move won the mini-game
      const miniGameWinner = checkMiniGameWin(miniGame)
      let resultingState: MoveResult = 'continue'

      if (miniGameWinner) {
        miniGame.winner = miniGameWinner
        miniGame.isComplete = true
        newState.mainBoard.state[miniGameIndex] = miniGameWinner
        resultingState = 'mini-win'

        // Check if this won the overall game
        const gameWinner = checkMainBoardWin(newState.mainBoard)
        if (gameWinner) {
          newState.winner = gameWinner
          newState.gamePhase = 'ended'
          resultingState = 'game-win'
        } else if (isGameDraw(newState.mainBoard)) {
          newState.winner = 'draw'
          newState.gamePhase = 'ended'
          resultingState = 'game-draw'
        }
      } else if (isMiniGameDraw(miniGame.cells)) {
        miniGame.winner = 'draw'
        miniGame.isComplete = true
        newState.mainBoard.state[miniGameIndex] = 'draw'
        resultingState = 'mini-draw'

        // Check for overall draw
        if (isGameDraw(newState.mainBoard)) {
          newState.winner = 'draw'
          newState.gamePhase = 'ended'
          resultingState = 'game-draw'
        }
      }

      // Add move to history
      newState.moveHistory.push({
        seq: state.moveHistory.length + 1,
        player,
        miniGameIndex: miniGameIndex as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
        cellIndex: cellIndex as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
        timestamp: Date.now(),
        resultingState,
      })

      // Switch turns (unless game ended)
      if (newState.gamePhase === 'playing') {
        newState.currentTurn = player === 'X' ? 'O' : 'X'
      }

      return newState
    }

    case 'RESET_GAME': {
      const { startingPlayer } = action
      const newState = createInitialGameState(startingPlayer)

      // Preserve scores
      newState.hostScore = state.hostScore
      newState.guestScore = state.guestScore
      newState.drawCount = state.drawCount

      return newState
    }

    case 'SYNC_STATE': {
      // Replace entire state (used for P2P sync)
      return action.state
    }

    case 'SET_WINNER': {
      return {
        ...state,
        winner: action.winner,
        gamePhase: 'ended',
      }
    }

    case 'INCREMENT_SCORE': {
      const newState = { ...state }
      if (action.player === 'X') {
        newState.hostScore += 1
      } else if (action.player === 'O') {
        newState.guestScore += 1
      } else {
        newState.drawCount += 1
      }
      return newState
    }

    default:
      return state
  }
}

/**
 * Get the opposite player
 */
export function getOpponent(player: Player): Player {
  return player === 'X' ? 'O' : 'X'
}
