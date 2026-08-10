
'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Download, Printer, Twitter, Info, Sparkles } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
    <TooltipProvider>
      <Card className="border-2 border-emerald-500/20 shadow-xl bg-card">
        <CardHeader className="bg-gradient-to-r from-emerald-950/10 via-teal-950/10 to-transparent p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg sm:text-2xl font-bold flex items-center gap-2 text-foreground">
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{dictionary.title || "LIC Maturity & Bonus Calculator"}</span>
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm mt-1">
                {dictionary.description || "Calculate estimated maturity returns including Simple Reversionary Bonus (SRB) & Final Additional Bonus (FAB)."}
              </CardDescription>
            </div>
            <span className="self-start sm:self-auto text-[11px] sm:text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200">
              2026 Bonus Rates
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-3.5 sm:p-6 pt-4 sm:pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <FormField
                  control={form.control}
                  name="plan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm font-medium">{dictionary.plan_label || "Select LIC Policy Plan"}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="font-semibold h-10 sm:h-11 text-xs sm:text-sm">
                            <SelectValue placeholder={dictionary.plan_placeholder || "Select Plan"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="jeevan-labh">Jeevan Labh (Plan 936 / 736)</SelectItem>
                          <SelectItem value="jeevan-anand">New Jeevan Anand (Plan 915 / 715)</SelectItem>
                          <SelectItem value="new-endowment">New Endowment (Plan 914 / 814)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sumAssured"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center mb-1">
                        <FormLabel className="text-xs sm:text-sm font-medium">{dictionary.sum_assured_label || "Basic Sum Assured (₹)"}</FormLabel>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(field.value || 0)}</span>
                      </div>
                      <FormControl>
                        <Input type="number" {...field} className="font-semibold h-10 sm:h-11 text-xs sm:text-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="policyTerm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm font-medium">{dictionary.policy_term_label || "Policy Term (Years)"}</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="font-semibold h-10 sm:h-11 text-xs sm:text-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="annualPremium"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm font-medium">{dictionary.premium_label || "Annual Premium Paid (₹)"}</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="font-semibold h-10 sm:h-11 text-xs sm:text-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bonusRate"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-1.5 mb-1">
                        <FormLabel className="text-xs sm:text-sm font-medium">{dictionary.bonus_rate_label || "Bonus Rate (per ₹1,000 SA)"}</FormLabel>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button type="button" className="inline-flex" tabIndex={-1}>
                              <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-emerald-600 transition-colors" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs text-xs">Illustrative Simple Reversionary Bonus per ₹1,000 Sum Assured. Usually ₹40 to ₹50 depending on the plan.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <FormControl>
                        <Input type="number" {...field} className="font-semibold h-10 sm:h-11 text-xs sm:text-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fabRate"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-1.5 mb-1">
                        <FormLabel className="text-xs sm:text-sm font-medium">{dictionary.fab_rate_label || "FAB Rate (per ₹1,000 SA)"}</FormLabel>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button type="button" className="inline-flex" tabIndex={-1}>
                              <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-emerald-600 transition-colors" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs text-xs">Final Additional Bonus per ₹1,000 SA. Paid at maturity for policies running 15+ years.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <FormControl>
                        <Input type="number" {...field} className="font-semibold h-10 sm:h-11 text-xs sm:text-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-xs sm:text-sm font-medium mb-1">{dictionary.dob_label || "Date of Birth"}</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-between pl-3 text-left font-normal h-10 sm:h-11 text-xs sm:text-sm",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50 shrink-0" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastPremiumDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-xs sm:text-sm font-medium mb-1">{dictionary.last_premium_date_label || "Last Premium Paid Date"}</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-between pl-3 text-left font-normal h-10 sm:h-11 text-xs sm:text-sm",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50 shrink-0" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Quick Select Presets */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
                <span className="text-xs font-semibold text-muted-foreground">Quick Select SA:</span>
                {[500000, 1000000, 2500000, 5000000, 10000000].map((sa) => (
                  <button
                    key={sa}
                    type="button"
                    onClick={() => {
                      form.setValue('sumAssured', sa, { shouldValidate: true });
                    }}
                    className="text-[11px] sm:text-xs px-2.5 py-1 rounded-md bg-muted hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-400 font-medium transition-colors border"
                  >
                    {sa >= 10000000 ? `₹${sa / 10000000} Cr` : `₹${sa / 100000} Lakh`}
                  </button>
                ))}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto h-11 text-base font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {dictionary.calculating || "Calculating Maturity..."}
                  </>
                ) : (
                  dictionary.calculate_button || "Calculate Estimated Maturity Payout"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <Card className="mt-6 sm:mt-8 border-2 border-emerald-500/20 shadow-xl bg-card">
          <CardHeader className="bg-gradient-to-r from-emerald-950/10 via-teal-950/10 to-transparent p-4 sm:p-6 pb-2 sm:pb-3">
            <CardTitle className="text-lg sm:text-xl font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>Calculation Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3.5 sm:p-6 space-y-6">
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-4 sm:p-6 rounded-xl text-center text-white shadow-lg">
              <p className="text-xs sm:text-sm font-medium text-emerald-100 uppercase tracking-wider">Estimated Total Maturity Benefit</p>
              <p className="text-2xl sm:text-4xl font-extrabold mt-1">{formatCurrency(result.maturity.total)}</p>
              <p className="text-xs text-emerald-100/90 mt-1">Tax-Free Under Section 10(10D)</p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                Maturity Benefit Breakdown
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-muted/50 rounded-lg border">
                  <p className="text-xs text-muted-foreground">Basic Sum Assured</p>
                  <p className="text-base font-bold text-foreground mt-0.5">{formatCurrency(result.maturity.sumAssured)}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg border">
                  <p className="text-xs text-muted-foreground">Vested Bonus (SRB)</p>
                  <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{formatCurrency(result.maturity.vestedBonus)}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg border">
                  <p className="text-xs text-muted-foreground">Final Add. Bonus (FAB)</p>
                  <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{formatCurrency(result.maturity.fab)}</p>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">Total Premiums Paid</p>
                  <p className="text-base font-bold text-foreground mt-0.5">{formatCurrency(result.totalPremiumsPaid)}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                Illustrative Surrender & Loan Liquidity
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-muted/50 rounded-lg border">
                  <p className="text-xs text-muted-foreground">Guaranteed Surrender Value</p>
                  <p className="text-base font-bold text-foreground mt-0.5">{formatCurrency(result.surrender.gsv)}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg border">
                  <p className="text-xs text-muted-foreground">Special Surrender Value</p>
                  <p className="text-base font-bold text-foreground mt-0.5">{formatCurrency(result.surrender.ssv)}</p>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">Max Available Policy Loan</p>
                  <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{formatCurrency(result.loanAmount)}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t">
              <Button variant="outline" size="default" className="w-full sm:w-auto text-xs sm:text-sm">
                <Download className="mr-2 h-4 w-4" />
                {dictionary.download_pdf || "Download PDF Report"}
              </Button>
              <Button variant="outline" size="default" className="w-full sm:w-auto text-xs sm:text-sm">
                <Twitter className="mr-2 h-4 w-4" />
                {dictionary.share_results || "Share Results"}
              </Button>
              <Button asChild size="default" className="w-full sm:w-auto text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md">
                <Link href="/contact">{dictionary.contact_cfp || "Consult a Financial Expert"}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </TooltipProvider>
  );
}
