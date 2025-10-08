import { NextRequest, NextResponse } from 'next/server'
import type { CreateRoomRequest, CreateRoomResponse } from '@/types/signaling'
import { hasRoom, setRoom } from '@/lib/signaling-storage'

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
    } while (await hasRoom(joinCode))

    // Create room
    await setRoom(joinCode, {
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
