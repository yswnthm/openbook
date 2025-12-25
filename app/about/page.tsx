"use client"

import { CombinedFooter, Header, LandingBackground, PageHero } from "@/components/landing"
import AnimateInView from "@/components/landing/animate-in-view"
import { Button } from "@/components/ui/button"
import { SectionSeparator } from "@/components/ui/section-separator"
import { ArrowRight, Github, Mail, Globe } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
    return (
        <div className="min-h-screen text-foreground overflow-x-hidden selection:bg-primary/20">
            <LandingBackground />
            <Header />

            <main>
                <PageHero
                    title="About Us"
                    subtitle="Reimagining the way we capture, retain, and apply knowledge."
                />

                <AnimateInView>
                    <SectionSeparator />
                </AnimateInView>

                {/* Mission Section */}
                <section className="py-24 relative">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                            <AnimateInView delay={0.1} className="space-y-6">
                                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                                    Our Mission
                                </h2>
                                <div className="h-1 w-20 bg-primary/50 rounded-full" />
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    OpenBook is an AI-powered reading platform that manages your library, so you don't have to.
                                    We help busy readers unlock knowledge, prioritize important content, summarize books and articles,
                                    complete reading goals, and even chat with their reading material.
                                </p>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    Our goal is to let you spend less time managing books and more time gaining insights and knowledge.
                                </p>
                            </AnimateInView>

                            <AnimateInView delay={0.3} className="bg-muted/30 border border-border/50 rounded-2xl p-8 backdrop-blur-sm">
                                <h3 className="text-2xl font-bold mb-4">Why We Started</h3>
                                <p className="text-muted-foreground mb-6">
                                    Reading hasn't meaningfully evolved in decades. Despite countless new apps, none actually solve the real problem: helping you finish what you intend to read and extract valuable insights.
                                </p>
                                <p className="text-muted-foreground font-medium">
                                    We realized the real solution isn't just a new interface — it's AI acting like a true assistant inside your reading experience.
                                </p>
                            </AnimateInView>
                        </div>
                    </div>
                </section>

                <AnimateInView>
                    <SectionSeparator />
                </AnimateInView>

                {/* Open Source Section */}
                <section className="py-24 bg-muted/20">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="max-w-4xl mx-auto text-center space-y-8">
                            <AnimateInView>
                                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Built in the Open</h2>
                                <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                                    OpenBook is built on the principles of transparency and community collaboration. Our entire codebase is open source.
                                </p>
                            </AnimateInView>

                            <AnimateInView delay={0.2}>
                                <div className="grid md:grid-cols-3 gap-6 text-left">
                                    {[
                                        "Review code for security & privacy",
                                        "Contribute improvements & features",
                                        "Self-host your own instance"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center space-x-3 p-4 bg-background border border-border/50 rounded-xl">
                                            <div className="h-2 w-2 rounded-full bg-green-500" />
                                            <span className="font-medium">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </AnimateInView>

                            <AnimateInView delay={0.4} className="pt-8">
                                <Link href="https://github.com/yeswanth49/openbook" target="_blank">
                                    <Button variant="outline" size="lg" className="rounded-full gap-2">
                                        <Github className="w-5 h-5" />
                                        Star on GitHub
                                    </Button>
                                </Link>
                            </AnimateInView>
                        </div>
                    </div>
                </section>

                <AnimateInView>
                    <SectionSeparator />
                </AnimateInView>

                {/* Contact Section */}
                <section className="py-24">
                    <div className="container mx-auto px-4 md:px-6 text-center">
                        <AnimateInView>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">Get in Touch</h2>
                            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                                <Link href="mailto:work.yeswanth@gmail.com">
                                    <Button variant="ghost" className="text-lg h-12 gap-3">
                                        <Mail className="w-5 h-5" />
                                        work.yeswanth@gmail.com
                                    </Button>
                                </Link>
                                <Link href="https://yesh.vercel.app" target="_blank">
                                    <Button variant="ghost" className="text-lg h-12 gap-3">
                                        <Globe className="w-5 h-5" />
                                        Portfolio
                                    </Button>
                                </Link>
                            </div>
                        </AnimateInView>
                    </div>
                </section>

            </main>

            <CombinedFooter />
        </div>
    )
}
