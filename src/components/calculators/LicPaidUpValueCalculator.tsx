'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertTriangle, CalculatorIcon, Download, Printer, Twitter, Link as LinkIcon, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52s-.669-1.611-.916-2.207c-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
);

const formSchema = z.object({
  basicSumAssured: z.coerce.number().min(10000, "Sum Assured must be at least 10,000"),
  policyTerm: z.coerce.number().min(5, "Policy term must be at least 5 years"),
  premiumsPaid: z.coerce.number().min(2, "At least 2 years of premiums paid required"),
  totalPremiumsPayable: z.coerce.number().min(5, "Total PPT must be at least 5 years"),
  vestedBonus: z.coerce.number().min(0).default(0),
  annualPremium: z.coerce.number().min(100, "Annual premium must be at least 100"),
}).refine(data => data.premiumsPaid <= data.totalPremiumsPayable, {
  message: "Premiums paid cannot exceed total premiums payable",
  path: ["premiumsPaid"]
}).refine(data => data.totalPremiumsPayable <= data.policyTerm, {
  message: "Premium paying term cannot exceed policy term",
  path: ["totalPremiumsPayable"]
});

interface CalculatorResult {
  paidUpSumAssured: number;
  vestedBonus: number;
  totalMaturityValue: number;
  totalPremiumsPaid: number;
  estimatedSurrenderValue: number;
  surrenderLoss: number;
}

