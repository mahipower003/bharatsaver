
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Loader2, Download, TrendingUp, Twitter, Printer } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type ChartConfig } from '@/components/ui/chart';
import type { Dictionary } from '@/types';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

const formSchema = z.object({
  contribution: z.coerce.number().min(500, 'Minimum contribution is ₹500').max(200000, 'Maximum contribution is ₹2,00,000'),
  contributionMode: z.enum(['monthly', 'yearly']),
  currentAge: z.coerce.number().min(18, 'Must be at least 18').max(59, 'Must be less than 60'),
  retirementAge: z.coerce.number().min(60, 'Retirement age must be 60 or more').max(75, 'Retirement age must be 75 or less'),
  expectedReturns: z.coerce.number().min(1, 'Return rate must be positive').max(20, 'Return rate seems too high'),
  annuityPercentage: z.coerce.number().min(40).max(100),
  annuityRate: z.coerce.number().min(1).max(15),
});

type NpsFormValues = z.infer<typeof formSchema>;

type YearlyData = {
  year: number;
  age: number;
  openingBalance: number;
  invested: number;
  interest: number;
  closingBalance: number;
  totalInvestment: number;
};

type CalculationResult = {
  totalCorpus: number;
  lumpSumValue: number;
  annuityValue: number;
  monthlyPension: number;
  totalInvestment: number;
  totalInterest: number;
  yearlyData: YearlyData[];
};

