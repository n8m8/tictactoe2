<!--
Sync Impact Report
Version: 1.0.0 (Initial ratification)
Modified Principles: N/A (initial creation)
Added Sections: All (initial creation)
Removed Sections: N/A
Templates Requiring Updates:
  ✅ plan-template.md - Constitution Check section aligns with principles
  ✅ spec-template.md - User story independence aligns with deployment principle
  ✅ tasks-template.md - Parallel execution aligns with simplicity principle
Follow-up TODOs: None
-->

# TicTacToe2 Constitution

## Core Principles

### I. Functional Multiplayer First

Every feature MUST support real-time multiplayer gameplay as the primary use case. Single-player modes are secondary. Network synchronization, game state consistency, and player interaction take precedence over visual polish or advanced features.

**Rationale**: Multiplayer gaming is the core value proposition. All architectural decisions must serve reliable, responsive multi-player experiences.

### II. Simple Architecture - No Bloat

- No frameworks unless absolutely necessary for multiplayer functionality
- No abstraction layers that don't directly solve a multiplayer problem
- No "future-proofing" - implement only what's needed today
- Direct communication patterns over complex event systems
- Flat file structures over deep hierarchies

**Rationale**: Bloat kills iteration speed and makes debugging harder. Every line of code is a liability. Simple systems are easier to understand, modify, and deploy.

### III. Developer-First Deployment

Deployment MUST be trivial for developers:

- Single command to start development server
- Single command to deploy
- No cloud account setup required for development
- No build steps unless unavoidable
- Works on Mac/Linux/Windows without platform-specific setup

**Rationale**: Complex deployment kills momentum. Developers should focus on gameplay, not infrastructure.

### IV. Immediate Feedback Loops

- Changes visible in browser/client within 1 second
- No manual reload unless technically impossible
- Error messages point to exact problem location
- Game state inspectable during development
- Hot module replacement for code changes

**Rationale**: Fast iteration is the only way to build engaging gameplay. Slow feedback loops kill creativity.

### V. Testable Multiplayer State

- Game state must be deterministic and reproducible
- Network events must be loggable and replayable
- Player actions must be simulatable for testing
- No hidden state that can't be inspected or reset

**Rationale**: Multiplayer bugs are notoriously hard to debug. Testing infrastructure must be built into the architecture from day one.

## Deployment Constraints

### Development Requirements

- `npm install` (or equivalent) - install dependencies
- `npm run dev` - start development environment with hot reload
- Access game at `localhost:[PORT]` immediately

### Production Requirements

- Single static hosting deployment (Vercel, Netlify, GitHub Pages, or equivalent)
- No backend infrastructure management
- Environment variables configurable via `.env` file
- Deploy command: `npm run deploy` or platform CLI command

### No Complex Infrastructure

- No Kubernetes, Docker Compose, or container orchestration
- No database migrations or schema management
- No separate API server unless WebSocket/WebRTC require it
- If backend needed: serverless functions only (Vercel Functions, Netlify Functions, Cloudflare Workers)

## Technology Constraints

### Mandatory Simplicity

- Use vanilla technologies over frameworks when possible
- If framework needed: Next.js, Vite, or equivalent with minimal config
- WebSocket or WebRTC for multiplayer (pick one, stick with it)
- No ORMs, no build pipelines beyond bundler basics
- No CSS frameworks that add >100KB to bundle

### Performance Baselines

- Initial page load: <2 seconds on 3G
- Input latency: <50ms local, <150ms network
- Frame rate: 60fps on 3-year-old devices
- Bundle size: <500KB total (excluding game assets)

## Development Workflow

### Feature Development

1. Start with multiplayer use case - design for 2+ players
2. Implement core game state synchronization first
3. Add UI only after state management works
4. Test with simulated network latency (50ms, 150ms, 300ms)
5. No feature is "done" until it works multiplayer

### Code Review Requirements

- Does this add bloat? If yes, reject or simplify
- Can a new developer deploy this in <5 minutes? If no, simplify
- Does this add a build step or deployment dependency? Justify or remove
- Is multiplayer state testable/reproducible? If no, redesign

## Governance

### Constitution Authority

This constitution supersedes all other development practices, preferences, or conventions. When in doubt, refer to the principles in order:

1. Does it serve functional multiplayer? (Principle I)
2. Is it simple and unbloated? (Principle II)
3. Is deployment still trivial? (Principle III)
4. Are feedback loops immediate? (Principle IV)
5. Is multiplayer state testable? (Principle V)

### Amendment Process

- Amendments require documentation of specific pain point
- Must propose simpler alternative that was tried and failed
- Version bump according to semantic versioning
- All dependent templates and documentation updated

### Compliance Review

- Every PR must verify: deployment still one command
- Every feature review must verify: no new build dependencies
- Weekly check: can new developer clone and run in <5 minutes?

**Version**: 1.0.0 | **Ratified**: 2025-10-07 | **Last Amended**: 2025-10-07
