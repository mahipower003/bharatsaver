import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import type { Dictionary } from '@/lib/types';
import type { Locale } from '@/lib/i18n-config';
import { ArrowRight, BookOpen, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';

type LatestGuidesProps = {
  lang: Locale;
  dictionary: Dictionary['home']['latest_guides'];
};

export function LatestGuides({ lang, dictionary }: LatestGuidesProps) {
  const guides = [
    {
      title: "LIC Jeevan Utsav Plan 771 & 883: Complete 2026 Returns & Benefit Guide",
      subtitle: "Detailed actuarial breakdown of Guaranteed Additions (₹40/₹1k), Option 1 Regular 10% income vs Option 2 Flexi compounding, and year-by-year benefit tables.",
      link: `/${lang}/jeevan-utsav-calculator`,
      image: '/images/lic-jeevan-utsav-calculator.png',
      alt: 'LIC Jeevan Utsav Plan 771 and Plan 883 Returns and Schedule Guide',
      category: "LIC Policy Analysis",
      readTime: "6 min read"
    },
    {
      title: "LIC Policy Status Check Online 2026 (Portal, WhatsApp, SMS)",
      subtitle: "Learn how to check your policy status, premium due date, and lapse status instantly without visiting an LIC branch.",
      link: `/${lang}/lic-policy-status`,
      image: '/images/lic-status-check-online.png',
      alt: 'Checking LIC policy status online on mobile phone',
      category: "Policy Operations",
      readTime: "4 min read"
    },
    {
      title: "LIC vs SIP: The Ultimate 2026 Wealth Comparison",
      subtitle: "Is traditional LIC endowment underperforming equity SIPs? Compare real 20-year numbers, insurance cover, and Section 10(10D) tax benefits.",
      link: `/${lang}/lic-vs-sip`,
      image: '/images/lic-vs-sip-banner.png',
      alt: 'LIC vs SIP head to head financial return comparison',
      category: "Investment Strategy",
      readTime: "8 min read"
    },
    {
      title: "LIC Bonus Rates 2026: SRB & FAB Calculation Explained",
      subtitle: "Decode Simple Reversionary Bonus rates, step-up Sum Assured slabs, and Final Additional Bonus rules with worked maturity examples.",
      link: `/${lang}/lic-bonus-rates`,
      image: '/images/lic-bonus-rates-banner.png',
      alt: 'LIC bonus rates calculation and payout tables',
      category: "Policy Valuation",
      readTime: "5 min read"
    },
    {
      title: "LIC Paid-Up Value Calculator & Guide: Stop Premiums Safely",
      subtitle: "Struggling with premium payments? Calculate your reduced Paid-Up Sum Assured, preserve life cover, and avoid policy forfeitures.",
      link: `/${lang}/lic-paid-up-value`,
      image: '/images/lic-paid-up-value-banner.png',
      alt: 'LIC Paid-Up value calculation guide',
      category: "Policy Optimization",
      readTime: "5 min read"
    },
    {
      title: "LIC Premium Receipt Download Guide for Tax Filing 2026",
      subtitle: "Step-by-step instructions to instantly download official LIC premium receipts for Section 80C tax deductions via portal or Pay Direct.",
      link: `/${lang}/lic-premium-receipt-download`,
      image: '/images/about us.png',
      alt: 'LIC premium receipt download for tax filing',
      category: "Tax Receipts",
      readTime: "3 min read"
    },
  ];

  return (
    <section className="w-full py-20 bg-secondary/30 border-t">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-2">
              <BookOpen className="h-4 w-4" />
              <span>Knowledge Center</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline text-foreground">
              {dictionary?.title || "Latest Financial Guides & Policy Insights"}
            </h2>
            <p className="mt-2 text-muted-foreground text-base max-w-2xl">
              Research-backed guides, worked actuarial examples, and step-by-step tutorials to help you optimize your insurance and investment portfolio.
            </p>
          </div>
          <Button asChild variant="outline" className="hidden md:flex gap-2 mt-4 md:mt-0 font-bold border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Link href={`/${lang}/guides`}>
              <span>Explore All Guides</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.map((guide, index) => (
            <Link key={index} href={guide.link} className="group flex flex-col h-full">
              <Card className="h-full flex flex-col transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1.5 overflow-hidden border-muted/80 hover:border-primary/40 bg-card">
                {/* Image Container with Aspect Ratio and Proper Scaling */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <Image
                    src={guide.image}
                    alt={guide.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Card Content with Generous Padding & Spacing */}
                <CardContent className="p-6 flex flex-col flex-grow">
                  {/* Category Pill & Read Time Meta Row */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-[11px] font-bold tracking-wide">
                      <Tag className="h-3 w-3" />
                      <span>{guide.category}</span>
                    </span>
                    <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{guide.readTime}</span>
                    </div>
                  </div>

                  {/* Title with Generous Free Space Above & Below */}
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-snug mb-3">
                    {guide.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-6 flex-grow">
                    {guide.subtitle}
                  </p>

                  {/* Footer Link Button */}
                  <div className="flex items-center justify-between text-primary text-xs font-bold pt-3 border-t border-muted/60 mt-auto">
                    <span>{dictionary?.read_guide || "Read Full Article"}</span>
                    <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center md:hidden">
          <Button asChild className="w-full bg-primary text-primary-foreground font-bold">
            <Link href={`/${lang}/guides`}>
              <span>Explore All Guides & Articles</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
