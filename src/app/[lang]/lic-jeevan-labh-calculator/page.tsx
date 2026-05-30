
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import LicJeevanLabhCalculatorPageClient from "./LicJeevanLabhCalculatorPageClient";
import { buildAlternates, buildOpenGraph, buildTwitterCard } from '@/lib/seo';

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
    const { lang } = await params;
    const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
    const pageUrl = `${siteUrl}/${lang}/lic-jeevan-labh-calculator`;
    const pageDict = (await import(`@/dictionaries/${lang}/lic-jeevan-labh-calculator.json`)).default;


    
    const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Use LIC Jeevan Labh Premium Calculator",
        "step": [
            {"@type": "HowToStep", "name": "Enter Basic Details", "text": "Provide your age and desired sum assured."},
            {"@type": "HowToStep", "name": "Select Term & PPT", "text": "Choose policy term (16, 21, 25 years)."},
            {"@type": "HowToStep", "name": "Click Calculate", "text": "Our calculator shows premium including GST and maturity estimate."},
            {"@type": "HowToStep", "name": "View Results", "text": "Check yearly/monthly premium, total paid, and estimated maturity."}
        ]
    };
    
    const financialProductSchema = {
        "@context": "https://schema.org",
        "@type": "FinancialProduct",
        "name": "LIC Jeevan Labh (Plan No. 936)",
        "description": "A non-linked, with-profits, limited premium payment endowment plan from LIC of India.",
        "brand": {
            "@type": "Brand",
            "name": "LIC of India"
        },
        "identifier": "512N304V02", // UIN of the plan
        "url": pageUrl,
        "offers": {
            "@type": "Offer",
            "priceCurrency": "INR"
        }
    };

    return {
        title: pageDict.meta_title,
        description: pageDict.meta_description,
        alternates: {
            canonical: pageUrl,
            languages: i18nConfig.locales.reduce((acc, locale) => {
                acc[locale] = `${siteUrl}/${locale}/lic-jeevan-labh-calculator`;
                return acc;
            }, {} as Record<string, string>),
        },
        other: {
            'application/ld+json': JSON.stringify([howToSchema, financialProductSchema]),
        },
    };
}


export default async function LicJeevanLabhCalculatorPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);
    const pageDict = { ...(await import(`@/dictionaries/${lang}/lic-jeevan-labh-calculator.json`)).default };
    const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
    const pageUrl = `${siteUrl}/${lang}/lic-jeevan-labh-calculator`;


    
    return (
        <>
            <LicJeevanLabhCalculatorPageClient 
                params={{ lang }}
                dictionary={dictionary}
                pageDict={pageDict}
            />
        </>
    );
}
