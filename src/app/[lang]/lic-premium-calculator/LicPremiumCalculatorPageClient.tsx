
'use client';

import { LicPremiumCalculator } from "@/components/calculators/LicPremiumCalculator";
import { AuthorCard } from "@/components/layout/AuthorCard";
import type { Dictionary } from "@/lib/types";
import type { Locale } from "@/lib/i18n-config";
import { FooterCta } from "@/components/layout/FooterCta";
import { BarChart2, CheckCircle, Lightbulb, TrendingUp, HelpCircle, FileText, Download, Users, Star, Smile, Search, SlidersHorizontal, Calculator, Clock, GitCompareArrows, StepForward, FileDown, BookUser, Link as LinkIcon, Table } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table as UiTable, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
                    <TrendingUp className="h-8 w-8 text-primary"/>
                    <h2 className="text-2xl font-bold">Quick Answer: Sample LIC Premium Estimates</h2>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-4">Here’s a quick look at estimated yearly premiums for a ₹10 Lakh Sum Assured across popular plans. Use the calculator above for precise figures based on your profile.</p>
                <UiTable>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Age</TableHead>
                            <TableHead>Jeevan Umang</TableHead>
                            <TableHead>Jeevan Labh (16 yr PPT)</TableHead>
                            <TableHead>Jeevan Utsav</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>30 Years</TableCell>
                            <TableCell>~ ₹56,000</TableCell>
                            <TableCell>~ ₹58,500</TableCell>
                            <TableCell>~ ₹65,000</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>35 Years</TableCell>
                            <TableCell>~ ₹68,000</TableCell>
                            <TableCell>~ ₹61,000</TableCell>
                            <TableCell>~ ₹78,000</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>40 Years</TableCell>
                            <TableCell>~ ₹84,000</TableCell>
                            <TableCell>~ ₹64,500</TableCell>
                            <TableCell>~ ₹95,000</TableCell>
                        </TableRow>
                    </TableBody>
                </UiTable>
                <p className="text-xs text-muted-foreground mt-2 italic">Disclaimer: These are illustrative estimates for a non-smoker male, standard life. Actuals will vary.</p>
            </CardContent>
        </Card>

        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <HelpCircle className="h-8 w-8 text-primary"/>
                    <h2 className="text-2xl font-bold">What is the LIC Premium Calculator?</h2>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-muted-foreground">The LIC Premium Calculator is a free online tool that helps you estimate the premium you’ll need to pay for your chosen LIC policy. Instead of manually calculating or waiting for an agent, this tool gives you an instant, reliable figure, helping you make smarter financial decisions.</p>
                
                <div>
                    <h3 className="font-semibold text-lg mb-2">Inputs We Need</h3>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li><strong>Age & Gender:</strong> Premiums are based on life expectancy.</li>
                        <li><strong>Sum Assured:</strong> The total coverage amount you want.</li>
                        <li><strong>Premium Paying Term (PPT):</strong> The number of years you'll pay the premium.</li>
                        <li><strong>Payment Frequency:</strong> How often you'll pay (e.g., monthly, yearly).</li>
                        <li><strong>Riders:</strong> Optional add-ons like Accident or Critical Illness cover.</li>
                    </ul>
                </div>
                
                <div>
                    <h3 className="font-semibold text-lg mb-2">What Results You'll See</h3>
                     <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li><strong>Estimated Premium:</strong> The cost per payment frequency.</li>
                        <li><strong>GST Breakdown:</strong> The tax component of your premium.</li>
                        <li><strong>Rider Costs:</strong> The incremental cost for any add-ons.</li>
                        <li><strong>Plan Details:</strong> The plan number and UIN for verification.</li>
                    </ul>
                </div>
            </CardContent>
        </Card>

      <Card className="shadow-lg" id="how-it-works">
        <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <StepForward className="h-8 w-8 text-primary"/>
                <h2 className="text-2xl font-bold">How to Use the LIC Premium Calculator (Step-by-Step)</h2>
            </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4">
            <li className="flex items-start gap-4">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="font-semibold text-lg">Select Your Plan</h3>
                <p className="text-muted-foreground">Start by choosing your desired LIC plan from the dropdown menus. Using a preset like "Jeevan Umang" ensures the calculator uses the correct parameters for that policy.</p>
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
                <h2 className="text-2xl font-bold">Real Examples of LIC Premium Calculation</h2>
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg">Example 1: Long-Term Planning with Jeevan Umang</h3>
                <p className="mt-2 text-muted-foreground">A 30-year-old male planning for retirement with <strong>Jeevan Umang</strong>. He wants a Sum Assured of <strong>₹5,00,000</strong> and will pay premiums for <strong>20 years</strong>. His estimated yearly premium would be approximately <strong>₹34,500</strong>. This breaks down to about <strong>₹2,875 per month</strong>, making it easier to budget.</p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg">Example 2: Adding a Safety Net with Jeevan Utsav</h3>
                <p className="mt-2 text-muted-foreground">A 28-year-old considering <strong>Jeevan Utsav</strong> for a <strong>₹7,50,000</strong> cover. The base premium is around ₹41,200. By toggling the "Accident Benefit" rider, they'd instantly see the premium rise to about <strong>₹43,000</strong>. This transparency makes the cost of extra protection crystal clear.</p>
            </div>
            <p className="text-sm italic mt-4 text-muted-foreground">Disclaimer: These figures are for illustration only. Your final premium is always determined by LIC after their underwriting process.</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <SlidersHorizontal className="h-8 w-8 text-primary"/>
                <h2 className="text-2xl font-bold">Plan Presets Available In Our Calculator</h2>
            </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Different LIC plans have unique rules. Our presets automatically apply the correct parameters, giving you a more accurate estimate. We support popular plans including:</p>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li><strong>Jeevan Umang</strong> (UIN: 512N317V02)</li>
              <li><strong>Jeevan Utsav</strong> (UIN: 512N361V01)</li>
              <li><strong>Jeevan Labh</strong> (UIN: 512N304V02)</li>
              <li><strong>Index Plus</strong> (UIN: 512N355V01)</li>
              <li><strong>New Pension Plus</strong> (UIN: 512N338V02)</li>
              <li><strong>Saral Pension</strong> (UIN: 512N342V02)</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-primary"/>
                <h2 className="text-2xl font-bold">LIC Premium: Monthly vs Yearly Payments</h2>
            </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Choosing between monthly and yearly payments affects your total outflow. While monthly payments are lighter on the wallet, they come with a small 'modal loading' charge. Paying annually is almost always cheaper.</p>
          <h3 className="font-semibold text-lg my-3">How Conversion Works</h3>
          <p className="text-muted-foreground">LIC applies specific factors to convert the yearly premium. Here's the formula:</p>
          <ul className="list-disc pl-5 my-2 space-y-1 text-muted-foreground">
              <li><strong>Half-yearly Premium</strong> = Yearly Premium × 0.5098</li>
              <li><strong>Quarterly Premium</strong> = Yearly Premium × 0.2575</li>
              <li><strong>Monthly Premium</strong> = Yearly Premium × 0.0879</li>
          </ul>
          <p className="text-sm italic text-muted-foreground">Our calculator does this math automatically when you switch frequencies.</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <Smile className="h-8 w-8 text-primary"/>
                <h2 className="text-2xl font-bold">How Riders Impact Your Premium</h2>
            </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Riders are optional add-ons that provide extra coverage for specific events. While incredibly useful, they come at an additional cost.</p>
           <div className="bg-muted/50 p-4 rounded-lg my-4">
                <h3 className="font-semibold text-lg">Example: Adding an Accidental Death & Disability Rider</h3>
                <p className="mt-2 text-muted-foreground">For a 30-year-old male with a ₹10 lakh Sum Assured, the base premium might be ₹25,000. Adding an Accidental Death & Disability Benefit Rider for the same amount could increase the premium by ₹1,000 - ₹1,500 per year. Our calculator lets you toggle these riders to see the exact financial impact in real-time.</p>
            </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-primary"/>
                <h2 className="text-2xl font-bold">Tips to Lower Your LIC Premium</h2>
            </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Here are a few actionable strategies to make your life insurance more affordable:</p>
          <ul className="space-y-3 mt-4">
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0"/><span><strong>Pay Annually:</strong> You can save 2-3% of your premium compared to paying monthly due to modal loading charges.</span></li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0"/><span><strong>Start Early:</strong> The most significant factor. Buying a policy in your 20s can be up to 30% cheaper than buying the same policy in your late 30s.</span></li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0"/><span><strong>Re-evaluate Riders:</strong> Only add the riders you genuinely need. While helpful, they increase the cost.</span></li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0"/><span><strong>Compare Plans:</strong> Don't just settle on the first plan you see. A different product might offer similar benefits for a lower premium.</span></li>
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
          <CardHeader>
              <CardTitle className="flex items-center gap-3">
                  <Search className="h-8 w-8 text-primary"/>
                  <h2 className="text-2xl font-bold">Frequently Asked Questions (FAQ)</h2>
              </CardTitle>
          </CardHeader>
          <CardContent>
              <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                      <AccordionTrigger>How do I calculate LIC premium?</AccordionTrigger>
                      <AccordionContent>Open the plan calculator, enter your age (or date of birth), the desired sum assured, the premium paying term (PPT), and how often you'd like to pay (e.g., monthly, yearly). For more accurate results, select a plan preset like 'Jeevan Umang' and click 'Calculate' to get an instant estimate.</AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                      <AccordionTrigger>Is this an official LIC calculator?</AccordionTrigger>
                      <AccordionContent>No. This is an independent tool by BharatSaver to provide estimates. For a binding quote, contact LIC or an authorised LIC agent.</AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                      <AccordionTrigger>Does the calculation include GST?</AccordionTrigger>
                      <AccordionContent>By default, we show the premium before tax. Use the 'include-tax' toggle to view premiums inclusive of current GST rates (e.g., 4.5% for the first year and 2.25% thereafter for traditional plans).</AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                      <AccordionTrigger>What is Premium Paying Term (PPT)?</AccordionTrigger>
                      <AccordionContent>PPT is the number of years you will pay the premiums. A longer PPT generally lowers the yearly premium amount but increases the total number of payments.</AccordionContent>
                  </AccordionItem>
                   <AccordionItem value="item-5">
                      <AccordionTrigger>How can I compare premiums for different LIC plans like Jeevan Umang vs Jeevan Labh?</AccordionTrigger>
                      <AccordionContent>Our calculator makes this easy. First, calculate the premium for 'Jeevan Umang' using its preset. Then, simply switch the preset to 'Jeevan Labh' while keeping the sum assured and age the same. This will give you a direct, side-by-side comparison of the premium cost for both plans.</AccordionContent>
                  </AccordionItem>
                   <AccordionItem value="item-6">
                      <AccordionTrigger>Can I calculate the monthly premium for an LIC policy?</AccordionTrigger>
                      <AccordionContent>Yes. The calculator has a 'Frequency' option where you can select 'Monthly'. It will automatically convert the annual premium to its monthly equivalent, including any modal loading charges applied by LIC for non-yearly payments.</AccordionContent>
                  </AccordionItem>
                   <AccordionItem value="item-7">
                      <AccordionTrigger>How accurate are online LIC premium calculators?</AccordionTrigger>
                      <AccordionContent>They provide very close estimates based on official formulas. However, the final premium can vary slightly based on medical underwriting and other factors. The final quote from LIC at the time of purchase is the binding amount.</AccordionContent>
                  </AccordionItem>
                   <AccordionItem value="item-8">
                      <AccordionTrigger>Is the LIC Premium Calculator on this website free?</AccordionTrigger>
                      <AccordionContent>Yes, our LIC Premium Calculator is completely free to use, 24/7. There are no charges or hidden fees.</AccordionContent>
                  </AccordionItem>
              </Accordion>
          </CardContent>
      </Card>
      
      <Card className="shadow-lg">
          <CardHeader>
              <CardTitle className="flex items-center gap-3">
                  <GitCompareArrows className="h-8 w-8 text-primary"/>
                  <h2 className="text-2xl font-bold">Next Steps After Using the Calculator</h2>
              </CardTitle>
          </CardHeader>
          <CardContent>
              <ol className="list-decimal pl-5 space-y-2 mt-4 text-muted-foreground">
                  <li><strong>Download Your Results:</strong> Save a PDF of your calculation so you can refer to it later or discuss it with your family.</li>
                  <li><strong>Compare Plans:</strong> Run a few more calculations for other plans to see which one gives you the best value for your needs.</li>
                  <li><strong>Consult an Advisor:</strong> If you're still unsure, request personalized help from our team of Certified Financial Planners.</li>
                  <li><strong>Contact an LIC Agent:</strong> When you're ready to buy, contact an official LIC agent to get a final quote and complete the purchase process.</li>
              </ol>
          </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <BookUser className="h-8 w-8 text-primary"/>
                <h2 className="text-2xl font-bold">Sources & References</h2>
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">We use official LIC plan documents, UINs, and actuarial formulas for our calculations. For more details, you can refer to LIC's official website.</p>
            <a href="https://licindia.in/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-2 mt-2">
                <LinkIcon className="h-4 w-4" />
                Visit LIC of India Official Website
            </a>
        </CardContent>
      </Card>

      <Card className="shadow-lg mt-8 bg-primary/10 border-primary/20">
        <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <Star className="h-8 w-8 text-primary"/>
                <h2 className="text-2xl font-bold">Conclusion: Your First Step to Financial Security</h2>
            </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Figuring out your LIC premium is the first, most important step towards securing your family's future. By using this calculator, you've replaced guesswork with clarity. You can now confidently budget for your policy, compare different options, and make a decision that perfectly aligns with your financial goals. Your journey to financial peace of mind starts here.</p>
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
            <p className="mt-4 text-lg text-muted-foreground">Buying an LIC policy is a big step — but figuring out the premium shouldn’t feel like solving a puzzle. With BharatSaver’s LIC Premium Calculator, you can estimate your premium instantly, compare plans like Jeevan Umang, Jeevan Labh, and Jeevan Utsav, and even see the cost impact of riders or payment frequencies.</p>
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
