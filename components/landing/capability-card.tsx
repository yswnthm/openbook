"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Lightbulb, PuzzleIcon as PuzzlePiece, Target, BarChart, Smartphone, type LucideIcon } from "lucide-react"

interface CapabilityCardProps {
  title: string
  description: string
  icon: string
  delay?: number
}

export function CapabilityCard({ title, description, icon, delay = 0 }: CapabilityCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getIcon = (): LucideIcon => {
    switch (icon) {
      case "Lightbulb":
        return Lightbulb
      case "PuzzlePiece":
        return PuzzlePiece
      case "Target":
        return Target
      case "BarChart":
        return BarChart
      case "Smartphone":
        return Smartphone
      default:
        return Lightbulb
    }
  }

  const Icon = getIcon()

  // Replace the entire renderCustomAnimation function with this monochromatic version
  // and add comments for gradient removal

  const renderCustomAnimation = () => {
    switch (icon) {
      case "Lightbulb":
        return (
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            {isHovered && (
              // GRADIENT: Light radial gradient - remove this motion.div if you don't want the gradient effect
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute w-32 h-32 rounded-full bg-gradient-radial from-white to-transparent"
              />
            )}
            {isHovered && (
              <>
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 0.8, 0],
                      scale: [0.2, 1.5, 2],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.3,
                      ease: "easeOut",
                    }}
                    className="absolute w-16 h-0.5 bg-white origin-left"
                    style={{
                      rotate: `${i * 60}deg`,
                    }}
                  />
                ))}
              </>
            )}
          </div>
        )

      case "PuzzlePiece":
        return (
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            {isHovered && (
              <>
                <motion.div
                  initial={{ x: -40, y: -40, opacity: 0 }}
                  animate={{ x: -10, y: -10, opacity: 0.7 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute w-12 h-12 rounded-md bg-white"
                />
                <motion.div
                  initial={{ x: 40, y: -40, opacity: 0 }}
                  animate={{ x: 10, y: -10, opacity: 0.7 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  className="absolute w-12 h-12 rounded-md bg-gray-300"
                />
                <motion.div
                  initial={{ x: -40, y: 40, opacity: 0 }}
                  animate={{ x: -10, y: 10, opacity: 0.7 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                  className="absolute w-12 h-12 rounded-md bg-gray-600"
                />
                <motion.div
                  initial={{ x: 40, y: 40, opacity: 0 }}
                  animate={{ x: 10, y: 10, opacity: 0.7 }}
                  transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                  className="absolute w-12 h-12 rounded-md bg-gray-800"
                />
              </>
            )}
          </div>
        )

      case "Target":
        return (
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            {isHovered && (
              <>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.7, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="absolute w-32 h-32 rounded-full border-2 border-white"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.7, scale: 0.7 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="absolute w-32 h-32 rounded-full border-2 border-white"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.7, scale: 0.4 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="absolute w-32 h-32 rounded-full border-2 border-white"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 0.1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="absolute w-32 h-32 rounded-full bg-white"
                />
                <motion.div
                  initial={{ x: -100, y: -100, opacity: 0 }}
                  animate={{ x: 0, y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.8, type: "spring" }}
                  className="absolute w-1 h-16 bg-white rotate-45 origin-bottom"
                >
                  <div
                    className="absolute -top-2 -left-1 w-0 h-0 
                    border-l-[4px] border-l-transparent
                    border-b-[8px] border-b-white
                    border-r-[4px] border-r-transparent"
                  />
                </motion.div>
              </>
            )}
          </div>
        )

      case "BarChart":
        return (
          <div className="absolute inset-0 flex items-end justify-center opacity-10 pointer-events-none">
            {isHovered && (
              <div className="flex items-end space-x-3 h-32 w-32">
                {[0.3, 0.5, 0.7, 0.9, 0.6].map((height, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${height * 100}%` }}
                    transition={{
                      duration: 0.8,
                      delay: i * 0.1,
                      ease: "backOut",
                    }}
                    className="w-3 bg-white rounded-t"
                  />
                ))}
              </div>
            )}
          </div>
        )

      case "Smartphone":
        return (
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            {isHovered && (
              <>
                <motion.div
                  initial={{ opacity: 0, x: -40, rotate: -15 }}
                  animate={{ opacity: 0.7, x: -20, rotate: -15 }}
                  transition={{ duration: 0.5 }}
                  className="absolute w-16 h-24 rounded-lg border-2 border-white"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="absolute w-12 h-20 rounded-lg border-2 border-white"
                />
                <motion.div
                  initial={{ opacity: 0, x: 40, rotate: 15 }}
                  animate={{ opacity: 0.7, x: 20, rotate: 15 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="absolute w-24 h-16 rounded-lg border-2 border-white"
                />
              </>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="bg-gray-900 rounded-xl p-6 hover:bg-gray-800 transition-colors group relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {renderCustomAnimation()}

      <div className="relative z-10">
        <motion.div
          className="bg-gray-800 rounded-full w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-gray-700 transition-colors"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Icon className="h-6 w-6 text-white" />
        </motion.div>
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </motion.div>
  )
}
