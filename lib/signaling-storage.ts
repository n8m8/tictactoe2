/**
 * Shared storage for signaling server
 * Uses Vercel KV (Redis) in production, in-memory Map in development
 */

import { kv } from '@vercel/kv'

export type RoomData = {
  hostPeerId: string
  guestPeerId?: string
  signals: Array<{ from: string; signal: any }>
  createdAt: number
}

// Use KV if environment variables are present, otherwise use in-memory storage
const useKV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
const ROOM_TTL = 60 * 60 // 1 hour in seconds

// In-memory fallback: Use global scope to persist across Next.js hot reloads
const globalForRooms = globalThis as unknown as {
  rooms: Map<string, RoomData> | undefined
}

const devRooms = globalForRooms.rooms ?? new Map<string, RoomData>()

if (!useKV) {
  globalForRooms.rooms = devRooms
  console.log('[Storage] Using in-memory storage (KV not configured)')
} else {
  console.log('[Storage] Using Vercel KV storage')
}

/**
 * Get room data by join code
 */
export async function getRoom(joinCode: string): Promise<RoomData | null> {
  if (useKV) {
    return await kv.get<RoomData>(`room:${joinCode}`)
  }
  return devRooms.get(joinCode) ?? null
}

/**
 * Set room data with TTL
 */
export async function setRoom(
  joinCode: string,
  data: RoomData
): Promise<void> {
  if (useKV) {
    console.log('[KV] Setting room:', joinCode, 'useKV:', useKV)
    try {
      await kv.set(`room:${joinCode}`, data, { ex: ROOM_TTL })
      console.log('[KV] Room set successfully')
    } catch (error) {
      console.error('[KV] Failed to set room:', error)
      throw error
    }
  } else {
    devRooms.set(joinCode, data)
  }
}

/**
 * Check if room exists
 */
export async function hasRoom(joinCode: string): Promise<boolean> {
  if (useKV) {
    try {
      const exists = await kv.exists(`room:${joinCode}`)
      return exists === 1
    } catch (error) {
      console.error('[KV] Failed to check room existence:', error)
      throw error
    }
  }
  return devRooms.has(joinCode)
}

/**
 * Delete room
 */
export async function deleteRoom(joinCode: string): Promise<void> {
  if (useKV) {
    await kv.del(`room:${joinCode}`)
  } else {
    devRooms.delete(joinCode)
  }
}

// In-memory storage only: Clean up old rooms (older than 1 hour)
if (!useKV && typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    const oneHour = 60 * 60 * 1000
    for (const [code, room] of devRooms.entries()) {
      if (now - room.createdAt > oneHour) {
        devRooms.delete(code)
      }
    }
  }, 5 * 60 * 1000) // Run every 5 minutes
}
