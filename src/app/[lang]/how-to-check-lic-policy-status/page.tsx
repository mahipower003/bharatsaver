import type { Metadata } from "next";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LogIn, UserPlus, Phone, MessageSquare, Smartphone, CheckCircle, Info, ShieldAlert } from "lucide-react";
import { AuthorCard } from "@/components/layout/AuthorCard";
import { FooterCta } from "@/components/layout/FooterCta";
import { getDictionary } from "@/lib/dictionaries";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${params.lang}/how-to-check-lic-policy-status`;
  const title = "How to Check LIC Policy Status: A Step-by-Step Guide (Online & Offline)";
  const description = "A complete guide on checking your LIC policy status online via the e-Services portal, SMS, WhatsApp, mobile app, or by calling customer care. Stay updated on premiums, bonuses, and more.";

  const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {"@type": "Question","name": "LIC पॉलिसी स्टेटस कैसे चेक करें?","acceptedAnswer": {"@type": "Answer","text": "आप LIC की वेबसाइट पर लॉग इन करके, 9222492224 पर SMS भेजकर, 022-68276827 पर कॉल करके, या 8976862090 पर WhatsApp पर 'Hi' भेजकर अपनी पॉलिसी का स्टेटस चेक कर सकते हैं।"}},
        {"@type": "Question","name": "How can I check my LIC policy status by SMS?","acceptedAnswer": {"@type": "Answer","text": "Send an SMS with the text 'LICHELP <PolicyNumber>' to 9222492224 from your registered mobile number to get an instant update on your policy status."}},
        {"@type": "Question","name": "Is registration required to check LIC policy status?","acceptedAnswer": {"@type": "Answer","text": "No, registration is not required for offline methods like SMS, call, or WhatsApp. You only need to register for the online LIC e-Services portal or the mobile app."}},
        {"@type": "Question","name": "What is the official LIC WhatsApp number for policy status?","acceptedAnswer": {"@type": "Answer","text": "The official LIC WhatsApp number for policy services is 8976862090. Save this number and send 'Hi' to start the automated service."}}
      ]
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Check LIC Policy Status Online",
    "step": [
        {"@type": "HowToStep", "name": "Visit Portal", "text": "Go to licindia.in and click on 'Login to Customer Portal'."},
        {"@type": "HowToStep", "name": "Login/Register", "text": "Log in if you are an existing user or sign up as a new user by providing policy details."},
        {"@type": "HowToStep", "name": "Navigate to Policy Status", "text": "Once logged in, find and click on the 'Policy Status' or 'Enrolled Policies' section."},
        {"@type": "HowToStep", "name": "View Details", "text": "Click on the specific policy number to see all its details, including premium due dates, bonus, and loan eligibility."}
    ]
  };

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
      languages: i18nConfig.locales.reduce((acc, locale) => {
        acc[locale] = `${siteUrl}/${locale}/how-to-check-lic-policy-status`;
        return acc;
      }, {} as Record<string, string>),
    },
    other: {
      'application/ld+json': JSON.stringify([faqSchema, howToSchema]),
    },
  };
}

const ExternalLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
    <Link href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
        {children}
    </Link>
);

export default async function LicStatusPage({ params }: { params: { lang: Locale } }) {
  const dictionary = await getDictionary(params.lang);
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${params.lang}/how-to-check-lic-policy-status`;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/${params.lang}` },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: `${siteUrl}/${params.lang}/guides` },
      { '@type': 'ListItem', position: 3, name: 'How to Check LIC Policy Status', item: pageUrl },
    ],
  };
    
  return (
    <div className="py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="mx-auto max-w-4xl">
        
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline mb-4">How to Check LIC Policy Status: Step-by-Step Guide (Online & Offline)</h1>
          <p className="text-xl text-muted-foreground">Stay updated on premium due dates, bonuses, and loan eligibility to avoid lapsed policies.</p>
        </header>

        <Card className="mb-12 shadow-lg">
          <CardContent className="p-6">
            <Image 
                src="/images/lic-building.png" 
                alt="The LIC (Life Insurance Corporation of India) building in New Delhi."
                width={800}
                height={450}
                className="rounded-lg"
                data-ai-hint="LIC building"
                priority
            />
            <p className="mt-6 text-muted-foreground">Many LIC policyholders forget to monitor their policy status routinely. This can lead to missed premium payments and even policy lapses, meaning loss of coverage and benefits. The good news is that LIC now offers multiple convenient ways to check your policy status. In this guide, we’ll cover all the methods step-by-step.</p>
          </CardContent>
        </Card>
        
        {/* Online Methods */}
        <Card className="mb-12">
            <CardHeader>
                <CardTitle className="text-3xl font-headline">Check Status Online (LIC e-Services)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2"><LogIn className="text-primary"/> For Existing Users</h3>
                    <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                        <li>Visit the <ExternalLink href="https://licindia.in/">LIC India website</ExternalLink> and click on “Login to Customer Portal”.</li>
                        <li>Select “Registered User” and sign in with your User ID and Password.</li>
                        <li>Navigate to the “Policy Status” section to see your linked policies.</li>
                        <li>Click on a policy number to view detailed information.</li>
                    </ol>
                </div>
                 <div className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2"><UserPlus className="text-primary"/> For New Users (One-Time Registration)</h3>
                    <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                        <li>On the customer portal page, choose “New User / Sign Up”.</li>
                        <li>Fill the registration form with your policy number, premium amount, DOB, and contact details.</li>
                        <li>Verify your account via the link sent to your email or OTP on your phone.</li>
                        <li>Log in and use the “Enroll Policy” feature to add your policies and view their status.</li>
                    </ol>
                </div>
                 <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Pro Tip</AlertTitle>
                    <AlertDescription>Ensure your details match your policy documents exactly during registration. An active mobile number and email are mandatory.</AlertDescription>
                </Alert>
            </CardContent>
        </Card>

        {/* Offline Methods */}
        <Card className="mb-12">
            <CardHeader>
                <CardTitle className="text-3xl font-headline">Check Status Without Registration (Offline)</CardTitle>
                <CardDescription>Use SMS, WhatsApp, or a phone call for quick status checks without logging in.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div>
                    <h3 className="text-xl font-semibold flex items-center gap-2"><MessageSquare className="text-primary"/> Check via SMS</h3>
                    <p className="mt-2 text-muted-foreground">Send an SMS from your registered mobile number to <code className="bg-muted p-1 rounded">9222492224</code> in the following format:</p>
                    <code className="block bg-muted p-2 rounded-md mt-2 font-mono">LICHELP &lt;PolicyNumber&gt;</code>
                    <p className="text-sm mt-2 text-muted-foreground">Example: <code className="font-mono">LICHELP 123456789</code></p>
                </div>
                 <div>
                    <h3 className="text-xl font-semibold flex items-center gap-2"><Phone className="text-primary"/> Check via Customer Care (IVR)</h3>
                    <p className="mt-2 text-muted-foreground">Call LIC’s 24x7 customer care helpline at <code className="bg-muted p-1 rounded">022-68276827</code>. Follow the IVR prompts, select your language, and enter your policy number to hear your details.</p>
                </div>
                 <div>
                    <h3 className="text-xl font-semibold flex items-center gap-2"><Smartphone className="text-primary"/> Check via WhatsApp</h3>
                    <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                        <li>Save LIC’s official WhatsApp number: <code className="bg-muted p-1 rounded">8976862090</code>.</li>
                        <li>Send “Hi” to start the chat.</li>
                        <li>Follow the menu prompts, select “Policy Status”, and provide your policy number when asked.</li>
                    </ol>
                </div>
                 <div>
                    <h3 className="text-xl font-semibold flex items-center gap-2"><Smartphone className="text-primary"/> Check via Mobile App</h3>
                    <p className="mt-2 text-muted-foreground">Download the official “LIC Customer” app, log in or register, and add your policies to view their status and manage them on the go.</p>
                    <Alert variant="destructive" className="mt-4">
                        <ShieldAlert className="h-4 w-4" />
                        <AlertTitle>Security Tip</AlertTitle>
                        <AlertDescription>Never share your login credentials or OTPs. Always use the official LIC website or app to avoid scams.</AlertDescription>
                    </Alert>
                </div>
            </CardContent>
        </Card>

        {/* Benefits Section */}
        <Card className="mb-12">
            <CardHeader>
                <CardTitle className="text-3xl font-headline flex items-center gap-2"><CheckCircle className="text-green-500" /> Benefits of Regular Checks</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="list-disc pl-6 space-y-3 text-muted-foreground">
                    <li><strong>Avoid Lapses:</strong> Stay on top of premium due dates to keep your policy active.</li>
                    <li><strong>Stay Informed:</strong> Verify key details like maturity date, sum assured, and accumulated bonus.</li>
                    <li><strong>Financial Planning:</strong> Check your policy's loan eligibility or bonus accrual to make informed financial decisions.</li>
                    <li><strong>Ensure Accuracy:</strong> Keep your contact and nominee details up-to-date to ensure a smooth claim process.</li>
                </ul>
            </CardContent>
        </Card>

        {/* FAQ Section */}
        <div className="mb-12">
            <h2 className="text-3xl font-headline text-center mb-6">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger>How can I check my LIC policy status by SMS?</AccordionTrigger>
                    <AccordionContent>Send an SMS with the text 'LICHELP &lt;PolicyNumber&gt;' to 9222492224 from your registered mobile number. You'll receive an instant update.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>What is the official LIC WhatsApp number for policy status?</AccordionTrigger>
                    <AccordionContent>The official LIC WhatsApp number is 8976862090. Save this number and send 'Hi' to start the automated service and check your policy details.</AccordionContent>
                </AccordionItem>
                 <AccordionItem value="item-3">
                    <AccordionTrigger>Is registration required to check LIC policy status?</AccordionTrigger>
                    <AccordionContent>No, registration is not mandatory for offline methods like SMS, call, or WhatsApp. You only need to register for the online LIC e-Services portal or the mobile app.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                    <AccordionTrigger>What number should I call to inquire about my LIC policy status?</AccordionTrigger>
                    <AccordionContent>You can call LIC’s customer care helpline at 022-68276827. The automated IVR service is available 24x7.</AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>

        <AuthorCard dictionary={dictionary.author_card} />
        <FooterCta dictionary={dictionary.footer_cta} lang={params.lang} />
      </div>
    </div>
  );
}
