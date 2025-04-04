import type { Metadata } from 'next'
import './globals.css'


export const metadata: Metadata = {
  title: 'FitTrack',
  description: 'FitTrack is a web application that helps you track your workouts and fitness goals.',
  icons: {
    icon: '/images.png',
    shortcut: '/images.png',
    apple: '/images.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/apple-touch-icon-precomposed.png',
    },
  },
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
