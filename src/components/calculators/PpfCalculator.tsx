'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Loader2, Download, Landmark, IndianRupee } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type ChartConfig } from '@/components/ui/chart';
import type { Dictionary } from '@/types';

const formSchema = z.object({
  annualInvestment: z.coerce.number().min(500, 'Minimum annual investment is ₹500').max(150000, 'Maximum annual investment is ₹1,50,000'),
  tenure: z.coerce.number().min(15, 'Minimum tenure is 15 years').max(50, 'Maximum tenure is 50 years'),
  interestRate: z.coerce.number().min(0.1, 'Interest rate must be positive').max(15, 'Interest rate seems too high'),
});

type PpfFormValues = z.infer<typeof formSchema>;

type YearlyData = {
  year: number;
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

type PpfCalculatorProps = {
  dictionary: Dictionary['ppf_calculator'];
};

export function PpfCalculator({ dictionary }: PpfCalculatorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PpfFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      annualInvestment: 150000,
      tenure: 15,
      interestRate: 7.1,
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const annualInvestment = params.get('investment');
    const tenure = params.get('tenure');
    const interestRate = params.get('rate');

    const valuesToSet: Partial<PpfFormValues> = {};
    if (annualInvestment && !isNaN(Number(annualInvestment))) {
      valuesToSet.annualInvestment = Number(annualInvestment);
    }
    if (tenure && !isNaN(Number(tenure))) {
      valuesToSet.tenure = Number(tenure);
    }
    if (interestRate && !isNaN(Number(interestRate))) {
      valuesToSet.interestRate = Number(interestRate);
    }
    
    if (Object.keys(valuesToSet).length > 0) {
      form.reset(valuesToSet);
      handleSubmit(valuesToSet as PpfFormValues);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(values: PpfFormValues) {
    setIsLoading(true);
    setResult(null);

    // Simulate calculation delay
    await new Promise(resolve => setTimeout(resolve, 500));

    let balance = 0;
    let totalInvestment = 0;
    let totalInterest = 0;
    const yearlyData: YearlyData[] = [];

    for (let i = 1; i <= values.tenure; i++) {
      const openingBalance = balance;
      const invested = values.annualInvestment;
      totalInvestment += invested;
      const interest = (openingBalance + invested) * (values.interestRate / 100);
      totalInterest += interest;
      const closingBalance = openingBalance + invested + interest;
      balance = closingBalance;

      yearlyData.push({
        year: i,
        openingBalance,
        invested,
        interest,
        closingBalance,
        totalInvestment,
        totalInterest,
      });
    }

    setResult({
      maturityValue: balance,
      totalInvestment: totalInvestment,
      totalInterest: totalInterest,
      yearlyData,
    });
    
    const params = new URLSearchParams();
    params.set('investment', values.annualInvestment.toString());
    params.set('tenure', values.tenure.toString());
    params.set('rate', values.interestRate.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });

    setIsLoading(false);
  }

  const handleCSVExport = () => {
    if (!result) return;
    const headers = [
      dictionary.table_year,
      dictionary.table_opening_balance,
      dictionary.table_amount_invested,
      dictionary.table_interest_earned,
      dictionary.table_closing_balance,
    ];
    let csvContent = headers.join(',') + '\n';
    result.yearlyData.forEach(row => {
      const rowData = [
        row.year,
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
    link.setAttribute('download', 'ppf_projection.csv');
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
    totalInvestment: {
      label: dictionary.total_investment,
      color: "hsl(var(--primary))",
    },
    totalInterest: {
      label: dictionary.total_interest,
      color: "hsl(var(--accent))",
    },
  } satisfies ChartConfig;

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Landmark className="h-6 w-6 text-primary" />
            <span>{dictionary.title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                   <FormField
                    control={form.control}
                    name="annualInvestment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{dictionary.annual_investment_label}</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder={dictionary.annual_investment_placeholder} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="interestRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{dictionary.interest_rate_label}</FormLabel>
                        <FormControl>
                           <Input type="number" step="0.1" placeholder={dictionary.interest_rate_placeholder} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="tenure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dictionary.tenure_label}: {field.value} years</FormLabel>
                      <FormControl>
                        <Slider
                          min={15}
                          max={50}
                          step={1}
                          value={[field.value]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                          className="py-2"
                        />
                      </FormControl>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>15</span>
                        <span>50</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {dictionary.loading}
                  </>
                ) : (
                  dictionary.calculate_button
                )}
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
                <p className="text-sm text-muted-foreground">{dictionary.maturity_value}</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(result.maturityValue)}</p>
              </div>
              <div className="bg-secondary p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">{dictionary.total_investment}</p>
                <p className="text-2xl font-bold">{formatCurrency(result.totalInvestment)}</p>
              </div>
              <div className="bg-accent/10 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">{dictionary.total_interest}</p>
                <p className="text-2xl font-bold text-accent">{formatCurrency(result.totalInterest)}</p>
              </div>
            </div>

            <Tabs defaultValue="chart">
              <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-grid">
                <TabsTrigger value="chart">{dictionary.view_chart}</TabsTrigger>
                <TabsTrigger value="table">{dictionary.view_table}</TabsTrigger>
              </TabsList>
              <TabsContent value="chart" className="pt-4">
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={result.yearlyData}>
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
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(value) => (value / 100000).toLocaleString('en-IN') + 'L'}/>
                    <Tooltip 
                      contentStyle={{
                        borderRadius: "var(--radius)",
                        border: "1px solid hsl(var(--border))",
                        background: "hsl(var(--background))"
                      }}
                      formatter={(value: number, name: string) => [formatCurrency(value), chartConfig[name as keyof typeof chartConfig]?.label]}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="totalInvestment" stackId="1" stroke="hsl(var(--primary))" fill="url(#colorInvestment)" name="totalInvestment"/>
                    <Area type="monotone" dataKey="totalInterest" stackId="1" stroke="hsl(var(--accent))" fill="url(#colorInterest)" name="totalInterest" />
                  </AreaChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="table" className="pt-4">
                <div className="flex justify-end mb-4">
                  <Button variant="outline" size="sm" onClick={handleCSVExport}>
                    <Download className="mr-2 h-4 w-4" />
                    {dictionary.export_csv}
                  </Button>
                </div>
                <div className="overflow-x-auto max-h-[400px]">
                  <Table>
                    <TableHeader className="sticky top-0 bg-card">
                      <TableRow>
                        <TableHead>{dictionary.table_year}</TableHead>
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
