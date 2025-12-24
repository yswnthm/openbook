'use client';

import { ArrowLeft } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function BackButton() {
  const pathname = usePathname();
  
  // Don't show on home page
  if (pathname === '/') {
    return null;
  }
  
  const goBack = () => {
    window.history.back();
  };
  
  return (
    <button
      onClick={goBack}
      className="fixed top-4 left-4 overlay-controls flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-md bg-background/60 hover:bg-background/80 backdrop-blur-sm transition-colors"
      aria-label="Go back to previous page"
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      Back
    </button>
  );
} 