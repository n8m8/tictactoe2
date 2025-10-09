import { NextRequest, NextResponse } from 'next/server'
import type { SignalRequest, SignalResponse } from '@/types/signaling'
import { getRoom, setRoom } from '@/lib/signaling-storage'

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

    // Retry logic to handle race conditions
    let retries = 3
    let success = false

    while (retries > 0 && !success) {
      const room = await getRoom(joinCode)

      if (!room) {
        console.error(`[SIGNAL] Room not found: ${joinCode}`)
        return NextResponse.json({ error: 'Room not found' }, { status: 404 })
      }

      // Verify sender is part of the room
      if (body.from !== room.hostPeerId && body.from !== room.guestPeerId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
      }

      // Store signal with current count for verification
      const previousCount = room.signals.length
      room.signals.push({
        from: body.from,
        signal: body.signal,
      })

      try {
        await setRoom(joinCode, room)
        success = true

        const isHost = body.from === room.hostPeerId
        console.log(`[SIGNAL] ${isHost ? 'HOST' : 'GUEST'} sent ${body.signal.type || (body.signal.candidate ? 'candidate' : 'unknown')} (${previousCount} -> ${room.signals.length})`)
      } catch (error) {
        retries--
        if (retries === 0) throw error
        // Brief delay before retry
        await new Promise(resolve => setTimeout(resolve, 10))
      }
    }

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
