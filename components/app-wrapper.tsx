"use client"

import React, { useState, useEffect } from "react"
import { LoadingScreen } from "@/components/loading-screen"

export function AppWrapper({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
        // Check if we've already shown the loader in this session
        const hasLoaded = sessionStorage.getItem("app_loaded")
        if (hasLoaded) {
            setIsLoading(false)
        }
    }, [])

    const handleComplete = () => {
        setIsLoading(false)
        sessionStorage.setItem("app_loaded", "true")
    }

    if (!isMounted) return null

    return (
        <>
            {isLoading && <LoadingScreen onComplete={handleComplete} />}
            <div className={isLoading ? "opacity-0 invisible h-0 overflow-hidden" : "opacity-100 visible transition-opacity duration-1000 ease-in-out"}>
                {children}
            </div>
        </>
    )
}
