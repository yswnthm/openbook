"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronRight, Brain, Search, Edit, PenTool, KeyRound, Lightbulb, Clock, Sparkles } from "lucide-react"
import Header from "@/components/landing/header"
import AnimateInView from "@/components/landing/animate-in-view"
import SectionHeading from "@/components/landing/section-heading"
import { SectionSeparator } from "@/components/ui/section-separator"
import { motion } from "framer-motion"
import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Providers } from './(config)/providers'
import CombinedFooter from "@/components/landing/CombinedFooter"

// Dynamically import heavy or rarely-visible components
const BlogCard = dynamic(() => import('@/components/landing/blog-card'), {
    loading: () => <Card className="p-6 h-96 animate-pulse"></Card>
})

const FeatureCard = dynamic(() => import('@/components/landing/feature-card').then(mod => ({ default: mod.FeatureCard })), {
    loading: () => <Card className="p-6 h-64 animate-pulse"></Card>
})

const CallToAction = dynamic(() => import('@/components/landing/call-to-action').then(mod => ({ default: mod.CallToAction })), {
    loading: () => <div className="py-20"></div>
})

// Blog post interface for type safety
interface BlogPost {
    title: string
    excerpt: string
    date: string
    readTime?: string
    author: string
    image?: string
    slug: string
    category: string
    featured?: boolean
    icon?: any
}

