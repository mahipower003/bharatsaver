import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import LicPremiumReceiptDownloadClient from "./LicPremiumReceiptDownloadClient";
import { buildAlternates, buildOpenGraph, buildTwitterCard } from '@/lib/seo';

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
    const { lang } = await params;
    const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
    const pageUrl = `${siteUrl}/${lang}/lic-premium-receipt-download`;
    const pageDict = (await import(`@/dictionaries/${lang}/lic-premium-receipt-download.json`)).default;

    const title = pageDict.meta_title || "LIC Premium Receipt Download: Online, Pay Direct, and WhatsApp (2026 Guide)";
    const description = pageDict.meta_description || "Scrambling to file your taxes? Download your LIC premium receipt online instantly using the customer portal, Pay Direct without login, or WhatsApp!";

    const articleSchema = {
      "@context":"https://schema.org",
      "@type":"Article",
      "mainEntityOfPage":{"@type":"WebPage","@id": pageUrl},
      "headline": title,
      "description": description,
      "author":{"@type":"Person","name":"Mahesh Chaube, CFP","url":`${siteUrl}/author/mahesh-chaube`},
      "publisher":{"@type":"Organization","name":"BharatSaver","logo":{"@type":"ImageObject","url":`${siteUrl}/icon.svg`}},
      "datePublished":"2026-05-16",
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
        title,
        description,
        alternates: {
            canonical: `${siteUrl}/en/lic-premium-receipt-download`,
            languages: i18nConfig.locales.reduce((acc, locale) => {
                acc[locale] = `${siteUrl}/${locale}/lic-premium-receipt-download`;
                return acc;
            }, {} as Record<string, string>),
        },
        other: {
          'application/ld+json': JSON.stringify(faqSchema ? [articleSchema, faqSchema] : articleSchema)
        }
    };
}

export default async function LicPremiumReceiptDownloadPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);
    const pageDict = (await import(`@/dictionaries/${lang}/lic-premium-receipt-download.json`)).default;
    const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
    const pageUrl = `${siteUrl}/${lang}/lic-premium-receipt-download`;
    
    const breadcrumbSchema = {
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": `${siteUrl}/${lang}` },
            { "@type": "ListItem", "position": 2, "name": "LIC Premium Receipt Download", "item": pageUrl }
        ]
    };
    
    return (
        <LicPremiumReceiptDownloadClient
            params={{ lang }}
            dictionary={dictionary}
            pageDict={pageDict}
            breadcrumbSchema={breadcrumbSchema}
        />
    );
}
