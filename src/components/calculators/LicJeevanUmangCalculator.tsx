
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Info, Download, Printer, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const formSchema = z.object({
  age: z.coerce.number().min(0, "Minimum age is 90 days (0 years)").max(55, "Maximum age is 55"),
  gender: z.enum(['male', 'female']).default('male'),
  tobacco: z.enum(['yes', 'no']).default('no'),
  sumAssured: z.coerce.number().min(200000, "Minimum Sum Assured is ₹2,00,000"),
  ppt: z.enum(['15', '20', '25', '30']),
  mode: z.enum(['yearly', 'half-yearly', 'quarterly', 'monthly']),
  riders: z.object({
    addb: z.boolean().default(false),
    term: z.boolean().default(false),
    ci: z.boolean().default(false),
  })
});

type FormValues = z.infer<typeof formSchema>;

type CalculationResult = {
  premiums: { mode: string; premium: number }[];
  survivalBenefit: number;
  maturityBenefit: {
    sumAssured: number;
    bonus: number;
    fab: number;
    total: number;
  };
  deathBenefit: number;
};

// Simplified tabular rates. In a real scenario, this would be a large matrix.
const premiumRates: Record<string, number> = {
  '15': 65.50, '20': 45.75, '25': 34.25, '30': 27.25
};
const modalFactors: Record<string, number> = {
  yearly: 1, 'half-yearly': 0.5098, 'quarterly': 0.2575, 'monthly': 0.0879,
};


export function LicJeevanUmangCalculator({ dictionary }: { dictionary: any }) {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 30,
      gender: 'male',
      tobacco: 'no',
      sumAssured: 1000000,
      ppt: '20',
      mode: 'yearly',
      riders: { addb: false, term: false, ci: false },
    },
  });

  async function handleSubmit(values: FormValues) {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const rate = premiumRates[values.ppt] || premiumRates['20'];
    const yearlyBasePremium = (values.sumAssured / 1000) * rate;

    let riderPremium = 0;
    if (values.riders.addb) riderPremium += (values.sumAssured / 1000) * 1.0;
    if (values.riders.term) riderPremium += (values.sumAssured / 1000) * 2.0;
    
    const totalYearlyPremium = yearlyBasePremium + riderPremium;
    
    const premiums = Object.entries(modalFactors).map(([mode, factor]) => ({
      mode,
      premium: totalYearlyPremium * factor,
    }));

    const survivalBenefit = values.sumAssured * 0.08;

    const bonusRate = 48; // Illustrative
    const fabRate = 250; // Illustrative
    const bonus = (values.sumAssured / 1000) * bonusRate * 100;
    const fab = (values.sumAssured / 1000) * fabRate;
    const maturityBenefitTotal = values.sumAssured + bonus + fab;
    
    const deathBenefit = values.sumAssured + bonus;


    setResult({
      premiums,
      survivalBenefit,
      maturityBenefit: { sumAssured: values.sumAssured, bonus, fab, total: maturityBenefitTotal },
      deathBenefit
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
                  <FormField control={form.control} name="tobacco" render={({ field }) => (<FormItem><FormLabel>{dictionary.inputs.tobacco}</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="no">No</SelectItem><SelectItem value="yes">Yes</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="sumAssured" render={({ field }) => (<FormItem><FormLabel>{dictionary.inputs.sumAssured}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="ppt" render={({ field }) => (
                    <FormItem>
                        <FormLabel>{dictionary.inputs.ppt}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="15">15 Years</SelectItem>
                                <SelectItem value="20">20 Years</SelectItem>
                                <SelectItem value="25">25 Years</SelectItem>
                                <SelectItem value="30">30 Years</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                  )}/>
                   <FormField control={form.control} name="mode" render={({ field }) => (
                    <FormItem>
                        <FormLabel>{dictionary.inputs.mode}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="yearly">Yearly</SelectItem>
                                <SelectItem value="half-yearly">Half-yearly</SelectItem>
                                <SelectItem value="quarterly">Quarterly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                  )}/>
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
                                        <button type="button" className="inline-flex" tabIndex={-1}>
                                          <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                                        </button>
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
            <CardTitle>{dictionary.outputs.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
             <div>
                <h3 className="font-semibold mb-2">{dictionary.outputs.premium.title}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    {result.premiums.map(p => (
                        <div key={p.mode} className="p-3 border rounded-lg bg-muted/50">
                            <p className="text-sm text-muted-foreground capitalize">{p.mode}</p>
                            <p className="font-bold text-lg">{formatCurrency(p.premium)}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 border rounded-lg bg-green-500/5">
                  <h3 className="font-semibold text-green-700">{dictionary.outputs.survivalBenefit.title}</h3>
                  <p className="text-3xl font-bold mt-1">{formatCurrency(result.survivalBenefit)}</p>
                   <p className="text-sm text-muted-foreground">{dictionary.outputs.survivalBenefit.subtitle}</p>
              </div>
              <div className="p-4 border rounded-lg bg-red-500/5">
                  <h3 className="font-semibold text-red-700">{dictionary.outputs.deathBenefit.title}</h3>
                  <p className="text-3xl font-bold mt-1">{formatCurrency(result.deathBenefit)}</p>
                  <p className="text-sm text-muted-foreground">{dictionary.outputs.deathBenefit.subtitle}</p>
              </div>
              <div className="p-4 border rounded-lg bg-primary/5">
                  <h3 className="font-semibold text-primary">{dictionary.outputs.maturityBenefit.title}</h3>
                  <p className="text-3xl font-bold mt-1">{formatCurrency(result.maturityBenefit.total)}</p>
                  <p className="text-sm text-muted-foreground">{dictionary.outputs.maturityBenefit.subtitle}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t">
                <Button variant="outline"><Download className="mr-2 h-4 w-4"/>Download PDF</Button>
                <Button variant="outline"><Printer className="mr-2 h-4 w-4"/>Print</Button>
                <Button variant="outline"><Twitter className="mr-2 h-4 w-4"/>Share on Twitter</Button>
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
