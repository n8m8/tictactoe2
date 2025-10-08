# Tasks: Ultimate Tic Tac Toe

**Input**: Design documents from `/specs/001-ultimate-tic-tac/`
**Prerequisites**: plan.md, spec.md, data-model.md, research.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4, US5, US6)
- Include exact file paths in descriptions

## Path Conventions
- **Single Next.js project**: `src/app/`, `src/components/`, `src/lib/`, `src/hooks/`
- **API routes**: `src/app/api/signaling/`
- **Public assets**: `public/sounds/`, `public/fonts/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure needed by all user stories

- [ ] T001 Initialize Next.js project with TypeScript, TailwindCSS, ESLint using create-next-app (--app --typescript --tailwind --eslint --no-src-dir --import-alias "@/*")
- [ ] T002 Install additional dependencies: pnpm add simple-peer && pnpm add -D prettier prettier-plugin-tailwindcss @types/simple-peer
- [ ] T003 [P] Configure ESLint in .eslintrc.json (extends next/core-web-vitals, prettier)
- [ ] T004 [P] Configure Prettier in .prettierrc (semi: false, singleQuote: true, plugins: tailwindcss)
- [ ] T005 [P] Create PostCSS config in postcss.config.js (plugins: tailwindcss, autoprefixer) - REQUIRED for Tailwind to work
- [ ] T006 [P] Configure TailwindCSS whiteboard theme in tailwind.config.ts (colors, fonts, animations including fadeIn per research.md)
- [ ] T007 [P] Configure Next.js in next.config.js (reactStrictMode, removeConsole in prod, image optimization)
- [ ] T008 [P] Create TypeScript config in tsconfig.json (strict mode, path aliases)
- [ ] T009 Download and self-host Bunny Fonts (Permanent Marker, Caveat) in public/fonts/
- [ ] T010 Create app/fonts.ts using next/font/google for Google Fonts (Permanent Marker for markers, Caveat for UI)
- [ ] T011 Update app/layout.tsx with fonts, global providers, and metadata
- [ ] T012 Create app/globals.css with TailwindCSS imports and custom layers (whiteboard theme, game-cell component, IMPORTANT: .game-grid must use grid-cols-3 for 3x3 layout of mini-games)
- [ ] T013 [P] Create Docker development setup in docker/docker-compose.yml
- [ ] T014 [P] Create Docker production Dockerfile with multi-stage build

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T015 [P] Create TypeScript types in types/game.ts (GameState, MiniGame, MainBoard, Move, Player, CellState, GamePhase, MoveResult)
- [ ] T016 [P] Create TypeScript types in types/signaling.ts (SignalingMessage, WebRTCOffer, WebRTCAnswer, ICECandidate)
- [ ] T017 Implement game rules in lib/game-rules.ts (checkMiniGameWin, checkMainBoardWin, isValidMove, isMiniGameDraw, isGameDraw)
- [ ] T018 Implement game state reducer in lib/game-state.ts (gameReducer with MAKE_MOVE, RESET_GAME, SYNC_STATE, SET_WINNER actions)
- [ ] T019 Create base UI components in components/ui/Button.tsx (whiteboard-themed with hover/active states)
- [ ] T020 [P] Create base UI components in components/ui/Input.tsx (join code input styling)
- [ ] T021 [P] Create base UI components in components/ui/Modal.tsx (options/debug modal shell)
- [ ] T085 Create title screen at app/page.tsx with navigation buttons (Host Game, Join Game, Single Player, How to Play, Options)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Core Multiplayer Gameplay (Priority: P1) 🎯 MVP

**Goal**: Two players can host, join, play a complete Ultimate Tic Tac Toe game via P2P, see winner, and rematch

**Independent Test**: Open two browsers → Player 1 hosts → Player 2 joins with code → Complete full game → Winner shown → Rematch works → Starting player alternates

### Implementation for User Story 1

- [ ] T085 [P] [US1] Create signaling API endpoint src/app/api/signaling/create-room/route.ts (generate sessionId, hostToken, 6-char joinCode, store in KV with 1hr TTL)
- [ ] T085 [P] [US1] Create signaling API endpoint src/app/api/signaling/join-room/route.ts (validate joinCode, generate guestToken, return sessionId and tokens)
- [ ] T085 [P] [US1] Create signaling API endpoint src/app/api/signaling/signal/route.ts (store WebRTC offer/answer/ICE candidates in KV list per session)
- [ ] T085 [P] [US1] Create signaling API endpoint src/app/api/signaling/poll/route.ts (retrieve pending signals for session since timestamp)
- [ ] T085 [US1] Create signaling client in src/lib/signaling-client.ts (HTTP functions to call create-room, join-room, signal, poll endpoints)
- [ ] T085 [US1] Create P2P connection manager in src/lib/p2p-connection.ts (SimplePeer wrapper with STUN servers config: stun.l.google.com:19302, connect, send, receive, reconnect logic)
- [ ] T085 [US1] Create useP2PConnection hook in src/hooks/useP2PConnection.ts (manages WebRTC lifecycle, signaling, connection state)
- [ ] T085 [US1] Create useGameState hook in src/hooks/useGameState.ts (wraps gameReducer, syncs state over P2P, handles move validation)
- [ ] T085 [P] [US1] Create MiniGame component in src/components/game/MiniGame.tsx (3x3 grid, click handlers, winner highlight)
- [ ] T085 [P] [US1] Create MainBoard component in src/components/game/MainBoard.tsx (9 MiniGame instances, grid layout, main board state display)
- [ ] T085 [P] [US1] Create GameOverlay component in src/components/game/GameOverlay.tsx (current turn indicator, session score, game phase messages)
- [ ] T085 [US1] Create host game screen at app/host/page.tsx (call create-room API, display joinCode, wait for guest, initiate P2P connection)
- [ ] T085 [US1] Create join game screen at app/join/page.tsx (input joinCode, call join-room API, initiate P2P connection)
- [ ] T085 [US1] Create gameplay screen at app/play/page.tsx (MainBoard, GameOverlay, useGameState, useP2PConnection, handle moves, detect win, show rematch UI)
- [ ] T085 [US1] Implement rematch logic in gameplay screen (send rematch_request/rematch_accept messages, reset game state, alternate starting player)
- [ ] T085 [US1] Implement session score tracking in useGameState hook (increment winner's score on game end, display in GameOverlay, reset on disconnect)
- [ ] T085 [US1] Add move synchronization in useGameState (send move messages over P2P, apply remote moves, conflict resolution via timestamp)
- [ ] T085 [US1] Add connection status indicators in GameOverlay (connected, disconnected, reconnecting states, latency display)
- [ ] T085 [US1] Add error handling for connection failures (show user-friendly messages, retry buttons, return to menu option)

**Checkpoint**: User Story 1 complete - full multiplayer game works end-to-end, independently testable

---

## Phase 4: User Story 2 - Single Player Practice Mode (Priority: P2)

**Goal**: Player can practice offline by alternating X and O moves on one device

**Independent Test**: Select "Single Player" → Play complete game alternating sides → Winner shown → Reset works → No network required

### Implementation for User Story 2

- [ ] T085 [US2] Create useLocalGame hook in src/hooks/useLocalGame.ts (local state management, alternate turns, no P2P, sessionStorage persistence)
- [ ] T085 [US2] Create single-player mode route at app/single-player/page.tsx (uses useLocalGame instead of useP2PConnection, MainBoard, GameOverlay)
- [ ] T085 [US2] Add "Single Player" button to title screen (app/page.tsx) linking to /single-player
- [ ] T085 [US2] Implement sessionStorage persistence in useLocalGame (save game state on move, restore on mount, clear on reset)
- [ ] T085 [US2] Add reset/new game button to single-player screen (clears sessionStorage, resets state to initial)

**Checkpoint**: User Story 2 complete - single-player mode works offline, independently testable

---

## Phase 5: User Story 3 - Tutorial and Rules Guide (Priority: P3)

**Goal**: New players can learn Ultimate Tic Tac Toe rules through interactive tutorial

**Independent Test**: Click "How to Play" → Read Tic/Tac/Toe explanations → See visual examples → Navigate sections → Return to menu

### Implementation for User Story 3

- [ ] T085 [P] [US3] Create tutorial content in app/tutorial/page.tsx (markdown-style sections explaining nested game structure)
- [ ] T085 [P] [US3] Create tutorial visual examples using MainBoard/MiniGame components (show example game states, highlight winning patterns)
- [ ] T085 [US3] Add "How to Play" button to title screen (app/page.tsx) linking to /tutorial
- [ ] T085 [US3] Implement tutorial navigation (Next/Back buttons, section tracking, progress indicator)
- [ ] T085 [US3] Add interactive tutorial examples (clickable demo board showing legal moves, mini-game wins, overall wins)
- [ ] T085 [US3] Create tutorial animations showing move sequence (Tic → Tac → Toe progression with visual highlights)

**Checkpoint**: User Story 3 complete - tutorial teaches rules effectively, independently testable

---

## Phase 6: User Story 4 - Session Score Tracking (Priority: P4)

**Goal**: Session score persists across multiple games, resets on disconnect

**Independent Test**: Complete 3+ games → Verify score accuracy → Disconnect → Rejoin → Score resets to 0-0

### Implementation for User Story 4

- [ ] T085 [US4] Enhance GameOverlay component (src/components/game/GameOverlay.tsx) with prominent session score display
- [ ] T085 [US4] Add session score initialization in useGameState hook (hostScore: 0, guestScore: 0, drawCount: 0)
- [ ] T085 [US4] Implement score increment on game end in useGameState (detect winner, update appropriate score, sync via P2P)
- [ ] T085 [US4] Add score reset on disconnect in useP2PConnection hook (clear session scores when peer connection closes)
- [ ] T085 [US4] Display session summary on game-over screen (e.g., "You won 3-2 this session")

**Checkpoint**: User Story 4 complete - session tracking works accurately, independently testable

---

## Phase 7: User Story 5 - Visual Design and Animations (Priority: P5)

**Goal**: Whiteboard theme with smooth 60fps animations for all game events

**Independent Test**: Visual inspection confirms whiteboard colors, marker fonts, smooth animations (move drawing, mini-wins, overall wins)

### Implementation for User Story 5

- [ ] T085 [P] [US5] Create DrawSymbol animation component in src/components/animations/DrawSymbol.tsx (X/O drawing effect using CSS transform/opacity)
- [ ] T085 [P] [US5] Create WinCelebration animation component in src/components/animations/WinCelebration.tsx (confetti/checkmark celebration in marker colors)
- [ ] T085 [US5] Integrate DrawSymbol into MiniGame component (animate X/O appearance on move with 300ms duration)
- [ ] T085 [US5] Add mini-game win animation to MiniGame component (highlight winning pattern, scale/pulse effect, 500ms duration)
- [ ] T085 [US5] Add main board win animation using WinCelebration (trigger on overall win detection, overlay on game screen)
- [ ] T085 [US5] Apply whiteboard theme styling to all screens (white/off-white backgrounds, expo marker colors, handwritten fonts)
- [ ] T085 [US5] Add hover/active states to all interactive elements (scale transforms, shadow effects, 200ms transitions)
- [ ] T085 [US5] Optimize animations for mobile (use will-change, transform-only, GPU acceleration via translateZ(0))
- [ ] T085 [US5] Add game state transition animations (fade in/out between screens, slide transitions)

**Checkpoint**: User Story 5 complete - visual design polished and animations smooth at 60fps

---

## Phase 8: User Story 6 - Options Menu and Debug Mode (Priority: P6)

**Goal**: Players can access settings and developers can inspect game state

**Independent Test**: Open options → Toggle settings → See changes → Enable debug mode → View game state overlay

### Implementation for User Story 6

- [ ] T085 [P] [US6] Create options screen at app/options/page.tsx (sound toggle, debug mode toggle, theme settings)
- [ ] T085 [P] [US6] Create useSoundEffects hook in src/hooks/useSoundEffects.ts (play sound function, enabled state, volume control)
- [ ] T085 [US6] Add sound effect triggers to game events (move click, mini-win, game-win, error) using useSoundEffects
- [ ] T085 [US6] Place sound MP3 files in public/sounds/ (move.mp3, mini-win.mp3, game-win.mp3, error.mp3 ~15KB each)
- [ ] T085 [US6] Implement debug mode overlay in GameOverlay component (show currentTurn, moveHistory, miniGame states, connection status)
- [ ] T085 [US6] Add "Options" button to title screen and in-game menu (app/page.tsx, app/play/page.tsx)
- [ ] T085 [US6] Store options in localStorage (sound enabled, debug mode, persist across sessions)
- [ ] T085 [US6] Add debug panel showing P2P connection metrics (RTT, packet loss, connection state, signal log)

**Checkpoint**: User Story 6 complete - options and debug tools functional

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T085 [P] Add loading states to all async operations (signaling API calls, P2P connection, game initialization)
- [ ] T085 [P] Add error boundaries to handle React component errors gracefully (display error UI, log to console in dev)
- [ ] T085 [P] Implement responsive design breakpoints (mobile 375px, tablet 768px, desktop 1024px+)
- [ ] T085 [P] Add touch target expansion to game cells for mobile (invisible ::before element expanding to 44px+)
- [ ] T085 [P] Implement safe area handling for mobile (env(safe-area-inset-*) padding)
- [ ] T085 Optimize bundle size (dynamic imports for routes, tree-shake unused TailwindCSS, verify <500KB target)
- [ ] T085 Add meta tags for SEO and social sharing (og:image, description, title)
- [ ] T085 Create README.md in repository root (quickstart, deployment instructions, project structure)
- [ ] T085 Verify accessibility basics (semantic HTML, ARIA labels on buttons, keyboard navigation for menus)
- [ ] T085 Test on target browsers (Chrome/Firefox desktop, Chrome/Firefox mobile on 375px and 1920px)
- [ ] T085 Verify performance targets (Lighthouse score >90, 60fps animations, <2s load on 3G throttling)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3-8)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed) OR sequentially by priority (P1 → P2 → P3 → P4 → P5 → P6)
  - Minimal cross-story dependencies (each story is independently testable)
- **Polish (Phase 9)**: Depends on desired user stories being complete (minimum: US1 for MVP)

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories ✅
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Reuses MiniGame/MainBoard from US1 but can be developed in parallel ✅
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Reuses components for visual examples ✅
- **User Story 4 (P4)**: Depends on US1 completion (enhances multiplayer session tracking) ⚠️
- **User Story 5 (P5)**: Can start after Foundational (Phase 2) - Adds to existing components in parallel ✅
- **User Story 6 (P6)**: Can start after Foundational (Phase 2) - Independent options/debug features ✅

### Within Each User Story

- Tasks within same file: Sequential execution required
- Tasks marked [P]: Can run in parallel (different files)
- General flow: API endpoints → Core logic → Hooks → Components → Screens

### Parallel Opportunities

**Phase 1 (Setup)** - All tasks marked [P] can run together:
- T003, T004, T005, T006, T007 (config files)
- T012, T013 (Docker files)

**Phase 2 (Foundational)** - Parallel sets:
- T014, T015 (type definitions - different files)
- T018, T019, T020 (UI components - different files)

**User Story 1 (P1)** - Parallel sets:
- T022, T023, T024, T025 (signaling API endpoints - 4 different routes)
- T030, T031, T032 (game components - different files)

**User Story 3 (P3)** - All tasks marked [P] can run together

**User Story 5 (P5)** - T057, T058 can run in parallel

**User Story 6 (P6)** - T066, T067 can run in parallel

**Phase 9 (Polish)** - T074, T075, T076, T077, T078 can run in parallel

---

## Parallel Example: User Story 1 Core Multiplayer

```bash
# Parallel Set 1: All signaling API endpoints
Task T022: "Create signaling API endpoint src/app/api/signaling/create-room/route.ts"
Task T023: "Create signaling API endpoint src/app/api/signaling/join-room/route.ts"
Task T024: "Create signaling API endpoint src/app/api/signaling/signal/route.ts"
Task T025: "Create signaling API endpoint src/app/api/signaling/poll/route.ts"

