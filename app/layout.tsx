import type { Metadata } from 'next'
import { markerFont, handwrittenFont } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ultimate Tic Tac Toe - Multiplayer Game',
  description:
    'Play Ultimate Tic Tac Toe with friends online or against AI. Real-time P2P multiplayer with WebRTC, interactive tutorial, and 3 difficulty levels. No server required!',
  keywords: [
    'ultimate tic tac toe',
    'multiplayer game',
    'webrtc game',
    'p2p game',
    'strategy game',
    'online game',
    'tic tac toe',
    'board game',
  ],
  authors: [{ name: 'Ultimate Tic Tac Toe Team' }],
  openGraph: {
    title: 'Ultimate Tic Tac Toe - Multiplayer Game',
    description:
      'Play the strategic variant of tic-tac-toe online with friends or against AI. Features P2P multiplayer, interactive tutorial, and beautiful whiteboard design.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ultimate Tic Tac Toe',
    description: 'Strategic multiplayer tic-tac-toe with WebRTC',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${markerFont.variable} ${handwrittenFont.variable}`}>
      <body className="font-handwritten bg-whiteboard-bg antialiased">
        {children}
      </body>
    </html>
  )
}
