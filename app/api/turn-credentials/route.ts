import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const apiKey = process.env.METERED_API_KEY

    if (!apiKey) {
      console.error('[TURN] METERED_API_KEY not configured')
      // Return fallback STUN servers if no API key
      return NextResponse.json([
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ])
    }

    const response = await fetch(
      `https://natle.metered.live/api/v1/turn/credentials?apiKey=${apiKey}`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch TURN credentials')
    }

    const iceServers = await response.json()
    console.log('[TURN] Fetched credentials successfully')

    return NextResponse.json(iceServers)
  } catch (error) {
    console.error('[TURN] Error fetching credentials:', error)
    // Return fallback STUN servers on error
    return NextResponse.json([
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ])
  }
}
