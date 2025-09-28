'use client';

import { AuthorCard } from "@/components/layout/AuthorCard";
import type { Dictionary } from "@/lib/types";
import type { Locale } from "@/lib/i18n-config";
import { FooterCta } from "@/components/layout/FooterCta";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, BarChart2, BookOpen, CheckCircle, FileText, GitCompareArrows, HelpCircle, TrendingUp } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LicSurrenderValueCalculator } from "./LicSurrenderValueCalculator";

function getIcon(iconName: string) {
    switch (iconName) {
        case 'FileText': return FileText;
        case 'HelpCircle': return HelpCircle;
        case 'TrendingUp': return TrendingUp;
        case 'BarChart2': return BarChart2;
        case 'CheckCircle': return CheckCircle;
        case 'GitCompareArrows': return GitCompareArrows;
        case 'BookOpen': return BookOpen;
        default: return AlertTriangle;
    }
}

export default function LicSurrenderValueCalculatorPageClient({
  params,
  dictionary,
  pageDict,
}: {
  params: { lang: Locale };
  dictionary: Dictionary;
  pageDict: any;
}) {

  const siteUrl = 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${params.lang}/lic-surrender-value-calculator`;
  
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/${params.lang}` },
      { '@type': 'ListItem', position: 2, name: 'Calculators', item: `${siteUrl}/${params.lang}/calculators` },
      { '@type': 'ListItem', position: 3, name: 'LIC Surrender Value Calculator', item: pageUrl },
    ],
  };

  return (
    <div className="py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="mx-auto max-w-5xl">
        <header className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline" dangerouslySetInnerHTML={{__html: pageDict.h1}} />
            {pageDict.description && <div className="mt-4 text-lg text-muted-foreground prose dark:prose-invert max-w-none mx-auto" dangerouslySetInnerHTML={{ __html: pageDict.description }} />}
        </header>

        <div id="calculator-widget">
            <LicSurrenderValueCalculator dictionary={pageDict.tool} />
        </div>
        
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
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {section.content.map((item: any, idx: number) => {
                      switch(item.type) {
                        case 'paragraph':
                           return <div key={idx} className="prose dark:prose-invert max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: item.text }} />;
                        case 'list':
                           return <ul key={idx} className="list-disc pl-5 space-y-2 text-muted-foreground">
                                {item.items.map((li: string, liIdx: number) => <li key={liIdx} dangerouslySetInnerHTML={{ __html: li }} />)}
                              </ul>;
                        case 'table':
                            return <div key={idx} className="overflow-x-auto">
                                <Table><TableHeader><TableRow>{item.headers.map((h: string) => <TableHead key={h}>{h}</TableHead>)}</TableRow></TableHeader>
                                <TableBody>{item.rows.map((row: string[], rIdx: number) => <TableRow key={rIdx}>{row.map((cell:string, cIdx:number) => <TableCell key={cIdx} dangerouslySetInnerHTML={{__html: cell}} />)}</TableRow>)}</TableBody>
                                </Table></div>;
                        case 'alert':
                            return <Alert key={idx} variant={item.variant || 'default'}><AlertTriangle className="h-4 w-4" /><AlertTitle>{item.title}</AlertTitle><AlertDescription dangerouslySetInnerHTML={{ __html: item.text }} /></Alert>;
                        case 'faq':
                             return <Accordion key={idx} type="single" collapsible className="w-full">
                                {item.items.map((faq: {q: string, a: string}, qIdx: number) => (
                                    <AccordionItem key={qIdx} value={`item-${qIdx}`}>
                                        <AccordionTrigger>{faq.q}</AccordionTrigger>
                                        <AccordionContent><p dangerouslySetInnerHTML={{__html: faq.a}} /></AccordionContent>
                                    </AccordionItem>
                                ))}
                              </Accordion>;
                        case 'image':
                            return <div key={idx} className="my-6"><Image src={item.src} alt={item.alt} width={800} height={450} className="rounded-lg border shadow-md mx-auto" /></div>
                        case 'monetization_card':
                            return <Card key={idx} className="bg-amber-100/50 dark:bg-amber-900/20 border-amber-400/50"><CardHeader><CardTitle className="text-amber-700 dark:text-amber-400 text-xl">{item.title}</CardTitle></CardHeader><CardContent><p className="text-muted-foreground mb-4">{item.body}</p><Button asChild><Link href={item.href} target="_blank" rel="noopener noreferrer sponsored">{item.cta}</Link></Button></CardContent></Card>
                        default:
                          return null;
                      }
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="mt-12">
            <AuthorCard dictionary={dictionary.author_card} />
        </div>
        <FooterCta dictionary={dictionary.footer_cta} lang={params.lang} />
      </div>
    </div>
  );
}
