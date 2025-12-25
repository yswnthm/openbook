"use client"

import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import AnimateInView from "./animate-in-view"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-32 md:py-48 flex flex-col items-center justify-center min-h-[80vh]">
      {/* Background gradients removed and moved to global LandingBackground */}

      <div className="container mx-auto px-4 md:px-6 z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
          <AnimateInView delay={0.1}>
            <div className="inline-flex items-center rounded-full border border-border bg-background/50 px-3 py-1 text-sm text-muted-foreground backdrop-blur-sm mb-6">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse" />
              Reimagining the way you learn
            </div>
          </AnimateInView>

          <AnimateInView delay={0.2}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground">
              Clarity in <span className="font-instrument-serif italic text-foreground/80">Complexity,</span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/80 to-muted-foreground">
                Built for Learners
              </span>
            </h1>
          </AnimateInView>

          <AnimateInView delay={0.3}>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              OpenBook is an AI-native notebook that helps you learn, retain, and apply knowledge more effectively than ever before.
            </p>
          </AnimateInView>

          <AnimateInView delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/chat">
                <Button size="lg" className="h-12 px-8 rounded-full text-lg bg-foreground text-background hover:bg-foreground/90 transition-all shadow-lg hover:shadow-xl">
                  Get Started
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-12 px-8 rounded-full text-lg border-foreground/20 hover:bg-foreground/5 backdrop-blur-sm">
                See How It Works
              </Button>
            </div>
          </AnimateInView>
        </div>
      </div>

      {/* Graph Overlay */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] pointer-events-none opacity-20 dark:opacity-40 hidden lg:block z-0">
        <img
          src="/screenshots/graph69.png"
          alt="Graph Overlay"
          className="w-full h-full object-contain"
        />
      </div>
    </section>
  )
}
