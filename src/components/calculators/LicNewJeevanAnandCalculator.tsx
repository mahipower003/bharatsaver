
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Printer, Twitter, Calendar, ShieldCheck, Sparkles, Table as TableIcon, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '../ui/checkbox';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { Info } from 'lucide-react';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52s-.669-1.611-.916-2.207c-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
  </svg>
);

const formSchema = z.object({
  age: z.coerce.number().min(18, "Minimum age is 18").max(50, "Maximum age is 50"),
  term: z.coerce.number().min(15, "Minimum policy term is 15 years").max(35, "Maximum policy term is 35 years"),
  sumAssured: z.coerce.number().min(100000, "Minimum Sum Assured is ₹1,00,000"),
  addb: z.boolean().default(true),
  termRider: z.boolean().default(false),
}).refine(data => data.age + data.term <= 75, {
  message: "Maximum age at maturity cannot exceed 75 years (Age + Term <= 75).",
  path: ["term"],
});

type FormValues = z.infer<typeof formSchema>;

export type LifecycleRow = {
  policyYear: number;
  age: number;
  premiumPaid: number;
  cumulativePremium: number;
  vestedBonus: number;
  deathBenefit: number;
  postMaturityCover: number;
};

export type CalculationResult = {
  firstYear: { mode: string; premium: number; gst: number; total: number; base: number; riders: number }[];
  secondYear: { mode: string; premium: number; gst: number; total: number; base: number; riders: number }[];
  totalPremiumPaid: number;
  maturity: {
    sumAssured: number;
    bonus: number;
    fab: number;
    total: number;
  };
  deathBenefitInTerm: number;
  postMaturityLifeCover: number;
  chartData: any[];
  lifecycleSchedule: LifecycleRow[];
};

// Actuarial tabular base rates per 1,000 SA for Plan 715 / Plan 915
const getTabularRate = (age: number, term: number): number => {
  // Approximate official LIC Table 715 tabular rate matrix
  let baseRate = 45.0;
  if (term <= 15) baseRate = 62.0 - (age * 0.4);
  else if (term <= 20) baseRate = 48.0 - (age * 0.3);
  else if (term <= 25) baseRate = 38.5 - (age * 0.25);
  else baseRate = 30.0 - (age * 0.15);

  // Age adjustment factor
  const ageFactor = 1 + ((age - 18) * 0.012);
  return Math.max(18, baseRate * ageFactor);
};

// High Sum Assured (HSA) Rebate per ₹1,000 SA
const getHighSARebate = (sa: number): number => {
  if (sa >= 1000000) return 3.00;
  if (sa >= 500000) return 2.50;
  if (sa >= 200000) return 1.50;
  return 0.0;
};

// Bonus Rate per ₹1,000 SA based on policy term
const getBonusRate = (term: number): number => {
  if (term >= 21) return 48;
  if (term >= 16) return 45;
  return 42;
};

// Final Additional Bonus (FAB) per ₹1,000 SA
const getFabRate = (term: number): number => {
  if (term >= 30) return 250;
  if (term >= 25) return 150;
  if (term >= 20) return 70;
  if (term >= 15) return 20;
  return 0;
};

