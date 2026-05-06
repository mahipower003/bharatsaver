import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import LicTermInsuranceGuideClient from "./LicTermInsuranceGuideClient";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
    const { lang } = await params;
    const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
    const pageUrl = `${siteUrl}/${lang}/lic-term-insurance`;
    const title = "LIC Term Insurance Premium Calculator — Best Plans & ₹1 Crore Quote";
    const description = "Calculate LIC term insurance premiums instantly. Compare Tech-Term vs Jeevan Amar, see age-wise rates for ₹1 Crore cover, and learn which plan suits you best.";
    const ogImage = `${siteUrl}/images/lic-term-insurance-guide.png`;
    return {
        title,
        description,
        alternates: {
            canonical: `${siteUrl}/en/lic-term-insurance`,
            languages: i18nConfig.locales.reduce((acc, locale) => {
                acc[locale] = `${siteUrl}/${locale}/lic-term-insurance`;
                return acc;
            }, {} as Record<string, string>),
        },
        openGraph: {
            title, description, url: pageUrl,
            images: [{ url: ogImage, width: 1200, height: 630, alt: 'LIC Term Insurance Calculator' }],
            locale: lang === 'en' ? 'en_IN' : lang, type: 'article',
        },
        twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
    };
}

export default async function LicTermInsurancePage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);
    const pageDict = { ...(await import(`@/dictionaries/${lang}/lic-term-insurance.json`).catch(() => import(`@/dictionaries/en/lic-term-insurance.json`))).default };
    const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
    const pageUrl = `${siteUrl}/${lang}/lic-term-insurance`;
    const breadcrumbSchema = {
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": `${siteUrl}/${lang}` },
            { "@type": "ListItem", "position": 2, "name": "Calculators", "item": `${siteUrl}/${lang}/calculators` },
            { "@type": "ListItem", "position": 3, "name": "LIC Term Insurance", "item": pageUrl }
        ]
    };
    return (
        <LicTermInsuranceGuideClient
            params={{ lang }}
            dictionary={dictionary}
            pageDict={pageDict}
            breadcrumbSchema={breadcrumbSchema}
        />
    );
}
