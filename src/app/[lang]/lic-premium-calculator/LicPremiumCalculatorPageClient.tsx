
'use client';

import { LicPremiumCalculator } from "@/components/calculators/LicPremiumCalculator";
import { CalculatorPageLayout } from "@/components/layout/CalculatorPageLayout";
import type { Dictionary } from "@/lib/types";
import type { Locale } from "@/lib/i18n-config";
import { BarChart2, CheckCircle, Lightbulb, TrendingUp, HelpCircle, FileText, Download, Users, Star, Smile, Search, SlidersHorizontal, Calculator, Clock, GitCompareArrows, StepForward, FileDown, BookUser, Link as LinkIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

function getIcon(iconName: string) {
    switch (iconName) {
        case 'TrendingUp': return TrendingUp;
        case 'HelpCircle': return HelpCircle;
        case 'StepForward': return StepForward;
        case 'BarChart2': return BarChart2;
        case 'SlidersHorizontal': return SlidersHorizontal;
        case 'Clock': return Clock;
        case 'Smile': return Smile;
        case 'CheckCircle': return CheckCircle;
        case 'Search': return Search;
        case 'GitCompareArrows': return GitCompareArrows;
        case 'BookUser': return BookUser;
        case 'Star': return Star;
        default: return Lightbulb;
    }
}

export default function LicPremiumCalculatorPageClient({
  params,
  dictionary,
  pageDict,
}: {
  params: { lang: Locale };
  dictionary: Dictionary;
  pageDict: any;
}) {

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${params.lang}/lic-premium-calculator`;

  const faqSection = pageDict.article?.sections?.find((s:any) => s.id === 'faq' || s.content?.some((c:any) => c.type === 'faq'));
  const faqContent = faqSection ? faqSection.content?.find((c: any) => c.type === 'faq') : null;
  const faqs = faqContent ? faqContent.items.map((f: any) => ({ question: f.q, answer: f.a })) : [];

  const ArticleContent = () => (
    <div className="mt-12 space-y-8 print-hide">
      {pageDict.article.sections.map((section: any, index: number) => {
        if (!section.content || section.id === 'faq' || section.content.some((c:any) => c.type === 'faq')) return null;
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
                    return <div key={idx} className="text-muted-foreground mb-4" dangerouslySetInnerHTML={{ __html: item.text.replace(/{lang}/g, params.lang) }}></div>;
                  case 'list':
                    return (
                      <ul key={idx} className="list-disc pl-5 space-y-2 text-muted-foreground">
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
                                    <div className="mt-2 text-muted-foreground" dangerouslySetInnerHTML={{__html: example.body.replace(/{lang}/g, params.lang)}}></div>
                                </div>
                            ))}
                        </div>
                    );
                 case 'link':
                    return (
                        <a key={idx} href={item.href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-2 mt-2">
                            <LinkIcon className="h-4 w-4" />
                            {item.text}
                        </a>
                    )
                  default:
                    return null;
                }
              })}
            </CardContent>
          </Card>
        );
      })}
       <Card className="shadow-lg mt-8 bg-primary/10 border-primary/20">
        <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <Star className="h-8 w-8 text-primary"/>
                <h2 className="text-2xl font-bold">{pageDict.article.conclusion?.title || 'Conclusion'}</h2>
            </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground" dangerouslySetInnerHTML={{__html: (pageDict.article.conclusion?.body || '').replace(/{lang}/g, params.lang)}}></div>
           <footer className="disclaimer mt-8 text-center">
            <div className="text-sm"><strong dangerouslySetInnerHTML={{__html: (pageDict.article.disclaimer || '').replace(/{lang}/g, params.lang)}} /></div>
          </footer>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <CalculatorPageLayout
      lang={params.lang}
      dictionary={dictionary}
      pageDict={pageDict}
      h1={pageDict.h1}
      description={pageDict.description}
      lastUpdated="August 2026"
      calculator={
        <div id="calculator-widget">
          <LicPremiumCalculator dictionary={pageDict} />
        </div>
      }
      faqs={faqs}
      faqTitle="Frequently Asked Questions (FAQs)"
      pageUrl={pageUrl}
    >
      <ArticleContent />
    </CalculatorPageLayout>
  );
}

    