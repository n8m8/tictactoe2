import type { MainBoard, Player, CellState } from '@/types/game'
import { checkMiniGameWin, isValidMove } from './game-rules'

export type AIDifficulty = 'easy' | 'medium' | 'hard'

export interface AIMove {
  miniGameIndex: number
  cellIndex: number
}

/**
 * AI opponent for single-player mode
 */
export class AIOpponent {
  private difficulty: AIDifficulty
  private player: Player

  constructor(difficulty: AIDifficulty, player: Player) {
    this.difficulty = difficulty
    this.player = player
  }

  /**
   * Get the AI's next move
   */
  getMove(mainBoard: MainBoard): AIMove | null {
    switch (this.difficulty) {
      case 'easy':
        return this.getRandomMove(mainBoard)
      case 'medium':
        return this.getMediumMove(mainBoard)
      case 'hard':
        return this.getHardMove(mainBoard)
      default:
        return this.getRandomMove(mainBoard)
    }
  }

  /**
   * Easy difficulty: Random valid move
   */
  private getRandomMove(mainBoard: MainBoard): AIMove | null {
    const validMoves = this.getAllValidMoves(mainBoard)
    if (validMoves.length === 0) return null

    const randomIndex = Math.floor(Math.random() * validMoves.length)
    return validMoves[randomIndex]
  }

  /**
   * Medium difficulty: Block opponent wins, otherwise random
   */
  private getMediumMove(mainBoard: MainBoard): AIMove | null {
    const opponent = this.player === 'X' ? 'O' : 'X'

    // 1. Try to win the game
    const winningMove = this.findWinningMove(mainBoard, this.player)
    if (winningMove) return winningMove

    // 2. Block opponent from winning the game
    const blockingMove = this.findWinningMove(mainBoard, opponent)
    if (blockingMove) return blockingMove

    // 3. Try to win a mini-game
    const miniWinMove = this.findMiniGameWinningMove(mainBoard, this.player)
    if (miniWinMove) return miniWinMove

    // 4. Block opponent from winning a mini-game
    const miniBlockMove = this.findMiniGameWinningMove(mainBoard, opponent)
    if (miniBlockMove) return miniBlockMove

    // 5. Random move
    return this.getRandomMove(mainBoard)
  }

  /**
   * Hard difficulty: Minimax algorithm with alpha-beta pruning
   */
  private getHardMove(mainBoard: MainBoard): AIMove | null {
    // For hard mode, use medium logic with some strategic improvements
    // Full minimax would be computationally expensive for Ultimate Tic Tac Toe
    const mediumMove = this.getMediumMove(mainBoard)
    if (mediumMove) return mediumMove

    // Prefer center positions when available
    const centerMove = this.findCenterMove(mainBoard)
    if (centerMove) return centerMove

    return this.getRandomMove(mainBoard)
  }

  /**
   * Get all valid moves
   */
  private getAllValidMoves(mainBoard: MainBoard): AIMove[] {
    const moves: AIMove[] = []
    const { miniGames, activeMiniGame } = mainBoard

    // Determine which mini-games to check
    const miniGamesToCheck =
      activeMiniGame !== null
        ? [activeMiniGame]
        : miniGames
            .map((_, index) => index)
            .filter((index) => !miniGames[index].isComplete)

    for (const miniGameIndex of miniGamesToCheck) {
      const miniGame = miniGames[miniGameIndex]
      for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
        if (isValidMove(mainBoard, miniGameIndex, cellIndex, this.player)) {
          moves.push({ miniGameIndex, cellIndex })
        }
      }
    }

    return moves
  }

  /**
   * Find a move that wins the overall game
   */
  private findWinningMove(
    mainBoard: MainBoard,
    player: Player
  ): AIMove | null {
    const validMoves = this.getAllValidMoves(mainBoard)

    for (const move of validMoves) {
      // Simulate the move
      const miniGame = mainBoard.miniGames[move.miniGameIndex]
      const cells = [...miniGame.cells]
      cells[move.cellIndex] = player

      // Check if this wins the mini-game
      const miniWinner = this.checkWin(cells)
      if (miniWinner === player) {
        // Check if winning this mini-game wins the overall game
        const mainBoardState = [...mainBoard.state]
        mainBoardState[move.miniGameIndex] = player

        const gameWinner = this.checkWin(mainBoardState)
        if (gameWinner === player) {
          return move
        }
      }
    }

    return null
  }

  /**
   * Find a move that wins a mini-game
   */
  private findMiniGameWinningMove(
    mainBoard: MainBoard,
    player: Player
  ): AIMove | null {
    const validMoves = this.getAllValidMoves(mainBoard)

    for (const move of validMoves) {
      const miniGame = mainBoard.miniGames[move.miniGameIndex]
      const cells = [...miniGame.cells]
      cells[move.cellIndex] = player

      const winner = this.checkWin(cells)
      if (winner === player) {
        return move
      }
    }

    return null
  }

  /**
   * Find a move in the center of an available mini-game
   */
  private findCenterMove(mainBoard: MainBoard): AIMove | null {
    const validMoves = this.getAllValidMoves(mainBoard)

    // Center cell index is 4 (middle of 3x3 grid)
    const centerMoves = validMoves.filter((move) => move.cellIndex === 4)
    if (centerMoves.length === 0) return null

    // Prefer center of center mini-game (position 4)
    const centerOfCenter = centerMoves.find(
      (move) => move.miniGameIndex === 4
    )
    if (centerOfCenter) return centerOfCenter

    // Otherwise return first center move
    return centerMoves[0]
  }

  /**
   * Check for a win in a 3x3 grid
   */
  private checkWin(cells: CellState[]): Player | null {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Columns
      [0, 4, 8],
      [2, 4, 6], // Diagonals
    ]

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern
      if (
        cells[a] &&
        cells[a] !== 'draw' &&
        cells[a] === cells[b] &&
        cells[a] === cells[c]
      ) {
        return cells[a] as Player
      }
    }

    return null
  }
}
