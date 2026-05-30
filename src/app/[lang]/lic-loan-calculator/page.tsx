import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import LicLoanCalculatorPageClient from "./LicLoanCalculatorPageClient";
import { buildAlternates, buildOpenGraph, buildTwitterCard } from '@/lib/seo';

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
    const { lang } = await params;
    const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
    const pageUrl = `/${lang}/lic-loan-calculator`;
    
    // We are fetching the english dictionary specifically, as it contains the most complete data for schema.
    const pageDict = (await import(`@/dictionaries/en/lic-loan-calculator.json`)).default;

    const faqSection = pageDict.sections.find((s:any) => s.id === 'faq');

    return {
        title: pageDict.meta_title || pageDict.h1,
        description: pageDict.meta_description || pageDict.description,
        alternates: {
            canonical: pageUrl,
            languages: i18nConfig.locales.reduce((acc, locale) => {
                acc[locale] = `${siteUrl}/${locale}/lic-loan-calculator`;
                return acc;
            }, {} as Record<string, string>),
        },
    };
}

export default async function LicLoanCalculatorPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);
    
    // Fallback to english dictionary if the translation is not available for this page
    const pageDict = (await import(`@/dictionaries/${lang}/lic-loan-calculator.json`).catch(() => import(`@/dictionaries/en/lic-loan-calculator.json`))).default;
    
    return (
        <LicLoanCalculatorPageClient 
            params={{ lang }}
            dictionary={dictionary}
            pageDict={pageDict}
        />
    );
}
