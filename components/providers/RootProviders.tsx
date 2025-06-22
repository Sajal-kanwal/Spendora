"use client";

import React from 'react'
import {ThemeProvider} from "next-themes";

function RootProviders({children}: {children: React.ReactNode}) {
    return (
        <ThemeProvider attribute="class"
                       defaultTheme="dark"
                       enableSystem
                       disableTransitionOnChange>
            {children}
        </ThemeProvider>
    )
}

export default RootProviders
