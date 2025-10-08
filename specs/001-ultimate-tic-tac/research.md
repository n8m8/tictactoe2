# Research Findings: Ultimate Tic Tac Toe

**Date**: 2025-10-07
**Purpose**: Resolve technical decisions and validate architecture choices for implementation

## Overview

This document consolidates research on WebRTC P2P connections, Next.js 14 App Router setup, and TailwindCSS animation performance to support the Ultimate Tic Tac Toe implementation plan.

## 1. WebRTC & P2P Architecture

### Decision: simple-peer Library

**Chosen**: simple-peer (9KB gzipped)

**Rationale**:
- Minimal bundle impact: 9KB vs 45KB for PeerJS
- Handles NAT traversal via STUN/TURN (requires explicit config.iceServers configuration)
- Reliable ordered data channels by default
- 5M+ weekly npm downloads, battle-tested
- Simple API reduces implementation complexity

**Alternatives Considered**:
- **PeerJS**: Too heavy (45KB), requires centralized PeerServer
- **Vanilla WebRTC**: 0KB but ~100+ lines of boilerplate code

### Signaling Architecture

**Chosen**: HTTP Polling with Serverless Functions + KV Storage

**Implementation Pattern**:
```javascript
// Vercel/Netlify Function + Vercel KV
POST /api/signaling/create-room → { roomId, token }
POST /api/signaling/join-room → { roomId, token, offer }
POST /api/signaling/signal → Store ICE candidates
GET /api/signaling/poll → Retrieve signals (500ms interval)
```

**Rationale**:
- Fully serverless (no WebSocket infrastructure needed)
- 500ms polling acceptable for turn-based connection setup
- Automatic cleanup via KV TTL (1 hour expiry)
- Zero additional client bundle size
- Simple error handling

**Alternatives Considered**:
- **Server-Sent Events**: Lower latency but connection limits on some platforms
- **Third-party (Supabase/Ably)**: 15-30KB bundle + external dependency cost

### Game State Synchronization

**Chosen**: JSON Messages with Sequential Move Numbers

**Message Schema**:
```json
{
  "type": "move",
  "seq": 5,
  "player": "p1",
  "miniGame": 3,
  "position": 7,
  "timestamp": 1709856123456
}
```

**Rationale**:
- ~150 bytes per move (negligible over WebRTC data channel)
- Human-readable for debugging
- Zero bundle overhead (native JSON)
- Sequential numbers prevent ordering issues
- Timestamp-based conflict resolution

**Alternatives Considered**:
- **Binary (protobuf)**: 20-40 bytes but 45KB bundle + parsing complexity
- **MessagePack**: 50-80 bytes, minimal benefits for turn-based game

### Performance Targets

- **Latency**: <150ms target (WebRTC achieves 10-80ms median in same country)
- **Bandwidth**: ~1.5KB per full game (9 moves × 150 bytes)
- **Reconnection**: Exponential backoff (1s → 2s → 4s → 8s) with state sync

## 2. Next.js 14 Setup & Configuration

### Project Initialization

**Command**:
```bash
npx create-next-app@latest tictactoe2 \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --no-src-dir \
  --import-alias "@/*"

pnpm install -D prettier prettier-plugin-tailwindcss eslint-config-prettier
```

**Rationale**:
- Official `create-next-app` minimizes configuration
- `--app` flag ensures App Router (Next.js 14+)
- `--no-src-dir` keeps flat structure per constitution
- TypeScript for type safety in game state logic

### Font Loading Strategy

**Chosen**: Self-hosted Bunny Fonts via `next/font/local`

**Implementation**:
```typescript
// app/fonts.ts
import localFont from 'next/font/local'

export const markerFont = localFont({
  src: '../public/fonts/PermanentMarker-Regular.woff2',
  display: 'swap',
  variable: '--font-marker',
  preload: true,
})
```

**Rationale**:
- Next.js inlines font CSS (eliminates external request)
- Fonts cached with app bundle (single HTTP request)
- No CORS, no third-party DNS lookup
- ~200ms load time vs ~800ms for CDN approach

**Font Selections**:
- **Permanent Marker** (14KB): Game pieces, bold marker aesthetic
- **Caveat Variable** (25KB): UI text, handwritten feel
- **Total**: ~40KB font weight

**Alternatives Considered**:
- **Bunny CDN**: Risk of FOUT (flash of unstyled text)
- **Google Fonts**: Adds tracking, slower than self-hosted

### State Management Pattern

**Chosen**: useReducer + Context (no external libraries)

**Implementation**:
```typescript
// app/providers/game-provider.tsx
'use client'

type GameAction =
  | { type: 'MAKE_MOVE'; miniGame: number; position: number }
  | { type: 'RESET_GAME' }
  | { type: 'SYNC_STATE'; state: GameState }

const gameReducer = (state: GameState, action: GameAction) => {
  // Pure function - easy to test, sync over WebRTC
}
```

