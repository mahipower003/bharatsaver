
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Download, Target, Twitter, Printer } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type ChartConfig } from '@/components/ui/chart';
import type { Dictionary } from '@/types';
import { calculateRetirementCorpus } from '@/lib/calculations';

const formSchema = z.object({
  currentAge: z.coerce.number().min(18, 'Must be at least 18').max(60, 'Age is too high for retirement planning'),
  retirementAge: z.coerce.number().min(40, 'Retirement age seems too low').max(75, 'Retirement age seems too high'),
  monthlyExpenses: z.coerce.number().min(1000, 'Expenses seem too low'),
  currentSavings: z.coerce.number().min(0, 'Savings cannot be negative').default(0),
  inflationRate: z.coerce.number().min(1, 'Rate must be positive').max(15, 'Rate seems too high'),
  preRetirementReturns: z.coerce.number().min(1, 'Rate must be positive').max(25, 'Rate seems too high'),
  postRetirementReturns: z.coerce.number().min(1, 'Rate must be positive').max(15, 'Rate seems too high'),
});

export type FormValues = z.infer<typeof formSchema>;

type YearlyData = {
  year: number;
  age: number;
  sipValue: number;
  existingCorpusValue: number;
  totalCorpus: number;
};

export type CalculationResult = {
  requiredCorpus: number;
  corpusShortfall: number;
  monthlySip: number;
  yearlyData: YearlyData[];
  futureMonthlyExpenses: number;
};

type CalculatorProps = {
  dictionary: Dictionary['retirement_corpus_calculator'];
  initialResult: CalculationResult;
};

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52s-.669-1.611-.916-2.207c-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
);


export function RetirementCorpusCalculator({ dictionary, initialResult }: CalculatorProps) {
  const [result, setResult] = useState<CalculationResult | null>(initialResult);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentAge: 30,
      retirementAge: 60,
      monthlyExpenses: 50000,
      currentSavings: 500000,
      inflationRate: 6,
      preRetirementReturns: 12,
      postRetirementReturns: 7,
    },
  });

  async function handleSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    await new Promise(resolve => setTimeout(resolve, 200));

    const calculatedResult = calculateRetirementCorpus(values);
    setResult(calculatedResult);
    
    setIsLoading(false);
  }
  
  const handlePrint = () => window.print();

  const handleShare = (platform: 'whatsapp' | 'twitter') => {
    if (!result) return;
    const url = window.location.href;
    const text = `I just calculated my retirement corpus with BharatSaver! I need to save ${formatCurrency(result.monthlySip)} monthly to reach my goal of ${formatCurrency(result.requiredCorpus)}. Plan your retirement too:`;
    const shareUrl = platform === 'twitter'
      ? `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`;
    window.open(shareUrl, '_blank');
  };

  const handleCSVExport = () => {
    if (!result) return;
    const headers = [dictionary.table_year, dictionary.table_age, "SIP Corpus", "Existing Savings Corpus", "Total Corpus"];
    let csvContent = headers.join(',') + '\n';
    result.yearlyData.forEach(row => {
      const rowData = [
        row.year,
        row.age,
        Math.round(row.sipValue),
        Math.round(row.existingCorpusValue),
        Math.round(row.totalCorpus),
      ];
      csvContent += rowData.join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'retirement_projection.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const formatCurrency = (value: number) => {
    if (Math.abs(value) >= 10000000) {
        return `₹${(value / 10000000).toFixed(2)} Cr`;
    }
    if (Math.abs(value) >= 100000) {
        return `₹${(value / 100000).toFixed(2)} Lakh`;
    }
    return value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  const chartConfig = {
    sipValue: { label: "SIP Corpus", color: "hsl(var(--primary))" },
    existingCorpusValue: { label: "Existing Savings", color: "hsl(var(--accent))" },
  } satisfies ChartConfig;


  return (
    <>
      <Card className="shadow-lg mt-8">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <h2 className="flex items-center gap-2 text-xl font-bold">
                <Target className="h-6 w-6 text-primary" />
                <span>{dictionary.title}</span>
            </h2>
          </div>
          <CardDescription>{dictionary.form_description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <FormField control={form.control} name="currentAge" render={({ field }) => (<FormItem><FormLabel>{dictionary.current_age_label}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="retirementAge" render={({ field }) => (<FormItem><FormLabel>{dictionary.retirement_age_label}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="monthlyExpenses" render={({ field }) => (<FormItem><FormLabel>{dictionary.monthly_expenses_label}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="currentSavings" render={({ field }) => (<FormItem><FormLabel>{dictionary.current_savings_label}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="inflationRate" render={({ field }) => (<FormItem><FormLabel>{dictionary.inflation_rate_label}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="preRetirementReturns" render={({ field }) => (<FormItem><FormLabel>{dictionary.pre_retirement_returns_label}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="postRetirementReturns" render={({ field }) => (<FormItem><FormLabel>{dictionary.post_retirement_returns_label}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-center">
                  <div className="bg-primary/10 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">{dictionary.required_corpus}</p>
                      <p className="text-2xl font-bold text-primary">{formatCurrency(result.requiredCorpus)}</p>
                  </div>
                  <div className={`p-4 rounded-lg ${result.corpusShortfall > 0 ? 'bg-destructive/10' : 'bg-green-500/10'}`}>
                      <p className="text-sm text-muted-foreground">{result.corpusShortfall > 0 ? dictionary.corpus_shortfall : dictionary.corpus_surplus}</p>
                      <p className={`text-2xl font-bold ${result.corpusShortfall > 0 ? 'text-destructive' : 'text-green-600'}`}>{formatCurrency(Math.abs(result.corpusShortfall))}</p>
                  </div>
                  <div className="bg-secondary p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">{dictionary.monthly_sip}</p>
                      <p className="text-2xl font-bold">{formatCurrency(result.monthlySip)}</p>
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
                      <linearGradient id="colorSip" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/><stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/></linearGradient>
                      <linearGradient id="colorExisting" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8}/><stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" label={{ value: dictionary.age_label, position: 'insideBottom', offset: -10 }}/>
                    <YAxis tickFormatter={(value) => (value / 100000).toLocaleString('en-IN') + 'L'} label={{ value: dictionary.amount_in_lakhs, angle: -90, position: 'insideLeft' }}/>
                    <Tooltip 
                       contentStyle={{ borderRadius: "var(--radius)", border: "1px solid hsl(var(--border))", background: "hsl(var(--background))" }}
                       formatter={(value: number, name: string) => [formatCurrency(value), chartConfig[name as keyof typeof chartConfig]?.label]}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="existingCorpusValue" stackId="1" stroke="hsl(var(--accent))" fill="url(#colorExisting)" name="existingCorpusValue"/>
                    <Area type="monotone" dataKey="sipValue" stackId="1" stroke="hsl(var(--primary))" fill="url(#colorSip)" name="sipValue"/>
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
                        <TableHead className="text-right">{dictionary.table_total_corpus}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.yearlyData.map((row) => (
                        <TableRow key={row.year}>
                          <TableCell>{row.year}</TableCell>
                          <TableCell>{row.age}</TableCell>
                          <TableCell className="text-right font-semibold">{formatCurrency(row.totalCorpus)}</TableCell>
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

    

    