/**
 * Shared storage for signaling server
 * In-memory storage for rooms (replace with Redis/DB in production)
 */

export const rooms = new Map<
  string,
  {
    hostPeerId: string
    guestPeerId?: string
    signals: Array<{ from: string; signal: any }>
    createdAt: number
  }
>()

// Clean up old rooms (older than 1 hour)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    const oneHour = 60 * 60 * 1000
    for (const [code, room] of rooms.entries()) {
      if (now - room.createdAt > oneHour) {
        rooms.delete(code)
      }
    }
  }, 5 * 60 * 1000) // Run every 5 minutes
}
