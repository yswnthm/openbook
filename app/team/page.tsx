"use client"

import { CombinedFooter, Header, LandingBackground, PageHero, CallToAction, AnimateInView } from "@/components/landing"
import { Github, Twitter, Globe } from "lucide-react"
import Link from "next/link"

interface TeamMember {
    name: string;
    role: string;
    bio: string;
    social?: {
        twitter?: string;
        github?: string;
        portfolio?: string;
    }
}

const teamMembers: TeamMember[] = [
    {
        name: "Yeswanth Madasu",
        role: "Solo Developer",
        bio: "3rd year UG CS Undergrad. Building OpenBook to help people learn better.",
        social: {
            twitter: "https://x.com/yswnth",
            github: "https://github.com/yeswanth49",
            portfolio: "https://yswnth.in"
        }
    }
];

export default function TeamPage() {
    return (
        <div className="min-h-screen text-foreground overflow-x-hidden selection:bg-primary/20">
            <LandingBackground />
            <Header />

            <main>
                <PageHero
                    title="Our Team"
                    subtitle="Meet the developer behind OpenBook."
                />

                <section className="py-12 md:py-24">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="flex justify-center max-w-4xl mx-auto">
                            {teamMembers.map((member, index) => (
                                <AnimateInView key={member.name} delay={index * 0.1} className="w-full max-w-md">
                                    <div className="group h-full flex flex-col items-center p-8 rounded-2xl bg-background/30 backdrop-blur-md border border-white/10 hover:border-white/20 hover:bg-background/40 transition-all duration-300 shadow-sm hover:shadow-lg">
                                        {/* Avatar */}
                                        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 mb-6 flex items-center justify-center text-2xl font-bold text-white shadow-inner overflow-hidden">
                                            {/*  If we had a real image, we'd use Next.js Image here. For now, initials. */}
                                            <span className="text-4xl">{member.name.charAt(0)}</span>
                                        </div>

                                        <h3 className="text-2xl font-bold text-center mb-2 group-hover:text-primary transition-colors">{member.name}</h3>
                                        <p className="text-sm font-medium text-primary text-center mb-4 uppercase tracking-wider">{member.role}</p>
                                        <p className="text-muted-foreground text-center mb-8 leading-relaxed flex-grow">
                                            {member.bio}
                                        </p>

                                        {member.social && (
                                            <div className="flex space-x-4 mt-auto">
                                                {member.social.portfolio && (
                                                    <Link href={member.social.portfolio} target="_blank" className="p-2 rounded-full text-muted-foreground hover:bg-foreground hover:text-background transition-colors">
                                                        <Globe className="h-5 w-5" />
                                                    </Link>
                                                )}
                                                {member.social.twitter && (
                                                    <Link href={member.social.twitter} target="_blank" className="p-2 rounded-full text-muted-foreground hover:bg-foreground hover:text-background transition-colors">
                                                        <Twitter className="h-5 w-5" />
                                                    </Link>
                                                )}
                                                {member.social.github && (
                                                    <Link href={member.social.github} target="_blank" className="p-2 rounded-full text-muted-foreground hover:bg-foreground hover:text-background transition-colors">
                                                        <Github className="h-5 w-5" />
                                                    </Link>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </AnimateInView>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="pb-24">
                    <CallToAction
                        title="Join Us in Transforming Education"
                        description="Be part of the revolution in learning technology."
                        buttonText="Get Started"
                        buttonHref="https://cal.com/yeshh49"
                        withBreak={true}
                    />
                </section>

            </main>

            <CombinedFooter />
        </div>
    )
}
