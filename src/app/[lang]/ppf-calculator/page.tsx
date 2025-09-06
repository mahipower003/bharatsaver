
import { PpfCalculator } from "@/components/calculators/PpfCalculator";
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
          url: `/hero-image.png`,
          width: 1200, 
          height: 630, 
          alt: 'BharatSaver PPF Calculator' 
        }],
        locale: 'en_IN',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: dictionary.ppf_calculator.meta_title,
        description: dictionary.ppf_calculator.meta_description,
        images: [`/hero-image.png`],
    },
    alternates: {
      canonical: pageUrl,
      languages: i18nConfig.locales.reduce((acc, locale) => {
        acc[locale] = `${siteUrl}/${locale}/ppf-calculator`;
        return acc;
    }, {} as Record<string, string>),
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
    <div className="py-12">
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

        <Card className="mt-12 shadow-lg">
          <CardHeader>
            <CardTitle>{dictionary.ppf_calculator.explanation_title}</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>{dictionary.ppf_calculator.explanation_p1}</p>
            <p>{dictionary.ppf_calculator.explanation_p2}</p>
          </CardContent>
        </Card>

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
