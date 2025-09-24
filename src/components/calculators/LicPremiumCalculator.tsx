
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import type { Dictionary } from '@/types';

const formSchema = z.object({
  productCategory: z.string(),
  subCategory: z.string(),
  age: z.coerce.number().min(8, 'Minimum age is 8').max(65, 'Maximum age is 65'),
  sumAssured: z.coerce.number().min(50000, 'Minimum sum assured is ₹50,000'),
  plan: z.string(),
  ppt: z.coerce.number().min(5, 'Minimum PPT is 5 years'),
  frequency: z.enum(['yearly', 'half-yearly', 'quarterly', 'monthly']),
});

type LicFormValues = z.infer<typeof formSchema>;

type CalculationResult = {
  premium: number;
};

type LicCalculatorProps = {
  dictionary: Dictionary['lic_premium_calculator'];
};

// This is a simplified mock calculation. A real implementation would use complex rate tables.
const calculateMockLicPremium = (values: LicFormValues): number => {
  const { age, sumAssured, plan, ppt, frequency } = values;
  
  let baseRate = 0.025; // A base rate per thousand sum assured
  
  // Adjust base rate based on plan
  if (plan === 'jeevan_umang') baseRate *= 1.5;
  if (plan === 'jeevan_utsav') baseRate *= 1.2;
  if (plan === 'jeevan_labh') baseRate *= 1.0;

  // Adjust for age
  baseRate *= 1 + (age - 8) / 100;

  // Adjust for PPT (shorter PPT = higher premium)
  baseRate *= 1 + (25 - ppt) / 50;

  let annualPremium = (sumAssured / 1000) * baseRate * 100;
  
  // Add a base amount
  annualPremium += 500;
  
  let finalPremium = annualPremium;
  if (frequency === 'half-yearly') finalPremium = annualPremium * 0.51;
  if (frequency === 'quarterly') finalPremium = annualPremium * 0.26;
  if (frequency === 'monthly') finalPremium = annualPremium * 0.088;

  return Math.round(finalPremium);
}

export function LicPremiumCalculator({ dictionary }: LicCalculatorProps) {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LicFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productCategory: 'insurance_plans',
      subCategory: 'whole_life_plans',
      age: 30,
      sumAssured: 1000000,
      plan: 'jeevan_umang',
      ppt: 20,
      frequency: 'yearly',
    },
  });

  const productCategory = form.watch('productCategory');
  const subCategory = form.watch('subCategory');

  // This effect will reset the subCategory and plan when the productCategory changes.
  useEffect(() => {
    form.resetField('subCategory');
    form.resetField('plan');
  }, [productCategory, form]);

  // This effect will reset the plan when the subCategory changes.
  useEffect(() => {
    form.resetField('plan');
  }, [subCategory, form]);

  const subCategories = productCategory ? dictionary.sub_categories[productCategory] : null;
  const plans = subCategory && dictionary.plans[subCategory] ? dictionary.plans[subCategory] : null;

  async function handleSubmit(values: LicFormValues) {
    setIsLoading(true);
    setResult(null);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const premium = calculateMockLicPremium(values);
    
    setResult({ premium });
    setIsLoading(false);
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
           <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <h2 className="flex items-center gap-2 text-xl font-bold">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <span>{dictionary.title}</span>
            </h2>
            </div>
             <CardDescription>{dictionary.form_description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  <div className="space-y-6">
                     <FormField
                        control={form.control}
                        name="productCategory"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{dictionary.category_label}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.entries(dictionary.categories).map(([key, value]) => (
                                  <SelectItem key={key} value={key}>{value}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                    {subCategories && (
                       <FormField
                          control={form.control}
                          name="subCategory"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{dictionary.sub_category_label}</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value || ''} >
                                <FormControl>
                                  <SelectTrigger><SelectValue placeholder={dictionary.sub_category_placeholder} /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Object.entries(subCategories).map(([key, value]) => (
                                    <SelectItem key={key} value={key}>{value}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                    )}

                    {plans && (
                      <FormField
                        control={form.control}
                        name="plan"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{dictionary.plan_label}</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || ''}>
                              <FormControl>
                                <SelectTrigger><SelectValue placeholder={dictionary.plan_placeholder} /></SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                 {Object.entries(plans).map(([key, value]) => (
                                    <SelectItem key={key} value={key}>{value}</SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                     <FormField control={form.control} name="sumAssured" render={({ field }) => (<FormItem><FormLabel>{dictionary.sum_assured_label}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </div>
                  <div className="space-y-6">
                     <FormField control={form.control} name="age" render={({ field }) => (<FormItem><FormLabel>{dictionary.age_label}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                     <FormField control={form.control} name="ppt" render={({ field }) => (<FormItem><FormLabel>{dictionary.ppt_label}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                     <FormField
                        control={form.control}
                        name="frequency"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>{dictionary.frequency_label}</FormLabel>
                            <FormControl>
                              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-2 gap-4">
                                <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="yearly" /></FormControl><FormLabel className="font-normal">{dictionary.frequencies.yearly}</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="half-yearly" /></FormControl><FormLabel className="font-normal">{dictionary.frequencies.half_yearly}</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="quarterly" /></FormControl><FormLabel className="font-normal">{dictionary.frequencies.quarterly}</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="monthly" /></FormControl><FormLabel className="font-normal">{dictionary.frequencies.monthly}</FormLabel></FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                  </div>
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
            <div className="text-center">
              <p className="text-lg text-muted-foreground">{dictionary.estimated_premium_label}</p>
              <p className="text-4xl font-bold text-primary mt-2">{formatCurrency(result.premium)}</p>
              <p className="text-md text-muted-foreground capitalize">{form.getValues().frequency}</p>
            </div>
             <p className="text-xs text-center text-muted-foreground mt-6 italic">{dictionary.disclaimer}</p>
          </CardContent>
        </Card>
      )}
    </>
  );
}