type NpsCalculatorProps = {
  dictionary: Dictionary['nps_calculator'];
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


export function NpsCalculator({ dictionary }: NpsCalculatorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');
  
  const form = useForm<NpsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contribution: 6000,
      contributionMode: 'monthly',
      currentAge: 30,
      retirementAge: 60,
      expectedReturns: 9,
      annuityPercentage: 40,
      annuityRate: 6,
    },
  });

  const contributionMode = form.watch('contributionMode');

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const values: Partial<NpsFormValues> = {};
    if (params.get('contribution')) values.contribution = Number(params.get('contribution'));
    if (params.get('mode') === 'monthly' || params.get('mode') === 'yearly') values.contributionMode = params.get('mode');
    if (params.get('age')) values.currentAge = Number(params.get('age'));
    if (params.get('retire')) values.retirementAge = Number(params.get('retire'));
    if (params.get('returns')) values.expectedReturns = Number(params.get('returns'));
    if (params.get('annuity')) values.annuityPercentage = Number(params.get('annuity'));
    if (params.get('annuityRate')) values.annuityRate = Number(params.get('annuityRate'));
    
    if (Object.keys(values).length > 0) {
      form.reset(values);
      handleSubmit(values as NpsFormValues);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const currentDate = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    setLastUpdated(`${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`);
  }, []);

  async function handleSubmit(values: NpsFormValues) {
    setIsLoading(true);
    setResult(null);

    await new Promise(resolve => setTimeout(resolve, 500));

    const investmentPeriod = values.retirementAge - values.currentAge;
    const annualContribution = values.contributionMode === 'monthly' ? values.contribution * 12 : values.contribution;
    const r = values.expectedReturns / 100;

    let balance = 0;
    let totalInvestment = 0;
    const yearlyData: YearlyData[] = [];
    
    for (let i = 1; i <= investmentPeriod; i++) {
        const openingBalance = balance;
        const interest = (openingBalance + annualContribution) * r;
        const closingBalance = openingBalance + annualContribution + interest;
        balance = closingBalance;
        totalInvestment += annualContribution;

        yearlyData.push({
            year: i,
            age: values.currentAge + i,
            openingBalance,
            invested: annualContribution,
            interest,
            closingBalance,
            totalInvestment,
        });
    }

    const totalCorpus = balance;
    const annuityValue = totalCorpus * (values.annuityPercentage / 100);
    const lumpSumValue = totalCorpus - annuityValue;
    const monthlyPension = (annuityValue * (values.annuityRate / 100)) / 12;

    setResult({
      totalCorpus,
      lumpSumValue,
      annuityValue,
      monthlyPension,
      totalInvestment,
      totalInterest: totalCorpus - totalInvestment,
      yearlyData,
    });
    
    const params = new URLSearchParams();
    params.set('contribution', values.contribution.toString());
    params.set('mode', values.contributionMode);
    params.set('age', values.currentAge.toString());
    params.set('retire', values.retirementAge.toString());
    params.set('returns', values.expectedReturns.toString());
    params.set('annuity', values.annuityPercentage.toString());
    params.set('annuityRate', values.annuityRate.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });

    setIsLoading(false);
  }
  
  const handlePrint = () => window.print();

  const handleShare = (platform: 'whatsapp' | 'twitter') => {
    if (!result) return;
    const url = window.location.href;
    const text = `I just calculated my NPS retirement corpus using BharatSaver's calculator! I'm projected to get a corpus of ${formatCurrency(result.totalCorpus)} and a monthly pension of ${formatCurrency(result.monthlyPension)}. Plan your retirement too:`;
    
    let shareUrl = '';
    if (platform === 'twitter') {
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    } else if (platform === 'whatsapp') {
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`;
    }

    if (shareUrl) window.open(shareUrl, '_blank');
  };

  const handleCSVExport = () => {
    if (!result) return;
    const headers = [
      dictionary.table_year,
      dictionary.table_age,
      dictionary.table_opening_balance,
      dictionary.table_amount_invested,
      dictionary.table_interest_earned,
      dictionary.table_closing_balance,
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
    if (link.href) URL.revokeObjectURL(link.href);
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', 'nps_projection.csv');
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
  
  const chartConfig = {
    totalInvestment: { label: dictionary.total_investment, color: "hsl(var(--primary))" },
    totalInterest: { label: dictionary.total_interest, color: "hsl(var(--accent))" },
  } satisfies ChartConfig;

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
           <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <h2 className="flex items-center gap-2 text-xl font-bold">
                <TrendingUp className="h-6 w-6 text-primary" />
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                    <FormField
                        control={form.control}
                        name="contributionMode"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>{dictionary.contribution_mode}</FormLabel>
                            <FormControl>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl><RadioGroupItem value="monthly" /></FormControl>
                                    <FormLabel className="font-normal">{dictionary.monthly_mode}</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl><RadioGroupItem value="yearly" /></FormControl>
                                    <FormLabel className="font-normal">{dictionary.yearly_mode}</FormLabel>
                                </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                    />
                   <FormField
                    control={form.control}
                    name="contribution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{contributionMode === 'yearly' ? dictionary.yearly_contribution_label : dictionary.monthly_contribution_label}</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="expectedReturns"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{dictionary.expected_returns_label}</FormLabel>
                        <FormControl>
                           <Input type="number" step="0.1" {...field} />
                        </FormControl>
                         <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="currentAge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{dictionary.current_age_label}: {field.value} years</FormLabel>
                          <FormControl>
                            <Slider min={18} max={59} step={1} value={[field.value]} onValueChange={(vals) => field.onChange(vals[0])} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="retirementAge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{dictionary.retirement_age_label}: {field.value} years</FormLabel>
                          <FormControl>
                            <Slider min={60} max={75} step={1} value={[field.value]} onValueChange={(vals) => field.onChange(vals[0])} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  <FormField
                      control={form.control}
                      name="annuityPercentage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{dictionary.annuity_percentage_label}: {field.value}%</FormLabel>
                          <FormControl>
                            <Slider min={40} max={100} step={5} value={[field.value]} onValueChange={(vals) => field.onChange(vals[0])} />
                          </FormControl>
                          <CardDescription>{dictionary.annuity_percentage_description}</CardDescription>
                        </FormItem>
                      )}
                  />
                   <FormField
                      control={form.control}
                      name="annuityRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{dictionary.annuity_rate_label}: {field.value}%</FormLabel>
                          <FormControl>
                            <Slider min={1} max={15} step={0.5} value={[field.value]} onValueChange={(vals) => field.onChange(vals[0])} />
                          </FormControl>
                           <CardDescription>{dictionary.annuity_rate_description}</CardDescription>
                        </FormItem>
                      )}
                  />
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
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 text-center">
              <div className="bg-primary/10 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">{dictionary.total_corpus}</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(result.totalCorpus)}</p>
              </div>
              <div className="bg-green-500/10 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">{dictionary.monthly_pension}</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(result.monthlyPension)}</p>
              </div>
              <div className="bg-secondary p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">{dictionary.total_investment}</p>
                <p className="text-xl font-bold">{formatCurrency(result.totalInvestment)}</p>
              </div>
              <div className="bg-accent/10 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">{dictionary.total_interest}</p>
                <p className="text-xl font-bold text-accent-foreground">{formatCurrency(result.totalInterest)}</p>
              </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-center">
                <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">{dictionary.lump_sum_value}</p>
                    <p className="text-xl font-bold">{formatCurrency(result.lumpSumValue)}</p>
                </div>
                 <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">{dictionary.annuity_value}</p>
                    <p className="text-xl font-bold">{formatCurrency(result.annuityValue)}</p>
                </div>
            </div>


            <Tabs defaultValue="chart">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-grid">
                        <TabsTrigger value="chart">{dictionary.view_chart}</TabsTrigger>
                        <TabsTrigger value="table">{dictionary.view_table}</TabsTrigger>
                    </TabsList>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleShare('whatsapp')}><WhatsAppIcon className="mr-2 h-4 w-4" /> WhatsApp</Button>
                        <Button variant="outline" size="sm" onClick={() => handleShare('twitter')}><Twitter className="mr-2 h-4 w-4" /> Twitter</Button>
                        <Button variant="outline" size="sm" onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print</Button>
                        <Button variant="outline" size="sm" onClick={handleCSVExport}><Download className="mr-2 h-4 w-4" />{dictionary.export_csv}</Button>
                    </div>
                </div>

              <TabsContent value="chart" className="pt-4">
                <ResponsiveContainer width="100%" height={400}>
                   <AreaChart data={result.yearlyData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                     <defs>
                      <linearGradient id="colorInvestment" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/><stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/></linearGradient>
                      <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8}/><stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" label={{ value: dictionary.age_label, position: 'insideBottom', offset: -10 }}/>
                    <YAxis tickFormatter={(value) => (value / 100000).toLocaleString('en-IN') + 'L'} label={{ value: dictionary.amount_in_lakhs, angle: -90, position: 'insideLeft' }}/>
                    <Tooltip 
                       contentStyle={{ borderRadius: "var(--radius)", border: "1px solid hsl(var(--border))", background: "hsl(var(--background))" }}
                       formatter={(value: number, name: string) => [formatCurrency(value), chartConfig[name as keyof typeof chartConfig]?.label]}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="totalInvestment" stackId="1" stroke="hsl(var(--primary))" fill="url(#colorInvestment)" name="totalInvestment"/>
                    <Area type="monotone" dataKey="interest" stackId="1" stroke="hsl(var(--accent))" fill="url(#colorInterest)" name="totalInterest" />
                  </AreaChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="table" className="pt-4">
                <div className="overflow-x-auto max-h-[400px]">
                  <Table>
                    <TableHeader className="sticky top-0 bg-card">
                      <TableRow>
                        <TableHead>{dictionary.table_year}</TableHead>
                        <TableHead>{dictionary.table_age}</TableHead>
                        <TableHead className="text-right">{dictionary.table_opening_balance}</TableHead>
                        <TableHead className="text-right">{dictionary.table_amount_invested}</TableHead>
                        <TableHead className="text-right">{dictionary.table_interest_earned}</TableHead>
                        <TableHead className="text-right">{dictionary.table_closing_balance}</TableHead>
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
    </>
  );
}

    