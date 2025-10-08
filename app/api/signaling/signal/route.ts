import { NextRequest, NextResponse } from 'next/server'
import type { SignalRequest, SignalResponse } from '@/types/signaling'
import { rooms } from '@/lib/signaling-storage'

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SignalRequest

    if (!body.joinCode || !body.from || !body.signal) {
      return NextResponse.json(
        { error: 'joinCode, from, and signal are required' },
        { status: 400 }
      )
    }

    const joinCode = body.joinCode.toUpperCase()
    const room = rooms.get(joinCode)

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    // Verify sender is part of the room
    if (body.from !== room.hostPeerId && body.from !== room.guestPeerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Store signal
    room.signals.push({
      from: body.from,
      signal: body.signal,
    })

    const response: SignalResponse = {
      success: true,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error sending signal:', error)
    return NextResponse.json(
      { error: 'Failed to send signal' },
      { status: 500 }
    )
  }
}
