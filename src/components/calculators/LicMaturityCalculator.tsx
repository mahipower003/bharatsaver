
'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Download, Printer, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import Link from 'next/link';

const formSchema = z.object({
  plan: z.string().optional(),
  sumAssured: z.coerce.number().min(50000, "Min Sum Assured is 50,000"),
  policyTerm: z.coerce.number().min(5).max(40),
  annualPremium: z.coerce.number().min(1000),
  bonusRate: z.coerce.number().min(0).max(100),
  fabRate: z.coerce.number().min(0).optional().default(0),
  dob: z.date(),
  lastPremiumDate: z.date(),
});

type FormValues = z.infer<typeof formSchema>;

type CalculationResult = {
  maturity: {
    sumAssured: number;
    vestedBonus: number;
    fab: number;
    total: number;
  };
  surrender: {
    gsv: number;
    ssv: number;
  };
  loanAmount: number;
  totalPremiumsPaid: number;
};

const planPresets: Record<string, Partial<FormValues>> = {
    "jeevan-labh": { policyTerm: 25, bonusRate: 48, fabRate: 100 },
    "jeevan-anand": { policyTerm: 21, bonusRate: 49, fabRate: 120 },
    "new-endowment": { policyTerm: 20, bonusRate: 45, fabRate: 90 },
};

export function LicMaturityCalculator({ dictionary }: { dictionary: any }) {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plan: 'jeevan-labh',
      sumAssured: 1000000,
      policyTerm: 25,
      annualPremium: 42000,
      bonusRate: 48,
      fabRate: 100,
      dob: new Date(1994, 0, 1),
      lastPremiumDate: new Date(2023, 11, 31),
    },
  });
  
  const selectedPlan = form.watch('plan');

  useEffect(() => {
    if (selectedPlan && planPresets[selectedPlan]) {
      form.reset({ ...form.getValues(), ...planPresets[selectedPlan] });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlan]);

  async function handleSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    await new Promise(resolve => setTimeout(resolve, 500));

    const totalPremiumsPaid = values.annualPremium * getPremiumPayingTerm(values.plan, values.policyTerm);
    
    // Maturity Calculation
    const vestedBonus = (values.sumAssured / 1000) * values.bonusRate * values.policyTerm;
    const fab = (values.sumAssured / 1000) * (values.fabRate || 0);
    const totalMaturity = values.sumAssured + vestedBonus + fab;

    // Surrender Value Calculation (Simplified)
    const yearsPaid = Math.max(1, new Date().getFullYear() - values.lastPremiumDate.getFullYear());
    const gsvPercent = yearsPaid >= 3 ? 0.3 : 0;
    const gsv = totalPremiumsPaid * gsvPercent;
    const ssv = gsv + (vestedBonus * 0.2); // Highly illustrative
    
    // Loan Calculation
    const loanAmount = ssv * 0.9;

    setResult({
      maturity: { sumAssured: values.sumAssured, vestedBonus, fab, total: totalMaturity },
      surrender: { gsv, ssv },
      loanAmount,
      totalPremiumsPaid,
    });
    
    setIsLoading(false);
  }

  const getPremiumPayingTerm = (plan?: string, policyTerm?: number): number => {
    if (plan === 'jeevan-labh' && policyTerm) {
        if(policyTerm >= 25) return 16;
        if(policyTerm >= 21) return 15;
        if(policyTerm >= 16) return 10;
    }
    return policyTerm || 0;
  }

  const formatCurrency = (value: number) => value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>{dictionary.title}</CardTitle>
          <CardDescription>{dictionary.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField control={form.control} name="plan" render={({ field }) => (
                  <FormItem><FormLabel>{dictionary.plan_label}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder={dictionary.plan_placeholder} /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="jeevan-labh">Jeevan Labh (936)</SelectItem>
                        <SelectItem value="jeevan-anand">New Jeevan Anand (915)</SelectItem>
                        <SelectItem value="new-endowment">New Endowment (914)</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
                <FormField control={form.control} name="sumAssured" render={({ field }) => (<FormItem><FormLabel>{dictionary.sum_assured_label}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="policyTerm" render={({ field }) => (<FormItem><FormLabel>{dictionary.policy_term_label}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="annualPremium" render={({ field }) => (<FormItem><FormLabel>{dictionary.premium_label}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="bonusRate" render={({ field }) => (<FormItem><FormLabel>{dictionary.bonus_rate_label}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="fabRate" render={({ field }) => (<FormItem><FormLabel>{dictionary.fab_rate_label}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="dob" render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>{dictionary.dob_label}</FormLabel>
                        <Popover><PopoverTrigger asChild><FormControl>
                            <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl></PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus /></PopoverContent>
                        </Popover><FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="lastPremiumDate" render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>{dictionary.last_premium_date_label}</FormLabel>
                        <Popover><PopoverTrigger asChild><FormControl>
                            <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl></PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date()} initialFocus /></PopoverContent>
                        </Popover><FormMessage />
                    </FormItem>
                )} />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {dictionary.calculating}</> : dictionary.calculate_button}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <Card className="mt-8 animate-in fade-in-50">
          <CardHeader>
            <CardTitle>Calculation Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-primary/10 p-6 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Estimated Maturity Value</p>
                <p className="text-3xl font-bold text-primary">{formatCurrency(result.maturity.total)}</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Maturity Benefit (Approximate)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                  <div className="border p-3 rounded-md"><p className="text-xs text-muted-foreground">Sum Assured</p><p className="font-semibold">{formatCurrency(result.maturity.sumAssured)}</p></div>
                  <div className="border p-3 rounded-md"><p className="text-xs text-muted-foreground">Vested Bonus</p><p className="font-semibold">{formatCurrency(result.maturity.vestedBonus)}</p></div>
                  <div className="border p-3 rounded-md"><p className="text-xs text-muted-foreground">Final Bonus (FAB)</p><p className="font-semibold">{formatCurrency(result.maturity.fab)}</p></div>
                   <div className="border p-3 rounded-md bg-muted"><p className="text-xs">Total Premiums Paid</p><p className="font-semibold">{formatCurrency(result.totalPremiumsPaid)}</p></div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Surrender & Loan Values (Illustrative)</h3>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="border p-3 rounded-md"><p className="text-xs text-muted-foreground">Guaranteed Surrender</p><p className="font-semibold">{formatCurrency(result.surrender.gsv)}</p></div>
                  <div className="border p-3 rounded-md"><p className="text-xs text-muted-foreground">Special Surrender</p><p className="font-semibold">{formatCurrency(result.surrender.ssv)}</p></div>
                  <div className="border p-3 rounded-md"><p className="text-xs text-muted-foreground">Max Loan Amount</p><p className="font-semibold">{formatCurrency(result.loanAmount)}</p></div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
                <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" />{dictionary.download_pdf}</Button>
                <Button variant="outline" size="sm"><Twitter className="mr-2 h-4 w-4" />{dictionary.share_results}</Button>
                <Button asChild size="sm"><Link href="/contact">{dictionary.contact_cfp}</Link></Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
