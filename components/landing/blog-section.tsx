"use client"

import { useState, useMemo, useCallback } from 'react'
import { Brain, Lightbulb, PenTool, ChevronRight } from "lucide-react"
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import AnimateInView from "./animate-in-view"
import SectionHeading from "./section-heading"

const BlogCard = dynamic(() => import('@/components/landing/blog-card'), {
    loading: () => <Card className="p-6 h-96 animate-pulse bg-muted/20 border-none"></Card>
})

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

export function BlogSection() {
    const router = useRouter();

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

    const handleViewAllArticles = useCallback(() => {
        router.push('/blogs');
    }, [router]);

    return (
        <section className="py-24">
            <div className="container mx-auto px-4 md:px-6">
                <SectionHeading title="From Our Blog" description="Latest articles and insights for better learning" />

                <div className="mt-12 grid md:grid-cols-3 gap-8">
                    {fallbackPosts.map((post, index) => (
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
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Button
                        variant="ghost"
                        className="text-muted-foreground hover:text-foreground hover:bg-transparent p-0 underline-offset-4 hover:underline"
                        onClick={handleViewAllArticles}
                    >
                        View All Articles <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </section>
    )
}
