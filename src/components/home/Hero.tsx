import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Calculator, Banknote, ShieldCheck, PieChart } from 'lucide-react';
import type { Locale } from '@/lib/i18n-config';
import type { Dictionary } from '@/types';

type HeroProps = {
  lang: Locale;
  dictionary: Dictionary['home']['hero'];
};

const stats = [
  { icon: PieChart, title: 'High ROI', description: 'Estimatur/hega aruhter\'s education cotpus.', key: 'high_roi' },
  { icon: Banknote, title: 'Tax Saved', description: 'Compare old tax regim tax regrt tmstantly', key: 'tax_saved' },
  { icon: Calculator, title: 'Retirement Ready', description: 'Check your pension risk easion.', key: 'retirement_ready' },
  { icon: ShieldCheck, title: 'Loan - EMI Optimizer', description: 'Apply pertihmamit tax reame', key: 'loan_emi' },
];

export function Hero({ lang, dictionary }: HeroProps) {
  return (
    <section className="w-full py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 md:gap-16 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl font-headline">
              {dictionary.title}
            </h1>
            <p className="max-w-xl text-muted-foreground md:text-xl">
              {dictionary.subtitle}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row items-center">
              <Button asChild size="lg">
                <Link href={`/${lang}/ppf-calculator`}>{dictionary.cta_primary}</Link>
              </Button>
              <Button asChild size="lg" variant="link" className="text-base">
                <Link href={`/${lang}/calculators`}>
                  {dictionary.cta_secondary} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <Card className="overflow-hidden shadow-lg rounded-lg border-2">
              <Image
                src="https://picsum.photos/960/640"
                alt="Illustration of a family planning their finances with charts and graphs"
                width={960}
                height={640}
                className="w-full h-auto"
                priority
                data-ai-hint="family finance"
              />
            </Card>
          </div>
        </div>
        <div className="mt-24">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat) => (
                    <div key={stat.key} className="flex items-start gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                            <stat.icon className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <p className="text-lg font-semibold">{dictionary.stats[stat.key as keyof typeof dictionary.stats].title}</p>
                            <p className="text-sm text-muted-foreground mt-1">{dictionary.stats[stat.key as keyof typeof dictionary.stats].description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
}
