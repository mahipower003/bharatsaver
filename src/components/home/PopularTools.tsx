
import Link from 'next/link';
import { calculators } from '@/data/calculators';
import type { Locale } from '@/lib/i18n-config';
import type { Dictionary } from '@/types';
import { ArrowRight } from 'lucide-react';

type PopularToolsProps = {
  lang: Locale;
  dictionary: Dictionary['home']['popular_tools'];
};

export function PopularTools({ lang, dictionary }: PopularToolsProps) {
  const popularCalculators = calculators.slice(0, 8);
  
  return (
    <section className="w-full py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            {dictionary.title}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
          {popularCalculators.map((tool) => (
            <Link key={tool.slug} href={`/${lang}/${tool.slug}`} className="group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                    <tool.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold">{tool.title}</h3>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{tool.description}</p>
              <div className="flex items-center text-primary mt-4 text-sm font-medium">
                <span>{tool.link_text}</span>
                <ArrowRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
