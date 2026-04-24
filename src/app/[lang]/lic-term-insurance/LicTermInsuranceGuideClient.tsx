
'use client';

import type { Dictionary } from "@/lib/types";
import type { Locale } from "@/lib/i18n-config";
import { CalculatorPageLayout } from "@/components/layout/CalculatorPageLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Download, BarChart, FileText, CheckCircle, SlidersHorizontal, GitCompareArrows, AlertTriangle, Users, BookUser, Star, HelpCircle, UserCheck, Calculator } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";
import { LicTermInsuranceCalculator } from "@/components/calculators/LicTermInsuranceCalculator";

function getIcon(iconName: string) {
    const icons: { [key: string]: React.ElementType } = {
        BarChart, FileText, CheckCircle, SlidersHorizontal, GitCompareArrows,
        AlertTriangle, Users, BookUser, Star, HelpCircle, UserCheck, Calculator
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
                        </Table>{item.footer && <div className="text-xs text-muted-foreground mt-2 italic" dangerouslySetInnerHTML={{ __html: item.footer }} />}</div>;
                    case 'steps':
                        return <ol key={idx} className="space-y-4">
                            {item.items.map((step: {title: string; description: string}, sIdx: number) => (
                                <li key={sIdx} className="flex items-start gap-4">
                                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">{sIdx + 1}</div>
                                    <div>
                                        <h3 className="font-semibold text-lg">{step.title}</h3>
                                        <div className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: step.description }}></div>
                                    </div>
                                </li>
                            ))}
                        </ol>;
                    case 'calculator':
                        return <LicTermInsuranceCalculator key={idx} />;
                    case 'cta_card':
                         return (
                            <Card key={idx} className="bg-primary/10 border-primary/20 text-center p-6">
                                <CardTitle className="text-xl font-bold">{item.title}</CardTitle>
                                <CardDescription className="mt-2">{item.description}</CardDescription>
                                <div className="mt-4 flex gap-4 justify-center">
                                  {item.buttons.map((button: any, btnIdx: number) => (
                                    <Button key={btnIdx} asChild>
                                        <Link href={button.href} target="_blank" rel="noopener noreferrer">{button.text}</Link>
                                    </Button>
                                  ))}
                                </div>
                            </Card>
                         );
                    case 'structured_content':
                        return <div key={idx} className="space-y-4">
                            {item.items.map((subItem: {title: string; text: string}, subIdx: number) => (
                                <div key={subIdx}>
                                    <h3 className="font-semibold text-lg" dangerouslySetInnerHTML={{__html: subItem.title}} />
                                    <div className="prose dark:prose-invert max-w-none text-muted-foreground mt-1" dangerouslySetInnerHTML={{__html: subItem.text.replace(/{lang}/g, lang)}} />
                                </div>
                            ))}
                        </div>
                    default:
                        return null;
                }
            })}
        </div>
    );
};

export default function LicTermInsuranceGuideClient({
  params,
  dictionary,
  pageDict,
}: {
  params: { lang: Locale };
  dictionary: Dictionary;
  pageDict: any;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${params.lang}/lic-term-insurance`;

  const faqSection = pageDict.sections.find((s:any) => s.id === 'faq');
  const faqs = faqSection ? faqSection.content.find((c: any) => c.type === 'faq')?.items.map((f: any) => ({ question: f.q, answer: f.a })) : [];

  const articleSchema = {
    ...pageDict.article_schema,
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
    author: { ...pageDict.article_schema.author, url: `${siteUrl}/${params.lang}/author/mahesh-chaube`},
    publisher: { ...pageDict.article_schema.publisher, logo: { "@type": "ImageObject", "url": `${siteUrl}/icon.svg`}}
  };

  const howToSchema = pageDict.how_to_schema;
  const schemas = [howToSchema, articleSchema].filter(Boolean);

  return (
    <CalculatorPageLayout
      lang={params.lang}
      dictionary={dictionary}
      pageDict={pageDict}
      h1={pageDict.h1}
      description={pageDict.byline || ""}
      lastUpdated="September 2025"
      calculator={null} // Handled inside content
      faqs={faqs}
      faqTitle="Frequently Asked Questions (FAQs)"
      pageUrl={pageUrl}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />
      <div className="space-y-8 print-hide mt-12">
          {pageDict.sections.map((section: any, index: number) => {
              if (section.id === 'faq') return null;
              const Icon = getIcon(section.icon);
              return (
                <Card key={index} id={section.id} className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      {Icon && <Icon className="h-8 w-8 text-primary" />}
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
      </div>
    </CalculatorPageLayout>
  );
}
