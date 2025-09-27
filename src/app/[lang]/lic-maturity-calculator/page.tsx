
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import LicMaturityCalculatorPageClient from "./LicMaturityCalculatorPageClient";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
    const pageDict = (await import(`@/dictionaries/${params.lang}/lic-maturity-calculator.json`)).default;
    const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
    const pageUrl = `${siteUrl}/${params.lang}/lic-maturity-calculator`;

    return {
        title: pageDict.meta_title,
        description: pageDict.meta_description,
        alternates: {
            canonical: pageUrl,
            languages: i18nConfig.locales.reduce((acc, locale) => {
                acc[locale] = `${siteUrl}/${locale}/lic-maturity-calculator`;
                return acc;
            }, {} as Record<string, string>),
        },
    };
}


export default async function LicMaturityCalculatorPage({ params }: { params: { lang: Locale }}) {
    const dictionary = await getDictionary(params.lang);
    const pageDict = (await import(`@/dictionaries/${params.lang}/lic-maturity-calculator.json`)).default;
    
    return (
        <LicMaturityCalculatorPageClient 
            params={params}
            dictionary={dictionary}
            pageDict={pageDict}
        />
    );
}

