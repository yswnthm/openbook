"use client"

import { motion } from "framer-motion"
import AnimateInView from "./animate-in-view"

interface PageHeroProps {
    title: string
    subtitle?: string
    centered?: boolean
    className?: string
}

export function PageHero({ title, subtitle, centered = true, className = "" }: PageHeroProps) {
    return (
        <section className={`relative pt-32 pb-16 md:pt-48 md:pb-32 flex flex-col justify-center ${className}`}>
            <div className="container mx-auto px-4 md:px-6 z-10">
                <div className={`flex flex-col ${centered ? "items-center text-center" : "items-start text-left"} max-w-4xl mx-auto space-y-6`}>
                    <AnimateInView delay={0.1}>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground">
                            {title}
                        </h1>
                    </AnimateInView>

                    {subtitle && (
                        <AnimateInView delay={0.2}>
                            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
                                {subtitle}
                            </p>
                        </AnimateInView>
                    )}
                </div>
            </div>
        </section>
    )
}
