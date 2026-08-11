
'use client';

import { useState, useEffect } from 'react';
import { ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ScrollToBottomButton() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const toggleVisibility = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      // Show button if user is not near the bottom
      if (scrollHeight - window.scrollY - clientHeight > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    toggleVisibility(); // Initial check

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        'fixed bottom-16 right-4 z-40 h-10 w-10 sm:h-12 sm:w-12 rounded-full border border-emerald-500/20 bg-background/90 backdrop-blur-sm shadow-lg transition-opacity duration-300 sm:bottom-20 sm:right-6',
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
      onClick={scrollToBottom}
      aria-label="Scroll to bottom"
    >
      <ArrowDown className="h-6 w-6" />
    </Button>
  );
}
