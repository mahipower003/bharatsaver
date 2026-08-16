import { SsyCalculator } from "@/components/calculators/SsyCalculator";
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Baby, TrendingUp, ShieldCheck, Scale, Star, FileText, Landmark } from "lucide-react";
import Link from "next/link";
import { CalculatorPageLayout } from "@/components/layout/CalculatorPageLayout";
import { buildAlternates, buildOpenGraph, buildTwitterCard } from "@/lib/seo";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const path = '/ssy-calculator';
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const ogImageUrl = `${siteUrl}/images/calculate-ssy-online.png`;
  const title = 'SSY Calculator 2026 — Sukanya Samriddhi Yojana Returns & Maturity';
  const description = 'Use our free SSY Calculator 2026 to estimate maturity, total interest and year-wise projection (8.2% current rate). Supports annual & monthly deposits. Export results as CSV.';

  return {
    title,
    description,
    openGraph: buildOpenGraph(lang, path, 'SSY Calculator 2026 — Sukanya Samriddhi Yojana Returns', 'Plan your daughter\'s future with the SSY calculator. Updated with current SSY interest rate and download/export options.', ogImageUrl),
    twitter: buildTwitterCard(title, description, ogImageUrl),
    alternates: buildAlternates(lang, path),
  };
}

export default async function SsyCalculatorPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const pageDict = { ...(await import(`@/dictionaries/${lang}/ssy-calculator.json`)).default };
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const exampleData = pageDict.example.table;
  const comparisonData = pageDict.comparison.table;
  const historicalRatesData = pageDict.historical_rates.table;

  // Sections definition for TableOfContents
  const sections = [
    { id: 'what-is-ssy', title: pageDict.what_is_ssy.title },
    { id: 'how-it-works', title: pageDict.how_it_works.title },
    { id: 'investment-strategy', title: pageDict.investment_strategy.title },
    { id: 'tax-benefits', title: pageDict.tax_benefits.title },
    { id: 'ssy-rules', title: pageDict.rules.title },
    { id: 'ssy-comparison', title: pageDict.comparison.title },
    { id: 'how-to-open', title: pageDict.how_to_open.title },
    { id: 'historical-rates', title: pageDict.historical_rates.title },
  ];

  const fullPageDict = { ...pageDict, sections };

  return (
    <CalculatorPageLayout
      lang={lang}
      dictionary={dictionary}
      pageDict={fullPageDict}
      h1={pageDict.h1}
      description={pageDict.description}
      lastUpdated="August 2026"
      calculator={<SsyCalculator dictionary={pageDict} />}
      faqs={pageDict.faqs}
      faqTitle={pageDict.faq_title}
      pageUrl={`${siteUrl}/${lang}/ssy-calculator`}
    >
      <div className="mt-8 space-y-10">
        {/* Section 1: What is SSY */}
        <Card id="what-is-ssy" className="shadow-lg scroll-mt-24">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Baby className="h-7 w-7 text-primary shrink-0" />
              <h2 className="text-2xl font-bold">{pageDict.what_is_ssy.title}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: pageDict.what_is_ssy.body.replace(/{lang}/g, lang) }}
            />
            <div className="pt-2">
              <h3 className="font-semibold text-lg mb-2 text-foreground">{pageDict.what_is_ssy.quick_facts.title}</h3>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                {pageDict.what_is_ssy.quick_facts.points.map((point: string, index: number) => (
                  <li key={index} dangerouslySetInnerHTML={{ __html: point.replace(/{lang}/g, lang) }} />
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: How it Works & Calculation Logic */}
        <Card id="how-it-works" className="shadow-lg scroll-mt-24">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Landmark className="h-7 w-7 text-primary shrink-0" />
              <h2 className="text-2xl font-bold">{pageDict.how_it_works.title}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {pageDict.example.intro && (
              <p className="text-muted-foreground leading-relaxed">
                {pageDict.example.intro}
              </p>
            )}

            <div className="bg-muted/50 p-4 rounded-xl border border-muted/80">
              <h3 className="font-bold text-base mb-2 text-foreground">{pageDict.example.formula_title}</h3>
              <p className="font-mono bg-background p-3 rounded-lg text-center text-sm md:text-base border shadow-xs font-semibold text-primary">
                {pageDict.example.formula}
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg text-foreground">{pageDict.example.scenario.title}</h3>
              {pageDict.example.scenario.body && (
                <p className="text-sm text-muted-foreground mt-1">{pageDict.example.scenario.body}</p>
              )}
              <ul className="list-disc pl-5 space-y-1.5 mt-3 text-muted-foreground">
                {pageDict.example.scenario.points.map((point: string, index: number) => (
                  <li key={index} dangerouslySetInnerHTML={{ __html: point.replace(/{lang}/g, lang) }} />
                ))}
              </ul>
              {pageDict.example.scenario.result && (
                <div className="mt-4 bg-primary/10 p-4 rounded-xl border-l-4 border-primary text-sm text-foreground">
                  <span dangerouslySetInnerHTML={{ __html: pageDict.example.scenario.result }} />
                </div>
              )}
            </div>

            <div
              className="text-xs text-muted-foreground italic"
              dangerouslySetInnerHTML={{ __html: pageDict.example.timing_note.replace(/{lang}/g, lang) }}
            />

            <div>
              <h4 className="font-bold text-base text-foreground mb-3">{pageDict.example.snapshot_title}</h4>
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      {exampleData.headers.map((header: string, index: number) => (
                        <TableHead key={index} className={index > 0 ? "text-right font-bold" : "font-bold"}>{header}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exampleData.rows.map((row: string[], rowIndex: number) => (
                      <TableRow key={rowIndex}>
                        {row.map((cell: string, cellIndex: number) => (
                          <TableCell key={cellIndex} className={cellIndex > 0 ? "text-right font-medium" : "font-semibold"}>{cell}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {pageDict.example.footer_note && (
                <p className="text-xs text-muted-foreground mt-2 italic">{pageDict.example.footer_note}</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Section 3: Investment Strategy */}
        <Card id="investment-strategy" className="shadow-lg bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-500/30 scroll-mt-24">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <TrendingUp className="h-7 w-7 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <h2 className="text-2xl font-bold">{pageDict.investment_strategy.title}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <ol className="list-decimal pl-5 space-y-3">
              {pageDict.investment_strategy.points.map((point: string, index: number) => (
                <li key={index} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: point.replace(/{lang}/g, lang) }} />
              ))}
            </ol>
            <div
              className="mt-4 p-3.5 rounded-lg bg-white dark:bg-slate-900 border text-xs text-slate-700 dark:text-slate-300"
              dangerouslySetInnerHTML={{ __html: pageDict.investment_strategy.monthly_example.replace(/{lang}/g, lang) }}
            />
          </CardContent>
        </Card>

        {/* Section 4: Tax Benefits */}
        <Card id="tax-benefits" className="shadow-lg scroll-mt-24">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <ShieldCheck className="h-7 w-7 text-primary shrink-0" />
              <h2 className="text-2xl font-bold">{pageDict.tax_benefits.title}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground leading-relaxed">
            {pageDict.tax_benefits.intro && (
              <p className="font-medium text-foreground">{pageDict.tax_benefits.intro}</p>
            )}
            <div dangerouslySetInnerHTML={{ __html: pageDict.tax_benefits.body.replace(/{lang}/g, lang) }} />
          </CardContent>
        </Card>

        {/* Section 5: Key Rules */}
        <Card id="ssy-rules" className="shadow-lg scroll-mt-24">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Scale className="h-7 w-7 text-primary shrink-0" />
              <h2 className="text-2xl font-bold">{pageDict.rules.title}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-muted-foreground">
            <div>
              <h3 className="font-bold text-lg text-foreground mb-2">{pageDict.rules.withdrawal_title}</h3>
              <p className="leading-relaxed">{pageDict.rules.withdrawal_body}</p>
              {pageDict.rules.withdrawal_example && (
                <p className="mt-2 text-xs bg-muted/60 p-3 rounded-lg border text-foreground italic">
                  {pageDict.rules.withdrawal_example}
                </p>
              )}
            </div>

            <div className="pt-2 border-t">
              <h3 className="font-bold text-lg text-foreground mb-2">{pageDict.rules.revival_title}</h3>
              <p className="mb-2">{pageDict.rules.revival_intro}</p>
              <ul className="list-disc pl-5 space-y-1.5">
                {pageDict.rules.revival_steps.map((step: string, index: number) => (
                  <li key={index} dangerouslySetInnerHTML={{ __html: step.replace(/{lang}/g, lang) }} />
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t">
              <h3 className="font-bold text-lg text-foreground mb-2">{pageDict.rules.nomination_title}</h3>
              <p className="leading-relaxed">{pageDict.rules.nomination_body}</p>
            </div>
          </CardContent>
        </Card>

        {/* Section 6: Comparison */}
        <Card id="ssy-comparison" className="shadow-lg scroll-mt-24">
          <CardHeader>
            <h2 className="text-2xl font-bold">{pageDict.comparison.title}</h2>
            {pageDict.comparison.intro && (
              <p className="text-sm text-muted-foreground">{pageDict.comparison.intro}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    {comparisonData.headers.map((header: string, index: number) => (
                      <TableHead key={index} className={index > 0 ? "text-center font-bold" : "font-bold"}>{header}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comparisonData.rows.map((row: string[], rowIndex: number) => (
                    <TableRow key={rowIndex}>
                      {row.map((cell: string, cellIndex: number) => (
                        <TableCell key={cellIndex} className={cellIndex > 0 ? 'text-center font-medium' : 'font-semibold'} dangerouslySetInnerHTML={{ __html: cell.replace(/{lang}/g, lang) }} />
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {pageDict.comparison.footer_note && (
              <div className="text-xs text-muted-foreground pt-2 border-t" dangerouslySetInnerHTML={{ __html: pageDict.comparison.footer_note.replace(/{lang}/g, lang) }} />
            )}
          </CardContent>
        </Card>

        {/* Section 7: How to Open */}
        <Card id="how-to-open" className="shadow-lg scroll-mt-24">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <FileText className="h-7 w-7 text-primary shrink-0" />
              <h2 className="text-2xl font-bold">{pageDict.how_to_open.title}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p className="text-foreground font-medium">{pageDict.how_to_open.intro}</p>
            <ol className="list-decimal pl-5 space-y-2">
              {pageDict.how_to_open.steps.map((step: string, index: number) => (
                <li key={index} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: step.replace(/{lang}/g, lang) }} />
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* Section 8: Historical Rates */}
        <Card id="historical-rates" className="shadow-lg scroll-mt-24">
          <CardHeader>
            <h2 className="text-2xl font-bold">{pageDict.historical_rates.title}</h2>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg border max-w-xl">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    {historicalRatesData.headers.map((header: string, index: number) => (
                      <TableHead key={index} className="font-bold">{header}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historicalRatesData.rows.map((row: string[], rowIndex: number) => (
                    <TableRow key={rowIndex}>
                      {row.map((cell: string, cellIndex: number) => (
                        <TableCell key={cellIndex} className={cellIndex === 1 ? 'font-bold text-emerald-600 dark:text-emerald-400' : 'font-medium'}>{cell}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Conclusion Card */}
        {pageDict.conclusion && (
          <Card className="shadow-lg bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Star className="h-7 w-7 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <h2 className="text-2xl font-bold">{pageDict.conclusion.title}</h2>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{pageDict.conclusion.body}</p>
            </CardContent>
          </Card>
        )}

        {/* Related Calculators Bucket Links */}
        {pageDict?.related_calculators && (
          <Card className="shadow-lg bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <h2 className="text-2xl font-bold">{pageDict.related_calculators.title}</h2>
              <p className="text-muted-foreground mt-1 text-sm">{pageDict.related_calculators.description}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pageDict.related_calculators.tools.map((tool: { name: string; description: string; link: string }, index: number) => (
                  <Link
                    key={index}
                    href={tool.link.replace('{lang}', lang)}
                    className="p-4 rounded-xl border border-blue-200 dark:border-blue-800 hover:shadow-md hover:border-blue-400 transition-all group bg-white dark:bg-slate-900"
                  >
                    <h3 className="font-bold text-primary group-hover:underline mb-1 text-sm">{tool.name}</h3>
                    <p className="text-xs text-muted-foreground">{tool.description}</p>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </CalculatorPageLayout>
  );
}