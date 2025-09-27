
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import LicPremiumCalculatorPageClient from "./LicPremiumCalculatorPageClient";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${params.lang}/lic-premium-calculator`;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
       {
        "@type": "Question",
        "name": "How to calculate LIC premium for Jeevan Umang?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Use the plan rate per ₹1,000 Sum Assured × (Sum Assured/1,000), apply the payment mode factor (YR 1.00, HY ~0.51, Q ~0.26, M ~0.087), add rider charges, then add applicable GST. Exact rates depend on age, PPT, and riders."
        }
      },
      {
        "@type": "Question",
        "name": "Which LIC plan has the lowest premium for age 30?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Pure term plans (e.g., LIC Tech Term/Jeevan Amar) have the lowest premiums for 30-year-olds; savings plans like Jeevan Labh/Umang cost more because they build benefits."
        }
      },
      {
        "@type": "Question",
        "name": "How is LIC premium calculated for monthly payment?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Start with the annual base premium and multiply by the monthly modal factor (~0.087), then add rider charges and GST."
        }
      },
      {
        "@type": "Question",
        "name": "Does LIC charge GST on premium?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Typical effective GST is ~4.5% in the first year and ~2.25% on renewals for traditional plans, ~18% on pure-risk term premiums, and ~1.8% on many single-premium plans (rates may change by regulation)."
        }
      },
      {
        "@type": "Question",
        "name": "What is the formula to calculate LIC premium?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Approx: Premium ≈ (Base rate per ₹1,000 × SA/1,000 × modal factor) + rider costs − rebates (mode/SA) + GST. Actual premiums are as per LIC’s rate tables and underwriting."
        }
      },
      {
        "@type": "Question",
        "name": "How do riders affect LIC premium?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Each rider (e.g., Accidental Death/Disability, Term Rider, Critical Illness) adds its own charge to the base premium; PWB waives future premiums on disability but still has a cost."
        }
      },
      {
        "@type": "Question",
        "name": "How to reduce LIC premium without reducing sum assured?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Buy at a younger age, choose annual mode, opt for a longer PPT, avoid unnecessary riders, and use higher SA slabs to get rebates."
        }
      },
      {
        "@type": "Question",
        "name": "Is it cheaper to pay LIC premium annually?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Usually yes—annual mode avoids modal loading from monthly/quarterly payments and can minimize GST impact."
        }
      },
      {
        "@type": "Question",
        "name": "Can I change premium paying term later?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Generally no; PPT is fixed after policy issuance. You can change payment mode or use options like paid-up/surrender, subject to policy rules."
        }
      },
      {
        "@type": "Question",
        "name": "How accurate are online LIC premium calculators?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "They’re close for quick estimates but final premiums depend on underwriting, medicals, exact rider choices, GST, and current rate tables."
        }
      },
      {
        "@type": "Question",
        "name": "Does LIC give concession for females?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, many LIC plans offer lower premiums for female lives or specific female concessions, subject to plan rules."
        }
      },
      {
        "@type": "Question",
        "name": "How does age affect LIC premium?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Premiums rise with age because mortality risk increases; buying earlier locks in lower rates for the term."
        }
      },
      {
        "@type": "Question",
        "name": "How to calculate premium for single premium plans?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Single Premium ≈ (Single-premium rate per ₹1,000 × SA/1,000) − applicable rebates + GST (often ~1.8% on eligible plans)."
        }
      },
      {
        "@type": "Question",
        "name": "How to compute maturity payout (basic formula)?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "For endowments: Maturity ≈ Sum Assured + vested bonus + final additional bonus (if any) − dues; for money-back, add the same but you’ve already received periodic survival benefits earlier."
        }
      },
      {
        "@type": "Question",
        "name": "How to compare Jeevan Umang vs Jeevan Labh for same sum assured?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Umang is whole-life with 8% SA yearly survival benefit after PPT and maturity at age 100—premium is higher but gives lifelong cover/income; Labh is a limited-premium endowment with a lump-sum maturity at term and generally lower premium."
        }
      }
    ]
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": pageUrl
    },
    "headline": "LIC Premium Calculator — Free Online LIC Premium Calculator (2025)",
    "description": "Calculate LIC premium instantly for Jeevan Umang, Jeevan Utsav, Jeevan Labh & more. Use plan presets, add riders, compare monthly vs yearly and download results.",
    "author": {
      "@type": "Person",
      "name": "Mahesh Chaube",
      "jobTitle": "Certified Financial Planner (CFP)",
      "url": `${siteUrl}/${params.lang}/author/mahesh-chaube`
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
    "dateModified": "2025-09-24",
    "reviewedBy": {
      "@type": "Person",
      "name": "Laveena Vijayi",
      "jobTitle": "Senior Financial Research Analyst, BharatSaver Editorial Team",
      "url": "https://www.linkedin.com/in/laveena-vijayi/"
    }
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Calculate Your LIC Premium Online",
    "description": "A quick step-by-step guide to using the online LIC premium calculator.",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Step 1: Select Your Plan",
        "text": "Start by choosing your desired LIC plan from the dropdown menus. Use a preset like 'Jeevan Umang' for better accuracy.",
        "url": `${pageUrl}#calculator-widget`
      },
      {
        "@type": "HowToStep",
        "name": "Step 2: Enter Your Details",
        "text": "Input your current age, gender, the sum assured (coverage amount), and the premium paying term (PPT).",
        "url": `${pageUrl}#calculator-widget`
      },
      {
        "@type": "HowToStep",
        "name": "Step 3: Click 'Calculate'",
        "text": "The tool will process your inputs and instantly display your estimated premium for yearly, half-yearly, quarterly, and monthly frequencies.",
        "url": `${pageUrl}#calculator-widget`
      }
    ]
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "BharatSaver's LIC Premium Calculator",
    "operatingSystem": "Web",
    "applicationCategory": "FinanceApplication",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "12580"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    }
  };
  
  return {
    title: "LIC Premium Calculator — Free Online LIC Premium Calculator | BharatSaver",
    description: "Calculate LIC premium instantly for Jeevan Umang, Jeevan Utsav, Jeevan Labh & more. Use plan presets, add riders, compare monthly vs yearly and download results.",
    alternates: {
      canonical: `${siteUrl}/en/lic-premium-calculator`,
       languages: i18nConfig.locales.reduce((acc, locale) => {
        acc[locale] = `${siteUrl}/${locale}/lic-premium-calculator`;
        return acc;
      }, {} as Record<string, string>),
    },
    other: {
      'application/ld+json': JSON.stringify([faqSchema, articleSchema, howToSchema, softwareSchema]),
    }
  };
}

export default async function LicPremiumCalculatorPage({ params }: { params: { lang: Locale }}) {
  const dictionary = await getDictionary(params.lang);
  const pageDict = (await import(`@/dictionaries/${params.lang}/lic-premium-calculator.json`)).default;
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${params.lang}/lic-premium-calculator`;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/${params.lang}` },
      { '@type': 'ListItem', position: 2, name: 'Calculators', item: `${siteUrl}/${params.lang}/calculators` },
      { '@type': 'ListItem', position: 3, name: 'LIC Premium Calculator', item: pageUrl },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <LicPremiumCalculatorPageClient
          params={params}
          dictionary={dictionary}
          pageDict={pageDict}
      />
    </>
  );
}

    