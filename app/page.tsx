'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-6xl md:text-8xl font-marker text-whiteboard-marker-black">
            Ultimate
          </h1>
          <h2 className="text-4xl md:text-6xl font-marker text-whiteboard-marker-blue">
            Tic Tac Toe
          </h2>
          <p className="text-lg font-handwritten text-whiteboard-marker-black/70">
            Play nested tic-tac-toe with friends in real-time
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col gap-4 max-w-sm mx-auto">
          <Link href="/host">
            <Button className="w-full">Host Game</Button>
          </Link>

          <Link href="/join">
            <Button className="w-full" variant="secondary">
              Join Game
            </Button>
          </Link>

          <Link href="/single-player">
            <Button className="w-full" variant="outline">
              Single Player
            </Button>
          </Link>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <Link href="/tutorial">
              <Button className="w-full" variant="outline">
                How to Play
              </Button>
            </Link>

            <Link href="/options">
              <Button className="w-full" variant="outline">
                Options
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-sm font-handwritten text-whiteboard-marker-black/50 mt-12">
          Win mini-games to claim squares. Get 3 in a row to win!
        </p>
      </div>
    </main>
  )
}
