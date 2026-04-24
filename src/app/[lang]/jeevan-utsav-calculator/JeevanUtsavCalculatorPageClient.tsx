
'use client';

import type { Dictionary } from "@/lib/types";
import type { Locale } from "@/lib/i18n-config";
import { JeevanUtsavCalculator } from "@/components/calculators/JeevanUtsavCalculator";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CalculatorPageLayout } from "@/components/layout/CalculatorPageLayout";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Download, BarChart, FileText, CheckCircle, SlidersHorizontal, GitCompareArrows, AlertTriangle, Users, BookUser, Star, HelpCircle, UserCheck, Calculator, TrendingUp } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";

function getIcon(iconName: string) {
    const icons: { [key: string]: React.ElementType } = {
        BarChart, FileText, CheckCircle, SlidersHorizontal, GitCompareArrows,
        AlertTriangle, Users, BookUser, Star, HelpCircle, UserCheck, Calculator, TrendingUp
    };
    return icons[iconName] || HelpCircle;
}

const ContentRenderer = ({ content, lang }: { content: any[]; lang: Locale }) => {
    if (!content) return null;
    return (
        <div className="space-y-4">
            {content.map((item, idx) => {
                const Icon = item.icon ? getIcon(item.icon) : null;
                switch (item.type) {
                    case 'paragraph':
                        return <div key={idx} className="prose dark:prose-invert max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: item.text.replace(/{lang}/g, lang) }} />;
                    case 'list':
                        return <ul key={idx} className="list-disc pl-5 space-y-2 text-muted-foreground">
                            {item.items.map((li: string, liIdx: number) => <li key={liIdx} dangerouslySetInnerHTML={{ __html: li.replace(/{lang}/g, lang) }} />)}
                        </ul>;
                    case 'table':
                        return <div key={idx} className="overflow-x-auto"><Table>
                            <TableHeader><TableRow>{item.headers.map((h: string, hIdx: number) => <TableHead key={hIdx}>{h}</TableHead>)}</TableRow></TableHeader>
                            <TableBody>{item.rows.map((row: (string|number)[], rIdx: number) => <TableRow key={rIdx}>{row.map((cell: string|number, cIdx: number) => <TableCell key={cIdx} dangerouslySetInnerHTML={{ __html: String(cell).replace(/{lang}/g, lang) }} />)}</TableRow>)}</TableBody>
                        </Table>{item.footer && <div className="text-xs text-muted-foreground mt-2 italic" dangerouslySetInnerHTML={{ __html: item.footer.replace(/{lang}/g, lang) }}></div>}</div>;
                    case 'steps':
                        return <ol key={idx} className="space-y-4">
                            {item.items.map((step: {title: string; description: string}, sIdx: number) => (
                                <li key={sIdx} className="flex items-start gap-4">
                                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">{sIdx + 1}</div>
                                    <div>
                                        <h3 className="font-semibold text-lg">{step.title}</h3>
                                        <div className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: step.description.replace(/{lang}/g, lang) }}></div>
                                    </div>
                                </li>
                            ))}
                        </ol>;
                    case 'faq':
                        return <Accordion key={idx} type="single" collapsible className="w-full">
                            {item.items.map((faq: {q: string; a: string}, qIdx: number) => (
                                <AccordionItem key={qIdx} value={`item-${qIdx}`}>
                                    <AccordionTrigger>{faq.q}</AccordionTrigger>
                                    <AccordionContent><div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{__html: faq.a.replace(/{lang}/g, lang)}} /></AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>;
                    case 'examples':
                         return <Accordion key={idx} type="single" collapsible className="w-full">
                            {item.items.map((example: {title: string; body: string}, eIdx: number) => (
                                <AccordionItem key={eIdx} value={`item-${eIdx}`}>
                                    <AccordionTrigger>{example.title}</AccordionTrigger>
                                    <AccordionContent><div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{__html: example.body.replace(/{lang}/g, lang)}} /></AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>;
                    case 'image':
                        return <div key={idx} className="my-6"><Image src={item.src} alt={item.alt} width={800} height={450} className="rounded-lg border shadow-md mx-auto" /></div>
                    default:
                        return null;
                }
            })}
        </div>
    );
};

export default function JeevanUtsavCalculatorPageClient({
  params,
  dictionary,
  pageDict,
}: {
  params: { lang: Locale };
  dictionary: Dictionary;
  pageDict: any;
}) {
  const siteUrl = 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${params.lang}/jeevan-utsav-calculator`;
  
  const faqSection = pageDict.sections.find((s: any) => s.id === 'faq');
  const faqs = faqSection ? faqSection.content.find((c: any) => c.type === 'faq')?.items.map((f: any) => ({ question: f.q, answer: f.a })) : [];

  return (
    <CalculatorPageLayout
      lang={params.lang}
      dictionary={dictionary}
      pageDict={pageDict}
      h1={pageDict.h1}
      description={pageDict.trust_blurb}
      lastUpdated="September 2025"
      calculator={
        <div id="calculator-widget">
          <JeevanUtsavCalculator dictionary={pageDict.calculator_ui} />
        </div>
      }
      faqs={faqs}
      faqTitle="Frequently Asked Questions (FAQs)"
      pageUrl={pageUrl}
    >
        <div className="mt-12 space-y-8">
            {pageDict.sections.map((section: any, index: number) => {
                if (section.id === 'faq') return null; // FAQ is handled by CalculatorPageLayout
                const Icon = getIcon(section.icon);
                return (
                  <Card key={index} id={section.id} className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <Icon className="h-8 w-8 text-primary" />
                        <h2 className="text-2xl font-bold">{section.title}</h2>
                      </CardTitle>
                      {section.description && <CardDescription dangerouslySetInnerHTML={{ __html: section.description.replace(/{lang}/g, params.lang) }} />}
                    </CardHeader>
                    <CardContent>
                      <ContentRenderer content={section.content} lang={params.lang}/>
                    </CardContent>
                  </Card>
                )
            })}

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
        </div>
        
        {pageDict.conclusion && (
          <Card className="mt-12 shadow-lg bg-accent/10 border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Star className="h-7 w-7 text-accent" />
                <h2 className="text-2xl font-bold">{pageDict.conclusion.title}</h2>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: pageDict.conclusion.body }} />
            </CardContent>
          </Card>
        )}
    </CalculatorPageLayout>
  );
}
