"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import AnimateInView from "./animate-in-view"

export function CTASection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-muted/30" />
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12 lg:gap-24">
          <div className="flex-1 relative w-full max-w-md md:max-w-xl lg:max-w-2xl mx-auto md:mx-0">
            <AnimateInView delay={0.2} className="relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-gradient-to-tr from-primary/30 to-purple-500/30 rounded-full blur-[80px] -z-10" />
              <Image
                src="/screenshots/iPhone15.png"
                alt="OpenBook App Interface on iPhone 15"
                width={800}
                height={1600}
                className="w-full h-auto drop-shadow-2xl hover:scale-[1.02] transition-transform duration-500"
              />
            </AnimateInView>
          </div>

          <div className="flex-1 text-center md:text-left">
            <AnimateInView>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Experience the <span className="font-instrument-serif italic">Future</span> of Learning
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto md:mx-0">
                Join thousands of learners who are already using OpenBook to master new subjects faster.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link href="/chat">
                  <Button size="lg" className="h-12 px-8 rounded-full text-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 w-full sm:w-auto">
                    Get Started for Free
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#stories">
                  <Button variant="outline" size="lg" className="h-12 px-8 rounded-full text-lg w-full sm:w-auto">
                    Read Stories
                  </Button>
                </Link>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                No credit card required. Free plan available.
              </p>
            </AnimateInView>
          </div>
        </div>
      </div>
    </section>
  )
}
