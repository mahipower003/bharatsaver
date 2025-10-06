
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const formSchema = z.object({
  plan: z.string().min(1, "Please select a plan"),
  childAge: z.coerce.number().min(0).max(12),
  sumAssured: z.coerce.number().min(100000),
  policyTerm: z.coerce.number().min(10),
});

type FormValues = z.infer<typeof formSchema>;

export function LicChildPlanCalculator({ dictionary }: { dictionary: any }) {
  const [result, setResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plan: 'jeevan-tarun',
      childAge: 5,
      sumAssured: 500000,
      policyTerm: 20,
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simplified calculation logic
    const baseRate = values.plan === 'jeevan-tarun' ? 45 : 42;
    const premium = (values.sumAssured / 1000) * baseRate * (1 - (values.childAge / 100));
    const bonus = (values.sumAssured / 1000) * 45 * values.policyTerm;
    const fab = (values.sumAssured / 1000) * 50;
    const maturity = values.sumAssured + bonus + fab;

    setResult({
      yearlyPremium: premium,
      maturityValue: maturity,
    });
    setIsLoading(false);
  }

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(value);

  return (
    <div className="p-4 border rounded-lg bg-background">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField name="plan" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Child Plan</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="jeevan-tarun">Jeevan Tarun (934)</SelectItem><SelectItem value="new-cmbp">New Children's Money Back (932)</SelectItem></SelectContent></Select></FormItem>
                    )}/>
                    <FormField name="childAge" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Child's Age</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField name="sumAssured" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Sum Assured</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField name="policyTerm" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Policy Term</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                </div>
                 <Button type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Calculate Premium & Maturity
                </Button>
            </form>
        </Form>
        {result && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader><CardTitle>Estimated Yearly Premium</CardTitle></CardHeader>
                    <CardContent><p className="text-2xl font-bold">{formatCurrency(result.yearlyPremium)}</p></CardContent>
                </Card>
                 <Card>
                    <CardHeader><CardTitle>Estimated Maturity Value</CardTitle></CardHeader>
                    <CardContent><p className="text-2xl font-bold">{formatCurrency(result.maturityValue)}</p></CardContent>
                </Card>
            </div>
        )}
    </div>
  );
}
