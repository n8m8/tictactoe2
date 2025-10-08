# Vercel Deployment Setup

## Prerequisites

- Vercel account
- GitHub repository (already created at n8m8/tictactoe2)

## Deployment Steps

### 1. Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select `n8m8/tictactoe2`
4. Vercel will auto-detect Next.js settings
5. **DON'T DEPLOY YET** - first add KV storage

### 2. Add Vercel KV Storage

1. In your Vercel project, go to **Storage** tab
2. Click **Create Database**
3. Select **KV (Redis)**
4. Choose a name (e.g., `tictactoe2-signaling`)
5. Select your region (same as deployment for lower latency)
6. Click **Create**

Vercel will automatically set these environment variables:
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`
- `KV_URL`

### 3. Deploy

1. Go to **Deployments** tab
2. Click **Deploy** or push to your GitHub branch
3. Vercel will build and deploy with KV automatically connected

## How It Works

**Development** (localhost):
- Uses in-memory Map storage
- Rooms persist across hot reloads via globalThis
- No Redis/KV needed

**Production** (Vercel):
- Uses Vercel KV (Redis) automatically
- Rooms stored with 1-hour TTL
- Persists across Lambda cold starts

The code automatically detects `NODE_ENV=production` and switches to KV.

## Testing

1. Open your Vercel deployment URL
2. Click "Host Game" - you should see a join code
3. Open in another browser/device
4. Enter join code and click "Join Game"
5. Both players should connect successfully

If you see "Room not found" errors, check that KV is properly connected in Vercel dashboard.