export function LicNewJeevanAnandCalculator({ dictionary }: { dictionary: any }) {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFullLifecycle, setShowFullLifecycle] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 30,
      term: 25,
      sumAssured: 1000000,
      addb: true,
      termRider: false,
    },
  });

  async function handleSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    await new Promise(resolve => setTimeout(resolve, 300));

    const tabularRate = getTabularRate(values.age, values.term);
    const hsaRebate = getHighSARebate(values.sumAssured);
    const netTabularRate = Math.max(10, tabularRate - hsaRebate);

    const baseYearlyPremium = (values.sumAssured / 1000) * netTabularRate;

    let riderPremium = 0;
    if (values.addb) {
      // AD&DB Rider: Approx ₹1 per ₹1,000 SA
      riderPremium += (values.sumAssured / 1000) * 1.0;
    }
    if (values.termRider) {
      // Term Rider: Approx ₹2.5 per ₹1,000 SA
      riderPremium += (values.sumAssured / 1000) * 2.5;
    }

    const modes = [
      { name: 'Yearly', factor: 1.0, rebate: 0.02 },
      { name: 'Half-Yearly', factor: 0.51, rebate: 0.01 },
      { name: 'Quarterly', factor: 0.2575, rebate: 0 },
      { name: 'Monthly (NACH)', factor: 0.0865, rebate: 0 },
    ];

    const calculatePremiums = (gstBaseRate: number) => modes.map(mode => {
      const modalBase = (baseYearlyPremium * mode.factor) * (1 - mode.rebate);
      const modalRider = riderPremium * mode.factor;
      const totalBaseRiders = modalBase + modalRider;
      const gst = (modalBase * gstBaseRate) + (modalRider * 0.18);
      return {
        mode: mode.name,
        premium: totalBaseRiders,
        gst,
        total: Math.round(totalBaseRiders + gst),
        base: Math.round(modalBase),
        riders: Math.round(modalRider)
      };
    });

    const firstYearPremiums = calculatePremiums(0.045);
    const secondYearPremiums = calculatePremiums(0.0225);

    const yearly1stYearTotal = firstYearPremiums[0].total;
    const yearly2ndYearTotal = secondYearPremiums[0].total;
    const totalPremiumPaid = yearly1stYearTotal + (yearly2ndYearTotal * (values.term - 1));

    const bonusRate = getBonusRate(values.term);
    const fabRate = getFabRate(values.term);

    const annualBonus = (values.sumAssured / 1000) * bonusRate;
    const totalVestedBonus = annualBonus * values.term;
    const finalFab = (values.sumAssured / 1000) * fabRate;
    const estimatedMaturityValue = values.sumAssured + totalVestedBonus + finalFab;

    // Death Benefit during term: Higher of 125% Sum Assured or 7x Annual Premium + Bonuses
    const deathBenefitInTerm = Math.max(values.sumAssured * 1.25, 7 * firstYearPremiums[0].base);
    const postMaturityLifeCover = values.sumAssured; // Jeevan Anand signature: Lifetime death cover equal to SA post maturity!

    // 100-Year Lifecycle Table Generation
    const lifecycleSchedule: LifecycleRow[] = [];
    let cumulativePaid = 0;
    const totalYearsToTrack = Math.min(100 - values.age, values.term + 35); // Track through PPT and post-maturity life

    for (let yr = 1; yr <= totalYearsToTrack; yr++) {
      const currentAge = values.age + yr;
      const isDuringTerm = yr <= values.term;

      let annualPaid = 0;
      if (isDuringTerm) {
        annualPaid = (yr === 1) ? yearly1stYearTotal : yearly2ndYearTotal;
      }
      cumulativePaid += annualPaid;

      const currentVestedBonus = isDuringTerm ? (annualBonus * yr) : totalVestedBonus;
      const currentDeathBenefit = isDuringTerm ? (deathBenefitInTerm + currentVestedBonus) : 0;
      const currentPostMaturityCover = !isDuringTerm ? values.sumAssured : 0;

      lifecycleSchedule.push({
        policyYear: yr,
        age: currentAge,
        premiumPaid: Math.round(annualPaid),
        cumulativePremium: Math.round(cumulativePaid),
        vestedBonus: Math.round(currentVestedBonus),
        deathBenefit: Math.round(currentDeathBenefit),
        postMaturityCover: Math.round(currentPostMaturityCover),
      });
    }

    const chartData = [
      { name: 'Total Premiums Paid', value: Math.round(totalPremiumPaid) },
      { name: 'Basic Sum Assured', value: values.sumAssured },
      { name: 'Vested Bonus', value: Math.round(totalVestedBonus) },
      { name: 'FAB Loyalty Bonus', value: Math.round(finalFab) },
      { name: 'Maturity Payout', value: Math.round(estimatedMaturityValue) },
      { name: 'Post-Maturity Cover', value: values.sumAssured },
    ];

    setResult({
      firstYear: firstYearPremiums,
      secondYear: secondYearPremiums,
      totalPremiumPaid: Math.round(totalPremiumPaid),
      maturity: {
        sumAssured: values.sumAssured,
        bonus: Math.round(totalVestedBonus),
        fab: Math.round(finalFab),
        total: Math.round(estimatedMaturityValue),
      },
      deathBenefitInTerm: Math.round(deathBenefitInTerm),
      postMaturityLifeCover: values.sumAssured,
      chartData,
      lifecycleSchedule,
    });

    setIsLoading(false);
  }

  const formatCurrency = (value: number) =>
    value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const handlePrint = () => window.print();

  const handleShare = (platform: 'whatsapp' | 'twitter') => {
    if (!result || typeof window === 'undefined') return;
    const url = window.location.href;
    const text = `My LIC New Jeevan Anand (Plan 715) maturity is projected at ${formatCurrency(result.maturity.total)} PLUS ${formatCurrency(result.postMaturityLifeCover)} lifetime cover! Calculate yours:`;
    const shareUrl = platform === 'twitter'
      ? `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`;
    window.open(shareUrl, '_blank');
  };

  return (
    <>
      <Card className="shadow-xl border-emerald-600/20 dark:border-emerald-500/20">
        <CardHeader className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-t-xl">
          <CardTitle className="flex items-center gap-2 text-2xl font-bold">
            <ShieldCheck className="h-7 w-7 text-emerald-400" />
            {dictionary?.title || "LIC New Jeevan Anand Calculator (Plan 715 / 915)"}
          </CardTitle>
          <CardDescription className="text-emerald-100/90 text-base">
            {dictionary?.form_description || "Calculate 1st & 2nd year premiums, guaranteed maturity payouts, and double lifetime death cover under Plan 715."}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-slate-800 dark:text-slate-200">
                        {dictionary?.age_label || "Entry Age (18 to 50 Years)"}
                      </FormLabel>
                      <FormControl>
                        <Input type="number" min={18} max={50} {...field} className="h-11 border-slate-300 focus:border-emerald-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="term"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-slate-800 dark:text-slate-200">
                        {dictionary?.term_label || "Policy Term (15 to 35 Years)"}
                      </FormLabel>
                      <FormControl>
                        <Input type="number" min={15} max={35} {...field} className="h-11 border-slate-300 focus:border-emerald-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sumAssured"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-slate-800 dark:text-slate-200">
                        {dictionary?.sum_assured_label || "Basic Sum Assured (₹)"}
                      </FormLabel>
                      <FormControl>
                        <Input type="number" step={5000} min={100000} {...field} className="h-11 border-slate-300 focus:border-emerald-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-600" />
                  {dictionary?.riders_title || "Optional Riders (Add-ons)"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="addb"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-900/50">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-emerald-600" />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="font-medium cursor-pointer">
                            {dictionary?.addb_rider_label || "Accidental Death & Disability Benefit (AD&DB) Rider"}
                          </FormLabel>
                          <p className="text-xs text-muted-foreground">Provides additional sum assured in case of accidental demise or permanent disability.</p>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="termRider"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-900/50">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-emerald-600" />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="font-medium cursor-pointer">
                            {dictionary?.term_rider_label || "Term Assurance Rider"}
                          </FormLabel>
                          <p className="text-xs text-muted-foreground">Doubles the life insurance cover during the policy term.</p>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-12 px-8 text-base shadow-md">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {dictionary?.calculating || "Calculating Plan 715 Benefits..."}
                  </>
                ) : (
                  dictionary?.calculate_button || "Calculate Premium & Double Cover"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <Card className="mt-8 shadow-xl animate-in fade-in-50 print-container border-emerald-600/30">
          <CardHeader className="bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-100 dark:border-emerald-900/50">
            <CardTitle className="text-2xl font-bold text-emerald-950 dark:text-emerald-100 flex items-center justify-between">
              <span>LIC New Jeevan Anand (Plan 715) Calculation Results</span>
              <span className="text-xs bg-emerald-600 text-white px-3 py-1 rounded-full font-normal">Plan UIN: 512N279V03</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 p-6">
            <Alert className="bg-emerald-50/70 border-emerald-300 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200">
              <Info className="h-5 w-5 text-emerald-600" />
              <AlertTitle className="font-semibold text-emerald-900 dark:text-emerald-100">
                {dictionary?.assumptions_title || "Double Death Cover Highlight"}
              </AlertTitle>
              <AlertDescription className="text-sm">
                Jeevan Anand (Plan 715) offers <strong>Double Risk Cover</strong>: (1) Maturity Lump Sum + Bonuses paid at end of policy term, AND (2) <strong>Basic Sum Assured ({formatCurrency(result.postMaturityLifeCover)}) continues as lifelong death cover</strong> after maturity at any age!
              </AlertDescription>
            </Alert>

            {/* Premium Table */}
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-emerald-600" />
                Multi-Modal Premium Breakdown (1st Year GST 4.5% vs 2nd Year Onwards 2.25%)
              </h3>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                <Table>
                  <TableHeader className="bg-slate-100 dark:bg-slate-800">
                    <TableRow>
                      <TableHead className="font-bold">Payment Mode</TableHead>
                      <TableHead className="text-right font-bold">1st Year Premium (4.5% GST)</TableHead>
                      <TableHead className="text-right font-bold">2nd Year Onwards (2.25% GST)</TableHead>
                      <TableHead className="text-right font-bold">Total Over Term</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.firstYear.map((item, index) => {
                      const totalModePaid = item.total + (result.secondYear[index].total * (form.getValues().term - 1));
                      return (
                        <TableRow key={item.mode} className={item.mode === 'Yearly' ? 'bg-emerald-50/50 dark:bg-emerald-950/20 font-medium' : ''}>
                          <TableCell className="font-semibold">{item.mode}</TableCell>
                          <TableCell className="text-right font-bold text-emerald-700 dark:text-emerald-400">{formatCurrency(item.total)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(result.secondYear[index].total)}</TableCell>
                          <TableCell className="text-right text-slate-700 dark:text-slate-300">{formatCurrency(totalModePaid)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Key Payout Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-emerald-200 dark:border-emerald-900/60 p-5 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 shadow-sm">
                <h3 className="font-bold text-emerald-900 dark:text-emerald-300 text-sm uppercase tracking-wider mb-2">Estimated Maturity Payout</h3>
                <div className="space-y-2 text-sm">
                  <p className="flex justify-between"><span>Basic Sum Assured:</span> <span className="font-medium">{formatCurrency(result.maturity.sumAssured)}</span></p>
                  <p className="flex justify-between"><span>Vested Reversionary Bonus:</span> <span className="font-medium">{formatCurrency(result.maturity.bonus)}</span></p>
                  <p className="flex justify-between"><span>Final Additional Bonus (FAB):</span> <span className="font-medium">{formatCurrency(result.maturity.fab)}</span></p>
                  <div className="border-t border-emerald-200 dark:border-emerald-800 pt-2 mt-2">
                    <p className="flex justify-between font-bold text-lg text-emerald-700 dark:text-emerald-400">
                      <span>Total Maturity:</span>
                      <span>{formatCurrency(result.maturity.total)}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-blue-200 dark:border-blue-900/60 p-5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 shadow-sm">
                <h3 className="font-bold text-blue-900 dark:text-blue-300 text-sm uppercase tracking-wider mb-2">Death Benefit During Term</h3>
                <p className="text-2xl font-extrabold text-blue-700 dark:text-blue-400 mb-2">
                  {formatCurrency(result.deathBenefitInTerm)} + Vested Bonuses
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Higher of 125% Basic Sum Assured or 7x Annualized Premium. Accrued bonuses are added on top upon demise during policy term.
                </p>
              </div>

              <div className="border border-purple-200 dark:border-purple-900/60 p-5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 shadow-sm">
                <h3 className="font-bold text-purple-900 dark:text-purple-300 text-sm uppercase tracking-wider mb-2">Post-Maturity Life Cover</h3>
                <p className="text-2xl font-extrabold text-purple-700 dark:text-purple-400 mb-2">
                  {formatCurrency(result.postMaturityLifeCover)}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Unique Plan 715 Benefit: Lifelong risk cover continues even after receiving the full maturity payout. Nominee receives Sum Assured upon death at any age.
                </p>
              </div>
            </div>

            {/* Recharts Bar Chart */}
            <div className="h-80 pt-4">
              <h4 className="text-sm font-semibold text-center mb-2 text-slate-700 dark:text-slate-300">Financial Growth & Benefit Breakdown</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={result.chartData} layout="vertical" margin={{ left: 60, right: 30, top: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} />
                  <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 12 }} />
                  <RechartsTooltip formatter={(value: number) => formatCurrency(value)} />
                  <Bar dataKey="value" fill="#059669" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Dynamic 100-Year Schedule Table Toggle */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg flex items-center gap-2">
                    <TableIcon className="h-5 w-5 text-emerald-600" />
                    Complete Policy Lifecycle Schedule
                  </h3>
                  <p className="text-sm text-muted-foreground">View year-by-year premium outlays, accrued bonuses, and post-maturity cover.</p>
                </div>
                <Button
                  onClick={() => setShowFullLifecycle(!showFullLifecycle)}
                  variant="outline"
                  className="border-emerald-600 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950 font-semibold"
                >
                  {showFullLifecycle ? (
                    <>Hide Lifecycle Table <ChevronUp className="ml-2 h-4 w-4" /></>
                  ) : (
                    <>View Full Lifecycle Table <ChevronDown className="ml-2 h-4 w-4" /></>
                  )}
                </Button>
              </div>

              {showFullLifecycle && (
                <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-emerald-900 text-white z-10">
                      <TableRow>
                        <TableHead className="text-white font-bold">Policy Year</TableHead>
                        <TableHead className="text-white font-bold">Age</TableHead>
                        <TableHead className="text-white font-bold text-right">Annual Premium</TableHead>
                        <TableHead className="text-white font-bold text-right">Cumulative Premium</TableHead>
                        <TableHead className="text-white font-bold text-right">Vested Bonus</TableHead>
                        <TableHead className="text-white font-bold text-right">In-Term Death Cover</TableHead>
                        <TableHead className="text-white font-bold text-right">Post-Maturity Cover</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.lifecycleSchedule.map((row) => (
                        <TableRow
                          key={row.policyYear}
                          className={
                            row.policyYear === form.getValues().term
                              ? 'bg-emerald-100 dark:bg-emerald-900/40 font-bold'
                              : row.policyYear > form.getValues().term
                              ? 'bg-purple-50/50 dark:bg-purple-950/20 text-purple-900 dark:text-purple-200'
                              : ''
                          }
                        >
                          <TableCell className="font-semibold">{row.policyYear}</TableCell>
                          <TableCell>{row.age}</TableCell>
                          <TableCell className="text-right">{formatCurrency(row.premiumPaid)}</TableCell>
                          <TableCell className="text-right text-slate-600 dark:text-slate-400">{formatCurrency(row.cumulativePremium)}</TableCell>
                          <TableCell className="text-right text-emerald-700 dark:text-emerald-400 font-medium">{formatCurrency(row.vestedBonus)}</TableCell>
                          <TableCell className="text-right">{row.deathBenefit > 0 ? formatCurrency(row.deathBenefit) : '-'}</TableCell>
                          <TableCell className="text-right font-bold text-purple-700 dark:text-purple-400">
                            {row.postMaturityCover > 0 ? formatCurrency(row.postMaturityCover) : '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>

            {/* Sharing & PDF Actions */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 print-hide border-t border-slate-200 dark:border-slate-800">
              <Button variant="outline" size="sm" onClick={() => handleShare('whatsapp')} className="border-emerald-600 text-emerald-700 hover:bg-emerald-50">
                <WhatsAppIcon className="mr-2 h-4 w-4" /> Share on WhatsApp
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleShare('twitter')} className="border-slate-300">
                <Twitter className="mr-2 h-4 w-4 text-sky-500" /> Share on Twitter
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint} className="border-slate-300">
                <Printer className="mr-2 h-4 w-4" /> Save / Download PDF Report
              </Button>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-2">{dictionary?.results_note || "Disclaimer: Figures include 4.5% 1st yr GST and 2.25% 2nd yr GST. Bonus & FAB declarations are illustrative based on historical LIC bonus trends."}</p>
          </CardContent>
        </Card>
      )}
    </>
  );
}
