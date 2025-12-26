"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionSeparatorProps {
  className?: string;
}

export function SectionSeparator({ className }: SectionSeparatorProps) {
  return (
    <div className={cn("relative flex items-center justify-center py-8", className)}>
      {/* Left Line with Gradient Fade */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="h-[1px] w-24 md:w-64 bg-gradient-to-r from-transparent via-primary/50 to-primary origin-right"
      />

      {/* Center Dot - Minimal */}
      <div className="relative mx-4 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-1.5 h-1.5 rounded-full bg-primary/80"
        />
      </div>

      {/* Right Line with Gradient Fade */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="h-[1px] w-24 md:w-64 bg-gradient-to-l from-transparent via-primary/50 to-primary origin-left"
      />
    </div>
  );
}
