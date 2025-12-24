"use client"
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import Image from 'next/image'

export function ImageBackground() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  const src = resolvedTheme === 'light'
    ? '/screenshots/white.png'
    : '/screenshots/black.png'
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none particle-layer">
      <Image
        src={src}
        alt=""
        fill
        className="object-cover"
        priority
      />
    </div>
  )
} 