
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import LicSinglePremiumEndowmentCalculatorPageClient from "./LicSinglePremiumEndowmentCalculatorPageClient";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
    const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
    const pageUrl = `${siteUrl}/${params.lang}/lic-single-premium-endowment-calculator`;
    const pageDict = (await import(`@/dictionaries/${params.lang}/lic-single-premium-endowment-calculator.json`)).default;

    const faqItems = pageDict.article.sections.find((s:any) => s.id === 'faq')?.content[0]?.items ?? [];
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
    
    const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Use LIC Single Premium Endowment Calculator",
        "step": [
            {"@type": "HowToStep", "name": "Enter Basic Details", "text": "Provide your age and desired sum assured."},
            {"@type": "HowToStep", "name": "Select Term", "text": "Choose your desired policy term (10 to 25 years)."},
            {"@type": "HowToStep", "name": "Click 'Calculate'", "text": "Our calculator instantly shows your one-time premium, including GST, and the estimated maturity benefits."},
            {"@type": "HowToStep", "name": "View Your Projected Returns", "text": "Check your total maturity amount, including bonuses, to understand the plan's potential."}
        ]
    };
    
    const financialProductSchema = {
        "@context": "https://schema.org",
        "@type": "FinancialProduct",
        "name": "LIC Single Premium Endowment Plan (Plan No. 917/717)",
        "description": "A single premium, non-linked, with-profits endowment plan offering a combination of savings and protection.",
        "brand": {
            "@type": "Brand",
            "name": "LIC of India"
        },
        "identifier": "512N283V03", // UIN of the plan
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
                acc[locale] = `${siteUrl}/${locale}/lic-single-premium-endowment-calculator`;
                return acc;
            }, {} as Record<string, string>),
        },
        other: {
            'application/ld+json': JSON.stringify([faqSchema, howToSchema, financialProductSchema]),
        },
    };
}


export default async function LicSinglePremiumEndowmentCalculatorPage({ params }: { params: { lang: Locale }}) {
    const dictionary = await getDictionary(params.lang);
    const pageDict = (await import(`@/dictionaries/${params.lang}/lic-single-premium-endowment-calculator.json`)).default;
    
    return (
        <LicSinglePremiumEndowmentCalculatorPageClient 
            params={params}
            dictionary={dictionary}
            pageDict={pageDict}
        />
    );
}
