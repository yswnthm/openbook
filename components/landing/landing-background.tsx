"use client"

import React from 'react'

export function LandingBackground() {
    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-purple-500/30 dark:bg-purple-500/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] bg-blue-500/30 dark:bg-blue-500/10 rounded-full blur-[100px]" />
        </div>
    )
}
