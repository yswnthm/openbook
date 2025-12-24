import Link from 'next/link'
import Image, { ImageProps } from 'next/image'
import React from 'react'

// Custom link component that handles internal and external links
function CustomLink(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const href = props.href || ''

  if (href.startsWith('/')) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    )
  }

  if (href.startsWith('#')) {
    return <a {...props} />
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />
}

// Helper function for heading IDs
function createSlug(input: React.ReactNode): string {
  if (typeof input !== 'string') {
    // Handle non-string input
    if (React.isValidElement(input)) {
      // Try to extract text content from React elements
      const props = input.props as { children?: React.ReactNode };
      if (props.children) {
        return createSlug(React.Children.toArray(props.children).join(' '));
      }
    } else if (Array.isArray(input)) {
      // Handle array of elements
      return createSlug(React.Children.toArray(input).join(' '));
    }
    // Fall back to empty string or generated ID
    return `heading-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  return input
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
}

// Define proper type for heading components
interface HeadingProps {
  children: React.ReactNode;
}

// Custom heading components with anchor links
function H1(props: HeadingProps) {
  const id = createSlug(props.children)
  return (
    <h1 id={id} className="group flex whitespace-pre-wrap text-4xl font-bold mt-8 mb-4">
      <span>{props.children}</span>
      <a href={`#${id}`} className="ml-2 opacity-0 group-hover:opacity-100 text-neutral-400">
        #
      </a>
    </h1>
  )
}

function H2(props: HeadingProps) {
  const id = createSlug(props.children)
  return (
    <h2 id={id} className="group flex whitespace-pre-wrap text-3xl font-bold mt-8 mb-4">
      <span>{props.children}</span>
      <a href={`#${id}`} className="ml-2 opacity-0 group-hover:opacity-100 text-neutral-400">
        #
      </a>
    </h2>
  )
}

function H3(props: HeadingProps) {
  const id = createSlug(props.children)
  return (
    <h3 id={id} className="group flex whitespace-pre-wrap text-2xl font-semibold mt-6 mb-3">
      <span>{props.children}</span>
      <a href={`#${id}`} className="ml-2 opacity-0 group-hover:opacity-100 text-neutral-400">
        #
      </a>
    </h3>
  )
}

function H4(props: HeadingProps) {
  const id = createSlug(props.children)
  return (
    <h4 id={id} className="group flex whitespace-pre-wrap text-xl font-semibold mt-6 mb-3">
      <span>{props.children}</span>
      <a href={`#${id}`} className="ml-2 opacity-0 group-hover:opacity-100 text-neutral-400">
        #
      </a>
    </h4>
  )
}

// List components
function UL(props: React.HTMLAttributes<HTMLUListElement>) {
  return <ul className="list-disc pl-6 my-4 space-y-2" {...props} />
}

function OL(props: React.HTMLAttributes<HTMLOListElement>) {
  return <ol className="list-decimal pl-6 my-4 space-y-2" {...props} />
}

function LI(props: React.HTMLAttributes<HTMLLIElement>) {
  return <li className="mb-1" {...props} />
}

// Blockquote component
function BlockQuote(props: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) {
  return <blockquote className="border-l-4 border-blue-500 pl-4 italic my-6 text-neutral-300" {...props} />
}

// Responsive image component with proper typing
type ResponsiveImageProps = ImageProps & { alt: string }

function ResponsiveImage(props: ResponsiveImageProps) {
  const { alt, ...rest } = props
  return (
    <div className="my-6">
      <Image 
        alt={alt || ''}
        className="rounded-lg mx-auto"
        {...rest}
      />
    </div>
  )
}

// Code component
function Code(props: React.HTMLAttributes<HTMLElement>) {
  return <code className="bg-neutral-800 px-1.5 py-0.5 rounded-md text-sm" {...props} />
}

// Pre component for code blocks
function Pre(props: React.HTMLAttributes<HTMLPreElement>) {
  return <pre className="bg-neutral-800 p-4 rounded-lg overflow-x-auto my-6" {...props} />
}

// Table component
function Table(props: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="my-8 overflow-x-auto">
      <table className="w-full" {...props} />
    </div>
  )
}

// Horizontal rule
function HR() {
  return <hr className="my-8 border-neutral-700" />
}

// Paragraph
function P(props: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className="my-4 leading-relaxed" {...props} />
}

// Components collection
const MDXComponents = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  a: CustomLink,
  img: ResponsiveImage,
  Image: ResponsiveImage,
  code: Code,
  pre: Pre,
  table: Table,
  ul: UL,
  ol: OL,
  li: LI,
  blockquote: BlockQuote,
  hr: HR,
  p: P,
}

export default MDXComponents 