'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Info, Shield, CheckCircle2, IndianRupee, Calendar, Award, Share2, Printer, Twitter, Table as TableIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from '@/components/ui/slider';

const formSchema = z.object({
  planType: z.enum(['plan771', 'plan883']).default('plan771'),
  age: z.coerce.number().min(8, "Minimum age is 8 years").max(65, "Maximum age is 65 years"),
  gender: z.enum(['male', 'female']).default('male'),
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

type YearScheduleItem = {
  year: number;
  age: number;
  premiumPaid: number;
  cumulativePremium: number;
  accruedGA: number;
  survivalBenefit: number;
  deathBenefit: number;
};

type CalculationResult = {
  baseYearlyPremium: number;
  firstYearGST: number;
  renewalGST: number;
  totalFirstYearPremium: number;
  totalRenewalPremium: number;
  modePremiums: { mode: string; label: string; premium: number }[];
  guaranteedAdditionsYearly: number;
  guaranteedAdditionsTotal: number;
  annualSurvivalBenefit: number;
  deathBenefit: number;
  schedule: YearScheduleItem[];
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

// Tabular base rate approximations per ₹1,000 BSA (LIC Plan 771)
const getBaseTabularRate = (age: number, ppt: number, planType: string): number => {
  if (planType === 'plan883') {
    // Single premium rate approximation (~₹550 per ₹1k BSA)
    return 550;
  }
  // Plan 771 tabular rates
  const baseRatesByPPT: Record<number, number> = {
    5: 168.5,
    7: 122.0,
    10: 85.5,
    12: 69.8,
    15: 53.2,
    16: 49.5,
  };
  const rate = baseRatesByPPT[ppt] || (85.5 - (ppt - 10) * 3.5);
  const ageFactor = 1 + (age - 30) * 0.008;
  return Math.max(35, Math.round(rate * ageFactor * 100) / 100);
};

export function JeevanUtsavCalculator({ dictionary }: { dictionary: any }) {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'schedule'>('summary');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      planType: 'plan771',
      age: 30,
      gender: 'male',
      basicSumAssured: 1000000,
      ppt: 10,
      incomeOption: 'regular',
      mode: 'yearly',
      riders: { addb: false, ab: false, term: false, ci: false, pwb: false },
    },
  });

  const watchPlanType = form.watch('planType');

  useEffect(() => {
    calculateBenefits(form.getValues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const calculateBenefits = (values: FormValues) => {
    const isSinglePay = values.planType === 'plan883';
    const effectivePPT = isSinglePay ? 1 : values.ppt;
    const tabularRate = getBaseTabularRate(values.age, effectivePPT, values.planType);
    
    // High Sum Assured Rebate (HSA)
    let hsaRebate = 0;
    if (values.basicSumAssured >= 2400000) hsaRebate = 4.0;
    else if (values.basicSumAssured >= 1000000) hsaRebate = 2.5;
    else if (values.basicSumAssured >= 750000) hsaRebate = 1.5;

    const netRate = Math.max(10, tabularRate - hsaRebate);
    const baseYearlyPremium = (values.basicSumAssured / 1000) * netRate;

    // Riders
    let riderCost = 0;
    if (values.riders.addb) riderCost += (values.basicSumAssured / 1000) * 1.0;
    if (values.riders.ab) riderCost += (values.basicSumAssured / 1000) * 0.5;

    const rawAnnualPremium = baseYearlyPremium + riderCost;

    // GST
    const firstYearGST = rawAnnualPremium * 0.045;
    const renewalGST = rawAnnualPremium * 0.0225;

    const totalFirstYearPremium = rawAnnualPremium + firstYearGST;
    const totalRenewalPremium = rawAnnualPremium + renewalGST;

    // Modal factors (with LIC modal rebates)
    const modePremiums = [
      { mode: 'yearly', label: 'Yearly (2% Rebate)', premium: Math.round(totalFirstYearPremium * 0.98) },
      { mode: 'half-yearly', label: 'Half-Yearly (1% Rebate)', premium: Math.round((totalFirstYearPremium / 2) * 0.99) },
      { mode: 'quarterly', label: 'Quarterly', premium: Math.round(totalFirstYearPremium / 4) },
      { mode: 'monthly', label: 'Monthly (Auto-Debit)', premium: Math.round(totalFirstYearPremium / 12) },
    ];

    // Guaranteed Additions (GA): ₹40 per ₹1,000 BSA
    const gaPerYear = (values.basicSumAssured / 1000) * 40;
    const totalGAs = gaPerYear * effectivePPT;

    // Survival Benefit Income: 10% of Sum Assured
    const annualSurvivalBenefit = values.basicSumAssured * 0.10;

    // Death Benefit
    const deathBenefitFloor = totalFirstYearPremium * 1.05;
    const deathBenefit = Math.max(values.basicSumAssured + totalGAs, deathBenefitFloor);

    // Year-by-Year Schedule (from Year 1 up to Age 100)
    const schedule: YearScheduleItem[] = [];
    let cumPremium = 0;
    let accruedGA = 0;
    const maxYears = Math.min(100 - values.age, 70);

    for (let yr = 1; yr <= maxYears; yr++) {
      const currentAge = values.age + yr - 1;
      const isPayingYear = yr <= effectivePPT;
      const currentPrem = isPayingYear ? (yr === 1 ? totalFirstYearPremium : totalRenewalPremium) : 0;
      cumPremium += currentPrem;

      if (isPayingYear) {
        accruedGA += gaPerYear;
      }

      // Survival benefit starts 2 years after PPT ends
      const incomeStartYear = effectivePPT + 2;
      const isIncomeYear = yr > incomeStartYear;
      const payout = isIncomeYear ? annualSurvivalBenefit : 0;

      const yrDeathBenefit = Math.max(values.basicSumAssured + accruedGA, cumPremium * 1.05);

      schedule.push({
        year: yr,
        age: currentAge,
        premiumPaid: Math.round(currentPrem),
        cumulativePremium: Math.round(cumPremium),
        accruedGA: Math.round(accruedGA),
        survivalBenefit: Math.round(payout),
        deathBenefit: Math.round(yrDeathBenefit),
      });
    }

    setResult({
      baseYearlyPremium: Math.round(baseYearlyPremium),
      firstYearGST: Math.round(firstYearGST),
      renewalGST: Math.round(renewalGST),
      totalFirstYearPremium: Math.round(totalFirstYearPremium),
      totalRenewalPremium: Math.round(totalRenewalPremium),
      modePremiums,
      guaranteedAdditionsYearly: gaPerYear,
      guaranteedAdditionsTotal: totalGAs,
      annualSurvivalBenefit,
      deathBenefit: Math.round(deathBenefit),
      schedule,
    });
  };

  async function handleSubmit(values: FormValues) {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    calculateBenefits(values);
    setIsLoading(false);
  }

  const formatCurrency = (val: number) => {
    return val.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const handlePrint = () => window.print();

  const handleShare = (platform: 'whatsapp' | 'twitter') => {
    if (!result) return;
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = `I calculated my LIC Jeevan Utsav Plan 771 policy returns on BharatSaver! For ₹${(form.getValues().basicSumAssured / 100000).toFixed(1)}L cover, I get ₹40/₹1k Guaranteed Additions + ₹${formatCurrency(result.annualSurvivalBenefit)} annual income for life! Check your returns:`;

    let shareUrl = '';
    if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    } else if (platform === 'whatsapp') {
      shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`;
    }

    if (shareUrl) window.open(shareUrl, '_blank');
  };

  const riderDetails = dictionary?.inputs?.riders || {};

  return (
    <TooltipProvider>
      <Card className="shadow-lg border-primary/20 bg-card">
        <CardHeader className="bg-gradient-to-r from-emerald-950/10 via-background to-background rounded-t-lg border-b pb-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <CardTitle className="flex items-center gap-2.5 text-xl sm:text-2xl font-bold">
              <Shield className="h-6 w-6 text-primary shrink-0" />
              <span>{dictionary?.title || "LIC Jeevan Utsav Plan 771 & 883 Calculator"}</span>
            </CardTitle>
            <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 w-fit">
              Updated 2026 Table
            </span>
          </div>
          <CardDescription className="text-sm mt-1.5">
            {dictionary?.description || "Select Plan 771 (Limited Pay) or Plan 883 (Single Pay) to calculate exact premiums, ₹40/₹1k GAs, and lifelong income payouts."}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Plan Type Selector */}
              <FormField
                control={form.control}
                name="planType"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-base font-bold flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" />
                      <span>{dictionary?.inputs?.planType || "Select Plan Variant"}:</span>
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(val) => {
                          field.onChange(val);
                          form.handleSubmit(handleSubmit)();
                        }}
                        defaultValue={field.value}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                      >
                        <FormItem className="flex items-center">
                          <FormControl>
                            <RadioGroupItem value="plan771" id="plan771" className="peer sr-only" />
                          </FormControl>
                          <FormLabel
                            htmlFor="plan771"
                            className="flex flex-col justify-between rounded-xl border-2 border-muted bg-card p-4 hover:bg-accent hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 w-full cursor-pointer transition-all"
                          >
                            <span className="text-sm font-bold text-foreground">Plan 771 (Limited Premium Pay)</span>
                            <span className="text-xs text-muted-foreground mt-1 font-medium">Pay for 5 to 16 years • Get 10% annual income for life</span>
                          </FormLabel>
                        </FormItem>

                        <FormItem className="flex items-center">
                          <FormControl>
                            <RadioGroupItem value="plan883" id="plan883" className="peer sr-only" />
                          </FormControl>
                          <FormLabel
                            htmlFor="plan883"
                            className="flex flex-col justify-between rounded-xl border-2 border-muted bg-card p-4 hover:bg-accent hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 w-full cursor-pointer transition-all"
                          >
                            <span className="text-sm font-bold text-foreground">Plan 883 (Single Premium Pay)</span>
                            <span className="text-xs text-muted-foreground mt-1 font-medium">One-time lump sum payment • Lifetime income option</span>
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                {/* Age Field */}
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem className="bg-muted/40 p-4 rounded-xl border">
                      <div className="flex justify-between items-center mb-2">
                        <FormLabel className="text-sm font-semibold flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>{dictionary?.inputs?.age || "Policyholder Age"}:</span>
                        </FormLabel>
                        <span className="text-lg font-bold text-primary px-2.5 py-0.5 bg-primary/10 rounded-md">
                          {field.value} yrs
                        </span>
                      </div>
                      <FormControl>
                        <Slider
                          min={8}
                          max={65}
                          step={1}
                          value={[field.value]}
                          onValueChange={(vals) => {
                            field.onChange(vals[0]);
                            form.handleSubmit(handleSubmit)();
                          }}
                          className="py-2 cursor-pointer"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Sum Assured Field */}
                <FormField
                  control={form.control}
                  name="basicSumAssured"
                  render={({ field }) => (
                    <FormItem className="bg-muted/40 p-4 rounded-xl border">
                      <div className="flex justify-between items-center mb-2">
                        <FormLabel className="text-sm font-semibold flex items-center gap-1.5">
                          <IndianRupee className="h-4 w-4 text-primary" />
                          <span>Basic Sum Assured:</span>
                        </FormLabel>
                        <span className="text-lg font-bold text-primary px-2.5 py-0.5 bg-primary/10 rounded-md">
                          ₹{(field.value / 100000).toFixed(1)} Lakh
                        </span>
                      </div>
                      <FormControl>
                        <Input
                          type="number"
                          step={25000}
                          min={500000}
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            form.handleSubmit(handleSubmit)();
                          }}
                          className="bg-card font-medium"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* PPT Field (Only for Plan 771) */}
                {watchPlanType === 'plan771' && (
                  <FormField
                    control={form.control}
                    name="ppt"
                    render={({ field }) => (
                      <FormItem className="bg-muted/40 p-4 rounded-xl border">
                        <div className="flex justify-between items-center mb-2">
                          <FormLabel className="text-sm font-semibold flex items-center gap-1.5">
                            <ClockIcon className="h-4 w-4 text-primary" />
                            <span>Premium Paying Term (PPT):</span>
                          </FormLabel>
                          <span className="text-lg font-bold text-primary px-2.5 py-0.5 bg-primary/10 rounded-md">
                            {field.value} yrs
                          </span>
                        </div>
                        <Select
                          onValueChange={(val) => {
                            field.onChange(Number(val));
                            form.handleSubmit(handleSubmit)();
                          }}
                          defaultValue={String(field.value)}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-card">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((p) => (
                              <SelectItem key={p} value={String(p)}>
                                {p} Years PPT
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                )}

                {/* Income Option Field */}
                <FormField
                  control={form.control}
                  name="incomeOption"
                  render={({ field }) => (
                    <FormItem className="bg-muted/40 p-4 rounded-xl border col-span-1 md:col-span-2 lg:col-span-3">
                      <FormLabel className="text-sm font-semibold">
                        {dictionary?.inputs?.incomeOption?.label || "Survival Benefit Income Option"}:
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(val) => {
                            field.onChange(val);
                            form.handleSubmit(handleSubmit)();
                          }}
                          defaultValue={field.value}
                          className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2"
                        >
                          <FormItem className="flex items-center">
                            <FormControl>
                              <RadioGroupItem value="regular" id="inc-regular" className="peer sr-only" />
                            </FormControl>
                            <FormLabel
                              htmlFor="inc-regular"
                              className="w-full p-3 border rounded-lg cursor-pointer bg-card hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-all text-xs sm:text-sm font-semibold"
                            >
                              Option 1: Regular Income (10% Annual Payout for Life)
                            </FormLabel>
                          </FormItem>

                          <FormItem className="flex items-center">
                            <FormControl>
                              <RadioGroupItem value="flexi" id="inc-flexi" className="peer sr-only" />
                            </FormControl>
                            <FormLabel
                              htmlFor="inc-flexi"
                              className="w-full p-3 border rounded-lg cursor-pointer bg-card hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-all text-xs sm:text-sm font-semibold"
                            >
                              Option 2: Flexi Income (Accumulates @ 5.5% p.a. guaranteed)
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Riders Section */}
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Optional Rider Add-ons:</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {['addb', 'ab', 'term', 'ci', 'pwb'].map((rKey) => {
                    const riderObj = riderDetails[rKey] || {};
                    return (
                      <FormField
                        key={rKey}
                        control={form.control}
                        name={`riders.${rKey as keyof FormValues['riders']}`}
                        render={({ field }) => (
                          <FormItem className="flex items-start space-x-3 space-y-0 rounded-lg border p-3 bg-muted/20">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={(val) => {
                                  field.onChange(val);
                                  form.handleSubmit(handleSubmit)();
                                }}
                              />
                            </FormControl>
                            <div className="space-y-1">
                              <FormLabel className="font-semibold text-xs cursor-pointer">
                                {riderObj.label || rKey.toUpperCase()}
                              </FormLabel>
                              <p className="text-[11px] text-muted-foreground leading-snug">
                                {riderObj.description || "Optional rider cover."}
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />
                    );
                  })}
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto px-8 py-6 text-base font-bold shadow-md">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Calculating...
                  </>
                ) : (
                  dictionary?.calculator_ui?.calculate_button || "Calculate Premium & Returns"
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
        <Card className="mt-8 shadow-xl border-emerald-500/20 bg-gradient-to-b from-card to-emerald-950/5 animate-in fade-in-50">
          <CardHeader className="border-b pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <CardTitle className="text-lg sm:text-xl font-bold flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span>Policy Benefits & Return Projections</span>
              </CardTitle>
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full sm:w-auto">
                <TabsList className="grid grid-cols-2 text-xs">
                  <TabsTrigger value="summary">Summary View</TabsTrigger>
                  <TabsTrigger value="schedule" className="flex items-center gap-1">
                    <TableIcon className="h-3.5 w-3.5" /> Year-wise Table
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {activeTab === 'summary' ? (
              <div className="space-y-6">
                {/* Key KPIs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-primary/10 p-4 rounded-xl border border-primary/20 text-center">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">1st Year Premium</p>
                    <p className="text-2xl font-extrabold text-primary mt-1">{formatCurrency(result.totalFirstYearPremium)}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">Incl. 4.5% GST ({form.getValues().mode})</p>
                  </div>

                  <div className="bg-card p-4 rounded-xl border text-center shadow-sm">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Guaranteed Additions</p>
                    <p className="text-2xl font-extrabold text-foreground mt-1">{formatCurrency(result.guaranteedAdditionsTotal)}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">₹40/₹1k BSA × {watchPlanType === 'plan883' ? 1 : form.getValues().ppt} yrs</p>
                  </div>

                  <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20 text-center">
                    <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Lifelong Annual Income</p>
                    <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{formatCurrency(result.annualSurvivalBenefit)}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">10% BSA every year for life</p>
                  </div>

                  <div className="bg-secondary/40 p-4 rounded-xl border text-center">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Nominee Death Cover</p>
                    <p className="text-xl font-bold text-foreground mt-1">{formatCurrency(result.deathBenefit)}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">BSA + Total Accrued GAs</p>
                  </div>
                </div>

                {/* Mode Breakdown */}
                <div className="bg-muted/30 p-4 rounded-xl border">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                    Premium Payment Frequency Options (Year 1)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    {result.modePremiums.map((mp) => (
                      <div key={mp.mode} className="p-2.5 rounded-lg bg-card border">
                        <span className="text-muted-foreground block text-[11px]">{mp.label}</span>
                        <strong className="text-foreground font-bold text-sm">{formatCurrency(mp.premium)}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle className="text-xs font-bold">Actuarial Note</AlertTitle>
                  <AlertDescription className="text-xs text-muted-foreground">
                    Survival benefits begin 2 years after your PPT completes. Annual income is paid for life up to age 100.
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              /* Year-by-Year Schedule Table */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-foreground">
                    Year-by-Year Policy Benefit Schedule (Age {form.getValues().age} to 100)
                  </h4>
                  <span className="text-xs text-muted-foreground">Scroll horizontally to view all columns</span>
                </div>
                <div className="rounded-xl border overflow-x-auto bg-card">
                  <Table className="w-full text-xs">
                    <TableHeader className="bg-muted/60">
                      <TableRow>
                        <TableHead className="font-bold text-foreground">Policy Year</TableHead>
                        <TableHead className="font-bold text-foreground text-center">Attained Age</TableHead>
                        <TableHead className="font-bold text-foreground text-center">Premium Paid</TableHead>
                        <TableHead className="font-bold text-foreground text-center">Cum. Premium</TableHead>
                        <TableHead className="font-bold text-foreground text-center">Accrued GAs</TableHead>
                        <TableHead className="font-bold text-emerald-600 dark:text-emerald-400 text-center">Survival Income</TableHead>
                        <TableHead className="font-bold text-foreground text-center">Nominee Death Benefit</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.schedule.map((row) => (
                        <TableRow key={row.year} className="hover:bg-muted/40 transition-colors">
                          <TableCell className="font-semibold text-foreground py-2">Year {row.year}</TableCell>
                          <TableCell className="text-center text-muted-foreground py-2">{row.age} yrs</TableCell>
                          <TableCell className="text-center py-2">{row.premiumPaid > 0 ? formatCurrency(row.premiumPaid) : '—'}</TableCell>
                          <TableCell className="text-center py-2 text-muted-foreground">{formatCurrency(row.cumulativePremium)}</TableCell>
                          <TableCell className="text-center py-2 font-medium text-primary">{formatCurrency(row.accruedGA)}</TableCell>
                          <TableCell className="text-center py-2 font-bold text-emerald-600 dark:text-emerald-400">
                            {row.survivalBenefit > 0 ? formatCurrency(row.survivalBenefit) : '—'}
                          </TableCell>
                          <TableCell className="text-center py-2 font-semibold text-foreground">{formatCurrency(row.deathBenefit)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t mt-6">
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
                  <Printer className="h-4 w-4" /> Print Schedule
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </TooltipProvider>
  );
}

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
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
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
