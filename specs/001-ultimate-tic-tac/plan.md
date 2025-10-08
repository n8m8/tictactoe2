# Implementation Plan: Ultimate Tic Tac Toe

**Branch**: `001-ultimate-tic-tac` | **Date**: 2025-10-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-ultimate-tic-tac/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Ultimate Tic Tac Toe is a real-time multiplayer web game featuring nested 3x3 grids where players must win mini-games to claim positions on the main board. The system uses Next.js for the frontend with P2P connections for gameplay, server-side signaling for matchmaking, and a whiteboard-themed UI. Players can host/join games via codes, play in single-player practice mode, and track session scores across multiple matches.

**Technical Approach**: Next.js 14+ App Router for frontend, WebRTC for P2P game synchronization, serverless functions (Vercel/Netlify) for signaling server, TailwindCSS for styling, pnpm for package management, Docker for containerized local deployment.

## Technical Context

**Language/Version**: TypeScript 5.3+, Node.js 20+ LTS
**Primary Dependencies**: Next.js 14+, React 18+, TailwindCSS 3.4+, simple-peer (WebRTC), Bunny Fonts
**Storage**: Session storage (browser) for single-player state; no persistent database
**Testing**: Jest + React Testing Library for unit/integration tests
**Target Platform**: Web browsers (Chrome, Firefox latest 2 versions) on desktop and mobile
**Project Type**: Web application (single Next.js project)
**Performance Goals**: 60fps animations, <150ms P2P latency, <2s initial load on 3G, <500KB bundle
**Constraints**: <50ms local input latency, WebRTC P2P with <300ms network tolerance, mobile-responsive (375px-1920px+)
**Scale/Scope**: 50+ concurrent game sessions (100 players), 6 user stories (P1-P6), ~10-15 React components

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Functional Multiplayer First ✅
- **Requirement**: Real-time multiplayer is primary use case
- **Implementation**: P2P WebRTC for game state sync, signaling server for matchmaking
- **Status**: PASS - P1 user story is core multiplayer gameplay

### Principle II: Simple Architecture - No Bloat ✅
- **Requirement**: No unnecessary frameworks, minimal abstraction layers
- **Implementation**:
  - Next.js (justified: provides HMR, routing, serverless functions in one)
  - TailwindCSS (justified: <100KB, utility-first, no component bloat)
  - simple-peer for WebRTC (minimal wrapper, 15KB)
- **Status**: PASS - All dependencies serve multiplayer or deployment requirements

### Principle III: Developer-First Deployment ✅
- **Requirement**: Single command dev, single command deploy
- **Implementation**:
  - `pnpm install` → `pnpm dev` → localhost:3000
  - `pnpm build && vercel deploy` OR Docker container for self-hosting
  - No cloud account required for local dev (Docker fallback)
- **Status**: PASS - Meets <5 minute clone-to-run requirement

### Principle IV: Immediate Feedback Loops ✅
- **Requirement**: <1s change visibility, HMR, no manual reload
- **Implementation**: Next.js Fast Refresh, TailwindCSS JIT compilation
- **Status**: PASS - Built-in HMR, sub-second refresh

### Principle V: Testable Multiplayer State ✅
- **Requirement**: Deterministic game state, loggable network events, reproducible
- **Implementation**:
  - Pure reducer functions for game state
  - Move history logging in debug mode
  - Game state serializable to JSON
- **Status**: PASS - State machine design enables testing

### Deployment Constraints Check ✅
- **Development**: `pnpm install && pnpm dev` → localhost:3000 ✅
- **Production**: Vercel one-click deploy OR Docker self-host ✅
- **No Complex Infrastructure**: No K8s, no DB, serverless functions only ✅

### Technology Constraints Check ✅
- **Mandatory Simplicity**: Next.js (minimal config), TailwindCSS (<100KB) ✅
- **Performance Baselines**: <2s load, <50ms input, 60fps, <500KB bundle ✅

**GATE STATUS**: ✅ **PASSED** - All principles satisfied, proceed to Phase 0

## Project Structure

### Documentation (this feature)

