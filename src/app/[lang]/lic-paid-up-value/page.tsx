import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import LicPaidUpValueClient from "./LicPaidUpValueClient";

export async function generateStaticParams() {
  return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${lang}/lic-paid-up-value`;

  let pageDict: any;
  try {
    pageDict = (await import(`@/dictionaries/${lang}/lic-paid-up-value.json`)).default;
  } catch {
    pageDict = (await import(`@/dictionaries/en/lic-paid-up-value.json`)).default;
  }

  const title = pageDict.meta_title;
  const description = pageDict.meta_description;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": { "@type": "WebPage", "@id": pageUrl },
    "headline": title,
    "description": description,
    "image": `${siteUrl}/images/lic-paid-up-value-banner.png`,
    "author": { "@type": "Person", "name": "Mahesh Chaube, CFP", "url": `${siteUrl}/author/mahesh-chaube` },
    "publisher": { "@type": "Organization", "name": "BharatSaver", "logo": { "@type": "ImageObject", "url": `${siteUrl}/icon.svg` } },
    "datePublished": "2026-05-31",
    "dateModified": "2026-08-16",
  };

  const faqSection = pageDict.sections?.find((s: any) => s.id === 'faq');
  const faqSchema = faqSection ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqSection.content[0].items.map((item: any) => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": { "@type": "Answer", "text": item.a }
    }))
  } : null;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/en/lic-paid-up-value`,
      languages: i18nConfig.locales.reduce((acc, locale) => {
        acc[locale] = `${siteUrl}/${locale}/lic-paid-up-value`;
        return acc;
      }, {} as Record<string, string>),
    },
    other: {
      'application/ld+json': JSON.stringify(faqSchema ? [articleSchema, faqSchema] : articleSchema)
    }
  };
}

export default async function LicPaidUpValuePage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  let pageDict: any;
  try {
    pageDict = (await import(`@/dictionaries/${lang}/lic-paid-up-value.json`)).default;
  } catch {
    pageDict = (await import(`@/dictionaries/en/lic-paid-up-value.json`)).default;
  }

  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${lang}/lic-paid-up-value`;

  const breadcrumbSchema = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": `${siteUrl}/${lang}` },
      { "@type": "ListItem", "position": 2, "name": "Guides", "item": `${siteUrl}/${lang}/guides` },
      { "@type": "ListItem", "position": 3, "name": "LIC Paid-Up Value", "item": pageUrl }
    ]
  };

  return (
    <LicPaidUpValueClient
      params={{ lang }}
      dictionary={dictionary}
      pageDict={pageDict}
      breadcrumbSchema={breadcrumbSchema}
    />
  );
}