# Sequential: Depends on T025
Task T026: "Create signaling client in src/lib/signaling-client.ts"
Task T027: "Create P2P connection manager in src/lib/p2p-connection.ts"

# Parallel Set 2: All game components
Task T030: "Create MiniGame component in src/components/game/MiniGame.tsx"
Task T031: "Create MainBoard component in src/components/game/MainBoard.tsx"
Task T032: "Create GameOverlay component in src/components/game/GameOverlay.tsx"

# Sequential: Integrates all above
Task T033: "Create host game screen at app/host/page.tsx"
Task T034: "Create join game screen at app/join/page.tsx"
Task T035: "Create gameplay screen at app/play/page.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only - Recommended)

1. Complete Phase 1: Setup (T001-T013)
2. Complete Phase 2: Foundational (T014-T021) - CRITICAL blocking phase
3. Complete Phase 3: User Story 1 (T022-T040)
4. **STOP and VALIDATE**: Test multiplayer end-to-end in two browsers
5. Deploy MVP to Vercel/Netlify (optional)

**Time estimate**: 2-3 days for solo developer, 1-2 days for team

### Incremental Delivery (Recommended)

1. Setup + Foundational → Foundation ready (~4-6 hours)
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!) (~8-12 hours)
3. Add User Story 2 → Test independently → Deploy/Demo (~2-3 hours)
4. Add User Story 3 → Test independently → Deploy/Demo (~3-4 hours)
5. Add User Story 5 → Polish animations → Deploy/Demo (~4-6 hours)
6. Add User Stories 4, 6 → Final features → Production release (~2-3 hours)
7. Polish phase → Performance optimization (~2-4 hours)

**Total estimate**: 25-38 hours for solo developer

### Parallel Team Strategy

With 3 developers:

1. **All**: Complete Setup + Foundational together (~4-6 hours)
2. Once Foundational is done:
   - **Developer A**: User Story 1 (P1 - Core Multiplayer) (~8-12 hours)
   - **Developer B**: User Story 2 (P2 - Single Player) + User Story 3 (P3 - Tutorial) (~5-7 hours)
   - **Developer C**: User Story 5 (P5 - Animations) + User Story 6 (P6 - Options) (~6-9 hours)
3. **Developer A** completes first → assists with User Story 4 (P4 - Score Tracking, depends on US1)
4. **All**: Polish phase together (~2-4 hours)

**Total estimate**: 15-25 hours for 3-person team

---

## Notes

- [P] tasks = different files, no dependencies, can execute in parallel
- [Story] label (US1-US6) maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Stop at any checkpoint to validate story independently
- Commit after each task or logical group
- **No tests included** - feature spec did not request TDD approach
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Sound files should be sourced from free libraries (freesound.org, zapsplat.com) or created via tools
- WebRTC requires HTTPS in production (Vercel provides this automatically)
- Local testing: Use `http://localhost:3000` (HTTP acceptable for local)
