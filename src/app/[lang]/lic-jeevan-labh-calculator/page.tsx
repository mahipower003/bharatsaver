
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import LicJeevanLabhCalculatorPageClient from "./LicJeevanLabhCalculatorPageClient";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
    const { lang } = await params;
    const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
    const pageUrl = `${siteUrl}/${lang}/lic-jeevan-labh-calculator`;
    const pageDict = (await import(`@/dictionaries/${lang}/lic-jeevan-labh-calculator.json`)).default;

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {"@type": "Question", "name": "What is the premium of LIC Jeevan Labh for 10 lakh?", "acceptedAnswer": {"@type": "Answer", "text": "For a 30-year-old, 25-year term, 16-year PPT, premium is ~₹42,200 yearly (before tax)."}},
        {"@type": "Question", "name": "How is LIC Jeevan Labh maturity calculated?", "acceptedAnswer": {"@type": "Answer", "text": "Maturity = Sum Assured + Simple Reversionary Bonuses + Final Additional Bonus (FAB)."}},
        {"@type": "Question", "name": "What are LIC Jeevan Labh bonus rates 2025?", "acceptedAnswer": {"@type": "Answer", "text": "LIC declares yearly bonus rates. Historically, ₹40–₹48 per ₹1,000 SA depending on term."}},
        {"@type": "Question", "name": "Which is better: LIC Jeevan Labh or Jeevan Umang?", "acceptedAnswer": {"@type": "Answer", "text": "Jeevan Labh suits fixed-goal lump sum needs. Jeevan Umang is better for lifelong income."}},
        {"@type": "Question", "name": "Can I take a loan on Jeevan Labh?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, loans are available after 2 years, up to 80–90% of surrender value."}},
        {"@type": "Question", "name": "How much is LIC Jeevan Labh 1 crore premium?", "acceptedAnswer": {"@type": "Answer", "text": "For a 35-year-old, 21-year term, ~₹5.1L yearly premium for 15 years. Maturity >₹2 crore (illustrative)."}}
      ]
    };
    
    const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Use LIC Jeevan Labh Premium Calculator",
        "step": [
            {"@type": "HowToStep", "name": "Enter Basic Details", "text": "Provide your age and desired sum assured."},
            {"@type": "HowToStep", "name": "Select Term & PPT", "text": "Choose policy term (16, 21, 25 years)."},
            {"@type": "HowToStep", "name": "Click Calculate", "text": "Our calculator shows premium including GST and maturity estimate."},
            {"@type": "HowToStep", "name": "View Results", "text": "Check yearly/monthly premium, total paid, and estimated maturity."}
        ]
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


export default async function LicJeevanLabhCalculatorPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);
    const pageDict = (await import(`@/dictionaries/${lang}/lic-jeevan-labh-calculator.json`)).default;
    const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
    const pageUrl = `${siteUrl}/${lang}/lic-jeevan-labh-calculator`;

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/${lang}` },
          { '@type': 'ListItem', position: 2, name: 'Calculators', item: `${siteUrl}/${lang}/calculators` },
          { '@type': 'ListItem', position: 3, name: 'LIC Premium Calculator', item: `${siteUrl}/${lang}/lic-premium-calculator` },
          { '@type': 'ListItem', position: 4, name: 'LIC Jeevan Labh Calculator', item: pageUrl },
        ],
    };
    
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            <LicJeevanLabhCalculatorPageClient 
                params={{ lang }}
                dictionary={dictionary}
                pageDict={pageDict}
            />
        </>
    );
}
