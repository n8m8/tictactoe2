import { useEffect, useRef, useState, useCallback } from 'react'
import { P2PConnection, ConnectionStatus } from '@/lib/p2p-connection'
import type { P2PMessage, GameAction } from '@/types/signaling'

export interface UseP2PConnectionParams {
  isHost: boolean
  joinCode: string
  peerId: string
  onMessage: (message: P2PMessage) => void
  enabled?: boolean
}

export interface UseP2PConnectionReturn {
  status: ConnectionStatus
  sendAction: (action: GameAction) => void
  sendChatMessage: (text: string) => void
  disconnect: () => void
  error: Error | null
}

/**
 * React hook for managing P2P connection
 */
export function useP2PConnection({
  isHost,
  joinCode,
  peerId,
  onMessage,
  enabled = true,
}: UseP2PConnectionParams): UseP2PConnectionReturn {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected')
  const [error, setError] = useState<Error | null>(null)
  const connectionRef = useRef<P2PConnection | null>(null)

  // Initialize connection
  useEffect(() => {
    if (!enabled) return

    const connection = new P2PConnection({
      isHost,
      joinCode,
      peerId,
      onMessage,
      onStatusChange: setStatus,
      onError: setError,
    })

    connectionRef.current = connection
    connection.connect()

    // Cleanup on unmount
    return () => {
      connection.disconnect()
      connectionRef.current = null
    }
  }, [isHost, joinCode, peerId, enabled, onMessage])

  const sendAction = useCallback((action: GameAction) => {
    connectionRef.current?.sendAction(action)
  }, [])

  const sendChatMessage = useCallback((text: string) => {
    connectionRef.current?.sendChatMessage(text)
  }, [])

  const disconnect = useCallback(() => {
    connectionRef.current?.disconnect()
  }, [])

  return {
    status,
    sendAction,
    sendChatMessage,
    disconnect,
    error,
  }
}
