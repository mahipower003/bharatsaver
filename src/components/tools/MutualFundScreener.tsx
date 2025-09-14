
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFundData } from '@/hooks/use-fund-data';
import type { RawFund } from '@/lib/overlap-calculator';
import { Loader2, Info } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const formatCurrency = (value: number) => `₹${(value / 1000000000).toFixed(0)}k Cr`;
const formatPercent = (value: number) => `${value.toFixed(2)}%`;

export function MutualFundScreenerTool() {
  const { allFunds, isLoading: isDataLoading, error } = useFundData();
  const { toast } = useToast();

  const [filters, setFilters] = useState({
    category: 'all',
    expenseRatio: [0, 3], // min, max
    aum: [0, 200000], // in crores
  });

  const [selectedFunds, setSelectedFunds] = useState<RawFund[]>([]);

  const uniqueCategories = useMemo(() => {
    if (isDataLoading) return [];
    const categories = new Set(allFunds.map(fund => fund.fund_name.includes('Large') ? 'Large Cap' : fund.fund_name.includes('Mid') ? 'Mid Cap' : fund.fund_name.includes('Small') ? 'Small Cap' : fund.fund_name.includes('ELSS') ? 'ELSS' : 'Other'));
    return ['all', ...Array.from(categories)];
  }, [allFunds, isDataLoading]);

  const filteredFunds = useMemo(() => {
    return allFunds.filter(fund => {
      const fundAUM = (fund.constituents?.reduce((acc, c) => acc + parseWeight(c.weight_pct), 0) ?? 0) * (fund.aum ?? 0) / 100 / 10000000; // in crores
      const fundExpense = 0.5; // Placeholder for actual expense ratio data

      const categoryMatch = filters.category === 'all' || 
        (filters.category === 'Large Cap' && fund.fund_name.includes('Large')) ||
        (filters.category === 'Mid Cap' && fund.fund_name.includes('Mid')) ||
        (filters.category === 'Small Cap' && fund.fund_name.includes('Small')) ||
        (filters.category === 'ELSS' && fund.fund_name.includes('ELSS'));

      const expenseMatch = fundExpense >= filters.expenseRatio[0] && fundExpense <= filters.expenseRatio[1];
      const aumMatch = fundAUM >= filters.aum[0] && fundAUM <= filters.aum[1];

      return categoryMatch && expenseMatch && aumMatch;
    });
  }, [allFunds, filters]);

  const handleSelectFund = (fund: RawFund, isSelected: boolean) => {
    if (isSelected) {
      if (selectedFunds.length >= 3) {
        toast({
          variant: "destructive",
          title: "Selection Limit Reached",
          description: "You can only compare up to 3 funds at a time.",
        });
        return;
      }
      setSelectedFunds(prev => [...prev, fund]);
    } else {
      setSelectedFunds(prev => prev.filter(f => f.fund_name !== fund.fund_name));
    }
  };
  
  const applyPreset = (preset: 'large_cap' | 'elss' | 'low_cost') => {
    if (preset === 'large_cap') {
      setFilters({ category: 'Large Cap', expenseRatio: [0, 1.2], aum: [20000, 200000] });
    } else if (preset === 'elss') {
      setFilters({ category: 'ELSS', expenseRatio: [0, 1.5], aum: [5000, 200000] });
    } else if (preset === 'low_cost') {
      setFilters({ category: 'all', expenseRatio: [0, 0.5], aum: [1000, 200000] });
    }
  };

  if (isDataLoading) {
    return <div className="text-center py-12"><Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" /> <p className="mt-2 text-muted-foreground">Loading fund data...</p></div>;
  }

  if (error) {
    return <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>;
  }

  return (
    <Card className="shadow-lg animate-in fade-in-50">
      <CardHeader>
        <CardTitle>Interactive Mutual Fund Screener</CardTitle>
        <CardDescription>
          Use the filters below to find funds that match your investment criteria. Select up to 3 funds to compare.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-6">
          <Button variant="outline" size="sm" onClick={() => applyPreset('large_cap')}>Best Large-Cap</Button>
          <Button variant="outline" size="sm" onClick={() => applyPreset('elss')}>Top ELSS (Tax Saver)</Button>
          <Button variant="outline" size="sm" onClick={() => applyPreset('low_cost')}>Low-Cost Index</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 border rounded-lg bg-muted/20">
          <div>
            <label className="text-sm font-medium">Fund Category</label>
            <Select value={filters.category} onValueChange={(value) => setFilters(f => ({ ...f, category: value }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {uniqueCategories.map(cat => <SelectItem key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Expense Ratio: {filters.expenseRatio[0]}% - {filters.expenseRatio[1]}%</label>
            <Slider
              min={0} max={3} step={0.1}
              value={filters.expenseRatio}
              onValueChange={(value) => setFilters(f => ({ ...f, expenseRatio: value }))}
            />
          </div>
          <div>
            <label className="text-sm font-medium">AUM (in Crores): ₹{filters.aum[0]} - ₹{filters.aum[1]}</label>
             <Slider
              min={0} max={200000} step={1000}
              value={filters.aum}
              onValueChange={(value) => setFilters(f => ({ ...f, aum: value }))}
            />
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-muted-foreground">Showing {filteredFunds.length} of {allFunds.length} funds.</p>
            <Button disabled={selectedFunds.length < 2}>Compare {selectedFunds.length} Funds</Button>
          </div>
          <div className="overflow-x-auto border rounded-md max-h-[600px]">
            <Table>
              <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                  <TableHead className="w-10"></TableHead>
                  <TableHead>Fund Name</TableHead>
                  <TableHead className="text-right">1Y Return</TableHead>
                  <TableHead className="text-right">3Y Return</TableHead>
                  <TableHead className="text-right">Expense Ratio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFunds.slice(0, 100).map(fund => (
                  <TableRow key={fund.fund_name}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedFunds.some(f => f.fund_name === fund.fund_name)}
                        onCheckedChange={(checked) => handleSelectFund(fund, !!checked)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{fund.fund_name}</TableCell>
                    <TableCell className="text-right text-green-600">15.2%</TableCell>
                    <TableCell className="text-right text-green-600">12.8%</TableCell>
                    <TableCell className="text-right">0.5%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
             {filteredFunds.length > 100 && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                <Info className="inline-block h-4 w-4 mr-1" />
                Showing first 100 results. Please refine your filters to see more.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to parse weight which can be string, number, or null
function parseWeight(w?: number | string | null): number {
  if (w === null || w === undefined) return 0;
  if (typeof w === 'number') return Number(w);
  const s = String(w).trim().replace('%', '');
  if (s === '') return 0;
  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
}

    