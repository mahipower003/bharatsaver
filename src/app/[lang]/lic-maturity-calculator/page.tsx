
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import LicMaturityCalculatorPageClient from "./LicMaturityCalculatorPageClient";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
    const { lang } = await params;
    const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
    const pageUrl = `${siteUrl}/lic-calculators/tools/maturity-calculator`;
    const pageDict = (await import(`@/dictionaries/${lang}/lic-maturity-calculator.json`)).default;

    const articleSchema = {
      "@context":"https://schema.org",
      "@type":"Article",
      "mainEntityOfPage":{"@type":"WebPage","@id":"https://bharatsaver.com/lic-calculators/tools/maturity-calculator"},
      "headline":"LIC Maturity Calculator (2026) – Calculate Returns with Bonus",
      "description":"Use LIC maturity calculator to check returns, bonus & final amount. Includes formula, examples & accurate results.",
      "author":{"@type":"Person","name":"Mahesh Chaube, CFP","url":"https://bharatsaver.com/author/mahesh-chaube"},
      "publisher":{"@type":"Organization","name":"BharatSaver","logo":{"@type":"ImageObject","url":"https://bharatsaver.com/icon.svg"}},
      "datePublished":"2025-09-01",
      "dateModified":"2026-05-16",
      "reviewedBy": {
        "@type": "Person",
        "name": "Laveena Vijayi",
        "jobTitle": "Senior Financial Research Analyst"
      }
    };

    const faqSection = pageDict.sections.find((s: any) => s.id === 'faq');
    const faqSchema = faqSection ? {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqSection.content[0].items.map((item: any) => ({
        "@type": "Question",
        "name": item.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.a
        }
      }))
    } : null;

    return {
        title: "LIC Maturity Calculator (2026) – Calculate Returns with Bonus",
        description: "Use LIC maturity calculator to check returns, bonus & final amount. Includes formula, examples & accurate results.",
        alternates: {
            canonical: pageUrl,
            languages: i18nConfig.locales.reduce((acc, locale) => {
                acc[locale] = `${siteUrl}/${locale}/lic-maturity-calculator`;
                return acc;
            }, {} as Record<string, string>),
        },
        other: {
          'application/ld+json': JSON.stringify(faqSchema ? [articleSchema, faqSchema] : articleSchema)
        }
    };
}


export default async function LicMaturityCalculatorPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);
    const pageDict = (await import(`@/dictionaries/${lang}/lic-maturity-calculator.json`)).default;
    
    return (
        <LicMaturityCalculatorPageClient 
            params={{ lang }}
            dictionary={dictionary}
            pageDict={pageDict}
        />
    );
}
