# Feature Specification: Ultimate Tic Tac Toe

**Feature Branch**: `001-ultimate-tic-tac`
**Created**: 2025-10-07
**Status**: Draft
**Input**: User description: "Ultimate Tic Tac Toe: a multiplayer tic tac toe spinoff. it's a 2-player game in a simple webapp. a player can host a game or join a game. When a player hosts a game, our webapp's server should accept other players' trying to join via the host's code, but they play over a p2p connection (so we facilitate their connection somehow)

Ultimate tictactoe itself is one extra layer of tictactoe on top of it: Every tictactoe square is itself a tictactoe game. You must win a mini-tictactoe to place your X or O on that spot. When it's your turn, you can play any unplayed square in any unwon minigame. Let's call a move of a minigame a \"Tic\", a win of a minigame and thus scoring on the primary board a \"Tac\", and making 3 in a row on the main board \"Toe\" and winning.

it should let players reset after the game is over and track the score of both players in the session

it should alternate who plays first each match

there should be art and animations

it should have a school whiteboard style of design with white background and expo marker inspired colors, fonts, and visuals

the game should be playable on desktop or mobile in firefox or chrome

screens: Title screen, host game screen, join game screen, waiting for game to start screen, (these might be moreso state than screens...), gameplay screen, options menu, debug mode, single-player mode (alternating/taking turns), tutorial/rules/guide"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Core Multiplayer Gameplay (Priority: P1)

Two players want to play Ultimate Tic Tac Toe together over the internet. One player hosts a game and shares a join code with their friend. The friend joins using the code, and they play a complete game where moves are synchronized in real-time. After the game ends, they can see who won and start a new match.

**Why this priority**: This is the core value proposition - real-time multiplayer gameplay. Without this, the entire feature is non-functional.

**Independent Test**: Can be fully tested by having two players in different browsers/devices complete a full game from host → join → play → win/draw → rematch. Delivers a complete multiplayer gaming experience.

**Acceptance Scenarios**:

1. **Given** Player A is on the title screen, **When** they choose "Host Game", **Then** they see a unique join code displayed and wait for another player to join
2. **Given** Player B has a join code, **When** they enter it on the "Join Game" screen, **Then** they connect to Player A's game and both players see "Game Starting"
3. **Given** both players are connected, **When** it's a player's turn, **Then** they can make a move in any valid mini-game square and their opponent sees the move appear immediately (within 150ms)
4. **Given** a player wins a mini-game (gets 3 in a row within one grid), **When** the winning move is made, **Then** that mini-game is marked with their symbol (X or O) on the main board with an animation
5. **Given** a player gets 3 mini-game wins in a row on the main board, **When** the winning move completes, **Then** both players see a victory animation and the game-over screen showing the winner
6. **Given** the game is over, **When** either player chooses "Rematch", **Then** both players see a rematch request, and when both accept, a new game starts with the starting player alternated

---

### User Story 2 - Single Player Practice Mode (Priority: P2)

A player wants to practice Ultimate Tic Tac Toe alone or teach someone locally. They can start a single-player mode where two players alternate turns on the same device, or one player makes moves for both sides to explore strategies.

**Why this priority**: Enables players to learn the game mechanics without requiring a second person online. Critical for onboarding and practice.

**Independent Test**: A single user can select single-player mode, play both X and O alternately on one device, complete a full game, and see the winner. Works entirely offline without any network connection.

**Acceptance Scenarios**:

1. **Given** a player is on the title screen, **When** they select "Single Player", **Then** they see the game board and can make moves alternating between X and O
2. **Given** a single-player game is in progress, **When** a player makes a move, **Then** the turn indicator switches to the other symbol and they can continue playing
3. **Given** a single-player game ends, **When** the victory condition is met, **Then** the winner is displayed and the player can reset to start a new game
4. **Given** a single-player game is active, **When** the player navigates away and returns, **Then** the game state is preserved (session-based, not persistent storage)

---

### User Story 3 - Tutorial and Rules Guide (Priority: P3)

A new player wants to understand how Ultimate Tic Tac Toe works. They can access an interactive tutorial or rules guide that explains the nested game mechanics, winning conditions, and movement rules.

**Why this priority**: Ultimate Tic Tac Toe has non-obvious rules (nested games, which mini-game you can play). Without a tutorial, players will be confused.

