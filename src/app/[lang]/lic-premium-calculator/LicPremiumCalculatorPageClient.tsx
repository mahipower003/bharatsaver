
'use client';

import { LicPremiumCalculator } from "@/components/calculators/LicPremiumCalculator";
import { AuthorCard } from "@/components/layout/AuthorCard";
import type { Dictionary } from "@/lib/types";
import type { Locale } from "@/lib/i18n-config";
import { FooterCta } from "@/components/layout/FooterCta";
import { BarChart2, CheckCircle, Lightbulb, TrendingUp, HelpCircle, FileText, Download, Users, Star, Smile, Search, SlidersHorizontal, Calculator, Clock, GitCompareArrows, StepForward } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function LicPremiumCalculatorPageClient({
  params,
  dictionary,
  pageDict,
}: {
  params: { lang: Locale };
  dictionary: Dictionary;
  pageDict: any;
}) {

  const ArticleContent = () => (
    <div className="mt-12 space-y-8">
      
      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <Smile className="h-8 w-8 text-primary"/>
                <h2 className="text-2xl font-bold">What is this LIC Premium Calculator & How Does It Help You?</h2>
            </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Think of the <strong>LIC Premium Calculator</strong> as your personal financial assistant, designed to make sense of policy costs. Instead of navigating complex documents or waiting for an agent, this tool provides a clear, instant estimate of your premium. You just need to provide a few key details:</p>
          <ul className="list-disc pl-5 mt-4 space-y-2">
              <li>Your age and gender</li>
              <li>The Sum Assured (the coverage amount you want)</li>
              <li>How long you wish to pay premiums (the Premium Paying Term or PPT)</li>
              <li>How often you'll pay (monthly, quarterly, half-yearly, or yearly)</li>
          </ul>
          <p className="mt-4">Once you input this information, the calculator does the heavy lifting and presents an estimated premium. It’s a simple, fast, and reliable way to get started with your financial planning.</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <Lightbulb className="h-8 w-8 text-accent"/>
                <h2 className="text-2xl font-bold">Why Should You Use an Online Premium Calculator?</h2>
            </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Using an <strong>LIC premium calculator online for free</strong> is about gaining clarity and saving time. Here’s what you achieve in just a few clicks:</p>
          <ul className="space-y-3 mt-4">
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0"/><span><strong>Eliminate Guesswork:</strong> Get fast, dependable premium estimates without complex math.</span></li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0"/><span><strong>Easy Comparisons:</strong> Effortlessly compare what you’d pay for different popular plans like the <em>Jeevan Umang premium calculator</em> vs. the <em>Jeevan Labh premium calculator</em>.</span></li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0"/><span><strong>Budget with Confidence:</strong> Instantly see how your premium changes with different payment frequencies, helping you choose what best fits your financial situation.</span></li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0"/><span><strong>Full Cost Transparency:</strong> If you're considering riders like Accident or Critical Illness cover, the <em>LIC premium calculator with riders</em> shows you the exact incremental cost.</span></li>
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow-lg" id="how-it-works">
        <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <StepForward className="h-8 w-8 text-primary"/>
                <h2 className="text-2xl font-bold">How Does the LIC Calculator Work? A Step-by-Step Guide</h2>
            </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4">
            <li className="flex items-start gap-4">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="font-semibold text-lg">Select Your Plan</h3>
                <p className="text-muted-foreground">Start by choosing your desired LIC plan from the dropdown menus. Selecting a preset like "Jeevan Umang" ensures the calculator uses the correct parameters for that specific policy.</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="font-semibold text-lg">Enter Your Details</h3>
                <p className="text-muted-foreground">Input your age, gender, desired Sum Assured (the coverage amount), and the Premium Paying Term (PPT).</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="font-semibold text-lg">Click Calculate</h3>
                <p className="text-muted-foreground">The tool processes your inputs using LIC's formulas to determine the base premium before any taxes or optional riders.</p>
              </div>
            </li>
             <li className="flex items-start gap-4">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">4</div>
              <div>
                <h3 className="font-semibold text-lg">View Your Results</h3>
                <p className="text-muted-foreground">The calculator displays your estimated premium for yearly, half-yearly, quarterly, and monthly frequencies, allowing you to see which payment plan best suits your budget.</p>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <BarChart2 className="h-8 w-8 text-primary"/>
                <h2 className="text-2xl font-bold">How to Calculate LIC Premium: Real-World Examples</h2>
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">Numbers often speak louder than words. Here are a couple of scenarios to demonstrate what our calculator can do for you:</p>
            <div className="bg-muted/50 p-4 rounded-lg my-4">
                <h3 className="font-semibold text-lg">Scenario 1: Long-Term Planning with Jeevan Umang</h3>
                <p className="mt-2 text-muted-foreground">A 30-year-old looking at <strong>Jeevan Umang</strong> with a ₹5,00,000 cover for a 20-year payment term would see an estimated yearly premium of around <strong>₹34,500</strong>. The tool also shows this breaks down to about <strong>₹2,875 per month</strong>. This helps answer the common query, “how to calculate LIC premium for Jeevan Umang”.</p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg">Scenario 2: Adding a Safety Net with Jeevan Utsav</h3>
                <p className="mt-2 text-muted-foreground">A 28-year-old considering <strong>Jeevan Utsav</strong> for ₹7,50,000 might see a base premium of ~₹41,200. By toggling the "Accident Benefit" rider, they'd instantly see the premium rise to about <strong>₹43,000</strong>, making the cost of extra protection crystal clear.</p>
            </div>
            <p className="text-sm italic mt-4 text-muted-foreground">(Disclaimer: These are illustrations. Your final premium is always determined by LIC after their underwriting process.)</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <SlidersHorizontal className="h-8 w-8 text-accent"/>
                <h2 className="text-2xl font-bold">Which Plan Presets Are Available?</h2>
            </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Different LIC plans have different rules, so a generic calculator can be misleading. Our presets automatically apply the correct parameters, giving you a more accurate estimate. We support popular plans including:</p>
          <ul className="list-disc pl-5 mt-4 space-y-2">
              <li>Jeevan Umang (Plan No. 745)</li>
              <li>Jeevan Utsav (Plan No. 771)</li>
              <li>Jeevan Labh (Plan No. 736)</li>
              <li>Index Plus (Plan No. 873)</li>
              <li>New Pension Plus (Plan No. 867)</li>
              <li>Saral Pension (Plan No. 862)</li>
          </ul>
          <p className="mt-4 text-muted-foreground">When you use a preset like the <strong>Jeevan Labh premium calculator</strong>, you can be confident the estimate is tailored to that specific plan's structure.</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-primary"/>
                <h2 className="text-2xl font-bold">Any Tips for Lowering My Premium?</h2>
            </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Absolutely! Here are a few strategies you can test in the calculator to see how they affect your premium:</p>
          <ul className="space-y-3 mt-4">
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0"/><span><strong>Pay Annually:</strong> The <em>LIC premium payment calculator for yearly vs monthly</em> will show that paying once a year is often slightly cheaper than paying in monthly installments.</span></li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0"/><span><strong>Choose a Longer Paying Term (PPT):</strong> Spreading your payments over more years can lower your yearly premium, though you'll be paying for a longer duration.</span></li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0"/><span><strong>Start Early:</strong> The most significant factor. The younger you are when you buy a policy, the lower your premiums will be.</span></li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0"/><span><strong>Re-evaluate Riders:</strong> Only keep the riders you truly need. While helpful, they add to the cost.</span></li>
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
          <CardHeader>
              <CardTitle className="flex items-center gap-3">
                  <HelpCircle className="h-8 w-8 text-accent"/>
                  <h2 className="text-2xl font-bold">Frequently Asked Questions (FAQ)</h2>
              </CardTitle>
          </CardHeader>
          <CardContent>
              <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                      <AccordionTrigger>How do I calculate LIC premium?</AccordionTrigger>
                      <AccordionContent>To calculate your LIC premium, open the plan calculator on our page, enter your age (or date of birth), the desired sum assured, the premium paying term (PPT), and how often you'd like to pay (e.g., monthly, yearly). For more accurate results, select a plan preset like 'Jeevan Umang' and click 'Calculate' to get an instant estimate.</AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                      <AccordionTrigger>Is this an official LIC calculator?</AccordionTrigger>
                      <AccordionContent>No, this is an independent estimation tool provided by BharatSaver. It uses official LIC plan rules and formulas for accuracy, but for a final, binding quote, you should always contact LIC or an authorized agent as premiums are subject to underwriting.</AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                      <AccordionTrigger>Does this LIC premium calculator include tax (GST)?</AccordionTrigger>
                      <AccordionContent>By default, our calculator shows the premium before tax. However, you can use the 'include tax' toggle to see the final premium inclusive of the current GST rates (e.g., 4.5% for the first year and 2.25% thereafter for traditional plans).</AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                      <AccordionTrigger>What is Premium Paying Term (PPT) in LIC?</AccordionTrigger>
                      <AccordionContent>The Premium Paying Term (PPT) is the specific number of years you are required to pay premiums for your LIC policy. This can be different from the full policy term. For example, in a plan like Jeevan Labh, you might pay premiums for 16 years, but the policy matures in 25 years. A longer PPT generally results in a lower annual premium.</AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-5">
                      <AccordionTrigger>How can I compare premiums for different LIC plans like Jeevan Umang vs Jeevan Labh?</AccordionTrigger>
                      <AccordionContent>Our calculator makes this easy. First, calculate the premium for 'Jeevan Umang' using its preset. Then, simply switch the preset to 'Jeevan Labh' while keeping the sum assured and age the same. This will give you a direct, side-by-side comparison of the premium cost for both plans.</AccordionContent>
                  </AccordionItem>
                   <AccordionItem value="item-6">
                      <AccordionTrigger>Can I calculate the monthly premium for an LIC policy?</AccordionTrigger>
                      <AccordionContent>Yes. The calculator has a 'Frequency' option where you can select 'Monthly'. It will automatically convert the annual premium to its monthly equivalent, including any modal loading charges applied by LIC for non-yearly payments.</AccordionContent>
                  </AccordionItem>
              </Accordion>
          </CardContent>
      </Card>
      
      <Card className="shadow-lg mt-8 bg-primary/10 border-primary/20">
        <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <Star className="h-8 w-8 text-primary"/>
                <h2 className="text-2xl font-bold">Conclusion: What Should I Do Next?</h2>
            </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Once you have your estimate, you're in a great position to take the next step toward securing your financial future:</p>
          <ol className="list-decimal pl-5 space-y-2 mt-4">
              <li><strong>Download Your Results:</strong> Save a PDF of your calculation so you can refer to it later or discuss it with your family.</li>
              <li><strong>Compare Different Plans:</strong> Run a few more calculations for other plans to see which one gives you the best value for your needs.</li>
              <li><strong>Get Personalized Advice:</strong> If you're still unsure, our team of certified financial planners is here to help guide you.</li>
              <li><strong>Talk to an Agent:</strong> When you're ready to buy, contact an official LIC agent to get a final quote and complete the purchase process.</li>
          </ol>
           <footer className="disclaimer mt-8 text-center">
            <p><small><strong>Disclaimer:</strong> This LIC Premium Calculator provides estimates for informational purposes only. The final payable premium and policy terms are determined by LIC of India at the time of underwriting. BharatSaver is not affiliated with LIC.</small></p>
          </footer>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="py-12">
      <div className="mx-auto max-w-5xl">
        <header className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">LIC Premium Calculator — Your Simple Guide to Estimating LIC Premiums</h1>
            <p className="mt-4 text-lg text-muted-foreground">Looking to find out how much an LIC policy will cost you — in under a minute? Welcome. Use BharatSaver’s LIC Premium Calculator to get instant, reliable premium estimates for plans such as Jeevan Umang, Jeevan Utsav, Jeevan Labh, Index Plus and more. Whether you want an LIC premium calculator online free, a plan-specific preset, or a quick monthly vs yearly premium conversion, this tool is built to help you decide faster and smarter.</p>
        </header>
        
        <div id="calculator-widget">
          <LicPremiumCalculator dictionary={pageDict} />
        </div>

        <ArticleContent />
        
        <div className="mt-12">
            <AuthorCard dictionary={dictionary.author_card} />
        </div>
        <FooterCta dictionary={dictionary.footer_cta} lang={params.lang} />
      </div>
    </div>
  );
}
