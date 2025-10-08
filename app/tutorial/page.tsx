'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TutorialStep } from '@/components/tutorial/TutorialStep'
import { tutorialSteps } from '@/lib/tutorial-data'
import { MiniGame } from '@/components/game/MiniGame'
import type { MiniGame as MiniGameType } from '@/types/game'

export default function TutorialPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    router.push('/')
  }

  // Demo mini-game for visualization
  const demoMiniGame: MiniGameType = {
    position: 4,
    cells: ['X', null, 'O', null, 'X', null, 'O', null, null],
    winner: null,
    isComplete: false,
  }

  const demoWonMiniGame: MiniGameType = {
    position: 0,
    cells: ['X', 'O', 'O', null, 'X', null, null, null, 'X'],
    winner: 'X',
    isComplete: true,
  }

  // Show different demos for different steps
  const getDemoContent = () => {
    switch (currentStep) {
      case 1: // Main Board
        return (
          <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-whiteboard-grid/30 border-2 border-whiteboard-grid rounded flex items-center justify-center"
              >
                <span className="text-sm font-handwritten text-whiteboard-marker-black/50">
                  Mini {i + 1}
                </span>
              </div>
            ))}
          </div>
        )
      case 2: // Making Moves
      case 3: // Special Rule
        return (
          <div className="max-w-xs mx-auto">
            <MiniGame miniGame={demoMiniGame} isActive={true} isPlayable={false} />
          </div>
        )
      case 4: // Winning Mini-Games
        return (
          <div className="flex justify-center gap-8">
            <div className="text-center space-y-2">
              <p className="text-sm font-handwritten text-whiteboard-marker-black/70">
                In Progress
              </p>
              <div className="max-w-[150px]">
                <MiniGame miniGame={demoMiniGame} isPlayable={false} />
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm font-handwritten text-whiteboard-marker-black/70">
                Won by X
              </p>
              <div className="max-w-[150px]">
                <MiniGame miniGame={demoWonMiniGame} isPlayable={false} />
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <TutorialStep
          step={tutorialSteps[currentStep]}
          currentStep={currentStep}
          totalSteps={tutorialSteps.length}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSkip={handleSkip}
        >
          {getDemoContent()}
        </TutorialStep>
      </div>
    </main>
  )
}