**Independent Test**: A user can access the tutorial/guide from the main menu, read through explanations of game rules with visual examples, and return to the main menu. No gameplay required to verify tutorial content.

**Acceptance Scenarios**:

1. **Given** a player is on the title screen, **When** they select "How to Play", **Then** they see a tutorial explaining the nested game structure with visual diagrams
2. **Given** a player is viewing the tutorial, **When** they read about "Tic" (mini-game move), "Tac" (mini-game win), and "Toe" (main board win), **Then** each concept is illustrated with an interactive or animated example
3. **Given** a player is in the tutorial, **When** they select "Next" or "Back" navigation, **Then** they can move through tutorial sections sequentially
4. **Given** a player finishes the tutorial, **When** they select "Exit" or "Play Now", **Then** they return to the title screen or start a game

---

### User Story 4 - Session Score Tracking (Priority: P4)

During a gaming session, players want to track who has won more games. The system maintains a score counter showing how many games each player has won during the current session (from first game until they disconnect).

**Why this priority**: Adds competitive continuity and session engagement. Nice-to-have but not essential for core gameplay.

**Independent Test**: Two players complete multiple games in one session. After each game, they see an updated score display (e.g., "Player 1: 2 wins, Player 2: 1 win"). Score resets when players disconnect or start a new session.

**Acceptance Scenarios**:

1. **Given** two players complete a multiplayer game, **When** the game ends, **Then** the winner's score increments by 1 and both players see the updated session score
2. **Given** players are viewing the session score, **When** they start a rematch, **Then** the score persists into the next game
3. **Given** a player disconnects or closes the browser, **When** they rejoin (even with the same join code), **Then** the session score resets to 0-0 (session-scoped, not persistent)
4. **Given** players complete 5 games, **When** they view the score, **Then** it accurately reflects all wins (e.g., "3-2")

---

### User Story 5 - Visual Design and Animations (Priority: P5)

Players experience a polished, whiteboard-themed interface with smooth animations for game events (moves, wins, state transitions). The design uses white backgrounds, expo marker-inspired colors (blue, red, green, black), and handwritten-style fonts.

**Why this priority**: Creates an engaging, cohesive aesthetic. Important for user experience but can be iterated after core gameplay works.

**Independent Test**: Visual inspection of UI elements (title screen, game board, animations) confirms whiteboard theme. Animations play smoothly (60fps) for moves, mini-game wins, and game-over events.

**Acceptance Scenarios**:

1. **Given** a player makes a move, **When** they click/tap a square, **Then** their symbol (X or O) appears with a drawing animation (as if being written with a marker)
2. **Given** a mini-game is won, **When** the winning condition is met, **Then** the mini-game grid highlights with an animation and the winning symbol appears on the main board
3. **Given** a player wins the overall game, **When** the final winning move is made, **Then** a celebration animation plays (e.g., confetti, checkmark streak) in marker colors
4. **Given** the UI is displayed, **When** viewed on any screen, **Then** fonts resemble handwritten marker text, backgrounds are white/off-white, and accent colors match expo markers (blues, reds, greens, blacks)

---

### User Story 6 - Options Menu and Debug Mode (Priority: P6)

Players and developers can access an options menu to adjust settings (sound, theme variations) and a debug mode to inspect game state, connection status, and troubleshoot issues.

**Why this priority**: Quality-of-life feature for players and development/troubleshooting tool. Lowest priority since core functionality doesn't depend on it.

**Independent Test**: A player can access the options menu from the title screen or during gameplay, toggle available settings (e.g., mute sounds), and see changes applied immediately. Debug mode can be enabled to show game state data.

**Acceptance Scenarios**:

1. **Given** a player is on the title screen or in a game, **When** they select "Options", **Then** they see a menu with available settings
2. **Given** the options menu is open, **When** a player toggles a setting (e.g., sound on/off), **Then** the change takes effect immediately
3. **Given** a developer enables debug mode via the options menu toggle, **When** they view the game, **Then** they see overlays or panels showing game state (current turn, mini-game states, connection status, move history)
4. **Given** debug mode is active during multiplayer, **When** network events occur (move sent/received, connection status changes), **Then** debug information updates in real-time

---

### Edge Cases

