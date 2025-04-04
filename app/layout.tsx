import type { Metadata } from 'next'
import './globals.css'


export const metadata: Metadata = {
  title: 'FitTrack',
  description: 'FitTrack is a web application that helps you track your workouts and fitness goals.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
