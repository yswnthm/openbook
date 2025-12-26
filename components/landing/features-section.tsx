"use client";

import { Brain, Search, KeyRound, Lightbulb, Zap, Share2 } from "lucide-react";
import AnimateInView from "./animate-in-view";
import SectionHeading from "./section-heading";
import Image from "next/image";
import { BentoGrid, BentoGridItem } from "@/components/landing/bento-grid/bento-grid";
import animationData from "@/components/landing/lottie-animations/data.json";

export function FeaturesSection() {
  const items = [
    {
      title: "Lightning-Fast Interface",
      description: "Navigate your entire notebook using just your keyboard. Process and organize information in seconds.",
      icon: <KeyRound className="h-4 w-4 text-neutral-500" />,
      className: "md:col-span-2",
      lottieData: animationData
    },
    {
      title: "AI-Powered Learning",
      description: "Let our AI generate explanations, create practice questions, and provide personalized study materials.",
      icon: <Brain className="h-4 w-4 text-neutral-500" />,
      className: "md:col-span-1",
      lottieData: animationData
    },
    {
      title: "Smart Search",
      description: "Create personalized learning flows that match exactly how you study, memorize, and process information.",
      icon: <Search className="h-4 w-4 text-neutral-500" />,
      className: "md:col-span-1",
      lottieData: animationData
    },
    {
      title: "Instant Clarity",
      description: "Turn complex topics into simple summaries. Understanding is just one click away.",
      icon: <Lightbulb className="h-4 w-4 text-neutral-500" />,
      className: "md:col-span-2",
      lottieData: animationData
    },
    {
      title: "Active Recall",
      description: "Automated flashcards and quizzes testing your knowledge gaps exactly when you need it.",
      icon: <Zap className="h-4 w-4 text-neutral-500" />,
      className: "md:col-span-1",
      lottieData: animationData
    },
    {
      title: "Collaborative Spaces",
      description: "Share your notes and learn together. Knowledge grows when it's shared.",
      icon: <Share2 className="h-4 w-4 text-neutral-500" />,
      className: "md:col-span-2", // This would make 2+1+1+2+1+2 = 9 cols. Wait.
      // Grid is 3 cols.
      // Row 1: 2 + 1 = 3 cols. OK.
      // Row 2: 1 + 2 = 3 cols. OK.
      // Row 3: 1 + 2 = 3 cols. OK.
      lottieData: animationData
    },
  ];

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Main Graph Feature */}
        <div className="mb-32">
          <SectionHeading
            title="Speed Is Everything"
            description="Designed for students and lifelong learners who value their time"
          />
          
          <AnimateInView>
            <div className="relative mt-12 rounded-2xl overflow-hidden border border-border/40 shadow-2xl bg-background/50 backdrop-blur-sm group">
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent z-10 pointer-events-none" />
              <div className="dark:hidden">
                  <Image
                      src="/screenshots/white.png"
                      alt="OpenBook Graph Interface Light"
                      width={1200}
                      height={675}
                      className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.02]"
                  />
              </div>
              <div className="hidden dark:block">
                  <Image
                      src="/screenshots/graph.png"
                      alt="OpenBook Graph Interface Dark"
                      width={1200}
                      height={675}
                      className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.02]"
                  />
              </div>
            </div>
          </AnimateInView>
        </div>

        <BentoGrid className="max-w-4xl mx-auto">
          {items.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              icon={item.icon}
              className={item.className}
              lottieData={item.lottieData}
            />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
}