export default function LandingPage() {
    const router = useRouter();
    const [latestPosts, setLatestPosts] = useState<BlogPost[]>([])

    // Fallback posts
    const fallbackPosts = useMemo(() => [
        {
            title: "Learning with AI",
            excerpt: "Discover how AI is transforming the education landscape and helping students learn more effectively.",
            date: "2023-06-15",
            readTime: "5 min read",
            author: "OpenBook Team",
            icon: Brain,
            slug: "learning-with-ai",
            category: "Education"
        },
        {
            title: "The Science of Memory",
            excerpt: "Understanding how the brain processes and retains information can help you optimize your study habits.",
            date: "2023-06-10",
            readTime: "4 min read",
            author: "OpenBook Team",
            icon: Lightbulb,
            slug: "science-of-memory",
            category: "Psychology"
        },
        {
            title: "Note-Taking Strategies",
            excerpt: "Effective note-taking methods that can help you capture and organize information for better recall.",
            date: "2023-06-05",
            readTime: "3 min read",
            author: "OpenBook Team",
            icon: PenTool,
            slug: "note-taking-strategies",
            category: "Productivity"
        },
    ], [])

    // Use memoized blog post rendering
    const renderedBlogPosts = useMemo(() => {
        // Just use fallback for now
        return fallbackPosts.map((post, index) => (
            <AnimateInView key={post.slug} delay={0.1 * (index + 1)}>
                <BlogCard
                    title={post.title}
                    excerpt={post.excerpt}
                    date={post.date}
                    readTime={post.readTime || ''}
                    author={post.author}
                    icon={post.icon}
                    slug={post.slug}
                />
            </AnimateInView>
        ));
    }, [fallbackPosts]);

    const handleViewAllArticles = useCallback(() => {
        router.push('/blogs');
    }, [router]);

    return (
        <Providers>
            <div>
                <Header />
                <div className="landing-content animate-fadeIn pt-24 text-foreground">
                    {/* Hero Section */}
                    <section className="relative overflow-hidden py-24 md:py-32">
                        <div className="container mx-auto px-4 md:px-6">
                            <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
                                <AnimateInView>
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 gradient-text">
                                        Clarity in <span className="font-instrument-serif">Complexity</span>, Built for Learners
                                    </h1>
                                    <p className="text-lg md:text-xl mb-8 text-muted-foreground max-w-2xl mx-auto">
                                        OpenBook is an AI-native notebook that helps you learn, retain, and apply knowledge more effectively than ever before.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <Link href="/chat">
                                            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 group">
                                                Get Started
                                                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                            </Button>
                                        </Link>
                                        <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-foreground/10">
                                            See How It Works
                                        </Button>
                                    </div>
                                </AnimateInView>
                            </div>
                        </div>
                    </section>

                    <SectionSeparator />

                    {/* Key Features Section */}
                    <section className="py-20 relative overflow-hidden">
                        <div className="absolute inset-0 bg-dots -z-10"></div>
                        <div className="container mx-auto px-4 md:px-6">
                            <SectionHeading
                                title="Speed Is Everything"
                                description="Designed for students and lifelong learners who value their time"
                            />

                            <div className="mt-12 mb-16">
                                <AnimateInView>
                                    <div className="relative rounded-xl overflow-hidden border border-border/20 shadow-2xl">
                                        <Image
                                            src="/screenshots/graph.png"
                                            alt="OpenBook Graph Interface"
                                            width={1200}
                                            height={675}
                                            className="w-full h-auto"
                                        />
                                    </div>
                                </AnimateInView>
                            </div>
                        </div>
                    </section>

                    <SectionSeparator />

                    {/* Core Features Grid */}
                    <section className="py-20">
                        <div className="container mx-auto px-4 md:px-6">
                            <div className="grid md:grid-cols-3 gap-8">
                                <AnimateInView delay={0.1}>
                                    <FeatureCard
                                        id="lightning-fast-interface"
                                        icon={KeyRound}
                                        title="Lightning-Fast Interface"
                                        description="Navigate your entire notebook using just your keyboard. Process and organize information in seconds."
                                    />
                                </AnimateInView>

                                <AnimateInView delay={0.2}>
                                    <FeatureCard
                                        id="ai-powered-learning"
                                        icon={Brain}
                                        title="AI-Powered Learning"
                                        description="Let our AI generate explanations, create practice questions, and provide personalized study materials."
                                    />
                                </AnimateInView>

                                <AnimateInView delay={0.3}>
                                    <FeatureCard
                                        id="smart-search"
                                        icon={Search}
                                        title="Smart Search"
                                        description="Create personalized learning flows that match exactly how you study, memorize, and process information."
                                    />
                                </AnimateInView>
                            </div>
                        </div>
                    </section>

                    <SectionSeparator />

                    {/* Interface Preview Section */}
                    <section className="relative overflow-hidden">
                        <div className="container mx-auto px-4 md:px-6">
                            <SectionHeading
                                title="Optimized for Phones Too!!"
                                description="Designed for students and lifelong learners who value their time"
                            />

                            <div className="mt-12 mb-16 relative">
                                <AnimateInView>
                                    <div className="relative">
                                        <Image
                                            src="/screenshots/iPhones1.png"
                                            alt="OpenBook Graph Interface"
                                            width={1200}
                                            height={675}
                                            className="w-full h-auto"
                                        />

                                        {/* Glassmorphism overlay */}
                                        <div className="absolute bottom-0 left-0 right-0 md:inset-auto md:left-[5%] md:top-1/2 md:transform md:-translate-y-1/2 bg-background/40 backdrop-blur-md rounded-t-lg md:rounded-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)] md:w-[320px] md:max-w-xs z-10 p-4 md:p-6 flex items-center md:block">
                                            <div className="w-full md:w-auto px-4 md:px-0">
                                                <h3 className="text-lg md:text-xl font-bold mb-2 gradient-text">Mobile First</h3>
                                                <p className="text-xs md:text-sm text-muted-foreground">Access your notes anywhere with our fully responsive design optimized for all your devices.</p>
                                            </div>
                                        </div>
                                    </div>
                                </AnimateInView>
                            </div>
                        </div>
                    </section>

                    <SectionSeparator />
                    {/* Natural Language Interaction */}
                    <section className="py-20">
                        <div className="container mx-auto px-4 md:px-6">
                            <SectionHeading
                                title="AI notebook chat with natural language"
                                description="Ask away"
                            />

                            <div className="mt-10 max-w-3xl mx-auto">
                                <AnimateInView>
                                    <Card className="p-6 bg-card/80 border-border/20 backdrop-blur-sm">
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-8">
                                                <div className="lg:col-span-3 space-y-6">
                                                    <div className="flex items-start space-x-4 p-4 rounded-lg bg-accent/30">
                                                        <PenTool className="h-4 w-4 text-foreground/60" />
                                                        <div className="flex-1">
                                                            <p className="text-foreground/80">Explain quantum computing for beginners</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start space-x-4 p-4 rounded-lg bg-accent/30">
                                                        <PenTool className="h-4 w-4 text-foreground/60" />
                                                        <div className="flex-1">
                                                            <p className="text-foreground/80">Generate practice questions about cell biology</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start space-x-4 p-4 rounded-lg bg-accent/30">
                                                        <PenTool className="h-4 w-4 text-foreground/60" />
                                                        <div className="flex-1">
                                                            <p className="text-foreground/80">Create a study schedule for my calculus exam</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start space-x-4 p-4 rounded-lg bg-accent/30">
                                                        <PenTool className="h-4 w-4 text-foreground/60" />
                                                        <div className="flex-1">
                                                            <p className="text-foreground/80">Find my notes on Renaissance art</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start space-x-4 p-4 rounded-lg bg-accent/30">
                                                        <PenTool className="h-4 w-4 text-foreground/60" />
                                                        <div className="flex-1">
                                                            <p className="text-foreground/80">Summarize all my notes on machine learning</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </AnimateInView>
                            </div>
                        </div>
                    </section>

                    <SectionSeparator />

                    {/* Productivity Benefits Section */}
                    <section className="py-20">
                        <div className="container mx-auto px-4 md:px-6">
                            <div className="max-w-3xl mx-auto text-center">
                                <AnimateInView>
                                    <div className="inline-flex p-1 bg-accent/20 rounded-full mb-6">
                                        <div className="flex items-center space-x-2 px-4 py-2 bg-accent/20 rounded-full">
                                            <Clock className="h-4 w-4 text-foreground/60" />
                                            <span className="text-sm font-medium text-foreground/80">Productivity Benefits</span>
                                        </div>
                                    </div>

                                    <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">
                                        Learn smarter, not harder
                                    </h2>

                                    <p className="text-lg text-muted-foreground mb-8">
                                        Automate repetitive study tasks with smart templates, scheduled reviews, memory-optimized learning paths, and personalized practice that save hours every week while boosting retention.
                                    </p>

                                    <div className="flex flex-wrap justify-center gap-4">
                                        <div className="flex items-center space-x-2">
                                            <Sparkles className="h-5 w-5 text-foreground/60" />
                                            <span className="text-foreground/80">Spaced repetition</span>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Sparkles className="h-5 w-5 text-foreground/60" />
                                            <span className="text-foreground/80">Active recall</span>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Sparkles className="h-5 w-5 text-foreground/60" />
                                            <span className="text-foreground/80">Concept mapping</span>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Sparkles className="h-5 w-5 text-foreground/60" />
                                            <span className="text-foreground/80">Knowledge synthesis</span>
                                        </div>
                                    </div>
                                </AnimateInView>
                            </div>
                        </div>
                    </section>

                    <SectionSeparator />

                    {/* Blog Section */}
                    <section className="py-20">
                        <div className="container mx-auto px-4 md:px-6">
                            <SectionHeading title="From Our Blog" description="Latest articles and insights" />

                            <div className="mt-12 grid md:grid-cols-3 gap-8">
                                {renderedBlogPosts}
                            </div>

                            <div className="mt-8 text-center">
                                <Button
                                    variant="outline"
                                    className="border-border text-foreground hover:bg-foreground/10"
                                    onClick={handleViewAllArticles}
                                >
                                    View All Articles <ChevronRight className="ml-2 h-4 w-4 inline-block" />
                                </Button>
                            </div>
                        </div>
                    </section>

                    <SectionSeparator />

                    {/* Call to Action Section */}
                    <section className="py-20 relative overflow-hidden">
                        <div className="absolute inset-0 bg-dots -z-10"></div>
                        <CallToAction
                            title="Experience the Future of Learning Today"
                            description="Watch how OpenBook helps you learn in a fraction of the time."
                            buttonText="Get Started"
                            buttonHref="/chat"
                        />
                    </section>

                    <CombinedFooter />
                </div>

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
