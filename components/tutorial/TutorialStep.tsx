import React from 'react'
import { Button } from '@/components/ui/Button'

export interface TutorialStepData {
  title: string
  description: string
  highlight?: string
}

interface TutorialStepProps {
  step: TutorialStepData
  currentStep: number
  totalSteps: number
  onNext: () => void
  onPrevious: () => void
  onSkip: () => void
  children?: React.ReactNode
}

export function TutorialStep({
  step,
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onSkip,
  children,
}: TutorialStepProps) {
  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="text-center">
        <p className="text-sm font-handwritten text-whiteboard-marker-black/50">
          Step {currentStep + 1} of {totalSteps}
        </p>
      </div>

      {/* Content */}
      <div className="bg-white border-4 border-whiteboard-grid rounded-lg p-6 space-y-4">
        <h2 className="text-3xl font-marker text-whiteboard-marker-blue">
          {step.title}
        </h2>

        <p className="text-lg font-handwritten text-whiteboard-marker-black/80 whitespace-pre-line">
          {step.description}
        </p>

        {step.highlight && (
          <div className="bg-whiteboard-marker-blue/10 border-2 border-whiteboard-marker-blue rounded-lg p-4">
            <p className="font-handwritten text-whiteboard-marker-blue">
              💡 {step.highlight}
            </p>
          </div>
        )}

        {/* Interactive content */}
        {children && <div className="mt-6">{children}</div>}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center gap-4">
        <Button
          onClick={onPrevious}
          variant="outline"
          disabled={currentStep === 0}
          className="flex-1"
        >
          Previous
        </Button>

        {currentStep < totalSteps - 1 ? (
          <Button onClick={onNext} className="flex-1">
            Next
          </Button>
        ) : (
          <Button onClick={onSkip} className="flex-1">
            Finish
          </Button>
        )}
      </div>

      {/* Skip button */}
      {currentStep < totalSteps - 1 && (
        <div className="text-center">
          <button
            onClick={onSkip}
            className="text-sm font-handwritten text-whiteboard-marker-black/50 hover:text-whiteboard-marker-black transition-colors"
          >
            Skip Tutorial
          </button>
        </div>
      )}
    </div>
  )
}
