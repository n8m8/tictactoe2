import localFont from 'next/font/local'

// Permanent Marker - for game pieces (X/O) and bold markers
export const markerFont = localFont({
  src: '../public/fonts/PermanentMarker-Regular.woff2',
  display: 'swap',
  variable: '--font-marker',
  preload: true,
  fallback: ['cursive', 'Comic Sans MS'],
})

// Caveat - for UI text and handwritten feel
export const handwrittenFont = localFont({
  src: [
    {
      path: '../public/fonts/Caveat-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Caveat-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-handwritten',
  preload: true,
  fallback: ['cursive', 'Comic Sans MS'],
})
