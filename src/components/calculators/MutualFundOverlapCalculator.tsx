
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Download, Twitter, Printer, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Dictionary } from '@/types';
import { funds, type FundPortfolio } from '@/data/mutual-fund-holdings';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const formSchema = z.object({
  fund1: z.string().min(1, 'Please select a fund'),
  fund2: z.string().min(1, 'Please select another fund'),
});

type FormValues = z.infer<typeof formSchema>;

type OverlapResult = {
  weightedOverlap: number;
  commonStocks: (FundPortfolio['holdings'][0] & { weight1: number; weight2: number })[];
  topOverlappingStocks: (FundPortfolio['holdings'][0] & { weight1: number; weight2: number })[];
  sectorOverlap: { sector: string; weight1: number; weight2: number; combinedWeight: number }[];
};

type CalculatorProps = {
  dictionary: Dictionary['mutual_fund_overlap_calculator'];
};


const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52s-.669-1.611-.916-2.207c-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
);


export function MutualFundOverlapCalculator({ dictionary }: CalculatorProps) {
  const [result, setResult] = useState<OverlapResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });
  
  async function handleSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    await new Promise(resolve => setTimeout(resolve, 500));

    const fund1 = funds.find(f => f.schemeCode === values.fund1);
    const fund2 = funds.find(f => f.schemeCode === values.fund2);

    if (!fund1 || !fund2) {
      // Handle error, fund not found
      setIsLoading(false);
      return;
    }

    const fund1Holdings = new Map(fund1.holdings.map(h => [h.name, h]));
    const fund2Holdings = new Map(fund2.holdings.map(h => [h.name, h]));

    let weightedOverlap = 0;
    const commonStocks: OverlapResult['commonStocks'] = [];
    const sector1Weights = new Map<string, number>();
    const sector2Weights = new Map<string, number>();

    fund1Holdings.forEach((holding1, stockName) => {
      const currentWeight = sector1Weights.get(holding1.sector) || 0;
      sector1Weights.set(holding1.sector, currentWeight + holding1.weight);
      
      const holding2 = fund2Holdings.get(stockName);
      if (holding2) {
        const minWeight = Math.min(holding1.weight, holding2.weight);
        weightedOverlap += minWeight;
        commonStocks.push({ ...holding1, weight1: holding1.weight, weight2: holding2.weight });
      }
    });

    fund2Holdings.forEach(holding2 => {
        const currentWeight = sector2Weights.get(holding2.sector) || 0;
        sector2Weights.set(holding2.sector, currentWeight + holding2.weight);
    });

    const sectorOverlap: OverlapResult['sectorOverlap'] = [];
    const allSectors = new Set([...sector1Weights.keys(), ...sector2Weights.keys()]);
    allSectors.forEach(sector => {
        const weight1 = sector1Weights.get(sector) || 0;
        const weight2 = sector2Weights.get(sector) || 0;
        sectorOverlap.push({ sector, weight1, weight2, combinedWeight: weight1 + weight2 });
    });
    
    sectorOverlap.sort((a,b) => b.combinedWeight - a.combinedWeight);
    commonStocks.sort((a,b) => Math.min(b.weight1, b.weight2) - Math.min(a.weight1, a.weight2));
    const topOverlappingStocks = commonStocks.slice(0, 5);


    setResult({
      weightedOverlap,
      commonStocks,
      topOverlappingStocks,
      sectorOverlap: sectorOverlap.slice(0, 5)
    });

    setIsLoading(false);
  }

  const getOverlapLevel = (overlap: number) => {
    if (overlap > 60) return { label: 'Very High', color: 'text-red-600' };
    if (overlap > 30) return { label: 'High', color: 'text-orange-500' };
    if (overlap > 10) return { label: 'Moderate', color: 'text-yellow-500' };
    return { label: 'Low', color: 'text-green-500' };
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="fund1" render={({ field }) => (
              <FormItem>
                <FormLabel>Fund 1</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select a fund" /></SelectTrigger></FormControl>
                  <SelectContent>{funds.map(f => <SelectItem key={f.schemeCode} value={f.schemeCode}>{f.schemeName}</SelectItem>)}</SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="fund2" render={({ field }) => (
               <FormItem>
                <FormLabel>Fund 2</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select a fund" /></SelectTrigger></FormControl>
                  <SelectContent>{funds.map(f => <SelectItem key={f.schemeCode} value={f.schemeCode}>{f.schemeName}</SelectItem>)}</SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Calculate Overlap
          </Button>
        </form>
      </Form>

      {isLoading && <div className="text-center py-12"><Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" /></div>}

      {result && (
        <div className="mt-8 space-y-6 animate-in fade-in-50 slide-in-from-bottom-5">
            <Alert variant="default" className="text-center">
                <BarChart2 className="h-4 w-4" />
                <AlertTitle className="text-2xl font-bold">
                    Weighted Overlap: <span className={getOverlapLevel(result.weightedOverlap).color}>{result.weightedOverlap.toFixed(2)}% ({getOverlapLevel(result.weightedOverlap).label})</span>
                </AlertTitle>
                <AlertDescription>
                    This score indicates the degree of concentration between the two funds.
                </AlertDescription>
            </Alert>
            
            <div>
                <h3 className="text-lg font-semibold mb-2">Top 5 Overlapping Stocks</h3>
                <Table>
                    <TableHeader><TableRow><TableHead>Stock</TableHead><TableHead className="text-right">Fund 1 Wt. (%)</TableHead><TableHead className="text-right">Fund 2 Wt. (%)</TableHead><TableHead className="text-right">Min. Wt. (%)</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {result.topOverlappingStocks.map(stock => (
                            <TableRow key={stock.name}>
                                <TableCell>{stock.name}</TableCell>
                                <TableCell className="text-right">{stock.weight1.toFixed(2)}</TableCell>
                                <TableCell className="text-right">{stock.weight2.toFixed(2)}</TableCell>
                                <TableCell className="text-right font-bold">{Math.min(stock.weight1, stock.weight2).toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2">Top 5 Sector Overlaps</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={result.sectorOverlap} layout="vertical" margin={{ left: 100 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tickFormatter={(v) => `${v}%`} />
                        <YAxis type="category" dataKey="sector" width={100} />
                        <Tooltip formatter={(value) => `${Number(value).toFixed(2)}%`} />
                        <Legend />
                        <Bar dataKey="weight1" stackId="a" fill="hsl(var(--primary))" name="Fund 1" />
                        <Bar dataKey="weight2" stackId="a" fill="hsl(var(--accent))" name="Fund 2" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      )}
    </>
  );
}
