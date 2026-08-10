'use client';

import { useState, useTransition, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Download, Printer, Twitter, Clock, Calendar, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '../ui/checkbox';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useToast } from '@/hooks/use-toast';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52s-.669-1.611-.916-2.207c-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
  </svg>
);

const formSchema = z.object({
  age: z.coerce.number().min(8, "Minimum age is 8").max(59, "Maximum age is 59"),
  term: z.coerce.number().refine(val => [16, 21, 25].includes(val), "Invalid term"),
  sumAssured: z.coerce.number().min(200000, "Minimum Sum Assured is ₹2,00,000"),
  addb: z.boolean().default(false),
  termRider: z.boolean().default(false),
  pwbRider: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

type CalculationResult = {
  ppt: number;
  freeYears: number;
  firstYear: { mode: string; premium: number; gst: number; total: number }[];
  secondYear: { mode: string; premium: number; gst: number; total: number }[];
  totalPremiumPaid: number;
  maturity: {
    sumAssured: number;
    bonus: number;
    fab: number;
    total: number;
  };
  deathSumAssured: number;
  accidentRiderSA: number;
  termRiderSA: number;
  pwbRiderApplied: boolean;
  chartData: any[];
};

const premiumRates: Record<number, Record<number, number>> = {
  16: { 8: 88.55, 15: 61.20, 20: 44.00, 25: 32.50, 30: 24.50, 35: 18.90, 40: 15.10, 45: 12.60, 50: 11.15, 59: 11.15 },
  21: { 8: 67.50, 15: 48.90, 20: 36.80, 25: 28.45, 30: 22.50, 35: 18.20, 40: 15.20, 45: 13.20, 50: 12.00, 55: 11.50, 59: 11.50 },
  25: { 8: 55.50, 15: 42.10, 20: 32.80, 25: 26.25, 30: 21.50, 35: 18.00, 40: 15.50, 45: 13.80, 50: 12.80, 55: 12.50, 59: 12.50 },
};

const termRiderRates: Record<number, number> = {
  20: 1.5, 30: 2.0, 40: 3.0, 50: 5.0, 59: 8.0
};

export function LicJeevanLabhCalculator({ dictionary }: { dictionary: any }) {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 30,
      term: 25,
      sumAssured: 1000000,
      addb: false,
      termRider: false,
      pwbRider: false,
    },
  });

  const getPremiumPayingTerm = (policyTerm: number) => {
    if (policyTerm === 16) return 10;
    if (policyTerm === 21) return 15;
    if (policyTerm === 25) return 16;
    return 0;
  };

  const getRateForAge = (age: number, rates: Record<number, number>): number => {
    const availableAges = Object.keys(rates).map(Number).sort((a, b) => a - b);
    let applicableRate = rates[availableAges[availableAges.length - 1]];
    for (let i = 0; i < availableAges.length; i++) {
      if (age <= availableAges[i]) {
        applicableRate = rates[availableAges[i]];
        break;
      }
    }
    return applicableRate;
  };

  // Mount logic: Calculate default quote on mount
  useEffect(() => {
    startTransition(() => {
      calculateQuote(form.getValues());
    });
  }, []);

  function handleSubmit(values: FormValues) {
    startTransition(() => {
      calculateQuote(values);
    });
  }

  function calculateQuote(values: FormValues) {
    setIsLoading(true);

    const termRates = premiumRates[values.term];
    if (!termRates) {
      setIsLoading(false);
      return;
    }

    let rebate = 0;
    if (values.sumAssured >= 1000000) rebate = 1.25;
    else if (values.sumAssured >= 500000) rebate = 1.00;
    else if (values.sumAssured >= 200000) rebate = 0.75;

    const tabularRate = getRateForAge(values.age, termRates);
    const baseYearlyPremium = ((values.sumAssured / 1000) * tabularRate) - (rebate * (values.sumAssured / 1000));

    let riderPremium = 0;
    const accidentRiderSA = values.addb && values.age >= 18 ? values.sumAssured : 0;
    const termRiderSA = values.termRider ? values.sumAssured : 0;
    const pwbApplied = values.pwbRider && values.age < 18;

    if (accidentRiderSA > 0) {
      riderPremium += (accidentRiderSA / 1000) * 1.0;
    }
    if (termRiderSA > 0) {
      const termRiderRate = getRateForAge(values.age, termRiderRates);
      riderPremium += (termRiderSA / 1000) * termRiderRate;
    }
    if (pwbApplied) {
      riderPremium += (values.sumAssured / 1000) * 2.0; // Approx PWB rate
    }

    const yearlyPremium = baseYearlyPremium + riderPremium;

    const modes = [
      { name: 'Yearly', factor: 1, rebate: 0.02 },
      { name: 'Half Yearly', factor: 0.5098, rebate: 0.01 },
      { name: 'Quarterly', factor: 0.2575, rebate: 0 },
      { name: 'Monthly', factor: 0.0879, rebate: 0 }
    ];

    const firstYearPremiums = modes.map(mode => {
      const modalPremium = yearlyPremium * mode.factor * (1 - mode.rebate);
      const gst = (baseYearlyPremium * mode.factor * (1 - mode.rebate) * 0.045) + (riderPremium * mode.factor * (1 - mode.rebate) * 0.18);
      return { mode: mode.name, premium: modalPremium, gst, total: modalPremium + gst };
    });

    const secondYearPremiums = modes.map(mode => {
      const modalPremium = yearlyPremium * mode.factor * (1 - mode.rebate);
      const gst = (baseYearlyPremium * mode.factor * (1 - mode.rebate) * 0.0225) + (riderPremium * mode.factor * (1 - mode.rebate) * 0.18);
      return { mode: mode.name, premium: modalPremium, gst, total: modalPremium + gst };
    });

    const ppt = getPremiumPayingTerm(values.term);
    const freeYears = values.term - ppt;

    const firstYearTotal = firstYearPremiums[0].total;
    const secondYearTotal = secondYearPremiums[0].total;
    const totalPremiumPaid = firstYearTotal + (secondYearTotal * (ppt - 1));

    const bonusRate = values.term === 25 ? 48 : values.term === 21 ? 44 : 40; // Historical bonus rate per 1000 SA
    const fabRate = values.term === 25 ? 120 : values.term === 21 ? 80 : 50; // Historical FAB per 1000 SA

    const vestedBonus = (values.sumAssured / 1000) * bonusRate * values.term;
    const finalAdditionalBonus = (values.sumAssured / 1000) * fabRate;
    const estimatedMaturityValue = values.sumAssured + vestedBonus + finalAdditionalBonus;

    const deathSumAssured = Math.max(values.sumAssured, 7 * baseYearlyPremium);

    const chartData = [
      {
        name: 'Financial Summary',
        'Total Premium Paid': Math.round(totalPremiumPaid),
        'Sum Assured': values.sumAssured,
        'Simple Reversionary Bonus': Math.round(vestedBonus),
        'Final Additional Bonus (FAB)': Math.round(finalAdditionalBonus),
      },
    ];

    setResult({
      ppt,
      freeYears,
      firstYear: firstYearPremiums,
      secondYear: secondYearPremiums,
      totalPremiumPaid,
      maturity: {
        sumAssured: values.sumAssured,
        bonus: vestedBonus,
        fab: finalAdditionalBonus,
        total: estimatedMaturityValue,
      },
      deathSumAssured,
      accidentRiderSA,
      termRiderSA,
      pwbRiderApplied: pwbApplied,
      chartData,
    });

    setIsLoading(false);
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  const handlePrint = () => window.print();

  const handleShare = (platform: 'whatsapp' | 'twitter') => {
    if (!result || typeof window === 'undefined') return;
    const url = window.location.href;
    const text = `I just calculated LIC Jeevan Labh (Plan 736/936) returns on BharatSaver! Total Maturity: ${formatCurrency(result.maturity.total)}. Calculate yours:`;
    const shareUrl = platform === 'twitter'
      ? `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`;
    window.open(shareUrl, '_blank');
  };

  const handleCSVExport = () => {
    if (!result) return;
    const { age, term, sumAssured, addb, termRider, pwbRider } = form.getValues();

    let csvContent = "Parameter,Value\n";
    csvContent += `Age,${age}\n`;
    csvContent += `Policy Term,${term} Years\n`;
    csvContent += `Premium Paying Term (PPT),${result.ppt} Years\n`;
    csvContent += `Sum Assured,${sumAssured}\n`;
    csvContent += `Accidental Rider,${addb ? 'Yes' : 'No'}\n`;
    csvContent += `Term Rider,${termRider ? 'Yes' : 'No'}\n`;
    csvContent += `PWB Rider,${pwbRider ? 'Yes' : 'No'}\n\n`;

    csvContent += "First Year Premium\nMode,Premium,GST,Total\n";
    result.firstYear.forEach(row => {
      csvContent += `${row.mode},${row.premium.toFixed(2)},${row.gst.toFixed(2)},${row.total.toFixed(2)}\n`;
    });
    csvContent += "\nSecond Year Onwards Premium\nMode,Premium,GST,Total\n";
    result.secondYear.forEach(row => {
      csvContent += `${row.mode},${row.premium.toFixed(2)},${row.gst.toFixed(2)},${row.total.toFixed(2)}\n`;
    });
    csvContent += "\nMaturity Benefits\nDescription,Value\n";
    csvContent += `Basic Sum Assured,${result.maturity.sumAssured}\n`;
    csvContent += `Total Premium Paid,${result.totalPremiumPaid.toFixed(2)}\n`;
    csvContent += `Simple Reversionary Bonus (SRB),${result.maturity.bonus}\n`;
    csvContent += `Final Additional Bonus (FAB),${result.maturity.fab}\n`;
    csvContent += `Total Tax-Free Maturity,${result.maturity.total}\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'lic_jeevan_labh_summary.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const values = form.getValues();

  return (
    <div className="print-hide space-y-6">
      <Card className="shadow-xl border-slate-200 dark:border-slate-800">
        <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-t-xl p-4 sm:p-6">
          <CardTitle className="text-lg md:text-2xl">{dictionary.title || "LIC Jeevan Labh Calculator (Plan 936 / 736)"}</CardTitle>
          <CardDescription className="text-emerald-100 text-xs md:text-sm">
            Instant actuarial calculation for premiums, limited payment schedule, and tax-free maturity benefits.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3.5 sm:p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dictionary.age_label || "Your Age"}</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="font-semibold" />
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
                      <FormLabel>{dictionary.term_label || "Policy Term & Paying Term"}</FormLabel>
                      <Select onValueChange={(val) => field.onChange(Number(val))} defaultValue={String(field.value)}>
                        <FormControl>
                          <SelectTrigger className="font-semibold">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="16">16 Years Policy (Pay for 10 Yrs - Save 6 Yrs)</SelectItem>
                          <SelectItem value="21">21 Years Policy (Pay for 15 Yrs - Save 6 Yrs)</SelectItem>
                          <SelectItem value="25">25 Years Policy (Pay for 16 Yrs - Save 9 Yrs)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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

              {/* Quick Sum Assured Presets */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-semibold text-slate-500">Quick Select SA:</span>
                {[500000, 1000000, 2500000, 5000000, 10000000].map((sa) => (
                  <button
                    key={sa}
                    type="button"
                    onClick={() => {
                      form.setValue('sumAssured', sa);
                      handleSubmit({ ...form.getValues(), sumAssured: sa });
                    }}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                      form.watch('sumAssured') === sa
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {sa >= 10000000 ? `₹${sa / 10000000} Cr` : `₹${sa / 100000} Lakh`}
                  </button>
                ))}
              </div>

              {/* Optional Riders */}
              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Optional Policy Riders
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
                            Accidental Death & Disability Rider
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
                            Premium Waiver Benefit (PWB) Rider
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
                disabled={isLoading}
                className="w-full sm:w-auto h-11 text-base font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Calculating Jeevan Labh Returns...
                  </>
                ) : (
                  dictionary.calculate_button || "Calculate Benefits & PPT Schedule"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <Card className="shadow-xl border-slate-200 dark:border-slate-800">
          <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-t-xl p-4 sm:p-6">
            <CardTitle className="text-lg md:text-2xl flex items-center justify-between gap-2">
              <span>Maturity Benefit & Outflow Breakdown</span>
              <span className="text-xs bg-emerald-800/60 px-2.5 py-1 rounded-full text-emerald-100 font-normal">
                Sec 10(10D) Tax-Free
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3.5 sm:p-6 space-y-6">
            {/* Visual Limited PPT Payment Timeline Card */}
            <div className="rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 p-4 sm:p-5 text-white shadow-lg">
              <div className="flex items-center gap-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-400">
                <Clock className="h-4 w-4 shrink-0" /> Limited Premium Paying Advantage
              </div>
              <h4 className="mt-1 text-base sm:text-lg font-bold">
                Pay for <span className="text-emerald-400">{result.ppt} Years</span> — Enjoy Coverage for <span className="text-emerald-400">{values.term} Years</span>!
              </h4>
              <p className="mt-1 text-xs text-slate-300">
                You save paying premiums for <strong>{result.freeYears} whole years</strong> while LIC continues adding bonuses to your account.
              </p>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-lg bg-slate-800/80 p-3 border border-slate-700">
                  <span className="text-[11px] text-slate-400 block">Active Payment Window</span>
                  <span className="text-sm sm:text-base font-bold text-white">Year 1 to Year {result.ppt}</span>
                </div>
                <div className="rounded-lg bg-slate-800/80 p-3 border border-slate-700">
                  <span className="text-[11px] text-slate-400 block">Zero Premium Growth Window</span>
                  <span className="text-sm sm:text-base font-bold text-emerald-400">Year {result.ppt + 1} to Year {values.term}</span>
                </div>
                <div className="rounded-lg bg-slate-800/80 p-3 border border-slate-700">
                  <span className="text-[11px] text-slate-400 block">Tax-Free Maturity Payout</span>
                  <span className="text-sm sm:text-base font-bold text-cyan-300">End of Year {values.term}</span>
                </div>
              </div>
            </div>

            {/* Premium Schedule Tables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 sm:p-4">
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white mb-3">
                  First Year Premium (4.5% GST Included)
                </h4>
                <div className="overflow-x-auto -mx-1 px-1 sm:mx-0 sm:px-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Mode</TableHead>
                        <TableHead className="text-xs text-right">Base</TableHead>
                        <TableHead className="text-xs text-right">GST</TableHead>
                        <TableHead className="text-xs text-right font-bold">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.firstYear.map((item) => (
                        <TableRow key={item.mode}>
                          <TableCell className="text-xs font-medium">{item.mode}</TableCell>
                          <TableCell className="text-xs text-right">{formatCurrency(item.premium)}</TableCell>
                          <TableCell className="text-xs text-right text-slate-500">{formatCurrency(item.gst)}</TableCell>
                          <TableCell className="text-xs text-right font-bold text-emerald-600">{formatCurrency(item.total)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 sm:p-4">
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white mb-3">
                  2nd Year Onward Renewal Premium (2.25% GST Included)
                </h4>
                <div className="overflow-x-auto -mx-1 px-1 sm:mx-0 sm:px-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Mode</TableHead>
                        <TableHead className="text-xs text-right">Base</TableHead>
                        <TableHead className="text-xs text-right">GST</TableHead>
                        <TableHead className="text-xs text-right font-bold">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.secondYear.map((item) => (
                        <TableRow key={item.mode}>
                          <TableCell className="text-xs font-medium">{item.mode}</TableCell>
                          <TableCell className="text-xs text-right">{formatCurrency(item.premium)}</TableCell>
                          <TableCell className="text-xs text-right text-slate-500">{formatCurrency(item.gst)}</TableCell>
                          <TableCell className="text-xs text-right font-bold text-emerald-600">{formatCurrency(item.total)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            {/* Actuarial Maturity Breakdown */}
            <div className="rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 sm:p-5">
              <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mb-3 sm:mb-4">
                Granular Maturity Breakdown (Sec 10(10D) Tax-Free)
              </h4>
              <div className="overflow-x-auto -mx-1 px-1 sm:mx-0 sm:px-0">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium text-xs md:text-sm">Basic Sum Assured (A)</TableCell>
                      <TableCell className="text-right font-semibold text-xs md:text-sm">{formatCurrency(result.maturity.sumAssured)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-xs md:text-sm">Simple Reversionary Bonus (SRB) (B)</TableCell>
                      <TableCell className="text-right font-semibold text-xs md:text-sm">{formatCurrency(result.maturity.bonus)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-xs md:text-sm">Final Additional Bonus (FAB) (C)</TableCell>
                      <TableCell className="text-right font-semibold text-xs md:text-sm">{formatCurrency(result.maturity.fab)}</TableCell>
                    </TableRow>
                    <TableRow className="bg-emerald-100 dark:bg-emerald-900/50 font-bold">
                      <TableCell className="text-emerald-900 dark:text-emerald-100 text-xs sm:text-sm md:text-base">
                        Total Tax-Free Maturity Payout (A + B + C)
                      </TableCell>
                      <TableCell className="text-right text-emerald-700 dark:text-emerald-300 text-sm sm:text-base md:text-xl">
                        {formatCurrency(result.maturity.total)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-xs text-slate-500">Total Out-of-Pocket Premium Invested ({result.ppt} Yrs)</TableCell>
                      <TableCell className="text-right text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {formatCurrency(result.totalPremiumPaid)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Financial Recharts Breakdown */}
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white mb-3">
                Investment Outflow vs. Maturity Returns
              </h4>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={result.chartData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(value) => (value / 100000).toFixed(1) + 'L'} tick={{ fontSize: 11 }} />
                  <RechartsTooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="Total Premium Paid" fill="#ef4444" />
                  <Bar dataKey="Sum Assured" fill="#059669" />
                  <Bar dataKey="Simple Reversionary Bonus" fill="#0d9488" />
                  <Bar dataKey="Final Additional Bonus (FAB)" fill="#0284c7" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2.5 sm:gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs" onClick={() => handleShare('whatsapp')}>
                <WhatsAppIcon className="mr-2 h-4 w-4 shrink-0" /> Share on WhatsApp
              </Button>
              <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs" onClick={() => handleShare('twitter')}>
                <Twitter className="mr-2 h-4 w-4 shrink-0" /> Share on X
              </Button>
              <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4 shrink-0" /> Print PDF Report
              </Button>
              <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs" onClick={handleCSVExport}>
                <Download className="mr-2 h-4 w-4 shrink-0" /> Export CSV Summary
              </Button>
            </div>

            <p className="text-[11px] text-center text-slate-500 dark:text-slate-400 italic">
              {dictionary.results?.note || "Disclaimer: Projections include GST. Bonus rates are illustrative based on recent LIC declarations."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
