"use client";

import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

// Initialize mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  securityLevel: "loose",
});

interface MermaidChartProps {
  chart: string;
}

export default function MermaidChart({ chart }: MermaidChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    const renderChart = async () => {
      try {
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);

        // Strip inline max-width from the SVG to ensure it scales
        const scaledSvg = svg.replace(/max-width:\s*\d+(\.\d+)?px;?/ig, '');

        if (isMounted) {
          setSvgContent(scaledSvg);
        }
      } catch (err) {
        console.error("Mermaid rendering error:", err);
      }
    };

    if (chart) {
      renderChart();
    }

    return () => {
      isMounted = false;
    };
  }, [chart]);

  return (
    <div className="mermaid-wrapper flex justify-center w-full overflow-x-auto my-8 bg-muted/20 p-6 rounded-xl border border-muted" ref={chartRef}>
      {svgContent ? (
        <div
          className="w-full flex justify-center [&>svg]:!w-full [&>svg]:!max-w-full [&>svg]:!h-auto min-h-[200px]"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      ) : (
        <div className="animate-pulse flex w-full max-w-2xl space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 rounded"></div>
              <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
