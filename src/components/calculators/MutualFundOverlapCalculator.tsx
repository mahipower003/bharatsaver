
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Download, Copy, PlusCircle, Trash2, BarChart2, Check, ChevronsUpDown } from 'lucide-react';
import type { Dictionary } from '@/types';
import { funds as allFunds, type FundPortfolio } from '@/data/mutual-fund-holdings';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandDialog } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { DialogTitle } from '@radix-ui/react-dialog';


type Fund = FundPortfolio & {
  id: number;
};

type Holding = {
  name: string;
  weight: number;
  sector: string;
};

type OverlapResult = {
  weightedOverlap: number;
  topOverlapStocks: (Holding & { minWeight: number; perFund: number[] })[];
};

// **Corrected Overlap Calculation Logic**
const calculateOverlap = (funds: Fund[]): OverlapResult | null => {
  if (!funds || funds.length < 2) {
    return null;
  }

  const stockMap = new Map<string, number[]>();

  // 1. Build a map of all stocks and their weights in each fund
  funds.forEach((fund, fundIndex) => {
    if (!fund.holdings) return;
    fund.holdings.forEach(holding => {
      if (!stockMap.has(holding.name)) {
        stockMap.set(holding.name, Array(funds.length).fill(0));
      }
      stockMap.get(holding.name)![fundIndex] = holding.weight;
    });
  });

  const commonStocks: (Holding & { minWeight: number; perFund: number[] })[] = [];
  let totalWeightedOverlap = 0;

  // 2. Identify common stocks and calculate overlap
  stockMap.forEach((weights, stockName) => {
    const fundsWithStockCount = weights.filter(w => w > 0).length;
    
    // A stock is common if it appears in at least two funds
    if (fundsWithStockCount >= 2) {
      const nonZeroWeights = weights.filter(w => w > 0);
      const minWeight = Math.min(...nonZeroWeights);
      
      totalWeightedOverlap += minWeight;

      commonStocks.push({
        name: stockName,
        weight: 0, // This field is not used, but part of the type
        sector: 'N/A', // Sector data is not available in the provided schema
        minWeight,
        perFund: weights,
      });
    }
  });
  
  commonStocks.sort((a, b) => b.minWeight - a.minWeight);

  return {
    weightedOverlap: Number(totalWeightedOverlap.toFixed(2)),
    topOverlapStocks: commonStocks,
  };
};

const getDefaultFunds = (): Fund[] => {
    if (!allFunds || allFunds.length < 2) return [];
    const initialFundsData = allFunds.slice(0, 2);
    return initialFundsData.map((f, i) => ({
      ...f,
      id: i + 1,
    }));
};


