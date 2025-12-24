"use client"

import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import Image from "next/image"

interface TestimonialCardProps {
  quote: string
  name: string
  location: string
  image: string
}

export default function TestimonialCard({ quote, name, location, image }: TestimonialCardProps) {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
      <Card className="overflow-hidden transition-all hover:shadow-md h-full border-white/10 bg-white/5 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <motion.div
              className="relative w-16 h-16 mb-4 rounded-full overflow-hidden border border-white/20"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`${name} from ${location}`}
                className="object-cover"
                fill
                sizes="64px"
              />
            </motion.div>
            <div className="mb-4">
              <svg className="h-6 w-6 text-muted-foreground mx-auto" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            <p className="text-muted-foreground mb-4">{quote}</p>
            <div>
              <p className="font-medium">{name}</p>
              <p className="text-sm text-muted-foreground">{location}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
