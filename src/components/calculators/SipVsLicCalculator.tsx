"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calculator, AlertCircle, TrendingUp, ShieldCheck, ArrowRightLeft } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

// Formula for SIP maturity (Future Value of Annuity)
const calculateSipMaturity = (monthlyInvestment: number, tenureYears: number, annualReturnRate: number) => {
  const months = tenureYears * 12;
  const monthlyRate = annualReturnRate / 100 / 12;
  return monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
};

// Simplified formula for LIC maturity approximation
const calculateLicMaturity = (monthlyInvestment: number, tenureYears: number, annualReturnRate: number) => {
  const annualPremium = monthlyInvestment * 12;
  let fv = 0;
  for (let i = 1; i <= tenureYears; i++) {
    fv += annualPremium * Math.pow(1 + (annualReturnRate / 100), i);
  }
  return fv;
};

export function SipVsLicCalculator({ dictionary }: { dictionary?: any }) {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(5000);
  const [tenure, setTenure] = useState<number>(20);
  const [sipReturn, setSipReturn] = useState<number>(12);
  const [licReturn, setLicReturn] = useState<number>(9.5);
  
  const [results, setResults] = useState<{ sipMaturity: number, licMaturity: number, difference: number } | null>(null);

  const handleCalculate = () => {
    const sipMaturity = calculateSipMaturity(monthlyInvestment, tenure, sipReturn);
    const licMaturity = calculateLicMaturity(monthlyInvestment, tenure, licReturn);
    
    setResults({
      sipMaturity,
      licMaturity,
      difference: sipMaturity - licMaturity
    });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-primary/20">
        <CardHeader className="bg-primary/5 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-6 w-6 text-primary" />
            {dictionary?.title || "SIP vs LIC Return Calculator"}
          </CardTitle>
          <CardDescription>
            {dictionary?.description || "Compare estimated returns from an Equity SIP vs an LIC Endowment."}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="monthly-inv">{dictionary?.monthly_investment_label || "Monthly Investment (₹)"}</Label>
              <Input
                id="monthly-inv"
                type="number"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                min={500}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tenure">{dictionary?.tenure_label || "Investment Tenure (Years)"}</Label>
              <Input
                id="tenure"
                type="number"
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                min={5}
                max={40}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sip-return">{dictionary?.sip_return_label || "Expected SIP Return (% p.a.)"}</Label>
              <Input
                id="sip-return"
                type="number"
                value={sipReturn}
                onChange={(e) => setSipReturn(Number(e.target.value))}
                step={0.1}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lic-return">{dictionary?.lic_return_label || "Expected LIC Return (% p.a.)"}</Label>
              <Input
                id="lic-return"
                type="number"
                value={licReturn}
                onChange={(e) => setLicReturn(Number(e.target.value))}
                step={0.1}
              />
            </div>
          </div>
          
          <div className="mt-8">
            <Button onClick={handleCalculate} className="w-full text-lg py-6" size="lg">
              {dictionary?.calculate_button || "Compare SIP vs LIC"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {results && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in zoom-in duration-500">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                {dictionary?.sip_maturity_title || "Estimated SIP Maturity"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                {formatCurrency(results.sipMaturity)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Pre-tax (Market linked)</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                {dictionary?.lic_maturity_title || "Estimated LIC Maturity"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                {formatCurrency(results.licMaturity)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Tax-free under Sec 10(10D)</p>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 border-primary/20 shadow-md">
             <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-center gap-2">
                <ArrowRightLeft className="h-5 w-5 text-primary" />
                {dictionary?.difference_title || "Wealth Difference"}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(results.difference)}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Extra wealth generated by the SIP over {tenure} years.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
      
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Disclaimer</AlertTitle>
        <AlertDescription>
          These are estimated future values based on assumed constant returns. Actual market returns for SIPs and declared bonuses for LIC will vary. LIC maturity is a rough approximation based on an expected yield rate.
        </AlertDescription>
      </Alert>
    </div>
  );
}
