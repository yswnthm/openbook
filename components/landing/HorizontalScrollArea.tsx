'use client';

import { useRef, useEffect } from 'react';

interface HorizontalScrollAreaProps {
  children: React.ReactNode;
  className?: string;
}

export function HorizontalScrollArea({ children, className }: HorizontalScrollAreaProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // This function will be used to prevent the default scroll behavior on the document
  // when our horizontal scroll is active
  const preventScroll = (e: WheelEvent) => {
    if (isScrollingRef.current) {
      e.preventDefault();
    }
  };

  // Use effect to add and remove the wheel event listener at the document level
  useEffect(() => {
    // Using passive: false is essential to be able to prevent the default scroll
    document.addEventListener('wheel', preventScroll, { passive: false });
    
    return () => {
      document.removeEventListener('wheel', preventScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const onWheel = (e: WheelEvent) => {
    if (scrollContainerRef.current) {
      // Calculate if horizontal scrolling is possible
      const { scrollWidth, clientWidth, scrollLeft } = scrollContainerRef.current;
      const canScrollHorizontally = scrollWidth > clientWidth;
      
      // Only intercept the wheel event if horizontal scrolling is possible
      if (!canScrollHorizontally) {
        return; // Let the default scroll behavior take over
      }

      // If deltaX is significant, the user is intentionally scrolling horizontally
      // In that case, let the browser handle it naturally
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) * 0.5) {
        return;
      }

      // Use deltaY for smoother scrolling
      let scrollAmount = e.deltaY;
      
      // Scale the scroll amount for smoother experience
      const scrollMultiplier = 1.5;
      scrollAmount *= scrollMultiplier;

      // Check scroll boundaries
      const isScrollingDown = scrollAmount > 0;
      const isScrollingUp = scrollAmount < 0;
      const atHorizontalEnd = scrollLeft >= scrollWidth - clientWidth - 2;
      const atHorizontalStart = scrollLeft <= 2;

      // Only hijack scroll if we're not at boundaries or if we're within boundaries
      if (!((isScrollingDown && atHorizontalEnd) || (isScrollingUp && atHorizontalStart))) {
        // Prevent both vertical and horizontal default scrolling
        e.preventDefault();
        e.stopPropagation();
        
        // Set the scrolling flag to true
        isScrollingRef.current = true;
        
        // Set smooth scrolling behavior
        scrollContainerRef.current.style.scrollBehavior = 'smooth';
        
        // Update horizontal scroll position
        scrollContainerRef.current.scrollLeft += scrollAmount;
        
        // Clear any existing timeout
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        
        // Reset flag after scrolling stops to allow vertical scrolling again
        scrollTimeoutRef.current = setTimeout(() => {
          isScrollingRef.current = false;
          if (scrollContainerRef.current) {
            scrollContainerRef.current.style.scrollBehavior = 'auto';
          }
        }, 200); // Increased timeout for better user experience
      }
    }
  };

  return (
    <div 
      ref={scrollContainerRef} 
      className={`smooth-horizontal-scroll ${className || ''}`}
      // @ts-ignore: React's onWheel type doesn't perfectly match native WheelEvent
      onWheel={onWheel} 
    >
      {children}
    </div>
  );
} 