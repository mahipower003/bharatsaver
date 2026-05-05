'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Download, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

const formSchema = z.object({
  annualInvestment: z.coerce.number().min(500),
  term: z.coerce.number().min(5).max(40),
  licBonusRate: z.coerce.number().min(0).max(100),
  ppfRate: z.coerce.number().min(0).max(20),
});

type FormValues = z.infer<typeof formSchema>;

export function LicVsPpfCalculator({ dictionary }: { dictionary: any }) {
  const [result, setResult] = useState<{ licMaturity: number, ppfMaturity: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      annualInvestment: 50000,
      term: 20,
      licBonusRate: 40,
      ppfRate: 7.1,
    },
  });

  async function handleSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    await new Promise(resolve => setTimeout(resolve, 500));

    // PPF Calculation (Compounding)
    const r = values.ppfRate / 100;
    const n = values.term;
    const P = values.annualInvestment;
    // FV = P * (((1 + r)^n - 1) / r) * (1 + r) -- Assuming start of year deposits
    const ppfMaturity = P * (((Math.pow(1 + r, n) - 1) / r)) * (1 + r);

    // LIC Calculation (Simple Reversionary Bonus approx)
    // To approximate, let's assume Sum Assured = Annual Investment * Term (Very rough)
    const sumAssured = P * n;
    const totalBonus = (sumAssured / 1000) * values.licBonusRate * n;
    // Ignoring FAB for simplicity, or we could add a flat percentage
    const licMaturity = sumAssured + totalBonus;

    setResult({
      licMaturity,
      ppfMaturity,
    });
    
    setIsLoading(false);
  }

  const formatCurrency = (value: number) => value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const diff = result ? result.ppfMaturity - result.licMaturity : 0;
  const isPpfBetter = diff > 0;

  return (
    <Card className="shadow-lg border-primary/20 bg-gradient-to-br from-background to-muted/30">
      <CardHeader>
        <CardTitle className="text-2xl">{dictionary.title || "LIC vs PPF Calculator"}</CardTitle>
        <CardDescription>{dictionary.description || "Compare projected maturity of PPF vs LIC"}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="annualInvestment" render={({ field }) => (
                  <FormItem>
                      <FormLabel>{dictionary.annual_investment_label || "Annual Investment (₹)"}</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                  </FormItem>
              )} />
              <FormField control={form.control} name="term" render={({ field }) => (
                  <FormItem>
                      <FormLabel>{dictionary.term_label || "Term (Years)"}</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                  </FormItem>
              )} />
              <FormField control={form.control} name="licBonusRate" render={({ field }) => (
                  <FormItem>
                      <FormLabel>{dictionary.lic_bonus_label || "LIC Bonus (per ₹1000)"}</FormLabel>
                      <FormControl><Input type="number" step="0.1" {...field} /></FormControl>
                      <FormMessage />
                  </FormItem>
              )} />
              <FormField control={form.control} name="ppfRate" render={({ field }) => (
                  <FormItem>
                      <FormLabel>{dictionary.ppf_rate_label || "PPF Interest Rate (%)"}</FormLabel>
                      <FormControl><Input type="number" step="0.1" {...field} /></FormControl>
                      <FormMessage />
                  </FormItem>
              )} />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto text-lg py-6 shadow-md">
              {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> {dictionary.calculating || "Calculating..."}</> : (dictionary.calculate_button || "Compare Returns")}
            </Button>
          </form>
        </Form>

        {result && (
          <div className="mt-8 pt-8 border-t animate-in fade-in-50 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-muted-foreground font-medium">Estimated PPF Maturity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold text-primary">{formatCurrency(result.ppfMaturity)}</p>
                        <p className="text-sm text-muted-foreground mt-2">100% Tax-Free (EEE)</p>
                    </CardContent>
                </Card>
                <Card className="bg-muted border-muted-foreground/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-muted-foreground font-medium">Estimated LIC Maturity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">{formatCurrency(result.licMaturity)}</p>
                        <p className="text-sm text-muted-foreground mt-2">Tax-free under Sec 10(10D)</p>
                    </CardContent>
                </Card>
            </div>

            <div className={`p-6 rounded-xl text-center shadow-inner ${isPpfBetter ? 'bg-green-500/10 border border-green-500/20' : 'bg-blue-500/10 border border-blue-500/20'}`}>
                <h3 className="text-xl font-semibold mb-2">
                    {isPpfBetter ? "PPF generates more wealth!" : "LIC generates more wealth!"}
                </h3>
                <p className="text-muted-foreground">
                    By investing in {isPpfBetter ? "PPF" : "LIC"}, you could earn roughly <strong>{formatCurrency(Math.abs(diff))}</strong> more over {form.getValues().term} years.
                </p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <Button variant="outline"><Download className="mr-2 h-4 w-4" />{dictionary.download_pdf || "Download"}</Button>
                <Button variant="outline"><Twitter className="mr-2 h-4 w-4" />{dictionary.share_results || "Share"}</Button>
                <Button asChild size="lg" className="w-full sm:w-auto text-base font-semibold shadow-md"><Link href="/contact">{dictionary.contact_cfp || "Consult a CFP"}</Link></Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
