
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '../ui/checkbox';

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
    });
    
    setIsLoading(false);
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }
  
  const values = form.getValues();

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
        <Card className="mt-8 animate-in fade-in-50">
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
                <TableHeader><TableRow><TableHead>Mode</TableHead><TableHead className="text-right">Premium</TableHead><TableHead className="text-right">GST (@4.5% + 18%)</TableHead><TableHead className="text-right">Total Premium</TableHead></TableRow></TableHeader>
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
                <TableHeader><TableRow><TableHead>Mode</TableHead><TableHead className="text-right">Premium</TableHead><TableHead className="text-right">GST (@2.25% + 18%)</TableHead><TableHead className="text-right">Total Premium</TableHead></TableRow></TableHeader>
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
              <h3 className="font-semibold mb-2">Maturity Benefits (Approximate)</h3>
              <Table>
                 <TableBody>
                  <TableRow><TableCell>Sum Assured (A)</TableCell><TableCell className="text-right">{formatCurrency(result.maturity.sumAssured)}</TableCell></TableRow>
                  <TableRow><TableCell>Total Premium Paid (Approx)</TableCell><TableCell className="text-right">{formatCurrency(result.totalPremiumPaid)}</TableCell></TableRow>
                  <TableRow><TableCell>Accumulated Bonus (B)</TableCell><TableCell className="text-right">{formatCurrency(result.maturity.bonus)}</TableCell></TableRow>
                  <TableRow><TableCell>Final Addition Bonus (FAB) (C)</TableCell><TableCell className="text-right">{formatCurrency(result.maturity.fab)}</TableCell></TableRow>
                  <TableRow className="font-bold bg-primary/10"><TableCell>Maturity (A+B+C)</TableCell><TableCell className="text-right">{formatCurrency(result.maturity.total)}</TableCell></TableRow>
                 </TableBody>
              </Table>
              {values.age < 18 && <p className="text-xs text-destructive mt-2">Accidental and Disability Benefit Rider is not available for less than 18 years.</p>}
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Jeevan Labh Plan (Table-936) Summary</h3>
              <Table>
                 <TableBody>
                   <TableRow><TableCell className="font-medium">Age</TableCell><TableCell>8-59 Years</TableCell></TableRow>
                   <TableRow><TableCell className="font-medium">Policy Term (Premium Paying Term)</TableCell><TableCell>16 (10) Years<br/>21 (15) Years<br/>25 (16) Years</TableCell></TableRow>
                   <TableRow><TableCell className="font-medium">Maturity</TableCell><TableCell>Basic Sum Assured + Accumulated Bonus + Final Additional Bonus (FAB)</TableCell></TableRow>
                   <TableRow><TableCell className="font-medium">Death Claim</TableCell><TableCell>Death Sum Assured + Accumulated Bonus + FAB + Riders (if any)</TableCell></TableRow>
                   <TableRow><TableCell className="font-medium">Available Riders</TableCell><TableCell>Accidental and Disability Benefit, Term Assurance, Premium Waiver Benefit (PWB)</TableCell></TableRow>
                   <TableRow><TableCell className="font-medium">Surrender & Loan</TableCell><TableCell>Available after 2 full years of premium payment.</TableCell></TableRow>
                   <TableRow><TableCell className="font-medium">Tax Benefit</TableCell><TableCell>Premium under 80C, Maturity under 10(10D)</TableCell></TableRow>
                 </TableBody>
              </Table>
            </div>
            
            <p className="text-xs text-center text-muted-foreground mt-4">{dictionary.results.note}</p>
          </CardContent>
        </Card>
      )}
    </>
  );
}
