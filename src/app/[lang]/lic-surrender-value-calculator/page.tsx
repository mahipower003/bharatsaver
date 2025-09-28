
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import LicSurrenderValueCalculatorPageClient from "./LicSurrenderValueCalculatorPageClient";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
    const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
    const pageUrl = `${siteUrl}/${params.lang}/lic-surrender-value-calculator`;
    // We are fetching the english dictionary specifically, as it contains the most complete data for schema.
    const pageDict = (await import(`@/dictionaries/en/lic-surrender-value-calculator.json`)).default;

    const faqItems = pageDict.sections.find((s:any) => s.id === 'faq')?.content[0]?.items ?? [];
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqItems.map((faq: {q: string; a: string}) => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a.replace(/<[^>]*>/g, '') // Strip HTML for schema
        }
      }))
    };

    const howToSteps = pageDict.sections.find((s:any) => s.id === 'how-to-surrender')?.content[1]?.items ?? [];
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

    return {
        title: "LIC Surrender Value Calculator – Estimate Your Policy’s Cash Value & Guide 2025",
        description: "Calculate your LIC policy’s surrender value instantly with our online calculator. Learn how surrender value is computed, when to surrender, tax impact, FAQs and more on this comprehensive guide.",
        alternates: {
            canonical: pageUrl,
            languages: i18nConfig.locales.reduce((acc, locale) => {
                acc[locale] = `${siteUrl}/${locale}/lic-surrender-value-calculator`;
                return acc;
            }, {} as Record<string, string>),
        },
        other: {
            'application/ld+json': JSON.stringify([faqSchema, howToSchema]),
        },
    };
}


export default async function LicSurrenderValueCalculatorPage({ params }: { params: { lang: Locale }}) {
    const dictionary = await getDictionary(params.lang);
    // Fallback to english dictionary if the translation is not available for this page
    const pageDict = (await import(`@/dictionaries/${params.lang}/lic-surrender-value-calculator.json`).catch(() => import(`@/dictionaries/en/lic-surrender-value-calculator.json`))).default;
    
    return (
        <LicSurrenderValueCalculatorPageClient 
            params={params}
            dictionary={dictionary}
            pageDict={pageDict}
        />
    );
}
