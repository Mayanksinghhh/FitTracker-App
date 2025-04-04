'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes'

type CustomTheme = 'light' | 'dark' | 'ocean' | 'forest'

interface CustomThemeProviderProps extends Omit<ThemeProviderProps, 'themes'> {
  themes?: string[]
  defaultTheme?: CustomTheme
  forcedTheme?: CustomTheme
}

export function ThemeProvider({ 
  children, 
  themes = ['light', 'dark', 'ocean', 'forest'],
  defaultTheme = 'light',
  forcedTheme,
  ...props 
}: CustomThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={defaultTheme}
      forcedTheme={forcedTheme}
      themes={themes}
      enableSystem={false}
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}