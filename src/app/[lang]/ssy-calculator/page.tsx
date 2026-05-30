
import { SsyCalculator } from "@/components/calculators/SsyCalculator";
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, TrendingUp, ShieldCheck, Scale, Star, Baby, IndianRupee, Landmark, FileText, ArrowRightLeft } from "lucide-react";
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
  const title = 'SSY Calculator 2025 — Sukanya Samriddhi Yojana Returns & Maturity';
  const description = 'Use our free SSY Calculator 2025 to estimate maturity, total interest and year-wise projection (8.2% current rate). Supports annual & monthly deposits. Export results as CSV.';

  return {
    title,
    description,
    openGraph: buildOpenGraph(lang, path, 'SSY Calculator 2025 — Sukanya Samriddhi Yojana Returns', 'Plan your daughter\'s future with the SSY calculator. Updated with current SSY interest rate and download/export options.', ogImageUrl),
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

  return (
    <CalculatorPageLayout
      lang={lang}
      dictionary={dictionary}
      pageDict={pageDict}
      h1={pageDict.h1}
      description={pageDict.description}
      lastUpdated="September 2025"
      calculator={<SsyCalculator dictionary={pageDict} />}
      faqs={pageDict.faqs}
      faqTitle={pageDict.faq_title}
      pageUrl={`${siteUrl}/${lang}/ssy-calculator`}
    >
      <div className="mt-12 space-y-12">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <Baby className="h-7 w-7 text-primary"/>
                <h2 className="text-2xl font-bold">{pageDict.what_is_ssy.title}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div></div>
            <h3 className="font-semibold mt-4 mb-2">{pageDict.what_is_ssy.quick_facts.title}</h3>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              {pageDict.what_is_ssy.quick_facts.points.map((point: string, index: number) => (
                <li key={index} dangerouslySetInnerHTML={{ __html: point.replace(/{lang}/g, lang) }}></li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-12 shadow-lg">
          <CardHeader>
            <h2 className="text-2xl font-bold">{pageDict.how_it_works.title}</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">{pageDict.example.formula_title}</h3>
              <div></div>
              <p className="font-mono bg-background p-3 rounded-md text-center text-sm md:text-base">{pageDict.example.formula}</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg">{pageDict.example.scenario.title}</h3>
              <div></div>
              <ul className="list-disc pl-5 space-y-2 mt-4 text-muted-foreground">
                {pageDict.example.scenario.points.map((point: string, index: number) => (
                  <li key={index} dangerouslySetInnerHTML={{ __html: point.replace(/{lang}/g, lang) }}></li>
                ))}
              </ul>
              <div className="mt-4 bg-primary/10 p-4 rounded-lg border-l-4 border-primary">
                <div></div>
              </div>
            </div>

             <div className="mt-2 text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: pageDict.example.timing_note.replace(/{lang}/g, lang) }}></div>

            <div>
              <h4 className="font-semibold text-lg">{pageDict.example.snapshot_title}</h4>
              <div className="mt-2 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {exampleData.headers.map((header: string, index: number) => (
                        <TableHead key={index} className={index > 0 ? "text-right" : ""}>{header}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exampleData.rows.map((row: string[], rowIndex: number) => (
                      <TableRow key={rowIndex}>
                        {row.map((cell: string, cellIndex: number) => (
                          <TableCell key={cellIndex} className={cellIndex > 0 ? "text-right" : ""}>{cell}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mt-12 shadow-lg bg-primary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                  <TrendingUp className="h-7 w-7 text-primary"/>
                  <span className="text-2xl font-bold">{pageDict.investment_strategy.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <ol className="list-decimal pl-5 space-y-2">
                {pageDict.investment_strategy.points.map((point: string, index: number) => (
                  <li key={index} dangerouslySetInnerHTML={{ __html: point.replace(/{lang}/g, lang) }}></li>
                ))}
              </ol>
               <div className="mt-4" dangerouslySetInnerHTML={{ __html: pageDict.investment_strategy.monthly_example.replace(/{lang}/g, lang) }}></div>
            </CardContent>
        </Card>

        <Card className="mt-12 shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <ShieldCheck className="h-7 w-7 text-primary"/>
                    <h2 className="text-2xl font-bold">{pageDict.tax_benefits.title}</h2>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div></div>
                <div></div>
            </CardContent>
        </Card>

        <Card className="mt-12 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <Scale className="h-7 w-7 text-primary"/>
                <h2 className="text-2xl font-bold">{pageDict.rules.title}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="font-semibold">{pageDict.rules.withdrawal_title}</h3>
            <div></div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div></div>
            </div>
            
            <h3 className="font-semibold pt-4">{pageDict.rules.revival_title}</h3>
            <div></div>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              {pageDict.rules.revival_steps.map((step: string, index: number) => (
                <li key={index} dangerouslySetInnerHTML={{ __html: step.replace(/{lang}/g, lang) }}></li>
              ))}
            </ul>

            <h3 className="font-semibold pt-4">{pageDict.rules.nomination_title}</h3>
            <div></div>
          </CardContent>
        </Card>


        <Card className="mt-12 shadow-lg">
          <CardHeader>
            <h2 className="text-2xl font-bold">{pageDict.comparison.title}</h2>
          </CardHeader>
          <CardContent>
              <Table>
                  <TableHeader>
                      <TableRow>
                          {comparisonData.headers.map((header: string, index: number) => (
                              <TableHead key={index} className={index > 0 ? "text-center" : ""}>{header}</TableHead>
                          ))}
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {comparisonData.rows.map((row: string[], rowIndex: number) => (
                          <TableRow key={rowIndex}>
                              {row.map((cell: string, cellIndex: number) => (
                                  <TableCell key={cellIndex} className={cellIndex > 0 ? 'text-center' : ''} dangerouslySetInnerHTML={{ __html: cell.replace(/{lang}/g, lang) }}></TableCell>
                              ))}
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>
          </CardContent>
        </Card>

        <Card className="mt-12 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                  <FileText className="h-7 w-7 text-primary"/>
                  <h2 className="text-2xl font-bold">{pageDict.how_to_open.title}</h2>
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>{pageDict.how_to_open.intro}</p>
              <ol className="list-decimal pl-5 space-y-2">
                {pageDict.how_to_open.steps.map((step: string, index: number) => (
                  <li key={index} dangerouslySetInnerHTML={{ __html: step.replace(/{lang}/g, lang) }}></li>
                ))}
              </ol>
            </CardContent>
        </Card>

        <Card className="mt-12 shadow-lg">
          <CardHeader>
            <h2 className="text-2xl font-bold">{pageDict.historical_rates.title}</h2>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  {historicalRatesData.headers.map((header: string, index: number) => (
                    <TableHead key={index}>{header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {historicalRatesData.rows.map((row: string[], rowIndex: number) => (
                  <TableRow key={rowIndex}>
                    {row.map((cell: string, cellIndex: number) => (
                      <TableCell key={cellIndex}>{cell}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>



        <Card className="mt-12 shadow-lg bg-accent/10 border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Star className="h-7 w-7 text-accent" />
              <h2 className="text-2xl font-bold">{pageDict.conclusion.title}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{pageDict.conclusion.body}</p>
          </CardContent>
        </Card>

        {pageDict?.related_calculators && <Card className="mt-12 shadow-lg bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <h2 className="text-2xl font-bold">{pageDict.related_calculators.title}</h2>
            <p className="text-muted-foreground mt-2">{pageDict.related_calculators.description}</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pageDict.related_calculators.tools.map((tool: { name: string; description: string; link: string }, index: number) => (
                <Link
                  key={index}
                  href={tool.link.replace('{lang}', lang)}
                  className="p-4 rounded-lg border border-blue-200 dark:border-blue-800 hover:shadow-md hover:border-blue-400 transition-all group bg-white dark:bg-slate-900"
                >
                  <h3 className="font-semibold text-primary group-hover:underline mb-1">{tool.name}</h3>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>}
      </div>
    </CalculatorPageLayout>
  );
}

    

    