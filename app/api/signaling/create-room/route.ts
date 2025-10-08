import { NextRequest, NextResponse } from 'next/server'
import type { CreateRoomRequest, CreateRoomResponse } from '@/types/signaling'

// In-memory storage for rooms (replace with Redis/DB in production)
const rooms = new Map<
  string,
  {
    hostPeerId: string
    guestPeerId?: string
    signals: Array<{ from: string; signal: any }>
    createdAt: number
  }
>()

// Clean up old rooms (older than 1 hour)
setInterval(() => {
  const now = Date.now()
  const oneHour = 60 * 60 * 1000
  for (const [code, room] of rooms.entries()) {
    if (now - room.createdAt > oneHour) {
      rooms.delete(code)
    }
  }
}, 5 * 60 * 1000) // Run every 5 minutes

function generateJoinCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Exclude similar chars
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateRoomRequest

    if (!body.hostPeerId) {
      return NextResponse.json(
        { error: 'hostPeerId is required' },
        { status: 400 }
      )
    }

    // Generate unique join code
    let joinCode: string
    do {
      joinCode = generateJoinCode()
    } while (rooms.has(joinCode))

    // Create room
    rooms.set(joinCode, {
      hostPeerId: body.hostPeerId,
      signals: [],
      createdAt: Date.now(),
    })

    const response: CreateRoomResponse = {
      joinCode,
      hostPeerId: body.hostPeerId,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error creating room:', error)
    return NextResponse.json(
      { error: 'Failed to create room' },
      { status: 500 }
    )
  }
}

// Export rooms for other routes to access
export { rooms }
