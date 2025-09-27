
'use client';

import { LicMaturityCalculator } from "@/components/calculators/LicMaturityCalculator";
import { AuthorCard } from "@/components/layout/AuthorCard";
import type { Dictionary } from "@/lib/types";
import type { Locale } from "@/lib/i18n-config";
import { FooterCta } from "@/components/layout/FooterCta";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HelpCircle, SlidersHorizontal, StepForward, BarChart2, TrendingUp, FileText, GitCompareArrows, BookUser, Star, CheckCircle, ShieldCheck, Calculator, Table as TableIcon, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar } from 'recharts';

function getIcon(iconName: string) {
    switch (iconName) {
        case 'HelpCircle': return HelpCircle;
        case 'SlidersHorizontal': return SlidersHorizontal;
        case 'StepForward': return StepForward;
        case 'BarChart2': return BarChart2;
        case 'TrendingUp': return TrendingUp;
        case 'FileText': return FileText;
        case 'GitCompareArrows': return GitCompareArrows;
        case 'BookUser': return BookUser;
        case 'CheckCircle': return CheckCircle;
        case 'ShieldCheck': return ShieldCheck;
        case 'Calculator': return Calculator;
        case 'TableIcon': return TableIcon;
        case 'LinkIcon': return LinkIcon;
        default: return Star;
    }
}

const ContentRenderer = ({ content, lang }: { content: any[], lang: Locale }) => {
  return (
    <div className="space-y-4">
      {content.map((item, idx) => {
        switch (item.type) {
          case 'paragraph':
            return <div key={idx} className="prose dark:prose-invert max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: item.text.replace(/{lang}/g, lang) }} />;
          case 'list':
            return (
              <ul key={idx} className="list-disc pl-5 space-y-2 text-muted-foreground">
                {item.items.map((li: string, liIdx: number) => <li key={liIdx} dangerouslySetInnerHTML={{ __html: li.replace(/{lang}/g, lang) }} />)}
              </ul>
            );
          case 'table':
            return (
              <div key={idx} className="overflow-x-auto">
                <Table>
                  {item.headers && <TableHeader><TableRow>{item.headers.map((header: string, hIdx: number) => <TableHead key={hIdx}>{header}</TableHead>)}</TableRow></TableHeader>}
                  <TableBody>
                    {item.rows.map((row: string[], rIdx: number) => (
                      <TableRow key={rIdx}>
                        {row.map((cell: string, cIdx: number) => <TableCell key={cIdx} dangerouslySetInnerHTML={{ __html: cell.replace(/{lang}/g, lang) }} />)}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {item.footer && <p className="text-xs text-muted-foreground mt-2 italic" dangerouslySetInnerHTML={{ __html: item.footer }} />}
              </div>
            );
          case 'bar_chart':
            return (
              <div key={idx} className="h-64 w-full mt-4">
                  <ResponsiveContainer>
                      <BarChart data={item.data}>
                          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                          <YAxis />
                          <Tooltip contentStyle={{ borderRadius: "var(--radius)", background: "hsl(var(--background))" }} />
                          <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                  </ResponsiveContainer>
              </div>
            );
          case 'alert':
            return (
              <Alert key={idx} variant={item.variant || 'default'}>
                {item.title && <AlertTitle>{item.title}</AlertTitle>}
                <AlertDescription dangerouslySetInnerHTML={{ __html: item.text }} />
              </Alert>
            );
          case 'formula':
            return <p key={idx} className="font-mono bg-muted p-4 rounded-md my-4 text-center" dangerouslySetInnerHTML={{ __html: item.text }} />;
           case 'faq':
            return (
              <Accordion key={idx} type="single" collapsible className="w-full">
                {item.items.map((faq: {q: string, a: string}, qIdx: number) => (
                    <AccordionItem key={qIdx} value={`item-${qIdx}`}>
                        <AccordionTrigger>{faq.q}</AccordionTrigger>
                        <AccordionContent><p dangerouslySetInnerHTML={{__html: faq.a}} /></AccordionContent>
                    </AccordionItem>
                ))}
              </Accordion>
            );
            case 'card_link':
              const CardIcon = getIcon(item.icon);
              return (
                  <Link key={idx} href={item.href.replace('{lang}', lang)} className="group block">
                      <Card className="hover:shadow-md hover:border-primary/30 transition-all">
                          <CardHeader className="flex flex-row items-center gap-4">
                              <CardIcon className="h-8 w-8 text-primary" />
                              <div>
                                  <CardTitle className="text-lg">{item.title}</CardTitle>
                                  <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                              </div>
                          </CardHeader>
                      </Card>
                  </Link>
              );
          default:
            return null;
        }
      })}
    </div>
  );
};


export default function LicMaturityCalculatorPageClient({
  params,
  dictionary,
  pageDict,
}: {
  params: { lang: Locale };
  dictionary: Dictionary;
  pageDict: any;
}) {

  const siteUrl = 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${params.lang}/lic-maturity-calculator`;
  
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/${params.lang}` },
      { '@type': 'ListItem', position: 2, name: 'Calculators', item: `${siteUrl}/${params.lang}/calculators` },
      { '@type': 'ListItem', position: 3, name: 'LIC Maturity Calculator', item: pageUrl },
    ],
  };

  const ArticleContent = () => (
    <div className="mt-12 space-y-8">
      {pageDict.sections.map((section: any, index: number) => {
        const Icon = getIcon(section.icon);
        return (
          <Card key={index} id={section.id} className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Icon className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-bold">{section.title}</h2>
              </CardTitle>
              {section.description && <CardDescription dangerouslySetInnerHTML={{ __html: section.description }} />}
            </CardHeader>
            <CardContent>
              <ContentRenderer content={section.content} lang={params.lang} />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
  
  return (
    <div className="py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="mx-auto max-w-5xl">
        <header className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline" dangerouslySetInnerHTML={{__html: pageDict.h1}} />
            {pageDict.top_cta && <p className="mt-4 text-lg text-muted-foreground" dangerouslySetInnerHTML={{ __html: pageDict.top_cta.replace('{calculator-widget}', '#calculator-widget') }}></p>}
        </header>
        
        <div id="calculator-widget">
          <LicMaturityCalculator dictionary={pageDict.tool} />
        </div>

        <ArticleContent />
        
        <div className="mt-12">
            <AuthorCard dictionary={dictionary.author_card} />
        </div>
        <FooterCta dictionary={dictionary.footer_cta} lang={params.lang} />
      </div>
    </div>
  );
}
