import React from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-whiteboard-bg rounded-lg shadow-marker max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-marker text-whiteboard-marker-black">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-2xl hover:text-whiteboard-marker-red transition-colors"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="font-handwritten">{children}</div>
      </div>
    </div>
  )
}
