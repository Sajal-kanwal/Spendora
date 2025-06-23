import React from 'react'
import Navbar from "@/components/Navbar";

function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col h-screen w-full overflow-hidden">
            <Navbar />
            <main className="flex-1 px-4 md:px-8 pt-6">{children}</main>
        </div>
    )
}

export default Layout
