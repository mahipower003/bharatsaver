'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertTriangle, CalculatorIcon } from 'lucide-react';
import { useLicSurrenderCalculator } from '@/hooks/use-lic-surrender-calculator';
import type { LicSurrenderFormValues } from '@/hooks/use-lic-surrender-calculator';

const formSchema = z.object({
  plan: z.string().min(1, "Please select a plan"),
  basicSumAssured: z.coerce.number().min(50000, "Sum Assured must be at least 50,000"),
  policyTerm: z.coerce.number().min(10, "Policy term must be at least 10 years"),
  premiumsPaid: z.coerce.number().min(2, "At least 2 full years of premiums required"),
  totalPremiumsPayable: z.coerce.number().min(5, "Total payable premiums must be at least 5"),
  vestedBonus: z.coerce.number().min(0).default(0),
  loanPrincipal: z.coerce.number().min(0).default(0),
});

export function LicSurrenderValueCalculator({ dictionary }: { dictionary: any }) {
  const { result, isLoading, error, performCalculation } = useLicSurrenderCalculator();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plan: 'new-jeevan-anand',
      basicSumAssured: 1000000,
      policyTerm: 20,
      premiumsPaid: 5,
      totalPremiumsPayable: 20,
      vestedBonus: 50000,
      loanPrincipal: 0,
    },
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    performCalculation(values as LicSurrenderFormValues);
  }

  const formatCurrency = (value: number) => value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <CalculatorIcon className="h-6 w-6 text-primary" />
            {dictionary.tool.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <FormField control={form.control} name="plan" render={({ field }) => (
                    <FormItem>
                      <FormLabel>LIC Plan</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="new-jeevan-anand">New Jeevan Anand (915)</SelectItem>
                          <SelectItem value="jeevan-labh">Jeevan Labh (936)</SelectItem>
                          <SelectItem value="new-endowment">New Endowment Plan (914)</SelectItem>
                          <SelectItem value="jeevan-utsav">Jeevan Utsav (871)</SelectItem>
                          <SelectItem value="jeevan-umang">Jeevan Umang (945)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                <FormField control={form.control} name="basicSumAssured" render={({ field }) => (<FormItem><FormLabel>Basic Sum Assured (₹)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="policyTerm" render={({ field }) => (<FormItem><FormLabel>Policy Term (Years)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="premiumsPaid" render={({ field }) => (<FormItem><FormLabel>No. of Premiums Paid</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="totalPremiumsPayable" render={({ field }) => (<FormItem><FormLabel>Total Premiums Payable in Term</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="vestedBonus" render={({ field }) => (<FormItem><FormLabel>Total Vested Bonus (₹) (Optional)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="loanPrincipal" render={({ field }) => (<FormItem><FormLabel>Outstanding Loan (₹) (Optional)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {dictionary.tool.calculating}</> : dictionary.tool.calculate_button}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && <div className="text-center py-12"><Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" /></div>}

      {error && <Alert variant="destructive" className="mt-8"><AlertTriangle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}

      {result && (
        <Card className="mt-8 animate-in fade-in-50">
          <CardHeader>
            <CardTitle>{dictionary.tool.results_title}</CardTitle>
            <Alert variant="destructive" className="mt-2">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>{dictionary.tool.results_warning_title}</AlertTitle>
                <AlertDescription>{dictionary.tool.results_warning_body}</AlertDescription>
            </Alert>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
              <div className="border p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground">{dictionary.tool.gsv_label}</p>
                <p className="text-2xl font-bold">{formatCurrency(result.gsv.total)}</p>
                <p className="text-xs text-muted-foreground mt-1">({formatCurrency(result.gsv.premiumComponent)} from premiums + {formatCurrency(result.gsv.bonusComponent)} from bonuses)</p>
              </div>
              <div className="border p-4 rounded-lg bg-primary/10">
                <p className="text-sm text-muted-foreground">{dictionary.tool.ssv_label}</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(result.ssv)}</p>
              </div>
            </div>
            
            <div className="text-center border-t pt-4">
                <p className="text-md text-muted-foreground">Net Payout After Loan</p>
                <p className="text-4xl font-bold text-green-600">{formatCurrency(result.netPayout)}</p>
                <p className="text-xs text-muted-foreground">({formatCurrency(result.grossSurrenderValue)} Gross Value - {formatCurrency(result.loanAdjustments.principal)} Loan)</p>
            </div>

             <div className="text-sm text-muted-foreground text-center">
                <p><strong>Paid-up Sum Assured:</strong> {formatCurrency(result.paidUpSumAssured)}</p>
                <p><strong>Policy Years Completed:</strong> {result.policyYearCompleted}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
