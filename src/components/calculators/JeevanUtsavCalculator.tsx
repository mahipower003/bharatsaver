
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Download, Printer, Twitter, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const formSchema = z.object({
  age: z.coerce.number().min(8, "Minimum age is 8").max(65, "Maximum age is 65"),
  gender: z.enum(['male', 'female']).default('male'),
  tobacco: z.enum(['yes', 'no']).default('no'),
  basicSumAssured: z.coerce.number().min(500000, "Minimum Sum Assured is ₹5,00,000"),
  ppt: z.coerce.number().min(5).max(16),
  incomeOption: z.enum(['regular', 'flexi']),
  mode: z.enum(['yearly', 'half-yearly', 'quarterly', 'monthly']),
  riders: z.object({
    addb: z.boolean().default(false),
    ab: z.boolean().default(false),
    term: z.boolean().default(false),
    ci: z.boolean().default(false),
    pwb: z.boolean().default(false),
  })
});

type FormValues = z.infer<typeof formSchema>;

type CalculationResult = {
  premiums: { mode: string; premium: number }[];
  guaranteedAdditions: { total: number; yearly: number };
  income: { regular: number; flexi: number };
  deathBenefit: number;
};

// Simplified tabular rates for illustration
const premiumRates: Record<number, number> = {
  30: 85.50,
  40: 95.75,
  50: 110.25,
};
const modalFactors: Record<string, number> = {
  yearly: 1,
  'half-yearly': 0.5098,
  'quarterly': 0.2575,
  'monthly': 0.0879,
};


