import React from 'react'
import {Landmark} from "lucide-react";

function Logo() {
    return (
        <a href="/" className="flex items-center gap-2">
            <Landmark
                className="stroke h-11 w-11 stroke-purple-300 stroke-[1.5] drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]"
            />

            <p className="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent text-3xl font-bold leading-tight tracking-tighter drop-shadow-[0_0_6px_rgba(165,180,252,0.3)]">
                Spendora
            </p>

        </a>
    )
}

export default Logo
