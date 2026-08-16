import { ApyCalculator } from "@/components/calculators/ApyCalculator";
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, BarChart2, UserCheck, Landmark, GitCompareArrows, AlertTriangle, Star, Calculator, Receipt, HeartHandshake, CheckCircle2 } from "lucide-react";
import { ApyPremiumChart } from "@/components/calculators/ApyPremiumChart";
import { CalculatorPageLayout } from "@/components/layout/CalculatorPageLayout";
import { buildTwitterCard } from '@/lib/seo';

export async function generateStaticParams() {
  return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const pageDict = (await import(`@/dictionaries/${lang}/apy-calculator.json`)).default;
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${lang}/apy-calculator`;
  const ogImageUrl = `${siteUrl}/images/APY-Calculator-online.png`;

  return {
    title: pageDict.meta_title || "2026 APY Calculator – Atal Pension Yojana (APY) Contribution Calculator | BharatSaver",
    description: pageDict.meta_description || "Free APY (Atal Pension Yojana) Calculator 2026. Calculate monthly premium, total contribution & indicative corpus for ₹1,000–₹5,000 guaranteed pensions. Includes age-wise PFRDA charts & rules.",
    openGraph: {
      title: pageDict.og_title || "2026 APY Calculator – Atal Pension Yojana Premium & Pension Chart | BharatSaver",
      description: pageDict.og_description || "Calculate your exact monthly contribution for Atal Pension Yojana (APY) with our free 2026 calculator. Check PFRDA premium charts, 80CCD tax benefits, nominee corpus return & rules.",
      url: pageUrl,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: 'BharatSaver APY Calculator 2026' }],
      locale: lang === 'en' ? 'en_IN' : lang,
      type: 'website',
    },
    twitter: buildTwitterCard(
      pageDict.meta_title || "2026 APY Calculator – Atal Pension Yojana (APY) Contribution Calculator | BharatSaver",
      pageDict.meta_description || "Free APY (Atal Pension Yojana) Calculator 2026. Calculate monthly premium, total contribution & indicative corpus for ₹1,000–₹5,000 guaranteed pensions.",
      ogImageUrl
    ),
    alternates: {
      canonical: pageUrl,
      languages: i18nConfig.locales.reduce((acc, locale) => {
        acc[locale] = `${siteUrl}/${locale}/apy-calculator`;
        return acc;
      }, {} as Record<string, string>),
    },
  };
}

export default async function ApyCalculatorPage({ params }: { params: Promise<{ lang: Locale }>}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const pageDict = { ...(await import(`@/dictionaries/${lang}/apy-calculator.json`)).default };
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Atal Pension Yojana (APY) Contribution Calculator',
    operatingSystem: 'All',
    applicationCategory: 'FinanceApplication',
    url: `${siteUrl}/${lang}/apy-calculator`,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    description: 'Free online APY calculator to compute monthly premiums, out-of-pocket investment, and nominee corpus returns for Atal Pension Yojana guaranteed pension tiers.',
    author: {
      '@type': 'Organization',
      name: 'BharatSaver',
      url: siteUrl,
    },
  };

  return (
    <CalculatorPageLayout
      lang={lang}
      dictionary={dictionary}
      pageDict={pageDict}
      h1={pageDict.h1 || "Atal Pension Yojana (APY) Contribution & Pension Calculator (2026)"}
      description={pageDict.description}
      lastUpdated="August 2026"
      calculator={<ApyCalculator dictionary={pageDict} />}
      faqs={pageDict.faqs}
      faqTitle={pageDict.faq_title || "Frequently Asked Questions (FAQs)"}
      pageUrl={`${siteUrl}/${lang}/apy-calculator`}
    >
      {/* Inject WebApplication JSON-LD Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />

      <div className="mt-8 sm:mt-12 space-y-8 sm:space-y-12">
        {/* Section 1: What is APY */}
        <Card className="shadow-md border border-muted hover:border-primary/20 transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl font-bold">
              <Shield className="h-6 w-6 sm:h-7 sm:w-7 text-primary shrink-0"/>
              <h2>{pageDict.what_is_apy?.title || "What is Atal Pension Yojana (APY)?"}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: (pageDict.what_is_apy?.body || "").replace(/{lang}/g, lang) }}></div>
            {pageDict.what_is_apy?.points && (
              <ul className="mt-4 space-y-3">
                {pageDict.what_is_apy.points.map((point: string, index: number) => (
                  <li key={index} className="flex items-start gap-3 bg-muted/30 p-3 rounded-lg border border-muted/50">
                    <UserCheck className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-sm sm:text-base text-foreground" dangerouslySetInnerHTML={{__html: point.replace(/{lang}/g, lang)}}></span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Section 2: Mathematical Breakdown (Exploiting competitor formula errors) */}
        {pageDict.how_math_works && (
          <Card className="shadow-md border border-primary/20 bg-gradient-to-br from-card via-card to-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl font-bold">
                <Calculator className="h-6 w-6 sm:h-7 sm:w-7 text-primary shrink-0"/>
                <h2>{pageDict.how_math_works.title}</h2>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: pageDict.how_math_works.intro.replace(/{lang}/g, lang) }}></p>
              <div className="text-sm sm:text-base text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: pageDict.how_math_works.body.replace(/{lang}/g, lang) }}></div>
              
              {pageDict.how_math_works.example_title && (
                <div className="mt-4 bg-muted/60 p-4 sm:p-5 rounded-xl border border-muted">
                  <h3 className="font-bold text-base sm:text-lg text-foreground flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    {pageDict.how_math_works.example_title}
                  </h3>
                  <div className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: pageDict.how_math_works.example_body.replace(/{lang}/g, lang) }}></div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Section 3: Official PFRDA Premium Chart */}
        <Card className="shadow-md border border-muted">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl font-bold">
              <BarChart2 className="h-6 w-6 sm:h-7 sm:w-7 text-primary shrink-0"/>
              <h2>{pageDict.premium_chart?.title || "Official PFRDA APY Premium & Contribution Chart (2026)"}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm sm:text-base text-muted-foreground">{pageDict.premium_chart?.description}</p>
            <ApyPremiumChart dictionary={pageDict.premium_chart} />
          </CardContent>
        </Card>

        {/* Section 4: Eligibility Criteria & Key Rules */}
        {pageDict.eligibility_and_rules && (
          <Card className="shadow-md border border-muted">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl font-bold">
                <AlertTriangle className="h-6 w-6 sm:h-7 sm:w-7 text-amber-500 shrink-0"/>
                <h2>{pageDict.eligibility_and_rules.title}</h2>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm sm:text-base text-muted-foreground">{pageDict.eligibility_and_rules.intro}</p>
              <ul className="space-y-3">
                {pageDict.eligibility_and_rules.rules_list.map((rule: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-foreground bg-muted/20 p-3 rounded-lg border">
                    <span className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0"></span>
                    <span dangerouslySetInnerHTML={{ __html: rule.replace(/{lang}/g, lang) }}></span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Section 5: Tax Benefits */}
        {pageDict.tax_benefits && (
          <Card className="shadow-md border border-muted">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl font-bold">
                <Receipt className="h-6 w-6 sm:h-7 sm:w-7 text-primary shrink-0"/>
                <h2>{pageDict.tax_benefits.title}</h2>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm sm:text-base text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: pageDict.tax_benefits.body.replace(/{lang}/g, lang) }}></div>
            </CardContent>
          </Card>
        )}

        {/* Section 6: Penalty Rules */}
        {pageDict.penalty_rules && (
          <Card className="shadow-md border border-muted">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl font-bold">
                <AlertTriangle className="h-6 w-6 sm:h-7 sm:w-7 text-primary shrink-0"/>
                <h2>{pageDict.penalty_rules.title}</h2>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm sm:text-base text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: pageDict.penalty_rules.body.replace(/{lang}/g, lang) }}></div>
            </CardContent>
          </Card>
        )}

        {/* Section 7: How to Enroll */}
        <Card className="shadow-md border border-muted">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl font-bold">
              <Landmark className="h-6 w-6 sm:h-7 sm:w-7 text-primary shrink-0"/>
              <h2>{pageDict.enrollment?.title || "How to Open an APY Account (Online & Offline)"}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm sm:text-base text-muted-foreground">{pageDict.enrollment?.intro}</p>
            {pageDict.enrollment?.steps && (
              <ul className="space-y-3">
                {pageDict.enrollment.steps.map((step: string, index: number) => (
                  <li key={index} className="flex items-start gap-3 text-sm sm:text-base text-muted-foreground bg-muted/30 p-3 rounded-lg border">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span dangerouslySetInnerHTML={{__html: step.replace(/{lang}/g, lang)}}></span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Section 8: Comparison */}
        <Card className="shadow-md border border-muted">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl font-bold">
              <GitCompareArrows className="h-6 w-6 sm:h-7 sm:w-7 text-primary shrink-0"/>
              <h2>{pageDict.comparison?.title || "APY vs NPS vs PPF vs LIC Pension Plans"}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pageDict.comparison?.intro && <p className="text-sm sm:text-base text-muted-foreground">{pageDict.comparison.intro}</p>}
            <div className="text-sm sm:text-base text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{__html: (pageDict.comparison?.body || "").replace(/{lang}/g, lang)}} />
          </CardContent>
        </Card>

        {/* Section 9: Conclusion */}
        <Card className="shadow-md bg-emerald-500/5 border border-emerald-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl font-bold">
              <HeartHandshake className="h-6 w-6 sm:h-7 sm:w-7 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <h2>{pageDict.conclusion?.title || "Start Securing Your Retirement Today"}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm sm:text-base text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: (pageDict.conclusion?.body || "").replace(/{lang}/g, lang) }} />
          </CardContent>
        </Card>

        {/* Section 10: Related Calculators */}
        <Card className="shadow-md border border-muted">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl font-bold">
              <Star className="h-6 w-6 sm:h-7 sm:w-7 text-primary shrink-0" />
              <h2>{pageDict.related_calculators?.title || "Explore Related Financial Calculators"}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm sm:text-base text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: (pageDict.related_calculators?.body || "").replace(/{lang}/g, lang) }}></div>
          </CardContent>
        </Card>
      </div>
    </CalculatorPageLayout>
  );
}