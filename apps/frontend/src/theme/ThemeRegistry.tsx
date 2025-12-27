'use client'

import type React from 'react'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { theme } from './theme'

export function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
