
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import LicJeevanUmangCalculatorPageClient from "./LicJeevanUmangCalculatorPageClient";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
    const { lang } = await params;
    const pageDict = (await import(`@/dictionaries/${lang}/lic-jeevan-umang-calculator.json`).catch(() => import(`@/dictionaries/en/lic-jeevan-umang-calculator.json`))).default;
    const siteUrl = 'https://bharatsaver.com';
    const pageUrl = `${siteUrl}/${lang}/lic-jeevan-umang-calculator`;
    const ogImageUrl = `${siteUrl}/images/lic-jeevan-umang-calculator.png`;

    const schemas = [];
    if (pageDict.how_to_schema) schemas.push(pageDict.how_to_schema);
    if (pageDict.financial_product_schema) schemas.push({
        ...pageDict.financial_product_schema,
        url: pageUrl
    });


    return {
        title: pageDict.meta_title,
        description: pageDict.meta_description,
        alternates: {
            canonical: pageUrl,
            languages: i18nConfig.locales.reduce((acc, locale) => {
                acc[locale] = `${siteUrl}/${locale}/lic-jeevan-umang-calculator`;
                return acc;
            }, {} as Record<string, string>),
        },
        openGraph: {
          title: pageDict.og_title,
          description: pageDict.og_description,
          url: pageUrl,
          images: [{ url: ogImageUrl, width: 1200, height: 630, alt: 'LIC Jeevan Umang Calculator' }],
          locale: lang === 'en' ? 'en_IN' : lang,
          type: 'website',
        },
        other: {
            'application/ld+json': JSON.stringify(schemas),
        },
    };
}


export default async function JeevanUmangCalculatorPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);
    const pageDict = { ...(await import(`@/dictionaries/${lang}/lic-jeevan-umang-calculator.json`).catch(() => import(`@/dictionaries/en/lic-jeevan-umang-calculator.json`))).default };
    
    return (
        <LicJeevanUmangCalculatorPageClient 
            params={{ lang }}
            dictionary={dictionary}
            pageDict={pageDict}
        />
    );
}
