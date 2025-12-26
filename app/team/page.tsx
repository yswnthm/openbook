"use client"

import { CombinedFooter, Header, LandingBackground } from "@/components/landing"
import { TeamHero } from "@/components/team/team-hero"

export default function TeamPage() {
    return (
        <div className="flex flex-col min-h-screen text-foreground overflow-x-hidden selection:bg-primary/20">
            <LandingBackground />
            <Header />

            <main className="flex-1 pt-32 pb-16">
                <TeamHero />
            </main>

            <CombinedFooter />
        </div>
    )
}