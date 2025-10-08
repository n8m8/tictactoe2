# Ultimate Tic Tac Toe

A modern, multiplayer implementation of Ultimate Tic Tac Toe with P2P connections, local multiplayer, and a beautiful whiteboard-inspired design.

## 🎮 Features

### Game Modes
- **Multiplayer**: Play with friends using P2P WebRTC connections via join codes
- **Local Multiplayer**: Two players take turns on the same device
- **Tutorial**: Interactive guide to learn the rules and strategies

### Gameplay
- Real-time P2P game synchronization (no server-side game state)
- Session score tracking across multiple games
- Move history and game state persistence
- Automatic turn switching and win detection

### Design
- Whiteboard-themed UI with marker-style fonts
- Smooth animations for moves and wins
- Fully responsive (mobile, tablet, desktop)
- Dark/light mode support via system preferences

### Technical
- Built with Next.js 14 (App Router)
- TypeScript for type safety
- TailwindCSS for styling
- WebRTC P2P using simple-peer
- Serverless signaling via Next.js API routes

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ LTS
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd tictactoe2

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to play!

### Docker

```bash
# Development
docker-compose -f docker/docker-compose.yml up

# Production build
docker build -f docker/Dockerfile -t ultimate-tictactoe .
docker run -p 3000:3000 ultimate-tictactoe
```

## 🎯 How to Play

Ultimate Tic Tac Toe is played on a 3×3 grid of smaller 3×3 tic-tac-toe boards.

### Basic Rules
1. Players alternate turns (X and O)
2. Win mini-games to claim squares on the main board
3. Get 3 mini-games in a row (horizontally, vertically, or diagonally) to win

### The Special Rule
The cell where you place your mark determines which mini-game your opponent must play next!

For example:
- If you mark the top-right cell of a mini-game
- Your opponent MUST play in the top-right mini-game

If that mini-game is already complete, they can play anywhere.

### Strategy Tips
- Control the center (both on mini-games and the main board)
- Think 2-3 moves ahead
- Force opponents into disadvantageous positions
- Create multiple win threats simultaneously

## 📁 Project Structure

```
tictactoe2/
├── app/                    # Next.js App Router pages
│   ├── api/signaling/     # WebRTC signaling API routes
│   ├── game/              # Multiplayer game page
│   ├── host/              # Host game page
│   ├── join/              # Join game page
│   ├── single-player/     # Local multiplayer (same device)
│   ├── tutorial/          # Interactive tutorial
│   └── options/           # Settings page
├── components/
│   ├── game/              # Game UI components
│   ├── tutorial/          # Tutorial components
│   ├── debug/             # Debug panel
│   └── ui/                # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Core game logic
│   ├── game-rules.ts      # Win detection, validation
│   ├── game-state.ts      # State reducer
│   ├── p2p-connection.ts  # WebRTC P2P manager
│   └── signaling-client.ts # Signaling API client
├── types/                 # TypeScript type definitions
├── public/
│   └── sounds/            # Sound effects (add your own!)
└── specs/                 # Feature specifications
```

## 🔧 Development

### Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm format       # Format code with Prettier
```

### Adding Sound Effects

1. Add MP3 files to `public/sounds/` directory
2. Use the naming convention in `public/sounds/README.md`
3. Sounds will automatically play when enabled in Options

### Debug Mode

Enable debug mode in Options to see:
- Current game phase and turn
- Active mini-game constraints
- Move history
- Connection status
- Mini-game states
- Session scores

## 🎨 Customization

### Fonts

The project uses Bunny Fonts (self-hosted):
- **Permanent Marker**: Headings and markers
- **Caveat**: Body text and handwritten feel

Download from [fonts.bunny.net](https://fonts.bunny.net/) and place in `/public/fonts/`

### Colors

Edit `tailwind.config.ts` to customize the whiteboard theme:
- Background: `#FDFCFA`
- Grid lines: `#E8E6E3`
- Markers: Blue `#0066CC`, Red `#E63946`, Black `#1A1A1A`

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Build command
pnpm build

# Publish directory
.next
```

### Self-Hosted

```bash
# Build
pnpm build

# Start (requires Node.js server)
pnpm start
```

## 🐛 Troubleshooting

### WebRTC Connection Issues
- Check firewall settings
- Ensure both players can access the signaling server
- Try refreshing and creating a new room

### Performance Issues
- Clear browser cache
- Disable debug mode
- Check browser console for errors
- Use production build (`pnpm build && pnpm start`)

## 📝 License

MIT License - feel free to use this project for learning or your own games!

## 🙏 Acknowledgments

- Game concept: Ultimate Tic Tac Toe
- Built with Next.js, React, and TailwindCSS
- WebRTC implementation using simple-peer
- Fonts from Bunny Fonts

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

**Enjoy playing Ultimate Tic Tac Toe! 🎯**
