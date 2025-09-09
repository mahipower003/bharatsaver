
'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Loader2, FileText, Twitter, Printer, Download } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from "@/components/ui/checkbox"
import type { Dictionary } from '@/types';
import { type ChartConfig } from '@/components/ui/chart';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

const formSchema = z.object({
  grossSalary: z.coerce.number().min(0, 'Salary must be positive'),
  basicSalary: z.coerce.number().min(0, 'Basic salary must be positive'),
  otherIncome: z.coerce.number().min(0, 'Income must be positive').default(0),
  age: z.coerce.number().min(18),
  
  deductions: z.object({
    section80C: z.coerce.number().min(0).max(150000).default(0),
    section80D: z.coerce.number().min(0).max(100000).default(0),
    section80CCD1B: z.coerce.number().min(0).max(50000).default(0),
    section80TTA: z.coerce.number().min(0).max(10000).default(0),
    hra: z.coerce.number().min(0).default(0),
    rentPaid: z.coerce.number().min(0).default(0),
    isMetro: z.boolean().default(false),
    homeLoanInterest: z.coerce.number().min(0).max(200000).default(0),
    lta: z.coerce.number().min(0).default(0),
  })
});

type FormValues = z.infer<typeof formSchema>;

type TaxResult = {
  regime: string;
  grossTaxableIncome: number;
  taxPayable: number;
  cess: number;
  totalTax: number;
  netIncome: number;
};

type CalculationResult = {
  oldRegime: TaxResult;
  newRegime: TaxResult;
  winner: string;
  savings: number;
  chartData: any[];
};

