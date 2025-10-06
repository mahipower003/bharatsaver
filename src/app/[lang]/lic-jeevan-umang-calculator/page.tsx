
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import LicJeevanUmangCalculatorPageClient from "./LicJeevanUmangCalculatorPageClient";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
    const pageDict = (await import(`@/dictionaries/${params.lang}/lic-jeevan-umang-calculator.json`).catch(() => import(`@/dictionaries/en/lic-jeevan-umang-calculator.json`))).default;
    const siteUrl = 'https://bharatsaver.com';
    const pageUrl = `${siteUrl}/${params.lang}/lic-jeevan-umang-calculator`;
    const ogImageUrl = `${siteUrl}/images/lic-jeevan-umang-calculator.png`;

    const faqSchema = pageDict.faq_json_ld;
    const productSchema = {
        "@context": "https://schema.org",
        "@type": "FinancialProduct",
        "name": "LIC Jeevan Umang (Plan 945)",
        "description": "A participating whole-life plan that provides annual survival benefits after the premium paying term and a lump sum on maturity or death.",
        "brand": {
            "@type": "Brand",
            "name": "LIC of India"
        },
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
                acc[locale] = `${siteUrl}/${locale}/lic-jeevan-umang-calculator`;
                return acc;
            }, {} as Record<string, string>),
        },
        openGraph: {
          title: pageDict.og_title,
          description: pageDict.og_description,
          url: pageUrl,
          images: [{ url: ogImageUrl, width: 1200, height: 630, alt: 'LIC Jeevan Umang Calculator' }],
          locale: params.lang === 'en' ? 'en_IN' : params.lang,
          type: 'website',
        },
        other: {
            'application/ld+json': JSON.stringify([faqSchema, productSchema]),
        },
    };
}


export default async function JeevanUmangCalculatorPage({ params }: { params: { lang: Locale }}) {
    const dictionary = await getDictionary(params.lang);
    const pageDict = (await import(`@/dictionaries/${params.lang}/lic-jeevan-umang-calculator.json`).catch(() => import(`@/dictionaries/en/lic-jeevan-umang-calculator.json`))).default;
    
    return (
        <LicJeevanUmangCalculatorPageClient 
            params={params}
            dictionary={dictionary}
            pageDict={pageDict}
        />
    );
}

