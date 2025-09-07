
import { PpfCalculator } from "@/components/calculators/PpfCalculator";
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2 } from "lucide-react";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  const dictionary = await getDictionary(params.lang, ['ppf_calculator']);
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${params.lang}/ppf-calculator`;

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
        locale: params.lang === 'en' ? 'en_IN' : params.lang,
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
    other: {
      'application/ld+json': JSON.stringify(faqSchema),
    },
  };
}

export default async function PpfCalculatorPage({ params }: { params: { lang: Locale }}) {
  const dictionary = await getDictionary(params.lang, ['ppf_calculator']);
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const currentDate = new Date();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const lastUpdated = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;


  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/${params.lang}` },
      { '@type': 'ListItem', position: 2, name: 'Calculators', item: `${siteUrl}/${params.lang}/calculators` },
      { '@type': 'ListItem', position: 3, name: 'PPF Calculator', item: `${siteUrl}/${params.lang}/ppf-calculator` },
    ],
  };
  
  const comparisonData = dictionary.ppf_calculator.comparison.table;

  return (
    <div className="py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            {dictionary.ppf_calculator.h1}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {dictionary.ppf_calculator.description}
          </p>
          <p className="text-sm text-muted-foreground mt-2">{dictionary.ppf_calculator.last_updated} {lastUpdated}</p>
        </div>
        
        <PpfCalculator dictionary={dictionary.ppf_calculator} />

        <Card className="mt-12 shadow-lg">
          <CardHeader>
            <h2 className="text-2xl font-bold">{dictionary.ppf_calculator.how_to_use.title}</h2>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <ul>
                {dictionary.ppf_calculator.how_to_use.steps.map((step: string, index: number) => (
                    <li key={index}>{step}</li>
                ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-12 shadow-lg">
          <CardHeader>
            <h2 className="text-2xl font-bold">{dictionary.ppf_calculator.advantages.title}</h2>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>{dictionary.ppf_calculator.advantages.intro}</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {dictionary.ppf_calculator.advantages.points.map((point: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4" dangerouslySetInnerHTML={{ __html: dictionary.ppf_calculator.advantages.conclusion }}></p>
          </CardContent>
        </Card>

        <Card className="mt-12 shadow-lg">
          <CardHeader>
            <h2 className="text-2xl font-bold">{dictionary.ppf_calculator.example.title}</h2>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>{dictionary.ppf_calculator.example.scenario}</p>
            <ul>
                <li><strong>{dictionary.ppf_calculator.total_investment}:</strong> {dictionary.ppf_calculator.example.total_invested}</li>
                <li><strong>{dictionary.ppf_calculator.total_interest}:</strong> {dictionary.ppf_calculator.example.interest_earned}</li>
                <li><strong>{dictionary.ppf_calculator.maturity_value}:</strong> {dictionary.ppf_calculator.example.maturity_amount}</li>
            </ul>
            <p>{dictionary.ppf_calculator.example.footer_note}</p>
          </CardContent>
        </Card>
        
        <Card className="mt-12 shadow-lg">
          <CardHeader>
            <h2 className="text-2xl font-bold">{dictionary.ppf_calculator.tax_benefits.title}</h2>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>{dictionary.ppf_calculator.tax_benefits.intro}</p>
            <h3 className="text-xl font-semibold">{dictionary.ppf_calculator.tax_benefits.contribution_title}</h3>
            <p dangerouslySetInnerHTML={{ __html: dictionary.ppf_calculator.tax_benefits.contribution_body }}></p>
            <h3 className="text-xl font-semibold">{dictionary.ppf_calculator.tax_benefits.interest_title}</h3>
            <p>{dictionary.ppf_calculator.tax_benefits.interest_body}</p>
            <h3 className="text-xl font-semibold">{dictionary.ppf_calculator.tax_benefits.maturity_title}</h3>
            <p>{dictionary.ppf_calculator.tax_benefits.maturity_body}</p>
            <div className="bg-primary/10 p-4 rounded-md border-l-4 border-primary">
              <p className="font-semibold" dangerouslySetInnerHTML={{ __html: dictionary.ppf_calculator.tax_benefits.why_matters }}></p>
            </div>
            <p dangerouslySetInnerHTML={{ __html: dictionary.ppf_calculator.tax_benefits.footer_note }}></p>
          </CardContent>
        </Card>
        
        <Card className="mt-12 shadow-lg">
          <CardHeader>
            <h2 className="text-2xl font-bold">{dictionary.ppf_calculator.rules.title}</h2>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
             <ul>
                {dictionary.ppf_calculator.rules.points.map((point: string, index: number) => (
                    <li key={index} dangerouslySetInnerHTML={{ __html: point }}></li>
                ))}
            </ul>
            <p dangerouslySetInnerHTML={{ __html: dictionary.ppf_calculator.rules.footer_note }}></p>
          </CardContent>
        </Card>

        <Card className="mt-12 shadow-lg">
            <CardHeader>
                <h2 className="text-2xl font-bold">{dictionary.ppf_calculator.comparison.title}</h2>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            {comparisonData.headers.map((header: string, index: number) => (
                                <TableHead key={index}>{header}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {comparisonData.rows.map((row: string[], rowIndex: number) => (
                            <TableRow key={rowIndex}>
                                {row.map((cell: string, cellIndex: number) => (
                                    <TableCell key={cellIndex} className={cellIndex > 0 ? 'text-center' : ''}>{cell}</TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                 <p className="text-sm text-muted-foreground mt-4" dangerouslySetInnerHTML={{ __html: dictionary.ppf_calculator.comparison.footer_note }}></p>
            </CardContent>
        </Card>

        <div className="mt-12">
            <h2 className="text-2xl font-bold text-center mb-6">{dictionary.ppf_calculator.faq_title}</h2>
            <Accordion type="single" collapsible className="w-full">
              {dictionary.ppf_calculator.faqs.map((faq: { question: string, answer: string }, index: number) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>
                    <p dangerouslySetInnerHTML={{ __html: faq.answer }}></p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
        </div>

        <Card className="mt-12 shadow-lg bg-primary/10 border-primary/20">
            <CardHeader>
              <h2 className="text-2xl font-bold">{dictionary.ppf_calculator.final_thoughts.title}</h2>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>{dictionary.ppf_calculator.final_thoughts.body}</p>
              <p dangerouslySetInnerHTML={{ __html: dictionary.ppf_calculator.final_thoughts.next_action }}></p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
