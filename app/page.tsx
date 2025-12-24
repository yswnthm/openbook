"use client"

import Header from "@/components/landing/header"
import { SectionSeparator } from "@/components/ui/section-separator"
import { Providers } from './(config)/providers'
import CombinedFooter from "@/components/landing/CombinedFooter"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { InterfacePreviewSection } from "@/components/landing/interface-preview-section"
import { ProductivitySection } from "@/components/landing/productivity-section"

import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { CTASection } from "@/components/landing/cta-section"
import AnimateInView from "@/components/landing/animate-in-view"

import { LandingBackground } from "@/components/landing/landing-background"

export default function LandingPage() {
    return (
        <Providers>
            <LandingBackground />

            <div className="min-h-screen text-foreground overflow-x-hidden selection:bg-primary/20">
                <Header />

                <main className="animate-fadeIn pt-16 md:pt-24">
                    <HeroSection />

                    <AnimateInView>
                        <SectionSeparator />
                    </AnimateInView>

                    <FeaturesSection />

                    <AnimateInView>
                        <SectionSeparator />
                    </AnimateInView>

                    <InterfacePreviewSection />

                    <AnimateInView>
                        <SectionSeparator />
                    </AnimateInView>



                    <ProductivitySection />

                    <AnimateInView>
                        <SectionSeparator />
                    </AnimateInView>

                    <TestimonialsSection />

                    <AnimateInView>
                        <SectionSeparator />
                    </AnimateInView>

                    <CTASection />
                </main>

                <CombinedFooter />

                {/* Basic styles for fadeIn animation of landing content */}
                <style jsx global>{`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fadeIn {
                        animation: fadeIn 1s ease-out forwards;
                    }
                `}</style>
            </div>
        </Providers>
    )
}