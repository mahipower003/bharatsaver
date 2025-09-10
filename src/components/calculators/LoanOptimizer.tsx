
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Loader2, Download, BadgePercent, Twitter, Printer } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, Line, ComposedChart } from 'recharts';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type ChartConfig } from '@/components/ui/chart';
import type { Dictionary } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

const formSchema = z.object({
  loanAmount: z.coerce.number().min(1000, 'Loan amount must be at least ₹1,000'),
  interestRate: z.coerce.number().min(1, 'Interest rate must be positive').max(25, 'Rate seems too high'),
  tenure: z.coerce.number().min(1, 'Tenure must be at least 1 year').max(30, 'Tenure seems too long'),
  prepaymentAmount: z.coerce.number().min(0).optional().default(0),
});

type FormValues = z.infer<typeof formSchema>;

type AmortizationData = {
  month: number;
  principal: number;
  interest: number;
  totalPayment: number;
  endingBalance: number;
  totalInterestPaid: number;
};

type CalculationResult = {
  monthlyEMI: number;
  totalInterest: number;
  totalPayment: number;
  amortizationSchedule: AmortizationData[];
  prepaymentResult?: {
    totalInterestSaved: number;
    tenureReducedByMonths: number;
    newTotalInterest: number;
    newAmortizationSchedule: AmortizationData[];
  }
};

type CalculatorProps = {
  dictionary: Dictionary['loan_optimization_calculator'];
};

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52s-.669-1.611-.916-2.207c-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
);


