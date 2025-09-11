'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, Copy, Share2, PlusCircle, Trash2, BarChart2 } from 'lucide-react';
import type { Dictionary } from '@/types';

/**
 * Data format for holdings.
 */
type Holding = {
  symbol: string;
  name: string;
  weight: number;
  sector: string;
};

type Fund = {
  id: number;
  name: string;
  sourceDate: string;
  holdingsText: string;
};

/**
 * Parses holdings text into a structured array.
 * @param text - The raw text from the textarea (CSV format).
 * @returns An array of Holding objects.
 */
const parseHoldings = (text: string): Holding[] => {
  const lines = text.split(/\n|\r/).map((l) => l.trim()).filter(Boolean);
  const holdings: Holding[] = [];
  for (const line of lines) {
    const parts = line.split(",").map((p) => p.trim());
    if (parts.length < 3) continue;
    const weightStr = parts[parts.length - 2];
    const sector = parts[parts.length - 1] || "Unknown";
    const symbol = parts[0];
    const name = parts.slice(1, -2).join(", ");
    const weight = parseFloat(weightStr.replace("%", "")) || 0;
    holdings.push({ symbol: symbol.toUpperCase(), name, weight, sector });
  }
  return holdings;
};

type OverlapResult = {
  weightedOverlap: number;
  pairwise: { i: number; j: number; percent: number }[];
  topOverlapStocks: (Holding & { minWeight: number; perFund: number[] })[];
  sectorOverlap: { sector: string; weight: number }[];
};


export function MutualFundOverlapCalculator({ dictionary }: { dictionary: Dictionary['mutual_fund_overlap_calculator'] }) {
  const [funds, setFunds] = useState<Fund[]>([
    {
      id: 1,
      name: "HDFC Top 100 (example)",
      sourceDate: "01-Sep-2025",
      holdingsText:
        "RELIANCE, Reliance Industries Ltd, 8.2, Energy\nHDFCBANK, HDFC Bank Ltd, 6.3, Financials\nICICIBANK, ICICI Bank Ltd, 4.9, Financials\nTCS, Tata Consultancy Services, 5.0, Technology\nINFY, Infosys Ltd, 4.5, Technology",
    },
    {
      id: 2,
      name: "SBI Bluechip (example)",
      sourceDate: "01-Sep-2025",
      holdingsText:
        "RELIANCE, Reliance Industries Ltd, 7.5, Energy\nHDFCBANK, HDFC Bank Ltd, 5.8, Financials\nICICIBANK, ICICI Bank Ltd, 4.4, Financials\nINFY, Infosys Ltd, 3.9, Technology\nTITAN, Titan Company Ltd, 2.5, Consumer",
    },
  ]);

  const [activeFundsCount, setActiveFundsCount] = useState(2);
  const [includeSectors, setIncludeSectors] = useState(true);

  const parsedFunds = useMemo(() => {
    return funds.slice(0, activeFundsCount).map((f) => ({
      ...f,
      holdings: parseHoldings(f.holdingsText),
    }));
  }, [funds, activeFundsCount]);

  const overlapResult: OverlapResult | null = useMemo(() => {
    if (parsedFunds.length < 2) return null;

    const allSymbols = new Set<string>();
    const fundWeightMaps = parsedFunds.map((f) => {
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
      const minWeight = Math.min(...perFund);
      const firstFundWithStock = fundWeightMaps.find(fw => fw.map.has(symbol));
      const stockInfo = firstFundWithStock?.map.get(symbol);
      
      symbolRows.push({
        symbol,
        perFund,
        minWeight,
        exampleName: stockInfo?.name || "N/A",
        sector: stockInfo?.sector || "Unknown",
      });
    });

    const weightedOverlap = symbolRows.reduce((s, r) => s + r.minWeight, 0);

    const pairwise: { i: number; j: number; percent: number }[] = [];
    for (let i = 0; i < parsedFunds.length; i++) {
      for (let j = i + 1; j < parsedFunds.length; j++) {
        let sumMin = 0;
        allSymbols.forEach(symbol => {
            const w1 = fundWeightMaps[i].map.get(symbol)?.weight || 0;
            const w2 = fundWeightMaps[j].map.get(symbol)?.weight || 0;
            sumMin += Math.min(w1, w2);
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
      .filter((r) => r.minWeight > 0)
      .sort((a, b) => b.minWeight - a.minWeight)
      .map((r) => ({ ...r, name: r.exampleName }));
      
    const sectorOverlap = Array.from(sectorMap.entries())
        .map(([sector, weight]) => ({ sector, weight: Number(weight.toFixed(4)) }))
        .sort((a,b) => b.weight - a.weight);


    return {
      weightedOverlap: Number(weightedOverlap.toFixed(2)),
      pairwise,
      topOverlapStocks,
      sectorOverlap,
    };
  }, [parsedFunds]);

  const exportCSV = () => {
    if (!overlapResult) return;
    const headers = ["Symbol", "Name", ...parsedFunds.map((f) => f.name), "MinWeight"];
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

  const updateFundText = (id: number, text: string) => {
    setFunds((prev) => prev.map((f) => (f.id === id ? { ...f, holdingsText: text } : f)));
  };

  const updateFundName = (id: number, name: string) => {
    setFunds((prev) => prev.map((f) => (f.id === id ? { ...f, name } : f)));
  };

  const addFund = () => {
    if (funds.length >= 5) return;
    const id = (funds[funds.length - 1]?.id || 0) + 1;
    setFunds((p) => [...p, { id, name: `Fund ${id}`, sourceDate: new Date().toLocaleDateString('en-CA'), holdingsText: "" }]);
    setActiveFundsCount((c) => c + 1);
  };

  const removeFund = (id: number) => {
    setFunds((p) => p.filter((f) => f.id !== id));
    setActiveFundsCount((c) => Math.max(2, c - 1));
  };
  
  const getOverlapLevel = (overlap: number) => {
    if (overlap > 50) return { label: 'Very High', color: 'text-destructive' };
    if (overlap > 30) return { label: 'High', color: 'text-orange-500' };
    if (overlap > 15) return { label: 'Moderate', color: 'text-yellow-500' };
    return { label: 'Low', color: 'text-green-500' };
  };


  return (
    <div className="space-y-6">
      {funds.map((fund, idx) => (
        <Card key={fund.id} className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between bg-muted/50 p-4">
            <Input value={fund.name} onChange={(e) => updateFundName(fund.id, e.target.value)} className="text-base font-semibold w-auto border-none focus-visible:ring-0 shadow-none bg-transparent" />
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground">{dictionary.tool.holdings_as_of} {fund.sourceDate}</span>
              {funds.length > 2 && (
                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground" onClick={() => removeFund(fund.id)}>
                    <Trash2 className="h-4 w-4"/>
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <Textarea
              rows={5}
              value={fund.holdingsText}
              onChange={(e) => updateFundText(fund.id, e.target.value)}
              className="w-full font-mono text-xs"
              placeholder={dictionary.tool.placeholder}
            />
            <p className="text-xs text-muted-foreground mt-2">{dictionary.tool.format_hint}</p>
          </CardContent>
        </Card>
      ))}

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
                            {parsedFunds.map((f) => <TableHead key={f.id} className="text-right">{f.name}</TableHead>)}
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
