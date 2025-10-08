# Data Model: Ultimate Tic Tac Toe

**Date**: 2025-10-07
**Purpose**: Define game state entities, relationships, and validation rules

## Entity Diagram

```
GameSession
├── sessionId: string
├── hostToken: string
├── guestToken: string
├── createdAt: number
├── hostScore: number
├── guestScore: number
└── currentGame: Game

Game
├── gameId: string
├── mainBoard: MainBoard
├── currentTurn: 'X' | 'O'
├── startingPlayer: 'X' | 'O'
├── gamePhase: 'waiting' | 'playing' | 'ended'
├── winner: 'X' | 'O' | 'draw' | null
└── moveHistory: Move[]

MainBoard
├── miniGames: MiniGame[9]
└── state: CellState[9]

MiniGame
├── position: 0..8
├── cells: CellState[9]
├── winner: 'X' | 'O' | 'draw' | null
└── isComplete: boolean

Move
├── seq: number
├── player: 'X' | 'O'
├── miniGameIndex: 0..8
├── cellIndex: 0..8
├── timestamp: number
└── resultingState: 'continue' | 'mini-win' | 'mini-draw' | 'game-win' | 'game-draw'

SignalingMessage
├── roomId: string
├── token: string
├── type: 'offer' | 'answer' | 'ice-candidate'
├── signal: WebRTCSignal
└── timestamp: number
```

## Core Entities

### 1. GameSession

**Purpose**: Represents a multiplayer session between two players, persisting across multiple games.

**Fields**:
```typescript
interface GameSession {
  sessionId: string            // UUID v4
  hostToken: string            // UUID v4 (authentication)
  guestToken: string | null    // UUID v4 (null until guest joins)
  joinCode: string             // 6-char alphanumeric (e.g., "A3K9Z2")
  createdAt: number            // Unix timestamp (ms)
  lastActivity: number         // Unix timestamp (ms)
  hostScore: number            // Wins by host in this session
  guestScore: number           // Wins by guest in this session
  drawCount: number            // Draw games in this session
  currentGame: Game | null     // Active game state
  status: 'waiting' | 'active' | 'ended'
}
```

**Validation Rules**:
- `sessionId`: Must be valid UUID v4
- `joinCode`: Exactly 6 uppercase alphanumeric characters
- `hostScore`, `guestScore`, `drawCount`: Non-negative integers
- `lastActivity`: Updated on every game action (used for TTL cleanup)
- `status`: 'waiting' until guest joins, 'active' during play, 'ended' on disconnect

**State Transitions**:
```
waiting → active    (guest joins)
active → ended      (player disconnects)
```

**Storage**: Vercel KV with 1-hour TTL
- Key: `session:{sessionId}`
- Expiry: Reset to 1 hour on each `lastActivity` update

---

### 2. Game

**Purpose**: Represents a single Ultimate Tic Tac Toe match within a session.

**Fields**:
```typescript
interface Game {
  gameId: string                          // UUID v4
  sessionId: string                       // Parent session reference
  mainBoard: MainBoard
  currentTurn: 'X' | 'O'
  startingPlayer: 'X' | 'O'              // Alternates each game
  gamePhase: 'waiting' | 'playing' | 'ended'
  winner: 'X' | 'O' | 'draw' | null
  moveHistory: Move[]
  startedAt: number                       // Unix timestamp (ms)
  endedAt: number | null                  // Unix timestamp (ms)
}
```

**Validation Rules**:
- `currentTurn`: Must be 'X' or 'O'
- `startingPlayer`: Opposite of previous game's starting player in session
- `moveHistory`: Sequential array, `move[i].seq === i + 1`
- `winner`: Non-null only if `gamePhase === 'ended'`
- `endedAt`: Non-null only if `gamePhase === 'ended'`

**State Transitions**:
```
waiting → playing   (both players connected)
playing → ended     (win condition or draw detected)
```

**Derived State**:
- `isComplete`: `gamePhase === 'ended'`
- `duration`: `endedAt - startedAt` (if ended)
- `totalMoves`: `moveHistory.length`

---

### 3. MainBoard

**Purpose**: Represents the 3x3 grid of mini-games.

**Fields**:
```typescript
interface MainBoard {
  miniGames: MiniGame[9]  // Indexed 0-8 (row-major order)
  state: CellState[9]     // Derived from miniGames winners
}

type CellState = 'X' | 'O' | 'draw' | null
```

