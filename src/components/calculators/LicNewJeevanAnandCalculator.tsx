
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Download, Printer, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '../ui/checkbox';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { Info } from 'lucide-react';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52s-.669-1.611-.916-2.207c-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
);

const formSchema = z.object({
  age: z.coerce.number().min(18, "Minimum age is 18").max(50, "Maximum age is 50"),
  term: z.coerce.number().min(15, "Min term is 15").max(35, "Max term is 35"),
  sumAssured: z.coerce.number().min(100000, "Minimum Sum Assured is 1,00,000"),
  addb: z.boolean().default(false),
  termRider: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

type CalculationResult = {
  firstYear: { mode: string; premium: number; gst: number; total: number; base: number; riders: number; }[];
  secondYear: { mode: string; premium: number; gst: number; total: number; base: number; riders: number; }[];
  totalPremiumPaid: number;
  maturity: {
    sumAssured: number;
    bonus: number;
    fab: number;
    total: number;
  };
  chartData: any[];
  deathBenefit: number;
};

// Simplified tabular rates for illustration.
const premiumRates: Record<number, number> = {
  18: 56.45, 25: 45.00, 30: 38.80, 35: 34.50, 40: 31.75, 45: 30.20, 50: 29.80,
};
const termRiderRates: Record<number, number> = {
    20: 1.5, 30: 2.0, 40: 3.0, 50: 5.0,
};

const getRateForAge = (age: number, rates: Record<number, number>): number => {
    const availableAges = Object.keys(rates).map(Number).sort((a,b) => a - b);
    let applicableRate = rates[availableAges[availableAges.length - 1]];
    for (let i = 0; i < availableAges.length; i++) {
        if (age <= availableAges[i]) {
            applicableRate = rates[availableAges[i]];
            break;
        }
    }
    return applicableRate;
};

export function LicNewJeevanAnandCalculator({ dictionary }: { dictionary: any }) {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 30,
      term: 25,
      sumAssured: 1000000,
      addb: true,
      termRider: false,
    },
  });

  async function handleSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    await new Promise(resolve => setTimeout(resolve, 500));

    const termRate = getRateForAge(values.age, premiumRates);
    const baseYearlyPremium = (values.sumAssured / 1000) * termRate;

    let riderPremium = 0;
    if (values.addb) {
      riderPremium += (values.sumAssured / 1000); // Approx Rs. 1 per 1000 SA for AD&DB
    }
    if (values.termRider) {
        const riderRate = getRateForAge(values.age, termRiderRates);
        riderPremium += (values.sumAssured / 1000) * riderRate;
    }
    
    const yearlyPremium = baseYearlyPremium + riderPremium;

    const modes = [
      { name: 'Yearly', factor: 1, rebate: 0.02 },
      { name: 'Half Yearly', factor: 0.5098, rebate: 0.01 },
      { name: 'Quarterly', factor: 0.2575, rebate: 0 },
      { name: 'Monthly', factor: 0.0879, rebate: 0 }
    ];

    const calculatePremiums = (gstRate: number) => modes.map(mode => {
        const modalBasePremium = (baseYearlyPremium * mode.factor) * (1 - mode.rebate);
        const modalRiderPremium = (riderPremium * mode.factor) * (1-mode.rebate);
        const modalPremium = modalBasePremium + modalRiderPremium;
        const gst = (modalBasePremium * gstRate) + (modalRiderPremium * 0.18);
        return { 
            mode: mode.name, 
            premium: modalPremium, 
            gst, 
            total: modalPremium + gst,
            base: modalBasePremium,
            riders: modalRiderPremium
        };
    });

    const firstYearPremiums = calculatePremiums(0.045);
    const secondYearPremiums = calculatePremiums(0.0225);

    const totalPremiumPaid = firstYearPremiums[0].total + (secondYearPremiums[0].total * (values.term - 1));

    const bonusRate = 45; // Assumed bonus rate per 1000 SA
    const fabRate = 100; // Assumed FAB rate per 1000 SA

    const vestedBonus = (values.sumAssured / 1000) * bonusRate * values.term;
    const finalAdditionalBonus = (values.sumAssured / 1000) * fabRate;
    const estimatedMaturityValue = values.sumAssured + vestedBonus + finalAdditionalBonus;

    const deathBenefit = Math.max(values.sumAssured * 1.25, 7 * (firstYearPremiums[0].base + (values.termRider ? firstYearPremiums[0].riders : 0)));
    
    const chartData = [
      { name: 'Total Premium Paid', value: totalPremiumPaid },
      { name: 'Sum Assured', value: values.sumAssured },
      { name: 'Estimated Bonus', value: vestedBonus + finalAdditionalBonus },
    ];

    setResult({
      firstYear: firstYearPremiums,
      secondYear: secondYearPremiums,
      totalPremiumPaid,
      maturity: {
        sumAssured: values.sumAssured,
        bonus: vestedBonus,
        fab: finalAdditionalBonus,
        total: estimatedMaturityValue,
      },
      chartData,
      deathBenefit
    });
    
    setIsLoading(false);
  }

  const formatCurrency = (value: number) => value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const handlePrint = () => window.print();
  const handleShare = (platform: 'whatsapp' | 'twitter') => {
    if (!result || typeof window === 'undefined') return;
    const url = window.location.href;
    const text = `My LIC Jeevan Anand maturity is estimated to be ${formatCurrency(result.maturity.total)}. Calculate yours:`;
    const shareUrl = platform === 'twitter'
      ? `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`;
    window.open(shareUrl, '_blank');
  };

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>{dictionary.title}</CardTitle>
          <CardDescription>{dictionary.form_description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField control={form.control} name="age" render={({ field }) => (<FormItem><FormLabel>{dictionary.age_label}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="term" render={({ field }) => (<FormItem><FormLabel>{dictionary.term_label}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="sumAssured" render={({ field }) => (<FormItem><FormLabel>{dictionary.sum_assured_label}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <div className="space-y-4 pt-4">
                  <h3 className="text-lg font-medium">{dictionary.riders_title}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField control={form.control} name="addb" render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                              <div className="space-y-1 leading-none"><FormLabel>{dictionary.addb_rider_label}</FormLabel></div>
                          </FormItem>
                      )}/>
                      <FormField control={form.control} name="termRider" render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                              <div className="space-y-1 leading-none"><FormLabel>{dictionary.term_rider_label}</FormLabel></div>
                          </FormItem>
                      )}/>
                  </div>
              </div>
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {dictionary.calculating}</> : dictionary.calculate_button}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <Card className="mt-8 animate-in fade-in-50 print-container">
          <CardHeader>
            <CardTitle>Calculation Results for Jeevan Anand (915)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>{dictionary.assumptions_title}</AlertTitle>
              <AlertDescription>
                {dictionary.assumptions_body}
              </AlertDescription>
            </Alert>
            <div>
              <h3 className="font-semibold mb-2">Premium Summary</h3>
              <Table>
                <TableHeader><TableRow><TableHead>Mode</TableHead><TableHead className="text-right">1st Year Premium</TableHead><TableHead className="text-right">2nd Year Onwards</TableHead></TableRow></TableHeader>
                <TableBody>
                  {result.firstYear.map((item, index) => (
                    <TableRow key={item.mode}>
                      <TableCell>{item.mode}</TableCell>
                      <TableCell className="text-right font-bold">{formatCurrency(item.total)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(result.secondYear[index].total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Maturity Benefits (Approx.)</h3>
                <div className="space-y-2 text-sm">
                  <p className="flex justify-between"><span>Sum Assured:</span> <span>{formatCurrency(result.maturity.sumAssured)}</span></p>
                  <p className="flex justify-between"><span>Vested Bonus:</span> <span>{formatCurrency(result.maturity.bonus)}</span></p>
                  <p className="flex justify-between"><span>Final Bonus (FAB):</span> <span>{formatCurrency(result.maturity.fab)}</span></p>
                  <p className="flex justify-between font-bold text-base border-t pt-2 mt-2"><span>Total Maturity:</span> <span>{formatCurrency(result.maturity.total)}</span></p>
                </div>
              </div>
               <div className="border p-4 rounded-lg bg-muted/50">
                <h3 className="font-semibold mb-2">Death Benefit</h3>
                <div className="space-y-2 text-sm">
                  <p>Sum Assured on Death will be <strong>{formatCurrency(result.deathBenefit)}</strong> or 105% of all premiums paid, whichever is higher, plus vested bonuses.</p>
                </div>
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={result.chartData} layout="vertical" margin={{ left: 50 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={(v) => `${(v/100000).toFixed(1)}L`} />
                      <YAxis type="category" dataKey="name" width={120} />
                      <RechartsTooltip formatter={(value: number) => formatCurrency(value)} />
                      <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-6 print-hide">
              <Button variant="outline" size="sm" onClick={() => handleShare('whatsapp')}><WhatsAppIcon className="mr-2 h-4 w-4" /> WhatsApp</Button>
              <Button variant="outline" size="sm" onClick={() => handleShare('twitter')}><Twitter className="mr-2 h-4 w-4" /> Twitter</Button>
              <Button variant="outline" size="sm" onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> {dictionary.pdf_button}</Button>
            </div>
             <p className="text-xs text-center text-muted-foreground mt-4">{dictionary.results_note}</p>
          </CardContent>
        </Card>
      )}
    </>
  );
}