export function JeevanUtsavCalculator({ dictionary }: { dictionary: any }) {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 30,
      gender: 'male',
      tobacco: 'no',
      basicSumAssured: 1000000,
      ppt: 12,
      incomeOption: 'regular',
      mode: 'yearly',
      riders: { addb: false, ab: false, term: false, ci: false, pwb: false },
    },
  });

  async function handleSubmit(values: FormValues) {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const rate = premiumRates[values.age] || premiumRates[40];
    const yearlyBasePremium = (values.basicSumAssured / 1000) * rate;

    let riderPremium = 0;
    // Simplified rider premium calculation
    if(values.riders.addb) riderPremium += (values.basicSumAssured / 1000) * 1.0;
    if(values.riders.ab) riderPremium += (values.basicSumAssured / 1000) * 0.5;

    const totalYearlyPremium = yearlyBasePremium + riderPremium;

    const premiums = Object.entries(modalFactors).map(([mode, factor]) => ({
        mode,
        premium: totalYearlyPremium * factor,
    }));

    const guaranteedAdditionsYearly = (values.basicSumAssured / 1000) * 40;
    const guaranteedAdditionsTotal = guaranteedAdditionsYearly * values.ppt;

    const regularIncome = values.basicSumAssured * 0.10;
    
    // Simplified Flexi income just shows the base annual credit
    const flexiIncome = values.basicSumAssured * 0.10; 

    const sumAssuredOnDeath = values.basicSumAssured;
    const totalPremiumsPaid = premiums.find(p => p.mode === 'yearly')!.premium * values.ppt;
    const deathBenefitFloor = totalPremiumsPaid * 1.05;
    const finalDeathBenefit = Math.max(sumAssuredOnDeath + guaranteedAdditionsTotal, deathBenefitFloor);


    setResult({
      premiums,
      guaranteedAdditions: { total: guaranteedAdditionsTotal, yearly: guaranteedAdditionsYearly },
      income: { regular: regularIncome, flexi: flexiIncome },
      deathBenefit: finalDeathBenefit
    });
    setIsLoading(false);
  }

  const formatCurrency = (value: number) => value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 });

  const riderDetails = dictionary.inputs.riders;

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>{dictionary.title}</CardTitle>
          <CardDescription>{dictionary.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FormField control={form.control} name="age" render={({ field }) => (<FormItem><FormLabel>{dictionary.inputs.age}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="gender" render={({ field }) => (<FormItem><FormLabel>{dictionary.inputs.gender}</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="basicSumAssured" render={({ field }) => (<FormItem><FormLabel>{dictionary.inputs.basicSumAssured}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="ppt" render={({ field }) => (<FormItem><FormLabel>{dictionary.inputs.ppt}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="incomeOption" render={({ field }) => (
                    <FormItem><FormLabel>{dictionary.inputs.incomeOption.label}</FormLabel>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4 pt-2">
                          <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="regular" /></FormControl><FormLabel className="font-normal">{dictionary.inputs.incomeOption.regular}</FormLabel></FormItem>
                          <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="flexi" /></FormControl><FormLabel className="font-normal">{dictionary.inputs.incomeOption.flexi}</FormLabel></FormItem>
                      </RadioGroup>
                    <FormMessage /></FormItem>
                  )} />
              </div>

               <div className="space-y-2 pt-4">
                <h3 className="text-lg font-medium">{riderDetails.label}</h3>
                <TooltipProvider>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.keys(riderDetails)
                      .filter(key => key !== 'label')
                      .map(key => {
                        const rider = riderDetails[key as keyof typeof riderDetails];
                        return (
                          <FormField
                            key={key}
                            control={form.control}
                            name={`riders.${key as keyof FormValues['riders']}`}
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="flex items-center gap-1.5">
                                    {rider.label}
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="max-w-xs">{rider.description}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </FormLabel>
                                </div>
                              </FormItem>
                            )}
                          />
                        );
                      })}
                  </div>
                </TooltipProvider>
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
            <CardTitle>Estimated Benefits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
             <div>
                <h3 className="font-semibold mb-2">{dictionary.outputs.premium.title}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    {result.premiums.map(p => (
                        <div key={p.mode} className="p-3 border rounded-lg bg-muted/50">
                            <p className="text-sm text-muted-foreground">{p.mode}</p>
                            <p className="font-bold text-lg">{formatCurrency(p.premium)}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 border rounded-lg bg-primary/5">
                  <h3 className="font-semibold text-primary">{dictionary.outputs.guaranteedAdditions.title}</h3>
                  <p className="text-3xl font-bold mt-1">{formatCurrency(result.guaranteedAdditions.total)}</p>
                  <p className="text-sm text-muted-foreground">{dictionary.outputs.guaranteedAdditions.subtitle.replace('{amount}', formatCurrency(result.guaranteedAdditions.yearly)).replace('{ppt}', String(form.getValues().ppt))}</p>
              </div>
               <div className="p-4 border rounded-lg bg-green-500/5">
                  <h3 className="font-semibold text-green-700">{form.getValues().incomeOption === 'regular' ? dictionary.outputs.regularIncome.title : dictionary.outputs.flexiIncome.title}</h3>
                  <p className="text-3xl font-bold mt-1">{formatCurrency(form.getValues().incomeOption === 'regular' ? result.income.regular : result.income.flexi)}</p>
                   <p className="text-sm text-muted-foreground">{form.getValues().incomeOption === 'regular' ? dictionary.outputs.regularIncome.subtitle : dictionary.outputs.flexiIncome.subtitle}</p>
              </div>
               <div className="p-4 border rounded-lg bg-muted/50">
                  <h3 className="font-semibold">{dictionary.outputs.deathBenefit.title}</h3>
                  <p className="text-3xl font-bold mt-1">{formatCurrency(result.deathBenefit)}</p>
                  <p className="text-sm text-muted-foreground">{dictionary.outputs.deathBenefit.subtitle}</p>
              </div>
            </div>
            <Alert className="mt-6">
              <Info className="h-4 w-4" />
              <AlertTitle>{dictionary.outputs.disclaimer.title}</AlertTitle>
              <AlertDescription dangerouslySetInnerHTML={{ __html: dictionary.outputs.disclaimer.body }} />
            </Alert>
          </CardContent>
        </Card>
      )}
    </>
  );
}
