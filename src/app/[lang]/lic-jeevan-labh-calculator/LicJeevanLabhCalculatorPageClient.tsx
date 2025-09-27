
'use client';

import { LicJeevanLabhCalculator } from "@/components/calculators/LicJeevanLabhCalculator";
import { AuthorCard } from "@/components/layout/AuthorCard";
import type { Dictionary } from "@/lib/types";
import type { Locale } from "@/lib/i18n-config";
import { FooterCta } from "@/components/layout/FooterCta";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, HelpCircle, ShieldCheck, TrendingUp, SlidersHorizontal, BarChart2, StepForward } from "lucide-react";

function getIcon(iconName: string) {
    switch (iconName) {
        case 'ShieldCheck': return ShieldCheck;
        case 'CheckCircle': return CheckCircle;
        case 'HelpCircle': return HelpCircle;
        case 'TrendingUp': return TrendingUp;
        case 'SlidersHorizontal': return SlidersHorizontal;
        case 'BarChart2': return BarChart2;
        case 'StepForward': return StepForward;
        default: return HelpCircle;
    }
}

export default function LicJeevanLabhCalculatorPageClient({
  params,
  dictionary,
  pageDict,
}: {
  params: { lang: Locale };
  dictionary: Dictionary;
  pageDict: any;
}) {

  const ArticleContent = () => (
    <div className="mt-12 space-y-8">
      {pageDict.article.sections.map((section: any, index: number) => {
        const Icon = getIcon(section.icon);
        return (
          <Card key={index} className="shadow-lg" id={section.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Icon className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-bold">{section.title}</h2>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {section.content.map((item: any, idx: number) => {
                switch (item.type) {
                  case 'paragraph':
                    return <p key={idx} className="text-muted-foreground mb-4" dangerouslySetInnerHTML={{ __html: item.text }} />;
                  case 'list':
                    return (
                      <ul key={idx} className="list-disc pl-5 space-y-2 text-muted-foreground">
                        {item.items.map((li: string, liIdx: number) => <li key={liIdx} dangerouslySetInnerHTML={{ __html: li }} />)}
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
                                {row.map((cell: string, cIdx: number) => <TableCell key={cIdx} dangerouslySetInnerHTML={{ __html: cell }} />)}
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                        {item.footer && <p className="text-xs text-muted-foreground mt-2 italic" dangerouslySetInnerHTML={{ __html: item.footer }} />}
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
                                        <p className="text-muted-foreground">{step.description}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                     );
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

  return (
    <div className="py-12">
      <div className="mx-auto max-w-5xl">
        <header className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline" dangerouslySetInnerHTML={{__html: pageDict.h1}} />
            <div className="mt-4 text-lg text-muted-foreground prose dark:prose-invert max-w-none mx-auto" dangerouslySetInnerHTML={{__html: pageDict.description}} />
        </header>
        
        <div id="calculator-widget">
          <LicJeevanLabhCalculator dictionary={pageDict.tool} />
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
