'use client';

import { useState, useEffect } from "react";
import { Share2, Printer, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function CalculatorActions() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = (platform: 'whatsapp' | 'twitter') => {
    const url = window.location.href;
    const text = document.title || "Check out this useful financial calculator!";
    
    let shareUrl = '';
    if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    } else if (platform === 'whatsapp') {
      shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`;
    }

    if (shareUrl) window.open(shareUrl, '_blank');
  };

  if (!mounted) {
    return <div className="flex items-center justify-center gap-4 mt-6 h-9" />;
  }

  return (
    <div className="flex items-center justify-center gap-4 mt-6">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={() => handleShare('whatsapp')} className="gap-2 text-green-600 hover:text-green-700 hover:bg-green-50">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52s-.669-1.611-.916-2.207c-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
              Share
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share via WhatsApp</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={() => handleShare('twitter')} className="gap-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50">
              <Twitter className="h-4 w-4" />
              Tweet
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share on Twitter</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
              <Printer className="h-4 w-4" />
              Print
            </Button>
          </TooltipTrigger>
          <TooltipContent>Print or Save as PDF</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
