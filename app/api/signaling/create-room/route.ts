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
    console.log('[CREATE-ROOM] Request received')
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
    const roomData = {
      hostPeerId: body.hostPeerId,
      signals: [],
      createdAt: Date.now(),
    }

    console.log(`[CREATE-ROOM] Creating room ${joinCode} for host ${body.hostPeerId}`)
    await setRoom(joinCode, roomData)

    // Verify room was created
    const verifyRoom = await hasRoom(joinCode)
    console.log(`[CREATE-ROOM] Room ${joinCode} exists after creation: ${verifyRoom}`)

    const response: CreateRoomResponse = {
      joinCode,
      hostPeerId: body.hostPeerId,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error creating room:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to create room'
    return NextResponse.json(
      {
        error: 'Failed to create room',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
}
