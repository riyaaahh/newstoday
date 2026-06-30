import { Inter, Noto_Sans_Malayalam } from 'next/font/google'
import React from 'react'

import { SITE_URL } from '@/lib/locale'

import '../globals.css'

const malayalam = Noto_Sans_Malayalam({
  subsets: ['malayalam', 'latin'],
  variable: '--font-malayalam',
  display: 'swap',
})
const inter = Inter({ subsets: ['latin'], variable: '--font-latin', display: 'swap' })

export const metadata = {
  metadataBase: new URL(SITE_URL),
}

export default function EnglishRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${malayalam.variable} ${inter.variable}`}>
      <body className="lang-en">{children}</body>
    </html>
  )
}
