import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import LicJeevanAnandCalculatorPageClient from "./LicJeevanAnandCalculatorPageClient";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
    const { lang } = await params;
    const pageDict = (await import(`@/dictionaries/${lang}/lic-jeevan-anand-calculator.json`).catch(() => import(`@/dictionaries/en/lic-jeevan-anand-calculator.json`))).default;
    const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
    const pageUrl = `${siteUrl}/${lang}/lic-jeevan-anand-calculator`;

    // Extract FAQs dynamically for FAQPage schema
    const faqSection = pageDict.article?.sections?.find((s: any) => s.id === 'faq');
    const faqItems = faqSection?.content?.find((c: any) => c.type === 'faq')?.items || [];

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqItems.map((item: { q: string; a: string }) => ({
            "@type": "Question",
            "name": item.q,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.a.replace(/<[^>]*>/g, '') // Strip HTML tags for pristine schema text
            }
        }))
    };

    const financialProductSchema = {
        "@context": "https://schema.org",
        "@type": "FinancialProduct",
        "name": "LIC New Jeevan Anand (Plan 715 / Plan 915)",
        "description": "Non-linked, participating, individual life assurance policy offering double death benefit cover and guaranteed maturity payouts.",
        "category": "Life Insurance / Combination Endowment & Whole Life",
        "provider": {
            "@type": "Organization",
            "name": "Life Insurance Corporation of India (LIC)",
            "url": "https://licindia.in"
        },
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "INR"
        }
    };

    const softwareAppSchema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "LIC New Jeevan Anand Calculator",
        "operatingSystem": "All",
        "applicationCategory": "FinanceApplication",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "INR"
        }
    };

    const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to calculate LIC New Jeevan Anand (Plan 715) Premium & Maturity",
        "step": [
            { "@type": "HowToStep", "name": "Enter Entry Age & Term", "text": "Input your current age (18-50 years) and chosen policy term (15-35 years)." },
            { "@type": "HowToStep", "name": "Select Basic Sum Assured", "text": "Enter your desired sum assured cover (minimum ₹1,00,000)." },
            { "@type": "HowToStep", "name": "Select Optional Riders", "text": "Check Accidental Death & Disability Benefit or Term Assurance Riders if required." },
            { "@type": "HowToStep", "name": "Click Calculate", "text": "Review multi-modal premiums with 1st/2nd year GST, total maturity payout, 100-year cash flow table, and lifelong death cover." }
        ]
    };

    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": pageDict.meta_title || "LIC New Jeevan Anand Calculator (Plan 715 / 915)",
        "author": { "@type": "Person", "name": "Mahesh Chaube, CFP", "jobTitle": "Certified Financial Planner" },
        "publisher": { "@type": "Organization", "name": "BharatSaver", "logo": { "@type": "ImageObject", "url": `${siteUrl}/logo.png` } },
        "datePublished": "2024-09-15",
        "dateModified": "2026-08-16",
        "reviewedBy": { "@type": "Person", "name": "Laveena Vijayi", "jobTitle": "Senior Financial Research Analyst, BharatSaver" }
    };

    return {
        title: pageDict.meta_title || "LIC New Jeevan Anand Calculator (Plan 715 / 915) — Premium & Double Death Cover",
        description: pageDict.meta_description || "Calculate exact LIC New Jeevan Anand (Plan 715/915) premiums, 1st & 2nd year GST, maturity payouts, and post-maturity lifelong cover.",
        alternates: {
            canonical: pageUrl,
            languages: i18nConfig.locales.reduce((acc, locale) => {
                acc[locale] = `${siteUrl}/${locale}/lic-jeevan-anand-calculator`;
                return acc;
            }, {} as Record<string, string>),
        },
        other: {
            'application/ld+json': JSON.stringify([faqSchema, financialProductSchema, softwareAppSchema, howToSchema, articleSchema]),
        },
    };
}

export default async function LicJeevanAnandCalculatorPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);
    const pageDict = (await import(`@/dictionaries/${lang}/lic-jeevan-anand-calculator.json`).catch(() => import(`@/dictionaries/en/lic-jeevan-anand-calculator.json`))).default;

    return (
        <LicJeevanAnandCalculatorPageClient 
            params={{ lang }}
            dictionary={dictionary}
            pageDict={pageDict}
        />
    );
}
