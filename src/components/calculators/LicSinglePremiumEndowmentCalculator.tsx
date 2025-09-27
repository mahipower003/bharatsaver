
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, PiggyBank, Download, Printer, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '../ui/checkbox';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52s-.669-1.611-.916-2.207c-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
);

const formSchema = z.object({
  age: z.coerce.number().min(8, "Min age is 8").max(65, "Max age is 65"),
  term: z.coerce.number().min(10, "Min term is 10").max(25, "Max term is 25"),
  sumAssured: z.coerce.number().min(50000, "Min Sum Assured is 50,000"),
  addb: z.boolean().default(false),
  termRider: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

type CalculationResult = {
  singlePremium: number;
  maturityValue: number;
  bonus: number;
  fab: number;
  totalPremium: number;
  riderPremium: number;
};

const premiumRates: Record<number, number> = {
    8: 780, 20: 650, 30: 550, 40: 480, 50: 450, 65: 420
};

const termRiderRates: Record<number, number> = {
    20: 1.5, 30: 2.0, 40: 3.0, 50: 5.0, 65: 8.0
};

const getRateForAge = (age: number, rates: Record<number, number>): number => {
    const availableAges = Object.keys(rates).map(Number).sort((a,b) => a - b);
    let applicableRate = rates[availableAges[availableAges.length - 1]];
    for (let i = 0; i < availableAges.length; i++) {
        if (age <= availableAges[i]) {
            applicableRate = rates[availableAges[i]];
            break;
        }
    }
    return applicableRate;
};

export function LicSinglePremiumEndowmentCalculator({ dictionary }: { dictionary: any }) {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 30,
      term: 15,
      sumAssured: 500000,
      addb: false,
      termRider: false,
    },
  });

  async function handleSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    await new Promise(resolve => setTimeout(resolve, 500));

    const rate = getRateForAge(values.age, premiumRates);
    const basePremium = (values.sumAssured / 1000) * rate;

    let totalRiderPremium = 0;
    if (values.addb && values.age >= 18) {
        totalRiderPremium += (values.sumAssured / 1000) * 1.0; // Approx Re. 1 per 1000 SA for ADDB
    }
    if (values.termRider && values.age >= 18) {
        const riderRate = getRateForAge(values.age, termRiderRates);
        totalRiderPremium += (values.sumAssured / 1000) * riderRate;
    }

    const gstOnBase = basePremium * 0.045; // As per endowment rules
    const gstOnRiders = totalRiderPremium * 0.18; // Riders are pure risk
    const totalPremiumWithGst = basePremium + totalRiderPremium + gstOnBase + gstOnRiders;
    
    const bonusRate = 45; // Illustrative
    const fabRate = 50; // Illustrative

    const vestedBonus = (values.sumAssured / 1000) * bonusRate * values.term;
    const finalAdditionalBonus = (values.sumAssured / 1000) * fabRate;
    const maturityValue = values.sumAssured + vestedBonus + finalAdditionalBonus;

    setResult({
        singlePremium: basePremium,
        riderPremium: totalRiderPremium,
        totalPremium: totalPremiumWithGst,
        maturityValue,
        bonus: vestedBonus,
        fab: finalAdditionalBonus,
    });
    
    setIsLoading(false);
  }

  const formatCurrency = (value: number) => value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const values = form.getValues();

  return (
    <div className="print-hide">
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
                <FormField control={form.control} name="term" render={({ field }) => (<FormItem><FormLabel>{dictionary.term_label}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="sumAssured" render={({ field }) => (<FormItem><FormLabel>{dictionary.sum_assured_label}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <div className="space-y-4 pt-4">
                  <h3 className="text-lg font-medium">Optional Riders</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="addb"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={values.age < 18}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>{dictionary.addb_rider_label}</FormLabel>
                             {values.age < 18 && <FormMessage>Min age is 18</FormMessage>}
                          </div>
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="termRider"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                               disabled={values.age < 18}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>{dictionary.term_rider_label}</FormLabel>
                            {values.age < 18 && <FormMessage>Min age is 18</FormMessage>}
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
              </div>
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {dictionary.calculating}</> : dictionary.calculate_button}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <Card className="mt-8 animate-in fade-in-50 print-container">
          <CardHeader>
            <CardTitle>Calculation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-destructive/10 p-4 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">One-Time Premium (incl. GST)</p>
                    <p className="text-2xl font-bold text-destructive">{formatCurrency(result.totalPremium)}</p>
                </div>
                <div className="bg-primary/10 p-4 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Estimated Maturity Value</p>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(result.maturityValue)}</p>
                </div>
            </div>
            <Table>
              <TableBody>
                <TableRow><TableCell>Base Single Premium</TableCell><TableCell className="text-right">{formatCurrency(result.singlePremium)}</TableCell></TableRow>
                <TableRow><TableCell>Rider Premium</TableCell><TableCell className="text-right">{formatCurrency(result.riderPremium)}</TableCell></TableRow>
                <TableRow><TableCell>Total GST</TableCell><TableCell className="text-right">{formatCurrency(result.totalPremium - result.singlePremium - result.riderPremium)}</TableCell></TableRow>
                <TableRow className="font-bold"><TableCell>Total Payable Premium</TableCell><TableCell className="text-right">{formatCurrency(result.totalPremium)}</TableCell></TableRow>
                <TableRow><TableCell>Sum Assured</TableCell><TableCell className="text-right">{formatCurrency(form.getValues().sumAssured)}</TableCell></TableRow>
                <TableRow><TableCell>Vested Bonus (Approx.)</TableCell><TableCell className="text-right">{formatCurrency(result.bonus)}</TableCell></TableRow>
                <TableRow><TableCell>Final Additional Bonus (FAB, Approx.)</TableCell><TableCell className="text-right">{formatCurrency(result.fab)}</TableCell></TableRow>
                <TableRow className="font-bold bg-primary/10"><TableCell>Total Maturity</TableCell><TableCell className="text-right">{formatCurrency(result.maturityValue)}</TableCell></TableRow>
              </TableBody>
            </Table>
            <p className="text-xs text-center text-muted-foreground mt-4">{dictionary.results.note}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
