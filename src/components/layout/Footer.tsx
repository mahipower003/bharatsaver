import Link from 'next/link';
import type { Locale } from '@/lib/i18n-config';
import type { Dictionary } from '@/lib/types';
import { Twitter, Facebook, Linkedin, ShieldCheck, TrendingUp, Landmark, Layers } from 'lucide-react';
import { CATEGORIES } from '@/lib/categories';

type FooterProps = {
  lang: Locale;
  dictionary: Dictionary['footer'];
};

export function Footer({ lang, dictionary }: FooterProps) {
  return (
    <footer className="bg-secondary/50 border-t">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Column 1: LIC Insurance Tools */}
          <div>
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>LIC Policy Tools</span>
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${lang}/jeevan-utsav-calculator`} className="text-muted-foreground hover:text-primary transition-colors">
                  LIC Jeevan Utsav (Plan 771/883)
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/lic-jeevan-umang-calculator`} className="text-muted-foreground hover:text-primary transition-colors">
                  LIC Jeevan Umang (Plan 945)
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/lic-jeevan-labh-calculator`} className="text-muted-foreground hover:text-primary transition-colors">
                  LIC Jeevan Labh (Plan 936)
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/lic-maturity-calculator`} className="text-muted-foreground hover:text-primary transition-colors">
                  LIC Maturity Calculator
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/lic-surrender-value-calculator`} className="text-muted-foreground hover:text-primary transition-colors">
                  LIC Surrender Value Calculator
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/lic-term-insurance`} className="text-muted-foreground hover:text-primary transition-colors">
                  LIC Term Insurance Rates
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Pension & Savings */}
          <div>
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
              <Landmark className="h-4 w-4 text-primary" />
              <span>Tax & Pension Hubs</span>
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${lang}/ppf-calculator`} className="text-muted-foreground hover:text-primary transition-colors">
                  PPF Returns Calculator
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/ssy-calculator`} className="text-muted-foreground hover:text-primary transition-colors">
                  Sukanya Samriddhi (SSY)
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/nps-calculator`} className="text-muted-foreground hover:text-primary transition-colors">
                  NPS Pension Calculator
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/apy-calculator`} className="text-muted-foreground hover:text-primary transition-colors">
                  Atal Pension Yojana (APY)
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/tax-regime-calculator`} className="text-muted-foreground hover:text-primary transition-colors">
                  Old vs New Tax Regime
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/fd-vs-ppf-calculator`} className="text-muted-foreground hover:text-primary transition-colors">
                  FD vs PPF Returns Comparison
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Mutual Funds & Comparisons */}
          <div>
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
              <Layers className="h-4 w-4 text-primary" />
              <span>Investment & Comparisons</span>
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${lang}/lic-vs-sip-calculator`} className="text-muted-foreground hover:text-primary transition-colors">
                  LIC vs Equity SIP Calculator
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/mutual-fund-screener`} className="text-muted-foreground hover:text-primary transition-colors">
                  Direct Mutual Fund Screener
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/mutual-fund-overlap-calculator`} className="text-muted-foreground hover:text-primary transition-colors">
                  Mutual Fund Overlap Checker
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/lic-vs-ppf-calculator`} className="text-muted-foreground hover:text-primary transition-colors">
                  LIC vs PPF Returns Comparison
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/loan-optimizer`} className="text-muted-foreground hover:text-primary transition-colors">
                  Loan EMI & Prepayment Optimizer
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/calculators`} className="font-bold text-primary hover:underline">
                  All 25+ Calculators →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Platform & Social */}
          <div>
            <h3 className="font-bold text-foreground mb-4 text-sm uppercase tracking-wider">
              About & Legal
            </h3>
            <ul className="space-y-2 text-sm mb-6">
              <li>
                <Link href={`/${lang}/about`} className="text-muted-foreground hover:text-primary transition-colors">
                  About BharatSaver
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/guides`} className="text-muted-foreground hover:text-primary transition-colors">
                  Financial Guides
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/blog`} className="text-muted-foreground hover:text-primary transition-colors">
                  Blog & Insights
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/terms`} className="text-muted-foreground hover:text-primary transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <a href="/sitemap.xml" className="text-muted-foreground hover:text-primary transition-colors">
                  XML Sitemap
                </a>
              </li>
            </ul>
            <div className="flex gap-4 items-center">
              <Link href="https://x.com/mahesh_chaube33" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              </Link>
              <Link href="https://www.facebook.com/maheshchaube003" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              </Link>
              <Link href="https://www.linkedin.com/in/mahi003/" aria-label="Linkedin" target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground">
          <p>{dictionary.copyright || "© Copyright 2026 BharatSaver.com. All Rights Reserved."}</p>
          <p className="mt-4 md:mt-0 text-center md:text-right max-w-md">
            {dictionary.disclaimer || "BharatSaver is an independent financial education portal. We are not affiliated with LIC of India or any government agency."}
          </p>
        </div>
      </div>
    </footer>
  );
}
