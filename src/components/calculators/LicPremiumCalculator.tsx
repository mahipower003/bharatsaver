
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Loader2, ShieldCheck, ArrowRight, Download, Printer, Twitter, 
  TrendingUp, BarChart2, Calculator, Info, Sparkles, CheckCircle2, 
  ExternalLink, Layers, DollarSign, Award, RefreshCw, FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useToast } from '@/hooks/use-toast';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52s-.669-1.611-.916-2.207c-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
);

const planOptions = [
  { id: 'jeevan-labh', name: 'LIC Jeevan Labh (Plan 936 / 736)', defaultTerm: 25, defaultPpt: 16, category: 'Endowment', bonusRate: 45, fabRate: 100, isTerm: false },
  { id: 'jeevan-anand', name: 'LIC New Jeevan Anand (Plan 915 / 715)', defaultTerm: 25, defaultPpt: 25, category: 'Endowment + Whole Life', bonusRate: 45, fabRate: 100, isTerm: false },
  { id: 'jeevan-umang', name: 'LIC Jeevan Umang (Plan 945 / 745)', defaultTerm: 100, defaultPpt: 15, category: 'Whole Life (8% Payout)', bonusRate: 50, fabRate: 110, isTerm: false },
  { id: 'jeevan-utsav', name: 'LIC Jeevan Utsav (Plan 871 / 883)', defaultTerm: 100, defaultPpt: 10, category: 'Whole Life Flexi', bonusRate: 40, fabRate: 90, isTerm: false },
  { id: 'jeevan-lakshya', name: 'LIC Jeevan Lakshya (Plan 933 / 733)', defaultTerm: 25, defaultPpt: 22, category: 'Child Education Benefit', bonusRate: 46, fabRate: 100, isTerm: false },
  { id: 'single-premium', name: 'LIC Single Premium Endowment (Plan 917 / 817)', defaultTerm: 20, defaultPpt: 1, category: 'Single Premium', bonusRate: 42, fabRate: 80, isTerm: false },
  { id: 'term-insurance', name: 'LIC Tech Term / Pure Term (Plan 954 / 854)', defaultTerm: 30, defaultPpt: 30, category: 'Pure Protection (0% GST)', bonusRate: 0, fabRate: 0, isTerm: true },
  { id: 'custom', name: 'Universal / Custom Plan', defaultTerm: 20, defaultPpt: 20, category: 'Custom Estimate', bonusRate: 45, fabRate: 100, isTerm: false },
];

const spokeLinks = [
  { slug: 'lic-jeevan-labh-calculator', name: 'Jeevan Labh (936 / 736)', tag: 'Limited Pay', desc: '16/21/25 yr term with short 10/15/16 pay terms' },
  { slug: 'lic-jeevan-anand-calculator', name: 'Jeevan Anand (915 / 715)', tag: 'Dual Benefit', desc: 'Maturity payout + lifelong natural death cover' },
  { slug: 'lic-jeevan-umang-calculator', name: 'Jeevan Umang (945 / 745)', tag: '8% Guaranteed', desc: '8% annual survival benefit post PPT until 100' },
  { slug: 'jeevan-utsav-calculator', name: 'Jeevan Utsav (871 / 883)', tag: '10% Flexi Income', desc: 'Guaranteed 10% annual income after PPT' },
  { slug: 'lic-jeevan-lakshya-calculator', name: 'Jeevan Lakshya (933 / 733)', tag: 'Child Plan', desc: '10% annual income + waived premiums on death' },
  { slug: 'lic-maturity-calculator', name: 'LIC Maturity Calculator', tag: 'Bonus Engine', desc: 'Project total SRB + FAB maturity values' },
  { slug: 'lic-surrender-value-calculator', name: 'Surrender Value Tool', tag: '2026 IRDAI', desc: 'Calculate GSV & SSV after 1 full year' },
  { slug: 'lic-vs-sip', name: 'LIC vs SIP Calculator', tag: 'Yield Analysis', desc: 'Compare 5.5% LIC IRR vs Mutual Fund SIPs' },
];

