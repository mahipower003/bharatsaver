
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
        "name": "How do I calculate LIC premium?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "To calculate your LIC premium, open the plan calculator on our page, enter your age (or date of birth), the desired sum assured, the premium paying term (PPT), and how often you'd like to pay (e.g., monthly, yearly). For more accurate results, select a plan preset like 'Jeevan Umang' and click 'Calculate' to get an instant estimate."
        }
      },
      {
        "@type": "Question",
        "name": "Is this an official LIC calculator?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No, this is an independent estimation tool provided by BharatSaver. It uses official LIC plan rules and formulas for accuracy, but for a final, binding quote, you should always contact LIC or an authorized agent as premiums are subject to underwriting."
        }
      },
      {
        "@type": "Question",
        "name": "Does this LIC premium calculator include tax (GST)?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "By default, our calculator shows the premium before tax to give you the base cost. However, you can use the 'include tax' toggle to see the final premium inclusive of the current GST rates (e.g., 4.5% for the first year and 2.25% thereafter for traditional plans)."
        }
      },
      {
        "@type": "Question",
        "name": "What is Premium Paying Term (PPT) in LIC?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The Premium Paying Term (PPT) is the specific number of years you are required to pay premiums for your LIC policy. This can be different from the full policy term. For example, in a plan like Jeevan Labh, you might pay premiums for 16 years, but the policy matures in 25 years. A longer PPT generally results in a lower annual premium."
        }
      },
      {
        "@type": "Question",
        "name": "How can I compare premiums for different LIC plans like Jeevan Umang vs Jeevan Labh?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our calculator makes this easy. First, calculate the premium for 'Jeevan Umang' using its preset. Then, simply switch the preset to 'Jeevan Labh' while keeping the sum assured and age the same. This will give you a direct, side-by-side comparison of the premium cost for both plans."
        }
      },
      {
        "@type": "Question",
        "name": "Can I calculate the monthly premium for an LIC policy?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. The calculator has a 'Frequency' option where you can select 'Monthly'. It will automatically convert the annual premium to its monthly equivalent, including any modal loading charges applied by LIC for non-yearly payments."
        }
      },
      {
        "@type": "Question",
        "name": "How does adding a rider affect my LIC premium?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Adding riders like the Accidental Death & Disability Benefit Rider or the Critical Illness Rider will increase your total premium. Our calculator allows you to toggle these riders on and off to see their exact incremental cost, helping you decide if the extra protection is worth the price."
        }
      },
      {
        "@type": "Question",
        "name": "What is the most accurate LIC premium calculator online for free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "While many tools exist, a calculator that uses plan-specific presets, includes rider costs, and clarifies its tax assumptions (like this one) will provide the most accurate estimates. Official LIC agent portals are the most accurate source for a final quote."
        }
      },
      {
        "@type": "Question",
        "name": "How do you convert yearly LIC premium to monthly?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The conversion is not a simple division by 12. LIC applies 'modal factors' for non-annual payments. For monthly payments, the factor is approximately 0.088 times the annual premium. Our calculator handles this conversion automatically when you select the 'Monthly' frequency."
        }
      },
      {
        "@type": "Question",
        "name": "What details are needed for the Jeevan Utsav premium calculator?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "For Jeevan Utsav, you'll need to provide your age, desired sum assured, and choose a premium paying term (from 5 to 16 years). The calculator will then show the premium for your selected term and the subsequent income benefits."
        }
      },
      {
        "@type": "Question",
        "name": "Can I download my premium calculation?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our tool includes a feature to download your calculated premium summary as a PDF. This is useful for your records or for discussing with a financial advisor."
        }
      },
      {
        "@type": "Question",
        "name": "Which is the best LIC plan for me?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The 'best' plan depends on your financial goal. Jeevan Umang is excellent for whole-life coverage and guaranteed income. Jeevan Labh is a classic endowment plan for savings. Jeevan Utsav offers flexible income benefits. We recommend comparing them with our tool to see which aligns with your needs."
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
    "description": "Select your LIC plan and instantly open the calculator. Compare premiums for Jeevan Umang, Jeevan Utsav, Jeevan Labh and more. Free, accurate LIC premium estimates and plan details.",
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
