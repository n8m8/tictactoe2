import type { Metadata } from 'next'
import { markerFont, handwrittenFont } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ultimate Tic Tac Toe',
  description: 'Multiplayer Ultimate Tic Tac Toe - Play nested tic-tac-toe with friends in real-time',
  keywords: ['tic tac toe', 'ultimate tic tac toe', 'multiplayer game', 'web game'],
  authors: [{ name: 'TicTacToe2 Team' }],
  openGraph: {
    title: 'Ultimate Tic Tac Toe',
    description: 'Play multiplayer Ultimate Tic Tac Toe in real-time with friends',
    type: 'website',
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
