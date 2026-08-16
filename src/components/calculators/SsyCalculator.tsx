'use client';

import { useState, useEffect, useMemo, useDeferredValue } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Download, Baby, Twitter, Printer, Info } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from 'recharts';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type ChartConfig } from '@/components/ui/chart';
import type { Dictionary } from '@/lib/types';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const formSchema = z.object({
  investmentAmount: z.coerce.number().min(250, 'Minimum investment is ₹250').max(150000, 'Maximum investment is ₹1,50,000'),
  girlAge: z.coerce.number().min(0, 'Age cannot be negative').max(10, 'Girl child must be 10 years old or younger'),
  interestRate: z.coerce.number().min(0.1, 'Interest rate must be positive').max(15, 'Interest rate seems too high'),
  investmentMode: z.enum(['yearly', 'monthly']),
});

type SsyFormValues = z.infer<typeof formSchema>;

type YearlyData = {
  year: number;
  age: number;
  openingBalance: number;
  invested: number;
  interest: number;
  closingBalance: number;
  totalInvestment: number;
  totalInterest: number;
};

type CalculationResult = {
  maturityValue: number;
  totalInvestment: number;
  totalInterest: number;
  yearlyData: YearlyData[];
};

type SsyCalculatorProps = {
  dictionary: Dictionary['ssy_calculator'];
};

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
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52s-.669-1.611-.916-2.207c-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    </svg>
);

function calculateSsyLocal(annualInvestment: number, girlAge: number, interestRate: number): CalculationResult {
  let balance = 0;
  let totalInvestment = 0;
  let totalInterest = 0;
  const yearlyData: YearlyData[] = [];
  const tenure = 21;
  const investmentPeriod = 15;

  for (let i = 1; i <= tenure; i++) {
    const openingBalance = balance;
    const invested = i <= investmentPeriod ? annualInvestment : 0;
    totalInvestment += invested;
    const interest = (openingBalance + invested) * (interestRate / 100);
    totalInterest += interest;
    const closingBalance = openingBalance + invested + interest;
    balance = closingBalance;

    yearlyData.push({
      year: i,
      age: girlAge + i,
      openingBalance,
      invested,
      interest,
      closingBalance,
      totalInvestment,
      totalInterest,
    });
  }

  return {
    maturityValue: balance,
    totalInvestment,
    totalInterest,
    yearlyData,
  };
}

