
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
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Open the plan calculator, enter age/DOB, sum assured, PPT and frequency. Select a plan preset if needed and click Calculate."
        }
      },
      {
        "@type": "Question",
        "name": "Is this an official LIC calculator?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. BharatSaver’s calculator provides estimates based on plan rules; final quotes are issued by LIC and depend on underwriting."
        }
      },
      {
        "@type": "Question",
        "name": "Does the calculator include taxes?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "By default we show premiums before tax. Use the include-tax option to view premiums inclusive of current GST/service tax."
        }
      },
      {
        "@type": "Question",
        "name": "What is Premium Paying Term (PPT)?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "PPT is the number of years you will pay the premiums. A longer PPT generally lowers the annual premium but increases the number of payments."
        }
      }
    ]
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://bharatsaver.com/lic-calculators"
    },
    "headline": "LIC Premium Calculator — Select an LIC Plan",
    "description": "Select an LIC plan and open its dedicated premium calculator. Use plan presets (Saral Pension) for accurate estimates.",
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
        "url": "https://bharatsaver.com/images/logo.png"
      }
    },
    "datePublished": "2025-09-24",
    "dateModified": "2025-09-24"
  };
  
  return {
    title: "LIC Premium Calculator — Select Your LIC Plan & Calculate Premium | BharatSaver",
    description: "Select your LIC plan and instantly open the calculator. Compare premiums for Jeevan Umang, Jeevan Utsav, Jeevan Labh and more. Free, accurate LIC premium estimates and plan details.",
    alternates: {
      canonical: "https://bharatsaver.com/lic-calculators",
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