```
specs/001-ultimate-tic-tac/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   ├── signaling-api.yaml    # WebRTC signaling endpoints
│   └── game-state.schema.json # Game state JSON schema
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```
tictactoe2/
├── src/
│   ├── app/                      # Next.js 14 App Router
│   │   ├── page.tsx              # Title screen
│   │   ├── host/page.tsx         # Host game screen
│   │   ├── join/page.tsx         # Join game screen
│   │   ├── play/page.tsx         # Gameplay screen
│   │   ├── tutorial/page.tsx     # How to Play screen
│   │   ├── api/                  # Serverless API routes
│   │   │   └── signaling/        # WebRTC signaling endpoints
│   │   │       ├── create-room/route.ts
│   │   │       ├── join-room/route.ts
│   │   │       └── signal/route.ts
│   │   └── layout.tsx            # Root layout with Bunny Fonts
│   ├── components/               # React components
│   │   ├── game/
│   │   │   ├── MiniGame.tsx      # Single 3x3 grid
│   │   │   ├── MainBoard.tsx     # 9 mini-games container
│   │   │   └── GameOverlay.tsx   # Turn indicator, score
│   │   ├── ui/
│   │   │   ├── Button.tsx        # Whiteboard-themed button
│   │   │   ├── Input.tsx         # Join code input
│   │   │   └── Modal.tsx         # Options/debug modal
│   │   └── animations/
│   │       ├── DrawSymbol.tsx    # X/O drawing animation
│   │       └── WinCelebration.tsx # Victory confetti
│   ├── lib/                      # Core logic
│   │   ├── game-state.ts         # Game state reducer
│   │   ├── game-rules.ts         # Win detection, move validation
│   │   ├── p2p-connection.ts     # WebRTC peer management
│   │   └── signaling-client.ts   # API client for signaling
│   ├── hooks/                    # React hooks
│   │   ├── useGameState.ts       # Game state management
│   │   ├── useP2PConnection.ts   # WebRTC connection hook
│   │   ├── useSoundEffects.ts    # Sound playback hook
│   │   └── useLocalGame.ts       # Single-player mode
│   ├── types/                    # TypeScript types
│   │   ├── game.ts               # GameState, Move, Player types
│   │   └── signaling.ts          # Signaling message types
│   └── styles/
│       └── globals.css           # TailwindCSS imports + custom styles
├── public/
│   ├── sounds/                   # Sound effect MP3s
│   │   ├── move.mp3              # Square click sound
│   │   ├── mini-win.mp3          # Mini-game win sound
│   │   ├── game-win.mp3          # Overall victory sound
│   │   └── error.mp3             # Invalid move sound
│   └── fonts/                    # Bunny Fonts (if self-hosted)
├── tests/
│   ├── unit/
│   │   ├── game-rules.test.ts    # Win detection tests
│   │   └── game-state.test.ts    # State reducer tests
│   └── integration/
│       └── multiplayer.test.ts   # P2P connection tests
├── docker/
│   ├── Dockerfile                # Production container
│   └── docker-compose.yml        # Local dev container
├── .eslintrc.json                # ESLint config
├── .prettierrc                   # Prettier config
├── tailwind.config.ts            # TailwindCSS config (whiteboard theme)
├── next.config.js                # Next.js config
├── tsconfig.json                 # TypeScript config
├── package.json                  # pnpm dependencies
└── README.md                     # Quickstart guide
```

**Structure Decision**: Single Next.js web application using App Router architecture. This structure satisfies:
- **Principle II (Simple Architecture)**: Single project, flat component hierarchy, no monorepo complexity
- **Principle III (Developer-First Deployment)**: All code in one repo, single `pnpm dev` command
- **Principle IV (Immediate Feedback)**: Next.js Fast Refresh works seamlessly with this structure

The `/src/app/` directory uses Next.js 14 file-based routing. Serverless API routes in `/src/app/api/` handle signaling. Game logic lives in `/src/lib/` as pure functions for testability (Principle V).

## Complexity Tracking

*No violations - all complexity justified by constitution principles.*
