
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const formSchema = z.object({
  age: z.coerce.number().min(18).max(65),
  gender: z.enum(['male', 'female']),
  smoker: z.enum(['yes', 'no']),
  sumAssured: z.coerce.number().min(5000000), // 50 Lakh
  policyTerm: z.coerce.number().min(10).max(40),
});

type FormValues = z.infer<typeof formSchema>;

const premiumRates = {
    male: { non_smoker: 0.00015, smoker: 0.00025 },
    female: { non_smoker: 0.00013, smoker: 0.00022 },
};

export function LicTermInsuranceCalculator() {
    const [result, setResult] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            age: 30,
            gender: 'male',
            smoker: 'no',
            sumAssured: 10000000, // 1 Crore
            policyTerm: 30,
        },
    });

    async function onSubmit(values: FormValues) {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const baseRate = premiumRates[values.gender][values.smoker === 'no' ? 'non_smoker' : 'smoker'];
        const ageFactor = 1 + ((values.age - 30) / 100);
        const termFactor = 1 + (values.policyTerm / 100);
        
        const yearlyPremium = values.sumAssured * baseRate * ageFactor * termFactor;
        
        const results = {
            yearly: yearlyPremium,
            monthly: yearlyPremium / 12 * 1.04, // adding modal loading
        };

        setResult(results);
        setIsLoading(false);
    }
    
    const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(value);

    return (
        <div className="p-4 border rounded-lg bg-background">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <FormField name="age" control={form.control} render={({ field }) => (
                            <FormItem><FormLabel>Age</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField name="gender" control={form.control} render={({ field }) => (
                            <FormItem><FormLabel>Gender</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem></SelectContent></Select></FormItem>
                        )}/>
                        <FormField name="smoker" control={form.control} render={({ field }) => (
                           <FormItem><FormLabel>Smoker</FormLabel><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4 pt-2"><FormItem><FormControl><RadioGroupItem value="no" /> Non-Smoker</FormControl></FormItem><FormItem><FormControl><RadioGroupItem value="yes" /> Smoker</FormControl></FormItem></RadioGroup></FormItem>
                        )}/>
                        <FormField name="sumAssured" control={form.control} render={({ field }) => (
                            <FormItem><FormLabel>Sum Assured (Coverage)</FormLabel><Select onValueChange={(v) => field.onChange(Number(v))} defaultValue={String(field.value)}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="5000000">₹50 Lakh</SelectItem><SelectItem value="10000000">₹1 Crore</SelectItem><SelectItem value="20000000">₹2 Crore</SelectItem></SelectContent></Select></FormItem>
                        )}/>
                         <FormField name="policyTerm" control={form.control} render={({ field }) => (
                            <FormItem><FormLabel>Policy Term (Years)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </div>
                     <Button type="submit" disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Calculate Premium
                    </Button>
                </form>
            </Form>

            {result && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Estimated Premiums for LIC Tech-Term</h3>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Frequency</TableHead>
                                <TableHead className="text-right">Premium (inc. GST)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>Yearly</TableCell>
                                <TableCell className="text-right font-bold">{formatCurrency(result.yearly)}</TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell>Monthly</TableCell>
                                <TableCell className="text-right font-bold">{formatCurrency(result.monthly)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <p className="text-xs text-muted-foreground mt-2">Premiums are illustrative and will vary based on health status and final underwriting by LIC.</p>
                </div>
            )}
        </div>
    );
}

    