/**
 * Shared storage for signaling server
 * In-memory storage for rooms (replace with Redis/DB in production)
 *
 * IMPORTANT: Using global scope to persist across Next.js hot reloads
 */

type RoomData = {
  hostPeerId: string
  guestPeerId?: string
  signals: Array<{ from: string; signal: any }>
  createdAt: number
}

// Use global scope to persist across Next.js module reloads
const globalForRooms = globalThis as unknown as {
  rooms: Map<string, RoomData> | undefined
}

export const rooms = globalForRooms.rooms ?? new Map<string, RoomData>()

if (process.env.NODE_ENV !== 'production') {
  globalForRooms.rooms = rooms
}

// Clean up old rooms (older than 1 hour)
if (typeof setInterval !== 'undefined' && !globalForRooms.rooms) {
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