- What happens when a player disconnects mid-game? The remaining player should see a "Player Disconnected" message and have options to wait for reconnection (with timeout) or return to the main menu.
- What happens when a mini-game ends in a draw (all 9 squares filled with no winner)? That mini-game square on the main board is marked as "draw" (neutral) and cannot contribute to either player's win condition.
- What happens when the overall game ends in a draw (all mini-games complete with no 3-in-a-row on main board)? Both players see a "Draw" result screen and the session score remains unchanged (or increments a "draws" counter if tracked).
- What happens when a player tries to join with an invalid or expired join code? They see an error message: "Invalid code. Please check and try again."
- What happens when a player tries to make a move out of turn or in an already-won mini-game? The move is rejected (no state change) and the UI provides feedback (e.g., shake animation, message "Not your turn" or "Mini-game already won").
- What happens when network latency exceeds 300ms? Moves still synchronize but may feel sluggish. A latency indicator could warn players of poor connection quality.
- What happens if both players try to make a move simultaneously (race condition)? The server/P2P logic resolves conflicts using turn order - only the player whose turn it is has their move accepted.
- What happens when a player refreshes the browser during a game? The game state is lost (session-based). Player returns to title screen and must rejoin or start a new game.
- What happens when the main board has winning conditions in multiple directions simultaneously (edge case)? The first detected win condition triggers victory (implementation handles detection order).

## Requirements *(mandatory)*

### Functional Requirements

#### Game Mechanics

- **FR-001**: System MUST implement Ultimate Tic Tac Toe rules: 9 mini-games arranged in a 3x3 grid, each mini-game is a 3x3 tic-tac-toe grid
- **FR-002**: System MUST enforce win condition for mini-games: 3 symbols (X or O) in a row (horizontal, vertical, or diagonal) within a single mini-game
- **FR-003**: System MUST mark a won mini-game on the main board with the winner's symbol (X or O)
- **FR-004**: System MUST enforce overall win condition: 3 mini-game wins in a row on the main board (horizontal, vertical, or diagonal)
- **FR-005**: System MUST allow players to make moves in any unplayed square of any unwon mini-game during their turn
- **FR-006**: System MUST alternate turns between players after each valid move
- **FR-007**: System MUST handle draw conditions for mini-games (all 9 squares filled with no winner) and mark them as neutral on the main board
- **FR-008**: System MUST detect overall game draw (all mini-games complete with no 3-in-a-row on main board)

#### Multiplayer Connection

- **FR-009**: System MUST allow a player to host a game and generate a unique join code (4-6 alphanumeric characters, easy to share verbally)
- **FR-010**: System MUST allow a player to join a hosted game by entering the join code
- **FR-011**: System MUST facilitate peer-to-peer connection between players using the server for signaling/handshake (WebRTC or similar)
- **FR-012**: System MUST synchronize game state between connected players in real-time (moves, turn changes, win conditions)
- **FR-013**: System MUST handle player disconnection gracefully: notify remaining player, provide reconnection window (30 seconds assumed), or allow game termination
- **FR-014**: System MUST ensure move synchronization latency is under 150ms under normal network conditions

#### Session Management

- **FR-015**: System MUST track session score (wins per player) from the first game until players disconnect
- **FR-016**: System MUST alternate which player starts (X or O) for each new game in a session
- **FR-017**: System MUST allow players to request a rematch after a game ends, requiring both players to accept before starting a new game
- **FR-018**: System MUST reset session score when players disconnect or close the browser (no persistent storage across sessions)

#### Single Player Mode

- **FR-019**: System MUST provide a single-player mode where players alternate making moves for both X and O on the same device
- **FR-020**: Single-player mode MUST function entirely offline without network connectivity
- **FR-021**: Single-player mode MUST preserve game state during the browser session (until page refresh or navigation away)

#### User Interface Screens

- **FR-022**: System MUST provide a title screen with options: Host Game, Join Game, Single Player, How to Play, Options
- **FR-023**: System MUST provide a host game screen displaying the generated join code and waiting status
- **FR-024**: System MUST provide a join game screen with input for entering a join code
- **FR-025**: System MUST provide a gameplay screen showing the 9x9 nested grid, current turn indicator, and session score
- **FR-026**: System MUST provide a game-over screen showing the winner/draw result, session score, and rematch/exit options
- **FR-027**: System MUST provide a tutorial/guide screen explaining Ultimate Tic Tac Toe rules with visual examples

#### Visual Design

