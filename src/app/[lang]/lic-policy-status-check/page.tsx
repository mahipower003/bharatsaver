
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
  const pageUrl = `${siteUrl}/lic-policy-status-check`;
  const title = "How to Check LIC Policy Status Online & Offline (2025 Guide)";
  const description = "The ultimate guide on how to check your LIC policy status online, via SMS, WhatsApp, or the app. Perform an LIC status check by policy number in minutes. Stay updated on premiums, bonuses, and more.";

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
  const pageUrl = `${siteUrl}/lic-policy-status-check`;

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
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline mb-4">How to Check LIC Policy Status Online & Offline (Step-by-Step Guide 2025)</h1>
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
                <p>Let's be honest, life gets busy. It's easy to forget to check in on our LIC policies. But here’s the thing I’ve learned after years in finance: a quick <strong>LIC policy status check</strong> isn't just a chore; it's one of the smartest financial habits you can build. It’s the difference between a policy that protects your family and one that accidentally lapses, leaving them vulnerable.</p>
                <p>Thousands of policies lapse each year simply due to missed payments. The good news? The days of visiting a branch just to get an update are long gone. Now, whether you want to perform an <strong>LIC policy status check online</strong>, via SMS, or even on WhatsApp, you have multiple convenient options at your fingertips. In this guide, I'll walk you through exactly <strong>how to check LIC policy status</strong> using every method available, step-by-step. Let's make sure your hard-earned investment is working for you.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="online-methods" className="mb-12">
            <h2 className="text-3xl font-bold font-headline text-center mb-6">Ways to Check LIC Policy Status Online</h2>
            <Card>
                <CardContent className="space-y-8 p-6">
                    <div>
                        <h3 className="text-xl font-semibold flex items-center gap-2"><LogIn className="text-primary"/>Check Policy Status via LIC Portal – Registered Users</h3>
                        <ol className="list-decimal pl-6 space-y-2 text-muted-foreground mt-4">
                            <li>Visit the <ExternalLink href="https://licindia.in/">LIC India official website (licindia.in)</ExternalLink> and click on “Login to Customer Portal.”</li>
                            <li>Select “Registered User” and enter your User ID and Password to sign in.</li>
                            <li>Once logged in, navigate to the “Policy Status” section. You'll see a list of your linked policies.</li>
                            <li>To perform a detailed <strong>lic status check by policy number</strong>, simply click on the policy you want to review. You'll see all its details: next premium due date, bonus accumulated, and more.</li>
                        </ol>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold flex items-center gap-2"><UserPlus className="text-primary"/>How to Register on the Portal for a New User</h3>
                        <ol className="list-decimal pl-6 space-y-2 text-muted-foreground mt-4">
                            <li>Go to LIC’s official website, click “Login to Customer Portal,” then choose “New User / Sign Up.”</li>
                            <li>Fill out the registration form with your policy number, premium amount, date of birth, mobile number, and email ID.</li>
                            <li>LIC will send a verification link to your email. Click it to activate your account.</li>
                            <li>Log in and use the “Enroll Policy” feature to add your policies. After that, you can check your <strong>LIC policy status online</strong> anytime.</li>
                        </ol>
                         <Alert className="mt-4">
                            <Info className="h-4 w-4" />
                            <AlertTitle>My Pro Tip</AlertTitle>
                            <AlertDescription>When registering, make sure the details you enter match your policy documents exactly. An active mobile number and email are mandatory for verification and future alerts. Once you're in, you can do so much more than just check status—you can pay premiums, download statements, and even check loan eligibility.</AlertDescription>
                        </Alert>
                    </div>
                </CardContent>
            </Card>
        </section>

        <section id="offline-methods" className="mb-12">
            <h2 className="text-3xl font-bold font-headline text-center mb-6">How to Check LIC Policy Status Without Registration (Offline Methods)</h2>
            <Card>
                <CardContent className="space-y-8 p-6">
                    <p className="text-muted-foreground">Not comfortable with online portals? No problem at all. LIC has provided simple and effective ways for a quick <strong>LIC policy status check</strong> without ever logging in. All you need is your policy number and a phone.</p>
                    
                    <div>
                        <h3 className="text-xl font-semibold flex items-center gap-2"><MessageSquare className="text-primary"/>How to Check LIC Policy Status by SMS</h3>
                        <p className="mt-2 text-muted-foreground">This is one of the quickest offline methods. Just follow these steps:</p>
                        <ol className="list-decimal pl-6 space-y-2 text-muted-foreground mt-4">
                            <li>Open the SMS app on your mobile phone.</li>
                            <li>Type a message in the format: <code className="bg-muted p-1 rounded-md font-mono">ASKLIC &lt;PolicyNumber&gt; STAT</code> (e.g., <code className="font-mono">ASKLIC 123456789 STAT</code>).</li>
                            <li>Send this SMS to <code className="bg-muted p-1 rounded-md font-mono">9222492224</code>.</li>
                            <li>You will receive an instant SMS reply with your policy status. For other details, you can use codes like PREMIUM, BONUS, or LOAN instead of STAT.</li>
                        </ol>
                    </div>
                    
                    <div>
                        <h3 className="text-xl font-semibold flex items-center gap-2"><Phone className="text-primary"/>How to Check LIC Policy Status by Phone Call (IVR)</h3>
                        <p className="mt-2 text-muted-foreground">You can also get your policy details through LIC’s automated phone service:</p>
                        <ol className="list-decimal pl-6 space-y-2 text-muted-foreground mt-4">
                            <li>Dial LIC’s integrated customer care number: <code className="bg-muted p-1 rounded-md font-mono">022-68276827</code>.</li>
                            <li>Select your preferred language from the automated menu.</li>
                            <li>Follow the IVR prompts for "Policy Information" and enter your policy number when asked.</li>
                            <li>The system will read out your policy details, including the current <strong>LIC policy status</strong>.</li>
                        </ol>
                    </div>
                    
                    <div>
                        <h3 className="text-xl font-semibold flex items-center gap-2"><WhatsAppIcon className="text-primary h-6 w-6"/>How to Check LIC Policy Status via WhatsApp</h3>
                        <ol className="list-decimal pl-6 space-y-2 text-muted-foreground mt-4">
                            <li>Save LIC’s official WhatsApp number to your contacts: <code className="bg-muted p-1 rounded-md font-mono">8976862090</code>.</li>
                            <li>Open WhatsApp and send a “Hi” message to this number.</li>
                            <li>The LIC chatbot will respond with a list of services. Reply with the number corresponding to “Policy Status.”</li>
                            <li>Provide your policy number when prompted to receive your details directly in the chat.</li>
                        </ol>
                    </div>
                </CardContent>
            </Card>
        </section>
        
        <section id="mobile-app-method" className="mb-12">
            <h2 className="text-3xl font-bold font-headline text-center mb-6">How to Use the LIC Policy Status App</h2>
            <Card>
                <CardContent className="p-6 space-y-4">
                    <p className="text-muted-foreground">For those who prefer managing everything on their smartphone, the official <strong>LIC policy status app</strong>, "LIC Customer," is incredibly useful. It's like having the customer portal in your pocket.</p>
                    <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                        <li><strong>Install the App:</strong> Download “LIC Customer” from the Google Play Store or Apple App Store. Make sure it's the official app from "Life Insurance Corporation of India".</li>
                        <li><strong>Register or Login:</strong> If you're a new user, sign up by entering your policy details. If you've already registered on the LIC portal, you can log in with the same credentials.</li>
                        <li><strong>Check Status:</strong> Once logged in, simply tap on your enrolled policy to see all its details—status, premium due dates, accumulated bonus, and more, all on one dashboard.</li>
                    </ol>
                    <Alert variant="destructive" className="mt-4">
                        <ShieldAlert className="h-4 w-4" />
                        <AlertTitle>A Personal Security Tip</AlertTitle>
                        <AlertDescription>I can't stress this enough: never share your login details or OTPs. LIC will never call you asking for your password. Always use the official website or app for any <strong>LIC policy status check online</strong> to avoid scams.</AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        </section>

        <section id="benefits" className="mb-12">
            <h2 className="text-3xl font-bold font-headline text-center mb-6">Benefits of Regularly Checking Your LIC Policy Status</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">Avoid Missed Payments & Lapses</h3>
                  <p className="text-muted-foreground mt-1">This is the big one. A quick check tells you the next premium due date, helping you avoid late fees and, more importantly, preventing your policy from lapsing. An active policy is the only one that protects your family.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Stay Updated on Bonuses & Loans</h3>
                  <p className="text-muted-foreground mt-1">Is your policy eligible for a loan? How much bonus has it accumulated? A status check gives you a clear picture of your policy's financial health and the liquidity options available to you in an emergency.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Verify Policy Details & Nominee Information</h3>
                  <p className="text-muted-foreground mt-1">Life changes. People move, and contact details get updated. A regular check ensures your personal information and, crucially, your nominee details are correct. This simple step can save your family from immense hassle during a claim.</p>
                </div>
              </CardContent>
            </Card>
        </section>

        <section id="faq" className="mb-12">
            <h2 className="text-3xl font-headline text-center mb-8">Frequently Asked Questions (FAQs)</h2>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger>How can I check my LIC policy status online?</AccordionTrigger>
                    <AccordionContent>The easiest way to perform an <strong>LIC policy status check online</strong> is by registering on the LIC e-Services portal. Once registered, you can log in anytime to view all your policy details in one place.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>How to check LIC policy status by SMS?</AccordionTrigger>
                    <AccordionContent>To do an <strong>LIC policy status check by SMS</strong>, send a text in the format `ASKLIC &lt;YourPolicyNumber&gt; STAT` to `9222492224` from your registered mobile number. You will receive an instant SMS reply with your policy's current status.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger>What is the number to call for LIC policy inquiries?</AccordionTrigger>
                    <AccordionContent>You can call LIC’s centralized customer care helpline at `022-68276827`. The automated IVR service is available 24x7 for a quick <strong>LIC status check by policy number</strong>.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                     <AccordionTrigger>Do I need to register to check policy status offline?</AccordionTrigger>
                     <AccordionContent>No, registration is not required for offline methods like SMS, phone call, or WhatsApp. These methods are designed to work for everyone, as long as you have your policy number handy.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                    <AccordionTrigger>Can I check LIC policy status on WhatsApp?</AccordionTrigger>
                    <AccordionContent>Yes, you can. Just save LIC's official WhatsApp number, `8976862090`, and send a "Hi" message to start the automated chat. It's a quick and convenient way to get updates.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                    <AccordionTrigger>Is the LIC Customer App safe to use?</AccordionTrigger>
                    <AccordionContent>Yes, the "LIC Customer" app is the official <strong>LIC policy status app</strong>. It is secure to use, provided you download it from the official Google Play Store or Apple App Store. Always be wary of fake apps.</AccordionContent>
                </AccordionItem>
                 <AccordionItem value="item-7">
                    <AccordionTrigger>What information do I need to check my policy status?</AccordionTrigger>
                    <AccordionContent>For almost all methods, your <strong>policy number</strong> is the most critical piece of information. If you are registering online for the first time, you may also need details like your date of birth and the premium amount, which can be found on your policy document.</AccordionContent>
                </AccordionItem>
            </Accordion>
        </section>

        <section id="conclusion" className="text-center">
            <h2 className="text-3xl font-headline mb-4">Conclusion: Stay Informed, Stay Protected</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">Staying on top of your LIC policy is easier today than ever before. It's no longer a chore but a simple, quick check-in that gives you control over your financial security. A regular <strong>LIC policy status</strong> update is a small habit that pays huge dividends in peace of mind. Use the steps I’ve outlined in this guide to stay informed and ensure the promises you've made to your family are always protected.</p>
        </section>

        <AuthorCard dictionary={dictionary.author_card} />
        <FooterCta dictionary={dictionary.footer_cta} lang={params.lang} />
      </div>
    </div>
  );
}
