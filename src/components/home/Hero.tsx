import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, TrendingUp, ShieldCheck, UserCheck, Banknote } from 'lucide-react';
import type { Locale } from '@/lib/i18n-config';
import type { Dictionary } from '@/lib/types';

const stats = [
  { icon: TrendingUp, key: 'high_roi' },
  { icon: ShieldCheck, key: 'tax_saved' },
  { icon: UserCheck, key: 'retirement_ready' },
  { icon: Banknote, key: 'loan_emi' },
];

type HeroProps = {
  lang: Locale;
  dictionary: Dictionary['home']['hero'];
}

export function Hero({ lang, dictionary }: HeroProps) {
  return (
    <section className="w-full bg-background py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
          <div className="space-y-6">
            <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
              {dictionary.title}
            </h1>
            <p className="max-w-xl text-muted-foreground text-base md:text-xl leading-relaxed">
              {dictionary.subtitle}
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row pt-2">
              <Button asChild size="lg" className="w-full sm:w-auto font-bold shadow-md bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href={`/${lang}/ppf-calculator`}>{dictionary.cta_primary}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto font-bold border-primary text-primary hover:bg-primary/10">
                <Link href={`/${lang}/calculators`}>
                  {dictionary.cta_secondary} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <Card className="overflow-hidden rounded-2xl border-2 shadow-xl bg-card">
              <Image
                src="/images/Bharat-saver-home-page-top.png"
                alt="Illustration of an Indian family planning their finances together, with icons representing savings and growth."
                width={960}
                height={640}
                className="h-auto w-full object-cover"
                priority
                fetchPriority="high"
                data-ai-hint="family finance"
              />
            </Card>
          </div>
        </div>

        {/* Feature & High Returns Cards with Generous Free Space */}
        <div className="mt-16 sm:mt-20">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.key} className="transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-muted/80 hover:border-primary/40 rounded-xl bg-card">
                <CardContent className="p-6 sm:p-7 flex flex-col justify-between h-full">
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-primary/10 p-3 shrink-0 text-primary mt-0.5">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="pt-0.5">
                      <h3 className="text-base font-bold text-foreground leading-snug">
                        {dictionary.stats[stat.key as keyof typeof dictionary.stats].title}
                      </h3>
                      <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                        {dictionary.stats[stat.key as keyof typeof dictionary.stats].description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
