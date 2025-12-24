"use client"

import { StyledText } from "./styled-text"

export function HeroHeading() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
        <StyledText 
          text="The best place to learn and play for kids"
          highlightWords={[
            {
              word: "learn",
              className: "text-purple-600 font-script italic relative",
            },
            {
              word: "play",
              className: "text-amber-400 font-handwriting relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-full after:h-2 after:bg-amber-400/30 after:rounded-full",
            }
          ]}
        />
      </h1>
      <p className="mt-6 text-lg text-muted-foreground max-w-3xl">
        Discover thousands of fun and interactive learning activities
        to support your child's growth and learning process.
      </p>
    </div>
  )
} 