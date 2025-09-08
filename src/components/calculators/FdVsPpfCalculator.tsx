
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Loader2, ArrowRightLeft, Twitter, Printer, Download, AlertTriangle } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Dictionary } from '@/types';
import { type ChartConfig } from '@/components/ui/chart';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const formSchema = z.object({
  investmentAmount: z.coerce.number().min(500, 'Minimum investment is ₹500'),
  fdTenure: z.coerce.number().min(1, 'Minimum tenure is 1 year').max(50, 'Maximum tenure is 50 years'),
  fdRate: z.coerce.number().min(1, 'Rate must be positive').max(15, 'Rate seems too high'),
  ppfRate: z.coerce.number().min(1).max(15),
  taxBracket: z.coerce.number().min(0).max(30),
});

type FormValues = z.infer<typeof formSchema>;

type CalculationResult = {
  fdMaturity: number;
  fdInterest: number;
  fdPostTaxMaturity: number;
  ppfMaturity: number;
  ppfInterest: number;
  totalPpfInvestment: number;
  chartData: any[];
};

type CalculatorProps = {
  dictionary: Dictionary['fd_vs_ppf_calculator'];
};

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52s-.669-1.611-.916-2.207c-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
);


export function FdVsPpfCalculator({ dictionary }: CalculatorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      investmentAmount: 100000,
      fdTenure: 15,
      fdRate: 7,
      ppfRate: 7.1,
      taxBracket: 30,
    },
  });
  
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const values: Partial<FormValues> = {};
    if (params.get('amount')) values.investmentAmount = Number(params.get('amount'));
    if (params.get('tenure')) values.fdTenure = Number(params.get('tenure'));
    if (params.get('fdRate')) values.fdRate = Number(params.get('fdRate'));
    if (params.get('ppfRate')) values.ppfRate = Number(params.get('ppfRate'));
    if (params.get('tax')) values.taxBracket = Number(params.get('tax'));

    if (Object.keys(values).length > 0) {
      form.reset(values);
      handleSubmit(values as FormValues);
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const currentDate = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    setLastUpdated(`${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`);
  }, []);

  async function handleSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    await new Promise(resolve => setTimeout(resolve, 500));

    const P_fd = values.investmentAmount;
    const r_fd = values.fdRate / 100;
    const t_fd = values.fdTenure;
    const fdMaturity = P_fd * Math.pow(1 + r_fd, t_fd);
    const fdInterest = fdMaturity - P_fd;
    const taxOnInterest = fdInterest * (values.taxBracket / 100);
    const fdPostTaxMaturity = P_fd + (fdInterest - taxOnInterest);

    const P_ppf_annual = values.investmentAmount;
    const r_ppf = values.ppfRate / 100;
    const t_ppf = values.fdTenure >= 15 ? values.fdTenure : 15; // PPF min tenure is 15
    let ppfBalance = 0;
    let totalPpfInvestment = 0;
    for (let i = 0; i < t_ppf; i++) {
        const contribution = i < values.fdTenure ? P_ppf_annual : 0;
        ppfBalance = (ppfBalance + contribution) * (1 + r_ppf);
        totalPpfInvestment += contribution;
    }
    const ppfInterest = ppfBalance - totalPpfInvestment;

    const chartData = [
      {
        name: 'FD',
        'Gross Value': Math.round(fdMaturity),
        'Post-Tax Value': Math.round(fdPostTaxMaturity),
      },
      {
        name: 'PPF',
        'Gross Value': Math.round(ppfBalance),
        'Post-Tax Value': Math.round(ppfBalance),
      }
    ];

    setResult({
      fdMaturity,
      fdInterest,
      fdPostTaxMaturity,
      ppfMaturity: ppfBalance,
      ppfInterest,
      totalPpfInvestment,
      chartData
    });
    
    const params = new URLSearchParams();
    params.set('amount', values.investmentAmount.toString());
    params.set('tenure', values.fdTenure.toString());
    params.set('fdRate', values.fdRate.toString());
    params.set('ppfRate', values.ppfRate.toString());
    params.set('tax', values.taxBracket.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });

    setIsLoading(false);
  }

  const handlePrint = () => window.print();

  const handleShare = (platform: 'whatsapp' | 'twitter') => {
    if (!result) return;
    const url = window.location.href;
    const text = `I just compared FD and PPF returns using BharatSaver! For an investment of ${formatCurrency(form.getValues().investmentAmount)}, PPF yields ${formatCurrency(result.ppfMaturity)} vs FD's post-tax ${formatCurrency(result.fdPostTaxMaturity)}. Plan your investments:`;
    const shareUrl = platform === 'twitter'
      ? `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`;
    window.open(shareUrl, '_blank');
  };

  const handleCSVExport = () => {
    if (!result) return;
    const headers = ["Investment", "Gross Maturity", "Post-Tax Maturity", "Total Interest", "Total Investment"];
    let csvContent = headers.join(',') + '\n';
    const fdRow = ['FD', Math.round(result.fdMaturity), Math.round(result.fdPostTaxMaturity), Math.round(result.fdInterest), form.getValues().investmentAmount];
    const ppfRow = ['PPF', Math.round(result.ppfMaturity), Math.round(result.ppfMaturity), Math.round(result.ppfInterest), Math.round(result.totalPpfInvestment)];
    csvContent += fdRow.join(',') + '\n';
    csvContent += ppfRow.join(',') + '\n';
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'fd_vs_ppf_comparison.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  const chartConfig = {
    "Gross Value": { label: "Gross Value", color: "hsl(var(--secondary-foreground))" },
    "Post-Tax Value": { label: "Post-Tax Value", color: "hsl(var(--primary))" },
  } satisfies ChartConfig;

  const winner = result ? (result.ppfMaturity > result.fdPostTaxMaturity ? 'PPF' : 'FD') : null;
  const difference = result ? Math.abs(result.ppfMaturity - result.fdPostTaxMaturity) : 0;

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <h2 className="flex items-center gap-2 text-xl font-bold">
                <ArrowRightLeft className="h-6 w-6 text-primary" />
                <span>{dictionary.title}</span>
            </h2>
             {lastUpdated && (
              <p className="text-sm text-muted-foreground mt-1 whitespace-nowrap">{dictionary.last_updated} {lastUpdated}</p>
            )}
          </div>
          <CardDescription dangerouslySetInnerHTML={{__html: dictionary.form_description}}></CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                  <FormField control={form.control} name="investmentAmount" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dictionary.investment_amount_label}</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="fdTenure" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dictionary.tenure_label}</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                   <FormField control={form.control} name="taxBracket" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dictionary.tax_bracket_label}</FormLabel>
                      <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={String(field.value)}>
                          <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select tax bracket" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                          <SelectItem value="0">0%</SelectItem>
                          <SelectItem value="5">5%</SelectItem>
                          <SelectItem value="10">10%</SelectItem>
                          <SelectItem value="20">20%</SelectItem>
                          <SelectItem value="30">30%</SelectItem>
                          </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <div className="space-y-6">
                    <FormField control={form.control} name="fdRate" render={({ field }) => (
                        <FormItem>
                        <FormLabel>{dictionary.fd_rate_label}</FormLabel>
                        <FormControl><Input type="number" step="0.1" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="ppfRate" render={({ field }) => (
                        <FormItem>
                        <FormLabel>{dictionary.ppf_rate_label}</FormLabel>
                        <FormControl><Input type="number" step="0.1" {...field} /></FormControl>
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
        <>
            <Alert variant="destructive" className="mt-8">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{dictionary.clarifier_note.title}</AlertTitle>
              <AlertDescription dangerouslySetInnerHTML={{ __html: dictionary.clarifier_note.body }} />
            </Alert>

            <Alert className="mt-4">
              <AlertTitle>{dictionary.assumptions.title}</AlertTitle>
              <AlertDescription>
                <div className="prose dark:prose-invert max-w-none text-sm" dangerouslySetInnerHTML={{ __html: dictionary.assumptions.body }} />
              </AlertDescription>
            </Alert>
            
            <Card className="mt-4 animate-in fade-in-50 slide-in-from-bottom-5 shadow-lg">
              <CardHeader>
                  <CardTitle>{dictionary.results_title}</CardTitle>
                  <CardDescription>
                      {dictionary.result_snapshot.replace('{winner}', winner || '').replace('{difference}', formatCurrency(difference))}
                  </CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="border p-4 rounded-lg">
                          <h3 className="text-lg font-semibold text-center mb-2">{dictionary.fd_label}</h3>
                          <div className="space-y-2">
                              <p className="flex justify-between"><span>{dictionary.fd_maturity_label}</span> <span className="font-bold">{formatCurrency(result.fdMaturity)}</span></p>
                              <p className="flex justify-between"><span>{dictionary.fd_post_tax_maturity_label}</span> <span className="font-bold text-primary">{formatCurrency(result.fdPostTaxMaturity)}</span></p>
                              <p className="flex justify-between text-sm text-muted-foreground"><span>{dictionary.total_interest_label}</span> <span>{formatCurrency(result.fdInterest)}</span></p>
                              <p className="flex justify-between text-sm text-muted-foreground"><span>{dictionary.total_investment_label}</span> <span>{formatCurrency(form.getValues().investmentAmount)}</span></p>
                          </div>
                      </div>
                      <div className="border p-4 rounded-lg">
                          <h3 className="text-lg font-semibold text-center mb-2">{dictionary.ppf_label}</h3>
                          <div className="space-y-2">
                              <p className="flex justify-between"><span>{dictionary.ppf_maturity_label}</span> <span className="font-bold text-primary">{formatCurrency(result.ppfMaturity)}</span></p>
                              <p className="flex justify-between text-sm text-muted-foreground"><span>{dictionary.total_interest_label}</span> <span>{formatCurrency(result.ppfInterest)}</span></p>
                              <p className="flex justify-between text-sm text-muted-foreground"><span>{dictionary.total_investment_label}</span> <span>{formatCurrency(result.totalPpfInvestment)}</span></p>
                          </div>
                      </div>
                  </div>

                  <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={result.chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => (value / 100000).toLocaleString('en-IN') + 'L'} />
                      <Tooltip contentStyle={{ borderRadius: "var(--radius)", border: "1px solid hsl(var(--border))", background: "hsl(var(--background))" }} formatter={(value: number) => formatCurrency(value)} />
                      <Legend />
                      <Bar dataKey="Gross Value" fill="hsl(var(--secondary-foreground))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Post-Tax Value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                  </ResponsiveContainer>

                  <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                      <Button variant="outline" size="sm" onClick={() => handleShare('whatsapp')}><WhatsAppIcon className="mr-2 h-4 w-4" /> WhatsApp</Button>
                      <Button variant="outline" size="sm" onClick={() => handleShare('twitter')}><Twitter className="mr-2 h-4 w-4" /> Twitter</Button>
                      <Button variant="outline" size="sm" onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print</Button>
                      <Button variant="outline" size="sm" onClick={handleCSVExport}><Download className="mr-2 h-4 w-4" />{dictionary.export_csv}</Button>
                  </div>
              </CardContent>
            </Card>
        </>
      )}
    </>
  );
}
