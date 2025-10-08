import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  children: React.ReactNode
}

export function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const baseClasses = 'whiteboard-button'

  const variantClasses = {
    primary: 'bg-white text-whiteboard-marker-black',
    secondary: 'bg-whiteboard-marker-blue text-white border-whiteboard-marker-blue',
    outline: 'bg-transparent text-whiteboard-marker-black',
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
