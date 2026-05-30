
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import LicJeevanAnandCalculatorPageClient from "./LicJeevanAnandCalculatorPageClient";
import { buildAlternates, buildOpenGraph, buildTwitterCard } from '@/lib/seo';

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
    const { lang } = await params;
    const pageDict = (await import(`@/dictionaries/${lang}/lic-jeevan-anand-calculator.json`)).default;
    const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
    const pageUrl = `${siteUrl}/${lang}/lic-jeevan-anand-calculator`;



    const howToSchema = {
        "@context":"https://schema.org",
        "@type":"HowTo",
        "name":"How to use the LIC Jeevan Anand calculator",
        "step":[
          {"@type":"HowToStep","name":"Choose plan preset","text":"Select 'New Jeevan Anand (Plan 715)' to auto-fill PPT and typical bonus ranges."},
          {"@type":"HowToStep","name":"Enter policy details","text":"Input sum assured, policy term, date of birth, annual premium (if asked), bonus per ₹1,000 SA and FAB."},
          {"@type":"HowToStep","name":"Click Calculate","text":"View estimated premium, maturity, IRR, paid-up and surrender values. Download PDF if required."}
        ]
      };
    
    const articleSchema = {
      "@context":"https://schema.org",
      "@type":"Article",
      "headline":"LIC Jeevan Anand Calculator (Plan 715) — Estimate Premium, Maturity & Surrender",
      "author":{"@type":"Person","name":"Mahesh Chaube, CFP"},
      "publisher":{"@type":"Organization","name":"BharatSaver","logo":{"@type":"ImageObject","url":"https://bharatsaver.com/logo.png"}},
      "datePublished":"2025-09-23",
      "dateModified":"2025-09-23",
      "reviewedBy": { "@type": "Person", "name": "Laveena Vijayi", "jobTitle": "Senior Financial Research Analyst, BharatSaver" }
    };

    return {
        title: "LIC Jeevan Anand Calculator (Plan 715) — Premium, Maturity & Surrender Estimates",
        description: "Use our free LIC Jeevan Anand calculator (Plan 715) to estimate premiums, maturity, surrender and paid-up values. Includes worked examples, bonus & FAB inputs, PDF download.",
        alternates: {
            canonical: pageUrl,
            languages: i18nConfig.locales.reduce((acc, locale) => {
                acc[locale] = `${siteUrl}/${locale}/lic-jeevan-anand-calculator`;
                return acc;
            }, {} as Record<string, string>),
        },
        other: {
            'application/ld+json': JSON.stringify([howToSchema, articleSchema]),
        },
    };
}


export default async function LicJeevanAnandCalculatorPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);
    const pageDict = (await import(`@/dictionaries/${lang}/lic-jeevan-anand-calculator.json`).catch(() => import(`@/dictionaries/en/lic-jeevan-anand-calculator.json`))).default;
    const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
    const pageUrl = `${siteUrl}/${lang}/lic-jeevan-anand-calculator`;


    
    return (
        <>
            <LicJeevanAnandCalculatorPageClient 
                params={{ lang }}
                dictionary={dictionary}
                pageDict={pageDict}
            />
        </>
    );
}
