# TURN Server Configuration

The app currently uses free public TURN servers, which can be unreliable. For production use, you should set up your own TURN servers.

## Free TURN Server Options (50GB/month)

### Option 1: Twilio (Recommended)
1. Sign up at https://www.twilio.com/console
2. Go to **Network Traversal Service**
3. Create a token
4. Add to `lib/p2p-connection.ts`:

```typescript
{
  urls: 'turn:global.turn.twilio.com:3478?transport=tcp',
  username: 'YOUR_TWILIO_USERNAME',
  credential: 'YOUR_TWILIO_CREDENTIAL',
}
```

### Option 2: Metered.ca
1. Sign up at https://dashboard.metered.ca/signup
2. Get your credentials
3. Add to `lib/p2p-connection.ts`:

```typescript
{
  urls: 'turn:a.relay.metered.ca:80',
  username: 'YOUR_USERNAME',
  credential: 'YOUR_CREDENTIAL',
}
```

## Current Configuration

The app uses these free public TURN servers:
- **Numb** (numb.viagenie.ca)
- **Metered Open Relay** (a.relay.metered.ca)

These work for testing but may be rate-limited or unavailable.

## Testing Locally

When testing on localhost (same machine), WebRTC should work without TURN servers using direct peer connections.

## Troubleshooting

If connections fail:
1. Check browser console for ICE connection state
2. Visit `chrome://webrtc-internals` (Chrome) or `about:webrtc` (Firefox)
3. Look for "ICE candidate pairs" - if none succeed, TURN servers are the issue
4. Set up proper TURN servers (Twilio recommended)
