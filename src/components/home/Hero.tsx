import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Landmark, HeartHandshake, TrendingUp, ShieldCheck } from 'lucide-react';
import type { Locale } from '@/lib/i18n-config';
import type { Dictionary } from '@/types';

type HeroProps = {
  lang: Locale;
  dictionary: Dictionary['home']['hero'];
};

const stats = [
  { icon: Landmark, title: 'PPF', value: 'High ROI', key: 'ppf' },
  { icon: HeartHandshake, title: 'SSY', value: 'Tax Saved', key: 'ssy' },
  { icon: TrendingUp, title: 'NPS', value: 'Retirement Ready', key: 'nps' },
  { icon: ShieldCheck, title: 'Loan', value: 'EMI Optimizer', key: 'loan' },
];

export function Hero({ lang, dictionary }: HeroProps) {
  return (
    <section className="w-full py-12 md:py-20 lg:py-28 bg-card">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 md:gap-16 items-center">
          <div className="space-y-6">
            <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {dictionary.accent}
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl font-headline">
              {dictionary.title}
            </h1>
            <p className="max-w-xl text-muted-foreground md:text-xl">
              {dictionary.subtitle}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg">
                <Link href={`/${lang}/ppf-calculator`}>{dictionary.cta_primary}</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={`/${lang}/scheme-selector`}>{dictionary.cta_secondary}</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <Card className="overflow-hidden shadow-2xl rounded-lg">
              <Image
                src="/hero-screenshot.png"
                alt="BharatSaver application screenshot"
                width={1200}
                height={800}
                className="w-full h-auto"
                priority
                data-ai-hint="screenshot app"
              />
            </Card>
          </div>
        </div>
        <div className="mt-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat) => (
                    <div key={stat.key} className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                            <stat.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-lg font-semibold">{dictionary.stats[stat.key as keyof typeof dictionary.stats].title}</p>
                            <p className="text-sm text-muted-foreground">{dictionary.stats[stat.key as keyof typeof dictionary.stats].value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
}