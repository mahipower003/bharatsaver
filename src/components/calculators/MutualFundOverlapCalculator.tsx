
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Download, Copy, PlusCircle, Trash2, BarChart2, Check, ChevronsUpDown } from 'lucide-react';
import type { Dictionary } from '@/types';
import { funds as allFunds, type FundPortfolio } from '@/data/mutual-fund-holdings';
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

type Fund = {
  id: number;
  name: string;
  holdings: Holding[];
  schemeCode: string;
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

const calculateOverlap = (funds: Fund[]): OverlapResult | null => {
  if (funds.length < 2 || funds.some(f => !f.holdings || f.holdings.length === 0)) return null;

  const allStockNames = new Set<string>();
  const fundWeightMaps = funds.map((f) => {
    const map = new Map<string, { weight: number; sector: string }>();
    f.holdings.forEach(h => {
        if (h.name && typeof h.weight === 'number') {
            map.set(h.name, { weight: h.weight, sector: h.sector || 'Unknown' });
            allStockNames.add(h.name);
        }
    });
    return map;
  });

  const stockRows: { name: string; perFund: number[]; minWeight: number; sector: string }[] = [];
  
  allStockNames.forEach(name => {
    const perFundWeights = fundWeightMaps.map(fwMap => fwMap.get(name)?.weight || 0);
    const fundsWithStock = perFundWeights.filter(w => w > 0);

    if (fundsWithStock.length > 1) {
      const minWeight = Math.min(...fundsWithStock);
      const firstFundWithStock = fundWeightMaps.find(fwMap => fwMap.has(name));
      const stockInfo = firstFundWithStock?.get(name);
      
      stockRows.push({
        name,
        perFund: perFundWeights,
        minWeight,
        sector: stockInfo?.sector || "Unknown",
      });
    }
  });
  
  const weightedOverlap = stockRows.reduce((sum, row) => sum + row.minWeight, 0);

  const topOverlapStocks = stockRows
    .sort((a, b) => b.minWeight - a.minWeight)
    .map((r) => ({ ...r, name: r.name, minWeight: r.minWeight, perFund: r.perFund, sector: r.sector } as any));

  return {
    weightedOverlap: Number(weightedOverlap.toFixed(2)),
    topOverlapStocks,
  };
};


export function MutualFundOverlapCalculator({ dictionary }: { dictionary: Dictionary['mutual_fund_overlap_calculator'] }) {
    const [funds, setFunds] = useState<Fund[]>(() => {
        const initialFunds = allFunds.slice(0, 2);
        return initialFunds.map((f, i) => ({
          id: i + 1,
          name: f.schemeName,
          holdings: f.holdings,
          schemeCode: f.schemeCode,
        }));
    });
    const [overlapResult, setOverlapResult] = useState<OverlapResult | null>(null);
    
    useEffect(() => {
        if (funds.length >= 2) {
            setOverlapResult(calculateOverlap(funds));
        } else {
            setOverlapResult(null);
        }
    }, [funds]);

  const exportCSV = () => {
    if (!overlapResult) return;
    const headers = ["Stock Name", ...funds.map((f) => f.name), "MinWeight"];
    const rows = overlapResult.topOverlapStocks.map(r => 
        [`"${r.name}"`, ...r.perFund.map((w) => w.toFixed(2)), r.minWeight.toFixed(4)].join(",")
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
    await navigator.clipboard.writeText(text);
    alert("Summary copied to clipboard!");
  };

  const addFund = () => {
    if (funds.length >= 5) return;
    const id = (funds[funds.length - 1]?.id || 0) + 1;
    const nextFund = allFunds.find(f => !funds.some(selected => selected.schemeCode === f.schemeCode)) || allFunds[funds.length];
    setFunds((p) => [...p, { id, name: nextFund?.schemeName || `Select Fund ${id}`, holdings: nextFund?.holdings || [], schemeCode: nextFund?.schemeCode || '' }]);
  };

  const removeFund = (id: number) => {
    setFunds((p) => p.filter((f) => f.id !== id));
  };
  
  const updateFundSelection = (fundId: number, schemeCode: string) => {
    const selectedFundData = allFunds.find(f => f.schemeCode === schemeCode);
    if (!selectedFundData) return;

    setFunds(prev => prev.map(f => 
      f.id === fundId 
      ? {
        ...f,
        name: selectedFundData.schemeName,
        holdings: selectedFundData.holdings,
        schemeCode: selectedFundData.schemeCode,
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
              <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground" onClick={() => removeFund(fund.id)}>
                <Trash2 className="h-4 w-4"/>
              </Button>
            </CardHeader>
            <CardContent className="p-4 text-sm text-muted-foreground">
              {fund.holdings.length > 0 ? `${fund.holdings.length} holdings loaded for analysis.` : 'Please select a fund to see details.'}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-start gap-4">
        <Button variant="outline" onClick={addFund} disabled={funds.length >= 5}>
          <PlusCircle className="mr-2" /> {dictionary.tool.add_fund}
        </Button>
      </div>

      {overlapResult && overlapResult.topOverlapStocks.length > 0 && (
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
                <CardHeader><CardTitle>{dictionary.results.top_stocks_title}</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow>
                            <TableHead>{dictionary.results.stock_header}</TableHead>
                            {funds.map((f) => <TableHead key={f.id} className="text-right">{f.name}</TableHead>)}
                            <TableHead className="text-right font-bold">{dictionary.results.min_weight_header}</TableHead>
                        </TableRow></TableHeader>
                        <TableBody>
                            {overlapResult.topOverlapStocks.slice(0,10).map((stock, idx) => (
                                <TableRow key={idx}>
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
        <span className="truncate">{selectedFund.name}</span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <DialogTitle className="sr-only">Select a fund to compare</DialogTitle>
        <Command>
          <CommandInput placeholder="Search for a fund..." />
          <CommandEmpty>No fund found.</CommandEmpty>
          <CommandList>
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
