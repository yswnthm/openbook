"use client"

import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import Image from "next/image"

interface HowItWorksStepProps {
  number: string
  title: string
  description: string
  image: string
}

export default function HowItWorksStep({ number, title, description, image }: HowItWorksStepProps) {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
      <Card className="overflow-hidden transition-all hover:shadow-md h-full border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="relative h-48">
          <Image 
            src={image || "/placeholder.svg"} 
            alt={title} 
            className="object-cover opacity-80" 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <motion.div
            className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold text-lg z-10"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            {number}
          </motion.div>
        </div>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