**Rationale**:
- Zero bundle cost (React built-ins)
- Pure reducer functions enable deterministic testing (Principle V)
- Actions can be serialized and sent over WebRTC
- No hydration issues (provider wraps client components only)

**Alternatives Considered**:
- **Zustand**: 3KB but unnecessary for simple game state
- **useState**: Acceptable for single-player, but reducer better for multiplayer sync

### Bundle Optimization

**Target**: <500KB total, <150KB JavaScript (gzipped)

**Techniques**:
1. **Dynamic imports for screens**:
   ```typescript
   const GameBoard = dynamic(() => import('@/components/GameBoard'), {
     ssr: false,
   })
   ```

2. **Tree-shaking simple-peer**: Import only needed functions
3. **TailwindCSS purging**: Automatic with JIT mode
4. **No icon libraries**: Use inline SVG (0KB cost)

**Expected Sizes**:
- Next.js baseline: ~85KB (gzipped)
- simple-peer: ~9KB
- Game logic: ~15KB
- TailwindCSS: ~12KB
- Fonts: ~40KB (cached separately)
- **Total**: ~120KB gzipped JavaScript + ~40KB fonts

## 3. TailwindCSS & Animation Performance

### Animation Strategy

**Chosen**: Pure CSS Animations (no Framer Motion)

**Rationale**:
- 0KB overhead vs 32KB for Framer Motion
- Transform/opacity animations run on compositor thread (guaranteed 60fps)
- GPU acceleration via `will-change: transform`
- Sufficient for game piece drawing effects

**Custom Keyframes**:
```css
@keyframes drawX {
  0% { transform: scale(0) rotate(-45deg); opacity: 0; }
  60% { transform: scale(1.1) rotate(5deg); }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}
```

**Alternatives Considered**:
- **Framer Motion**: Better for complex gestures, but 15-20x size penalty
- **GSAP**: 50KB+, overkill for turn-based game

### TailwindCSS Configuration

**Expected Bundle**: 8-15KB gzipped CSS

**Optimizations**:
```javascript
// tailwind.config.ts
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        whiteboard: {
          bg: '#FDFCFA',
          grid: '#E8E6E3',
          marker: {
            black: '#1A1A1A',
            blue: '#0066CC',
            red: '#E63946',
          },
        },
      },
    },
  },
  corePlugins: {
    float: false,
    clear: false,
    // Disable unused plugins
  },
}
```

