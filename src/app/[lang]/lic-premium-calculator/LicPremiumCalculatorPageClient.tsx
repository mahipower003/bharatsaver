
'use client';

import { LicPremiumCalculator } from "@/components/calculators/LicPremiumCalculator";
import { AuthorCard } from "@/components/layout/AuthorCard";
import type { Dictionary } from "@/lib/types";
import type { Locale } from "@/lib/i18n-config";
import { FooterCta } from "@/components/layout/FooterCta";
import { BarChart2, CheckCircle, Lightbulb, TrendingUp, HelpCircle, FileText, Download, Users, Star, Smile, Search, SlidersHorizontal, Calculator, Clock, GitCompareArrows } from "lucide-react";

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
    <div className="prose dark:prose-invert max-w-none mt-12 space-y-8">
      
      <div className="p-6 bg-secondary/30 rounded-lg">
          <h2 className="flex items-center gap-3"><Smile className="h-8 w-8 text-primary"/>So, What Exactly is This Tool?</h2>
          <p>Think of the LIC Premium Calculator as your personal guide to figuring out policy costs. Instead of wading through complicated documents or waiting for someone to call you back, this tool gives you a clear, instant estimate of what you can expect to pay for an LIC policy. You just need to tell it a few things, like:</p>
          <ul className="list-disc pl-5">
              <li>Your age and gender</li>
              <li>How much coverage (Sum Assured) you want</li>
              <li>How many years you plan to pay the premium (the Premium Paying Term)</li>
              <li>Whether you want to pay monthly, quarterly, half-yearly, or yearly</li>
          </ul>
          <p>Once you plug that in, it does the heavy lifting and shows you an estimated premium. Simple as that!</p>
      </div>

      <div>
          <h2 className="flex items-center gap-3"><Lightbulb className="h-8 w-8 text-accent"/>Why Should I Bother Using a Calculator?</h2>
          <p>Great question! It really comes down to saving time and gaining clarity. Here’s what you get in just a few clicks:</p>
          <ul className="space-y-3">
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-green-500 mt-1"/><span><strong>No More Guesswork:</strong> Get fast, reliable premium estimates without the confusing math.</span></li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-green-500 mt-1"/><span><strong>Apples-to-Apples Comparisons:</strong> Easily compare what you’d pay for different plans like Jeevan Umang vs. Jeevan Labh.</span></li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-green-500 mt-1"/><span><strong>Budget with Confidence:</strong> See how your premium changes if you pay monthly versus yearly, so you can choose what fits your wallet.</span></li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-green-500 mt-1"/><span><strong>See the Full Picture:</strong> Thinking about adding riders like Accident or Critical Illness cover? The calculator shows you exactly how much extra that will cost.</span></li>
          </ul>
      </div>

      <div>
          <h2 className="flex items-center gap-3"><BarChart2 className="h-8 w-8 text-primary"/>Let's See It in Action: Real-World Examples</h2>
          <p>Numbers speak louder than words. Here are a couple of quick scenarios to show you what the calculator can do:</p>
          <div className="bg-muted/50 p-4 rounded-lg my-4">
              <h3 className="font-semibold">👉 Scenario 1: Planning for the long haul</h3>
              <p className="mt-2">A 30-year-old looking at <strong>Jeevan Umang</strong> with a ₹5,00,000 cover for a 20-year payment term would see an estimated yearly premium of around <strong>₹34,500</strong>. The tool would also show this breaks down to about <strong>₹2,875 per month</strong>.</p>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold">👉 Scenario 2: Adding a safety net</h3>
              <p className="mt-2">A 28-year-old considering <strong>Jeevan Utsav</strong> for ₹7,50,000 might see a base premium of ~₹41,200. By toggling the "Accident Benefit" rider, they'd instantly see the premium rise to about <strong>₹43,000</strong>, making the cost of extra protection crystal clear.</p>
          </div>
          <p className="text-sm italic mt-4">(Please note: These are just illustrations! Your final premium is always determined by LIC after their underwriting process.)</p>
      </div>

      <div>
          <h2 className="flex items-center gap-3"><SlidersHorizontal className="h-8 w-8 text-accent"/>Do You Have Presets for Specific Plans?</h2>
          <p>Yes, and this is where the tool gets really smart. Different LIC plans have different rules, so using a generic calculator can be misleading. Our presets automatically apply the correct parameters for popular plans, including:</p>
          <ul className="list-disc pl-5">
              <li>Jeevan Umang (Plan No. 745)</li>
              <li>Jeevan Utsav (Plan No. 771)</li>
              <li>Jeevan Labh (Plan No. 736)</li>
              <li>Index Plus (Plan No. 873)</li>
              <li>New Pension Plus (Plan No. 867)</li>
              <li>Saral Pension (Plan No. 862)</li>
          </ul>
          <p>When you choose a preset, you can be confident the estimate is tailored to that specific plan's structure.</p>
      </div>

      <div>
          <h2 className="flex items-center gap-3"><TrendingUp className="h-8 w-8 text-primary"/>Any Tips for Lowering My Premium?</h2>
          <p>Absolutely! Here are a few strategies you can test in the calculator to see how they affect your premium:</p>
          <ul className="space-y-3">
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-green-500 mt-1"/><span><strong>Pay Annually:</strong> Paying once a year is often slightly cheaper than paying monthly over the course of a year.</span></li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-green-500 mt-1"/><span><strong>Choose a Longer Paying Term (PPT):</strong> Spreading your payments over more years can lower your yearly premium, though you'll be paying for longer.</span></li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-green-500 mt-1"/><span><strong>Start Early:</strong> The younger you are when you buy a policy, the lower your premiums will be. It's the biggest advantage you have!</span></li>
          </ul>
      </div>

      <div>
          <h2 className="flex items-center gap-3"><HelpCircle className="h-8 w-8 text-accent"/>Quick Answers to Common Questions (FAQ)</h2>
          <div className="space-y-4 mt-4">
              <div>
                <h3 className="font-semibold">Q: How do I actually calculate the premium?</h3>
                <p>Just enter your age, how much coverage you want (Sum Assured), how long you want to pay for (PPT), and how often (e.g., monthly). The calculator does the rest!</p>
              </div>
              <div>
                <h3 className="font-semibold">Q: Is this an official LIC tool?</h3>
                <p>No, this is an independent estimation tool created by BharatSaver to help you plan. For a final, binding quote, you should always contact LIC or an authorized agent.</p>
              </div>
              <div>
                <h3 className="font-semibold">Q: Can I see if GST is included?</h3>
                <p>Yep! By default, we show the premium before tax. There's a toggle you can use to see the final amount including any applicable GST.</p>
              </div>
              <div>
                <h3 className="font-semibold">Q: What exactly is Premium Paying Term (PPT)?</h3>
                <p>It’s simply the number of years you'll be paying premiums. For some plans, this is different from the full policy term. A longer PPT usually means a smaller yearly payment.</p>
              </div>
          </div>
      </div>
      
      <div className="p-6 bg-secondary/30 rounded-lg">
          <h2 className="flex items-center gap-3"><Star className="h-8 w-8 text-primary"/>What Should I Do Next?</h2>
          <p>Once you have your estimate, you're in a great position to take the next step:</p>
          <ol className="list-decimal pl-5 space-y-2 mt-4">
              <li><strong>Download Your Results:</strong> Save a PDF of your calculation so you can refer to it later.</li>
              <li><strong>Compare Different Plans:</strong> Run a few more calculations for other plans to see which one gives you the best value.</li>
              <li><strong>Get Personalized Advice:</strong> If you're still unsure, our team of certified financial planners can help.</li>
              <li><strong>Talk to an Agent:</strong> When you're ready to buy, contact an official LIC agent to get a final quote and complete the process.</li>
          </ol>
      </div>

      <footer className="disclaimer mt-8 text-center">
        <p><small><strong>Disclaimer:</strong> This LIC Premium Calculator provides estimates for informational purposes only. The final payable premium and policy terms are determined by LIC of India at the time of underwriting. BharatSaver is not affiliated with LIC.</small></p>
      </footer>
    </div>
  );

  return (
    <div className="py-12">
      <div className="mx-auto max-w-5xl">
        <header className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">LIC Premium Calculator — Calculate Your LIC Premium Instantly</h1>
            <p className="mt-4 text-lg text-muted-foreground">Looking to find out how much an LIC policy will cost you — in under a minute? Welcome. Use BharatSaver’s LIC Premium Calculator to get instant, reliable premium estimates for plans such as Jeevan Umang, Jeevan Utsav, Jeevan Labh, Index Plus and more. Whether you want an LIC premium calculator online free, a plan-specific preset, or a quick monthly vs yearly premium conversion, this tool is built to help you decide faster and smarter.</p>
        </header>
        
        <LicPremiumCalculator dictionary={pageDict} />

        <ArticleContent />
        
        <div className="mt-12">
            <AuthorCard dictionary={dictionary.author_card} />
        </div>
        <FooterCta dictionary={dictionary.footer_cta} lang={params.lang} />
      </div>
    </div>
  );
}
