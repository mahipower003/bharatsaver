
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

// Updated schema to match the new, more detailed user inputs
const formSchema = z.object({
  premiumsPaid: z.coerce.number().min(1, "Total premiums paid must be positive."),
  sumAssured: z.coerce.number().min(1, "Sum assured must be positive."),
  policyTerm: z.coerce.number().min(5, "Policy term must be at least 5 years."),
  yearsPaid: z.coerce.number().min(2, "Premiums must be paid for at least 2 years to acquire a surrender value."),
  accumulatedBonus: z.coerce.number().min(0, "Bonus cannot be negative.").default(0),
});

type FormValues = z.infer<typeof formSchema>;

type CalculationResult = {
  guaranteedSurrenderValue: number;
  specialSurrenderValue: number;
  gsvFactor: number;
  bonusSvf: number;
  gsvPremiums: number;
  gsvBonus: number;
  paidUpSumAssured: number;
};

export function LicSurrenderValueCalculator({ dictionary }: { dictionary: any }) {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      premiumsPaid: 210000,
      sumAssured: 1000000,
      policyTerm: 25,
      yearsPaid: 5,
      accumulatedBonus: 225000,
    },
  });

  async function handleSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);

    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (values.yearsPaid < 2) {
        form.setError("yearsPaid", { message: "Policy acquires surrender value only after 2 full years of premium payment." });
        setIsLoading(false);
        return;
    }
    
    // --- GSV Calculation Logic ---
    const gsvFactorPremiums = values.yearsPaid <= 3 ? 0.3 :
                     values.yearsPaid <= 7 ? 0.5 :
                     Math.min(0.9, 0.5 + (values.yearsPaid - 7) * (0.4 / (values.policyTerm - 8)));

    const bonusSurrenderValueFactor = Math.min(0.2, (0.13 + (0.01 * values.yearsPaid)));

    const gsvPremiums = values.premiumsPaid * gsvFactorPremiums;
    const gsvBonus = values.accumulatedBonus * bonusSurrenderValueFactor;
    const guaranteedSurrenderValue = gsvPremiums + gsvBonus;

    // --- SSV Calculation (Heuristic Method as per spec) ---
    const paidUpRatio = values.yearsPaid / values.policyTerm;
    const paidUpSumAssured = values.sumAssured * paidUpRatio;
    
    // SSV Factor estimation curve
    const ssvFactor = 0.35 + (values.yearsPaid / values.policyTerm) * 0.55; // Simple curve from ~35% to 90%
    const specialSurrenderValue = (paidUpSumAssured + values.accumulatedBonus) * ssvFactor;

    setResult({
      guaranteedSurrenderValue,
      specialSurrenderValue: Math.max(guaranteedSurrenderValue, specialSurrenderValue), // SSV is always >= GSV
      gsvFactor: gsvFactorPremiums * 100,
      bonusSvf: bonusSurrenderValueFactor * 100,
      gsvPremiums,
      gsvBonus,
      paidUpSumAssured,
    });
    
    setIsLoading(false);
  }

  const formatCurrency = (value: number) => value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>{dictionary.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField control={form.control} name="premiumsPaid" render={({ field }) => (<FormItem><FormLabel>{dictionary.premiums_paid_label}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="sumAssured" render={({ field }) => (<FormItem><FormLabel>{dictionary.sum_assured_label}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="accumulatedBonus" render={({ field }) => (<FormItem><FormLabel>{dictionary.accumulated_bonus_label}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="policyTerm" render={({ field }) => (<FormItem><FormLabel>{dictionary.policy_term_label}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="yearsPaid" render={({ field }) => (<FormItem><FormLabel>{dictionary.years_paid_label}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {dictionary.calculating}</> : dictionary.calculate_button}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <Card className="mt-8 animate-in fade-in-50">
          <CardHeader>
            <CardTitle>{dictionary.results_title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
             <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>{dictionary.results_warning_title}</AlertTitle>
                <AlertDescription>{dictionary.results_warning_body}</AlertDescription>
            </Alert>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                <div className="border p-4 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground">{dictionary.gsv_label}</p>
                    <p className="text-2xl font-bold">{formatCurrency(result.guaranteedSurrenderValue)}</p>
                </div>
                 <div className="border p-4 rounded-lg bg-primary/10">
                    <p className="text-sm text-muted-foreground">{dictionary.ssv_label}</p>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(result.specialSurrenderValue)}</p>
                     <p className="text-xs text-muted-foreground mt-1">Paid-up Value: {formatCurrency(result.paidUpSumAssured)}</p>
                </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">{dictionary.gsv_breakdown_title}</h3>
              <div className="text-sm space-y-2">
                <p>1. {dictionary.gsv_breakdown_1.replace('{factor}', result.gsvFactor.toFixed(0)).replace('{premiums}', formatCurrency(form.getValues().premiumsPaid))}: <span className="font-semibold">{formatCurrency(result.gsvPremiums)}</span></p>
                <p>2. {dictionary.gsv_breakdown_2.replace('{factor}', result.bonusSvf.toFixed(0)).replace('{bonus}', formatCurrency(form.getValues().accumulatedBonus))}: <span className="font-semibold">{formatCurrency(result.gsvBonus)}</span></p>
                <p className="font-bold border-t pt-2 mt-2">{dictionary.gsv_breakdown_total}: <span className="text-primary">{formatCurrency(result.guaranteedSurrenderValue)}</span></p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