export function SsyCalculator({ dictionary }: SsyCalculatorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const form = useForm<SsyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      investmentAmount: 150000,
      girlAge: 5,
      interestRate: 8.2,
      investmentMode: 'yearly',
    },
  });

  const investmentMode = form.watch('investmentMode');
  const formValues = form.watch();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const investment = params.get('investment');
    const girlAge = params.get('age');
    const interestRate = params.get('rate');
    const mode = params.get('mode');

    const valuesToSet: Partial<SsyFormValues> = {};
    if (investment && !isNaN(Number(investment))) {
      valuesToSet.investmentAmount = Number(investment);
    }
    if (girlAge && !isNaN(Number(girlAge))) {
      valuesToSet.girlAge = Number(girlAge);
    }
    if (interestRate && !isNaN(Number(interestRate))) {
      valuesToSet.interestRate = Number(interestRate);
    }
    if (mode === 'monthly' || mode === 'yearly') {
        valuesToSet.investmentMode = mode;
    }
    
    if (Object.keys(valuesToSet).length > 0) {
      form.reset({ ...form.getValues(), ...valuesToSet });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deferredFormValues = useDeferredValue(formValues);
  const yearlyInvestment = deferredFormValues.investmentMode === 'monthly' ? deferredFormValues.investmentAmount * 12 : deferredFormValues.investmentAmount;

  const result = useMemo(() => {
    if (
      deferredFormValues.investmentAmount >= 250 &&
      yearlyInvestment <= 150000 &&
      deferredFormValues.girlAge >= 0 &&
      deferredFormValues.girlAge <= 10 &&
      deferredFormValues.interestRate > 0
    ) {
      return calculateSsyLocal(yearlyInvestment, deferredFormValues.girlAge, deferredFormValues.interestRate);
    }
    return null;
  }, [deferredFormValues.investmentAmount, deferredFormValues.girlAge, deferredFormValues.interestRate, yearlyInvestment]);

  useEffect(() => {
    if (typeof window !== 'undefined' && result) {
      const timer = setTimeout(() => {
        const newQuery = `investment=${deferredFormValues.investmentAmount}&age=${deferredFormValues.girlAge}&rate=${deferredFormValues.interestRate}&mode=${deferredFormValues.investmentMode}`;
        const currentQuery = window.location.search.replace(/^\?/, '');
        if (currentQuery !== newQuery) {
          window.history.replaceState(null, '', `${pathname}?${newQuery}`);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [deferredFormValues.investmentAmount, deferredFormValues.girlAge, deferredFormValues.interestRate, deferredFormValues.investmentMode, result, pathname]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = (platform: 'whatsapp' | 'twitter') => {
    if (!result) return;
    const url = window.location.href;
    const text = `I just calculated my SSY maturity amount using BharatSaver's calculator! I'm projected to get ${formatCurrency(result.maturityValue)}. Plan your daughter's future too:`;
    
    let shareUrl = '';
    if (platform === 'twitter') {
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    } else if (platform === 'whatsapp') {
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  };

  const handleCSVExport = () => {
    if (!result) return;
    const headers = [
      dictionary.table_year || 'Year',
      dictionary.table_age || "Girl's Age",
      dictionary.table_opening_balance || 'Opening Balance',
      dictionary.table_amount_invested || 'Amount Invested',
      dictionary.table_interest_earned || 'Interest Earned',
      dictionary.table_closing_balance || 'Closing Balance',
    ];
    let csvContent = headers.join(',') + '\n';
    result.yearlyData.forEach(row => {
      const rowData = [
        row.year,
        row.age,
        Math.round(row.openingBalance),
        Math.round(row.invested),
        Math.round(row.interest),
        Math.round(row.closingBalance),
      ];
      csvContent += rowData.join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.href) {
      URL.revokeObjectURL(link.href);
    }
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', 'ssy_projection.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  return (
    <TooltipProvider>
      <Card className="shadow-lg border-emerald-500/20">
        <CardHeader>
            <h2 className="flex items-center gap-2 text-xl font-bold">
                <Baby className="h-6 w-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{dictionary.title || "Sukanya Samriddhi Yojana (SSY) Calculator"}</span>
            </h2>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                    <FormField
                        control={form.control}
                        name="investmentMode"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                            <FormLabel className="font-bold">{dictionary.investment_mode || "Investment Mode"}</FormLabel>
                            <FormControl>
                                <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex gap-4"
                                >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                    <RadioGroupItem value="yearly" />
                                    </FormControl>
                                    <FormLabel className="font-normal">{dictionary.yearly_mode || "Yearly"}</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                    <RadioGroupItem value="monthly" />
                                    </FormControl>
                                    <FormLabel className="font-normal">{dictionary.monthly_mode || "Monthly"}</FormLabel>
                                </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                  <FormField
                    control={form.control}
                    name="investmentAmount"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormLabel className="font-bold">{investmentMode === 'yearly' ? (dictionary.yearly_investment_label || "Yearly Investment Amount") : (dictionary.monthly_investment_label || "Monthly Investment Amount")}</FormLabel>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button type="button" className="inline-flex" tabIndex={-1}>
                                <Info className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs text-sm">Maximum ₹1.5 Lakh/year qualifies for Section 80C tax deduction.</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <FormControl>
                          <Input type="number" placeholder={investmentMode === 'yearly' ? (dictionary.yearly_investment_placeholder || "150000") : (dictionary.monthly_investment_placeholder || "12500")} {...field} />
                        </FormControl>
                         <FormDescription>{dictionary.max_investment_note || "Max. yearly investment is ₹1,50,000"}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="interestRate"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormLabel className="font-bold">{dictionary.interest_rate_label || "Interest Rate (% p.a.)"}</FormLabel>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button type="button" className="inline-flex" tabIndex={-1}>
                                <Info className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs text-sm">SSY interest rate is fixed by the government and revised quarterly. Currently 8.2%.</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <FormControl>
                           <Input type="number" step="0.1" placeholder={dictionary.interest_rate_placeholder || "8.2"} {...field} />
                        </FormControl>
                         <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="girlAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">{dictionary.girl_age_label || "Girl's Current Age"}: {field.value} {dictionary.years || "years"}</FormLabel>
                      <FormControl>
                        <Slider
                          min={0}
                          max={10}
                          step={1}
                          value={[field.value]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                          className="py-2"
                        />
                      </FormControl>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0 years</span>
                        <span>10 years</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <Card className="mt-8 animate-in fade-in-50 slide-in-from-bottom-5 shadow-lg border-emerald-500/20">
          <CardHeader>
            <h3 className="text-xl font-bold">{dictionary.results_title || "Your SSY Projection"}</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-center">
              <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-xl border border-emerald-500/20">
                <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">{dictionary.maturity_value || "Maturity Value at 21 Years"}</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{formatCurrency(result.maturityValue)}</p>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl border">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">{dictionary.total_investment || "Total Investment"}</p>
                <p className="text-2xl sm:text-3xl font-bold mt-1 text-foreground">{formatCurrency(result.totalInvestment)}</p>
              </div>
              <div className="bg-teal-50 dark:bg-teal-950/40 p-4 rounded-xl border border-teal-500/20">
                <p className="text-xs font-semibold text-teal-800 dark:text-teal-300 uppercase tracking-wider">{dictionary.total_interest || "Total Interest Earned"}</p>
                <p className="text-2xl sm:text-3xl font-bold mt-1 text-teal-600 dark:text-teal-400">{formatCurrency(result.totalInterest)}</p>
              </div>
            </div>

            <Tabs defaultValue="chart">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-grid">
                        <TabsTrigger value="chart">{dictionary.view_chart || "Chart"}</TabsTrigger>
                        <TabsTrigger value="table">{dictionary.view_table || "Table"}</TabsTrigger>
                    </TabsList>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleShare('whatsapp')}>
                           <WhatsAppIcon className="mr-2 h-4 w-4" /> WhatsApp
                        </Button>
                         <Button variant="outline" size="sm" onClick={() => handleShare('twitter')}>
                           <Twitter className="mr-2 h-4 w-4" /> Twitter
                        </Button>
                        <Button variant="outline" size="sm" onClick={handlePrint}>
                            <Printer className="mr-2 h-4 w-4" /> Print
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleCSVExport}>
                            <Download className="mr-2 h-4 w-4" />
                            {dictionary.export_csv || "Export CSV"}
                        </Button>
                    </div>
                </div>

              <TabsContent value="chart" className="pt-4">
                <ResponsiveContainer width="100%" height={400}>
                   <AreaChart data={result.yearlyData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                     <defs>
                      <linearGradient id="colorInvestment" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" label={{ value: dictionary.girl_age_label || "Girl's Age", position: 'insideBottom', offset: -10 }}/>
                    <YAxis tickFormatter={(value) => (value / 100000).toLocaleString('en-IN') + 'L'} label={{ value: dictionary.amount_in_lakhs || "Amount (in Lakhs)", angle: -90, position: 'insideLeft' }}/>
                    <RechartsTooltip 
                       contentStyle={{
                        borderRadius: "var(--radius)",
                        border: "1px solid hsl(var(--border))",
                        background: "hsl(var(--background))"
                      }}
                      formatter={(value: number) => [formatCurrency(value), 'Value']}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="totalInvestment" stackId="1" stroke="hsl(var(--primary))" fill="url(#colorInvestment)" name={dictionary.total_investment || "Total Investment"}/>
                    <Area type="monotone" dataKey="totalInterest" stackId="1" stroke="hsl(var(--accent))" fill="url(#colorInterest)" name={dictionary.total_interest || "Total Interest Earned"} />
                  </AreaChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="table" className="pt-4">
                <div className="overflow-x-auto max-h-[400px]">
                  <Table>
                    <TableHeader className="sticky top-0 bg-card">
                      <TableRow>
                        <TableHead>{dictionary.table_year || "Year"}</TableHead>
                        <TableHead>{dictionary.table_age || "Girl's Age"}</TableHead>
                        <TableHead className="text-right">{dictionary.table_opening_balance || "Opening Balance"}</TableHead>
                        <TableHead className="text-right">{dictionary.table_amount_invested || "Amount Invested"}</TableHead>
                        <TableHead className="text-right">{dictionary.table_interest_earned || "Interest Earned"}</TableHead>
                        <TableHead className="text-right">{dictionary.table_closing_balance || "Closing Balance"}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.yearlyData.map((row) => (
                        <TableRow key={row.year}>
                          <TableCell>{row.year}</TableCell>
                          <TableCell>{row.age}</TableCell>
                          <TableCell className="text-right">{formatCurrency(row.openingBalance)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(row.invested)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(row.interest)}</TableCell>
                          <TableCell className="text-right font-semibold">{formatCurrency(row.closingBalance)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </TooltipProvider>
  );
}
