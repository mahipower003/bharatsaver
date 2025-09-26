
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
        "acceptedAnswer": { "@type": "Answer", "text": "Enter age/DOB, sum assured, PPT and frequency in the calculator. Use presets for better accuracy." }
      },
      {
        "@type": "Question",
        "name": "Is this an official LIC calculator?",
        "acceptedAnswer": { "@type": "Answer", "text": "No. This is an independent tool by BharatSaver. For binding quotes, contact LIC." }
      },
      {
        "@type": "Question",
        "name": "Can I compare premiums across LIC plans?",
        "acceptedAnswer": { "@type": "Answer", "text": "Yes, use the Compare Tool to check premiums for Jeevan Umang vs Jeevan Labh vs Jeevan Utsav." }
      },
      {
        "@type": "Question",
        "name": "Does this calculator include GST?",
        "acceptedAnswer": { "@type": "Answer", "text": "By default, no. Toggle “Include Tax” to view GST-inclusive premiums." }
      },
      {
        "@type": "Question",
        "name": "What is Premium Paying Term (PPT)?",
        "acceptedAnswer": { "@type": "Answer", "text": "It’s the number of years you’ll pay premiums. Longer PPT = lower yearly premium." }
      },
      {
        "@type": "Question",
        "name": "Which is the best LIC plan?",
        "acceptedAnswer": { "@type": "Answer", "text": "Depends on your goal. Jeevan Umang suits long-term wealth + protection, Jeevan Labh suits savings with protection, Utsav suits mixed needs." }
      },
      {
        "@type": "Question",
        "name": "How to calculate LIC premium monthly?",
        "acceptedAnswer": { "@type": "Answer", "text": "Use the frequency selector — it automatically converts yearly premium into monthly." }
      },
      {
        "@type": "Question",
        "name": "Can riders increase premium significantly?",
        "acceptedAnswer": { "@type": "Answer", "text": "Yes. Accident/CI riders can add 5–15% depending on coverage." }
      },
      {
        "@type": "Question",
        "name": "How accurate are online LIC premium calculators?",
        "acceptedAnswer": { "@type": "Answer", "text": "They’re close estimates, but LIC’s official quote at purchase is final." }
      },
      {
        "@type": "Question",
        "name": "Is the LIC Premium Calculator free?",
        "acceptedAnswer": { "@type": "Answer", "text": "Yes — completely free to use, 24/7." }
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
      "sameAs": "https://www.linkedin.com/in/maheshchaube"
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

