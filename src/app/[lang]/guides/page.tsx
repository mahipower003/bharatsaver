import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, ShieldCheck, Layers, Landmark, Tag } from 'lucide-react';

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const pageDict = dictionary.guides_page;
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${lang}/guides`;
  return {
    title: `Expert Financial Guides 2026: LIC Status, Bonus Rates, Tax & SIP Comparisons | BharatSaver`,
    description: `Comprehensive 2026 step-by-step guides for LIC policy status check, premium receipt download, bonus rate calculation, paid-up value, and LIC vs SIP analysis.`,
    alternates: {
      canonical: pageUrl,
      languages: i18nConfig.locales.reduce((acc, locale) => {
        acc[locale] = `${siteUrl}/${locale}/guides`;
        return acc;
      }, {} as Record<string, string>),
    },
  };
}

export default async function GuidesPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const pageDict = dictionary.guides_page;

  const guideBuckets = [
    {
      categoryName: "LIC Policy Operations & Services",
      categoryIcon: ShieldCheck,
      guides: [
        {
          title: "LIC Policy Status Check Online (2026)",
          subtitle: "Learn how to check your LIC policy status instantly via online portal, SMS, WhatsApp, or phone. Prevent lapses and ensure life cover is active.",
          link: `/${lang}/lic-policy-status`,
          image: '/images/lic-status-check-online.png',
          alt: 'Person checking LIC policy status online',
          badge: "Policy Operations"
        },
        {
          title: "LIC Premium Receipt Download Guide",
          subtitle: "Scrambling to file taxes? Download your LIC premium receipt online instantly using the customer portal, Pay Direct without login, or WhatsApp.",
          link: `/${lang}/lic-premium-receipt-download`,
          image: '/images/about us.png',
          alt: 'Downloading LIC premium tax receipt',
          badge: "Tax Receipts"
        },
        {
          title: "LIC Term Insurance Premium Guide",
          subtitle: "Compare Tech-Term vs Jeevan Amar, see age-wise rates for ₹1 Crore cover, and learn which plan suits your family best.",
          link: `/${lang}/lic-term-insurance`,
          image: '/images/Bharat-saver-home-page-top.png',
          alt: 'LIC Term Insurance Guide',
          badge: "Term Protection"
        },
      ]
    },
    {
      categoryName: "Policy Valuation & Return Calculation",
      categoryIcon: Landmark,
      guides: [
        {
          title: "LIC Bonus Rates 2026: Full Guide with Calculation",
          subtitle: "Decode the latest SRB rates, step-up Sum Assured slabs, and terminal bonuses — and calculate your exact maturity payout with worked examples.",
          link: `/${lang}/lic-bonus-rates`,
          image: '/images/lic-bonus-rates-banner.png',
          alt: 'LIC Bonus Rates 2026 guide with calculation tables',
          badge: "Bonus Rates"
        },
        {
          title: "LIC Paid-Up Value: Stop Premiums Without Losing Capital",
          subtitle: "Struggling with high LIC premiums? Learn how Paid-Up status keeps your policy active, preserves your life cover, and protects your maturity payout.",
          link: `/${lang}/lic-paid-up-value`,
          image: '/images/lic-paid-up-value-banner.png',
          alt: 'LIC Paid-Up Value Calculator and Guide',
          badge: "Paid-Up Value"
        },
        {
          title: "How to Calculate LIC Payout & Maturity",
          subtitle: "Step-by-step breakdown of reversionary bonuses, final additional bonuses, and Section 10(10D) tax benefits for maturity calculations.",
          link: `/${lang}/calculate-lic-maturity-amount`,
          image: '/images/lic-maturity-calculator.png',
          alt: 'How to calculate LIC maturity payout',
          badge: "Maturity Guide"
        }
      ]
    },
    {
      categoryName: "LIC vs Wealth Creation Comparisons",
      categoryIcon: Layers,
      guides: [
        {
          title: "LIC vs SIP: The Ultimate 2026 Comparison",
          subtitle: "Are you leaving lakhs on the table? Discover why the 'Term Plan + SIP' strategy mathematically outperforms traditional LIC policies.",
          link: `/${lang}/lic-vs-sip`,
          image: '/images/lic-vs-sip-banner.png',
          alt: 'LIC vs SIP head-to-head comparison for Indian investors',
          badge: "LIC vs SIP"
        },
        {
          title: "LIC vs Mutual Fund: Which Builds More Wealth in 2026?",
          subtitle: "Real number comparison — see how a ₹10,000/month commitment in an LIC endowment vs a mutual fund SIP plays out over 20 years.",
          link: `/${lang}/lic-vs-mutual-fund`,
          image: '/images/lic-vs-mutual-fund-banner.png',
          alt: 'LIC vs Mutual Fund comparison for Indian investors',
          badge: "Investment Compare"
        },
      ]
    }
  ];

  return (
    <div className="py-12 bg-secondary/10 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline text-foreground">
            {pageDict.h1 || "Comprehensive Financial Guides 2026"}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {pageDict.description || "Actionable, research-backed guides organized into policy operations, return calculations, and investment comparisons."}
          </p>
        </div>

        <div className="space-y-16">
          {guideBuckets.map((bucket, bIdx) => {
            const IconComponent = bucket.categoryIcon;
            return (
              <div key={bIdx}>
                <div className="flex items-center gap-3 mb-6 pb-2 border-b">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">{bucket.categoryName}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {bucket.guides.map((guide, index) => (
                    <Link key={index} href={guide.link} className="group flex flex-col h-full">
                      <Card className="h-full flex flex-col transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1.5 overflow-hidden border-muted/80 hover:border-primary/40 bg-card">
                        {/* Aspect Ratio 16:9 Image Box */}
                        <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                          <Image
                            src={guide.image}
                            alt={guide.alt}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>

                        <CardContent className="p-6 flex flex-col flex-grow">
                          {/* Category Badge Row */}
                          <div className="mb-3">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-[11px] font-bold tracking-wide">
                              <Tag className="h-3 w-3" />
                              <span>{guide.badge}</span>
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-3 leading-snug">
                            {guide.title}
                          </h3>

                          {/* Subtitle */}
                          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">
                            {guide.subtitle}
                          </p>

                          {/* Footer CTA */}
                          <div className="flex items-center text-primary text-sm font-bold pt-3 border-t border-muted/60 mt-auto">
                            <span>Read Full Guide</span>
                            <ArrowRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}