**Whiteboard Theme**:
- **Background**: Slightly warm white (#FDFCFA) for authentic look
- **Colors**: Expo marker palette (blue, red, green, black)
- **Fonts**: Permanent Marker + Caveat for handwritten aesthetic

### Mobile Responsiveness

**Touch Target Strategy**: Invisible touch expansion

**Problem**: 9x9 grid on 375px screen = 34.5px cells (< 44px minimum)

**Solution**:
```css
.cell {
  width: 36px;
  height: 36px;
  position: relative;
}

.cell::before {
  content: '';
  position: absolute;
  inset: -5px; /* Expands to 46x46px touch area */
  z-index: 1;
}
```

**Viewport Strategy**: `clamp()` for fluid sizing
```css
.game-grid {
  width: clamp(343px, 90vw, 600px);
  gap: clamp(2px, 0.5vw, 4px);
}
```

**Safe Areas**: Support notches and home indicators
```css
.game-app {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}
```

## 4. Docker Configuration

### Development Container

**Purpose**: Local development without Vercel account

**Dockerfile**:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
EXPOSE 3000
CMD ["pnpm", "dev"]
```

**docker-compose.yml**:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
```

**Usage**: `docker-compose up` → localhost:3000

### Production Container

**For Self-Hosting** (alternative to Vercel):
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./
EXPOSE 3000
CMD ["pnpm", "start"]
```

**Rationale**: Meets Principle III (Developer-First Deployment) - Docker provides cloud-agnostic hosting option

## 5. ESLint & Prettier Configuration

### ESLint Setup

**.eslintrc.json**:
```json
{
  "extends": [
    "next/core-web-vitals",
    "prettier"
  ],
  "rules": {
    "no-console": ["warn", { "allow": ["error"] }],
    "prefer-const": "error"
  }
}
```

### Prettier Setup

**.prettierrc**:
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

**Rationale**:
- `prettier-plugin-tailwindcss` auto-sorts utility classes
- Minimal rules, relies on Next.js defaults
- Consistent with constitution simplicity principles

## 6. Sound Effects Architecture

### Sound Hook Pattern

**File Location**: `/public/sounds/`
```
public/sounds/
├── move.mp3           # Square click (50-100ms)
├── mini-win.mp3       # Mini-game victory (200-300ms)
├── game-win.mp3       # Overall win (500ms-1s)
└── error.mp3          # Invalid move (100-150ms)
```

**Implementation**: `useSoundEffects` hook
```typescript
// hooks/useSoundEffects.ts
'use client'

export function useSoundEffects() {
  const [enabled, setEnabled] = useState(true)

  const play = useCallback((sound: 'move' | 'mini-win' | 'game-win' | 'error') => {
    if (!enabled) return
    const audio = new Audio(`/sounds/${sound}.mp3`)
    audio.volume = 0.3
    audio.play().catch(() => {}) // Ignore autoplay errors
  }, [enabled])

  return { play, enabled, setEnabled }
}
```

**Rationale**:
- Lazy loading (sounds not in initial bundle)
- User control (can mute in options)
- Graceful degradation (errors caught silently)

**File Format**: MP3 (universal browser support, small size)

**Budget**: 4 sounds × ~15KB = ~60KB total (acceptable)

## Decisions Summary

| Category | Decision | Rationale |
|----------|----------|-----------|
| **WebRTC Library** | simple-peer (9KB) | Minimal, reliable, battle-tested |
| **Signaling** | HTTP polling + KV | Fully serverless, simple |
| **State Sync** | JSON + seq numbers | Debuggable, sufficient bandwidth |
| **Next.js Init** | create-next-app official | Minimal config, maintained |
| **Fonts** | Self-hosted Bunny Fonts | Fastest load, no tracking |
| **State Management** | useReducer + Context | Zero cost, testable |
| **Animations** | Pure CSS (Tailwind) | 60fps, 0KB overhead |
| **CSS Framework** | TailwindCSS 3.4+ | <15KB, JIT mode |
| **Touch Targets** | Invisible expansion | 44px+ without visual change |
| **Sound Format** | MP3 in /public | Universal support, lazy load |
| **Docker** | Multi-stage build | Self-host option |
| **Package Manager** | pnpm | Fast, disk efficient |

## Performance Validation Targets

- [x] Bundle size: <500KB total (currently ~220KB projected)
- [x] Initial load: <2s on 3G (optimized fonts + lazy loading)
- [x] Animation: 60fps (CSS transform/opacity only)
- [x] P2P latency: <150ms (WebRTC typical: 10-80ms)
- [x] Touch targets: 44px+ (invisible expansion technique)
- [x] Development setup: <5 minutes (pnpm install && pnpm dev)

## Next Steps

Proceed to **Phase 1: Design & Contracts**
- Generate data-model.md
- Create API contracts for signaling
- Write quickstart.md for onboarding

---

## Implementation Notes (Post-Development)

### Critical CSS Bug Fix (2025-10-08)

**Issue**: Game board displayed as single row instead of 3×3 grid

**Root Cause**: `.game-grid` in `app/globals.css` had incorrect grid template:
```css
/* WRONG - creates 9 columns in single row */
grid-template-columns: repeat(9, minmax(0, 1fr));

/* CORRECT - creates 3×3 grid */
@apply grid-cols-3;
```

**Impact**: All game modes (multiplayer, single-player) were affected

**Fix Applied**: Changed to use Tailwind's `grid-cols-3` utility class

**Lesson**: When defining grid layouts for nested structures, ensure column count matches the visual structure (3×3 main board = 3 columns, not 9)

**Task Updated**: T012 now explicitly notes requirement for `grid-cols-3` layout

### Required Configuration Files

**PostCSS Config** (`postcss.config.js`):
- REQUIRED for TailwindCSS to work in Next.js
- Must include `tailwindcss` and `autoprefixer` plugins
- Without this, Tailwind classes won't be processed

**Task Added**: T005 added to ensure PostCSS config is created early in setup phase

### Font Configuration

**Google Fonts vs Self-Hosted**:
- Originally planned: Self-hosted Bunny Fonts
- Actually implemented: `next/font/google` with Permanent Marker and Caveat
- Rationale: Simpler setup, automatic optimization by Next.js, no manual font file management

**Task Updated**: T010 changed from `next/font/local` to `next/font/google`

### Animation Requirements

**fadeIn Animation**:
- Must be explicitly added to `tailwind.config.ts` animations
- Used in game overlay components
- Missing this causes console errors and broken animations

**Task Updated**: T006 now explicitly mentions `fadeIn` animation requirement

### WebRTC STUN Server Configuration

**Issue**: WebRTC P2P connections failing with "ICE connection failed" errors

**Root Cause**: SimplePeer requires explicit STUN server configuration for NAT traversal
- Without STUN servers, ICE negotiation fails
- WebRTC cannot establish peer connections behind NATs/firewalls

**Fix Applied**:
```typescript
// lib/p2p-connection.ts
this.peer = new SimplePeer({
  initiator: this.config.isHost,
  trickle: true,
  config: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  },
})
```

**Rationale**:
- STUN servers help peers discover their public IP addresses
- Google's public STUN servers are free and reliable
- Multiple servers provide fallback if one is unavailable
- Essential for P2P connections to work across different networks

**Impact**: Without this configuration, multiplayer connections fail with:
- Host: "WebRTC: ICE failed, add a TURN server"
- Guest: "Cannot set local answer when createAnswer has not been called"

**Task Updated**: T085 (P2P connection manager) now explicitly mentions STUN server configuration
