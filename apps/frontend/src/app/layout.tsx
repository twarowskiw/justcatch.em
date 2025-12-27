import type { Metadata } from 'next'
import localFont from 'next/font/local'
import type React from 'react'
import './globals.css'
import { ThemeRegistry } from '../theme/ThemeRegistry'
import { AppProviders } from './providers'

const ibmVga = localFont({
  src: '../../public/fonts/Web437_IBM_VGA_9x16.woff',
  display: 'swap',
  variable: '--font-ibm-vga'
})

export const metadata: Metadata = {
  title: 'justcatch.em',
  description: 'Pokémon Trainer registration'
}

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={ibmVga.variable}>
      <body>
        <ThemeRegistry>
          <AppProviders>{children}</AppProviders>
        </ThemeRegistry>
      </body>
    </html>
  )
}
