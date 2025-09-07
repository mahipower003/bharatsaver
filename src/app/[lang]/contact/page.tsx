
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, Phone } from "lucide-react";
import Link from "next/link";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  const dictionary = await getDictionary(params.lang, ['contact_page']);
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${params.lang}/contact`;
  return {
    title: dictionary.contact_page.meta_title,
    description: dictionary.contact_page.meta_description,
    alternates: {
      canonical: pageUrl,
      languages: i18nConfig.locales.reduce((acc, locale) => {
        acc[locale] = `${siteUrl}/${locale}/contact`;
        return acc;
      }, {} as Record<string, string>),
    },
  };
}

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52s-.669-1.611-.916-2.207c-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    </svg>
);


export default async function ContactPage({ params }: { params: { lang: Locale }}) {
  const dictionary = await getDictionary(params.lang, ['contact_page']);
  
  const contactDetails = [
    {
      icon: Mail,
      title: "Email",
      value: "maheshchaube333@gmail.com",
      href: "mailto:maheshchaube333@gmail.com",
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+91 7666705885",
      href: "tel:+917666705885",
    },
    {
      icon: WhatsAppIcon,
      title: "WhatsApp",
      value: "+91 7666705885",
      href: "https://wa.me/917666705885",
    },
  ];
  
  return (
    <div className="py-12 md:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline mb-4">
              {dictionary.contact_page.h1}
            </h1>
            <p className="text-xl text-muted-foreground">
              {dictionary.contact_page.p1 || "We're here to help. Reach out to us with any questions or feedback."}
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactDetails.map((detail) => (
                <Link href={detail.href} key={detail.title} target="_blank" rel="noopener noreferrer" className="group">
                    <Card className="text-center h-full group-hover:shadow-lg group-hover:border-primary/30 transition-all">
                        <CardHeader>
                            <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
                                <detail.icon className="h-8 w-8 text-primary" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <CardTitle className="text-xl">{detail.title}</CardTitle>
                            <CardDescription className="mt-2 text-base">{detail.value}</CardDescription>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
