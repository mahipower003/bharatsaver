
import { PpfCalculator } from "@/components/calculators/PpfCalculator";
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  const dictionary = await getDictionary(params.lang, ['ppf_calculator']);
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${params.lang}/ppf-calculator`;

  return {
    title: dictionary.ppf_calculator.meta_title,
    description: dictionary.ppf_calculator.meta_description,
    openGraph: {
        title: dictionary.ppf_calculator.meta_title,
        description: dictionary.ppf_calculator.meta_description,
        url: pageUrl,
        siteName: 'BharatSaver',
        images: [{ 
          url: `${siteUrl}/hero-image.png`, // Replace with a specific OG image later
          width: 960, 
          height: 640, 
          alt: 'BharatSaver PPF Calculator' 
        }],
        locale: 'en_IN', // Adjust locale based on params.lang if needed
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: dictionary.ppf_calculator.meta_title,
        description: dictionary.ppf_calculator.meta_description,
        images: [`${siteUrl}/hero-image.png`],
    },
    alternates: {
      canonical: pageUrl,
      languages: {
        'en': `${siteUrl}/en/ppf-calculator`,
        'hi': `${siteUrl}/hi/ppf-calculator`,
        'mr': `${siteUrl}/mr/ppf-calculator`,
        'ta': `${siteUrl}/ta/ppf-calculator`,
        'te': `${siteUrl}/te/ppf-calculator`,
      },
    },
  };
}

export default async function PpfCalculatorPage({ params }: { params: { lang: Locale }}) {
  const dictionary = await getDictionary(params.lang, ['ppf_calculator']);
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';

  const faqItems = dictionary.ppf_calculator.faqs;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((faq: { question: string, answer: string }) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/${params.lang}` },
      { '@type': 'ListItem', position: 2, name: 'Calculators', item: `${siteUrl}/${params.lang}/calculators` },
      { '@type': 'ListItem', position: 3, name: 'PPF Calculator', item: `${siteUrl}/${params.lang}/ppf-calculator` },
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: siteUrl,
    name: 'BharatSaver',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/${params.lang}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
  
  return (
    <div className="px-4 md:px-6 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            {dictionary.ppf_calculator.h1}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {dictionary.ppf_calculator.description}
          </p>
        </div>
        <PpfCalculator dictionary={dictionary.ppf_calculator} />

        <div className="mt-12">
            <h2 className="text-2xl font-bold text-center mb-6">{dictionary.ppf_calculator.faq_title}</h2>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((faq: { question: string, answer: string }, index: number) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
        </div>
      </div>
    </div>
  );
}
