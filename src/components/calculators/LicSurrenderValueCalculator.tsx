
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertTriangle, CalculatorIcon, Download, Printer, Twitter, Link as LinkIcon, Mail } from 'lucide-react';
import { useLicSurrenderCalculator } from '@/hooks/use-lic-surrender-calculator';
import type { LicSurrenderFormValues } from '@/hooks/use-lic-surrender-calculator';
import { useToast } from '@/hooks/use-toast';
import { licPlans } from '@/data/lic-plans';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52s-.669-1.611-.916-2.207c-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
);

const formSchema = z.object({
  plan: z.string().min(1, "Please select a plan"),
  basicSumAssured: z.coerce.number().min(50000, "Sum Assured must be at least 50,000"),
  policyTerm: z.coerce.number().min(10, "Policy term must be at least 10 years"),
  premiumsPaid: z.coerce.number().min(2, "At least 2 full years of premiums required"),
  totalPremiumsPayable: z.coerce.number().min(5, "Total payable premiums must be at least 5"),
  vestedBonus: z.coerce.number().min(0).default(0),
  loanPrincipal: z.coerce.number().min(0).default(0),
});

export function LicSurrenderValueCalculator({ dictionary }: { dictionary: any }) {
  const { result, isLoading, error, performCalculation } = useLicSurrenderCalculator();
  const { toast } = useToast();
  const toolDict = dictionary.tool;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plan: '715',
      basicSumAssured: 1000000,
      policyTerm: 20,
      premiumsPaid: 5,
      totalPremiumsPayable: 20,
      vestedBonus: 50000,
      loanPrincipal: 0,
    },
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    performCalculation(values as LicSurrenderFormValues);
  }

  const formatCurrency = (value: number) => value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const handlePrint = () => window.print();

  const handleShare = (platform: 'whatsapp' | 'twitter') => {
    if (!result) return;
    const url = window.location.href;
    const text = toolDict.share_text.replace('{payout}', formatCurrency(result.netPayout));
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
        [toolDict.csv.policy_year, result.policyYearCompleted],
        [toolDict.csv.paid_up_sa, formatCurrency(result.paidUpSumAssured)],
        [toolDict.csv.gsv_premium, formatCurrency(result.gsv.premiumComponent)],
        [toolDict.csv.gsv_bonus, formatCurrency(result.gsv.bonusComponent)],
        [toolDict.csv.gsv_total, formatCurrency(result.gsv.total)],
        [toolDict.csv.ssv_estimated, formatCurrency(result.ssv)],
        [toolDict.csv.gross_surrender, formatCurrency(result.grossSurrenderValue)],
        [toolDict.csv.loan_principal, formatCurrency(result.loanAdjustments.principal)],
        [toolDict.csv.net_payout, formatCurrency(result.netPayout)],
    ];
    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
        csvContent += row.join(',') + '\n';
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'lic_surrender_value_summary.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <CalculatorIcon className="h-6 w-6 text-primary" />
            {toolDict.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <FormField control={form.control} name="plan" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{toolDict.plan_label}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an LIC Plan" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {licPlans.map((group) => (
                                    <SelectGroup key={group.label}>
                                        <h3 className="pl-8 pr-2 py-1.5 text-sm font-semibold text-muted-foreground">{group.label}</h3>
                                        {group.plans.map(plan => (
                                            <SelectItem key={plan.value} value={plan.value}>{plan.label}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                ))}
                            </SelectContent>
                        </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                <FormField control={form.control} name="basicSumAssured" render={({ field }) => (<FormItem><FormLabel>{toolDict.basic_sa_label}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="policyTerm" render={({ field }) => (<FormItem><FormLabel>{toolDict.policy_term_label}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="premiumsPaid" render={({ field }) => (<FormItem><FormLabel>{toolDict.premiums_paid_label}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="totalPremiumsPayable" render={({ field }) => (<FormItem><FormLabel>{toolDict.total_premiums_payable_label}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="vestedBonus" render={({ field }) => (<FormItem><FormLabel>{toolDict.vested_bonus_label}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="loanPrincipal" render={({ field }) => (<FormItem><FormLabel>{toolDict.loan_principal_label}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {toolDict.calculating}</> : toolDict.calculate_button}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && <div className="text-center py-12"><Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" /></div>}

      {error && <Alert variant="destructive" className="mt-8"><AlertTriangle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}

      {result && (
        <Card className="mt-8 animate-in fade-in-50">
          <CardHeader>
            <CardTitle>{toolDict.results_title}</CardTitle>
            <Alert variant="destructive" className="mt-2">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>{dictionary.sections.find((s: any) => s.id === 'what-is-surrender-value')?.content[0].title || 'A Word of Caution'}</AlertTitle>
                <AlertDescription>{dictionary.sections.find((s: any) => s.id === 'what-is-surrender-value')?.content[0].body || 'Surrendering a policy almost always means taking a financial hit.'}</AlertDescription>
            </Alert>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
              <div className="border p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground">{toolDict.gsv_label}</p>
                <p className="text-2xl font-bold">{formatCurrency(result.gsv.total)}</p>
                <p className="text-xs text-muted-foreground mt-1">({formatCurrency(result.gsv.premiumComponent)} from premiums + {formatCurrency(result.gsv.bonusComponent)} from bonuses)</p>
              </div>
              <div className="border p-4 rounded-lg bg-primary/10">
                <p className="text-sm text-muted-foreground">{toolDict.ssv_label}</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(result.ssv)}</p>
              </div>
            </div>
            
            <div className="text-center border-t pt-4">
                <p className="text-md text-muted-foreground">{toolDict.net_payout_label}</p>
                <p className="text-4xl font-bold text-green-600">{formatCurrency(result.netPayout)}</p>
                <p className="text-xs text-muted-foreground">({formatCurrency(result.grossSurrenderValue)} Gross Value - {formatCurrency(result.loanAdjustments.principal)} Loan)</p>
            </div>

             <div className="text-sm text-muted-foreground text-center">
                <p><strong>{toolDict.paid_up_sa_label}:</strong> {formatCurrency(result.paidUpSumAssured)}</p>
                <p><strong>{toolDict.policy_year_label}:</strong> {result.policyYearCompleted}</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
                <Button variant="outline" size="sm" onClick={() => handleShare('whatsapp')}><WhatsAppIcon className="mr-2 h-4 w-4" /> WhatsApp</Button>
                <Button variant="outline" size="sm" onClick={() => handleShare('twitter')}><Twitter className="mr-2 h-4 w-4" /> Twitter</Button>
                <Button variant="outline" size="sm" onClick={handleCopyLink}><LinkIcon className="mr-2 h-4 w-4" /> {toolDict.copy_link_cta}</Button>
                <Button variant="outline" size="sm" onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> {toolDict.print_cta}</Button>
                <Button variant="outline" size="sm" onClick={handleCSVExport}><Download className="mr-2 h-4 w-4" /> {toolDict.export_csv_cta}</Button>
                <Button variant="outline" size="sm" onClick={() => window.location.href='mailto:'}><Mail className="mr-2 h-4 w-4" /> {toolDict.email_cta}</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
