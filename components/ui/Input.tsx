import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-marker mb-2 text-whiteboard-marker-black">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-3 rounded-md
          font-handwritten text-lg text-center uppercase
          bg-white border-2 border-whiteboard-grid
          focus:border-whiteboard-marker-blue focus:outline-none
          hover:shadow-cell-hover
          transition-all duration-200
          ${error ? 'border-whiteboard-marker-red' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-whiteboard-marker-red font-handwritten">
          {error}
        </p>
      )}
    </div>
  )
}
