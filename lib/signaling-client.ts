import type {
  CreateRoomRequest,
  CreateRoomResponse,
  JoinRoomRequest,
  JoinRoomResponse,
  SignalRequest,
  SignalResponse,
  PollRequest,
  PollResponse,
} from '@/types/signaling'

/**
 * Client for interacting with the signaling server
 */
export class SignalingClient {
  private baseUrl: string
  private pollingInterval?: NodeJS.Timeout
  private lastSeq = -1
  private guestJoinedNotified = false

  constructor(baseUrl = '/api/signaling') {
    this.baseUrl = baseUrl
  }

  /**
   * Create a new room and get a join code
   */
  async createRoom(hostPeerId: string): Promise<CreateRoomResponse> {
    const request: CreateRoomRequest = { hostPeerId }

    const response = await fetch(`${this.baseUrl}/create-room`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create room')
    }

    return response.json()
  }

  /**
   * Join an existing room with a join code
   */
  async joinRoom(
    joinCode: string,
    guestPeerId: string
  ): Promise<JoinRoomResponse> {
    const request: JoinRoomRequest = { joinCode, guestPeerId }

    const response = await fetch(`${this.baseUrl}/join-room`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to join room')
    }

    return response.json()
  }

  /**
   * Send a WebRTC signal to the signaling server
   */
  async sendSignal(
    joinCode: string,
    from: string,
    signal: any
  ): Promise<SignalResponse> {
    const request: SignalRequest = { joinCode, from, signal }

    const response = await fetch(`${this.baseUrl}/signal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to send signal')
    }

    return response.json()
  }

  /**
   * Poll for new signals from the signaling server
   */
  async pollSignals(
    joinCode: string,
    peerId: string,
    lastSeq?: number
  ): Promise<PollResponse> {
    const request: PollRequest = {
      joinCode,
      peerId,
      lastSeq: lastSeq ?? this.lastSeq,
    }

    const response = await fetch(`${this.baseUrl}/poll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to poll signals')
    }

    const data = await response.json()

    // Update lastSeq if we got new signals
    if (data.signals.length > 0) {
      this.lastSeq += data.signals.length
    }

    return data
  }

  /**
   * Start polling for signals at regular intervals
   */
  startPolling(
    joinCode: string,
    peerId: string,
    onSignal: (signal: any) => void,
    onGuestJoined?: () => void,
    intervalMs = 1000
  ): void {
    this.stopPolling()
    this.guestJoinedNotified = false

    this.pollingInterval = setInterval(async () => {
      try {
        const response = await this.pollSignals(joinCode, peerId)

        // Handle new signals
        for (const signal of response.signals) {
          onSignal(signal)
        }

        // Handle guest joined (only notify once)
        if (response.guestJoined && onGuestJoined && !this.guestJoinedNotified) {
          this.guestJoinedNotified = true
          console.log('[SignalingClient] Guest joined - notifying')
          onGuestJoined()
        }
      } catch (error) {
        console.error('Polling error:', error)
      }
    }, intervalMs)
  }

  /**
   * Stop polling for signals
   */
  stopPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval)
      this.pollingInterval = undefined
    }
    this.lastSeq = -1
    this.guestJoinedNotified = false
  }
}
