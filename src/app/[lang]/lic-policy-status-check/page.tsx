
import type { Metadata } from "next";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LogIn, UserPlus, Phone, MessageSquare, Smartphone, CheckCircle, Info, ShieldAlert, TrendingUp, Star } from "lucide-react";
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
        {"@type": "Question","name": "How can I check my LIC policy status by SMS?","acceptedAnswer": {"@type": "Answer","text": "Send an SMS with the text 'ASKLIC <PolicyNumber> STAT' to 9222492224 from your registered mobile number to get an instant update on your policy status."}},
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
        
        <header className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline mb-4 text-center">How to Check LIC Policy Status Online & Offline (Step-by-Step Guide 2025)</h1>
        </header>

        <section id="why-check-status" className="mb-12">
          <Card className="shadow-lg">
            <CardHeader>
                <h2 className="text-3xl font-bold font-headline text-center">Why Checking Your LIC Policy Status Matters</h2>
            </CardHeader>
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

        <section id="online-methods" className="mb-12 space-y-8">
            <h2 className="text-3xl font-bold font-headline text-center">Ways to Check LIC Policy Status Online</h2>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><LogIn className="text-primary h-7 w-7" />Check Policy Status via LIC Portal – Registered Users (Login Method)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                        <li>Visit the <ExternalLink href="https://licindia.in/">LIC India official website (licindia.in)</ExternalLink> and click on “Login to Customer Portal” (usually found on the homepage).</li>
                        <li>Select “Registered User” and enter your LIC User ID and Password to sign in. (If you forgot your credentials, you can use the Forgot Password option.)</li>
                        <li>Once logged in, navigate to the “Policy Status” section of the portal. You will see a list of your linked policies and their basic details.</li>
                        <li>View policy details: Click on a policy number to view its status and details (e.g. next premium due date, policy term, sum assured, bonus accumulated, etc.). If you have multiple policies and some are not listed, use the “Enroll Policy” option to add them using the policy number.</li>
                    </ol>
                    <p className="text-sm text-muted-foreground">Note: Ensure that you have your policy number handy when logging in. If a policy isn’t linked to your online account yet, you might need to add it via the “Enroll Policy” feature by entering the policy number and other details.</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><UserPlus className="text-primary h-7 w-7" />Check Policy Status via LIC Portal – New User Registration (Sign-Up Method)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">If you’ve never used LIC’s online services before, follow these steps to register and then check your status:</p>
                    <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                        <li>Go to LIC’s official website and click “Login to Customer Portal”, then choose “New User / Sign Up” on the login page.</li>
                        <li>Fill the registration form: Provide the required details, including your LIC policy number, installment premium amount, date of birth, mobile number, email ID, and other required info. Choose a unique User ID and password during this sign-up process.</li>
                        <li>Verify your account: After submitting the form, LIC will send a verification link to your registered email (and/or an OTP to your phone). Click the email link (or enter the OTP) to activate your new LIC online account.</li>
                        <li>Log in and add policies: Now log in with the User ID and password you created. Once logged in, you may need to enroll your policy by entering your policy number and other details to view it in the portal (follow the on-screen instructions). After adding your policy, you can click on “Policy Status” to see the status and details of your policy online.</li>
                    </ol>
                    <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>My Pro Tip</AlertTitle>
                        <AlertDescription>During registration, make sure the details you enter (policy number, premium amount, DOB, etc.) exactly match those on your policy documents. You’ll need an active mobile number and email to register (for verification and future alerts). Once registered, you can log in anytime to check premium due dates, policy statements, loan eligibility and even pay premiums or update contact information online.</AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        </section>

        <section id="offline-methods" className="mb-12 space-y-8">
            <h2 className="text-3xl font-bold font-headline text-center">How to Check LIC Policy Status Without Registration (Offline Methods)</h2>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><MessageSquare className="text-primary h-7 w-7"/>Check LIC Policy Status by SMS (LICHELP Code)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">One of the easiest ways to get your lic policy status without any internet or login is through SMS. LIC has SMS short codes that allow you to retrieve policy information instantly. Follow these steps:</p>
                    <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                        <li>Open the SMS app on your registered mobile phone.</li>
                        <li>Type a message in the format: <code className="bg-muted p-1 rounded font-mono">LICHELP &lt;PolicyNumber&gt;</code> (e.g., if your policy number is 123456789, type <code className="font-mono">LICHELP 123456789</code>).</li>
                        <li>Send the SMS to <code className="bg-muted p-1 rounded font-mono">9222492224</code> (LIC’s SMS helpline number). You can also use the alternate number <code className="bg-muted p-1 rounded font-mono">56767877</code> – both numbers work for LIC policy inquiries.</li>
                        <li>Receive policy status: Within a few seconds, you will get an SMS reply from LIC with your policy status details.</li>
                    </ol>
                    <p className="text-sm text-muted-foreground mt-2"><strong>Note:</strong> Make sure to send the SMS from the mobile number registered with your LIC policy. For a quick policy status, the LICHELP SMS to 9222492224 is the easiest to remember.</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><Phone className="text-primary h-7 w-7"/>Check LIC Policy Status by Phone Call (Customer Care / IVR)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <p className="text-muted-foreground">Another convenient offline method is to call LIC’s customer care helpline and use their IVR (Interactive Voice Response) system.</p>
                    <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                        <li>Dial the LIC Customer Care number <code className="bg-muted p-1 rounded font-mono">022-68276827</code>.</li>
                        <li>Choose your preferred language and select the menu option for Policy Status or Policy Details.</li>
                        <li>When prompted, enter your policy number using the phone keypad.</li>
                        <li>Listen to your policy status: The IVR system will retrieve and read out your policy information.</li>
                    </ol>
                    <Alert className="mt-4">
                      <Info className="h-4 w-4" />
                      <AlertTitle>Helpline Availability</AlertTitle>
                      <AlertDescription>LIC’s IVRS helpline is available 24x7 for basic automated services. Live support is generally available Monday to Friday, 8:00 a.m. to 8:00 p.m.</AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><WhatsAppIcon className="text-primary h-7 w-7"/>Check LIC Policy Status via WhatsApp (LIC Chatbot Service)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">LIC has introduced an official WhatsApp service to assist policyholders. To use this service:</p>
                    <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                        <li>Save LIC’s official WhatsApp number to your contacts: <code className="bg-muted p-1 rounded font-mono">8976862090</code>.</li>
                        <li>Open WhatsApp and send a “Hi” message to this number.</li>
                        <li>The LIC chatbot will respond with a list of services. Reply with the number corresponding to “Policy Status.”</li>
                        <li>Provide your policy number when prompted to receive your details directly in the chat.</li>
                    </ol>
                </CardContent>
            </Card>
        </section>

        <section id="mobile-app-method" className="mb-12">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><Smartphone className="text-primary h-7 w-7"/>How to Use the LIC Policy Status App (LIC Customer App)</CardTitle>
                </CardHeader>
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
                        <AlertDescription>I can't stress this enough: never share your login details or OTPs. LIC will never call you asking for your password. Always use the official website or app for any <strong>lic policy status check online</strong> to avoid scams.</AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        </section>

        <section id="benefits" className="mb-12">
          <Card>
            <CardHeader>
                <h2 className="text-3xl font-bold font-headline text-center">Benefits of Regularly Checking Your LIC Policy Status</h2>
            </CardHeader>
              <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg flex items-center gap-2"><CheckCircle className="text-green-500"/>Avoid Missed Premium Payments & Lapses</h3>
                  <p className="text-muted-foreground mt-1">By checking your status, you’ll always know when the next premium is due, so you can pay on time. This prevents your policy from lapsing due to missed payments.</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg flex items-center gap-2"><TrendingUp className="text-primary"/>Stay Updated on Bonuses & Loans</h3>
                  <p className="text-muted-foreground mt-1">You can see if your policy has acquired a loan value or bonuses. This gives a clear picture of your policy’s performance and value over time.</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg flex items-center gap-2"><UserPlus className="text-primary"/>Verify Policy Details & Nominee Information</h3>
                  <p className="text-muted-foreground mt-1">Regular checks let you verify that your personal details (like nominee name, contact info) are correct in LIC’s records, ensuring a smooth claim process.</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg flex items-center gap-2"><Star className="text-accent"/>Peace of Mind</h3>
                  <p className="text-muted-foreground mt-1">Ultimately, staying updated with your policy status gives you peace of mind. You know your coverage is in-force and you understand the benefits accumulating.</p>
                </div>
              </CardContent>
            </Card>
        </section>

        <section id="faq" className="mb-12">
            <h2 className="text-3xl font-headline text-center mb-8">Frequently Asked Questions (FAQs)</h2>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger>How can I check my LIC policy status by SMS?</AccordionTrigger>
                    <AccordionContent>To check via SMS, simply send a text message in the format <code className="bg-muted p-1 rounded font-mono">LICHELP &lt;PolicyNumber&gt;</code> from your registered mobile number to <code className="bg-muted p-1 rounded font-mono">9222492224</code> (or <code className="bg-muted p-1 rounded font-mono">56767877</code>). You will receive an SMS reply from LIC with the current status and details of your policy (e.g. next premium due date, policy status, etc.). This service does not require any online registration – it’s quick and works 24/7.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>What number should I call to inquire about my LIC policy status?</AccordionTrigger>
                    <AccordionContent>You can call LIC’s customer care helpline at 📞 <code className="bg-muted p-1 rounded font-mono">022-68276827</code> to check your policy status. The automated IVR service is available 24x7 (with live support from 8 a.m. to 8 p.m., Monday–Friday). Just follow the instructions and enter your policy number when prompted, and you’ll hear your policy details. Support is available in English, Hindi, and several regional languages for your convenience.</AccordionContent>
                </AccordionItem>
                 <AccordionItem value="item-3">
                    <AccordionTrigger>Do I need to register on the LIC portal to get my policy status via SMS or call?</AccordionTrigger>
                    <AccordionContent>No. Registration on the LIC online portal is not required for checking status via SMS or phone call. The SMS and IVR methods work for all policyholders as long as you have your policy number and (for SMS) use the phone number that you’ve registered with LIC. These are meant to be “offline” alternatives, so even unregistered/new users can get their policy info easily.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                    <AccordionTrigger>In which languages is the LIC phone helpline service available?</AccordionTrigger>
                    <AccordionContent>The LIC IVR phone service is offered in English, Hindi, and 8 regional Indian languages. When you call, you can select your preferred language (such as Marathi, Gujarati, Tamil, Bengali, etc.) from the menu. This ensures that policyholders across different states can get assistance in a language they are comfortable with.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                    <AccordionTrigger>Is the LIC SMS service for policy status available 24/7?</AccordionTrigger>
                    <AccordionContent>Yes, absolutely. You can send the SMS query anytime, 24x7 and you will receive an automatic reply with your policy information shortly after. The SMS helpline doesn’t depend on office hours. Keep in mind that if you don’t get a reply immediately, there might be a slight network delay, but generally the service is available round the clock.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                    <AccordionTrigger>Is there an official LIC mobile app to check policy details?</AccordionTrigger>
                    <AccordionContent>Yes, LIC offers an official app called the “LIC Customer” app (LIC Digital App) for Android and iOS. You can download this app and log in with your LIC online credentials (or register a new account). The app allows you to view your policy status, see premium due dates, pay premiums online, download policy statements, and even track claims – all from your mobile phone. It’s an authorized app by LIC, so it’s safe to use. Make sure you only download the genuine LIC app (developed by LIC of India) for security.</AccordionContent>
                </AccordionItem>
                 <AccordionItem value="item-7">
                    <AccordionTrigger>What information do I need handy to check my LIC policy status?</AccordionTrigger>
                    <AccordionContent>For any of the methods, the most important piece of information is your LIC policy number. Whether you are logging into the portal/app, sending an SMS, or calling customer care, you will be asked for the policy number to retrieve the details. If using online methods (portal or app) as a new user, you’ll also need details like date of birth, registered mobile number, email, and policy premium amount during the one-time registration process. It’s a good practice to keep your policy bond or policy document handy, where all these details are listed, whenever you attempt to check your policy status.</AccordionContent>
                </AccordionItem>
            </Accordion>
        </section>

        <Card className="mt-12 shadow-lg bg-accent/10 border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl font-bold justify-center">
              <Star className="h-7 w-7 text-accent" />
              Conclusion
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground max-w-3xl mx-auto">
            <p>Checking your LIC policy status is now easier than ever. With methods like the online portal, SMS, WhatsApp, and the mobile app, you can get up-to-date information in minutes. This helps you avoid missed payments, stay informed about your policy’s growth, and ensure your family remains protected. An informed policyholder is a smart policyholder—use these tools to stay in control of your financial future.</p>
          </CardContent>
        </Card>

        <AuthorCard dictionary={dictionary.author_card} />
        <FooterCta dictionary={dictionary.footer_cta} lang={params.lang} />
      </div>
    </div>
  );
}



