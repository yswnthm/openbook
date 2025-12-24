import React from "react";

interface SectionSeparatorProps {
  /**
   * The icon or text to display in the center of the separator
   */
  icon?: React.ReactNode;
  
  /**
   * Optional additional className for custom styling
   */
  className?: string;
}

export function SectionSeparator({ 
  icon = "+", 
  className = "" 
}: SectionSeparatorProps) {
  return (
    <div className={`flex items-center justify-center text-gray-400 my-8 ${className}`}>
      <span className="flex-none w-16 border-t border-gray-300" />
      <span className="mx-4">{icon}</span>
      <span className="flex-none w-16 border-t border-gray-300" />
    </div>
  );
} 