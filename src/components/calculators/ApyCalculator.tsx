'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Loader2, Shield, Twitter, Printer, IndianRupee, Calendar, Award, CheckCircle2, Share2 } from 'lucide-react';
import { apyPremiums } from '@/data/apy-chart';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { TooltipProvider } from '@/components/ui/tooltip';

const formSchema = z.object({
  age: z.coerce.number().min(18, 'Minimum age is 18').max(40, 'Maximum age is 40'),
  pensionAmount: z.coerce.number().min(1000).max(5000),
  frequency: z.enum(['monthly', 'quarterly', 'halfYearly']),
});

type ApyFormValues = z.infer<typeof formSchema>;

type CalculationResult = {
  monthlyPremium: number;
  quarterlyPremium: number;
  halfYearlyPremium: number;
  selectedPremium: number;
  contributionYears: number;
  totalContribution: number;
  totalCorpus: number;
};

type ApyCalculatorProps = {
  dictionary: any;
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
      frequency: 'monthly',
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const ageParam = params.get('age');
    const pensionParam = params.get('pension');
    const freqParam = params.get('freq');

    const values: Partial<ApyFormValues> = {};
    if (ageParam) values.age = Number(ageParam);
    if (pensionParam) values.pensionAmount = Number(pensionParam);
    if (freqParam && ['monthly', 'quarterly', 'halfYearly'].includes(freqParam)) {
      values.frequency = freqParam as any;
    }

    if (Object.keys(values).length > 0) {
      form.reset({
        age: values.age || 25,
        pensionAmount: values.pensionAmount || 5000,
        frequency: values.frequency || 'monthly',
      });
      calculateResults(form.getValues());
    } else {
      calculateResults(form.getValues());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLastUpdated('2026 (PFRDA Actuarial Chart)');
  }, []);

  const calculateResults = (values: ApyFormValues) => {
    const premiumData = apyPremiums[values.age];
    if (premiumData) {
      const monthlyPremium = premiumData[values.pensionAmount as keyof typeof premiumData.indicativeCorpus];
      const contributionYears = 60 - values.age;
      const totalContribution = monthlyPremium * 12 * contributionYears;
      const totalCorpus = premiumData.indicativeCorpus[values.pensionAmount as keyof typeof premiumData.indicativeCorpus];

      // Exact PFRDA calculation factors for quarterly and half-yearly
      const quarterlyPremium = Math.round(monthlyPremium * 3 * 0.995);
      const halfYearlyPremium = Math.round(monthlyPremium * 6 * 0.99);

      let selectedPremium = monthlyPremium;
      if (values.frequency === 'quarterly') selectedPremium = quarterlyPremium;
      if (values.frequency === 'halfYearly') selectedPremium = halfYearlyPremium;

      setResult({
        monthlyPremium,
        quarterlyPremium,
        halfYearlyPremium,
        selectedPremium,
        contributionYears,
        totalContribution,
        totalCorpus,
      });
    }
  };

  async function handleSubmit(values: ApyFormValues) {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    calculateResults(values);

    const params = new URLSearchParams();
    params.set('age', values.age.toString());
    params.set('pension', values.pensionAmount.toString());
    params.set('freq', values.frequency);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });

    setIsLoading(false);
  }

  const handlePrint = () => window.print();

  const handleShare = (platform: 'whatsapp' | 'twitter') => {
    if (!result) return;
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = `I checked my APY pension premium using BharatSaver's APY Calculator! For a guaranteed monthly pension of ${formatCurrency(form.getValues().pensionAmount)}, my monthly contribution is just ${formatCurrency(result.monthlyPremium)}. Calculate yours:`;

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
  };

  return (
    <TooltipProvider>
      <Card className="shadow-lg border-primary/20 bg-card">
        <CardHeader className="bg-gradient-to-r from-emerald-950/10 via-background to-background rounded-t-lg border-b pb-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <h2 className="flex items-center gap-2.5 text-xl sm:text-2xl font-bold tracking-tight">
              <Shield className="h-6 w-6 text-primary shrink-0" />
              <span>{dictionary.title || "Atal Pension Yojana (APY) Calculator"}</span>
            </h2>
            {lastUpdated && (
              <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 w-fit">
                {lastUpdated}
              </span>
            )}
          </div>
          <CardDescription className="text-sm mt-1.5 text-muted-foreground">
            {dictionary.form_description || "Select your age and desired pension to get your exact PFRDA contribution amount."}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              <div className="space-y-6">
                {/* Age Slider Field */}
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem className="bg-muted/40 p-4 sm:p-5 rounded-xl border">
                      <div className="flex justify-between items-center mb-3">
                        <FormLabel className="text-base font-semibold flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>{dictionary.age_label || "Your Current Age"}:</span>
                        </FormLabel>
                        <span className="text-xl sm:text-2xl font-extrabold text-primary px-3 py-1 bg-primary/10 rounded-lg">
                          {field.value} <span className="text-xs font-normal text-muted-foreground">{dictionary.years_label || "years"}</span>
                        </span>
                      </div>
                      <FormControl>
                        <Slider
                          min={18}
                          max={40}
                          step={1}
                          value={[field.value]}
                          onValueChange={(vals) => {
                            field.onChange(vals[0]);
                            form.handleSubmit(handleSubmit)();
                          }}
                          className="py-2 cursor-pointer"
                        />
                      </FormControl>
                      <div className="flex justify-between text-xs text-muted-foreground mt-2 font-medium px-1">
                        <span>18 yrs (Min)</span>
                        <span>25 yrs</span>
                        <span>30 yrs</span>
                        <span>40 yrs (Max)</span>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Desired Monthly Pension Radio Cards */}
                <FormField
                  control={form.control}
                  name="pensionAmount"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base font-semibold flex items-center gap-2">
                        <Award className="h-4 w-4 text-primary" />
                        <span>{dictionary.pension_label || "Desired Monthly Pension (after age 60)"}:</span>
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(val) => {
                            field.onChange(Number(val));
                            form.handleSubmit(handleSubmit)();
                          }}
                          defaultValue={String(field.value)}
                          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
                        >
                          {[1000, 2000, 3000, 4000, 5000].map((amount) => (
                            <FormItem key={amount} className="flex items-center">
                              <FormControl>
                                <RadioGroupItem value={String(amount)} id={`pension-${amount}`} className="peer sr-only" />
                              </FormControl>
                              <FormLabel
                                htmlFor={`pension-${amount}`}
                                className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-card p-3 sm:p-4 hover:bg-accent hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 w-full cursor-pointer transition-all text-center"
                              >
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Pension</span>
                                <span className="text-base sm:text-lg font-bold text-foreground flex items-center">
                                  <IndianRupee className="h-4 w-4 mr-0.5" />
                                  {amount.toLocaleString('en-IN')}
                                </span>
                                <span className="text-[11px] text-muted-foreground mt-1 font-medium">/ month</span>
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Frequency Selection */}
                <FormField
                  control={form.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-semibold">
                        {dictionary.frequency_label || "Auto-Debit Payment Frequency"}:
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(val) => {
                            field.onChange(val);
                            form.handleSubmit(handleSubmit)();
                          }}
                          defaultValue={field.value}
                          className="grid grid-cols-3 gap-3"
                        >
                          {[
                            { id: 'monthly', label: 'Monthly' },
                            { id: 'quarterly', label: 'Quarterly' },
                            { id: 'halfYearly', label: 'Half-Yearly' },
                          ].map((freq) => (
                            <FormItem key={freq.id} className="flex items-center">
                              <FormControl>
                                <RadioGroupItem value={freq.id} id={`freq-${freq.id}`} className="peer sr-only" />
                              </FormControl>
                              <FormLabel
                                htmlFor={`freq-${freq.id}`}
                                className="w-full text-center py-2.5 px-3 rounded-lg border border-muted text-xs sm:text-sm font-semibold cursor-pointer hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground transition-all"
                              >
                                {freq.label}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto px-8 py-6 text-base font-bold shadow-md hover:shadow-lg transition-all">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> {dictionary.loading || "Calculating..."}
                  </>
                ) : (
                  dictionary.calculate_button || "Calculate Premium"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="text-center py-12">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
        </div>
      )}

      {result && (
        <Card className="mt-8 animate-in fade-in-50 slide-in-from-bottom-4 shadow-xl border-emerald-500/20 bg-gradient-to-b from-card to-emerald-950/5">
          <CardHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg sm:text-xl font-bold flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span>{dictionary.results_title || "Your APY Contribution & Corpus Summary"}</span>
              </CardTitle>
              <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-md">
                Age {form.getValues().age} → 60 (Pension: {formatCurrency(form.getValues().pensionAmount)}/mo)
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Primary KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-primary/10 p-4 rounded-xl border border-primary/20 text-center flex flex-col justify-center">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Required Premium</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-primary mt-1">{formatCurrency(result.selectedPremium)}</p>
                <p className="text-xs text-muted-foreground mt-1 capitalize font-medium">({form.getValues().frequency})</p>
              </div>

              <div className="bg-card p-4 rounded-xl border text-center flex flex-col justify-center shadow-sm">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Contribution Duration</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">{result.contributionYears} <span className="text-base font-normal">Years</span></p>
                <p className="text-xs text-muted-foreground mt-1">Age {form.getValues().age} until 60</p>
              </div>

              <div className="bg-secondary/40 p-4 rounded-xl border text-center flex flex-col justify-center">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Out-of-Pocket</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground mt-1">{formatCurrency(result.totalContribution)}</p>
                <p className="text-xs text-muted-foreground mt-1">Total invested across {result.contributionYears} yrs</p>
              </div>

              <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20 text-center flex flex-col justify-center">
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Nominee Lump Sum</p>
                <p className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{formatCurrency(result.totalCorpus)}</p>
                <p className="text-xs text-muted-foreground mt-1">Returned to nominee upon death</p>
              </div>
            </div>

            {/* Breakdown Table for Frequencies */}
            <div className="bg-muted/30 p-4 rounded-xl border mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                <IndianRupee className="h-4 w-4 text-primary" /> Auto-Debit Amount Breakdown by Frequency
              </h4>
              <div className="grid grid-cols-3 gap-2 text-center text-xs sm:text-sm">
                <div className="p-2 rounded-lg bg-card border">
                  <span className="text-muted-foreground block text-[11px]">Monthly</span>
                  <strong className="text-foreground font-bold">{formatCurrency(result.monthlyPremium)}</strong>
                </div>
                <div className="p-2 rounded-lg bg-card border">
                  <span className="text-muted-foreground block text-[11px]">Quarterly</span>
                  <strong className="text-foreground font-bold">{formatCurrency(result.quarterlyPremium)}</strong>
                </div>
                <div className="p-2 rounded-lg bg-card border">
                  <span className="text-muted-foreground block text-[11px]">Half-Yearly</span>
                  <strong className="text-foreground font-bold">{formatCurrency(result.halfYearlyPremium)}</strong>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Share2 className="h-3.5 w-3.5" /> Share calculation with friends:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleShare('whatsapp')} className="text-xs gap-1.5 hover:bg-emerald-500/10 hover:text-emerald-600">
                  <WhatsAppIcon className="h-4 w-4 text-emerald-500" /> WhatsApp
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleShare('twitter')} className="text-xs gap-1.5 hover:bg-sky-500/10 hover:text-sky-500">
                  <Twitter className="h-4 w-4 text-sky-500" /> Twitter
                </Button>
                <Button variant="outline" size="sm" onClick={handlePrint} className="text-xs gap-1.5">
                  <Printer className="h-4 w-4" /> Print
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </TooltipProvider>
  );
}
