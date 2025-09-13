
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Loader2, Building, Download, Printer, Twitter, ChevronDown, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { Dictionary } from '@/types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  basicPay: z.coerce.number().min(1000, "Basic pay seems too low"),
  daPercentage: z.coerce.number().min(0).max(100),
  qualifyingServiceYears: z.coerce.number().min(10, "Minimum 10 years required").max(50),
});

type FormValues = z.infer<typeof formSchema>;

type CalculationSteps = {
    pensionableSalary: number;
    pensionFactor: number;
    divisor: number;
}

type CalculationResult = {
    monthlyPension: number;
    familyPension: number;
    lumpSum: number;
    steps: CalculationSteps;
    chartData: any[];
};

type CalculatorProps = {
  dictionary: Dictionary['ups_pension_calculator'];
};

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52s-.669-1.611-.916-2.207c-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
);


export function UpsPensionCalculator({ dictionary }: CalculatorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSteps, setShowSteps] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      basicPay: 50000,
      daPercentage: 50,
      qualifyingServiceYears: 30,
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const values: Partial<FormValues> = {};
    if (params.get('basicPay')) values.basicPay = Number(params.get('basicPay'));
    if (params.get('da')) values.daPercentage = Number(params.get('da'));
    if (params.get('service')) values.qualifyingServiceYears = Number(params.get('service'));
    
    if (Object.keys(values).length > 0) {
        form.reset(values);
        handleSubmit(values as FormValues);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  async function handleSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    await new Promise(resolve => setTimeout(resolve, 500));

    const pensionableSalary = values.basicPay * (1 + values.daPercentage / 100);
    const pensionFactor = 0.5;
    const divisor = 33;
    const monthlyPension = (pensionableSalary * pensionFactor * values.qualifyingServiceYears) / divisor;
    const familyPension = monthlyPension * 0.6;
    const lumpSum = monthlyPension * 12 * 5;
    
    const params = new URLSearchParams();
    params.set('basicPay', values.basicPay.toString());
    params.set('da', values.daPercentage.toString());
    params.set('service', values.qualifyingServiceYears.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });

    setResult({
      monthlyPension,
      familyPension,
      lumpSum,
      steps: {
          pensionableSalary,
          pensionFactor,
          divisor
      },
      chartData: [
        { name: dictionary.outputs.monthly_pension, value: monthlyPension },
        { name: dictionary.outputs.family_pension, value: familyPension },
        { name: dictionary.outputs.lump_sum, value: lumpSum },
      ]
    });
    
    setIsLoading(false);
  }
  
  const handleCSVExport = () => {
    if (!result) return;
    
    const { basicPay, daPercentage, qualifyingServiceYears } = form.getValues();
    const { steps, monthlyPension, familyPension, lumpSum } = result;

    const headers = ["Parameter", "Formula / Value"];
    const rows = [
      ["Inputs", ""],
      ["Basic Pay", basicPay],
      ["DA Percentage", daPercentage],
      ["Qualifying Service (Years)", qualifyingServiceYears],
      ["", ""],
      ["Calculations", ""],
      ["Pensionable Salary", `(${basicPay} * (1 + ${daPercentage} / 100)) = ${steps.pensionableSalary.toFixed(2)}`],
      ["Pension Factor", steps.pensionFactor],
      ["Divisor", steps.divisor],
      ["Monthly Pension", `(${steps.pensionableSalary.toFixed(2)} * ${steps.pensionFactor} * ${qualifyingServiceYears}) / ${steps.divisor} = ${monthlyPension.toFixed(2)}`],
      ["Family Pension (60%)", `(${monthlyPension.toFixed(2)} * 0.6) = ${familyPension.toFixed(2)}`],
      ["Lump Sum (Commutation Example)", `(${monthlyPension.toFixed(2)} * 12 * 5) = ${lumpSum.toFixed(2)}`],
    ];
    
    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
        csvContent += `"${row[0]}","${row[1]}"\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'ups_pension_calculation_steps.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
        title: "Link Copied!",
        description: "You can now share the link to your calculation.",
    });
  };

  const handleShare = (platform: 'whatsapp' | 'twitter') => {
    if (!result) return;
    const url = window.location.href;
    const text = `I just calculated my UPS pension with BharatSaver! My estimated monthly pension is ${formatCurrency(result.monthlyPension)}. Plan yours:`;
    const shareUrl = platform === 'twitter'
      ? `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`;
    window.open(shareUrl, '_blank');
  };

  const handlePrint = () => window.print();

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
            <h2 className="flex items-center gap-2 text-xl font-bold">
                <Building className="h-6 w-6 text-primary" />
                <span>{dictionary.interactive_tool.title}</span>
            </h2>
            <CardDescription>{dictionary.interactive_tool.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField control={form.control} name="basicPay" render={({ field }) => (<FormItem><FormLabel>{dictionary.inputs.basic_pay}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="daPercentage" render={({ field }) => (<FormItem><FormLabel>{dictionary.inputs.da_percentage}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="qualifyingServiceYears" render={({ field }) => (<FormItem><FormLabel>{dictionary.inputs.service_years}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <div className="flex flex-wrap gap-4">
                <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {dictionary.interactive_tool.calculating}</> : dictionary.interactive_tool.calculate_cta}
                </Button>
                <Button type="button" variant="outline" onClick={() => form.reset({ basicPay: 50000, daPercentage: 50, qualifyingServiceYears: 30 })} className="w-full sm:w-auto">{dictionary.interactive_tool.try_example}</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && <div className="text-center py-12"><Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" /></div>}

      {result && (
        <Card className="mt-8 animate-in fade-in-50 slide-in-from-bottom-5 shadow-lg">
          <CardHeader>
            <CardTitle>{dictionary.outputs.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-center">
              <div className="bg-primary/10 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">{dictionary.outputs.monthly_pension}</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(result.monthlyPension)}</p>
              </div>
              <div className="bg-secondary p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">{dictionary.outputs.family_pension}</p>
                <p className="text-xl font-bold">{formatCurrency(result.familyPension)}</p>
              </div>
              <div className="bg-secondary p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">{dictionary.outputs.lump_sum}</p>
                <p className="text-xl font-bold">{formatCurrency(result.lumpSum)}</p>
              </div>
            </div>

            <div className="mt-6">
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={result.chartData} layout="vertical" margin={{ left: 50 }}>
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={150} />
                        <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} contentStyle={{ borderRadius: "var(--radius)", background: "hsl(var(--background))" }} formatter={(value: number) => formatCurrency(value)} />
                        <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={30} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <Collapsible open={showSteps} onOpenChange={setShowSteps} className="mt-6">
                <CollapsibleTrigger asChild>
                    <Button variant="link" className="p-0 text-sm">
                        {showSteps ? dictionary.interactive_tool.hide_steps : dictionary.interactive_tool.show_steps}
                        <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${showSteps ? 'rotate-180' : ''}`} />
                    </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 space-y-4 rounded-md border bg-muted/50 p-4 text-sm">
                    <h4 className="font-semibold">{dictionary.calculation_steps.title}</h4>
                    <div className="space-y-2 font-mono">
                        <p><strong>{dictionary.calculation_steps.pensionable_salary}:</strong> <code>({form.getValues().basicPay} × (1 + {form.getValues().daPercentage}/100))</code> = <strong>{formatCurrency(result.steps.pensionableSalary)}</strong></p>
                        <p><strong>{dictionary.calculation_steps.monthly_pension}:</strong> <code>({formatCurrency(result.steps.pensionableSalary)} × {result.steps.pensionFactor} × {form.getValues().qualifyingServiceYears}) / {result.steps.divisor}</code> = <strong>{formatCurrency(result.monthlyPension)}</strong></p>
                        <p><strong>{dictionary.calculation_steps.family_pension}:</strong> <code>({formatCurrency(result.monthlyPension)} × 0.60)</code> = <strong>{formatCurrency(result.familyPension)}</strong></p>
                    </div>
                </CollapsibleContent>
            </Collapsible>
            
             <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-8">
                <Button variant="outline" size="sm" onClick={() => handleShare('whatsapp')}><WhatsAppIcon className="mr-2 h-4 w-4" /> WhatsApp</Button>
                <Button variant="outline" size="sm" onClick={() => handleShare('twitter')}><Twitter className="mr-2 h-4 w-4" /> Twitter</Button>
                <Button variant="outline" size="sm" onClick={handleCopyLink}><LinkIcon className="mr-2 h-4 w-4" /> {dictionary.interactive_tool.copy_link}</Button>
                <Button variant="outline" size="sm" onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> {dictionary.interactive_tool.print_results}</Button>
                <Button variant="outline" size="sm" onClick={handleCSVExport}><Download className="mr-2 h-4 w-4" />{dictionary.interactive_tool.download_excel}</Button>
             </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}

    

    