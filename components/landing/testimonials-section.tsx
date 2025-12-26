"use client"

import { motion } from "framer-motion"
import SectionHeading from "./section-heading"
import { cn } from "@/lib/utils"


const TESTIMONIALS = [
  {
    name: "Aarav Patel",
    username: "@aaravpatel",
    avatar: "A",
    color: "bg-blue-500",
    text: "OpenBook has completely transformed how I study for my medical exams. The AI explanations are spot-on and save me hours of searching.",
    time: "2h",
    likes: 245,
    retweets: 12,
  },
  {
    name: "Priya Sharma",
    username: "@priyasharma",
    avatar: "P",
    color: "bg-green-500",
    text: "The graph view is unlike anything I've used before. Connecting ideas has never been this intuitive. Ideally, every student needs this tool.",
    time: "4h",
    likes: 89,
    retweets: 5,
  },
  {
    name: "Rohan Gupta",
    username: "@rohangupta",
    avatar: "R",
    color: "bg-purple-500",
    text: "Finally, a notebook that actually helps me think. It's not just storage; it's an active partner in my research process.",
    time: "6h",
    likes: 567,
    retweets: 89,
  },
  {
    name: "Ananya Iyer",
    username: "@ananyaiyer",
    avatar: "A",
    color: "bg-pink-500",
    text: "The aesthetic is just... chef's kiss. Clean, minimal, and functional. It makes me want to write more just to see it on the page.",
    time: "8h",
    likes: 1203,
    retweets: 245,
  },
  {
    name: "Vikram Singh",
    username: "@vikramsingh",
    avatar: "V",
    color: "bg-yellow-500",
    text: "I recommend OpenBook to all my students. The ability to chat with your notes changes the game for comprehension and retention.",
    time: "12h",
    likes: 45,
    retweets: 8,
  },
  {
    name: "Sneha Reddy",
    username: "@snehareddy",
    avatar: "S",
    color: "bg-indigo-500",
    text: "As a designer, I appreciate the attention to detail. The dark mode is perfect for late-night brainstorming sessions.",
    time: "1d",
    likes: 334,
    retweets: 45,
  },
  {
    name: "Arjun Nair",
    username: "@arjunnair",
    avatar: "A",
    color: "bg-red-500",
    text: "The way it handles context from multiple documents is impressive. It feels like having a second brain that actually works.",
    time: "1d",
    likes: 789,
    retweets: 123,
  },
  {
    name: "Meera Joshi",
    username: "@meerajoshi",
    avatar: "M",
    color: "bg-teal-500",
    text: "Writing my thesis with OpenBook has been a breeze. The distraction-free interface keeps me focused on what matters.",
    time: "2d",
    likes: 156,
    retweets: 23,
  },
  {
    name: "Karan Malhotra",
    username: "@karanmalhotra",
    avatar: "K",
    color: "bg-orange-500",
    text: "Simple, fast, and effective. The onboarding was smooth, and I was productive within minutes. Highly recommended.",
    time: "3d",
    likes: 67,
    retweets: 9,
  },
  {
    name: "Divya Desai",
    username: "@divyadesai",
    avatar: "D",
    color: "bg-cyan-500",
    text: "I used to drown in PDFs. Now I swim through them. The semantic search is a lifesaver for finding specific details.",
    time: "4d",
    likes: 445,
    retweets: 67,
  }
]

const TestimonialCard = ({ testimonial }: { testimonial: typeof TESTIMONIALS[0] }) => {
  return (
    <div className="flex w-[350px] flex-col gap-4 rounded-xl border border-border/40 bg-card/50 p-5 shadow-sm backdrop-blur-sm hover:bg-card/80 transition-colors mx-4 select-none whitespace-normal">
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <img
            src={`https://i.pravatar.cc/150?u=${testimonial.username}`}
            alt={testimonial.name}
            className="h-10 w-10 rounded-full bg-secondary/50 object-cover border border-border/50 opacity-50"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-sm text-foreground">{testimonial.name}</span>
              <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.603.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.294-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.604-.223-1.264-.27-1.896-.14-.635.13-1.218.436-1.687.882-.445.468-.75 1.053-.882 1.687-.13.633-.083 1.294.14 1.897-.588.274-1.087.705-1.44 1.246-.354.54-.55 1.17-.568 1.816.017.647.213 1.276.568 1.817.354.54.853.972 1.44 1.245-.224.604-.27 1.265-.14 1.898.13.634.437 1.218.882 1.687.47.445 1.053.75 1.687.882.634.13 1.293.083 1.897-.14.273.587.704 1.086 1.244 1.44s1.168.55 1.814.568c.647-.017 1.276-.213 1.817-.568.54-.354.97-.853 1.244-1.44.604.224 1.264.271 1.897.14.634-.132 1.218-.437 1.687-.882.445-.47.75-1.053.882-1.687.13-.634.083-1.294-.14-1.898.587-.273 1.087-.704 1.44-1.244.353-.54.55-1.17.568-1.817z" fill="#1D9BF0" />
                <path d="M10.135 16.215L6.467 12.55l1.414-1.414 2.254 2.254 5.679-5.679 1.414 1.414-7.093 7.09z" fill="white" />
              </svg>
            </div>
            <span className="text-xs text-muted-foreground">{testimonial.username} · {testimonial.time}</span>
          </div>
        </div>
        <div className="text-muted-foreground/30 hover:text-primary/60 transition-colors">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g></svg>
        </div>
      </div>

      <p className="text-[15px] leading-relaxed text-foreground/90 font-normal">
        {testimonial.text}
      </p>


    </div>
  )
}

const MarqueeRow = ({
  items,
  direction = "left",
  speed = 40
}: {
  items: typeof TESTIMONIALS,
  direction?: "left" | "right",
  speed?: number
}) => {
  return (
    <div className="relative flex w-full overflow-hidden py-2">
      <motion.div
        className="flex whitespace-nowrap"
        initial={{ x: direction === "left" ? "0%" : "-50%" }}
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"]
        }}
        transition={{
          duration: speed,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        <div className="flex">
          {items.map((item, idx) => (
            <TestimonialCard key={`orig-${idx}`} testimonial={item} />
          ))}
        </div>
        <div className="flex">
          {items.map((item, idx) => (
            <TestimonialCard key={`dup-${idx}`} testimonial={item} />
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export function TestimonialsSection() {
  const firstRow = TESTIMONIALS.slice(0, 5)
  const secondRow = TESTIMONIALS.slice(5)

  return (
    <section className="py-24 overflow-hidden relative z-10 border-t border-border/20">
      <div className="container mx-auto px-4 md:px-6 mb-16">
        <SectionHeading
          title="Words of appreciation from our community"
          description="Join thousands of students and researchers who trust OpenBook for their learning journey."
        />
      </div>

      <div className="flex flex-col gap-6 relative [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <MarqueeRow items={firstRow} direction="left" speed={70} />
        <MarqueeRow items={secondRow} direction="right" speed={80} />
      </div>
    </section>
  )
}