export function LicPaidUpValueCalculator({ dictionary }: { dictionary: any }) {
  const { toast } = useToast();
  const toolDict = dictionary.tool;
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      basicSumAssured: 500000,
      policyTerm: 20,
      premiumsPaid: 5,
      totalPremiumsPayable: 20,
      vestedBonus: 80000,
      annualPremium: 25000,
    },
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setTimeout(() => {
      const paidUpSumAssured = Math.round(
        values.basicSumAssured * (values.premiumsPaid / values.totalPremiumsPayable)
      );
      const totalMaturityValue = paidUpSumAssured + values.vestedBonus;
      const totalPremiumsPaid = values.annualPremium * values.premiumsPaid;

      // Special Surrender Value Factor estimation: typically 30% at 3 years to ~50% near maturity
      const termRatio = values.premiumsPaid / values.policyTerm;
      const ssvFactor = 0.3 + (termRatio * 0.2); // range from 30% to 50%
      const estimatedSurrenderValue = Math.round(totalMaturityValue * ssvFactor);
      const surrenderLoss = Math.max(0, totalPremiumsPaid - estimatedSurrenderValue);

      setResult({
        paidUpSumAssured,
        vestedBonus: values.vestedBonus,
        totalMaturityValue,
        totalPremiumsPaid,
        estimatedSurrenderValue,
        surrenderLoss,
      });
      setIsLoading(false);
    }, 400);
  }

  const formatCurrency = (value: number) =>
    value.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

  const handlePrint = () => window.print();

  const handleShare = (platform: 'whatsapp' | 'twitter') => {
    if (!result) return;
    const url = window.location.href;
    const text = toolDict.share_text.replace('{payout}', formatCurrency(result.paidUpSumAssured));
    const shareUrl = platform === 'twitter'
      ? `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`;
    window.open(shareUrl, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: toolDict.copy_success_title,
      description: toolDict.copy_success_description,
    });
  };

  const handleCSVExport = () => {
    if (!result) return;
    const headers = [toolDict.csv.parameter, toolDict.csv.value];
    const rows = [
      [toolDict.csv.paid_up_sa, formatCurrency(result.paidUpSumAssured)],
      [toolDict.csv.vested_bonus, formatCurrency(result.vestedBonus)],
      [toolDict.csv.total_paid_up, formatCurrency(result.totalMaturityValue)],
      [toolDict.csv.surrender_cash, formatCurrency(result.estimatedSurrenderValue)],
      [toolDict.csv.surrender_loss, formatCurrency(result.surrenderLoss)],
    ];
    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'lic_paid_up_value_summary.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Card className="shadow-lg border-primary/20">
        <CardHeader className="bg-primary/5">
          <CardTitle className="flex items-center gap-3 text-xl font-bold">
            <CalculatorIcon className="h-6 w-6 text-primary" />
            {toolDict.title}
          </CardTitle>
          <CardDescription>
            Find your reduced Sum Assured and frozen vested maturity value before talking to your LIC agent.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField control={form.control} name="basicSumAssured" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{toolDict.basic_sa_label}</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="policyTerm" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{toolDict.policy_term_label}</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="totalPremiumsPayable" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{toolDict.total_premiums_payable_label}</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="premiumsPaid" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{toolDict.premiums_paid_label}</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="annualPremium" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Premium Paid (₹)</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="vestedBonus" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{toolDict.vested_bonus_label}</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto font-semibold">
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {toolDict.calculating}</> : toolDict.calculate_button}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && <div className="text-center py-12"><Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" /></div>}

      {result && (
        <Card className="mt-8 animate-in fade-in-50 border-green-200">
          <CardHeader className="bg-green-500/5">
            <CardTitle className="text-green-800 dark:text-green-300 font-bold">{toolDict.results_title}</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="border p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground">{toolDict.paid_up_sa_label}</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(result.paidUpSumAssured)}</p>
                <p className="text-xs text-muted-foreground mt-1">Reduced Basic Sum Assured</p>
              </div>
              <div className="border p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground">{toolDict.vested_bonus_display}</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(result.vestedBonus)}</p>
                <p className="text-xs text-muted-foreground mt-1">Frozen Pre-Paid-Up Bonuses</p>
              </div>
              <div className="border p-4 rounded-lg bg-green-500/10 border-green-200">
                <p className="text-sm text-green-800 dark:text-green-200 font-medium">{toolDict.total_maturity_value_label}</p>
                <p className="text-3xl font-extrabold text-green-600">{formatCurrency(result.totalMaturityValue)}</p>
                <p className="text-xs text-green-700 mt-1 font-medium">Payout at Original Maturity</p>
              </div>
            </div>

            <div className="border-t pt-6 space-y-4">
              <h4 className="font-semibold text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Comparison: Paid-Up vs Surrendering Early
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
                <div className="border p-4 rounded-lg border-amber-200 bg-amber-50/50">
                  <p className="text-sm text-muted-foreground">{toolDict.surrender_estimate_label}</p>
                  <p className="text-2xl font-bold text-amber-600">{formatCurrency(result.estimatedSurrenderValue)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Immediate Cash Payout if Surrendered Today</p>
                </div>
                <div className="border p-4 rounded-lg border-destructive/20 bg-destructive/5">
                  <p className="text-sm text-muted-foreground">{toolDict.surrender_loss_label}</p>
                  <p className="text-2xl font-bold text-destructive">{formatCurrency(result.surrenderLoss)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Net loss from premiums paid (₹{formatCurrency(result.totalPremiumsPaid)})</p>
                </div>
              </div>
              <Alert variant="default" className="bg-primary/5 border-primary/20">
                <AlertTriangle className="h-4 w-4 text-primary" />
                <AlertTitle className="font-semibold">Professional Recommendation</AlertTitle>
                <AlertDescription className="text-sm text-muted-foreground mt-1">
                  Making the policy <strong>Paid-Up</strong> protects your maturity payout of <strong>{formatCurrency(result.totalMaturityValue)}</strong> and keeps your reduced life cover active. Surrendering today triggers a capital loss of <strong>{formatCurrency(result.surrenderLoss)}</strong> and kills your life insurance policy immediately.
                </AlertDescription>
              </Alert>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-4 border-t">
              <Button variant="outline" size="sm" onClick={() => handleShare('whatsapp')}><WhatsAppIcon className="mr-2 h-4 w-4" /> WhatsApp</Button>
              <Button variant="outline" size="sm" onClick={() => handleShare('twitter')}><Twitter className="mr-2 h-4 w-4" /> Twitter</Button>
              <Button variant="outline" size="sm" onClick={handleCopyLink}><LinkIcon className="mr-2 h-4 w-4" /> {toolDict.copy_link_cta}</Button>
              <Button variant="outline" size="sm" onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> {toolDict.print_cta}</Button>
              <Button variant="outline" size="sm" onClick={handleCSVExport}><Download className="mr-2 h-4 w-4" /> {toolDict.export_csv_cta}</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
