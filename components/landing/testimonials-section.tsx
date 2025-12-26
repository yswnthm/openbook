"use client"

import AnimateInView from "./animate-in-view"
import SectionHeading from "./section-heading"
import { Card } from "@/components/ui/card"
import { Quote } from "lucide-react"

const TESTIMONIALS = [
  {
    quote: "OpenBook has completely transformed how I study for my medical exams. The AI explanations are spot-on.",
    author: "Sarah Chen",
    role: "Medical Student",
    initial: "S"
  },
  {
    quote: "The ability to chat with my notes is a game changer. I find connections I would have never missed otherwise.",
    author: "James Wilson",
    role: "Researcher",
    initial: "J"
  },
  {
    quote: "Finally, a notebook that actually helps me think. The graph view is beautiful and incredibly useful.",
    author: "Maria Garcia",
    role: "UX Designer",
    initial: "M"
  }
]

export function TestimonialsSection() {
  return (
    <section className="pt-6 pb-24">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeading
          title="Loved by Learners"
          description="Join a community of students and professionals who are upgrading their minds."
        />

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {TESTIMONIALS.map((testimonial, i) => (
            <AnimateInView key={i} delay={0.1 * (i + 1)}>
              <Card className="p-8 h-full bg-background border-border/50 hover:border-primary/20 transition-colors shadow-sm relative">
                <Quote className="h-8 w-8 text-primary/20 absolute top-6 right-6" />
                <div className="flex flex-col h-full justify-between space-y-6">
                  <p className="text-lg text-muted-foreground italic leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {testimonial.initial}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </AnimateInView>
          ))}
        </div>
      </div>
    </section>
  )
}
