import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {ClerkProvider, SignedOut, SignInButton, SignUpButton,} from "@clerk/nextjs";
import RootProviders from "@/components/providers/RootProviders";
import {Toaster} from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spendora",
  description: "Sajal-Kanwal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

      <ClerkProvider>
          <html lang="en"
                className="dark"
                style={{
                    colorScheme: "dark",
                }}
          >
          <body
              className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen overflow-hidden`}
          >
          <header className="flex justify-end items-center p-4 gap-4 h-16">
              <SignedOut>
                  <SignInButton mode="modal">
                      <span className="sr-only">Sign in</span>
                  </SignInButton>
                  <SignUpButton mode="modal">
                      <span className="sr-only">Sign up</span>
                  </SignUpButton>
              </SignedOut>
          </header>
          <Toaster richColors position="bottom-right" />
          <RootProviders>{children}</RootProviders>
          </body>
          </html>
      </ClerkProvider>
  );
}
