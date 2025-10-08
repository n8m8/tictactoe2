import { Permanent_Marker, Caveat } from 'next/font/google'

// Permanent Marker - for game pieces (X/O) and bold markers
export const markerFont = Permanent_Marker({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-marker',
  preload: true,
})

// Caveat - for UI text and handwritten feel
export const handwrittenFont = Caveat({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-handwritten',
  preload: true,
})
