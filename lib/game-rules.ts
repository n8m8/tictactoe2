import type { CellState, Player, MiniGame, MainBoard, Move, GameState } from '@/types/game'

// Win patterns for tic-tac-toe (indices 0-8)
const WIN_PATTERNS = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // Diagonal \
  [2, 4, 6], // Diagonal /
]

/**
 * Check if a 3x3 grid has a winner
 */
export function checkWin(cells: CellState[]): Player | null {
  for (const pattern of WIN_PATTERNS) {
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

/**
 * Check if a mini-game has a winner
 */
export function checkMiniGameWin(miniGame: MiniGame): Player | null {
  return checkWin(miniGame.cells)
}

/**
 * Check if the main board has a winner
 */
export function checkMainBoardWin(mainBoard: MainBoard): Player | null {
  return checkWin(mainBoard.state)
}

/**
 * Check if a mini-game is a draw (all cells filled, no winner)
 */
export function isMiniGameDraw(cells: CellState[]): boolean {
  const allFilled = cells.every((cell) => cell !== null)
  const noWinner = checkWin(cells) === null
  return allFilled && noWinner
}

/**
 * Check if the overall game is a draw
 */
export function isGameDraw(mainBoard: MainBoard): boolean {
  const allComplete = mainBoard.state.every((cell) => cell !== null)
  const noWinner = checkMainBoardWin(mainBoard) === null
  return allComplete && noWinner
}

/**
 * Validate if a move is legal
 */
export function isValidMove(
  gameState: GameState,
  move: Move
): { valid: boolean; error?: string } {
  // Check if it's the correct player's turn
  if (move.player !== gameState.currentTurn) {
    return { valid: false, error: 'Not your turn' }
  }

  // Check if game is still in progress
  if (gameState.gamePhase !== 'playing') {
    return { valid: false, error: 'Game is not in progress' }
  }

  // Check if sequence number is correct
  if (move.seq !== gameState.moveHistory.length + 1) {
    return { valid: false, error: 'Invalid sequence number' }
  }

  // Get the target mini-game
  const miniGame = gameState.mainBoard.miniGames[move.miniGameIndex]

  // Check if mini-game is still playable
  if (miniGame.isComplete) {
    return { valid: false, error: 'Mini-game already complete' }
  }

  // Check if cell is empty
  if (miniGame.cells[move.cellIndex] !== null) {
    return { valid: false, error: 'Cell already occupied' }
  }

  return { valid: true }
}

/**
 * Create an empty mini-game
 */
export function createEmptyMiniGame(position: number): MiniGame {
  return {
    position: position as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
    cells: Array(9).fill(null),
    winner: null,
    isComplete: false,
  }
}

/**
 * Create an empty main board
 */
export function createEmptyMainBoard(): MainBoard {
  return {
    miniGames: Array.from({ length: 9 }, (_, i) => createEmptyMiniGame(i)),
    state: Array(9).fill(null),
    activeMiniGame: null, // First move can be anywhere
  }
}

/**
 * Create initial game state
 */
export function createInitialGameState(startingPlayer: Player = 'X'): GameState {
  return {
    mainBoard: createEmptyMainBoard(),
    currentTurn: startingPlayer,
    startingPlayer,
    gamePhase: 'playing',
    winner: null,
    moveHistory: [],
    hostScore: 0,
    guestScore: 0,
    drawCount: 0,
  }
}
