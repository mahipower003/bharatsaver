
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
                <p>In this comprehensive guide, we’ll cover all the methods to check your LIC policy status step-by-step. Whether you prefer using the online portal, mobile app, sending an SMS, calling customer care, or even using WhatsApp, we have you covered. Follow these SEO-optimized steps (in English with some regional language insights) to easily track your LIC policy details and ensure you never miss an important update.</p>
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
                          <li>Visit the <ExternalLink href="https://licindia.in/">LIC India official website (licindia.in)</ExternalLink> and click on “Login to Customer Portal” (usually found on the homepage).</li>
                          <li>Select “Registered User” and enter your LIC User ID and Password to sign in. (If you forgot your credentials, you can use the Forgot Password option.)</li>
                          <li>Once logged in, navigate to the “Policy Status” section of the portal. You will see a list of your linked policies and their basic details.</li>
                          <li>View policy details: Click on a policy number to view its status and details (e.g. next premium due date, policy term, sum assured, bonus accumulated, etc.). If you have multiple policies and some are not listed, use the “Enroll Policy” option to add them using the policy number.</li>
                        </ol>
                        <p className="pl-6 text-sm italic text-muted-foreground mt-2">Note: Ensure that you have your policy number handy when logging in. If a policy isn’t linked to your online account yet, you might need to add it via the “Enroll Policy” feature by entering the policy number and other details.</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold flex items-center gap-2"><UserPlus className="text-primary"/>Check Policy Status via LIC Portal – New User Registration (Sign-Up Method)</h3>
                        <ol className="list-decimal pl-6 space-y-2 text-muted-foreground mt-4">
                          <li>Go to LIC’s official website and click “Login to Customer Portal”, then choose “New User / Sign Up” on the login page.</li>
                          <li>Fill the registration form: Provide the required details, including your LIC policy number, installment premium amount, date of birth, mobile number, and email ID. Choose a unique User ID and password during this sign-up process.</li>
                          <li>Verify your account: After submitting the form, LIC will send a verification link to your registered email (and/or an OTP to your phone). Click the email link (or enter the OTP) to activate your new LIC online account.</li>
                          <li>Log in and add policies: Now log in with the User ID and password you created. Once logged in, you may need to enroll your policy by entering your policy number and other details to view it in the portal (follow the on-screen instructions). After adding your policy, you can click on “Policy Status” to see the status and details of your policy online.</li>
                        </ol>
                         <Alert className="mt-4">
                            <Info className="h-4 w-4" />
                            <AlertTitle>Pro Tip</AlertTitle>
                            <AlertDescription>During registration, make sure the details you enter (policy number, premium amount, DOB, etc.) exactly match those on your policy documents. You’ll need an active mobile number and email to register (for verification and future alerts). Once registered, you can log in anytime to check premium due dates, policy statements, loan eligibility and even pay premiums or update contact information online.</AlertDescription>
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
                        <p className="mt-2 text-muted-foreground">One of the easiest ways to get your LIC policy status without any internet or login is through SMS. LIC has SMS short codes that allow you to retrieve policy information instantly. Follow these steps:</p>
                        <ol className="list-decimal pl-6 space-y-2 text-muted-foreground mt-4">
                            <li>Open the SMS app on your registered mobile phone.</li>
                            <li>Type a message in the format: <code className="bg-muted p-1 rounded-md font-mono">LICHELP &lt;PolicyNumber&gt;</code> (e.g., if your policy number is 123456789, type LICHELP 123456789).</li>
                            <li>Send the SMS to <code className="bg-muted p-1 rounded-md font-mono">9222492224</code> (LIC’s SMS helpline number). You can also use the alternate number 56767877 – both numbers work for LIC policy inquiries.</li>
                            <li>Receive policy status: Within a few seconds, you will get an SMS reply from LIC with your policy status details. The reply typically includes information like the policy status (in-force or lapsed), next premium due date, premium amount, etc., for that policy.</li>
                        </ol>
                        <p className="mt-2 text-sm text-muted-foreground"><strong>Example:</strong> If your LIC policy number is 987654321, text <code className="font-mono">LICHELP 987654321</code> to <code className="font-mono">9222492224</code>. LIC will respond with a message such as: “Policy No. 987654321 is in force. Next premium due on 28/02/2026. Sum Assured: Rs X lakhs…”, or similar details.</p>
                        <p className="mt-2 text-sm text-muted-foreground"><strong>Note:</strong> Make sure to send the SMS from the mobile number registered with your LIC policy, so that you receive the information promptly. If your number isn’t updated with LIC, you might not get a response or the details might be limited.</p>
                        <p className="mt-4 text-sm text-muted-foreground"><strong>Additional SMS Enquiry Options:</strong> The simple LICHELP SMS gives you the basic status. LIC also supports specific SMS codes for detailed inquiries. For example, you can text <code className="font-mono">ASKLIC &lt;PolicyNumber&gt; PREMIUM</code> to get premium amount and payment frequency, <code className="font-mono">ASKLIC &lt;PolicyNumber&gt; BONUS</code> to know the bonus accrued, or <code className="font-mono">ASKLIC &lt;PolicyNumber&gt; LOAN</code> to check loan amount available on your policy. There are codes for other info like REVIVAL (revival amount if policy lapsed), NOM (nominee details), STAT (policy status) etc. For a quick policy status though, the LICHELP SMS to 9222492224 is the easiest to remember.</p>
                    </div>
                    
                    <div>
                        <h3 className="text-xl font-semibold flex items-center gap-2"><Phone className="text-primary"/>Check LIC Policy Status by Calling Customer Care (IVR)</h3>
                        <p className="mt-2 text-muted-foreground">Another convenient offline method is to call LIC’s customer care helpline and use their IVR (Interactive Voice Response) system. LIC’s phone helpline can provide policy details after verifying your identity. Here’s how to use the call method:</p>
                        <ol className="list-decimal pl-6 space-y-2 text-muted-foreground mt-4">
                            <li>Dial the LIC Customer Care number <code className="bg-muted p-1 rounded-md font-mono">022-68276827</code> (prefix with +91 if calling from outside India). This is LIC’s centralized call center number for policy inquiries.</li>
                            <li>Choose language and service: You will hear an automated menu. Select your preferred language (the service is available in English, Hindi, and 8 regional languages). Then choose the menu option for Policy Status or Policy Details (the IVR options will guide you – typically, you might press a number for “Policy information”).</li>
                            <li>Enter policy details: When prompted, enter your policy number using the phone keypad (or you may be asked to speak to a customer service agent). You might also need to verify some personal details (like date of birth or name) to ensure security.</li>
                            <li>Listen to your policy status: The IVR system will retrieve your policy information. You will hear details such as premium due date, unpaid premium (if any), policy tenure, next bonus due, etc. If you chose to speak with a customer care representative, they will ask for your policy number and perhaps some identification questions, then provide you the status verbally.</li>
                        </ol>
                        <p className="mt-4 text-sm text-muted-foreground"><strong>Helpline Availability:</strong> LIC’s IVRS helpline is available 24x7 for basic automated services. However, if you need to speak to an executive, live support is generally available Monday to Friday, 8:00 a.m. to 8:00 p.m. Support is offered in multiple languages (English, Hindi and several regional Indian languages) to cater to customers across India. If one number is busy, you can also try LIC’s zonal office lines or the toll-free number (if available in your region). But the 022-68276827 line is the primary nationwide helpline.</p>
                        <p className="mt-2 text-sm text-muted-foreground"><strong>Tip:</strong> Have your policy number ready before calling, and ideally call from your registered phone number. This will speed up the process of retrieving your details. The automated system may also allow you to enter the last premium paid or date of birth for verification. Follow the IVR instructions carefully, and you’ll get your status in a minute or two.</p>
                    </div>
                    
                    <div>
                        <h3 className="text-xl font-semibold flex items-center gap-2"><WhatsAppIcon className="text-primary h-6 w-6"/>Check LIC Policy Status via WhatsApp</h3>
                        <p className="mt-2 text-muted-foreground">LIC has introduced an official WhatsApp service to assist policyholders with queries. This is a very user-friendly option – you can get your policy status on WhatsApp by just sending a message. To use this service:</p>
                        <ol className="list-decimal pl-6 space-y-2 text-muted-foreground mt-4">
                            <li>Save LIC’s WhatsApp number: Add the number <code className="bg-muted p-1 rounded-md font-mono">8976862090</code> to your contacts and name it “LIC WhatsApp” (this is LIC’s official WhatsApp helpline).</li>
                            <li>Send “Hi” on WhatsApp: Open WhatsApp, find the LIC contact, and send a “Hi” message to start the conversation. LIC’s automated chatbot will respond with a greeting and a list of service options.</li>
                            <li>Choose the “Policy Status” option: The WhatsApp menu will show various services (usually numbered). For example, it may list options like 1. Pay Premium, 2. Bonus Information, 3. Policy Status, 4. Loan Eligibility, etc. Reply by typing the number corresponding to “Policy Status” (in past menus it’s option 3, but confirm from the menu you receive).</li>
                            <li>Get policy details: The chatbot will ask for your policy number (if not already linked to your WhatsApp). Provide the policy number in the chat. It might also ask for a bit of personal detail for verification (like date of birth). After you respond, the WhatsApp service will promptly reply with your policy status and details (similar info as you’d get via SMS or call: e.g. policy in-force/lapsed, next premium due date, premium amount, etc.). You can navigate through the menu for additional details or services as needed.</li>
                        </ol>
                        <p className="mt-4 text-sm text-muted-foreground">This WhatsApp service is very convenient – it’s available 24/7 and you can use it on the go. Plus, you have a written record of the information in your WhatsApp chat for later reference. No registration is required to use the WhatsApp service beyond having your policy number and a WhatsApp-enabled phone. Just ensure the WhatsApp message comes from your registered mobile number (the one you’ve given to LIC) so that LIC can fetch your details securely.</p>
                    </div>
                </CardContent>
            </Card>
        </section>
        
        <section id="mobile-app-method" className="mb-12">
            <h2 className="text-3xl font-bold font-headline text-center mb-6">Check LIC Policy Status via LIC Mobile App (LIC Customer App)</h2>
            <Card>
                <CardContent className="p-6 space-y-4">
                    <p className="text-muted-foreground">LIC offers an official mobile application called “LIC Customer” (also referred to as the LIC Digital App) for policyholders. Using this app, you can manage your policies on your smartphone, including checking policy status, premium due dates, etc. Here’s how to use the app for policy status:</p>
                    <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                        <li><strong>Install the official app:</strong> Download the LIC Customer app from the Google Play Store (Android) or Apple App Store (iOS). Ensure it’s the official app by LIC of India to avoid fraudulent apps.</li>
                        <li><strong>Register or Login:</strong> Open the app. If you are a new user, tap on “New User” or “Sign Up” and follow the prompts to register (you’ll need to enter your policy number, premium, DOB, etc.). If you already have an online LIC account, simply choose “Registered User”, and log in.</li>
                        <li><strong>Link/Select your policy:</strong> After logging in, the app will show your linked policy or allow you to add/enroll a policy. Add your policy if not already listed by entering the policy number.</li>
                        <li><strong>Check Policy Status:</strong> Once your policy is added, simply tap on your policy number in the app to view its status and details.</li>
                    </ol>
                    <p className="text-muted-foreground">Using the LIC Customer app is essentially like having the customer portal in your pocket. It’s secure and convenient, especially if you frequently manage your policies. The LIC Digital app allows you to not only check status but also get premium reminders, pay premiums online, and view policy statements.</p>
                    <Alert variant="destructive" className="mt-4">
                        <ShieldAlert className="h-4 w-4" />
                        <AlertTitle>Security Tip</AlertTitle>
                        <AlertDescription>When using the LIC app or website, never share your login credentials or OTPs with anyone. LIC will not call asking for your password or OTP. Always use the official LIC app or website (licindia.in) for checking your policy to avoid phishing scams.</AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        </section>

        <section id="benefits" className="mb-12">
            <h2 className="text-3xl font-bold font-headline text-center mb-6">Benefits of Regularly Checking LIC Policy Status</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground">Keeping an eye on your LIC policy status isn’t just a one-time task – it’s a good habit to check in periodically (say, every few months or before premium due dates). Here are some key benefits of regular policy status checks:</p>
                <div>
                  <h3 className="font-semibold text-lg">Avoid Missed Payments & Lapses</h3>
                  <p className="text-muted-foreground mt-1">By checking your status, you’ll always know when the next premium is due, so you can pay on time. This prevents your policy from lapsing due to missed payments. You’ll also become aware if a payment was missed or if the grace period is about to end, allowing you to take quick action and keep the policy active.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Stay Informed of Policy Details</h3>
                  <p className="text-muted-foreground mt-1">Regular checks let you verify important policy details such as the policy term, maturity date, sum assured, and bonus accumulated so far. Having these details handy helps in overall financial planning. For example, knowing the maturity date and expected payout can help you plan for that lump sum in the future.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Plan Financially (Loans/Bonus)</h3>
                  <p className="text-muted-foreground mt-1">You can see if your policy has acquired a loan value or bonuses. Many LIC policies accrue bonuses and also allow loans against the policy. By checking status, you’ll know how much bonus has been added or if you’re eligible for a policy loan, which can be useful in emergencies. It basically gives a clear picture of your policy’s performance and value over time.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Ensure Information is Up-to-date</h3>
                  <p className="text-muted-foreground mt-1">When you regularly view your policy details, you can ensure that your personal details (like nominee name, contact info) are correct in LIC’s records. If you spot any discrepancy (e.g., an incorrect nominee or address), you can get it corrected well before any claim or maturity payout. This avoids hassles for your family or nominees later and ensures a smooth claim process when the time comes.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Peace of Mind</h3>
                  <p className="text-muted-foreground mt-1">Ultimately, staying updated with your policy status gives you peace of mind. You know your coverage is in-force, you’re aware of upcoming dues, and you understand the benefits accumulating. It keeps you in control of your investment and insurance protection, rather than leaving things to assumption.</p>
                </div>
                <p className="text-muted-foreground pt-4">In summary, a quick status check every now and then can save you from unpleasant surprises and help you maximize the benefits from your LIC policy.</p>
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
            <p className="text-muted-foreground max-w-3xl mx-auto">Checking your LIC policy status is now easier than ever. You don’t need to visit an LIC branch or depend on an agent to know your policy details. With methods like the online portal login, SMS, phone call, WhatsApp, and the LIC mobile app, you can get up-to-date information on your policy within minutes. This not only helps you avoid missing premium payments and policy lapses, but also keeps you informed about your policy’s growth (bonus, loan value, etc.) over time.</p>
            <p className="text-muted-foreground max-w-3xl mx-auto mt-4">By following the step-by-step guide above, you can confidently track your policy’s status anytime and ensure that your valuable insurance policy remains in force and continues to protect you and your family. Remember, an informed policyholder can make better financial decisions – so take advantage of these convenient LIC services to stay on top of your policy.</p>
        </section>

        <AuthorCard dictionary={dictionary.author_card} />
        <FooterCta dictionary={dictionary.footer_cta} lang={params.lang} />
      </div>
    </div>
  );
}

    