- **FR-028**: System MUST use a whiteboard-themed design: white/off-white backgrounds, expo marker-inspired colors (blues, reds, greens, blacks), handwritten-style fonts
- **FR-029**: System MUST animate player moves (symbol drawing effect) when a square is played
- **FR-030**: System MUST animate mini-game wins (highlight effect, symbol placement on main board)
- **FR-031**: System MUST animate overall game wins (celebration effect, e.g., confetti or checkmark streak)
- **FR-032**: Animations MUST run at 60fps on devices meeting minimum performance requirements (3-year-old mobile devices or newer)

#### Platform Support

- **FR-033**: System MUST function on desktop browsers: Chrome (latest 2 versions), Firefox (latest 2 versions)
- **FR-034**: System MUST function on mobile browsers: Chrome Mobile (latest 2 versions), Firefox Mobile (latest 2 versions)
- **FR-035**: System MUST be responsive and playable on screen sizes from 375px width (mobile) to 1920px+ (desktop)
- **FR-036**: System MUST support touch input (mobile) and mouse/keyboard input (desktop)

#### Optional Features

- **FR-037**: System MAY provide an options menu for toggling settings (sound effects, visual theme variations)
- **FR-038**: System MAY provide a debug mode showing game state, connection status, and move history for development/troubleshooting

### Key Entities

- **Game Session**: Represents an ongoing game between two players. Includes: session ID, player identities (host/guest), current game state, session score (wins per player), connection status.

- **Game State**: Represents the current state of the Ultimate Tic Tac Toe board. Includes: 9 mini-game states (each with 9 squares), main board state (9 positions showing mini-game winners or draws), current turn (X or O), game phase (waiting, playing, ended).

- **Mini-Game**: Represents one of the 9 tic-tac-toe grids. Includes: position on main board (0-8), 9 square states (empty, X, or O), win status (none, X wins, O wins, draw).

- **Player**: Represents a participant in a game. Includes: player ID (session-scoped), assigned symbol (X or O), connection status (connected, disconnected), wins in current session.

- **Move**: Represents a single player action. Includes: mini-game position (0-8), square position within mini-game (0-8), player symbol (X or O), timestamp.

- **Join Code**: A unique alphanumeric identifier (4-6 characters) generated when a player hosts a game, used by other players to join.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players can complete a full multiplayer game (host → join → play → win) in under 5 minutes for an average-length game (15-25 moves)
- **SC-002**: Move synchronization occurs within 150ms between connected players under normal network conditions (< 100ms ping)
- **SC-003**: System supports at least 50 concurrent game sessions (100 connected players total) without performance degradation
- **SC-004**: 90% of players successfully connect and start a game on their first attempt (join code entry and P2P connection establishment)
- **SC-005**: Game animations maintain 60fps on devices meeting minimum requirements (3-year-old mobile devices, desktop browsers)
- **SC-006**: 95% of players can understand and play the game correctly after viewing the tutorial once (measured by correct first moves in mini-games)
- **SC-007**: Page load time is under 2 seconds on 3G connection (initial render of title screen)
- **SC-008**: Single-player mode functions without any network requests after initial page load
- **SC-009**: Players report satisfaction rating of 4/5 or higher for visual design (whiteboard theme, animations, clarity)
- **SC-010**: Session score tracking is accurate across 10+ consecutive games without discrepancies

### Assumptions

- **Network**: Peer-to-peer connections are viable for this use case; server only handles signaling for WebRTC-style handshake
- **Storage**: No persistent storage required (no accounts, saved games, or historical data beyond current session)
- **Authentication**: No user accounts or authentication required; players are identified only within a game session
- **Scalability**: Initial launch targets < 100 concurrent players; can scale signaling server horizontally if needed
- **Browser Support**: Latest 2 versions of Chrome and Firefox cover 90%+ of target audience
- **Performance**: Target devices are 3-year-old mobile devices or newer, desktop browsers on standard hardware
- **Sound**: Sound effects are optional (FR-037); game is fully playable without audio
- **Accessibility**: Initial release targets standard visual/input accessibility; advanced accessibility features (screen readers, keyboard-only navigation) are future enhancements
- **Latency Handling**: Network latency > 300ms will result in degraded experience but game remains playable
- **Security**: No sensitive data; malicious move attempts are rejected by game state validation, but no anti-cheat measures beyond basic validation
