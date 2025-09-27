
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  age: z.coerce.number().min(8, "Minimum age is 8").max(59, "Maximum age is 59"),
  term: z.coerce.number().refine(val => [16, 21, 25].includes(val), "Invalid term"),
  sumAssured: z.coerce.number().min(200000, "Minimum Sum Assured is 2,00,000"),
});

type FormValues = z.infer<typeof formSchema>;

type CalculationResult = {
  yearlyPremium: number;
  monthlyPremium: number;
  totalPremiumPaid: number;
  estimatedMaturityValue: number;
};

// Simplified tabular rates for illustration. In a real scenario, this would be a large, complex table.
const premiumRates: Record<number, Record<number, number>> = {
  16: { 10: 88.55, 15: 61.20, 20: 44.00, 25: 32.50, 30: 24.50, 35: 18.90, 40: 15.10, 45: 12.60, 50: 11.15 },
  21: { 10: 67.50, 15: 48.90, 20: 36.80, 25: 28.45, 30: 22.50, 35: 18.20, 40: 15.20, 45: 13.20, 50: 12.00, 55: 11.50 },
  25: { 10: 55.50, 15: 42.10, 20: 32.80, 25: 26.25, 30: 21.50, 35: 18.00, 40: 15.50, 45: 13.80, 50: 12.80, 55: 12.50, 59: 12.50},
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
    },
  });
  
  const selectedTerm = form.watch('term');

  const getPremiumPayingTerm = (policyTerm: number) => {
    if (policyTerm === 16) return 10;
    if (policyTerm === 21) return 15;
    if (policyTerm === 25) return 16;
    return 0;
  }

  const getRateForAge = (age: number, rates: Record<number, number>): number => {
    const availableAges = Object.keys(rates).map(Number).sort((a,b) => a - b);
    if(age < availableAges[0]) return rates[availableAges[0]];
    for (let i = 0; i < availableAges.length - 1; i++) {
        if (age >= availableAges[i] && age < availableAges[i+1]) {
            return rates[availableAges[i]];
        }
    }
    return rates[availableAges[availableAges.length - 1]];
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

    const tabularRate = getRateForAge(values.age, termRates);
    const basePremium = (values.sumAssured / 1000) * tabularRate;
    
    // Applying GST (simplified)
    const premiumWithGst = basePremium * 1.045; // 4.5% for first year

    const monthlyPremium = premiumWithGst * 0.0879; // Monthly mode factor
    const premiumPayingTerm = getPremiumPayingTerm(values.term);
    const totalPremiumPaid = premiumWithGst * premiumPayingTerm;

    // Illustrative bonus calculation (NOT GUARANTEED)
    const bonusRate = 45; // Assume ₹45 per 1000 SA per year
    const fabRate = 100; // Assume ₹100 per 1000 SA
    
    const vestedBonus = (values.sumAssured / 1000) * bonusRate * values.term;
    const finalAdditionalBonus = (values.sumAssured / 1000) * fabRate;
    const estimatedMaturityValue = values.sumAssured + vestedBonus + finalAdditionalBonus;

    setResult({
      yearlyPremium: premiumWithGst,
      monthlyPremium: monthlyPremium,
      totalPremiumPaid: totalPremiumPaid,
      estimatedMaturityValue: estimatedMaturityValue,
    });
    
    setIsLoading(false);
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

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
            <CardTitle>{dictionary.results.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">{dictionary.results.yearly_premium}</p>
                    <p className="text-xl font-bold">{formatCurrency(result.yearlyPremium)}</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">{dictionary.results.monthly_premium}</p>
                    <p className="text-xl font-bold">{formatCurrency(result.monthlyPremium)}</p>
                </div>
                 <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">{dictionary.results.total_premium_paid}</p>
                    <p className="text-xl font-bold">{formatCurrency(result.totalPremiumPaid)}</p>
                </div>
                 <div className="bg-primary/10 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">{dictionary.results.maturity_value}</p>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(result.estimatedMaturityValue)}</p>
                </div>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-4">{dictionary.results.note}</p>
          </CardContent>
        </Card>
      )}
    </>
  );
}