export function MutualFundOverlapCalculator({ dictionary }: { dictionary: Dictionary['mutual_fund_overlap_calculator'] }) {
  const [funds, setFunds] = useState<Fund[]>(getDefaultFunds);
  const [overlapResult, setOverlapResult] = useState<OverlapResult | null>(null);
    
  // **Corrected useEffect for Initial Load and Updates**
  useEffect(() => {
    const result = calculateOverlap(funds);
    setOverlapResult(result);
  }, [funds]);

  const exportCSV = () => {
    if (!overlapResult) return;
    const headers = ["Stock Name", ...funds.map((f) => `"${f.schemeName.replace(/"/g, '""')}"`), "MinWeight"];
    const rows = overlapResult.topOverlapStocks.map(r => 
        [`"${r.name.replace(/"/g, '""')}"`, ...r.perFund.map((w) => w.toFixed(2)), r.minWeight.toFixed(4)].join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mutual_fund_overlap.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const copySummary = async () => {
    if (!overlapResult) return;
    let text = `Mutual Fund Overlap Summary\n`;
    text += `Weighted Overlap: ${overlapResult.weightedOverlap}%\n\n`;
    text += `Top 5 Overlapping Stocks:\n`;
    overlapResult.topOverlapStocks.slice(0, 5).forEach(s => {
      text += `- ${s.name}: ${s.minWeight.toFixed(2)}%\n`;
    });
    try {
        await navigator.clipboard.writeText(text);
        alert("Summary copied to clipboard!");
    } catch(err) {
        console.error("Failed to copy summary: ", err)
    }
  };

  const addFund = () => {
    if (funds.length >= 5) return;
    const nextId = (funds.length > 0 ? Math.max(...funds.map(f => f.id)) : 0) + 1;
    const nextFundData = allFunds.find(f => !funds.some(selected => selected.schemeCode === f.schemeCode));
    if (nextFundData) {
        setFunds(prev => [...prev, { 
            ...nextFundData,
            id: nextId, 
        }]);
    }
  };

  const removeFund = (idToRemove: number) => {
    if (funds.length <= 2) return;
    setFunds(prev => prev.filter((f) => f.id !== idToRemove));
  };
  
  const updateFundSelection = (fundId: number, schemeCode: string) => {
    const selectedFundData = allFunds.find(f => f.schemeCode === schemeCode);
    if (!selectedFundData) return;

    setFunds(prev => prev.map(f => 
      f.id === fundId 
      ? {
        ...f,
        ...selectedFundData
      } 
      : f
    ));
  };

  const getOverlapLevel = (overlap: number) => {
    if (overlap > 50) return { label: 'Very High', color: 'text-destructive' };
    if (overlap > 30) return { label: 'High', color: 'text-orange-500' };
    if (overlap > 15) return { label: 'Moderate', color: 'text-yellow-500' };
    return { label: 'Low', color: 'text-green-500' };
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {funds.map((fund) => (
          <Card key={fund.id} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between bg-muted/50 p-4">
               <FundSelector
                allFunds={allFunds}
                selectedFund={fund}
                onSelect={(schemeCode) => updateFundSelection(fund.id, schemeCode)}
              />
              <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground" onClick={() => removeFund(fund.id)} disabled={funds.length <= 2}>
                <Trash2 className="h-4 w-4"/>
              </Button>
            </CardHeader>
            <CardContent className="p-4 text-sm text-muted-foreground">
              {fund.holdings && fund.holdings.length > 0 ? `${fund.holdings.length} holdings loaded.` : 'No holdings data found.'}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-start gap-4">
        <Button variant="outline" onClick={addFund} disabled={funds.length >= 5}>
          <PlusCircle className="mr-2" /> {dictionary.tool.add_fund}
        </Button>
      </div>

      {overlapResult && overlapResult.topOverlapStocks.length > 0 ? (
        <div className="space-y-6 animate-in fade-in-50">
            <Alert variant="default" className="text-center p-6">
                <BarChart2 className="h-6 w-6 mx-auto mb-2 text-primary"/>
                <AlertTitle className="text-base font-semibold mb-1">{dictionary.results.weighted_overlap_title}</AlertTitle>
                <AlertDescription className="text-3xl font-bold">
                    <span className={getOverlapLevel(overlapResult.weightedOverlap).color}>
                        {overlapResult.weightedOverlap}% ({getOverlapLevel(overlapResult.weightedOverlap).label})
                    </span>
                </AlertDescription>
            </Alert>
            
            <Card>
                <CardHeader>
                    <CardTitle>{dictionary.results.top_stocks_title}</CardTitle>
                    <CardDescription>Showing top 10 common stocks by overlap weight.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow>
                            <TableHead>{dictionary.results.stock_header}</TableHead>
                            {funds.map((f) => <TableHead key={f.id} className="text-right truncate max-w-[150px]">{f.schemeName}</TableHead>)}
                            <TableHead className="text-right font-bold">{dictionary.results.min_weight_header}</TableHead>
                        </TableRow></TableHeader>
                        <TableBody>
                            {overlapResult.topOverlapStocks.slice(0,10).map((stock) => (
                                <TableRow key={stock.name}>
                                    <TableCell className="font-medium">{stock.name}</TableCell>
                                    {stock.perFund.map((w, i) => <TableCell key={i} className="text-right">{w > 0 ? `${w.toFixed(2)}%` : '-'}</TableCell>)}
                                    <TableCell className="text-right font-bold">{stock.minWeight.toFixed(2)}%</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Button variant="outline" onClick={exportCSV}><Download className="mr-2"/>{dictionary.tool.export_csv}</Button>
              <Button variant="outline" onClick={copySummary}><Copy className="mr-2"/>{dictionary.tool.copy_summary}</Button>
          </div>
        </div>
      ) : (
         <Alert>
          <AlertTitle>No Overlap Found or Data Missing</AlertTitle>
          <AlertDescription>
            The selected funds do not have any common stocks, or the portfolio data could not be loaded. Please try selecting different funds.
          </AlertDescription>
        </Alert>
       )}
    </div>
  );
}

function FundSelector({ allFunds, selectedFund, onSelect }: { allFunds: FundPortfolio[], selectedFund: Fund, onSelect: (schemeCode: string) => void }) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className="w-[300px] justify-between"
        onClick={() => setOpen(true)}
      >
        <span className="truncate">{selectedFund.schemeName}</span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <DialogTitle className="sr-only">Select a fund to compare</DialogTitle>
        <Command>
          <CommandInput placeholder="Search for a fund..." />
          <CommandList>
          <CommandEmpty>No fund found.</CommandEmpty>
            <CommandGroup>
              {allFunds.map((fund) => (
                <CommandItem
                  key={fund.schemeCode}
                  value={fund.schemeName}
                  onSelect={() => {
                    onSelect(fund.schemeCode);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedFund.schemeCode === fund.schemeCode ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {fund.schemeName}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
