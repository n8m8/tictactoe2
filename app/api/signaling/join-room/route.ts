import { NextRequest, NextResponse } from 'next/server'
import type { JoinRoomRequest, JoinRoomResponse } from '@/types/signaling'
import { rooms } from '@/lib/signaling-storage'

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as JoinRoomRequest

    if (!body.joinCode || !body.guestPeerId) {
      return NextResponse.json(
        { error: 'joinCode and guestPeerId are required' },
        { status: 400 }
      )
    }

    const joinCode = body.joinCode.toUpperCase()
    const room = rooms.get(joinCode)

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    if (room.guestPeerId) {
      return NextResponse.json({ error: 'Room is full' }, { status: 409 })
    }

    // Add guest to room
    room.guestPeerId = body.guestPeerId

    const response: JoinRoomResponse = {
      joinCode,
      hostPeerId: room.hostPeerId,
      guestPeerId: body.guestPeerId,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error joining room:', error)
    return NextResponse.json(
      { error: 'Failed to join room' },
      { status: 500 }
    )
  }
}
