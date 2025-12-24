"use client"

import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import AnimateInView from "./animate-in-view"

export function CTASection() {
  return (
    <section className="py-32 md:py-48 relative overflow-hidden">
        <div className="absolute inset-0 -z-10" />
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <AnimateInView>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">
              Experience the <span className="font-instrument-serif italic">Future</span> of Learning
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Join thousands of learners who are already using OpenBook to master new subjects faster.
            </p>
            <div className="flex justify-center">
              <Link href="/chat">
                <Button size="lg" className="h-14 px-10 rounded-full text-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                  Get Started for Free
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
                No credit card required. Free plan available.
            </p>
          </AnimateInView>
        </div>
      </div>
    </section>
  )
}
