"use client"

import { ArrowLeft } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

interface BackButtonProps {
  label?: string
}

export function BackButton({ 
  label = "Back" 
}: BackButtonProps) {
  const pathname = usePathname()
  const router = useRouter()
  
  // Don't show back button on landing page
  if (pathname === "/") {
    return null
  }
  
  return (
    <div className="fixed top-24 left-4 z-40">
      <button 
        onClick={() => router.back()}
        className="inline-flex items-center text-sm font-medium hover:bg-accent/90 hover:text-accent-foreground transition-colors bg-background/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-border/40"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {label}
      </button>
    </div>
  )
} 