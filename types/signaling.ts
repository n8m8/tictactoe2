// WebRTC signaling types

export interface WebRTCOffer {
  type: 'offer'
  sdp: string
}

export interface WebRTCAnswer {
  type: 'answer'
  sdp: string
}

export interface ICECandidate {
  candidate: string
  sdpMLineIndex: number
  sdpMid: string
}

export type WebRTCSignal = WebRTCOffer | WebRTCAnswer | ICECandidate

export interface SignalingMessage {
  roomId: string
  token: string
  type: 'offer' | 'answer' | 'ice-candidate'
  signal: WebRTCSignal
  timestamp: number
}

// API response types
export interface CreateRoomResponse {
  sessionId: string
  hostToken: string
  joinCode: string
}

export interface JoinRoomResponse {
  sessionId: string
  guestToken: string
  hostOffer: WebRTCOffer | null
}

export interface SignalResponse {
  success: boolean
}

export interface PollResponse {
  signals: SignalingMessage[]
  timestamp: number
}

// P2P message types
export type P2PMessage =
  | { type: 'move'; seq: number; player: 'X' | 'O'; miniGameIndex: number; cellIndex: number; timestamp: number; resultingState: string }
  | { type: 'sync_request'; lastSeq: number }
  | { type: 'sync_response'; game: any }
  | { type: 'rematch_request'; player: 'X' | 'O' }
  | { type: 'rematch_accept'; player: 'X' | 'O' }
  | { type: 'ping'; timestamp: number }
  | { type: 'pong'; timestamp: number }
  | { type: 'disconnect'; player: 'X' | 'O' }
