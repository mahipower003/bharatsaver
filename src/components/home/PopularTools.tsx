'use client';

import { useState } from 'react';
import Link from 'next/link';
import { calculators } from '@/data/calculators';
import type { Locale } from '@/lib/i18n-config';
import type { Dictionary } from '@/types';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

type PopularToolsProps = {
  lang: Locale;
  dictionary: Dictionary['home']['popular_tools'];
};

export function PopularTools({ lang, dictionary }: PopularToolsProps) {
  const popularCalculators = calculators;
  const [loadingCalculator, setLoadingCalculator] = useState<string | null>(null);

  const handleClick = (slug: string) => {
    setLoadingCalculator(slug);
  };
  
  return (
    <section className="w-full py-20 bg-background">
      <div className="px-4 md:px-6">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            {dictionary.title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{dictionary.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {popularCalculators.map((tool) => {
            const Icon = tool.icon;
            const isLoading = loadingCalculator === tool.slug;
            return (
              <Link 
                key={tool.slug} 
                href={`/${lang}/${tool.slug}`} 
                className="group block h-full"
                onClick={() => handleClick(tool.slug)}
              >
                <Card className="h-full flex flex-col transition-all duration-200 group-hover:shadow-xl group-hover:-translate-y-1">
                  <CardContent className="p-6 flex flex-col flex-grow">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                          <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold pt-2">{tool.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4 flex-grow">{tool.description}</p>
                    <div className="flex items-center justify-between text-primary mt-6 text-sm font-medium">
                      <span>{tool.link_text}</span>
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
    </section>
  );
}
