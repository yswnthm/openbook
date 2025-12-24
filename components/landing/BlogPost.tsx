'use client'

import React, { useState, useEffect } from 'react'
import { MDXRemote } from 'next-mdx-remote'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import mdxComponents from '@/components/landing/mdx-components'

interface BlogPostProps {
  mdxSource: MDXRemoteSerializeResult
  frontmatter: {
    title: string
    date: string
    author: string
    readTime?: string
  }
}

export default function BlogPost({ mdxSource, frontmatter }: BlogPostProps) {
  const [mdxError, setMdxError] = useState<boolean>(false);
  
  // Handle potential rendering errors with MDX content
  useEffect(() => {
    if (!mdxSource || Object.keys(mdxSource).length === 0) {
      setMdxError(true);
    }
  }, [mdxSource]);

  return (
    <main className="container mx-auto px-4 md:px-6 py-20">
      <article className="prose prose-invert max-w-none">
        <h1>{frontmatter.title}</h1>
        <p className="text-muted-foreground mb-8">
          <time dateTime={new Date(frontmatter.date).toISOString()}>{frontmatter.date}</time> • {frontmatter.author}
          {frontmatter.readTime && (
            <>
              {' • '}{frontmatter.readTime}
            </>
          )}
        </p>
        
        {mdxError ? (
          <div className="p-4 border border-red-500 rounded">
            <h3>Error loading content</h3>
            <p>Sorry, there was a problem loading this article content. Please try again later.</p>
          </div>
        ) : (
          <React.Suspense fallback={<div>Loading content...</div>}>
            <ErrorBoundary>
              <MDXRemote {...mdxSource} components={mdxComponents} />
            </ErrorBoundary>
          </React.Suspense>
        )}
      </article>
    </main>
  )
}

// Simple error boundary component
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-red-500 rounded">
          <h3>Error rendering content</h3>
          <p>Sorry, there was a problem rendering this article content.</p>
        </div>
      );
    }
    try {
      return this.props.children;
    } catch (err) {
      return (
        <div className="p-4 border border-red-500 rounded">
          <h3>Error rendering content</h3>
          <p>Sorry, there was a problem rendering this article content.</p>
        </div>
      );
    }
  }
} 