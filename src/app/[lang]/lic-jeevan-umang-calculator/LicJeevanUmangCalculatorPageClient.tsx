'use client';

import type { Dictionary } from "@/lib/types";
import type { Locale } from "@/lib/i18n-config";
import { LicJeevanUmangCalculator } from "@/components/calculators/LicJeevanUmangCalculator";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from 'next/link';
import { BarChart, FileText, CheckCircle, SlidersHorizontal, GitCompareArrows, AlertTriangle, Users, BookUser, Star, HelpCircle, UserCheck, Calculator, Landmark, Video } from "lucide-react";
import { LicUmangPremiumChart } from "@/components/calculators/LicUmangPremiumChart";
import { CalculatorPageLayout } from "@/components/layout/CalculatorPageLayout";

function getIcon(iconName: string) {
  const icons: { [key: string]: React.ElementType } = {
    BarChart, FileText, CheckCircle, SlidersHorizontal, GitCompareArrows,
    AlertTriangle, Users, BookUser, Star, HelpCircle, UserCheck, Calculator, Landmark, Video
  };
  return icons[iconName] || HelpCircle;
}

const ContentRenderer = ({ content, lang, pageDict }: { content: any[], lang: Locale, pageDict: any }) => {
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
            </Table>{item.footer && <div className="text-xs text-muted-foreground mt-2 italic" dangerouslySetInnerHTML={{ __html: item.footer.replace(/{lang}/g, lang) }}></div>}</div>;
          case 'faq':
            if (!item.items) return null;
            return <Accordion key={idx} type="single" collapsible className="w-full">
              {item.items.map((faq: {q: string; a: string}, qIdx: number) => (
                <AccordionItem key={qIdx} value={`item-${qIdx}`}>
                  <AccordionTrigger>{faq.q}</AccordionTrigger>
                  <AccordionContent><div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{__html: faq.a.replace(/{lang}/g, lang)}} /></AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>;
          case 'structured_content':
            return (
              <div key={idx} className="space-y-4">
                {item.heading && <h3 className="text-xl font-semibold" dangerouslySetInnerHTML={{ __html: item.heading.replace(/{lang}/g, lang) }} />}
                {item.body && <div className="prose dark:prose-invert max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: item.body.replace(/{lang}/g, lang) }} />}
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

  const siteUrl = 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${params.lang}/lic-jeevan-umang-calculator`;
  
  const faqSection = pageDict.sections.find((s: any) => s.id === 'faq');
  const faqs = faqSection ? faqSection.content.find((c: any) => c.type === 'faq')?.items.map((f: any) => ({ question: f.q, answer: f.a })) : [];

  return (
    <CalculatorPageLayout
      lang={params.lang}
      dictionary={dictionary}
      pageDict={pageDict}
      h1={pageDict.h1}
      description={`${pageDict.intro.quick_answer}<br/><br/><a href="#calculator-widget" class="inline-block px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-md shadow-md hover:bg-primary/90 transition-colors">${pageDict.intro.cta_button}</a>`}
      lastUpdated="August 2026"
      calculator={
        <div id="calculator-widget">
          <h2 className="text-2xl font-bold text-center mb-4">{pageDict.calculator_ui.h2}</h2>
          <LicJeevanUmangCalculator dictionary={pageDict.calculator_ui} />
        </div>
      }
      faqs={faqs}
      faqTitle="Frequently Asked Questions (FAQs)"
      pageUrl={pageUrl}
    >
      <div className="mt-12 space-y-8">
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
                <ContentRenderer content={section.content} lang={params.lang} pageDict={pageDict}/>
              </CardContent>
            </Card>
          )
        })}

        {pageDict.related_calculators && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Calculator className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-bold">{pageDict.related_calculators.title}</h2>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
    </CalculatorPageLayout>
  );
}
