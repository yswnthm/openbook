"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

interface AnimatedGradientBackgroundProps {
  className?: string
  children?: React.ReactNode
  intensity?: "subtle" | "medium" | "strong"
}

interface Beam {
  x: number
  y: number
  width: number
  length: number
  angle: number
  speed: number
  opacity: number
  hue: number
  saturation: number
  lightness: number
  pulse: number
  pulseSpeed: number
}

// Expanded color palette based on the gradient images
const lightModeColors = [
  { hue: 280, saturation: 80, lightness: 75 }, // Purple
  { hue: 320, saturation: 85, lightness: 75 }, // Pink
  { hue: 340, saturation: 85, lightness: 80 }, // Pink-Red
  { hue: 20, saturation: 90, lightness: 80 },  // Peach
  { hue: 30, saturation: 85, lightness: 75 },  // Orange
  { hue: 200, saturation: 80, lightness: 70 }, // Light Blue
] as const;

const darkModeColors = [
  { hue: 190, saturation: 85, lightness: 65 }, // Cyan
  { hue: 220, saturation: 85, lightness: 65 }, // Blue
  { hue: 250, saturation: 85, lightness: 65 }, // Indigo
  { hue: 270, saturation: 85, lightness: 65 }, // Purple
] as const;

type ColorDefinition = {
  hue: number;
  saturation: number;
  lightness: number;
};

function createBeam(width: number, height: number, isDark: boolean): Beam {
  const angle = -35 + Math.random() * 10
  // Select a random color from the appropriate palette
  const colorPalette = isDark ? darkModeColors : lightModeColors;
  // We know the array is non-empty
  const colorIndex = Math.floor(Math.random() * colorPalette.length);
  // Default to first color in case something goes wrong
  const colorChoice: ColorDefinition = colorPalette[colorIndex] || colorPalette[0];
  
  return {
    x: Math.random() * width * 1.5 - width * 0.25,
    y: Math.random() * height * 1.5 - height * 0.25,
    width: 30 + Math.random() * 60,
    length: height * 2.5,
    angle: angle,
    speed: 0.6 + Math.random() * 1.2,
    opacity: 0.12 + Math.random() * 0.16,
    hue: colorChoice.hue + (Math.random() * 20 - 10), // Add some variation
    saturation: colorChoice.saturation,
    lightness: colorChoice.lightness,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.02 + Math.random() * 0.03,
  }
}

export default function BeamsBackground({ className, intensity = "strong", children }: AnimatedGradientBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const beamsRef = useRef<Beam[]>([])
  const animationFrameRef = useRef<number>(0)
  const MINIMUM_BEAMS = 20
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted before accessing theme
  useEffect(() => {
    setMounted(true)
  }, [])

  const opacityMap = {
    subtle: 0.7,
    medium: 0.85,
    strong: 1,
  }

  const isDark = mounted && (theme === 'dark' || theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !mounted) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      
      // Ensure the canvas stays in a fixed position
      canvas.style.position = 'fixed'
      canvas.style.top = '0'
      canvas.style.left = '0'
      canvas.style.zIndex = '-10'
      
      ctx.scale(dpr, dpr)

      const totalBeams = MINIMUM_BEAMS * 1.5
      beamsRef.current = Array.from({ length: totalBeams }, () => createBeam(canvas.width, canvas.height, isDark))
    }

    updateCanvasSize()
    window.addEventListener("resize", updateCanvasSize)

    function resetBeam(beam: Beam, index: number, totalBeams: number) {
      if (!canvas) return beam

      const column = index % 3
      const spacing = canvas.width / 3

      beam.y = canvas.height + 100
      beam.x = column * spacing + spacing / 2 + (Math.random() - 0.5) * spacing * 0.5
      beam.width = 100 + Math.random() * 100
      beam.speed = 0.5 + Math.random() * 0.4
      
      // Select a new color from the palette for visual variety
      const colorPalette = isDark ? darkModeColors : lightModeColors;
      const colorIndex = Math.floor(Math.random() * colorPalette.length);
      // Default to first color in case something goes wrong
      const colorChoice: ColorDefinition = colorPalette[colorIndex] || colorPalette[0];
      
      beam.hue = colorChoice.hue + (Math.random() * 20 - 10); // Add some variation
      beam.saturation = colorChoice.saturation;
      beam.lightness = colorChoice.lightness;
      
      beam.opacity = 0.2 + Math.random() * 0.1
      return beam
    }

    function drawBeam(ctx: CanvasRenderingContext2D, beam: Beam) {
      ctx.save()
      ctx.translate(beam.x, beam.y)
      ctx.rotate((beam.angle * Math.PI) / 180)

      // Calculate pulsing opacity
      const pulsingOpacity = beam.opacity * (0.8 + Math.sin(beam.pulse) * 0.2) * opacityMap[intensity]

      const gradient = ctx.createLinearGradient(0, 0, 0, beam.length)

      // Enhanced gradient with multiple color stops
      gradient.addColorStop(0, `hsla(${beam.hue}, ${beam.saturation}%, ${beam.lightness}%, 0)`)
      gradient.addColorStop(0.1, `hsla(${beam.hue}, ${beam.saturation}%, ${beam.lightness}%, ${pulsingOpacity * 0.5})`)
      gradient.addColorStop(0.4, `hsla(${beam.hue}, ${beam.saturation}%, ${beam.lightness}%, ${pulsingOpacity})`)
      gradient.addColorStop(0.6, `hsla(${beam.hue}, ${beam.saturation}%, ${beam.lightness}%, ${pulsingOpacity})`)
      gradient.addColorStop(0.9, `hsla(${beam.hue}, ${beam.saturation}%, ${beam.lightness}%, ${pulsingOpacity * 0.5})`)
      gradient.addColorStop(1, `hsla(${beam.hue}, ${beam.saturation}%, ${beam.lightness}%, 0)`)

      ctx.fillStyle = gradient
      ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length)
      ctx.restore()
    }

    function animate() {
      if (!canvas || !ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.filter = "blur(35px)"

      const totalBeams = beamsRef.current.length
      beamsRef.current.forEach((beam, index) => {
        beam.y -= beam.speed
        beam.pulse += beam.pulseSpeed

        // Reset beam when it goes off screen
        if (beam.y + beam.length < -100) {
          resetBeam(beam, index, totalBeams)
        }

        drawBeam(ctx, beam)
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", updateCanvasSize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [intensity, theme, mounted, isDark])

  if (!mounted) {
    return null
  }

  // Soft background colors instead of pure black/white
  const bgColor = isDark ? "bg-neutral-950" : "bg-neutral-50"

  return (
    <div className={cn(`fixed inset-0 w-full h-full overflow-hidden ${bgColor} -z-10`, className)}>
      <canvas ref={canvasRef} className="absolute inset-0" style={{ filter: "blur(15px)" }} />

      <motion.div
        className={`absolute inset-0 ${isDark ? "bg-neutral-950/5" : "bg-neutral-50/5"}`}
        animate={{
          opacity: [0.05, 0.15, 0.05],
        }}
        transition={{
          duration: 10,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
        }}
        style={{
          backdropFilter: "blur(50px)",
        }}
      />

      {children && (
        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      )}
    </div>
  )
}
