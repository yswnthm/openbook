"use client"

import { motion } from "framer-motion"
import React from "react"

interface AnimatedHeadingProps {
  title: string
  highlightWords: {
    word: string
    className: string
  }[]
  className?: string
}

export function AnimatedHeading({ title, highlightWords, className = "" }: AnimatedHeadingProps) {
  // Create a more robust text parsing function that preserves all words and spaces
  const createTextElements = () => {
    // First, create a regex that will match any of our highlight words
    // We need to escape special regex characters in the words
    const escapeRegex = (str: string) => str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const wordsToHighlight = highlightWords.map(hw => escapeRegex(hw.word));
    
    // This regex will match any of our highlight words as whole words
    const regex = new RegExp(`(${wordsToHighlight.join('|')})`, 'g');
    
    // Split by our regex, which will preserve the matched words
    const parts = title.split(regex);
    
    return parts.map((part, index) => {
      // Find if this part matches any of our highlight words
      const highlightWord = highlightWords.find(hw => hw.word === part);
      
      if (highlightWord) {
        return (
          <motion.span
            key={index}
            className={highlightWord.className}
            whileHover={{ 
              scale: 1.05, 
              rotate: 2,
              transition: { type: "spring", stiffness: 300 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            {part}
          </motion.span>
        );
      }
      
      // Style regular text to be vertically aligned with the highlighted words
      return <span key={index} className="inline-block align-middle text-2xl md:text-3xl">{part}</span>;
    });
  };

  return (
    <motion.h2 
      className={`text-3xl md:text-4xl font-bold mb-4 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      {createTextElements()}
    </motion.h2>
  );
} 