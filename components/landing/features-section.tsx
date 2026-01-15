"use client"

import { Brain, Search, Sparkles, BookOpen, Share2, Zap } from "lucide-react"
import AnimateInView from "./animate-in-view"
import SectionHeading from "./section-heading"
import { motion } from "framer-motion"
import LottieAnimation from "@/components/ui/lottie-animation"
import { ChatCompactConfirmation } from "@/components/features/chat/chat-compact-confirmation"
import { useIsSafari } from "@/hooks/use-is-safari"
import { useState } from "react"

// --- Component: BentoCard ---
interface BentoCardProps {
  title: string
  description: string
  className?: string
  children?: React.ReactNode
  delay?: number
}

function BentoCard({ title, description, className = "", children, delay = 0 }: BentoCardProps) {
  const isSafari = useIsSafari()

  return (
    <motion.div
      initial={isSafari ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      whileInView={isSafari ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      transition={isSafari ? { duration: 0 } : { duration: 0.5, delay }}
      viewport={{ once: true }}
      className={`group relative overflow-hidden rounded-3xl bg-card/50 border border-border/40 backdrop-blur-sm hover:bg-card/80 transition-all duration-500 flex flex-col transform-gpu ${className}`}
      style={{
        WebkitMaskImage: '-webkit-radial-gradient(white, black)',
        WebkitBackfaceVisibility: 'hidden',
        MozBackfaceVisibility: 'hidden',
      }}
    >
      <div className="p-6 md:p-8 flex flex-col h-full z-10">
        <h3 className="text-xl md:text-2xl font-bold mb-3">{title}</h3>
        <p className="text-muted-foreground leading-relaxed mb-6 max-w-[90%]">{description}</p>
        <div className="mt-auto w-full flex-grow flex items-center justify-center relative">
          {children}
        </div>
      </div>

      {/* Subtle Gradient Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.div>
  )
}

// --- Specific Feature Visuals ---

// 1. Chat Mode Visual
function ChatFeatureVisual() {
  const [showCompact, setShowCompact] = useState(true)

  return (
    <div className="relative w-full h-[250px] md:h-[300px] bg-background/40 rounded-xl border border-border/30 overflow-hidden flex flex-col shadow-sm">
      {/* Mock Header */}
      <div className="h-10 border-b border-border/30 flex items-center px-4 gap-2 bg-muted/20">
        <div className="w-3 h-3 rounded-full bg-red-400/80" />
        <div className="w-3 h-3 rounded-full bg-amber-400/80" />
        <div className="w-3 h-3 rounded-full bg-green-400/80" />
      </div>

      {/* Mock Chat Content */}
      <div className="p-4 space-y-4 flex-1">
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0" />
          <div className="bg-muted/30 rounded-2xl rounded-tl-none p-3 text-sm text-foreground/80 w-[80%]">
            How can I explain this complex topic simply?
          </div>
        </div>
        <div className="flex gap-3 flex-row-reverse">
          <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0" />
          <div className="bg-primary/10 rounded-2xl rounded-tr-none p-3 text-sm w-[80%]">
            <span className="opacity-50">Thinking...</span>
          </div>
        </div>
      </div>

      {/* Floating Lottie for "Thinking" */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20">
        <LottieAnimation
          className="w-48 h-48"
          placeholderText="Thinking Animation"
        />
      </div>

      {/* Embedded Component */}
      <div className="absolute bottom-4 right-4 z-20">
        {/* We wrap it in a div that positions it similar to how it works in the app, but static here or non-dismissible for demo unless we want interaction */}
        <div className="relative transform scale-90 origin-bottom-right shadow-lg">
          <ChatCompactConfirmation
            onConfirm={() => { }}
            onCancel={() => { }}
            className="!static !bottom-auto !left-auto !mb-0"
            autoFocus={false}
          />
        </div>
      </div>
    </div>
  )
}

// 2. Journal Mode Visual
function JournalFeatureVisual() {
  return (
    <div className="w-full h-full min-h-[200px] relative bg-background/40 rounded-xl border border-border/30 p-4 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-4 border-b border-border/20 pb-2">
        <div className="text-xs font-medium text-muted-foreground">Today's Entry</div>
        <BookOpen className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <div className="h-2 w-3/4 bg-muted/40 rounded-full" />
        <div className="h-2 w-full bg-muted/40 rounded-full" />
        <div className="h-2 w-5/6 bg-muted/40 rounded-full" />
        <div className="h-2 w-4/5 bg-muted/40 rounded-full" />
      </div>

      <div className="absolute right-2 bottom-2 w-16 h-16 opacity-30">
        <LottieAnimation placeholderText="Writing" className="w-full h-full" />
      </div>
    </div>
  )
}

// 3. Socratic Tutor Visual
function SocraticVisual() {
  return (
    <div className="w-full h-full min-h-[150px] flex items-center justify-center relative bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-xl border border-border/20">
      <Brain className="w-12 h-12 text-indigo-500/40 mb-2" />
      <div className="absolute inset-0 flex items-center justify-center">
        <LottieAnimation placeholderText="Dialogue" className="w-32 h-32 opacity-60" />
      </div>
    </div>
  )
}

// 4. Feynman Method Visual
function FeynmanVisual() {
  return (
    <div className="w-full h-full min-h-[150px] flex items-center justify-center relative bg-gradient-to-br from-amber-500/5 to-orange-500/5 rounded-xl border border-border/20">
      <Sparkles className="w-12 h-12 text-amber-500/40 mb-2" />
      <div className="absolute inset-0 flex items-center justify-center">
        <LottieAnimation placeholderText="Simplifying" className="w-32 h-32 opacity-60" />
      </div>
    </div>
  )
}

// 5. Smart Search Visual
function SmartSearchVisual() {
  return (
    <div className="w-full h-full min-h-[150px] flex flex-col relative bg-background/40 rounded-xl border border-border/30 overflow-hidden">
      <div className="p-3 border-b border-border/20 flex items-center gap-2">
        <Search className="w-4 h-4 text-muted-foreground" />
        <div className="h-4 w-32 bg-muted/30 rounded" />
      </div>
      <div className="p-3 space-y-2">
        <div className="flex gap-2 items-center">
          <div className="w-8 h-8 bg-emerald-500/10 rounded flex items-center justify-center text-emerald-500">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="h-2 w-20 bg-muted/40 rounded" />
            <div className="h-2 w-32 bg-muted/20 rounded" />
          </div>
        </div>
        <div className="flex gap-2 items-center opacity-60">
          <div className="w-8 h-8 bg-blue-500/10 rounded flex items-center justify-center text-blue-500">
            <Share2 className="w-4 h-4" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="h-2 w-16 bg-muted/40 rounded" />
            <div className="h-2 w-24 bg-muted/20 rounded" />
          </div>
        </div>
      </div>
      <div className="absolute bottom-2 right-2 w-12 h-12 opacity-30">
        <LottieAnimation placeholderText="Search" className="w-full h-full" />
      </div>
    </div>
  )
}


export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="mb-16 md:mb-24">
          <SectionHeading
            title="Master Every Subject"
            description="A suite of powerful tools designed to adapt to your unique learning style."
          />
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 auto-rows-[minmax(300px,auto)]">

          {/* Row 1 */}
          {/* 1. Chat Mode (Top Left - Large) */}
          <BentoCard
            title="Interactive Chat Mode"
            description="Have a conversation with your notes. Ask questions, clarify doubts, and explore topics in depth with an AI that understands your context."
            className="md:col-span-2 md:row-span-1 min-h-[400px]"
            delay={0.1}
          >
            <ChatFeatureVisual />
          </BentoCard>

          {/* 2. Journal Mode (Top Right - Small) */}
          <BentoCard
            title="Reflective Journaling"
            description="Capture your thoughts and organize your learning journey with a dedicated journal mode."
            className="md:col-span-1 md:row-span-1 min-h-[400px]"
            delay={0.2}
          >
            <JournalFeatureVisual />
          </BentoCard>

          {/* Row 2 */}
          {/* 3. Socratic Tutor (Bottom Left) */}
          <BentoCard
            title="Socratic Tutor"
            description="Deepen your understanding through guided questioning and critical dialogue."
            className="md:col-span-1"
            delay={0.3}
          >
            <SocraticVisual />
          </BentoCard>

          {/* 4. Feynman Method (Bottom Middle) */}
          <BentoCard
            title="Feynman Method"
            description="Simplify complex concepts by teaching them in your own words."
            className="md:col-span-1"
            delay={0.4}
          >
            <FeynmanVisual />
          </BentoCard>

          {/* 5. Smart Search (Bottom Right) */}
          <BentoCard
            title="Smart Search"
            description="Instantly find relevant notes, journals, and concepts across your entire workspace."
            className="md:col-span-1"
            delay={0.5}
          >
            <SmartSearchVisual />
          </BentoCard>

        </div>
      </div>
    </section>
  )
}
