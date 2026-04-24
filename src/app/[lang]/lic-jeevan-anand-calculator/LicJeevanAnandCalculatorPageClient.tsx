'use client';

import type { Dictionary } from "@/lib/types";
import type { Locale } from "@/lib/i18n-config";

import { LicNewJeevanAnandCalculator } from "@/components/calculators/LicNewJeevanAnandCalculator";
import { CalculatorPageLayout } from "@/components/layout/CalculatorPageLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, HelpCircle, ShieldCheck, TrendingUp, SlidersHorizontal, BarChart2, StepForward, GitCompareArrows, FileText, Users, BookUser, Star, Calculator } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import Link from "next/link";

function getIcon(iconName: string) {
    switch (iconName) {
        case 'ShieldCheck': return ShieldCheck;
        case 'CheckCircle': return CheckCircle;
        case 'HelpCircle': return HelpCircle;
        case 'TrendingUp': return TrendingUp;
        case 'SlidersHorizontal': return SlidersHorizontal;
        case 'BarChart2': return BarChart2;
        case 'StepForward': return StepForward;
        case 'GitCompareArrows': return GitCompareArrows;
        case 'FileText': return FileText;
        case 'Users': return Users;
        case 'BookUser': return BookUser;
        case 'Star': return Star;
        case 'Calculator': return Calculator;
        default: return HelpCircle;
    }
}

export default function LicJeevanAnandCalculatorPageClient({
  params,
  dictionary,
  pageDict,
}: {
  params: { lang: Locale };
  dictionary: Dictionary;
  pageDict: any;
}) {

  const ArticleContent = () => (
    <div className="mt-12 space-y-8 print-hide">
      {pageDict.article.sections.map((section: any, index: number) => {
        if (section.id === 'faq') return null;
        const Icon = section.icon ? getIcon(section.icon) : null;
        return (
          <Card key={index} className="shadow-lg" id={section.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                {Icon && <Icon className="h-8 w-8 text-primary" />}
                <h2 className="text-2xl font-bold">{section.title}</h2>
              </CardTitle>
               {section.description && <CardDescription dangerouslySetInnerHTML={{ __html: section.description.replace(/{lang}/g, params.lang) }} />}
            </CardHeader>
            <CardContent>
              {section.content.map((item: any, idx: number) => {
                switch (item.type) {
                  case 'paragraph':
                    return <div key={idx} className="prose dark:prose-invert max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: item.text.replace(/{lang}/g, params.lang) }} />;
                  case 'list':
                    return (
                      <ul key={idx} className="list-disc pl-5 space-y-2 text-muted-foreground prose dark:prose-invert max-w-none">
                        {item.items.map((li: string, liIdx: number) => <li key={liIdx} dangerouslySetInnerHTML={{ __html: li.replace(/{lang}/g, params.lang) }} />)}
                      </ul>
                    );
                  case 'table':
                    return (
                        <div key={idx} className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                            <TableRow>
                                {item.headers.map((header: string, hIdx: number) => <TableHead key={hIdx}>{header}</TableHead>)}
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                            {item.rows.map((row: string[], rIdx: number) => (
                                <TableRow key={rIdx}>
                                {row.map((cell: string, cIdx: number) => <TableCell key={cIdx} dangerouslySetInnerHTML={{ __html: cell.replace(/{lang}/g, params.lang) }} />)}
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                        {item.footer && <div className="text-xs text-muted-foreground mt-2 italic" dangerouslySetInnerHTML={{ __html: item.footer.replace(/{lang}/g, params.lang) }}></div>}
                        </div>
                    );
                  case 'steps':
                     return (
                        <ol key={idx} className="space-y-4">
                            {item.items.map((step: {title: string, description: string}, sIdx: number) => (
                                <li key={sIdx} className="flex items-start gap-4">
                                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">{sIdx + 1}</div>
                                    <div>
                                        <h3 className="font-semibold text-lg">{step.title}</h3>
                                        <div className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: step.description.replace(/{lang}/g, params.lang) }}></div>
                                    </div>
                                </li>
                            ))}
                        </ol>
                     );
                  case 'examples':
                    return (
                        <div key={idx} className="space-y-4">
                            {item.items.map((example: {title: string, body: string}, eIdx: number) => (
                                <div key={eIdx} className="bg-muted/50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-lg">{example.title}</h3>
                                    <div className="mt-2 text-muted-foreground prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{__html: example.body.replace(/{lang}/g, params.lang)}}></div>
                                </div>
                            ))}
                        </div>
                    );

                  case 'alert':
                    return <Alert key={idx} variant={item.variant || 'default'}><AlertTitle>{item.title}</AlertTitle><AlertDescription dangerouslySetInnerHTML={{ __html: item.text.replace(/{lang}/g, params.lang) }} /></Alert>;
                  default:
                    return null;
                }
              })}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${params.lang}/lic-jeevan-anand-calculator`;
  
  const faqSection = pageDict.article.sections.find((s: any) => s.id === 'faq');
  const faqs = faqSection ? faqSection.content.find((c: any) => c.type === 'faq')?.items.map((f: any) => ({ question: f.q, answer: f.a })) : [];

  return (
    <CalculatorPageLayout
      lang={params.lang}
      dictionary={dictionary}
      pageDict={pageDict}
      h1={pageDict.h1}
      description={pageDict.top_cta}
      lastUpdated="September 2025"
      calculator={
        <div id="calculator-widget">
          <LicNewJeevanAnandCalculator dictionary={pageDict.tool} />
        </div>
      }
      faqs={faqs}
      faqTitle="Frequently Asked Questions (FAQs)"
      pageUrl={pageUrl}
    >
        <ArticleContent />

        {pageDict.related_calculators && (
          <Card className="mt-12 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Calculator className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-bold">{pageDict.related_calculators.title}</h2>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pageDict.related_calculators.links.map((link: any, index: number) => (
                <Link key={index} href={`/${params.lang}${link.href}`} className="block group">
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{link.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{link.description}</p>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </CardContent>
          </Card>
        )}
        
        {pageDict.article.conclusion && (
            <Card className="mt-12 shadow-lg bg-accent/10 border-accent/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <Star className="h-7 w-7 text-accent" />
                        <h2 className="text-2xl font-bold">{pageDict.article.conclusion.title}</h2>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: pageDict.article.conclusion.body.replace(/{lang}/g, params.lang) }}></div>
                </CardContent>
            </Card>
        )}
        
    </CalculatorPageLayout>
  );
}
