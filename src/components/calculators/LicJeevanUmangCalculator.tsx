'use client';

import { useState, useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Info, CheckCircle2, ShieldAlert, Sparkles, TrendingUp, Calendar, Landmark, AlertCircle, ChevronDown, ChevronUp, Table as TableIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const formSchema = z.object({
  age: z.coerce.number().min(0, "Minimum entry age is 90 days (0 years)").max(55, "Maximum entry age is 55"),
  sumAssured: z.coerce.number().min(200000, "Minimum Sum Assured is ₹2,00,000"),
  ppt: z.coerce.number().refine(val => [15, 20, 25, 30].includes(val), "PPT options for Plan 745 are 15, 20, 25, or 30 years"),
  addb: z.boolean().default(false),
  termRider: z.boolean().default(false),
  pwbRider: z.boolean().default(false),
  proposerAge: z.coerce.number().min(18).max(55).optional().default(35),
});

type FormValues = z.infer<typeof formSchema>;

type ModeDetail = {
  mode: string;
  basePremium: number;
  gst1st: number;
  total1st: number;
  gst2nd: number;
  total2nd: number;
};

type LifecycleRow = {
  policyYear: number;
  attainedAge: number;
  premiumPaid: number;
  survivalIncome: number;
  accruedBonus: number;
  deathBenefit: number;
};

type CalculationResult = {
  ppt: number;
  payingYears: number;
  survivalAgeStart: number;
  firstYearModes: ModeDetail[];
  totalPremiumPaid: number;
  annualSurvivalIncome: number;
  survivalYears: number;
  totalSurvivalPayout: number;
  maturity: {
    sumAssured: number;
    bonus: number;
    fab: number;
    total: number;
  };
  deathBenefit: number;
  lifecycle: LifecycleRow[];
};

// Base tabular premium rates per 1,000 Sum Assured for Plan 745 (representative actuarial scale)
const tabularBaseRates: Record<number, Record<number, number>> = {
  15: { 0: 48.20, 10: 49.50, 20: 51.20, 30: 54.80, 40: 61.50, 50: 74.20, 55: 84.10 },
  20: { 0: 34.10, 10: 35.20, 20: 36.80, 30: 39.90, 40: 45.60, 50: 56.40 },
  25: { 0: 25.80, 10: 26.60, 20: 28.10, 30: 30.90, 40: 36.20, 45: 41.50 },
  30: { 0: 20.40, 10: 21.10, 20: 22.50, 30: 25.10, 40: 30.00 }
};

function getTabularRate(ppt: number, age: number): number {
  const pptRates = tabularBaseRates[ppt] || tabularBaseRates[20];
  const ages = Object.keys(pptRates).map(Number).sort((a, b) => a - b);
  
  if (age <= ages[0]) return pptRates[ages[0]];
  if (age >= ages[ages.length - 1]) return pptRates[ages[ages.length - 1]];
  
  for (let i = 0; i < ages.length - 1; i++) {
    if (age >= ages[i] && age <= ages[i + 1]) {
      const lowAge = ages[i];
      const highAge = ages[i + 1];
      const lowRate = pptRates[lowAge];
      const highRate = pptRates[highAge];
      return lowRate + ((highRate - lowRate) * (age - lowAge)) / (highAge - lowAge);
    }
  }
  return 40.0;
}

export function LicJeevanUmangCalculator({ dictionary }: { dictionary: any }) {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const [showFullLifecycle, setShowFullLifecycle] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 30,
      sumAssured: 1000000,
      ppt: 20,
      addb: true,
      termRider: false,
      pwbRider: false,
      proposerAge: 35,
    },
  });

  const values = form.watch();

  const calculateQuote = (val: FormValues) => {
    startTransition(() => {
      const ppt = val.ppt;
      const age = val.age;
      const sumAssured = val.sumAssured;

      // 1. High Sum Assured Rebate per 1,000 SA
      let hsaRebate = 0;
      if (sumAssured >= 2500000) hsaRebate = 2.0;
      else if (sumAssured >= 1000000) hsaRebate = 1.75;
      else if (sumAssured >= 500000) hsaRebate = 1.25;

      const baseRate = getTabularRate(ppt, age);
      const netTabularRate = Math.max(0, baseRate - hsaRebate);
      const annualBase = (sumAssured / 1000) * netTabularRate;

      // 2. Rider calculation
      let riderAnnual = 0;
      if (val.addb && age >= 18) riderAnnual += (sumAssured / 1000) * 1.0;
      if (val.termRider) riderAnnual += (sumAssured / 1000) * 1.8;
      if (val.pwbRider && age < 18) riderAnnual += (sumAssured / 1000) * 1.2;

      const totalAnnualNet = annualBase + riderAnnual;

      // 3. Payment Modes with GST
      const modeFactors: { name: string; label: string; factor: number; discount: number }[] = [
        { name: "Yearly", label: "Yearly (2% Rebate)", factor: 1.0, discount: 0.98 },
        { name: "Half-Yearly", label: "Half-Yearly (1% Rebate)", factor: 0.5, discount: 0.99 },
        { name: "Quarterly", label: "Quarterly", factor: 0.25, discount: 1.0 },
        { name: "Monthly (NACH)", label: "Monthly", factor: 0.08333, discount: 1.0 },
      ];

      const modes: ModeDetail[] = modeFactors.map((m) => {
        const baseModePremium = totalAnnualNet * m.factor * m.discount;
        const gst1st = baseModePremium * 0.045;
        const gst2nd = baseModePremium * 0.0225;
        return {
          mode: m.name,
          basePremium: Math.round(baseModePremium),
          gst1st: Math.round(gst1st),
          total1st: Math.round(baseModePremium + gst1st),
          gst2nd: Math.round(gst2nd),
          total2nd: Math.round(baseModePremium + gst2nd),
        };
      });

      const yearlyMode = modes.find((m) => m.mode === "Yearly")!;
      const totalPremiumPaid = yearlyMode.total1st + yearlyMode.total2nd * (ppt - 1);

      // 4. Guaranteed 8% Survival Income
      const annualSurvivalIncome = sumAssured * 0.08;
      const survivalAgeStart = age + ppt;
      const survivalYears = Math.max(0, 100 - survivalAgeStart);
      const totalSurvivalPayout = annualSurvivalIncome * survivalYears;

      // 5. Maturity Payout at Age 100
      const estBonusRatePerThousand = 48; // ₹48 per ₹1,000 SA per year
      const totalBonus = (sumAssured / 1000) * estBonusRatePerThousand * 100; // 100 years duration
      const fabRatePerThousand = 250;
      const fab = (sumAssured / 1000) * fabRatePerThousand;
      const maturityTotal = sumAssured + totalBonus + fab;

      const deathBenefit = sumAssured * 1.25 + totalBonus;

      // 6. Year-by-Year Lifecycle Table (Age to 100)
      const maxYears = 100 - age;
      const lifecycle: LifecycleRow[] = [];

      for (let yr = 1; yr <= maxYears; yr++) {
        const attainedAge = age + yr - 1;
        let premiumPaid = 0;
        if (yr === 1) premiumPaid = yearlyMode.total1st;
        else if (yr <= ppt) premiumPaid = yearlyMode.total2nd;

        let survivalIncome = 0;
        if (yr > ppt) survivalIncome = annualSurvivalIncome;

        const accruedBonus = Math.round((sumAssured / 1000) * estBonusRatePerThousand * yr);
        const deathCov = Math.round(Math.max(sumAssured * 1.25, yearlyMode.total1st * 7) + accruedBonus);

        lifecycle.push({
          policyYear: yr,
          attainedAge,
          premiumPaid,
          survivalIncome,
          accruedBonus,
          deathBenefit: deathCov,
        });
      }

      setResult({
        ppt,
        payingYears: ppt,
        survivalAgeStart,
        firstYearModes: modes,
        totalPremiumPaid,
        annualSurvivalIncome,
        survivalYears,
        totalSurvivalPayout,
        maturity: {
          sumAssured,
          bonus: totalBonus,
          fab,
          total: maturityTotal,
        },
        deathBenefit,
        lifecycle,
      });
    });
  };

  useEffect(() => {
    calculateQuote(form.getValues());
  }, []);

  function onSubmit(data: FormValues) {
    calculateQuote(data);
  }

  const formatCurrency = (val: number) =>
    `₹${Math.round(val).toLocaleString('en-IN')}`;

  return (
    <div className="space-y-8">
      <Card className="border-2 border-emerald-500/20 shadow-xl bg-card">
        <CardHeader className="bg-gradient-to-r from-emerald-950/10 via-teal-950/10 to-transparent p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <CardTitle className="text-lg sm:text-2xl font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{dictionary.title || "LIC Jeevan Umang Calculator (Plan 745 / 945)"}</span>
            </CardTitle>
            <span className="self-start sm:self-auto text-[11px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200">
              Active Plan 745 (2026 Rules)
            </span>
          </div>
          <CardDescription className="text-xs sm:text-sm mt-1">
            {dictionary.form_description || "Calculate guaranteed 8% annual survival income, limited PPT premiums, and age-100 maturity wealth."}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3.5 sm:p-6 pt-4 sm:pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Age */}
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dictionary.age_label || "Policyholder Age (Years)"}</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="font-semibold" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* PPT */}
                <FormField
                  control={form.control}
                  name="ppt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dictionary.ppt_label || "Premium Paying Term (PPT)"}</FormLabel>
                      <Select onValueChange={(v) => field.onChange(Number(v))} defaultValue={String(field.value)}>
                        <FormControl>
                          <SelectTrigger className="font-semibold">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="15">15 Years (Income starts at age {values.age + 15})</SelectItem>
                          <SelectItem value="20">20 Years (Income starts at age {values.age + 20})</SelectItem>
                          <SelectItem value="25">25 Years (Income starts at age {values.age + 25})</SelectItem>
                          <SelectItem value="30">30 Years (Income starts at age {values.age + 30})</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Sum Assured */}
                <FormField
                  control={form.control}
                  name="sumAssured"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dictionary.sum_assured_label || "Basic Sum Assured (₹)"}</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} step={50000} className="font-semibold" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Quick Select Presets */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-semibold text-slate-500">Quick Select Sum Assured:</span>
                {[200000, 500000, 1000000, 2500000, 5000000].map((sa) => (
                  <button
                    key={sa}
                    type="button"
                    onClick={() => {
                      form.setValue('sumAssured', sa);
                      form.handleSubmit(onSubmit)();
                    }}
                    className={`text-xs px-2.5 py-1 rounded-md border font-medium transition-colors ${
                      values.sumAssured === sa
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-muted hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    ₹{(sa / 100000).toLocaleString('en-IN')} Lakh
                  </button>
                ))}
              </div>

              {/* Rider Options */}
              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Optional Riders (Plan 745)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="addb"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border p-3.5 bg-slate-50 dark:bg-slate-800/50">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={values.age < 18} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-xs font-medium cursor-pointer">
                            Accidental Death & Disability (ADDB)
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="termRider"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border p-3.5 bg-slate-50 dark:bg-slate-800/50">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-xs font-medium cursor-pointer">
                            Term Assurance Rider
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pwbRider"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border p-3.5 bg-slate-50 dark:bg-slate-800/50">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={values.age >= 18} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-xs font-medium cursor-pointer">
                            Premium Waiver Benefit (PWB)
                          </FormLabel>
                          {values.age >= 18 && (
                            <p className="text-[10px] text-slate-400">Available for child policies (Age &lt; 18)</p>
                          )}
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Calculating Jeevan Umang Returns...
                  </>
                ) : (
                  dictionary.calculate_button || "Calculate Premium & 8% Survival Income"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Results Dashboard */}
      {result && (
        <div className="space-y-8 animate-in fade-in-50 duration-300">
          {/* Guaranteed 8% Survival Income Hero Card */}
          <Card className="border-2 border-emerald-500 bg-gradient-to-br from-emerald-950/20 via-teal-900/10 to-background shadow-xl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> Guaranteed Lifelong Tax-Free Income
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold">
                  Section 10(10D) Tax-Free
                </span>
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">
                {formatCurrency(result.annualSurvivalIncome)} <span className="text-base font-normal text-muted-foreground">/ Year for Life</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Starting at <strong>Age {result.survivalAgeStart}</strong> (immediately after paying premiums for {result.payingYears} years), LIC guarantees to pay you <strong>8% of your Basic Sum Assured ({formatCurrency(result.annualSurvivalIncome)}) every single year</strong> until you reach Age 100.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <span className="text-xs text-muted-foreground block">Income Start Age</span>
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">Age {result.survivalAgeStart}</span>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <span className="text-xs text-muted-foreground block">Duration of Payout</span>
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{result.survivalYears} Years</span>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <span className="text-xs text-muted-foreground block">Total Lifetime Survival Cashflow</span>
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(result.totalSurvivalPayout)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Premium Breakdown Table */}
          <Card className="shadow-lg border">
            <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
              <CardTitle className="text-lg sm:text-xl font-bold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-emerald-600 shrink-0" />
                <span>Premium Payment Options (1st Year vs 2nd Year GST)</span>
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Includes 4.5% GST load for Year 1 and reduced 2.25% GST for Year 2 to Year {result.ppt}.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3.5 sm:p-6 pt-2 sm:pt-4">
              <div className="overflow-x-auto -mx-1 px-1 sm:mx-0 sm:px-0">
                <table className="w-full text-xs sm:text-sm text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="bg-muted border-b">
                      <th className="p-3 font-semibold">Payment Mode</th>
                      <th className="p-3 font-semibold">Base Premium</th>
                      <th className="p-3 font-semibold">1st Year GST (4.5%)</th>
                      <th className="p-3 font-semibold text-emerald-700 dark:text-emerald-400">1st Year Total</th>
                      <th className="p-3 font-semibold">2nd Yr Onwards (2.25%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.firstYearModes.map((m) => (
                      <tr key={m.mode} className="border-b hover:bg-muted/50">
                        <td className="p-3 font-medium">{m.mode}</td>
                        <td className="p-3">{formatCurrency(m.basePremium)}</td>
                        <td className="p-3 text-slate-500">{formatCurrency(m.gst1st)}</td>
                        <td className="p-3 font-bold text-emerald-700 dark:text-emerald-400">{formatCurrency(m.total1st)}</td>
                        <td className="p-3 font-semibold">{formatCurrency(m.total2nd)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-800/60 rounded-lg flex flex-wrap justify-between items-center text-xs text-muted-foreground gap-2">
                <span>Total Cumulative Outflow ({result.ppt} Years): <strong>{formatCurrency(result.totalPremiumPaid)}</strong></span>
                <span>Sum Assured Rebate applied for high coverage.</span>
              </div>
            </CardContent>
          </Card>

          {/* Dynamic Year-by-Year Cash Flow Lifecycle Table */}
          <Card className="shadow-xl border-2 border-emerald-500/20">
            <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-lg sm:text-xl font-bold flex items-center gap-2">
                  <TableIcon className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span>Year-by-Year Policy Lifecycle Schedule (Age {values.age} to 100)</span>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm mt-1">
                  Complete annual breakdown of premiums paid, 8% survival income payouts, accrued bonuses, and nominee death cover.
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFullLifecycle(!showFullLifecycle)}
                className="text-xs border-emerald-500 text-emerald-700 dark:text-emerald-300 shrink-0"
              >
                {showFullLifecycle ? (
                  <>Show Summary View <ChevronUp className="ml-1 h-3.5 w-3.5" /></>
                ) : (
                  <>View Full 100-Year Table <ChevronDown className="ml-1 h-3.5 w-3.5" /></>
                )}
              </Button>
            </CardHeader>
            <CardContent className="p-3.5 sm:p-6 pt-2 sm:pt-4">
              <div className="overflow-x-auto -mx-1 px-1 sm:mx-0 sm:px-0 max-h-[500px] overflow-y-auto border rounded-lg">
                <table className="w-full text-xs text-left border-collapse min-w-[650px]">
                  <thead className="sticky top-0 bg-emerald-950 text-white dark:bg-emerald-950 shadow">
                    <tr>
                      <th className="p-2.5 font-semibold">Policy Yr</th>
                      <th className="p-2.5 font-semibold">Attained Age</th>
                      <th className="p-2.5 font-semibold text-right">Annual Premium (₹)</th>
                      <th className="p-2.5 font-semibold text-right text-emerald-300">Guaranteed Income (8%)</th>
                      <th className="p-2.5 font-semibold text-right">Accrued Bonus (Est)</th>
                      <th className="p-2.5 font-semibold text-right text-rose-300">Nominee Death Cover</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(showFullLifecycle ? result.lifecycle : result.lifecycle.slice(0, result.ppt + 10)).map((row) => (
                      <tr
                        key={row.policyYear}
                        className={`border-b hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 ${
                          row.policyYear === result.ppt
                            ? 'bg-amber-500/10 font-medium'
                            : row.policyYear === result.ppt + 1
                            ? 'bg-emerald-500/10 font-semibold'
                            : ''
                        }`}
                      >
                        <td className="p-2.5 font-mono">Yr {row.policyYear}</td>
                        <td className="p-2.5 font-medium">Age {row.attainedAge}</td>
                        <td className="p-2.5 text-right font-mono">{row.premiumPaid > 0 ? formatCurrency(row.premiumPaid) : '—'}</td>
                        <td className="p-2.5 text-right font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                          {row.survivalIncome > 0 ? formatCurrency(row.survivalIncome) : '—'}
                        </td>
                        <td className="p-2.5 text-right font-mono text-slate-500">{formatCurrency(row.accruedBonus)}</td>
                        <td className="p-2.5 text-right font-mono font-medium text-rose-600 dark:text-rose-400">
                          {formatCurrency(row.deathBenefit)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!showFullLifecycle && result.lifecycle.length > result.ppt + 10 && (
                <div className="text-center pt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFullLifecycle(true)}
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Showing first {result.ppt + 10} years. Click to expand all {result.lifecycle.length} years (up to Age 100) ↓
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Age-100 Maturity & Death Benefit Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border shadow-lg">
              <CardHeader className="bg-muted/40">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Landmark className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  Maturity Benefit Payout (At Age 100)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <div className="flex justify-between items-center text-sm border-b pb-2">
                  <span className="text-slate-600 dark:text-slate-400">Basic Sum Assured:</span>
                  <span className="font-semibold">{formatCurrency(result.maturity.sumAssured)}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b pb-2">
                  <span className="text-slate-600 dark:text-slate-400">Vested Reversionary Bonus:</span>
                  <span className="font-semibold">{formatCurrency(result.maturity.bonus)}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b pb-2">
                  <span className="text-slate-600 dark:text-slate-400">Final Additional Bonus (FAB):</span>
                  <span className="font-semibold">{formatCurrency(result.maturity.fab)}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-bold text-base">Estimated Maturity Lump Sum:</span>
                  <span className="font-extrabold text-xl text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(result.maturity.total)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border shadow-lg">
              <CardHeader className="bg-muted/40">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-rose-600" />
                  Nominee Protection (Death Cover)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <p className="text-xs text-muted-foreground">
                  In case of unfortunate death of policyholder at any point during or after PPT, the nominee receives:
                </p>
                <div className="p-3 bg-rose-50 dark:bg-rose-950/30 rounded-lg border border-rose-200 dark:border-rose-900">
                  <span className="text-xs font-semibold text-rose-700 dark:text-rose-400 block">Sum Assured on Death + Vested Bonuses</span>
                  <span className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1 block">
                    {formatCurrency(result.deathBenefit)}
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Guaranteed minimum of 105% of total premiums paid.
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Alert className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <AlertCircle className="h-4 w-4 text-emerald-600" />
            <AlertTitle className="text-xs font-semibold">Actuarial Disclaimer</AlertTitle>
            <AlertDescription className="text-xs text-slate-500 dark:text-slate-400">
              {dictionary.results?.note || "Values are illustrative estimates based on official LIC Plan 745 tabular rates and past declared bonus rates. For a binding policy schedule, please consult LIC of India."}
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}
