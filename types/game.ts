// Core game types for Ultimate Tic Tac Toe

export type Player = 'X' | 'O'
export type CellState = Player | 'draw' | null
export type GamePhase = 'waiting' | 'playing' | 'ended'
export type MoveResult =
  | 'continue'
  | 'mini-win'
  | 'mini-draw'
  | 'game-win'
  | 'game-draw'

export interface MiniGame {
  position: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
  cells: CellState[]
  winner: Player | 'draw' | null
  isComplete: boolean
}

export interface MainBoard {
  miniGames: MiniGame[]
  state: CellState[] // Derived from miniGames winners
}

export interface Move {
  seq: number
  player: Player
  miniGameIndex: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
  cellIndex: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
  timestamp: number
  resultingState: MoveResult
}

export interface Game {
  gameId: string
  sessionId: string
  mainBoard: MainBoard
  currentTurn: Player
  startingPlayer: Player
  gamePhase: GamePhase
  winner: Player | 'draw' | null
  moveHistory: Move[]
  startedAt: number
  endedAt: number | null
}

export interface GameSession {
  sessionId: string
  hostToken: string
  guestToken: string | null
  joinCode: string
  createdAt: number
  lastActivity: number
  hostScore: number
  guestScore: number
  drawCount: number
  currentGame: Game | null
  status: 'waiting' | 'active' | 'ended'
}

// Game state for React state management
export interface GameState {
  mainBoard: MainBoard
  currentTurn: Player
  startingPlayer: Player
  gamePhase: GamePhase
  winner: Player | 'draw' | null
  moveHistory: Move[]
  hostScore: number
  guestScore: number
  drawCount: number
}

// Actions for game state reducer
export type GameAction =
  | { type: 'MAKE_MOVE'; miniGameIndex: number; cellIndex: number; player: Player }
  | { type: 'RESET_GAME'; startingPlayer: Player }
  | { type: 'SYNC_STATE'; state: GameState }
  | { type: 'SET_WINNER'; winner: Player | 'draw' }
  | { type: 'INCREMENT_SCORE'; player: Player | 'draw' }
