'use client';

import React from 'react';
import { ListOrdered, ChevronRight } from 'lucide-react';

export interface TocItem {
  id: string;
  title: string;
}

type TableOfContentsProps = {
  items: TocItem[];
  title?: string;
};

export function TableOfContents({ items, title = 'Guide Quick Index' }: TableOfContentsProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="my-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-4 sm:p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-slate-200 dark:border-slate-800">
        <ListOrdered className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200">
          {title}
        </h3>
        <span className="ml-auto text-[11px] font-medium text-slate-500">
          {items.length} Sections
        </span>
      </div>

      {/* Grid of Compact Jump Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {items.map((item, idx) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:shadow-xs transition-all group"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold shrink-0">
              {idx + 1}
            </span>
            <span className="line-clamp-1 flex-1">{item.title}</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5 shrink-0" />
          </a>
        ))}
      </div>
    </div>
  );
}
