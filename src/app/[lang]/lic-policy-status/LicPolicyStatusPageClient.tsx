'use client';

import type { Dictionary } from "@/lib/types";
import type { Locale } from "@/lib/i18n-config";
import { CalculatorPageLayout } from "@/components/layout/CalculatorPageLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { ShieldCheck, Users, Smartphone, HelpCircle, FileText, AlertTriangle, CheckCircle } from "lucide-react";

function getIcon(iconName: string) {
    const icons: { [key: string]: React.ElementType } = {
        ShieldCheck, Users, Smartphone, HelpCircle, FileText, AlertTriangle, CheckCircle
    };
    return icons[iconName] || HelpCircle;
}

const ContentRenderer = ({ content, lang }: { content: any[]; lang: Locale }) => {
    if (!content) return null;
    return (
        <div className="space-y-4">
            {content.map((item, idx) => {
                switch (item.type) {
                    case 'paragraph':
                        return <div key={idx} className="prose dark:prose-invert max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: item.text.replace(/{lang}/g, lang) }} />;
                    case 'list':
                        return <ul key={idx} className="list-disc pl-5 space-y-2 text-muted-foreground">
                            {item.items.map((li: string, liIdx: number) => <li key={liIdx} dangerouslySetInnerHTML={{ __html: li.replace(/{lang}/g, lang) }} />)}
                        </ul>;
                    case 'table':
                        return <div key={idx} className="overflow-x-auto rounded-lg border">
                            <Table>
                                <TableHeader><TableRow className="bg-muted/50">{item.headers.map((h: string, hIdx: number) => <TableHead key={hIdx} className="font-semibold">{h}</TableHead>)}</TableRow></TableHeader>
                                <TableBody>{item.rows.map((row: (string | number)[], rIdx: number) => <TableRow key={rIdx} className="hover:bg-muted/30">{row.map((cell: string | number, cIdx: number) => <TableCell key={cIdx} dangerouslySetInnerHTML={{ __html: String(cell).replace(/{lang}/g, lang) }} />)}</TableRow>)}</TableBody>
                            </Table>
                            {item.footer && <div className="text-xs text-muted-foreground mt-2 px-4 pb-3 italic" dangerouslySetInnerHTML={{ __html: item.footer }} />}
                        </div>;
                    case 'cta_card':
                        return (
                            <Card key={idx} className="bg-primary/10 border-primary/20 text-center p-6">
                                <CardTitle className="text-xl font-bold">{item.title}</CardTitle>
                                <CardDescription className="mt-2">{item.description}</CardDescription>
                                <div className="mt-4 flex gap-4 justify-center flex-wrap">
                                    {item.buttons.map((button: any, btnIdx: number) => (
                                        <Button key={btnIdx} asChild>
                                            <Link href={`/${lang}${button.href}`}>{button.text}</Link>
                                        </Button>
                                    ))}
                                </div>
                            </Card>
                        );
                    case 'structured_content':
                        return <div key={idx} className="space-y-4">
                            {item.items.map((subItem: { title: string; text: string }, subIdx: number) => (
                                <div key={subIdx}>
                                    <h3 className="font-semibold text-lg" dangerouslySetInnerHTML={{ __html: subItem.title }} />
                                    <div className="prose dark:prose-invert max-w-none text-muted-foreground mt-1" dangerouslySetInnerHTML={{ __html: subItem.text.replace(/{lang}/g, lang) }} />
                                </div>
                            ))}
                        </div>;
                    case 'faq':
                        return (
                            <Accordion key={idx} type="single" collapsible className="w-full">
                                {item.items.map((faq: { q: string; a: string }, qIdx: number) => (
                                    <AccordionItem key={qIdx} value={`faq-inline-${qIdx}`}>
                                        <AccordionTrigger className="text-left font-semibold">{faq.q}</AccordionTrigger>
                                        <AccordionContent>
                                            <div className="prose dark:prose-invert max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: faq.a.replace(/{lang}/g, lang) }} />
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        );
                    default:
                        return null;
                }
            })}
        </div>
    );
};

export default function LicPolicyStatusPageClient({
    params,
    dictionary,
    pageDict,
    breadcrumbSchema,
}: {
    params: { lang: Locale };
    dictionary: Dictionary;
    pageDict: any;
    breadcrumbSchema?: object;
}) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bharatsaver.com';
    const pageUrl = `${siteUrl}/${params.lang}/lic-policy-status`;

    const faqSection = pageDict.sections.find((s: any) => s.id === 'faq');
    const faqs = faqSection
        ? faqSection.content.find((c: any) => c.type === 'faq')?.items.map((f: any) => ({ question: f.q, answer: f.a }))
        : [];

    return (
        <CalculatorPageLayout
            lang={params.lang}
            dictionary={dictionary}
            pageDict={pageDict}
            h1={pageDict.h1}
            description={pageDict.byline || ""}
            lastUpdated="May 16, 2026"
            calculator={null}
            faqs={faqs}
            faqTitle="Frequently Asked Questions"
            pageUrl={pageUrl}
        >
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
                                <ContentRenderer content={section.content} lang={params.lang} />
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </CalculatorPageLayout>
    );
}
