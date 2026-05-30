
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import LicSinglePremiumEndowmentCalculatorPageClient from "./LicSinglePremiumEndowmentCalculatorPageClient";
import { buildAlternates, buildOpenGraph, buildTwitterCard } from '@/lib/seo';

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
    const { lang } = await params;
    const pageDict = (await import(`@/dictionaries/${lang}/lic-single-premium-endowment-calculator.json`)).default;
    const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
    const pageUrl = `${siteUrl}/${lang}/lic-single-premium-endowment-calculator`;

    return {
        title: pageDict.meta_title,
        description: pageDict.meta_description,
        alternates: {
            canonical: pageUrl,
            languages: i18nConfig.locales.reduce((acc, locale) => {
                acc[locale] = `${siteUrl}/${locale}/lic-single-premium-endowment-calculator`;
                return acc;
            }, {} as Record<string, string>),
        },
    };
}


export default async function LicSinglePremiumEndowmentCalculatorPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);
    const pageDict = (await import(`@/dictionaries/${lang}/lic-single-premium-endowment-calculator.json`)).default;
    
    return (
        <LicSinglePremiumEndowmentCalculatorPageClient 
            params={{ lang }}
            dictionary={dictionary}
            pageDict={pageDict}
        />
    );
}

