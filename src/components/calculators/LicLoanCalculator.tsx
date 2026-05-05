'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CalculatorIcon, Info } from 'lucide-react';

const formSchema = z.object({
  surrenderValue: z.coerce.number().min(1000, "Surrender value must be at least 1,000"),
  policyStatus: z.enum(["active", "paid_up"], { required_error: "Please select policy status" }),
});

interface LoanResult {
  maxLoanAmount: number;
  interestRate: number;
  annualInterest: number;
  monthlyInterest: number;
}

export function LicLoanCalculator({ dictionary }: { dictionary: any }) {
  const toolDict = dictionary.tool;
  const [result, setResult] = useState<LoanResult | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      surrenderValue: 100000,
      policyStatus: 'active',
    },
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    const loanPercentage = values.policyStatus === 'active' ? 0.9 : 0.8;
    const maxLoanAmount = values.surrenderValue * loanPercentage;
    const interestRate = 9.5; // Estimated interest rate
    const annualInterest = (maxLoanAmount * interestRate) / 100;
    const monthlyInterest = annualInterest / 12;

    setResult({
      maxLoanAmount,
      interestRate,
      annualInterest,
      monthlyInterest,
    });
  }

  const formatCurrency = (value: number) => 
    value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <CalculatorIcon className="h-6 w-6 text-primary" />
            {toolDict.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="surrenderValue" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{toolDict.surrender_value_label}</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="policyStatus" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{toolDict.policy_status_label}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Policy Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">{toolDict.status_options.active}</SelectItem>
                        <SelectItem value="paid_up">{toolDict.status_options.paid_up}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <Button type="submit" className="w-full sm:w-auto">
                {toolDict.calculate_button}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <Card className="mt-8 animate-in fade-in-50 border-primary/20">
          <CardHeader className="bg-primary/5 pb-4">
            <CardTitle>{toolDict.results_title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">{toolDict.eligible_loan_label}</p>
              <p className="text-4xl font-bold text-primary mt-1">{formatCurrency(result.maxLoanAmount)}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="border p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">{toolDict.interest_rate_label}</p>
                <p className="text-xl font-semibold mt-1">{result.interestRate}% p.a.</p>
              </div>
              <div className="border p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">{toolDict.annual_interest_label}</p>
                <p className="text-xl font-semibold mt-1">{formatCurrency(result.annualInterest)}</p>
              </div>
              <div className="border p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">{toolDict.monthly_interest_label}</p>
                <p className="text-xl font-semibold mt-1">{formatCurrency(result.monthlyInterest)}</p>
              </div>
            </div>

            <Alert className="bg-blue-50/50 dark:bg-blue-900/10 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-sm text-blue-800 dark:text-blue-300">
                {toolDict.disclaimer}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </>
  );
}
