"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface StyledTextProps {
  text: string
  highlightWords?: {
    word: string
    className: string
  }[]
  className?: string
}

export function StyledText({ text, highlightWords = [], className }: StyledTextProps) {
  if (!highlightWords.length) {
    return <span className={className}>{text}</span>
  }

  // Create a map of words to their styles for faster lookup
  const styleMap = new Map(highlightWords.map(item => [item.word, item.className]))
  
  // Split the text into words and spaces
  const parts = text.split(/(\s+)/)

  return (
    <span className={className}>
      {parts.map((part, index) => {
        const style = styleMap.get(part)
        
        if (style) {
          return <span key={index} className={cn(style)}>{part}</span>
        }
        
        return <span key={index}>{part}</span>
      })}
    </span>
  )
} 