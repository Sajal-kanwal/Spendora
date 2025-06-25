import type { Metadata } from 'next'
import {
    ClerkProvider,
    SignInButton,
    SignUpButton,
    SignedOut,
} from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import {Providers} from "@/app/providers";

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: 'Spendora',
    description: 'Sajal-kanwal',
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <ClerkProvider
            appearance={{
                cssLayerName: 'clerk',
            }}
        >
            <html lang="en" suppressHydrationWarning>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <SignedOut>
                    <SignInButton />
                    <SignUpButton>
                        <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                            Sign Up
                        </button>
                    </SignUpButton>
                </SignedOut>
            <Providers>
                {children}
            </Providers>
            </body>
            </html>
        </ClerkProvider>
    )
}