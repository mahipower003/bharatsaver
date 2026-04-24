'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Sparkles } from 'lucide-react';
import { calculators } from '@/data/calculators';
import type { Locale } from '@/lib/i18n-config';

/* -----------------------------------------------------------------------
 * Fisher-Yates shuffle with a simple LCG seed.
 * The seed is computed client-side only (inside useEffect) so SSR and
 * the initial client render both output an empty placeholder — no mismatch.
 * ----------------------------------------------------------------------- */
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

// Tailwind gradient pairs cycled across cards
const GRADIENTS = [
  'from-blue-500/10 to-indigo-500/10 border-blue-200 dark:border-blue-800',
  'from-emerald-500/10 to-teal-500/10 border-emerald-200 dark:border-emerald-800',
  'from-orange-500/10 to-amber-500/10 border-orange-200 dark:border-orange-800',
  'from-purple-500/10 to-pink-500/10 border-purple-200 dark:border-pink-800',
  'from-rose-500/10 to-red-500/10 border-rose-200 dark:border-rose-800',
  'from-cyan-500/10 to-sky-500/10 border-cyan-200 dark:border-sky-800',
];

interface RelatedCalculatorsWidgetProps {
  lang: Locale;
  title?: string;
  count?: number;
}

export function RelatedCalculatorsWidget({
  lang,
  title = 'Explore More Financial Calculators',
  count = 3,
}: RelatedCalculatorsWidgetProps) {
  const pathname = usePathname();

  // null = not yet mounted (renders nothing on SSR + initial hydration)
  const [picks, setPicks] = useState<typeof calculators | null>(null);

  useEffect(() => {
    // Runs only on the client — safe to use Date.now() here
    const seed = Math.floor(Date.now() / 3_600_000); // rotates every hour
    const currentSlug = pathname.split('/').pop() ?? '';
    const pool = calculators.filter((c) => c.slug !== currentSlug);
    setPicks(seededShuffle(pool, seed).slice(0, count));
  }, [pathname, count]);

  // SSR + first hydration paint: render the shell without cards
  // so server and client HTML are identical (no hydration mismatch).
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
        {/* Skeleton grid — same DOM shape as real cards */}
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
      {/* Heading */}
      <div className="mb-6 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary shrink-0" aria-hidden="true" />
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      </div>

      {/* Card grid */}
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
              {/* Icon bubble */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>

              {/* Title + description */}
              <div className="flex-1">
                <p className="font-semibold text-foreground leading-snug group-hover:text-primary transition-colors">
                  {calc.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                  {calc.description}
                </p>
              </div>

              {/* CTA */}
              <span className="flex items-center gap-1 text-xs font-medium text-primary">
                {calc.link_text}
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
