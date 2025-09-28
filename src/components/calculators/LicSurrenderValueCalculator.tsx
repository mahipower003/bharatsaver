
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';

const formSchema = z.object({
  plan: z.string().min(1, "Please select a plan"),
  sumAssured: z.coerce.number().min(50000, "Sum Assured must be at least ₹50,000"),
  policyTerm: z.coerce.number().min(5, "Policy term must be at least 5 years"),
  premiumMode: z.enum(['Yearly', 'Half-yearly', 'Quarterly', 'Monthly', 'Single']),
  basePremium: z.coerce.number().min(1, "Base premium must be positive"),
  premiumsPaidCount: z.coerce.number().min(2, "At least 2 premiums must be paid"),
  policyStartDate: z.date().optional(),
  surrenderDate: z.date().optional(),
  vestedBonus: z.coerce.number().min(0).optional().default(0),
  loanPrincipal: z.coerce.number().min(0).optional().default(0),
  loanInterestRate: z.coerce.number().min(0).optional().default(0),
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
  netPayout: number;
};

export function LicSurrenderValueCalculator({ dictionary }: { dictionary: any }) {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plan: 'new_jeevan_anand',
      sumAssured: 1000000,
      policyTerm: 25,
      premiumMode: 'Yearly',
      basePremium: 42000,
      premiumsPaidCount: 5,
      vestedBonus: 225000,
      loanPrincipal: 0,
      loanInterestRate: 9,
      policyStartDate: new Date(new Date().setFullYear(new Date().getFullYear() - 5)),
      surrenderDate: new Date(),
    },
  });

  async function handleSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);

    await new Promise(resolve => setTimeout(resolve, 500));
    
    const paymentsPerYear = { 'Yearly': 1, 'Half-yearly': 2, 'Quarterly': 4, 'Monthly': 12, 'Single': 1 };
    const totalPremiumsPaid = values.basePremium * values.premiumsPaidCount;
    const yearsPaid = values.premiumsPaidCount / paymentsPerYear[values.premiumMode];

    if (yearsPaid < 2) {
        form.setError("premiumsPaidCount", { message: "Policy acquires surrender value only after 2 full years of premium payment." });
        setIsLoading(false);
        return;
    }
    
    const gsvFactorPremiums = yearsPaid <= 3 ? 0.3 : yearsPaid <= 7 ? 0.5 : Math.min(0.9, 0.5 + (yearsPaid - 7) * (0.4 / (values.policyTerm - 8)));
    const bonusSurrenderValueFactor = Math.min(0.2, (0.13 + (0.01 * yearsPaid)));

    const gsvPremiums = totalPremiumsPaid * gsvFactorPremiums;
    const gsvBonus = values.vestedBonus! * bonusSurrenderValueFactor;
    const guaranteedSurrenderValue = gsvPremiums + gsvBonus;

    const totalPremiumsPayable = values.policyTerm * paymentsPerYear[values.premiumMode];
    const paidUpRatio = values.premiumsPaidCount / totalPremiumsPayable;
    const paidUpSumAssured = values.sumAssured * paidUpRatio;
    
    const ssvFactor = 0.35 + (yearsPaid / values.policyTerm) * 0.55;
    const specialSurrenderValue = Math.max(guaranteedSurrenderValue, (paidUpSumAssured + values.vestedBonus!) * ssvFactor);

    const accruedLoanInterest = values.loanPrincipal! * (values.loanInterestRate! / 100) * 1; // Assuming 1 year interest for simplicity
    const grossSurrender = Math.max(guaranteedSurrenderValue, specialSurrenderValue);
    const netPayout = Math.max(0, grossSurrender - values.loanPrincipal! - accruedLoanInterest);

    setResult({
      guaranteedSurrenderValue,
      specialSurrenderValue,
      gsvFactor: gsvFactorPremiums * 100,
      bonusSvf: bonusSurrenderValueFactor * 100,
      gsvPremiums,
      gsvBonus,
      paidUpSumAssured,
      netPayout,
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
                <FormField control={form.control} name="plan" render={({ field }) => (
                    <FormItem><FormLabel>Plan</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select a plan" /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="new_jeevan_anand">New Jeevan Anand</SelectItem>
                                <SelectItem value="jeevan_labh">Jeevan Labh</SelectItem>
                                <SelectItem value="jeevan_umang">Jeevan Umang</SelectItem>
                                <SelectItem value="new_endowment">New Endowment</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="sumAssured" render={({ field }) => (<FormItem><FormLabel>Basic Sum Assured (₹)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="policyTerm" render={({ field }) => (<FormItem><FormLabel>Policy Term (years)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="premiumMode" render={({ field }) => (
                    <FormItem><FormLabel>Premium Mode</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="Yearly">Yearly</SelectItem>
                                <SelectItem value="Half-yearly">Half-yearly</SelectItem>
                                <SelectItem value="Quarterly">Quarterly</SelectItem>
                                <SelectItem value="Monthly">Monthly</SelectItem>
                                <SelectItem value="Single">Single</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="basePremium" render={({ field }) => (<FormItem><FormLabel>Base Premium per Mode (₹)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="premiumsPaidCount" render={({ field }) => (<FormItem><FormLabel>No. of Full Premiums Paid</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="policyStartDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Policy Start Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} captionLayout="dropdown-buttons" fromYear={1980} toYear={new Date().getFullYear()} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="vestedBonus" render={({ field }) => (<FormItem><FormLabel>Total Vested Bonuses (₹)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="loanPrincipal" render={({ field }) => (<FormItem><FormLabel>Outstanding Policy Loan (₹)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
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
            
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-2">Net Payout Calculation</h3>
               <div className="text-lg space-y-2">
                 <p className="flex justify-between"><span>Gross Surrender Value</span> <span className="font-semibold">{formatCurrency(result.specialSurrenderValue)}</span></p>
                 <p className="flex justify-between"><span>(-) Outstanding Loan & Interest</span> <span className="font-semibold text-destructive">{formatCurrency(form.getValues().loanPrincipal! + (form.getValues().loanPrincipal! * (form.getValues().loanInterestRate!/100)))}</span></p>
                 <p className="flex justify-between border-t pt-2 mt-2 font-bold text-xl"><span>Net Payout Amount</span> <span className="text-green-600">{formatCurrency(result.netPayout)}</span></p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}