**Index Mapping** (0-8):
```
0 | 1 | 2
---------
3 | 4 | 5
---------
6 | 7 | 8
```

**Validation Rules**:
- `miniGames.length === 9`
- `state[i]` must match `miniGames[i].winner`
- `state` is computed, not stored independently

**Win Detection**:
```typescript
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

function checkMainBoardWin(state: CellState[]): 'X' | 'O' | null {
  for (const pattern of WIN_PATTERNS) {
    const [a, b, c] = pattern
    if (state[a] && state[a] === state[b] && state[a] === state[c]) {
      return state[a] as 'X' | 'O'
    }
  }
  return null
}
```

**Draw Detection**:
```typescript
function isMainBoardDraw(state: CellState[]): boolean {
  // All mini-games complete AND no winner
  return state.every(cell => cell !== null) && checkMainBoardWin(state) === null
}
```

---

### 4. MiniGame

**Purpose**: Represents a single 3x3 tic-tac-toe grid within the main board.

**Fields**:
```typescript
interface MiniGame {
  position: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8  // Position on main board
  cells: CellState[9]                           // Cell values
  winner: 'X' | 'O' | 'draw' | null
  isComplete: boolean                           // Derived from winner
}
```

**Validation Rules**:
- `position`: Integer 0-8
- `cells.length === 9`
- `winner === null` if any `cells[i] === null` AND not a draw
- `isComplete === (winner !== null)`

**Win Detection**: Same WIN_PATTERNS as MainBoard

**Draw Detection**:
```typescript
function isMiniGameDraw(cells: CellState[]): boolean {
  return cells.every(cell => cell !== null) && checkWin(cells) === null
}
```

**Move Validation**:
```typescript
function canPlayInMiniGame(miniGame: MiniGame, cellIndex: number): boolean {
  if (miniGame.isComplete) return false
  if (cellIndex < 0 || cellIndex > 8) return false
  return miniGame.cells[cellIndex] === null
}
```

---

### 5. Move

**Purpose**: Represents a single player action (marking a cell in a mini-game).

**Fields**:
```typescript
interface Move {
  seq: number                      // Sequential move number (1, 2, 3...)
  player: 'X' | 'O'
  miniGameIndex: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
  cellIndex: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
  timestamp: number                // Unix timestamp (ms)
  resultingState: MoveResult
}

type MoveResult =
  | 'continue'      // Move played, game continues
  | 'mini-win'      // Move won a mini-game
  | 'mini-draw'     // Move caused mini-game draw
  | 'game-win'      // Move won the overall game
  | 'game-draw'     // Move caused overall draw
```

**Validation Rules**:
- `seq`: Must be `previousMove.seq + 1` (or 1 for first move)
- `player`: Must match `currentTurn` when move was made
- `miniGameIndex`, `cellIndex`: Valid grid positions (0-8)
- `timestamp`: Must be ≥ previous move's timestamp
- `resultingState`: Computed based on game state after move

**Conflict Resolution**:
```typescript
function resolveConflict(move1: Move, move2: Move): Move {
  // Same-timestamp moves (< 50ms apart)
  if (Math.abs(move1.timestamp - move2.timestamp) < 50) {
    // Host (X) always wins ties
    return move1.player === 'X' ? move1 : move2
  }
  // Earlier timestamp wins
  return move1.timestamp < move2.timestamp ? move1 : move2
}
```

**Serialization** (for WebRTC):
```json
{
  "type": "move",
  "seq": 5,
  "player": "X",
  "miniGameIndex": 4,
  "cellIndex": 7,
  "timestamp": 1709856123456,
  "resultingState": "mini-win"
}
```

---

### 6. SignalingMessage

**Purpose**: WebRTC signaling data exchanged through serverless API.

**Fields**:
```typescript
interface SignalingMessage {
  roomId: string               // Session ID
  token: string                // Host or guest token (authentication)
  type: 'offer' | 'answer' | 'ice-candidate'
  signal: WebRTCSignal         // SimplePeer signal object
  timestamp: number            // Unix timestamp (ms)
}

// SimplePeer signal types
type WebRTCSignal =
  | { type: 'offer'; sdp: string }
  | { type: 'answer'; sdp: string }
  | { candidate: string; sdpMLineIndex: number; sdpMid: string }
```

