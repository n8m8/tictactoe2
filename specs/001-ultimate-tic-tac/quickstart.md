# Quickstart Guide: Ultimate Tic Tac Toe

**Target**: New developers joining the project
**Time to First Run**: <5 minutes
**Prerequisites**: Node.js 20+, pnpm 8+, or Docker

---

## Quick Start (3 Commands)

```bash
git clone <repo-url> tictactoe2
cd tictactoe2
pnpm install && pnpm dev
```

**Open**: http://localhost:3000

---

## Option 1: Local Development (Recommended)

### 1. Prerequisites

- **Node.js**: 20.x LTS or newer ([Download](https://nodejs.org/))
- **pnpm**: 8.x or newer
  ```bash
  npm install -g pnpm
  ```

### 2. Clone & Install

```bash
git clone <repo-url> tictactoe2
cd tictactoe2
pnpm install
```

**Expected output**:
```
Progress: resolved 150, reused 150, downloaded 0, added 150, done
```

### 3. Run Development Server

```bash
pnpm dev
```

**Expected output**:
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
- Environments: .env.local

✓ Ready in 1.2s
```

### 4. Verify Setup

Open http://localhost:3000 in two browser tabs:
- **Tab 1**: Click "Host Game" → Note the 6-character code
- **Tab 2**: Click "Join Game" → Enter the code → Start playing

---

## Option 2: Docker (Cloud-Agnostic)

### 1. Prerequisites

- **Docker**: 20.x or newer ([Download](https://www.docker.com/))
- **Docker Compose**: 2.x or newer (included with Docker Desktop)

### 2. Run with Docker Compose

```bash
git clone <repo-url> tictactoe2
cd tictactoe2
docker-compose up
```

**Expected output**:
```
[+] Running 1/1
 ✔ Container tictactoe2-app-1  Started
app-1  | ▲ Next.js 14.x.x
app-1  | - Local:  http://localhost:3000
app-1  | ✓ Ready in 2.5s
```

**Access**: http://localhost:3000

### Rebuild After Code Changes

```bash
docker-compose up --build
```

---

## Project Structure Overview

```
tictactoe2/
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── page.tsx            # Title screen
│   │   ├── host/page.tsx       # Host game screen
│   │   ├── join/page.tsx       # Join game screen
│   │   ├── play/page.tsx       # Gameplay screen
│   │   ├── api/signaling/      # WebRTC signaling API
│   │   └── layout.tsx          # Root layout (fonts, providers)
│   ├── components/             # React components
│   │   ├── game/               # Game logic components
│   │   ├── ui/                 # Reusable UI elements
│   │   └── animations/         # Animation components
│   ├── lib/                    # Core game logic
│   │   ├── game-state.ts       # State reducer
│   │   ├── game-rules.ts       # Win detection
│   │   └── p2p-connection.ts   # WebRTC logic
│   ├── hooks/                  # React hooks
│   │   ├── useGameState.ts     # Game state management
│   │   ├── useP2PConnection.ts # P2P connection hook
│   │   └── useSoundEffects.ts  # Sound playback
│   └── types/                  # TypeScript types
├── public/
│   ├── sounds/                 # MP3 sound effects
│   └── fonts/                  # Self-hosted Bunny Fonts
├── specs/                      # Feature specifications
│   └── 001-ultimate-tic-tac/   # This feature
│       ├── spec.md             # Requirements
│       ├── plan.md             # Implementation plan
│       ├── research.md         # Technical research
│       ├── data-model.md       # Data structures
│       ├── contracts/          # API specs
│       └── quickstart.md       # This file
├── docker/                     # Docker configuration
├── .eslintrc.json              # ESLint config
├── .prettierrc                 # Prettier config
├── tailwind.config.ts          # TailwindCSS config
├── next.config.js              # Next.js config
└── package.json                # Dependencies
```

---

## Development Workflow

### Making Changes

1. **Edit files** in `/src`:
   - Components: `/src/components/`
   - Game logic: `/src/lib/`
   - Screens: `/src/app/*/page.tsx`

2. **Hot reload** updates automatically (< 1 second)

3. **Check formatting**:
   ```bash
   pnpm format:check  # Check code style
   pnpm format        # Auto-fix formatting
   ```

4. **Run linter**:
   ```bash
   pnpm lint
   ```

### Testing Multiplayer Locally

**Option A: Two Browser Windows**
1. Open http://localhost:3000 in Chrome
2. Open http://localhost:3000 in Firefox (or Chrome Incognito)
3. Host in one, join in the other

**Option B: Mobile + Desktop**
1. Get your local IP: `ifconfig | grep inet` (Mac/Linux) or `ipconfig` (Windows)
2. Desktop: http://localhost:3000
3. Mobile: http://YOUR_IP:3000 (e.g., http://192.168.1.100:3000)

### Adding Sound Effects

1. Place MP3 files in `/public/sounds/`:
   ```
   public/sounds/
   ├── move.mp3        # Square click
   ├── mini-win.mp3    # Mini-game win
   ├── game-win.mp3    # Overall victory
   └── error.mp3       # Invalid move
   ```

2. Sounds auto-load via `useSoundEffects` hook

3. **Recommended specs**:
   - Format: MP3 (128kbps)
   - Duration: 50ms-500ms
   - Size: < 20KB per file

---

## Building for Production

### Build Locally

```bash
pnpm build
```

**Expected output**:
```
Route (app)                    Size     First Load JS
┌ ○ /                          142 B          87.2 kB
├ ○ /host                      1.2 kB         88.3 kB
├ ○ /join                      1.1 kB         88.2 kB
├ ○ /play                      3.4 kB         90.5 kB
└ ○ /tutorial                  2.1 kB         89.2 kB

○  (Static)  prerendered as static HTML
```

**Target**: First Load JS < 150KB (gzipped)

### Deploy to Vercel

```bash
npm install -g vercel
vercel login
vercel --prod
```

**Steps**:
1. Link project (first time only)
2. Build runs automatically
3. Returns production URL: `https://tictactoe2-xyz.vercel.app`

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

### Self-Host with Docker

```bash
docker build -t tictactoe2 -f docker/Dockerfile .
docker run -p 3000:3000 tictactoe2
```

---

## Environment Variables

Create `.env.local` (optional):

```bash
# Development
NODE_ENV=development

# Vercel KV (for signaling server)
# Get from Vercel dashboard after creating KV store
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...

# Optional: Debug mode
NEXT_PUBLIC_DEBUG=false
```

**Note**: Local dev works without KV (in-memory signaling fallback)

---

## Troubleshooting

### Port 3000 Already in Use

```bash
# macOS/Linux
lsof -ti:3000 | xargs kill

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

Or change port:
```bash
PORT=3001 pnpm dev
```

### pnpm install Fails

Clear cache and retry:
```bash
pnpm store prune
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### WebRTC Connection Fails

1. **Check network**: Both devices on same network?
2. **Check firewall**: Allow port 3000
3. **Try TURN server** (if behind strict NAT):
   - Add to `.env.local`:
     ```
     NEXT_PUBLIC_TURN_SERVER=turn:example.com:3478
     NEXT_PUBLIC_TURN_USERNAME=user
     NEXT_PUBLIC_TURN_CREDENTIAL=pass
     ```

### Hot Reload Not Working

1. **Restart dev server**: Ctrl+C → `pnpm dev`
2. **Clear .next cache**:
   ```bash
   rm -rf .next
   pnpm dev
   ```

### Docker Build Slow

Use BuildKit:
```bash
DOCKER_BUILDKIT=1 docker-compose up --build
```

---

## Key Commands Reference

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Run production build |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format code with Prettier |
| `pnpm format:check` | Check code formatting |
| `docker-compose up` | Run with Docker |
| `docker-compose down` | Stop Docker containers |

---

## Next Steps

1. **Read the spec**: [spec.md](./spec.md) - Feature requirements
2. **Read the plan**: [plan.md](./plan.md) - Implementation strategy
3. **Check data model**: [data-model.md](./data-model.md) - Game state structure
4. **Review API contracts**: [contracts/](./contracts/) - Signaling API spec
5. **Run tasks**: `pnpm tasks` - See implementation checklist (after `/speckit.tasks`)

---

## Getting Help

- **Constitution**: `/.specify/memory/constitution.md` - Project principles
- **Issues**: GitHub Issues (if public repo)
- **Documentation**: `/specs/001-ultimate-tic-tac/` - All design docs

---

**Time from clone to running game: < 5 minutes** ✅

Meets Constitution Principle III: Developer-First Deployment
