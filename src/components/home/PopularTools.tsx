import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { calculators } from '@/data/calculators';
import type { Locale } from '@/lib/i18n-config';
import { cn } from '@/lib/utils';
import type { Dictionary } from '@/types';

type PopularToolsProps = {
  lang: Locale;
  dictionary: Dictionary['home']['popular_tools'];
};

export function PopularTools({ lang, dictionary }: PopularToolsProps) {
  return (
    <section className="w-full py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            {dictionary.title}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-10">
          {calculators.map((tool) => (
            <Link key={tool.slug} href={`/${lang}/${tool.slug}`}>
              <Card className="h-full hover:shadow-lg hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className={cn("p-3 rounded-full bg-muted", tool.slug === 'scheme-selector' ? "bg-accent/20" : "bg-primary/10")}>
                    <tool.icon className={cn("h-6 w-6", tool.slug === 'scheme-selector' ? "text-accent" : "text-primary")} />
                  </div>
                  <div>
                    <CardTitle>{tool.title}</CardTitle>
                    <CardDescription className="mt-1">{tool.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
