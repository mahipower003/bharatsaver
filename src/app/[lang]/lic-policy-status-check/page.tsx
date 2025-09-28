
import type { Metadata } from "next";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LogIn, UserPlus, Phone, MessageSquare, Smartphone, CheckCircle, Info, ShieldAlert, TrendingUp } from "lucide-react";
import { AuthorCard } from "@/components/layout/AuthorCard";
import { FooterCta } from "@/components/layout/FooterCta";
import { getDictionary } from "@/lib/dictionaries";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${params.lang}/lic-policy-status-check`;
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
        {"@type": "HowToStep", "name": "Step 1: Visit Portal", "text": "Go to licindia.in and click on 'Login to Customer Portal'."},
        {"@type": "HowToStep", "name": "Step 2: Login/Register", "text": "Log in if you are an existing user or sign up as a new user by providing policy details."},
        {"@type": "HowToStep", "name": "Step 3: Navigate to Policy Status", "text": "Once logged in, find and click on the 'Policy Status' or 'Enrolled Policies' section."},
        {"@type": "HowToStep", "name": "Step 4: View Details", "text": "Click on the specific policy number to see all its details, including premium due dates, bonus, and loan eligibility."}
    ]
  };

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/lic-policy-status-check`,
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
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline mb-4">How to Check LIC Policy Status Online &amp; Offline (Step-by-Step Guide 2025)</h1>
        </header>

        <section id="why-check-status" className="mb-12">
          <h2 className="text-3xl font-bold font-headline text-center mb-6">Why Checking Your LIC Policy Status Matters</h2>
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <Image 
                  src="/images/lic-building.png" 
                  alt="The LIC (Life Insurance Corporation of India) building in New Delhi."
                  width={800}
                  height={450}
                  className="rounded-lg mb-6"
                  data-ai-hint="LIC building"
                  priority
              />
              <div className="prose dark:prose-invert max-w-none text-muted-foreground">
                <p>Many LIC policyholders forget to monitor their policy status routinely. This can lead to missed premium payments and even policy lapses, meaning loss of coverage and benefits. In fact, thousands of LIC policies lapse each year due to non-payment. The good news is that LIC now offers multiple convenient ways to check your policy status — without needing to visit a branch or agent as was necessary in the past. By checking your policy status, you can see details like next premium due date, policy term, maturity date, bonus accumulated, loan availability, and more. This empowers you to keep your policy active and plan your finances better.</p>
                <p>In this comprehensive guide, we’ll cover all the methods to check your LIC policy status step-by-step. Whether you prefer using the online portal, mobile app, sending an SMS, calling customer care, or even using WhatsApp, we have you covered.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="online-methods" className="mb-12">
            <h2 className="text-3xl font-bold font-headline text-center mb-6">Ways to Check LIC Policy Status Online</h2>
            <Card>
                <CardContent className="space-y-8 p-6">
                    <div>
                        <h3 className="text-xl font-semibold flex items-center gap-2"><LogIn className="text-primary"/>Check Policy Status via LIC Portal – Registered Users (Login Method)</h3>
                        <ol className="list-decimal pl-6 space-y-2 text-muted-foreground mt-4">
                            <li>Visit the <ExternalLink href="https://licindia.in/">LIC India official website (licindia.in)</ExternalLink> and click on “Login to Customer Portal”.</li>
                            <li>Select “Registered User” and enter your LIC User ID and Password to sign in.</li>
                            <li>Once logged in, navigate to the “Policy Status” section of the portal.</li>
                            <li>Click on a policy number to view its status and details. If you have multiple policies and some are not listed, use the “Enroll Policy” option to add them using the policy number.</li>
                        </ol>
                        <p className="pl-6 text-sm italic text-muted-foreground mt-2">Note: Ensure that you have your policy number handy when logging in.</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold flex items-center gap-2"><UserPlus className="text-primary"/>Check Policy Status via LIC Portal – New User Registration (Sign-Up Method)</h3>
                        <ol className="list-decimal pl-6 space-y-2 text-muted-foreground mt-4">
                            <li>Go to LIC’s official website and click “Login to Customer Portal”, then choose “New User / Sign Up” on the login page.</li>
                            <li>Fill the registration form: Provide the required details, including your LIC policy number, installment premium amount, date of birth, mobile number, and email ID.</li>
                            <li>Verify your account: After submitting, LIC will send a verification link to your email. Click it to activate your account.</li>
                            <li>Log in and add policies: Log in with your new credentials. You may need to enroll your policy by entering your policy number to view it in the portal.</li>
                        </ol>
                        <Alert className="mt-4">
                            <Info className="h-4 w-4" />
                            <AlertTitle>Pro Tip</AlertTitle>
                            <AlertDescription>During registration, make sure the details you enter exactly match those on your policy documents. An active mobile number and email are mandatory.</AlertDescription>
                        </Alert>
                    </div>
                </CardContent>
            </Card>
        </section>

        <section id="offline-methods" className="mb-12">
            <h2 className="text-3xl font-bold font-headline text-center mb-6">How to Check LIC Policy Status Without Registration (Offline Methods)</h2>
            <Card>
                <CardContent className="space-y-8 p-6">
                    <p className="text-muted-foreground">Not comfortable with online registration? No worries. LIC has provided ways to check your policy status without logging in to the website. These offline methods are quick and handy, especially if you don’t have immediate internet access. You can use SMS, phone call (IVR/customer care), or WhatsApp to inquire about your policy. All you need is your policy number and a phone. Below, we explain each method step-by-step.</p>
                    
                    <div>
                        <h3 className="text-xl font-semibold flex items-center gap-2"><MessageSquare className="text-primary"/>Check LIC Policy Status by SMS (Text Message)</h3>
                        <p className="mt-2 text-muted-foreground">One of the easiest ways to get your LIC policy status without any internet or login is through SMS. Follow these steps:</p>
                        <ol className="list-decimal pl-6 space-y-2 text-muted-foreground mt-4">
                            <li>Open the SMS app on your registered mobile phone.</li>
                            <li>Type a message in the format: <code className="bg-muted p-1 rounded-md font-mono">LICHELP &lt;PolicyNumber&gt;</code>.</li>
                            <li>Send the SMS to <code className="bg-muted p-1 rounded-md font-mono">9222492224</code>.</li>
                            <li>You will get an SMS reply from LIC with your policy status details.</li>
                        </ol>
                        <p className="mt-2 text-sm text-muted-foreground"><strong>Example:</strong> Text <code className="font-mono">LICHELP 987654321</code> to <code className="font-mono">9222492224</code>.</p>
                        <p className="mt-2 text-sm text-muted-foreground"><strong>Note:</strong> You can also get specific details by texting <code className="font-mono">ASKLIC &lt;PolicyNumber&gt; PREMIUM</code> or <code className="font-mono">BONUS</code> or <code className="font-mono">LOAN</code> to the same number.</p>
                    </div>
                    
                    <div>
                        <h3 className="text-xl font-semibold flex items-center gap-2"><Phone className="text-primary"/>Check LIC Policy Status by Calling Customer Care (IVR)</h3>
                        <p className="mt-2 text-muted-foreground">Another convenient offline method is to call LIC’s customer care helpline:</p>
                        <ol className="list-decimal pl-6 space-y-2 text-muted-foreground mt-4">
                            <li>Dial <code className="bg-muted p-1 rounded-md font-mono">022-68276827</code> from your phone.</li>
                            <li>Follow the IVR menu to select your language and choose the option for “Policy Status”.</li>
                            <li>Enter your policy number using the phone keypad when prompted.</li>
                            <li>Listen to the automated response which will provide your policy details.</li>
                        </ol>
                        <p className="mt-2 text-sm text-muted-foreground"><strong>Tip:</strong> The IVRS is available 24x7. Keep your policy number ready before calling.</p>
                    </div>
                    
                    <div>
                        <h3 className="text-xl font-semibold flex items-center gap-2"><WhatsAppIcon className="text-primary h-6 w-6"/>Check LIC Policy Status via WhatsApp</h3>
                        <p className="mt-2 text-muted-foreground">LIC has an official WhatsApp service for quick queries:</p>
                        <ol className="list-decimal pl-6 space-y-2 text-muted-foreground mt-4">
                            <li>Save LIC’s official WhatsApp number: <code className="bg-muted p-1 rounded-md font-mono">8976862090</code>.</li>
                            <li>Send “Hi” to start the conversation with the chatbot.</li>
                            <li>From the menu of options, reply with the number corresponding to “Policy Status”.</li>
                            <li>Provide your policy number when asked to get your details instantly.</li>
                        </ol>
                        <p className="mt-2 text-sm text-muted-foreground">This service works 24/7 and no registration is needed.</p>
                    </div>
                </CardContent>
            </Card>
        </section>
        
        <section id="mobile-app-method" className="mb-12">
            <h2 className="text-3xl font-bold font-headline text-center mb-6">Check LIC Policy Status via LIC Mobile App (LIC Customer App)</h2>
            <Card>
                <CardContent className="p-6">
                    <p className="mt-2 text-muted-foreground">Download the official “LIC Customer” app, log in or register, and add your policies to view their status and manage them on the go.</p>
                    <Alert variant="destructive" className="mt-4">
                        <ShieldAlert className="h-4 w-4" />
                        <AlertTitle>Security Tip</AlertTitle>
                        <AlertDescription>Never share your login credentials or OTPs. Always use the official LIC website or app to avoid scams.</AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        </section>

        <section id="benefits" className="mb-12">
            <h2 className="text-3xl font-bold font-headline text-center mb-6">Benefits of Regularly Checking LIC Policy Status</h2>
            <Card>
                <CardContent className="p-6 space-y-4">
                    <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2"><TrendingUp className="text-primary"/>Avoid Missed Premium Payments & Lapses</h3>
                        <p className="text-muted-foreground mt-1">Stay on top of premium due dates to keep your policy active and avoid losing coverage.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2"><Info className="text-primary"/>Stay Updated on Bonuses & Loans</h3>
                        <p className="text-muted-foreground mt-1">Check your policy's loan eligibility or bonus accrual to make informed financial decisions.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2"><UserPlus className="text-primary"/>Verify Policy Details & Nominee Information</h3>
                        <p className="text-muted-foreground mt-1">Keep your contact and nominee details up-to-date to ensure a smooth claim process.</p>
                    </div>
                </CardContent>
            </Card>
        </section>

        <section id="faq" className="mb-12">
            <h2 className="text-3xl font-headline text-center mb-8">Frequently Asked Questions (FAQs)</h2>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger>How can I check my LIC policy status online?</AccordionTrigger>
                    <AccordionContent>Visit the LIC e-Services portal, log in or register, and navigate to the 'Policy Status' section to view details of your enrolled policies.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>How to check LIC policy status by SMS?</AccordionTrigger>
                    <AccordionContent>Send an SMS with the text 'LICHELP &lt;PolicyNumber&gt;' to 9222492224 from your registered mobile number. You'll receive an instant update.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger>What is the number to call for LIC policy inquiries?</AccordionTrigger>
                    <AccordionContent>You can call LIC’s customer care helpline at 022-68276827. The automated IVR service is available 24x7.</AccordionContent>
                </AccordionItem>
                 <AccordionItem value="item-4">
                    <AccordionTrigger>Do I need to register to check policy status offline?</AccordionTrigger>
                    <AccordionContent>No, registration is not mandatory for offline methods like SMS, phone call, or WhatsApp. You only need your policy number.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                    <AccordionTrigger>Can I check LIC policy status on WhatsApp?</AccordionTrigger>
                    <AccordionContent>Yes, save the official LIC WhatsApp number 8976862090 and send 'Hi' to start the automated service to check your policy details.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                    <AccordionTrigger>Is the LIC Customer App safe to use?</AccordionTrigger>
                    <AccordionContent>Yes, the "LIC Customer" app is the official and secure application from LIC. Always download it from the official Google Play Store or Apple App Store to ensure authenticity.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-7">
                    <AccordionTrigger>What information do I need to check my policy status?</AccordionTrigger>
                    <AccordionContent>The most important piece of information is your LIC policy number. For first-time online registration, you may also need details like premium amount and date of birth.</AccordionContent>
                </AccordionItem>
            </Accordion>
        </section>

        <section id="conclusion" className="text-center">
            <h2 className="text-3xl font-headline mb-4">Conclusion: Stay Informed, Stay Protected</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">Checking your LIC policy status is now easier than ever. By following the step-by-step guide above, you can confidently track your policy’s status anytime and ensure that your valuable insurance policy remains in force and continues to protect you and your family.</p>
        </section>

        <AuthorCard dictionary={dictionary.author_card} />
        <FooterCta dictionary={dictionary.footer_cta} lang={params.lang} />
      </div>
    </div>
  );
}

