
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import LicJeevanLabhCalculatorPageClient from "./LicJeevanLabhCalculatorPageClient";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
    const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
    const pageUrl = `${siteUrl}/${params.lang}/lic-jeevan-labh-calculator`;
    const pageDict = (await import(`@/dictionaries/${params.lang}/lic-jeevan-labh-calculator.json`)).default;

    const faqItems = pageDict.article.sections.find((s: any) => s.id === 'faq')?.content.find((c: any) => c.type === 'faq')?.items || [];
    const faqSchema = {
      "@context":"https://schema.org",
      "@type":"FAQPage",
      "mainEntity": faqItems.map((faq: { q: string, a: string }) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a.replace(/<[^>]*>/g, ''), // Strip HTML for clean text
        },
      })),
    };
    
    const howToSteps = pageDict.article.sections.find((s: any) => s.id === 'how-to-use')?.content.find((c: any) => c.type === 'steps')?.items || [];
    const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Use the LIC Jeevan Labh Calculator",
        "description": "A step-by-step guide to calculating your premium and maturity benefits for LIC Jeevan Labh Plan 936.",
        "step": howToSteps.map((step: { title: string, description: string }, index: number) => ({
            "@type": "HowToStep",
            "name": `Step ${index + 1}: ${step.title}`,
            "text": step.description
        }))
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
            'application/ld+json': JSON.stringify([faqSchema, howToSchema, financialProductSchema]),
        },
    };
}


export default async function LicJeevanLabhCalculatorPage({ params }: { params: { lang: Locale }}) {
    const dictionary = await getDictionary(params.lang);
    const pageDict = (await import(`@/dictionaries/${params.lang}/lic-jeevan-labh-calculator.json`)).default;
    const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
    const pageUrl = `${siteUrl}/${params.lang}/lic-jeevan-labh-calculator`;

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/${params.lang}` },
          { '@type': 'ListItem', position: 2, name: 'Calculators', item: `${siteUrl}/${params.lang}/calculators` },
          { '@type': 'ListItem', position: 3, name: 'LIC Premium Calculator', item: `${siteUrl}/${params.lang}/lic-premium-calculator` },
          { '@type': 'ListItem', position: 4, name: 'LIC Jeevan Labh Calculator', item: pageUrl },
        ],
    };
    
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            <LicJeevanLabhCalculatorPageClient 
                params={params}
                dictionary={dictionary}
                pageDict={pageDict}
            />
        </>
    );
}
