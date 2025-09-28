
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Download, Printer, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const formSchema = z.object({
  premiumsPaid: z.coerce.number().min(1, "Total premiums paid must be positive."),
  policyTerm: z.coerce.number().min(5, "Policy term must be at least 5 years."),
  yearsPaid: z.coerce.number().min(2, "Premiums must be paid for at least 2 years to acquire a surrender value."),
  sumAssured: z.coerce.number().min(1, "Sum assured must be positive."),
  bonusRate: z.coerce.number().min(0).default(0),
});

type FormValues = z.infer<typeof formSchema>;

type CalculationResult = {
  guaranteedSurrenderValue: number;
  specialSurrenderValue: number;
  gsvPremiums: number;
  gsvBonus: number;
};

export function LicSurrenderValueCalculator({ dictionary }: { dictionary: any }) {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      premiumsPaid: 100000,
      policyTerm: 20,
      yearsPaid: 5,
      sumAssured: 500000,
      bonusRate: 40,
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

    const vestedBonus = (values.sumAssured / 1000) * values.bonusRate * values.yearsPaid;
    
    // GSV Calculation
    const gsvFactor = values.yearsPaid === 2 ? 0.30 : (values.yearsPaid >= 7 ? Math.min(0.9, 0.30 + (values.yearsPaid - 2) * 0.05) : 0.30 + (values.yearsPaid - 2) * 0.05);
    const bonusSurrenderFactor = values.yearsPaid < 4 ? 0.15 : (values.yearsPaid < 5 ? 0.16 : 0.17);

    const gsvPremiums = values.premiumsPaid * gsvFactor;
    const gsvBonus = vestedBonus * bonusSurrenderFactor;
    const guaranteedSurrenderValue = gsvPremiums + gsvBonus;

    // SSV Calculation (This is an illustrative formula and varies by plan/time)
    const specialSurrenderValue = guaranteedSurrenderValue * 1.25; 

    setResult({
      guaranteedSurrenderValue,
      specialSurrenderValue,
      gsvPremiums,
      gsvBonus,
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
                <FormField control={form.control} name="policyTerm" render={({ field }) => (<FormItem><FormLabel>{dictionary.policy_term_label}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="yearsPaid" render={({ field }) => (<FormItem><FormLabel>{dictionary.years_paid_label}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="bonusRate" render={({ field }) => (<FormItem><FormLabel>{dictionary.bonus_rate_label}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
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
                </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
