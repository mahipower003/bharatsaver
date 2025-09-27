
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Download, Printer, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '../ui/checkbox';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useToast } from '@/hooks/use-toast';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52s-.669-1.611-.916-2.207c-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
);


const formSchema = z.object({
  age: z.coerce.number().min(8, "Minimum age is 8").max(59, "Maximum age is 59"),
  term: z.coerce.number().refine(val => [16, 21, 25].includes(val), "Invalid term"),
  sumAssured: z.coerce.number().min(200000, "Minimum Sum Assured is 2,00,000"),
  addb: z.boolean().default(false),
  termRider: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

type CalculationResult = {
  firstYear: { mode: string; premium: number; gst: number; total: number }[];
  secondYear: { mode: string; premium: number; gst: number; total: number }[];
  totalPremiumPaid: number;
  maturity: {
    sumAssured: number;
    bonus: number;
    fab: number;
    total: number;
  };
  deathSumAssured: number;
  accidentRiderSA: number;
  termRiderSA: number;
  chartData: any[];
};

// Simplified tabular rates for illustration.
const premiumRates: Record<number, Record<number, number>> = {
  16: { 8: 88.55, 15: 61.20, 20: 44.00, 25: 32.50, 30: 24.50, 35: 18.90, 40: 15.10, 45: 12.60, 50: 11.15, 59: 11.15 },
  21: { 8: 67.50, 15: 48.90, 20: 36.80, 25: 28.45, 30: 22.50, 35: 18.20, 40: 15.20, 45: 13.20, 50: 12.00, 55: 11.50, 59: 11.50 },
  25: { 8: 55.50, 15: 42.10, 20: 32.80, 25: 26.25, 30: 21.50, 35: 18.00, 40: 15.50, 45: 13.80, 50: 12.80, 55: 12.50, 59: 12.50},
};

const termRiderRates: Record<number, number> = {
    20: 1.5, 30: 2.0, 40: 3.0, 50: 5.0, 59: 8.0
};


export function LicJeevanLabhCalculator({ dictionary }: { dictionary: any }) {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 30,
      term: 25,
      sumAssured: 1000000,
      addb: false,
      termRider: false,
    },
  });

  const getPremiumPayingTerm = (policyTerm: number) => {
    if (policyTerm === 16) return 10;
    if (policyTerm === 21) return 15;
    if (policyTerm === 25) return 16;
    return 0;
  }

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

  async function handleSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    await new Promise(resolve => setTimeout(resolve, 500));

    const termRates = premiumRates[values.term];
    if(!termRates) {
        setIsLoading(false);
        return;
    }
    
    let rebate = 0;
    if (values.sumAssured >= 1000000) rebate = 1.25;
    else if (values.sumAssured >= 500000) rebate = 1.00;
    else if (values.sumAssured >= 200000) rebate = 0.75;
    
    const tabularRate = getRateForAge(values.age, termRates);
    const baseYearlyPremium = ((values.sumAssured / 1000) * tabularRate) - (rebate * (values.sumAssured/1000));
    
    let riderPremium = 0;
    const accidentRiderSA = values.addb && values.age >= 18 ? values.sumAssured : 0;
    const termRiderSA = values.termRider ? values.sumAssured : 0;
    
    if (accidentRiderSA > 0) {
        riderPremium += (accidentRiderSA / 1000) * 1; // Approx. Rs 1 per 1000 SA
    }
    if (termRiderSA > 0) {
        const termRiderRate = getRateForAge(values.age, termRiderRates);
        riderPremium += (termRiderSA / 1000) * termRiderRate;
    }

    const yearlyPremium = baseYearlyPremium + riderPremium;

    const modes = [
        { name: 'Yearly', factor: 1, rebate: 0.02 },
        { name: 'Half Yearly', factor: 0.5098, rebate: 0.01 },
        { name: 'Quarterly', factor: 0.2575, rebate: 0 },
        { name: 'Monthly', factor: 0.0879, rebate: 0 }
    ];

    const firstYearPremiums = modes.map(mode => {
        const modalPremium = yearlyPremium * mode.factor * (1 - mode.rebate);
        const gst = (baseYearlyPremium * mode.factor * (1-mode.rebate) * 0.045) + (riderPremium * mode.factor * (1-mode.rebate) * 0.18);
        return { mode: mode.name, premium: modalPremium, gst, total: modalPremium + gst };
    });

    const secondYearPremiums = modes.map(mode => {
        const modalPremium = yearlyPremium * mode.factor * (1 - mode.rebate);
        const gst = (baseYearlyPremium * mode.factor * (1-mode.rebate) * 0.0225) + (riderPremium * mode.factor * (1-mode.rebate) * 0.18);
        return { mode: mode.name, premium: modalPremium, gst, total: modalPremium + gst };
    });

    const firstYearTotal = firstYearPremiums[0].total;
    const secondYearTotal = secondYearPremiums[0].total;
    const premiumPayingTerm = getPremiumPayingTerm(values.term);
    const totalPremiumPaid = firstYearTotal + (secondYearTotal * (premiumPayingTerm - 1));

    const bonusRate = 45; // Assume ₹45 per 1000 SA per year
    const fabRate = 100; // Assume ₹100 per 1000 SA
    
    const vestedBonus = (values.sumAssured / 1000) * bonusRate * values.term;
    const finalAdditionalBonus = (values.sumAssured / 1000) * fabRate;
    const estimatedMaturityValue = values.sumAssured + vestedBonus + finalAdditionalBonus;

    const deathSumAssured = Math.max(values.sumAssured, 7 * (baseYearlyPremium + (values.termRider ? (termRiderSA/1000) * getRateForAge(values.age, termRiderRates) : 0)));

    const chartData = [
      {
        name: 'Analysis',
        'Total Premium Paid': totalPremiumPaid,
        'Sum Assured': values.sumAssured,
        'Estimated Bonus': vestedBonus + finalAdditionalBonus,
      },
    ];

    setResult({
      firstYear: firstYearPremiums,
      secondYear: secondYearPremiums,
      totalPremiumPaid: totalPremiumPaid,
      maturity: {
        sumAssured: values.sumAssured,
        bonus: vestedBonus,
        fab: finalAdditionalBonus,
        total: estimatedMaturityValue,
      },
      deathSumAssured,
      accidentRiderSA,
      termRiderSA,
      chartData,
    });
    
    setIsLoading(false);
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }
  
  const handlePrint = () => window.print();

  const handleShare = (platform: 'whatsapp' | 'twitter') => {
    if (!result || typeof window === 'undefined') return;
    const url = window.location.href;
    const text = `I just calculated my LIC Jeevan Labh premium using BharatSaver's calculator! My estimated maturity is ${formatCurrency(result.maturity.total)}. Plan yours:`;
    const shareUrl = platform === 'twitter'
      ? `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`;
    window.open(shareUrl, '_blank');
  };
  
  const handleCSVExport = () => {
    if (!result) return;
    const { age, term, sumAssured, addb, termRider } = form.getValues();
    
    let csvContent = "Parameter,Value\n";
    csvContent += `Age,${age}\n`;
    csvContent += `Policy Term,${term}\n`;
    csvContent += `Sum Assured,${sumAssured}\n`;
    csvContent += `Accidental Rider,${addb ? 'Yes' : 'No'}\n`;
    csvContent += `Term Rider,${termRider ? 'Yes' : 'No'}\n\n`;

    csvContent += "First Year Premium\n";
    csvContent += "Mode,Premium,GST,Total\n";
    result.firstYear.forEach(row => {
        csvContent += `${row.mode},${row.premium.toFixed(2)},${row.gst.toFixed(2)},${row.total.toFixed(2)}\n`;
    });
    csvContent += "\n";

    csvContent += "Second Year Onwards Premium\n";
    csvContent += "Mode,Premium,GST,Total\n";
    result.secondYear.forEach(row => {
        csvContent += `${row.mode},${row.premium.toFixed(2)},${row.gst.toFixed(2)},${row.total.toFixed(2)}\n`;
    });
    csvContent += "\n";
    
    csvContent += "Maturity Benefits (Approximate)\n";
    csvContent += "Description,Value\n";
    csvContent += `Sum Assured,${result.maturity.sumAssured}\n`;
    csvContent += `Total Premium Paid,${result.totalPremiumPaid.toFixed(2)}\n`;
    csvContent += `Accumulated Bonus,${result.maturity.bonus}\n`;
    csvContent += `Final Additional Bonus,${result.maturity.fab}\n`;
    csvContent += `Total Maturity,${result.maturity.total}\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'lic_jeevan_labh_summary.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const values = form.getValues();

  return (
    <div className="print-hide">
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
                <FormField
                    control={form.control}
                    name="term"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{dictionary.term_label}</FormLabel>
                        <Select onValueChange={(val) => field.onChange(Number(val))} defaultValue={String(field.value)}>
                            <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="16">16 years (Pay for 10)</SelectItem>
                                <SelectItem value="21">21 years (Pay for 15)</SelectItem>
                                <SelectItem value="25">25 years (Pay for 16)</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                )}/>
                <FormField control={form.control} name="sumAssured" render={({ field }) => (<FormItem><FormLabel>{dictionary.sum_assured_label}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>

              <div className="space-y-4 pt-4">
                  <h3 className="text-lg font-medium">Optional Riders</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="addb"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={values.age < 18}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Accidental Death & Disability Benefit Rider
                            </FormLabel>
                             {values.age < 18 && <FormMessage>Min age is 18</FormMessage>}
                          </div>
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="termRider"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Term Assurance Rider
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {dictionary.calculating}</> : dictionary.calculate_button}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && <div className="text-center py-12"><Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" /></div>}

      {result && (
        <Card className="mt-8 animate-in fade-in-50 print-container">
            <div className="print-header">
                <h2>BharatSaver - LIC Jeevan Labh Calculation</h2>
            </div>
          <CardHeader>
            <CardTitle>LIC Jeevan Labh (936) - Calculation Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div>
              <Table>
                <TableBody>
                  <TableRow><TableCell className="font-medium">Basic Sum Assured</TableCell><TableCell className="text-right">{formatCurrency(values.sumAssured)}</TableCell></TableRow>
                  <TableRow><TableCell className="font-medium">Age</TableCell><TableCell className="text-right">{values.age}</TableCell></TableRow>
                  <TableRow><TableCell className="font-medium">Policy Term</TableCell><TableCell className="text-right">{values.term}</TableCell></TableRow>
                  <TableRow><TableCell className="font-medium">Death Sum Assured</TableCell><TableCell className="text-right">{formatCurrency(result.deathSumAssured)}</TableCell></TableRow>
                  <TableRow><TableCell className="font-medium">Accidental Rider Sum Assured</TableCell><TableCell className="text-right">{formatCurrency(result.accidentRiderSA)}</TableCell></TableRow>
                  <TableRow><TableCell className="font-medium">Term Rider Sum Assured</TableCell><TableCell className="text-right">{formatCurrency(result.termRiderSA)}</TableCell></TableRow>
                </TableBody>
              </Table>
            </div>

            <div>
              <h3 className="font-semibold mb-2">First Year Premium</h3>
              <Table>
                <TableHeader><TableRow><TableHead>Mode</TableHead><TableHead className="text-right">Premium</TableHead><TableHead className="text-right">GST (@4.5%)</TableHead><TableHead className="text-right">Total Premium</TableHead></TableRow></TableHeader>
                <TableBody>
                  {result.firstYear.map(item => (
                    <TableRow key={item.mode}>
                      <TableCell>{item.mode}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.premium)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.gst)}</TableCell>
                      <TableCell className="text-right font-bold">{formatCurrency(item.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Second Year Onward Premium</h3>
              <Table>
                <TableHeader><TableRow><TableHead>Mode</TableHead><TableHead className="text-right">Premium</TableHead><TableHead className="text-right">GST (@2.25%)</TableHead><TableHead className="text-right">Total Premium</TableHead></TableRow></TableHeader>
                <TableBody>
                  {result.secondYear.map(item => (
                    <TableRow key={item.mode}>
                      <TableCell>{item.mode}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.premium)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.gst)}</TableCell>
                      <TableCell className="text-right font-bold">{formatCurrency(item.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

             <div>
                <h3 className="font-semibold mb-2">Maturity vs. Premium Investment</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={result.chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                         <CartesianGrid strokeDasharray="3 3" />
                         <XAxis dataKey="name" />
                         <YAxis tickFormatter={(value) => (value / 100000).toLocaleString('en-IN') + 'L'} />
                         <Tooltip formatter={(value: number) => formatCurrency(value)} />
                         <Legend />
                         <Bar dataKey="Total Premium Paid" stackId="a" fill="hsl(var(--destructive))" />
                         <Bar dataKey="Sum Assured" stackId="a" fill="hsl(var(--primary))" />
                         <Bar dataKey="Estimated Bonus" stackId="a" fill="hsl(var(--accent))" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Maturity Benefits (Approximate)</h3>
              <Table>
                 <TableBody>
                  <TableRow><TableCell>Sum Assured (A)</TableCell><TableCell className="text-right">{formatCurrency(result.maturity.sumAssured)}</TableCell></TableRow>
                  <TableRow><TableCell>Total Premium Paid (Approx)</TableCell><TableCell className="text-right">{formatCurrency(result.totalPremiumPaid)}</TableCell></TableRow>
                  <TableRow><TableCell>Accumulated Bonus (B)</TableCell><TableCell className="text-right">{formatCurrency(result.maturity.bonus)}</TableCell></TableRow>
                  <TableRow><TableCell>Final Addition Bonus (FAB) (C)</TableCell><TableCell className="text-right">{formatCurrency(result.maturity.fab)}</TableCell></TableRow>
                  <TableRow className="font-bold bg-primary/10"><TableCell>Maturity (Approx) (A+B+C)</TableCell><TableCell className="text-right">{formatCurrency(result.maturity.total)}</TableCell></TableRow>
                 </TableBody>
              </Table>
              {values.age < 18 && <p className="text-xs text-destructive mt-2">Accidental and Disability Benefit Rider is not available for less than 18 years.</p>}
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-4 pt-6 print-hide">
                <Button variant="outline" size="sm" onClick={() => handleShare('whatsapp')}><WhatsAppIcon className="mr-2 h-4 w-4" /> WhatsApp</Button>
                <Button variant="outline" size="sm" onClick={() => handleShare('twitter')}><Twitter className="mr-2 h-4 w-4" /> Twitter</Button>
                <Button variant="outline" size="sm" onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print / Save PDF</Button>
                <Button variant="outline" size="sm" onClick={handleCSVExport}><Download className="mr-2 h-4 w-4" />Download CSV</Button>
            </div>

            <p className="text-xs text-center text-muted-foreground mt-4">{dictionary.results.note}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