export function LoanOptimizer({ dictionary }: CalculatorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      loanAmount: 1000000,
      interestRate: 8.5,
      tenure: 10,
      prepaymentAmount: 0,
    },
  });

  const calculateAmortization = (principal: number, rate: number, tenureYears: number, monthlyEMI: number, prepaymentAmount = 0, prepaymentMonth = 12) => {
    const monthlyRate = rate / 12 / 100;
    const totalMonths = tenureYears * 12;
    let balance = principal;
    let totalInterestPaid = 0;
    const schedule: AmortizationData[] = [];

    for (let i = 1; i <= totalMonths && balance > 0.01; i++) {
        let currentBalance = balance;
        if (i === prepaymentMonth && prepaymentAmount > 0) {
            currentBalance -= prepaymentAmount;
        }

        const interest = currentBalance * monthlyRate;
        const principalPaid = monthlyEMI - interest;
        balance = currentBalance - principalPaid;
        totalInterestPaid += interest;

        schedule.push({
            month: i,
            principal: principalPaid,
            interest: interest,
            totalPayment: monthlyEMI,
            endingBalance: balance,
            totalInterestPaid: totalInterestPaid
        });
    }
    return { schedule, totalInterestPaid, totalMonths: schedule.length };
  };

  async function handleSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    await new Promise(resolve => setTimeout(resolve, 500));

    const P = values.loanAmount;
    const R = values.interestRate;
    const T = values.tenure;
    const r = R / 12 / 100;
    const n = T * 12;

    const emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const { schedule, totalInterestPaid } = calculateAmortization(P, R, T, emi);

    let prepaymentResult;
    if (values.prepaymentAmount && values.prepaymentAmount > 0) {
        const { schedule: prepaySchedule, totalInterestPaid: newTotalInterest, totalMonths: newTotalMonths } = calculateAmortization(P, R, T, emi, values.prepaymentAmount);
        prepaymentResult = {
            totalInterestSaved: totalInterestPaid - newTotalInterest,
            tenureReducedByMonths: n - newTotalMonths,
            newTotalInterest,
            newAmortizationSchedule: prepaySchedule,
        };
    }
    
    setResult({
      monthlyEMI: emi,
      totalInterest: totalInterestPaid,
      totalPayment: P + totalInterestPaid,
      amortizationSchedule: schedule,
      prepaymentResult: prepaymentResult,
    });
    
    const params = new URLSearchParams();
    params.set('amount', values.loanAmount.toString());
    params.set('rate', values.interestRate.toString());
    params.set('tenure', values.tenure.toString());
    if (values.prepaymentAmount) params.set('prepayment', values.prepaymentAmount.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setIsLoading(false);
  }

  const handlePrint = () => window.print();

  const handleShare = (platform: 'whatsapp' | 'twitter') => {
    if (!result) return;
    const url = window.location.href;
    const text = result.prepaymentResult 
      ? `By prepaying my loan, I can save ${formatCurrency(result.prepaymentResult.totalInterestSaved)}! Find out how much you can save with BharatSaver's Loan Optimizer:`
      : `I just calculated my loan EMI using BharatSaver's calculator! Plan your loan repayments easily:`;
    const shareUrl = platform === 'twitter'
      ? `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`;
    window.open(shareUrl, '_blank');
  };

  const handleCSVExport = () => {
    if (!result) return;
    const schedule = result.prepaymentResult ? result.prepaymentResult.newAmortizationSchedule : result.amortizationSchedule;
    const headers = ["Month", "Principal Paid", "Interest Paid", "Total Payment", "Ending Balance"];
    let csvContent = headers.join(',') + '\n';
    schedule.forEach(row => {
      const rowData = [row.month, Math.round(row.principal), Math.round(row.interest), Math.round(row.totalPayment), Math.round(row.endingBalance)];
      csvContent += rowData.join(',') + '\n';
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'loan_amortization_schedule.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const formatCurrency = (value: number) => value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
            <h2 className="flex items-center gap-2 text-xl font-bold">
                <BadgePercent className="h-6 w-6 text-primary" />
                <span>{dictionary.title}</span>
            </h2>
          <CardDescription>{dictionary.form_description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField control={form.control} name="loanAmount" render={({ field }) => (<FormItem><FormLabel>{dictionary.form.loan_amount}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="interestRate" render={({ field }) => (<FormItem><FormLabel>{dictionary.form.interest_rate}</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="tenure" render={({ field }) => (<FormItem><FormLabel>{dictionary.form.tenure}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField control={form.control} name="prepaymentAmount" render={({ field }) => (<FormItem><FormLabel>{dictionary.form.prepayment_amount}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {dictionary.form.calculating}</> : dictionary.form.calculate_cta}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && <div className="text-center py-12"><Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" /></div>}

      {result && (
        <Card className="mt-8 animate-in fade-in-50 slide-in-from-bottom-5 shadow-lg">
          <CardHeader>
            <CardTitle>{dictionary.results.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 text-center">
              <div className="bg-primary/10 p-4 rounded-lg"><p className="text-sm text-muted-foreground">{dictionary.results.monthly_emi}</p><p className="text-2xl font-bold text-primary">{formatCurrency(result.monthlyEMI)}</p></div>
              <div className="bg-secondary p-4 rounded-lg"><p className="text-sm text-muted-foreground">{dictionary.results.total_interest}</p><p className="text-xl font-bold">{formatCurrency(result.totalInterest)}</p></div>
              <div className="bg-secondary p-4 rounded-lg col-span-2 md:col-span-1"><p className="text-sm text-muted-foreground">{dictionary.results.total_payment}</p><p className="text-xl font-bold">{formatCurrency(result.totalPayment)}</p></div>
            </div>

            {result.prepaymentResult && (
                 <div className="bg-green-500/10 p-6 rounded-lg text-center mb-8">
                    <p className="text-lg font-medium text-green-800 dark:text-green-300">{dictionary.results.prepayment_summary.title}</p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{formatCurrency(result.prepaymentResult.totalInterestSaved)}</p>
                    <p className="text-base text-muted-foreground mt-1">{dictionary.results.prepayment_summary.subtitle.replace('{months}', result.prepaymentResult.tenureReducedByMonths.toString())}</p>
                </div>
            )}
            
            <Tabs defaultValue="chart">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-grid">
                        <TabsTrigger value="chart">{dictionary.results.chart_view}</TabsTrigger>
                        <TabsTrigger value="table">{dictionary.results.table_view}</TabsTrigger>
                    </TabsList>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleShare('whatsapp')}><WhatsAppIcon className="mr-2 h-4 w-4" /> WhatsApp</Button>
                        <Button variant="outline" size="sm" onClick={() => handleShare('twitter')}><Twitter className="mr-2 h-4 w-4" /> Twitter</Button>
                        <Button variant="outline" size="sm" onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print</Button>
                        <Button variant="outline" size="sm" onClick={handleCSVExport}><Download className="mr-2 h-4 w-4" />{dictionary.results.download_csv}</Button>
                    </div>
                </div>

              <TabsContent value="chart" className="pt-4">
                <ResponsiveContainer width="100%" height={400}>
                   <ComposedChart data={result.amortizationSchedule} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tickFormatter={(v) => `Yr ${Math.ceil(v/12)}`} />
                    <YAxis tickFormatter={(value) => (value / 100000).toLocaleString('en-IN') + 'L'} />
                    <Tooltip contentStyle={{ borderRadius: "var(--radius)", border: "1px solid hsl(var(--border))", background: "hsl(var(--background))" }} formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="principal" stackId="a" fill="hsl(var(--primary))" name={dictionary.results.principal_paid} />
                    <Bar dataKey="interest" stackId="a" fill="hsl(var(--accent))" name={dictionary.results.interest_paid} />
                    <Line type="monotone" dataKey="endingBalance" stroke="hsl(var(--destructive))" name={dictionary.results.outstanding_balance} dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="table" className="pt-4">
                <div className="overflow-x-auto max-h-[400px]">
                  <Table>
                    <TableHeader className="sticky top-0 bg-card">
                      <TableRow>
                        <TableHead>{dictionary.results.table.month}</TableHead>
                        <TableHead className="text-right">{dictionary.results.table.principal}</TableHead>
                        <TableHead className="text-right">{dictionary.results.table.interest}</TableHead>
                        <TableHead className="text-right">{dictionary.results.table.total_payment}</TableHead>
                        <TableHead className="text-right">{dictionary.results.table.ending_balance}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.amortizationSchedule.map((row) => (
                        <TableRow key={row.month}>
                          <TableCell>{row.month}</TableCell>
                          <TableCell className="text-right">{formatCurrency(row.principal)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(row.interest)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(row.totalPayment)}</TableCell>
                          <TableCell className="text-right font-semibold">{formatCurrency(row.endingBalance)}</TableCell>
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
    </>
  );
}
