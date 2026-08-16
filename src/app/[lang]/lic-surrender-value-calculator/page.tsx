

import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import LicSurrenderValueCalculatorPageClient from "./LicSurrenderValueCalculatorPageClient";
import { buildAlternates, buildOpenGraph, buildTwitterCard } from '@/lib/seo';

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
    const { lang } = await params;
    const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
    const pageUrl = `/${lang}/lic-surrender-value-calculator`;
    // We are fetching the english dictionary specifically, as it contains the most complete data for schema.
    const pageDict = (await import(`@/dictionaries/en/lic-surrender-value-calculator.json`)).default;


    const howToSection = pageDict.sections.find((s:any) => s.id === 'how-to-surrender');
    const howToSteps = (howToSection?.content.find((c: any) => c.type === 'list') as any)?.items ?? [];

    const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Surrender an LIC Policy",
        "step": howToSteps.map((stepText: string, index: number) => ({
            "@type": "HowToStep",
            "name": `Step ${index + 1}`,
            "text": stepText.replace(/<strong>/g, '').replace(/<\/strong>/g, '')
        }))
    };

    const articleSchema = {
      "@context":"https://schema.org",
      "@type":"Article",
      "mainEntityOfPage":{"@type":"WebPage","@id":`${siteUrl}${pageUrl}`},
      "headline":"LIC Surrender Value Calculator (2026) – Check Guaranteed & Special Value",
      "description":"Calculate your LIC surrender value instantly. See your Guaranteed Surrender Value (GSV) vs Special Surrender Value (SSV), formulas, and early exit penalties.",
      "author":{"@type":"Person","name":"Mahesh Chaube, CFP","url":"https://bharatsaver.com/author/mahesh-chaube"},
      "publisher":{"@type":"Organization","name":"BharatSaver","logo":{"@type":"ImageObject","url":"https://bharatsaver.com/icon.svg"}},
      "datePublished":"2025-09-01",
      "dateModified": "2026-08-16",
      "reviewedBy": {
        "@type": "Person",
        "name": "Laveena Vijayi",
        "jobTitle": "Senior Financial Research Analyst"
      }
    };

    return {
        title: "LIC Surrender Value Calculator (2026) – Check Guaranteed & Special Value",
        description: "Calculate your LIC surrender value instantly. See your Guaranteed Surrender Value (GSV) vs Special Surrender Value (SSV), formulas, and early exit penalties.",
        alternates: {
            canonical: pageUrl,
            languages: i18nConfig.locales.reduce((acc, locale) => {
                acc[locale] = `${siteUrl}/${locale}/lic-surrender-value-calculator`;
                return acc;
            }, {} as Record<string, string>),
        },
        other: {
            'application/ld+json': [JSON.stringify(howToSchema), JSON.stringify(articleSchema)],
        },
    };
}


export default async function LicSurrenderValueCalculatorPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);
    // Fallback to english dictionary if the translation is not available for this page
    const pageDict = (await import(`@/dictionaries/${lang}/lic-surrender-value-calculator.json`).catch(() => import(`@/dictionaries/en/lic-surrender-value-calculator.json`))).default;
    
    return (
        <LicSurrenderValueCalculatorPageClient 
            params={{ lang }}
            dictionary={dictionary}
            pageDict={pageDict}
        />
    );
}
