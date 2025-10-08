'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

export default function OptionsPage() {
  const router = useRouter()

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <h1 className="text-5xl font-marker text-whiteboard-marker-black">
          Options
        </h1>

        <p className="text-lg font-handwritten text-whiteboard-marker-black/70">
          Coming soon! Sound settings and debug mode
        </p>

        <Button onClick={() => router.push('/')} variant="outline">
          Back to Menu
        </Button>
      </div>
    </main>
  )
}
