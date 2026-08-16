'use client';

import { useState } from 'react';
import Link from 'next/link';
import { calculators } from '@/data/calculators';
import type { Locale } from '@/lib/i18n-config';
import type { Dictionary } from '@/lib/types';
import { ArrowRight, Loader2, ShieldCheck, TrendingUp, Landmark, Layers, BadgePercent } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { CATEGORIES, CategoryId, getCalculatorsByCategory } from '@/lib/categories';

type PopularToolsProps = {
  lang: Locale;
  dictionary: Dictionary['home']['popular_tools'];
};

const categoryIcons = {
  'lic-insurance': ShieldCheck,
  'pension-retirement': TrendingUp,
  'tax-savings': Landmark,
  'mutual-funds': Layers,
  'loans-credit': BadgePercent,
};

export function PopularTools({ lang, dictionary }: PopularToolsProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [loadingCalculator, setLoadingCalculator] = useState<string | null>(null);

  const handleClick = (slug: string) => {
    setLoadingCalculator(slug);
  };

  return (
    <section className="w-full py-16 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline text-foreground">
            {dictionary?.title || 'Financial Calculators & Decision Tools'}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {dictionary?.subtitle || 'Explore our suite of 2026 financial calculators organized by goal and policy category.'}
          </p>
        </div>

        {/* Category Bucket Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              activeCategory === 'all'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
          >
            All Calculators ({calculators.length})
          </button>
          {CATEGORIES.map((cat) => {
            const Icon = categoryIcons[cat.id] || ShieldCheck;
            const count = cat.slugs.length;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{cat.shortName} ({count})</span>
              </button>
            );
          })}
        </div>

        {/* Display Category Buckets */}
        <div className="space-y-16">
          {CATEGORIES.filter((cat) => activeCategory === 'all' || activeCategory === cat.id).map((cat) => {
            const catCalculators = getCalculatorsByCategory(cat.id);
            const CategoryIcon = categoryIcons[cat.id] || ShieldCheck;

            if (catCalculators.length === 0) return null;

            return (
              <div key={cat.id} id={cat.id} className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-6 pb-2 border-b">
                  <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                    <CategoryIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">{cat.name}</h3>
                    <p className="text-sm text-muted-foreground">{cat.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {catCalculators.map((tool) => {
                    const ToolIcon = tool.icon;
                    const isLoading = loadingCalculator === tool.slug;
                    return (
                      <Link
                        key={tool.slug}
                        href={`/${lang}/${tool.slug}`}
                        className="group block h-full"
                        onClick={() => handleClick(tool.slug)}
                      >
                        <Card className="h-full flex flex-col transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1.5 border-muted/80 hover:border-primary/40 rounded-xl bg-card">
                          <CardContent className="p-6 sm:p-7 flex flex-col flex-grow">
                            <div className="flex items-start gap-4">
                              <div className="p-3 bg-primary/10 rounded-xl shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors mt-0.5">
                                <ToolIcon className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
                              </div>
                              <div className="pt-0.5">
                                <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                                  {tool.title}
                                </h4>
                                <span className="inline-block mt-1.5 text-[11px] font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-md">
                                  Updated Aug 2026
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-4 line-clamp-3 flex-grow leading-relaxed">
                              {tool.summary || tool.description}
                            </p>
                            <div className="flex items-center justify-between text-primary mt-6 text-xs font-bold pt-3 border-t border-muted/60">
                              <span>{tool.link_text || 'Calculate Now'}</span>
                              {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <ArrowRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