type CalculatorProps = {
  dictionary: Dictionary['tax_regime_calculator'];
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

export function TaxRegimeCalculator({ dictionary }: CalculatorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      grossSalary: 1000000,
      basicSalary: 500000,
      otherIncome: 0,
      age: 30,
      deductions: {
        section80C: 150000,
        section80D: 25000,
        section80CCD1B: 50000,
        section80TTA: 10000,
        hra: 0,
        rentPaid: 0,
        isMetro: false,
        homeLoanInterest: 0,
        lta: 0
      }
    },
  });

   useEffect(() => {
    // Run calculation on initial load with default values
    handleSubmit(form.getValues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    const currentDate = new Date();
    setLastUpdated(currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
  }, []);

  const calculateHraExemption = (basic: number, hraReceived: number, rentPaid: number, isMetro: boolean) => {
    const limit1 = hraReceived;
    const limit2 = rentPaid - (basic * 0.10);
    const limit3 = isMetro ? (basic * 0.50) : (basic * 0.40);
    return Math.max(0, Math.min(limit1, limit2, limit3));
  };

  const calculateTax = (taxableIncome: number, age: number, isOldRegime: boolean): { tax: number, cess: number, total: number } => {
    let tax = 0;
    const isSenior = age >= 60 && age < 80;
    const isSuperSenior = age >= 80;

    let slabs;
    if (isOldRegime) {
      if (isSuperSenior) {
        slabs = [ { limit: 500000, rate: 0 }, { limit: 1000000, rate: 0.20 }, { limit: Infinity, rate: 0.30 } ];
      } else if (isSenior) {
        slabs = [ { limit: 300000, rate: 0 }, { limit: 500000, rate: 0.05 }, { limit: 1000000, rate: 0.20 }, { limit: Infinity, rate: 0.30 } ];
      } else {
        slabs = [ { limit: 250000, rate: 0 }, { limit: 500000, rate: 0.05 }, { limit: 1000000, rate: 0.20 }, { limit: Infinity, rate: 0.30 } ];
      }
    } else {
       slabs = [ { limit: 300000, rate: 0 }, { limit: 600000, rate: 0.05 }, { limit: 900000, rate: 0.10 }, { limit: 1200000, rate: 0.15 }, { limit: 1500000, rate: 0.20 }, { limit: Infinity, rate: 0.30 } ];
    }

    let income = taxableIncome;
    let lastLimit = 0;

    for (const slab of slabs) {
        if (income <= 0) break;
        const taxableInSlab = Math.min(income, slab.limit - lastLimit);
        tax += taxableInSlab * slab.rate;
        income -= taxableInSlab;
        lastLimit = slab.limit;
    }
    
    // Rebate under section 87A
    if (isOldRegime && taxableIncome <= 500000) {
        tax = 0;
    } else if (!isOldRegime && taxableIncome <= 700000) {
        tax = 0;
    }
    
    const cess = tax * 0.04;
    return { tax, cess, total: tax + cess };
  };

  async function handleSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    await new Promise(resolve => setTimeout(resolve, 500));

    const totalIncome = values.grossSalary + values.otherIncome;
    
    // Old Regime Calculation
    const standardDeductionOld = 50000;
    const hraExemption = calculateHraExemption(values.basicSalary, values.deductions.hra, values.deductions.rentPaid, values.deductions.isMetro);
    const totalDeductionsOld = standardDeductionOld + 
                              values.deductions.section80C + 
                              values.deductions.section80D + 
                              values.deductions.section80CCD1B +
                              values.deductions.section80TTA +
                              hraExemption + 
                              values.deductions.homeLoanInterest +
                              values.deductions.lta;
    
    const taxableIncomeOld = Math.max(0, totalIncome - totalDeductionsOld);
    const taxOld = calculateTax(taxableIncomeOld, values.age, true);

    const oldRegimeResult: TaxResult = {
      regime: 'Old',
      grossTaxableIncome: taxableIncomeOld,
      taxPayable: taxOld.tax,
      cess: taxOld.cess,
      totalTax: taxOld.total,
      netIncome: totalIncome - taxOld.total,
    };

    // New Regime Calculation
    const standardDeductionNew = 50000;
    const taxableIncomeNew = Math.max(0, totalIncome - standardDeductionNew);
    const taxNew = calculateTax(taxableIncomeNew, values.age, false);

    const newRegimeResult: TaxResult = {
        regime: 'New',
        grossTaxableIncome: taxableIncomeNew,
        taxPayable: taxNew.tax,
        cess: taxNew.cess,
        totalTax: taxNew.total,
        netIncome: totalIncome - taxNew.total,
    };

    const winner = oldRegimeResult.totalTax < newRegimeResult.totalTax ? 'Old Regime' : 'New Regime';
    const savings = Math.abs(oldRegimeResult.totalTax - newRegimeResult.totalTax);
    
    const chartData = [
      { name: dictionary.old_regime, tax: Math.round(oldRegimeResult.totalTax) },
      { name: dictionary.new_regime, tax: Math.round(newRegimeResult.totalTax) },
    ];

    setResult({
      oldRegime: oldRegimeResult,
      newRegime: newRegimeResult,
      winner,
      savings,
      chartData
    });
    
    setIsLoading(false);
  }

  const handlePrint = () => window.print();

  const handleShare = (platform: 'whatsapp' | 'twitter') => {
    if (!result) return;
    const url = window.location.href;
    const text = `I just compared tax regimes with BharatSaver! The ${result.winner} saved me ${formatCurrency(result.savings)}. See which one is better for you:`;
    const shareUrl = platform === 'twitter'
      ? `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`;
    window.open(shareUrl, '_blank');
  };

  const handleCSVExport = () => {
    if (!result) return;
    const headers = ["Regime", "Taxable Income", "Tax Payable", "Cess", "Total Tax", "Net Income"];
    let csvContent = headers.join(',') + '\n';
    
    const oldRow = [result.oldRegime.regime, Math.round(result.oldRegime.grossTaxableIncome), Math.round(result.oldRegime.taxPayable), Math.round(result.oldRegime.cess), Math.round(result.oldRegime.totalTax), Math.round(result.oldRegime.netIncome)];
    const newRow = [result.newRegime.regime, Math.round(result.newRegime.grossTaxableIncome), Math.round(result.newRegime.taxPayable), Math.round(result.newRegime.cess), Math.round(result.newRegime.totalTax), Math.round(result.newRegime.netIncome)];

    csvContent += oldRow.join(',') + '\n';
    csvContent += newRow.join(',') + '\n';
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'tax_regime_comparison.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <h2 className="flex items-center gap-2 text-xl font-bold">
                <FileText className="h-6 w-6 text-primary" />
                <span>{dictionary.title}</span>
            </h2>
            {lastUpdated && (
              <p className="text-sm text-muted-foreground mt-1 whitespace-nowrap">{dictionary.last_updated} {lastUpdated}</p>
            )}
          </div>
          <CardDescription>{dictionary.form_description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <FormField control={form.control} name="grossSalary" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.gross_salary_label}</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                 <FormField control={form.control} name="basicSalary" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.basic_salary_label}</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                     <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="otherIncome" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.other_income_label}</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                  </FormItem>
                )} />
                 <FormField control={form.control} name="age" render={({ field }) => (
                    <FormItem>
                        <FormLabel>{dictionary.age_label}</FormLabel>
                        <Select onValueChange={(val) => field.onChange(Number(val))} defaultValue={String(field.value)}>
                            <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="30">{dictionary.age_below_60}</SelectItem>
                                <SelectItem value="65">{dictionary.age_60_to_80}</SelectItem>
                                <SelectItem value="85">{dictionary.age_above_80}</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormItem>
                )}/>
              </div>

              <div className="pt-4">
                <h3 className="text-lg font-semibold mb-4">{dictionary.deductions_title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <FormField control={form.control} name="deductions.section80C" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dictionary.section80C_label}</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                       <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="deductions.section80D" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dictionary.section80D_label}</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                       <FormMessage />
                    </FormItem>
                  )} />
                   <FormField control={form.control} name="deductions.section80CCD1B" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dictionary.section80CCD1B_label}</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                       <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="deductions.section80TTA" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dictionary.section80TTA_label}</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="deductions.hra" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dictionary.hra_label}</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="deductions.rentPaid" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dictionary.rent_paid_label}</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="deductions.isMetro" render={({ field }) => (
                    <FormItem>
                        <FormLabel>{dictionary.metro_city_label}</FormLabel>
                        <FormControl>
                            <RadioGroup onValueChange={(val) => field.onChange(val === 'true')} defaultValue={String(field.value)} className="flex gap-4 pt-2">
                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="true" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="false" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                            </RadioGroup>
                        </FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="deductions.homeLoanInterest" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dictionary.home_loan_interest_label}</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                       <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="deductions.lta" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dictionary.lta_label}</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                       <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {dictionary.loading}</> : dictionary.calculate_button}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && <div className="text-center py-12"><Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" /></div>}

      {result && (
        <Card className="mt-8 animate-in fade-in-50 slide-in-from-bottom-5 shadow-lg">
          <CardHeader>
              <CardTitle>{dictionary.results_title}</CardTitle>
              <CardDescription className="text-lg text-primary font-semibold">
                {dictionary.result_recommendation.replace('{winner}', result.winner).replace('{savings}', formatCurrency(result.savings))}
              </CardDescription>
          </CardHeader>
          <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="border p-4 rounded-lg bg-secondary/30">
                      <h3 className="text-lg font-semibold text-center mb-2">{dictionary.old_regime}</h3>
                      <div className="space-y-2 text-sm">
                          <p className="flex justify-between"><span>{dictionary.total_tax_label}</span> <span className="font-bold text-lg">{formatCurrency(result.oldRegime.totalTax)}</span></p>
                          <p className="flex justify-between text-muted-foreground"><span>{dictionary.taxable_income_label}</span> <span>{formatCurrency(result.oldRegime.grossTaxableIncome)}</span></p>
                          <p className="flex justify-between text-muted-foreground"><span>{dictionary.net_income_label}</span> <span>{formatCurrency(result.oldRegime.netIncome)}</span></p>
                      </div>
                  </div>
                   <div className="border p-4 rounded-lg bg-primary/10">
                      <h3 className="text-lg font-semibold text-center mb-2">{dictionary.new_regime}</h3>
                      <div className="space-y-2 text-sm">
                          <p className="flex justify-between"><span>{dictionary.total_tax_label}</span> <span className="font-bold text-lg">{formatCurrency(result.newRegime.totalTax)}</span></p>
                           <p className="flex justify-between text-muted-foreground"><span>{dictionary.taxable_income_label}</span> <span>{formatCurrency(result.newRegime.grossTaxableIncome)}</span></p>
                           <p className="flex justify-between text-muted-foreground"><span>{dictionary.net_income_label}</span> <span>{formatCurrency(result.newRegime.netIncome)}</span></p>
                      </div>
                  </div>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={result.chartData} layout="vertical" margin={{ left: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(value) => (value / 1000).toLocaleString('en-IN') + 'k'} />
                  <YAxis type="category" dataKey="name" width={80} />
                  <Tooltip contentStyle={{ borderRadius: "var(--radius)", border: "1px solid hsl(var(--border))", background: "hsl(var(--background))" }} formatter={(value: number) => formatCurrency(value)} />
                  <Bar dataKey="tax" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>

               <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                  <Button variant="outline" size="sm" onClick={() => handleShare('whatsapp')}><WhatsAppIcon className="mr-2 h-4 w-4" /> WhatsApp</Button>
                  <Button variant="outline" size="sm" onClick={() => handleShare('twitter')}><Twitter className="mr-2 h-4 w-4" /> Twitter</Button>
                  <Button variant="outline" size="sm" onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print</Button>
                  <Button variant="outline" size="sm" onClick={handleCSVExport}><Download className="mr-2 h-4 w-4" /> {dictionary.next_steps.cta1_title}</Button>
              </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
