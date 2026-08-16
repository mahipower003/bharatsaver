'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apyPremiums } from "@/data/apy-chart";
import { Badge } from "@/components/ui/badge";

type ApyPremiumChartProps = {
  dictionary: any;
};

export function ApyPremiumChart({ dictionary }: ApyPremiumChartProps) {
  const [activeTab, setActiveTab] = useState<string>("all-pensions");

  const ages = Array.from({ length: 23 }, (_, i) => 18 + i); // 18 to 40
  const pensionAmounts = [1000, 2000, 3000, 4000, 5000];

  const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN')}`;

  return (
    <div className="space-y-4">
      <Tabs defaultValue="all-pensions" onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <TabsList className="grid grid-cols-3 w-full sm:w-auto h-auto p-1 bg-muted">
            <TabsTrigger value="all-pensions" className="text-xs sm:text-sm py-2">All Pension Tiers</TabsTrigger>
            <TabsTrigger value="pension-5000" className="text-xs sm:text-sm py-2">₹5,000 Pension Chart</TabsTrigger>
            <TabsTrigger value="pension-1000" className="text-xs sm:text-sm py-2">₹1,000 Pension Chart</TabsTrigger>
          </TabsList>
          <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 self-end sm:self-auto">
            <Badge variant="outline" className="text-[10px] uppercase tracking-wider border-emerald-500/30 text-emerald-600 dark:text-emerald-400">PFRDA Approved</Badge>
            Entry Age 18 – 40
          </span>
        </div>

        {/* Tab 1: All Pensions Matrix */}
        <TabsContent value="all-pensions" className="mt-0">
          <div className="rounded-xl border shadow-sm overflow-x-auto bg-card">
            <Table className="w-full text-xs sm:text-sm">
              <TableHeader className="bg-muted/60">
                <TableRow>
                  <TableHead className="font-bold text-foreground py-3">Entry Age</TableHead>
                  <TableHead className="font-bold text-foreground py-3 text-center">Duration (Yrs)</TableHead>
                  {pensionAmounts.map((amount) => (
                    <TableHead key={amount} className="font-bold text-foreground text-center py-3">
                      ₹{amount.toLocaleString('en-IN')} / mo
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {ages.map((age) => {
                  const data = apyPremiums[age];
                  const duration = 60 - age;
                  return (
                    <TableRow key={age} className="hover:bg-muted/40 transition-colors">
                      <TableCell className="font-semibold text-foreground py-2.5">
                        {age} {dictionary?.years_label || "Yrs"}
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground py-2.5">{duration} yrs</TableCell>
                      <TableCell className="text-center font-medium text-foreground py-2.5">{formatCurrency(data[1000])}</TableCell>
                      <TableCell className="text-center font-medium text-foreground py-2.5">{formatCurrency(data[2000])}</TableCell>
                      <TableCell className="text-center font-medium text-foreground py-2.5">{formatCurrency(data[3000])}</TableCell>
                      <TableCell className="text-center font-medium text-foreground py-2.5">{formatCurrency(data[4000])}</TableCell>
                      <TableCell className="text-center font-bold text-primary py-2.5">{formatCurrency(data[5000])}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Tab 2: Detailed ₹5,000 Pension Frequency Breakdown */}
        <TabsContent value="pension-5000" className="mt-0">
          <div className="rounded-xl border shadow-sm overflow-x-auto bg-card">
            <Table className="w-full text-xs sm:text-sm">
              <TableHeader className="bg-muted/60">
                <TableRow>
                  <TableHead className="font-bold text-foreground py-3">Entry Age</TableHead>
                  <TableHead className="font-bold text-foreground text-center py-3">Contribution Duration</TableHead>
                  <TableHead className="font-bold text-foreground text-center py-3">Monthly</TableHead>
                  <TableHead className="font-bold text-foreground text-center py-3">Quarterly</TableHead>
                  <TableHead className="font-bold text-foreground text-center py-3">Half-Yearly</TableHead>
                  <TableHead className="font-bold text-emerald-600 dark:text-emerald-400 text-center py-3">Nominee Corpus</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ages.map((age) => {
                  const m = apyPremiums[age][5000];
                  const q = Math.round(m * 3 * 0.995);
                  const h = Math.round(m * 6 * 0.99);
                  const duration = 60 - age;
                  return (
                    <TableRow key={age} className="hover:bg-muted/40 transition-colors">
                      <TableCell className="font-semibold text-foreground py-2.5">{age} Years</TableCell>
                      <TableCell className="text-center text-muted-foreground py-2.5">{duration} Years</TableCell>
                      <TableCell className="text-center font-bold text-primary py-2.5">{formatCurrency(m)}</TableCell>
                      <TableCell className="text-center font-medium py-2.5">{formatCurrency(q)}</TableCell>
                      <TableCell className="text-center font-medium py-2.5">{formatCurrency(h)}</TableCell>
                      <TableCell className="text-center font-bold text-emerald-600 dark:text-emerald-400 py-2.5">₹8,50,000</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Tab 3: Detailed ₹1,000 Pension Frequency Breakdown */}
        <TabsContent value="pension-1000" className="mt-0">
          <div className="rounded-xl border shadow-sm overflow-x-auto bg-card">
            <Table className="w-full text-xs sm:text-sm">
              <TableHeader className="bg-muted/60">
                <TableRow>
                  <TableHead className="font-bold text-foreground py-3">Entry Age</TableHead>
                  <TableHead className="font-bold text-foreground text-center py-3">Contribution Duration</TableHead>
                  <TableHead className="font-bold text-foreground text-center py-3">Monthly</TableHead>
                  <TableHead className="font-bold text-foreground text-center py-3">Quarterly</TableHead>
                  <TableHead className="font-bold text-foreground text-center py-3">Half-Yearly</TableHead>
                  <TableHead className="font-bold text-emerald-600 dark:text-emerald-400 text-center py-3">Nominee Corpus</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ages.map((age) => {
                  const m = apyPremiums[age][1000];
                  const q = Math.round(m * 3 * 0.995);
                  const h = Math.round(m * 6 * 0.99);
                  const duration = 60 - age;
                  return (
                    <TableRow key={age} className="hover:bg-muted/40 transition-colors">
                      <TableCell className="font-semibold text-foreground py-2.5">{age} Years</TableCell>
                      <TableCell className="text-center text-muted-foreground py-2.5">{duration} Years</TableCell>
                      <TableCell className="text-center font-bold text-primary py-2.5">{formatCurrency(m)}</TableCell>
                      <TableCell className="text-center font-medium py-2.5">{formatCurrency(q)}</TableCell>
                      <TableCell className="text-center font-medium py-2.5">{formatCurrency(h)}</TableCell>
                      <TableCell className="text-center font-bold text-emerald-600 dark:text-emerald-400 py-2.5">₹1,70,000</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
