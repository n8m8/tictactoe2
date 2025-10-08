import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div>
          <h1 className="text-8xl font-marker text-whiteboard-marker-red mb-4">
            404
          </h1>
          <h2 className="text-4xl font-marker text-whiteboard-marker-black mb-4">
            Page Not Found
          </h2>
          <p className="text-lg font-handwritten text-whiteboard-marker-black/70">
            Oops! Looks like this square doesn't exist on the board.
          </p>
        </div>

        <Link href="/">
          <Button className="w-full">Back to Home</Button>
        </Link>
      </div>
    </main>
  )
}
