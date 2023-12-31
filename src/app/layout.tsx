import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextAuthProvider } from './providers'
import MainMenuMobile from '@/components/MainMenuMobile.component'
import {  isSafe } from '@/action/UserController'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Phim',
  description: 'App Xem Phim',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

 const safe = await isSafe();

  return (
    <html lang="en">
      <body className={inter.className}>
      
        <NextAuthProvider>
        <header>
        <MainMenuMobile safe={safe}/>
        </header>
        <main className="flex min-h-screen flex-col items-center bg-dotted py-24">
        {children}
        </main>
        </NextAuthProvider>
        
        </body>
    </html>
  )
}