const formSchema = z.object({
  planId: z.string().min(1, 'Please select a plan'),
  age: z.coerce.number().min(8, 'Minimum age is 8').max(65, 'Maximum age is 65'),
  sumAssured: z.coerce.number().min(100000, 'Minimum Sum Assured is ₹1,00,000'),
  policyTerm: z.coerce.number().min(5, 'Min term 5 yrs').max(100, 'Max term 100 yrs'),
  ppt: z.coerce.number().min(1, 'Min PPT 1 yr').max(50, 'Max PPT 50 yrs'),
  addbRider: z.boolean().default(false),
  termRider: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

type CalculationResult = {
  planName: string;
  isTerm: boolean;
  age: number;
  policyTerm: number;
  ppt: number;
  sumAssured: number;
  baseYearlyPremium: number;
  riderPremium: number;
  totalYearlyPremium: number;
  modalBreakdown: { mode: string; premium: number; gst: number; total: number }[];
  totalPremiumPaid: number;
  maturity: {
    sumAssured: number;
    bonus: number;
    fab: number;
    total: number;
  };
  irr: number;
  sipComparison: {
    totalInvested: number;
    licMaturity: number;
    sipMaturity12Pct: number;
    sipDifference: number;
  };
  chartData: any[];
};

export function LicPremiumCalculator({ dictionary }: { dictionary: any }) {
  const router = useRouter();
  const pathname = usePathname();
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSipCompare, setShowSipCompare] = useState(false);
  const { toast } = useToast();

  const currentLang = pathname.split('/')[1] || 'en';

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      planId: 'jeevan-labh',
      age: 30,
      sumAssured: 1000000,
      policyTerm: 25,
      ppt: 16,
      addbRider: true,
      termRider: false,
    },
  });

  const selectedPlanId = form.watch('planId');

  useEffect(() => {
    const selected = planOptions.find(p => p.id === selectedPlanId);
    if (selected) {
      form.setValue('policyTerm', selected.defaultTerm);
      form.setValue('ppt', selected.defaultPpt);
    }
  }, [selectedPlanId, form]);

  // Pre-calculate default quote on mount so Googlebot and users see instant calculated DOM results
  useEffect(() => {
    handleSubmit(form.getValues());
    // eslint-disable-next-deps
  }, []);

  const handleQuickSumAssured = (val: number) => {
    form.setValue('sumAssured', val, { shouldValidate: true });
    handleSubmit({ ...form.getValues(), sumAssured: val });
  };

  async function handleSubmit(values: FormValues) {
    setIsLoading(true);
    const selectedPlan = planOptions.find(p => p.id === values.planId) || planOptions[0];

    // Base actuarial rate per 1000 SA estimation based on age & term
    let tabularRate = 35 + (values.age - 20) * 0.75 + (values.policyTerm < 20 ? 10 : 0);
    if (selectedPlan.isTerm) tabularRate = 8 + (values.age - 20) * 0.45;
    if (selectedPlan.id === 'single-premium') tabularRate = 720 - (values.policyTerm * 8);

    // High Sum Assured Rebate per 1000 SA
    let hsaRebate = 0;
    if (values.sumAssured >= 2500000) hsaRebate = 3.5;
    else if (values.sumAssured >= 1000000) hsaRebate = 2.0;
    else if (values.sumAssured >= 500000) hsaRebate = 1.25;

    const baseYearlyPremium = Math.max(0, ((values.sumAssured / 1000) * tabularRate) - (hsaRebate * (values.sumAssured / 1000)));

    let riderPremium = 0;
    if (values.addbRider && values.age >= 18) {
      riderPremium += (values.sumAssured / 1000) * 1.0;
    }
    if (values.termRider) {
      riderPremium += (values.sumAssured / 1000) * (1.5 + (values.age - 20) * 0.1);
    }

    const totalYearlyPremiumBase = baseYearlyPremium + riderPremium;

    // GST Rates: 0% GST Reform 2026 for pure term insurance! For traditional: 4.5% first year / 2.25% renewal
    const gstRate = selectedPlan.isTerm ? 0 : 0.045;

    const modes = [
      { mode: 'Yearly (2% Rebate)', factor: 1, modalRebate: 0.02 },
      { mode: 'Half-Yearly (1% Rebate)', factor: 0.5098, modalRebate: 0.01 },
      { mode: 'Quarterly', factor: 0.2575, modalRebate: 0 },
      { mode: 'Monthly (NACH)', factor: 0.0879, modalRebate: 0 },
    ];

    const modalBreakdown = modes.map(m => {
      const modalBase = (baseYearlyPremium * m.factor) * (1 - m.modalRebate);
      const modalRider = (riderPremium * m.factor);
      const subtotal = modalBase + modalRider;
      const gst = selectedPlan.isTerm ? 0 : (subtotal * gstRate);
      return {
        mode: m.mode,
        premium: subtotal,
        gst,
        total: subtotal + gst,
      };
    });

    const yearlyTotal = modalBreakdown[0].total;
    const totalPremiumPaid = selectedPlan.id === 'single-premium' ? yearlyTotal : yearlyTotal * values.ppt;

    // Maturity bonus logic
    let vestedBonus = 0;
    let finalAdditionalBonus = 0;
    if (!selectedPlan.isTerm) {
      const effectiveTermForBonus = selectedPlan.id === 'jeevan-umang' ? 30 : values.policyTerm;
      vestedBonus = (values.sumAssured / 1000) * selectedPlan.bonusRate * effectiveTermForBonus;
      finalAdditionalBonus = (values.sumAssured / 1000) * selectedPlan.fabRate;
    }

    const totalMaturity = selectedPlan.isTerm ? 0 : (values.sumAssured + vestedBonus + finalAdditionalBonus);

    // Approximate IRR computation for endowment
    const estimatedIrr = selectedPlan.isTerm ? 0 : 5.6;

    // SIP 12% CAGR projection comparison
    const annualInvestment = yearlyTotal;
    const sipYears = values.ppt;
    const sipRate = 0.12 / 12;
    const totalMonths = sipYears * 12;
    const monthlySIP = annualInvestment / 12;
    const sipMaturity12Pct = Math.round(monthlySIP * (((Math.pow(1 + sipRate, totalMonths) - 1) / sipRate) * (1 + sipRate)));

    const chartData = [
      { name: 'Total Premium Paid', amount: totalPremiumPaid },
      { name: 'Sum Assured', amount: values.sumAssured },
      { name: 'Total Bonus (SRB+FAB)', amount: vestedBonus + finalAdditionalBonus },
      { name: 'Total Maturity', amount: totalMaturity },
    ];

    setResult({
      planName: selectedPlan.name,
      isTerm: selectedPlan.isTerm,
      age: values.age,
      policyTerm: values.policyTerm,
      ppt: values.ppt,
      sumAssured: values.sumAssured,
      baseYearlyPremium,
      riderPremium,
      totalYearlyPremium: totalYearlyPremiumBase,
      modalBreakdown,
      totalPremiumPaid,
      maturity: {
        sumAssured: values.sumAssured,
        bonus: vestedBonus,
        fab: finalAdditionalBonus,
        total: totalMaturity,
      },
      irr: estimatedIrr,
      sipComparison: {
        totalInvested: totalPremiumPaid,
        licMaturity: totalMaturity,
        sipMaturity12Pct,
        sipDifference: Math.max(0, sipMaturity12Pct - totalMaturity),
      },
      chartData,
    });

    setIsLoading(false);
  }

  const formatCurrency = (val: number) => {
    return val.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
  };

  const handlePrint = () => window.print();

  const handleShare = (platform: 'whatsapp' | 'twitter') => {
    if (!result || typeof window === 'undefined') return;
    const url = window.location.href;
    const text = `I calculated my ${result.planName} premium on BharatSaver! Yearly Premium: ${formatCurrency(result.modalBreakdown[0].total)}, Maturity: ${formatCurrency(result.maturity.total)}. Check yours:`;
    const shareUrl = platform === 'twitter'
      ? `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`;
    window.open(shareUrl, '_blank');
  };

  const handleCSVExport = () => {
    if (!result) return;
    let csvContent = "Parameter,Value\n";
    csvContent += `Plan,${result.planName}\n`;
    csvContent += `Age,${result.age}\n`;
    csvContent += `Sum Assured,${result.sumAssured}\n`;
    csvContent += `Policy Term,${result.policyTerm}\n`;
    csvContent += `Premium Paying Term,${result.ppt}\n\n`;

    csvContent += "Payment Frequency Breakdown\n";
    csvContent += "Mode,Base Premium & Riders,GST,Total Payable\n";
    result.modalBreakdown.forEach(row => {
      csvContent += `${row.mode},${row.premium.toFixed(2)},${row.gst.toFixed(2)},${row.total.toFixed(2)}\n`;
    });
    csvContent += "\n";

    csvContent += "Maturity Projections\n";
    csvContent += `Sum Assured,${result.maturity.sumAssured}\n`;
    csvContent += `Accumulated SRB Bonus,${result.maturity.bonus}\n`;
    csvContent += `Final Additional Bonus (FAB),${result.maturity.fab}\n`;
    csvContent += `Total Estimated Maturity,${result.maturity.total}\n`;
    csvContent += `Total Premium Paid,${result.totalPremiumPaid}\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `lic_premium_summary_${result.planName.toLowerCase().replace(/[^a-z0-9]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 print-hide">
      {/* Dynamic Calculator Hero Card */}
      <Card className="border-2 border-primary/20 shadow-xl bg-gradient-to-b from-background to-muted/20">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <Calculator className="h-7 w-7" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">
                  {dictionary?.tool?.title || 'Universal LIC Premium & Maturity Calculator'}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground mt-0.5">
                  Calculate instant premiums, modal rebates, 0% GST (2026 rules) & bonus maturity payouts.
                </CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="self-start sm:self-center px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-medium">
              <Sparkles className="h-3.5 w-3.5 mr-1" /> 2026 GST 2.0 Compliant
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Select Plan */}
                <FormField
                  control={form.control}
                  name="planId"
                  render={({ field }) => (
                    <FormItem className="md:col-span-3">
                      <FormLabel className="font-semibold text-base">Select LIC Policy Plan</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11 text-base">
                            <SelectValue placeholder="Select an LIC Plan" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {planOptions.map(p => (
                            <SelectItem key={p.id} value={p.id} className="py-2.5">
                              <div className="flex items-center justify-between gap-4">
                                <span className="font-medium">{p.name}</span>
                                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{p.category}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Age */}
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Age of Policyholder</FormLabel>
                      <FormControl>
                        <Input type="number" min={8} max={65} {...field} className="h-10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Policy Term */}
                <FormField
                  control={form.control}
                  name="policyTerm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Policy Term (Years)</FormLabel>
                      <FormControl>
                        <Input type="number" min={5} max={100} {...field} className="h-10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Premium Paying Term (PPT) */}
                <FormField
                  control={form.control}
                  name="ppt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Pay Term / PPT (Years)</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} max={50} {...field} className="h-10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Sum Assured */}
                <FormField
                  control={form.control}
                  name="sumAssured"
                  render={({ field }) => (
                    <FormItem className="md:col-span-3">
                      <div className="flex justify-between items-center mb-1">
                        <FormLabel className="font-medium">Basic Sum Assured (Coverage Amount)</FormLabel>
                        <span className="text-xs font-semibold text-primary">{formatCurrency(field.value || 0)}</span>
                      </div>
                      <FormControl>
                        <Input type="number" step={50000} min={100000} {...field} className="h-11 text-base font-semibold" />
                      </FormControl>
                      {/* Quick Presets */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs text-muted-foreground self-center mr-1">Quick Select:</span>
                        {[500000, 1000000, 2500000, 5000000, 10000000].map(amt => (
                          <Button
                            key={amt}
                            type="button"
                            variant={field.value === amt ? "default" : "outline"}
                            size="sm"
                            className="h-7 text-xs px-2.5"
                            onClick={() => handleQuickSumAssured(amt)}
                          >
                            {amt >= 10000000 ? `₹${amt/10000000} Cr` : `₹${amt/100000} Lakh`}
                          </Button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Optional Riders */}
                <div className="md:col-span-3 space-y-3 pt-2 border-t">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Optional Riders & Add-ons</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="addbRider"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border p-3.5 bg-background">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="font-medium cursor-pointer">Accidental Death & Disability Benefit Rider</FormLabel>
                            <p className="text-xs text-muted-foreground">Approx. ₹1 per ₹1,000 SA per year</p>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="termRider"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border p-3.5 bg-background">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="font-medium cursor-pointer">Term Assurance Rider</FormLabel>
                            <p className="text-xs text-muted-foreground">Doubles life cover on natural death</p>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={isLoading} size="lg" className="w-full text-base font-semibold py-6 shadow-md">
                {isLoading ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Calculating Premium & Payouts...</>
                ) : (
                  <><Calculator className="mr-2 h-5 w-5" /> Calculate Premium & Maturity Payout</>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Calculation Results Card */}
      {result && (
        <Card className="border border-primary/30 shadow-2xl animate-in fade-in-50">
          <CardHeader className="bg-primary/5 border-b pb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Badge variant="outline" className="mb-1 text-xs border-primary/40 text-primary">Calculation Results</Badge>
                <CardTitle className="text-2xl font-bold text-primary">{result.planName}</CardTitle>
                <CardDescription>
                  Age {result.age} | Sum Assured {formatCurrency(result.sumAssured)} | Term {result.policyTerm} Yrs | Pay Term {result.ppt} Yrs
                </CardDescription>
              </div>

              <div className="flex flex-wrap gap-2 print-hide">
                <Button variant="outline" size="sm" onClick={() => handleShare('whatsapp')}>
                  <WhatsAppIcon className="mr-1.5 h-4 w-4 text-emerald-600" /> WhatsApp
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleShare('twitter')}>
                  <Twitter className="mr-1.5 h-4 w-4 text-sky-500" /> Share
                </Button>
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="mr-1.5 h-4 w-4" /> Print PDF
                </Button>
                <Button variant="outline" size="sm" onClick={handleCSVExport}>
                  <Download className="mr-1.5 h-4 w-4" /> Export CSV
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8 pt-6">
            {/* Key Summary Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border bg-card shadow-sm space-y-1">
                <p className="text-xs font-semibold text-muted-foreground">Yearly Premium (Year 1)</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(result.modalBreakdown[0].total)}</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Includes 2% Mode Rebate</p>
              </div>

              <div className="p-4 rounded-xl border bg-card shadow-sm space-y-1">
                <p className="text-xs font-semibold text-muted-foreground">Total Premium Paid</p>
                <p className="text-2xl font-bold">{formatCurrency(result.totalPremiumPaid)}</p>
                <p className="text-xs text-muted-foreground">Over {result.ppt} Pay Term</p>
              </div>

              <div className="p-4 rounded-xl border bg-card shadow-sm space-y-1">
                <p className="text-xs font-semibold text-muted-foreground">{result.isTerm ? 'Death Benefit' : 'Est. Total Maturity'}</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {result.isTerm ? formatCurrency(result.sumAssured) : formatCurrency(result.maturity.total)}
                </p>
                <p className="text-xs text-muted-foreground">{result.isTerm ? 'Guaranteed Cover' : 'Guaranteed SA + Bonuses'}</p>
              </div>

              <div className="p-4 rounded-xl border bg-card shadow-sm space-y-1">
                <p className="text-xs font-semibold text-muted-foreground">GST Tax Rate</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {result.isTerm ? '0% GST' : '4.5% / 2.25%'}
                </p>
                <p className="text-xs text-muted-foreground">{result.isTerm ? '2026 GST 2.0 Exempt' : 'Standard LIC GST'}</p>
              </div>
            </div>

            {/* Payment Frequency Breakdown Table */}
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2 mb-3">
                <Layers className="h-5 w-5 text-primary" /> Premium Payment Options (Frequency Breakdown)
              </h3>
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="font-semibold">Payment Mode</TableHead>
                      <TableHead className="text-right font-semibold">Base Premium & Riders</TableHead>
                      <TableHead className="text-right font-semibold">GST Tax Rate</TableHead>
                      <TableHead className="text-right font-semibold">Payable Installment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.modalBreakdown.map((row, idx) => (
                      <TableRow key={idx} className={idx === 0 ? "font-semibold bg-primary/5" : ""}>
                        <TableCell className="font-medium">{row.mode}</TableCell>
                        <TableCell className="text-right">{formatCurrency(row.premium)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(row.gst)}</TableCell>
                        <TableCell className="text-right text-base text-primary font-bold">{formatCurrency(row.total)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Maturity Breakdown (Non-Term) */}
            {!result.isTerm && (
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2 mb-3">
                  <Award className="h-5 w-5 text-primary" /> Projected Maturity Payout Breakdown
                </h3>
                <div className="overflow-x-auto rounded-lg border">
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Basic Sum Assured (Guaranteed)</TableCell>
                        <TableCell className="text-right font-semibold">{formatCurrency(result.maturity.sumAssured)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Simple Reversionary Bonus (SRB)</TableCell>
                        <TableCell className="text-right font-semibold text-emerald-600 dark:text-emerald-400">+{formatCurrency(result.maturity.bonus)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Final Additional Bonus (FAB)</TableCell>
                        <TableCell className="text-right font-semibold text-emerald-600 dark:text-emerald-400">+{formatCurrency(result.maturity.fab)}</TableCell>
                      </TableRow>
                      <TableRow className="bg-primary/10 text-base font-bold">
                        <TableCell>Total Estimated Maturity Payout</TableCell>
                        <TableCell className="text-right text-primary text-lg">{formatCurrency(result.maturity.total)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Interactive Chart */}
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2 mb-3">
                <BarChart2 className="h-5 w-5 text-primary" /> Visual Comparison: Investment vs Returns
              </h3>
              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={result.chartData} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(val) => `₹${(val/100000).toFixed(1)}L`} />
                    <RechartsTooltip formatter={(val: number) => formatCurrency(val)} />
                    <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* LIC vs SIP Mutual Fund Yield Toggle */}
            {!result.isTerm && (
              <div className="border rounded-xl p-5 bg-gradient-to-r from-muted/30 to-background space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-base flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-amber-500" /> Compare LIC Yield vs Equity Mutual Fund SIP
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      LIC policies provide 100% sovereign safety (Section 37). Equity SIPs carry market risk but higher historic returns.
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setShowSipCompare(!showSipCompare)}>
                    {showSipCompare ? 'Hide SIP Comparison' : 'Show SIP Comparison'}
                  </Button>
                </div>

                {showSipCompare && (
                  <div className="pt-3 border-t space-y-3 animate-in fade-in-50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div className="p-3 rounded-lg bg-card border">
                        <p className="text-xs text-muted-foreground">Total Paid</p>
                        <p className="text-lg font-bold">{formatCurrency(result.sipComparison.totalInvested)}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                        <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">LIC Maturity (~5.5% IRR)</p>
                        <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(result.sipComparison.licMaturity)}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-sky-500/10 border border-sky-500/30">
                        <p className="text-xs text-sky-700 dark:text-sky-400 font-semibold">Equity Mutual Fund SIP (12% CAGR)</p>
                        <p className="text-lg font-bold text-sky-600 dark:text-sky-400">{formatCurrency(result.sipComparison.sipMaturity12Pct)}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground italic text-center">
                      *Note: LIC maturity payouts are tax-free under Section 10(10D) with sovereign guarantee, whereas Equity Mutual Fund SIPs are subject to market risks and capital gains tax.
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Visual Spoke Hub Navigation Grid */}
      <Card className="shadow-lg border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" /> Dedicated LIC Policy Plan Calculators
              </CardTitle>
              <CardDescription>
                Select a specific LIC policy plan below for plan-specific actuarial rules, term tables, and custom payouts.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {spokeLinks.map((item, idx) => (
              <a
                key={idx}
                href={`/${currentLang}/${item.slug}`}
                className="group p-4 rounded-xl border bg-background hover:bg-primary/5 hover:border-primary/40 transition-all shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-[10px] font-semibold bg-primary/10 text-primary">
                      {item.tag}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="font-bold text-base group-hover:text-primary transition-colors">{item.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

