
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import LicPremiumCalculatorPageClient from "./LicPremiumCalculatorPageClient";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I calculate LIC premium?",
        "acceptedAnswer": { "@type": "Answer", "text": "Open the plan calculator, enter age/DOB, sum assured, PPT and frequency. Select a plan preset if needed and click Calculate." }
      },
      {
        "@type": "Question",
        "name": "Is this an official LIC calculator?",
        "acceptedAnswer": { "@type": "Answer", "text": "No. BharatSaver’s calculator provides estimates based on plan rules; final quotes are issued by LIC and depend on underwriting." }
      },
      {
        "@type": "Question",
        "name": "Does the calculator include taxes?",
        "acceptedAnswer": { "@type": "Answer", "text": "By default we show premiums before tax. Use the include-tax toggle to view premiums inclusive of current GST/service tax." }
      },
      {
        "@type": "Question",
        "name": "What is Premium Paying Term (PPT)?",
        "acceptedAnswer": { "@type": "Answer", "text": "PPT is the number of years you will pay the premiums. A longer PPT generally lowers the annual premium but increases the number of payments." }
      }
    ]
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteUrl}/${params.lang}/lic-premium-calculator`
    },
    "headline": "LIC Premium Calculator — Free Online LIC Premium Calculator (2025)",
    "description": "Select your LIC plan and instantly open the calculator. Compare premiums for Jeevan Umang, Jeevan Utsav, Jeevan Labh and more. Free, accurate LIC premium estimates and plan details.",
    "author": {
      "@type": "Person",
      "name": "Mahesh Chaube",
      "jobTitle": "Certified Financial Planner (CFP)",
      "url": "https://www.linkedin.com/in/maheshchaube"
    },
    "reviewedBy": {
      "@type": "Person",
      "name": "Laveena Vijayi",
      "jobTitle": "Senior Financial Research Analyst"
    },
    "publisher": {
      "@type": "Organization",
      "name": "BharatSaver",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/icon.svg`
      }
    },
    "datePublished": "2024-09-25",
    "dateModified": "2025-09-24"
  };
  
  return {
    title: "LIC Premium Calculator — Free Online LIC Premium Calculator (2025) | BharatSaver",
    description: "Select your LIC plan and instantly open the calculator. Compare premiums for Jeevan Umang, Jeevan Utsav, Jeevan Labh and more. Free, accurate LIC premium estimates and plan details.",
    alternates: {
      canonical: `${siteUrl}/en/lic-premium-calculator`,
       languages: i18nConfig.locales.reduce((acc, locale) => {
        acc[locale] = `${siteUrl}/${locale}/lic-premium-calculator`;
        return acc;
      }, {} as Record<string, string>),
    },
    other: {
      'application/ld+json': JSON.stringify([faqSchema, articleSchema]),
    }
  };
}

export default async function LicPremiumCalculatorPage({ params }: { params: { lang: Locale }}) {
  const dictionary = await getDictionary(params.lang);
  const pageDict = (await import(`@/dictionaries/${params.lang}/lic-premium-calculator.json`)).default;

  return (
    <LicPremiumCalculatorPageClient
        params={params}
        dictionary={dictionary}
        pageDict={pageDict}
    />
  );
}

    