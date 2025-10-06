
'use client';

import type { Dictionary } from "@/lib/types";
import type { Locale } from "@/lib/i18n-config";
import { LicJeevanUmangCalculator } from "@/components/calculators/LicJeevanUmangCalculator";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AuthorCard } from "@/components/layout/AuthorCard";
import { FooterCta } from "@/components/layout/FooterCta";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Download, BarChart, FileText, CheckCircle, SlidersHorizontal, GitCompareArrows, AlertTriangle, Users, BookUser, Star, HelpCircle, UserCheck, Calculator, Landmark } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";
import { LicUmangPremiumChart } from "@/components/calculators/LicUmangPremiumChart";

function getIcon(iconName: string) {
    const icons: { [key: string]: React.ElementType } = {
        BarChart, FileText, CheckCircle, SlidersHorizontal, GitCompareArrows,
        AlertTriangle, Users, BookUser, Star, HelpCircle, UserCheck, Calculator, Landmark
    };
    return icons[iconName] || HelpCircle;
}

const ContentRenderer = ({ content, lang }: { content: any[], lang: Locale }) => {
    if (!content) return null;
    return (
        <div className="space-y-4">
            {content.map((item, idx) => {
                switch (item.type) {
                    case 'paragraph':
                        return <div key={idx} className="prose dark:prose-invert max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: item.text.replace(/{lang}/g, lang) }} />;
                    case 'list':
                        return <ul key={idx} className="list-disc pl-5 space-y-2 text-muted-foreground prose dark:prose-invert max-w-none">
                            {item.items.map((li: string, liIdx: number) => <li key={liIdx} dangerouslySetInnerHTML={{ __html: li.replace(/{lang}/g, lang) }} />)}
                        </ul>;
                    case 'table':
                        return <div key={idx} className="overflow-x-auto"><Table>
                            <TableHeader><TableRow>{item.headers.map((h: string, hIdx: number) => <TableHead key={hIdx}>{h}</TableHead>)}</TableRow></TableHeader>
                            <TableBody>{item.rows.map((row: (string|number)[], rIdx: number) => <TableRow key={rIdx}>{row.map((cell: string|number, cIdx: number) => <TableCell key={cIdx} dangerouslySetInnerHTML={{ __html: String(cell).replace(/{lang}/g, lang) }} />)}</TableRow>)}</TableBody>
                        </Table>{item.footer && <p className="text-xs text-muted-foreground mt-2 italic" dangerouslySetInnerHTML={{ __html: item.footer }} />}</div>;
                    case 'faq':
                         if (!item.items) return null;
                        return <Accordion key={idx} type="single" collapsible className="w-full">
                            {item.items.map((faq: {q: string; a: string}, qIdx: number) => (
                                <AccordionItem key={qIdx} value={`item-${qIdx}`}>
                                    <AccordionTrigger>{faq.q}</AccordionTrigger>
                                    <AccordionContent><div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{__html: faq.a}} /></AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>;
                    case 'structured_content':
                         return (
                            <div key={idx} className="space-y-4">
                                {item.heading && <h3 className="text-xl font-semibold" dangerouslySetInnerHTML={{ __html: item.heading }} />}
                                {item.body && <div className="prose dark:prose-invert max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: item.body }} />}
                            </div>
                        );
                    case 'premium_chart':
                        return <LicUmangPremiumChart key={idx} />;
                    default:
                        return null;
                }
            })}
        </div>
    );
};

export default function LicJeevanUmangCalculatorPageClient({
  params,
  dictionary,
  pageDict,
}: {
  params: { lang: Locale };
  dictionary: Dictionary;
  pageDict: any;
}) {

  return (
    <div className="py-12">
      <div className="mx-auto max-w-5xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline" dangerouslySetInnerHTML={{ __html: pageDict.h1 }} />
           <p className="mt-4 text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: pageDict.intro.quick_answer }}></p>
            <Button asChild size="lg" className="mt-6">
                <Link href="#calculator-widget">{pageDict.intro.cta_button}</Link>
            </Button>
            <p className="text-xs text-muted-foreground mt-4" dangerouslySetInnerHTML={{ __html: pageDict.intro.citation }} />
        </header>
        
        <div id="calculator-widget">
            <h2 className="text-2xl font-bold text-center mb-4">{pageDict.calculator_ui.h2}</h2>
            <LicJeevanUmangCalculator dictionary={pageDict.calculator_ui} />
        </div>

        <div className="mt-12 space-y-8">
            {pageDict.sections && Array.isArray(pageDict.sections) && pageDict.sections.map((section: any, index: number) => {
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
        
        <AuthorCard dictionary={dictionary.author_card} />
        <FooterCta dictionary={dictionary.footer_cta} lang={params.lang} />
      </div>
    </div>
  );
}
