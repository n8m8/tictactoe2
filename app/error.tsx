'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div>
          <h1 className="text-6xl font-marker text-whiteboard-marker-red mb-4">
            Oops!
          </h1>
          <h2 className="text-3xl font-marker text-whiteboard-marker-black mb-4">
            Something Went Wrong
          </h2>
          <p className="text-lg font-handwritten text-whiteboard-marker-black/70">
            Don&apos;t worry, even the best players make mistakes.
          </p>
        </div>

        <div className="bg-whiteboard-marker-red/10 border-2 border-whiteboard-marker-red rounded-lg p-4">
          <p className="text-sm font-handwritten text-whiteboard-marker-red">
            {error.message || 'An unexpected error occurred'}
          </p>
        </div>

        <div className="space-y-3">
          <Button onClick={reset} className="w-full">
            Try Again
          </Button>
          <Button
            onClick={() => (window.location.href = '/')}
            variant="outline"
            className="w-full"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </main>
  )
}
