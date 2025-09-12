
'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, Copy, PlusCircle, Trash2, BarChart2, Check, ChevronsUpDown } from 'lucide-react';
import type { Dictionary } from '@/types';
import { funds as allFunds, type FundPortfolio } from '@/data/mutual-fund-holdings';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';

type Fund = {
  id: number;
  name: string;
  sourceDate: string;
  holdings: Holding[];
  schemeCode: string;
};

type Holding = {
  symbol: string;
  name: string;
  weight: number;
  sector: string;
};

type OverlapResult = {
  weightedOverlap: number;
  pairwise: { i: number; j: number; percent: number }[];
  topOverlapStocks: (Holding & { minWeight: number; perFund: number[] })[];
  sectorOverlap: { sector: string; weight: number }[];
};


export function MutualFundOverlapCalculator({ dictionary }: { dictionary: Dictionary['mutual_fund_overlap_calculator'] }) {
  const [funds, setFunds] = useState<Fund[]>(() => {
    const initialFunds = allFunds.slice(0, 2);
    return initialFunds.map((f, i) => ({
      id: i + 1,
      name: f.schemeName,
      sourceDate: '31-Aug-2025',
      holdings: f.holdings.map(h => ({ ...h, symbol: h.name.toUpperCase().replace(/ /g,"").slice(0,10) })),
      schemeCode: f.schemeCode,
    }));
  });

  const [includeSectors, setIncludeSectors] = useState(true);

  const overlapResult: OverlapResult | null = useMemo(() => {
    if (funds.length < 2) return null;

    const allSymbols = new Set<string>();
    const fundWeightMaps = funds.map((f) => {
      const map = new Map<string, { weight: number; sector: string; name: string }>();
      let totalEquityWeight = 0;
      for (const h of f.holdings) {
        map.set(h.symbol, { weight: h.weight, sector: h.sector, name: h.name });
        totalEquityWeight += h.weight;
        allSymbols.add(h.symbol);
      }
      return { map, totalEquityWeight };
    });

    const symbolRows: { symbol: string; perFund: number[]; minWeight: number; exampleName: string; sector: string }[] = [];
    allSymbols.forEach(symbol => {
      const perFund = fundWeightMaps.map((fw) => fw.map.get(symbol)?.weight || 0);
      
      // Only include if it's an overlap (present in more than one fund)
      if (perFund.filter(w => w > 0).length > 1) {
        const minWeight = Math.min(...perFund.filter(w => w > 0));
        const firstFundWithStock = fundWeightMaps.find(fw => fw.map.has(symbol));
        const stockInfo = firstFundWithStock?.map.get(symbol);
        
        symbolRows.push({
          symbol,
          perFund,
          minWeight,
          exampleName: stockInfo?.name || "N/A",
          sector: stockInfo?.sector || "Unknown",
        });
      }
    });
    
    const weightedOverlap = symbolRows.reduce((s, r) => s + r.minWeight, 0);

    const pairwise: { i: number; j: number; percent: number }[] = [];
    for (let i = 0; i < funds.length; i++) {
      for (let j = i + 1; j < funds.length; j++) {
        let sumMin = 0;
        allSymbols.forEach(symbol => {
            const w1 = fundWeightMaps[i].map.get(symbol)?.weight || 0;
            const w2 = fundWeightMaps[j].map.get(symbol)?.weight || 0;
            if(w1 > 0 && w2 > 0) {
               sumMin += Math.min(w1, w2);
            }
        });
        const denom = Math.min(fundWeightMaps[i].totalEquityWeight || 100, fundWeightMaps[j].totalEquityWeight || 100);
        const percent = denom > 0 ? (sumMin / denom) * 100 : 0;
        pairwise.push({ i, j, percent: Number(percent.toFixed(2)) });
      }
    }

    const sectorMap = new Map<string, number>();
    symbolRows.forEach(row => {
      if (row.minWeight > 0) {
        sectorMap.set(row.sector, (sectorMap.get(row.sector) || 0) + row.minWeight);
      }
    });

    const topOverlapStocks = symbolRows
      .sort((a, b) => b.minWeight - a.minWeight)
      .map((r) => ({ ...r, name: r.exampleName } as any));
      
    const sectorOverlap = Array.from(sectorMap.entries())
        .map(([sector, weight]) => ({ sector, weight: Number(weight.toFixed(4)) }))
        .sort((a,b) => b.weight - a.weight);


    return {
      weightedOverlap: Number(weightedOverlap.toFixed(2)),
      pairwise,
      topOverlapStocks,
      sectorOverlap,
    };
  }, [funds]);

  const exportCSV = () => {
    if (!overlapResult) return;
    const headers = ["Symbol", "Name", ...funds.map((f) => f.name), "MinWeight"];
    const rows = overlapResult.topOverlapStocks.map(r => 
        [r.symbol, `"${r.name}"`, ...r.perFund.map((w) => w.toFixed(2)), r.minWeight.toFixed(4)].join(",")
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
      text += `- ${s.name} (${s.symbol}): ${s.minWeight.toFixed(2)}%\n`;
    });
    await navigator.clipboard.writeText(text);
    alert("Summary copied to clipboard!");
  };

  const addFund = () => {
    if (funds.length >= 5) return;
    const id = (funds[funds.length - 1]?.id || 0) + 1;
    // Add a default placeholder fund
    setFunds((p) => [...p, { id, name: `Select Fund ${id}`, sourceDate: '', holdings: [], schemeCode: '' }]);
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
        holdings: selectedFundData.holdings.map(h => ({...h, symbol: h.name.toUpperCase().replace(/ /g,"").slice(0,10)})),
        sourceDate: '31-Aug-2025',
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
                selectedFund={fund}
                onSelect={(schemeCode) => updateFundSelection(fund.id, schemeCode)}
                dictionary={dictionary}
              />
              <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground" onClick={() => removeFund(fund.id)}>
                <Trash2 className="h-4 w-4"/>
              </Button>
            </CardHeader>
            <CardContent className="p-4 text-sm text-muted-foreground">
              {fund.sourceDate ? `Holdings as of: ${fund.sourceDate}` : 'Please select a fund to see details.'}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <Button variant="outline" onClick={addFund} disabled={funds.length >= 5}>
          <PlusCircle className="mr-2" /> {dictionary.tool.add_fund}
        </Button>
        <div className="flex items-center space-x-2">
          <Checkbox id="include-sectors" checked={includeSectors} onCheckedChange={(checked) => setIncludeSectors(Boolean(checked))} />
          <label htmlFor="include-sectors" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {dictionary.tool.include_sectors}
          </label>
        </div>
      </div>

      {overlapResult && (
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
                            {overlapResult.topOverlapStocks.slice(0,10).map(stock => (
                                <TableRow key={stock.symbol}>
                                    <TableCell className="font-medium">{stock.name}<br/><span className="text-xs text-muted-foreground">{stock.symbol}</span></TableCell>
                                    {stock.perFund.map((w, i) => <TableCell key={i} className="text-right">{w > 0 ? `${w.toFixed(2)}%` : '-'}</TableCell>)}
                                    <TableCell className="text-right font-bold">{stock.minWeight.toFixed(2)}%</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

           {includeSectors && (
             <Card>
                <CardHeader><CardTitle>{dictionary.results.sector_overlap_title}</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    {overlapResult.sectorOverlap.slice(0,10).map((s, i) => (
                      <div key={i} className="flex justify-between items-center text-sm border-b pb-2">
                        <span className="font-medium">{s.sector}</span>
                        <span className="font-semibold text-primary">{s.weight.toFixed(2)}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
            </Card>
           )}

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Button variant="outline" onClick={exportCSV}><Download className="mr-2"/>{dictionary.tool.export_csv}</Button>
              <Button variant="outline" onClick={copySummary}><Copy className="mr-2"/>{dictionary.tool.copy_summary}</Button>
          </div>
        </div>
      )}
    </div>
  );
}


function FundSelector({ selectedFund, onSelect, dictionary }: { selectedFund: Fund, onSelect: (schemeCode: string) => void, dictionary: any }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
        >
          <span className="truncate">{selectedFund.name}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
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
      </PopoverContent>
    </Popover>
  );
}
