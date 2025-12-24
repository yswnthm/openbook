"use client"

import Image from "next/image"
import AnimateInView from "./animate-in-view"
import SectionHeading from "./section-heading"

export function InterfacePreviewSection() {
  return (
    <section className="py-40 lg:py-64 relative overflow-hidden bg-muted/30">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[55%] h-[120%] z-0 hidden lg:block pointer-events-none">
        <div className="relative w-full h-full">
          <Image
            src="/screenshots/iPhones1.png"
            alt="OpenBook Mobile Interface"
            fill
            className="object-contain object-right"
          />
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-xl">
          <SectionHeading
            title="Optimized for Phones Too!!"
            description="Access your notes anywhere with our fully responsive design optimized for all your devices. Whether you're on the bus or in bed, your learning continues."
            centered={false}
            className="mb-8"
          />

          <AnimateInView delay={0.2}>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
                <p className="text-muted-foreground">Seamless sync across all devices</p>
              </div>
              <div className="flex items-start space-x-4">
                <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
                <p className="text-muted-foreground">Touch-optimized interface for mobile learning</p>
              </div>
              <div className="flex items-start space-x-4">
                <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
                <p className="text-muted-foreground">Offline access to your most recent notes</p>
              </div>
            </div>
          </AnimateInView>
        </div>

        {/* Mobile Image (Visible only on smaller screens) */}
        <div className="mt-12 lg:hidden">
          <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl mx-auto max-w-[300px]">
            <Image
              src="/screenshots/iPhones1.png"
              alt="OpenBook Mobile Interface"
              width={600}
              height={1200}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
