import { NextRequest, NextResponse } from 'next/server'
import type { PollRequest, PollResponse } from '@/types/signaling'
import { rooms } from '@/lib/signaling-storage'

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as PollRequest

    if (!body.joinCode || !body.peerId) {
      return NextResponse.json(
        { error: 'joinCode and peerId are required' },
        { status: 400 }
      )
    }

    const joinCode = body.joinCode.toUpperCase()
    const room = rooms.get(joinCode)

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    // Verify requester is part of the room
    if (body.peerId !== room.hostPeerId && body.peerId !== room.guestPeerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const lastSeq = body.lastSeq ?? -1

    // Get signals for this peer (signals from the other peer)
    const signalsForPeer = room.signals.filter(
      (s) => s.from !== body.peerId
    )

    // Get new signals since lastSeq
    const newSignals = signalsForPeer.slice(lastSeq + 1).map((s) => s.signal)

    const response: PollResponse = {
      signals: newSignals,
      guestJoined: !!room.guestPeerId,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error polling signals:', error)
    return NextResponse.json(
      { error: 'Failed to poll signals' },
      { status: 500 }
    )
  }
}
