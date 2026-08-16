'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Sparkles } from 'lucide-react';
import { calculators } from '@/data/calculators';
import type { Locale } from '@/lib/i18n-config';
import { getCategoryBySlug, getCalculatorsByCategory } from '@/lib/categories';

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const GRADIENTS = [
  'from-emerald-500/10 to-teal-500/10 border-emerald-200 dark:border-emerald-800',
  'from-blue-500/10 to-indigo-500/10 border-blue-200 dark:border-blue-800',
  'from-purple-500/10 to-pink-500/10 border-purple-200 dark:border-pink-800',
  'from-orange-500/10 to-amber-500/10 border-orange-200 dark:border-orange-800',
];

interface RelatedCalculatorsWidgetProps {
  lang: Locale;
  title?: string;
  count?: number;
}

export function RelatedCalculatorsWidget({
  lang,
  title = 'Related Tools in This Category',
  count = 3,
}: RelatedCalculatorsWidgetProps) {
  const pathname = usePathname();
  const [picks, setPicks] = useState<typeof calculators | null>(null);

  useEffect(() => {
    const currentSlug = pathname.split('/').pop() ?? '';
    const currentCategory = getCategoryBySlug(currentSlug);

    let sameCategoryPool = currentCategory
      ? getCalculatorsByCategory(currentCategory.id).filter((c) => c.slug !== currentSlug)
      : [];

    let fallbackPool = calculators.filter(
      (c) => c.slug !== currentSlug && !sameCategoryPool.some((sc) => sc.slug === c.slug)
    );

    const seed = Math.floor(Date.now() / 3_600_000);
    const combined = [...sameCategoryPool, ...seededShuffle(fallbackPool, seed)];
    setPicks(combined.slice(0, count));
  }, [pathname, count]);

  if (!picks) {
    return (
      <section
        aria-label="Related calculators"
        className="mt-12 rounded-2xl border bg-gradient-to-br from-muted/40 to-muted/10 p-6 shadow-sm"
      >
        <div className="mb-6 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary shrink-0" aria-hidden="true" />
          <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className="h-36 animate-pulse rounded-xl border bg-muted/40"
            />
          ))}
        </div>
      </section>
    );
  }

  if (picks.length === 0) return null;

  return (
    <section
      aria-label="Related calculators"
      className="mt-12 rounded-2xl border bg-gradient-to-br from-muted/40 to-muted/10 p-6 shadow-sm"
    >
      <div className="mb-6 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary shrink-0" aria-hidden="true" />
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {picks.map((calc, i) => {
          const Icon = calc.icon;
          const gradient = GRADIENTS[i % GRADIENTS.length];

          return (
            <Link
              key={calc.slug}
              href={`/${lang}/${calc.slug}`}
              className={`group relative flex flex-col gap-3 rounded-xl border bg-gradient-to-br p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${gradient}`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>

              <div className="flex-1">
                <p className="font-semibold text-foreground leading-snug group-hover:text-primary transition-colors">
                  {calc.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                  {calc.description}
                </p>
              </div>

              <span className="flex items-center gap-1 text-xs font-bold text-primary mt-2">
                {calc.link_text || 'Calculate Now'}
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
