/**
 * Shared storage for signaling server
 * Uses Redis when configured, in-memory Map otherwise
 */

import { redisClient, useKV } from './redis-client'

export type RoomData = {
  hostPeerId: string
  guestPeerId?: string
  signals: Array<{ from: string; signal: any }>
  createdAt: number
}

const ROOM_TTL = 60 * 60 // 1 hour in seconds

// In-memory fallback: Use global scope to persist across Next.js hot reloads
const globalForRooms = globalThis as unknown as {
  rooms: Map<string, RoomData> | undefined
}

const devRooms = globalForRooms.rooms ?? new Map<string, RoomData>()

if (!useKV) {
  globalForRooms.rooms = devRooms
}

/**
 * Get room data by join code
 */
export async function getRoom(joinCode: string): Promise<RoomData | null> {
  if (useKV && redisClient) {
    return await redisClient.get<RoomData>(`room:${joinCode}`)
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
  if (useKV && redisClient) {
    console.log('[Redis] Setting room:', joinCode)
    try {
      await redisClient.set(`room:${joinCode}`, data, { ex: ROOM_TTL })
      console.log('[Redis] Room set successfully')
    } catch (error) {
      console.error('[Redis] Failed to set room:', error)
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
  if (useKV && redisClient) {
    try {
      const exists = await redisClient.exists(`room:${joinCode}`)
      return exists === 1
    } catch (error) {
      console.error('[Redis] Failed to check room existence:', error)
      throw error
    }
  }
  return devRooms.has(joinCode)
}

/**
 * Delete room
 */
export async function deleteRoom(joinCode: string): Promise<void> {
  if (useKV && redisClient) {
    await redisClient.del(`room:${joinCode}`)
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
