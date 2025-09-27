
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import LicMaturityCalculatorPageClient from "./LicMaturityCalculatorPageClient";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
    const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
    const pageUrl = "https://bharatsaver.com/lic-calculators/tools/maturity-calculator";

    const articleSchema = {
      "@context":"https://schema.org",
      "@type":"Article",
      "mainEntityOfPage":{"@type":"WebPage","@id":"https://bharatsaver.com/lic-calculators/tools/maturity-calculator"},
      "headline":"LIC Maturity Calculator — Estimate Your LIC Policy Maturity Instantly",
      "description":"Free LIC maturity calculator to estimate maturity, surrender and paid-up values for LIC plans. Includes worked examples, bonus history and surrender formulas.",
      "author":{"@type":"Person","name":"Mahesh Chaube, CFP","url":"https://bharatsaver.com/author/mahesh-chaube"},
      "publisher":{"@type":"Organization","name":"BharatSaver","logo":{"@type":"ImageObject","url":"https://bharatsaver.com/logo.png"}},
      "datePublished":"2025-09-01",
      "dateModified":"2025-09-23"
    };

    return {
        title: "LIC Maturity Calculator — Calculate Your LIC Policy Maturity Online (Free)",
        description: "Use our free LIC maturity calculator to estimate maturity, surrender and paid-up values for LIC plans. Enter sum assured, term, bonus rate & get instant downloadable results.",
        alternates: {
            canonical: pageUrl,
            languages: i18nConfig.locales.reduce((acc, locale) => {
                acc[locale] = `${siteUrl}/${locale}/lic-maturity-calculator`;
                return acc;
            }, {} as Record<string, string>),
        },
        other: {
          'application/ld+json': JSON.stringify(articleSchema)
        }
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
