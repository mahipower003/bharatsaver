
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Loader2, Shield, Twitter, Printer, IndianRupee } from 'lucide-react';
import { apyPremiums } from '@/data/apy-chart';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { Dictionary } from '@/types';

const formSchema = z.object({
  age: z.coerce.number().min(18, 'Minimum age is 18').max(40, 'Maximum age is 40'),
  pensionAmount: z.coerce.number().min(1000).max(5000),
});

type ApyFormValues = z.infer<typeof formSchema>;

type CalculationResult = {
  monthlyPremium: number;
  totalContribution: number;
  totalCorpus: number;
};

type ApyCalculatorProps = {
  dictionary: Dictionary['apy_calculator'];
};

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52s-.669-1.611-.916-2.207c-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    </svg>
);


export function ApyCalculator({ dictionary }: ApyCalculatorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');

  const form = useForm<ApyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 25,
      pensionAmount: 5000,
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const values: Partial<ApyFormValues> = {};
    if (params.get('age')) values.age = Number(params.get('age'));
    if (params.get('pension')) values.pensionAmount = Number(params.get('pension'));
    
    if (Object.keys(values).length > 0) {
      form.reset(values);
      handleSubmit(values as ApyFormValues);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const currentDate = new Date();
    setLastUpdated(currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
  }, []);

  async function handleSubmit(values: ApyFormValues) {
    setIsLoading(true);
    setResult(null);
    await new Promise(resolve => setTimeout(resolve, 500));

    const premiumData = apyPremiums[values.age];
    if (premiumData) {
      const monthlyPremium = premiumData[values.pensionAmount as keyof typeof premiumData];
      const contributionYears = 60 - values.age;
      const totalContribution = monthlyPremium * 12 * contributionYears;
      const totalCorpus = premiumData.indicativeCorpus[values.pensionAmount as keyof typeof premiumData.indicativeCorpus];
      
      setResult({
        monthlyPremium,
        totalContribution,
        totalCorpus,
      });
    }

    const params = new URLSearchParams();
    params.set('age', values.age.toString());
    params.set('pension', values.pensionAmount.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });

    setIsLoading(false);
  }
  
  const handlePrint = () => window.print();

  const handleShare = (platform: 'whatsapp' | 'twitter') => {
    if (!result) return;
    const url = window.location.href;
    const text = `I just found out my APY premium using BharatSaver's calculator! For a pension of ${formatCurrency(form.getValues().pensionAmount)}, my monthly premium is just ${formatCurrency(result.monthlyPremium)}. Plan your retirement too:`;
    
    let shareUrl = '';
    if (platform === 'twitter') {
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    } else if (platform === 'whatsapp') {
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`;
    }

    if (shareUrl) window.open(shareUrl, '_blank');
  };

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
                <Shield className="h-6 w-6 text-primary" />
                <span>{dictionary.title}</span>
            </h2>
             {lastUpdated && (
              <p className="text-sm text-muted-foreground mt-1 whitespace-nowrap">{dictionary.last_updated} {lastUpdated}</p>
            )}
            </div>
             <CardDescription>{dictionary.form_description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{dictionary.age_label}: {field.value} {dictionary.years_label}</FormLabel>
                        <FormControl>
                          <Slider min={18} max={40} step={1} value={[field.value]} onValueChange={(vals) => field.onChange(vals[0])} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pensionAmount"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>{dictionary.pension_label}</FormLabel>
                        <FormControl>
                            <RadioGroup onValueChange={(val) => field.onChange(Number(val))} defaultValue={String(field.value)} className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                            {[1000, 2000, 3000, 4000, 5000].map(amount => (
                                <FormItem key={amount} className="flex items-center">
                                    <FormControl>
                                        <RadioGroupItem value={String(amount)} id={`pension-${amount}`} className="peer sr-only" />
                                    </FormControl>
                                    <FormLabel htmlFor={`pension-${amount}`} className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary w-full cursor-pointer">
                                        <IndianRupee className="mb-3 h-6 w-6" />
                                        {formatCurrency(amount)}
                                    </FormLabel>
                                </FormItem>
                            ))}
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                />
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-center">
              <div className="bg-primary/10 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">{dictionary.monthly_premium}</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(result.monthlyPremium)}</p>
              </div>
              <div className="bg-secondary p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">{dictionary.total_contribution}</p>
                <p className="text-xl font-bold">{formatCurrency(result.totalContribution)}</p>
              </div>
              <div className="bg-accent/10 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">{dictionary.indicative_corpus}</p>
                <p className="text-xl font-bold text-accent-foreground">{formatCurrency(result.totalCorpus)}</p>
              </div>
            </div>
             <div className="flex flex-wrap items-center justify-center gap-4">
                <Button variant="outline" size="sm" onClick={() => handleShare('whatsapp')}><WhatsAppIcon className="mr-2 h-4 w-4" /> WhatsApp</Button>
                <Button variant="outline" size="sm" onClick={() => handleShare('twitter')}><Twitter className="mr-2 h-4 w-4" /> Twitter</Button>
                <Button variant="outline" size="sm" onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print</Button>
             </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
