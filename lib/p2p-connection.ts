import SimplePeer from 'simple-peer'
import type { P2PMessage } from '@/types/signaling'
import type { GameAction } from '@/types/game'
import { SignalingClient } from './signaling-client'

export type ConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'failed'

export interface P2PConnectionConfig {
  isHost: boolean
  joinCode: string
  peerId: string
  onMessage: (message: P2PMessage) => void
  onStatusChange: (status: ConnectionStatus) => void
  onError?: (error: Error) => void
}

/**
 * Manages WebRTC P2P connection for game communication
 */
export class P2PConnection {
  private peer?: SimplePeer.Instance
  private signalingClient: SignalingClient
  private config: P2PConnectionConfig
  private status: ConnectionStatus = 'disconnected'
  private signalQueue: any[] = []
  private isProcessingQueue = false

  constructor(config: P2PConnectionConfig) {
    this.config = config
    this.signalingClient = new SignalingClient()
  }

  /**
   * Initialize the P2P connection
   */
  async connect(): Promise<void> {
    try {
      this.updateStatus('connecting')

      if (this.config.isHost) {
        // Host: Wait for guest to join before creating peer
        console.log('[HOST] Waiting for guest to join...')
        this.signalingClient.startPolling(
          this.config.joinCode,
          this.config.peerId,
          (signal) => this.handleIncomingSignal(signal),
          () => this.initializePeer(), // Create peer when guest joins
          1000
        )
      } else {
        // Guest: Create peer immediately
        console.log('[GUEST] Creating peer and connecting...')
        this.initializePeer()

        // Start polling for signals from host
        this.signalingClient.startPolling(
          this.config.joinCode,
          this.config.peerId,
          (signal) => this.handleIncomingSignal(signal),
          undefined,
          1000
        )
      }
    } catch (error) {
      this.handleError(error as Error)
    }
  }

  private initializePeer(): void {
    if (this.peer) {
      console.log('Peer already initialized')
      return
    }

    console.log(
      `[${this.config.isHost ? 'HOST' : 'GUEST'}] Initializing SimplePeer...`
    )

    // Create SimplePeer instance
    this.peer = new SimplePeer({
      initiator: this.config.isHost,
      trickle: true,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          {
            urls: 'turn:openrelay.metered.ca:80',
            username: 'openrelayproject',
            credential: 'openrelayproject',
          },
          {
            urls: 'turn:openrelay.metered.ca:443',
            username: 'openrelayproject',
            credential: 'openrelayproject',
          },
        ],
      },
    })

    // Set up peer event handlers
    this.setupPeerHandlers()
  }

  /**
   * Send a game action to the other peer
   */
  sendAction(action: GameAction): void {
    if (!this.peer || this.status !== 'connected') {
      console.error('Cannot send action: not connected')
      return
    }

    const message: P2PMessage = {
      type: 'game-action',
      action,
      timestamp: Date.now(),
    }

    try {
      this.peer.send(JSON.stringify(message))
    } catch (error) {
      console.error('Error sending action:', error)
    }
  }

  /**
   * Send a chat message to the other peer
   */
  sendChatMessage(text: string): void {
    if (!this.peer || this.status !== 'connected') {
      console.error('Cannot send message: not connected')
      return
    }

    const message: P2PMessage = {
      type: 'chat',
      text,
      timestamp: Date.now(),
    }

    try {
      this.peer.send(JSON.stringify(message))
    } catch (error) {
      console.error('Error sending chat message:', error)
    }
  }

  /**
   * Disconnect and clean up
   */
  disconnect(): void {
    this.signalingClient.stopPolling()

    if (this.peer) {
      this.peer.destroy()
      this.peer = undefined
    }

    this.updateStatus('disconnected')
  }

  /**
   * Get current connection status
   */
  getStatus(): ConnectionStatus {
    return this.status
  }

  private setupPeerHandlers(): void {
    if (!this.peer) return

    // When we have a signal to send to the other peer
    this.peer.on('signal', (signal) => {
      // Queue signals to prevent concurrent writes
      this.signalQueue.push(signal)
      this.processSignalQueue()
    })

    // When the connection is established
    this.peer.on('connect', () => {
      this.updateStatus('connected')
    })

    // When we receive data from the other peer
    this.peer.on('data', (data) => {
      try {
        const message = JSON.parse(data.toString()) as P2PMessage
        this.config.onMessage(message)
      } catch (error) {
        console.error('Error parsing message:', error)
      }
    })

    // When the connection is closed
    this.peer.on('close', () => {
      this.updateStatus('disconnected')
    })

    // When an error occurs
    this.peer.on('error', (error) => {
      this.handleError(error)
    })
  }

  private handleIncomingSignal(signal: any): void {
    if (!this.peer) {
      console.warn(
        `[${this.config.isHost ? 'HOST' : 'GUEST'}] Received signal but peer not initialized yet, ignoring`
      )
      return
    }

    try {
      console.log(
        `[${this.config.isHost ? 'HOST' : 'GUEST'}] Received signal:`,
        signal.type
      )
      this.peer.signal(signal)
    } catch (error) {
      console.error('Error handling incoming signal:', error)
    }
  }

  private updateStatus(status: ConnectionStatus): void {
    this.status = status
    this.config.onStatusChange(status)
  }

  private async processSignalQueue(): Promise<void> {
    if (this.isProcessingQueue || this.signalQueue.length === 0) return

    this.isProcessingQueue = true

    while (this.signalQueue.length > 0) {
      const signal = this.signalQueue.shift()
      try {
        const signalType =
          signal.type || (signal.candidate ? 'candidate' : 'unknown')
        console.log(
          `[${this.config.isHost ? 'HOST' : 'GUEST'}] Sending signal:`,
          signalType
        )
        await this.signalingClient.sendSignal(
          this.config.joinCode,
          this.config.peerId,
          signal
        )
        console.log(
          `[${this.config.isHost ? 'HOST' : 'GUEST'}] Signal sent successfully:`,
          signalType
        )
      } catch (error) {
        console.error('Error sending signal:', error)
      }
    }

    this.isProcessingQueue = false
  }

  private handleError(error: Error): void {
    console.error('P2P Connection error:', error)
    this.updateStatus('failed')
    this.config.onError?.(error)
  }
}