**Validation Rules**:
- `roomId`: Must match existing session
- `token`: Must match host or guest token
- `type`: Valid WebRTC signal type
- `signal`: Valid SimplePeer signal structure
- Messages expire after 60 seconds (cleanup via KV TTL)

**Storage Pattern**:
- Key: `signals:{roomId}` (Redis list)
- TTL: 60 seconds per message
- Clients poll every 500ms during connection setup

---

## Relationships

```
GameSession (1) ──────> (0..1) Game
                            │
                            ├──> (1) MainBoard
                            │         │
                            │         └──> (9) MiniGame
                            │
                            └──> (0..N) Move

GameSession (1) ──────> (0..N) SignalingMessage
```

**Cardinality**:
- Each `GameSession` has at most one active `Game`
- Each `Game` has exactly one `MainBoard`
- Each `MainBoard` has exactly 9 `MiniGame` instances
- Each `Game` has 0 to 81 `Move` records (theoretical max)
- Each `GameSession` has 0 to ~10 `SignalingMessage` records (during connection)

---

## State Machine

### Game State Transitions

```
┌─────────┐
│ waiting │ (gamePhase = 'waiting')
└────┬────┘
     │ Both players connected
     v
┌─────────┐
│ playing │ (gamePhase = 'playing')
└────┬────┘
     │ Win or draw detected
     v
┌────────┐
│ ended  │ (gamePhase = 'ended')
└────────┘
```

### Session State Transitions

```
┌─────────┐
│ waiting │ (status = 'waiting', guestToken = null)
└────┬────┘
     │ Guest joins
     v
┌─────────┐
│ active  │ (status = 'active', both tokens set)
└────┬────┘
     │ Player disconnects OR timeout
     v
┌────────┐
│ ended  │ (status = 'ended')
└────────┘
```

---

## Validation Functions

### Move Validation

```typescript
function isValidMove(
  game: Game,
  move: Move
): { valid: boolean; error?: string } {
  // Check turn
  if (move.player !== game.currentTurn) {
    return { valid: false, error: 'Not your turn' }
  }

  // Check sequence number
  if (move.seq !== game.moveHistory.length + 1) {
    return { valid: false, error: 'Invalid sequence number' }
  }

  // Check mini-game is playable
  const miniGame = game.mainBoard.miniGames[move.miniGameIndex]
  if (miniGame.isComplete) {
    return { valid: false, error: 'Mini-game already complete' }
  }

  // Check cell is empty
  if (miniGame.cells[move.cellIndex] !== null) {
    return { valid: false, error: 'Cell already occupied' }
  }

  return { valid: true }
}
```

### Game Completion Check

```typescript
function checkGameCompletion(mainBoard: MainBoard): {
  isComplete: boolean
  winner: 'X' | 'O' | 'draw' | null
} {
  const winner = checkMainBoardWin(mainBoard.state)
  if (winner) {
    return { isComplete: true, winner }
  }

  if (isMainBoardDraw(mainBoard.state)) {
    return { isComplete: true, winner: 'draw' }
  }

  return { isComplete: false, winner: null }
}
```

---

## Storage Schema

### Vercel KV Keys

```
session:{sessionId}        → GameSession object (TTL: 1 hour)
signals:{sessionId}        → List of SignalingMessage (TTL: 60s per item)
joincode:{joinCode}        → sessionId mapping (TTL: 1 hour)
```

### Session Storage (Browser)

```typescript
// Single-player mode only
interface LocalGameState {
  game: Game
  lastSaved: number
}

// Key: 'local-game-state'
// Cleared on page refresh or explicit reset
```

---

## Performance Considerations

### State Update Frequency

- **Multiplayer**: 1 move every 3-10 seconds (turn-based)
- **Message Size**: ~150-200 bytes per move (JSON)
- **Total Bandwidth**: 9-81 moves × 200 bytes = 1.8-16KB per game

### Memory Footprint

- **GameSession**: ~500 bytes
- **Game**: ~2KB (including move history)
- **SignalingMessage**: ~300 bytes × 10 = 3KB (temporary)
- **Total per session**: ~5-6KB

### Cleanup Strategy

- **Session TTL**: 1 hour (reset on activity)
- **Signal TTL**: 60 seconds (connection only)
- **Cron job**: Hourly cleanup of stale sessions
- **Client-side**: Clear localStorage on disconnect

---

## Next Steps

- [x] Data model defined
- [ ] Generate API contracts (contracts/)
- [ ] Write quickstart.md
- [ ] Update agent context
