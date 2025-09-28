
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
  const pageUrl = `${siteUrl}/lic-policy-status-check`;
  const title = "How to Check LIC Policy Status Online & Offline (SMS, Call, App, WhatsApp) – Step-by-Step Guide 2025";
  const description = "Learn how to check your LIC policy status easily in 2025 – online via LIC portal, SMS, customer care, WhatsApp, and LIC mobile app. Step-by-step guide with numbers, codes, and FAQs. Stay updated on premium due dates, bonuses, and policy details.";

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
        acc[locale] = `${siteUrl}/${locale}/lic-policy-status-check`;
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
      <path d="M21.1 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
);


export default async function LicStatusPage({ params }: { params: { lang: Locale } }) {
  const dictionary = await getDictionary(params.lang);
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${params.lang}/lic-policy-status-check`;

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
            <p className="mt-6 text-muted-foreground">Many LIC policyholders forget to monitor their policy status routinely. This can lead to missed premium payments and even policy lapses, meaning loss of coverage and benefits. In fact, thousands of LIC policies lapse each year due to non-payment. The good news is that LIC now offers multiple convenient ways to check your policy status — without needing to visit a branch or agent as was necessary in the past. By checking your policy status, you can see details like next premium due date, policy term, maturity date, bonus accumulated, loan availability, and more. This empowers you to keep your policy active and plan your finances better.</p>
            <p className="mt-4 text-muted-foreground">In this comprehensive guide, we’ll cover all the methods to check your LIC policy status step-by-step. Whether you prefer using the online portal, mobile app, sending an SMS, calling customer care, or even using WhatsApp, we have you covered. Follow these SEO-optimized steps (in English with some regional language insights) to easily track your LIC policy details and ensure you never miss an important update.</p>
          </CardContent>
        </Card>
        
        {/* Online Methods */}
        <Card className="mb-12">
          <CardHeader>
              <CardTitle className="text-3xl font-headline">Check LIC Policy Status Online via LIC e-Services Portal (Website)</CardTitle>
              <CardDescription>LIC’s official website allows you to check your policy status and details online through the e-Services customer portal. If you already have an account (registered user) on LIC’s portal, you can log in and see all your policy details. If you’re a new user, you will need to complete a one-time registration first. Here are the steps for both:</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
              <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2"><LogIn className="text-primary"/> For Existing Registered Users (Login to Portal)</h3>
                  <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                      <li>Visit the <ExternalLink href="https://licindia.in/">LIC India official website (licindia.in)</ExternalLink> and click on “Login to Customer Portal” (usually found on the homepage).</li>
                      <li>Select “Registered User” and enter your LIC User ID and Password to sign in. (If you forgot your credentials, you can use the Forgot Password option.)</li>
                      <li>Once logged in, navigate to the “Policy Status” section of the portal. You will see a list of your linked policies and their basic details.</li>
                      <li>View policy details: Click on a policy number to view its status and details (e.g. next premium due date, policy term, sum assured, bonus accumulated, etc.). If you have multiple policies and some are not listed, use the “Enroll Policy” option to add them using the policy number.</li>
                  </ol>
                  <p className="text-sm italic text-muted-foreground pl-6">Note: Ensure that you have your policy number handy when logging in. If a policy isn’t linked to your online account yet, you might need to add it via the “Enroll Policy” feature by entering the policy number and other details.</p>
              </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2"><UserPlus className="text-primary"/> For New Users (One-Time Registration on Portal)</h3>
                  <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                      <li>Go to LIC’s official website and click “Login to Customer Portal”, then choose “New User / Sign Up” on the login page.</li>
                      <li>Fill the registration form: Provide the required details, including your LIC policy number, installment premium amount, date of birth, mobile number, email ID, and other required info. Choose a unique User ID and password during this sign-up process.</li>
                      <li>Verify your account: After submitting the form, LIC will send a verification link to your registered email (and/or an OTP to your phone). Click the email link (or enter the OTP) to activate your new LIC online account.</li>
                      <li>Log in and add policies: Now log in with the User ID and password you created. Once logged in, you may need to enroll your policy by entering your policy number and other details to view it in the portal (follow the on-screen instructions). After adding your policy, you can click on “Policy Status” to see the status and details of your policy online.</li>
                  </ol>
              </div>
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Pro Tip</AlertTitle>
                  <AlertDescription>During registration, make sure the details you enter (policy number, premium amount, DOB, etc.) exactly match those on your policy documents. You’ll need an active mobile number and email to register (for verification and future alerts). Once registered, you can log in anytime to check premium due dates, policy statements, loan eligibility and even pay premiums or update contact information online.</AlertDescription>
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
                    <h3 className="text-xl font-semibold flex items-center gap-2"><WhatsAppIcon className="text-primary h-6 w-6"/> Check via WhatsApp</h3>
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
