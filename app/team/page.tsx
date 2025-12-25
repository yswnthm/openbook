"use client"

import { CombinedFooter, Header, LandingBackground, PageHero, CallToAction, AnimateInView } from "@/components/landing"
import { Github, Twitter } from "lucide-react"
import Link from "next/link"

interface TeamMember {
    name: string;
    role: string;
    bio: string;
    social?: {
        twitter?: string;
        github?: string;
    }
}

const teamMembers: TeamMember[] = [
    {
        name: "John Doe",
        role: "Co-Founder & CEO",
        bio: "John is passionate about AI and education. With over 10 years of experience in EdTech, he leads our vision to make learning more accessible and personalized.",
        social: {
            twitter: "https://x.com/Yeshh49",
            github: "https://github.com/yeswanth49",
        }
    },
    {
        name: "Jane Smith",
        role: "Co-Founder & CTO",
        bio: "Jane brings deep technical expertise in AI and machine learning. She's the architect behind our advanced learning algorithms and user experience.",
        social: {
            twitter: "https://x.com/Yeshh49",
            github: "https://github.com/yeswanth49",
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
                    subtitle="Meet the passionate individuals behind OpenBook transforming how we learn."
                />

                <section className="py-12 md:py-24">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {teamMembers.map((member, index) => (
                                <AnimateInView key={member.name} delay={index * 0.1}>
                                    <div className="group h-full flex flex-col items-center p-8 rounded-2xl bg-background/30 backdrop-blur-md border border-white/10 hover:border-white/20 hover:bg-background/40 transition-all duration-300 shadow-sm hover:shadow-lg">
                                        {/* Placeholder Avatar */}
                                        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 mb-6 flex items-center justify-center text-2xl font-bold text-white shadow-inner">
                                            {member.name.charAt(0)}
                                        </div>

                                        <h3 className="text-2xl font-bold text-center mb-2 group-hover:text-primary transition-colors">{member.name}</h3>
                                        <p className="text-sm font-medium text-primary text-center mb-4 uppercase tracking-wider">{member.role}</p>
                                        <p className="text-muted-foreground text-center mb-8 leading-relaxed flex-grow">
                                            {member.bio}
                                        </p>

                                        {member.social && (
                                            <div className="flex space-x-4 mt-auto">
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
