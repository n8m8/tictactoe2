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

// API request types
export interface CreateRoomRequest {
  hostPeerId: string
}

export interface JoinRoomRequest {
  joinCode: string
  guestPeerId: string
}

export interface SignalRequest {
  joinCode: string
  from: string
  signal: any
}

export interface PollRequest {
  joinCode: string
  peerId: string
  lastSeq?: number
}

// API response types
export interface CreateRoomResponse {
  joinCode: string
  hostPeerId: string
}

export interface JoinRoomResponse {
  joinCode: string
  hostPeerId: string
  guestPeerId: string
}

export interface SignalResponse {
  success: boolean
}

export interface PollResponse {
  signals: any[]
  guestJoined: boolean
}

// P2P message types
export type P2PMessage =
  | { type: 'game-action'; action: import('@/types/game').GameAction; timestamp: number }
  | { type: 'chat'; text: string; timestamp: number }
