
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Download, Copy, PlusCircle, Trash2, BarChart2, Check, ChevronsUpDown, AlertTriangle, Info, Loader2 } from 'lucide-react';
import type { Dictionary } from '@/types';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandDialog } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { type OverlapOutput, calculateAllOverlaps, type RawFund } from '@/lib/overlap-calculator';

export function MutualFundOverlapCalculator({ dictionary }: { dictionary: Dictionary['mutual_fund_overlap_calculator'] }) {
  const [allFunds, setAllFunds] = useState<RawFund[]>([]);
  const [selectedFunds, setSelectedFunds] = useState<RawFund[]>([]);
  const [overlapResult, setOverlapResult] = useState<OverlapOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await fetch('/data/mutual-fund-holdings.json');
        if (!response.ok) {
          throw new Error('Failed to fetch fund data');
        }
        const data: RawFund[] = await response.json();
        setAllFunds(data);
        if (data.length >= 2) {
          setSelectedFunds([data[0], data[1]]);
        } else {
          setIsLoading(false); // Not enough data to perform a default calculation
        }
      } catch (error) {
        console.error("Error fetching fund data:", error);
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedFunds.length < 2) {
      setOverlapResult(null);
      if(allFunds.length > 0) setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    const calculateOverlap = async () => {
      await new Promise(resolve => setTimeout(resolve, 50)); 
      const result = calculateAllOverlaps(selectedFunds);
      setOverlapResult(result);
      setIsLoading(false);
    };
    calculateOverlap();
  }, [selectedFunds, allFunds]);

  const exportCSV = () => {
    if (!overlapResult || !overlapResult.pairs.length) return;
    const firstPair = overlapResult.pairs[0];
    const headers = ["Stock Name", `Weight in ${firstPair.fund_a}`, `Weight in ${firstPair.fund_b}`, "Min. Weight"];
    const rows = firstPair.common_holdings.map(r => 
        [`"${r.company.replace(/"/g, '""')}"`, r.weight_a.toFixed(2), r.weight_b.toFixed(2), r.min_weight.toFixed(4)].join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fund_overlap_${firstPair.fund_a}_vs_${firstPair.fund_b}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const copySummary = async () => {
    if (!overlapResult || !overlapResult.pairs.length) return;
    const firstPair = overlapResult.pairs[0];
    let text = `Mutual Fund Overlap Summary: ${firstPair.fund_a} vs ${firstPair.fund_b}\n`;
    text += `Weighted Overlap: ${firstPair.weighted_overlap.toFixed(2)}%\n\n`;
    text += `Top 5 Overlapping Stocks:\n`;
    firstPair.common_holdings.slice(0, 5).forEach(s => {
      text += `- ${s.company}: ${s.min_weight.toFixed(2)}%\n`;
    });
    try {
        await navigator.clipboard.writeText(text);
        alert("Summary copied to clipboard!");
    } catch(err) {
        console.error("Failed to copy summary: ", err);
    }
  };

  const addFund = () => {
    if (selectedFunds.length >= 5 || allFunds.length === 0) return;
    const selectedNames = new Set(selectedFunds.map(f => f.fund_name));
    const nextFundToAdd = allFunds.find(f => !selectedNames.has(f.fund_name));
    if (nextFundToAdd) {
        setSelectedFunds(prev => [...prev, nextFundToAdd]);
    }
  };

  const removeFund = (fundNameToRemove: string) => {
    if (selectedFunds.length <= 2) return;
    setSelectedFunds(prev => prev.filter((f) => f.fund_name !== fundNameToRemove));
  };
  
  const updateFundSelection = (oldFundName: string, newFundName: string) => {
    const newFundData = allFunds.find(f => f.fund_name === newFundName);
    if (!newFundData) return;
    
    if (selectedFunds.some(f => f.fund_name === newFundName && f.fund_name !== oldFundName)) {
        alert("This fund is already selected. Please choose a different one.");
        return;
    }

    setSelectedFunds(prev => prev.map(f => 
      f.fund_name === oldFundName ? newFundData : f
    ));
  };

  const getOverlapLevel = (overlap: number) => {
    if (overlap > 50) return { label: 'Very High', color: 'text-destructive' };
    if (overlap > 30) return { label: 'High', color: 'text-orange-500' };
    if (overlap > 15) return { label: 'Moderate', color: 'text-yellow-500' };
    return { label: 'Low', color: 'text-green-500' };
  };

  const firstPairResult = overlapResult?.pairs[0];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {selectedFunds.map((fund, index) => (
          <Card key={`${fund.fund_name}-${index}`} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between bg-muted/50 p-4">
               <FundSelector
                allFunds={allFunds}
                selectedFund={fund}
                onSelect={(newFundName) => updateFundSelection(fund.fund_name, newFundName)}
              />
              <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground" onClick={() => removeFund(fund.fund_name)} disabled={selectedFunds.length <= 2}>
                <Trash2 className="h-4 w-4"/>
              </Button>
            </CardHeader>
            <CardContent className="p-4 text-sm text-muted-foreground">
              {fund.constituents?.length > 0 ? `${fund.constituents.length} holdings loaded.` : 'No holdings data found.'}
              {overlapResult?.per_fund[fund.fund_name] && (
                  <div className="flex items-center text-xs mt-2">
                    <Info className="h-3 w-3 mr-1.5" />
                    Coverage: {overlapResult.per_fund[fund.fund_name].coverage_pct.toFixed(2)}%
                  </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-start gap-4">
        <Button variant="outline" onClick={addFund} disabled={selectedFunds.length >= 5 || isLoading}>
          <PlusCircle className="mr-2 h-4 w-4" /> {dictionary.tool.add_fund}
        </Button>
      </div>
      
      {isLoading && <div className="text-center py-12"><Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" /></div>}

      {!isLoading && firstPairResult ? (
        <div className="space-y-6 animate-in fade-in-50">
            {firstPairResult.status === 'partial_coverage' && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Partial Coverage Warning</AlertTitle>
                    <AlertDescription>{firstPairResult.status_note}</AlertDescription>
                </Alert>
            )}

            <Alert variant="default" className="text-center p-6">
                <BarChart2 className="h-6 w-6 mx-auto mb-2 text-primary"/>
                <AlertTitle className="text-base font-semibold mb-1">{dictionary.results.weighted_overlap_title}</AlertTitle>
                <AlertDescription className="text-3xl font-bold">
                    <span className={getOverlapLevel(firstPairResult.weighted_overlap).color}>
                        {firstPairResult.weighted_overlap.toFixed(2)}% ({getOverlapLevel(firstPairResult.weighted_overlap).label})
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
                            <TableHead className="text-right truncate max-w-[150px]">{firstPairResult.fund_a}</TableHead>
                            <TableHead className="text-right truncate max-w-[150px]">{firstPairResult.fund_b}</TableHead>
                            <TableHead className="text-right font-bold">{dictionary.results.min_weight_header}</TableHead>
                        </TableRow></TableHeader>
                        <TableBody>
                            {firstPairResult.common_holdings.slice(0,10).map((stock) => (
                                <TableRow key={stock.company}>
                                    <TableCell className="font-medium">{stock.company}</TableCell>
                                    <TableCell className="text-right">{stock.weight_a > 0 ? `${stock.weight_a.toFixed(2)}%` : '-'}</TableCell>
                                    <TableCell className="text-right">{stock.weight_b > 0 ? `${stock.weight_b.toFixed(2)}%` : '-'}</TableCell>
                                    <TableCell className="text-right font-bold">{stock.min_weight.toFixed(2)}%</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Button variant="outline" onClick={exportCSV}><Download className="mr-2 h-4 w-4"/>{dictionary.tool.export_csv}</Button>
              <Button variant="outline" onClick={copySummary}><Copy className="mr-2 h-4 w-4"/>{dictionary.tool.copy_summary}</Button>
          </div>
        </div>
      ) : (
        !isLoading && <Alert>
          <AlertTitle>Not Enough Funds Selected</AlertTitle>
          <AlertDescription>
            Please select at least two funds to calculate the overlap.
          </AlertDescription>
        </Alert>
       )}
    </div>
  );
}

function FundSelector({ allFunds, selectedFund, onSelect }: { allFunds: RawFund[], selectedFund: RawFund, onSelect: (fundName: string) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className="w-full sm:w-[300px] justify-between"
        onClick={() => setOpen(true)}
      >
        <span className="truncate">{selectedFund.fund_name}</span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="Search for a fund..." />
          <CommandList>
          <CommandEmpty>No fund found.</CommandEmpty>
            <CommandGroup>
              {allFunds.map((fund) => (
                <CommandItem
                  key={fund.fund_name}
                  value={fund.fund_name}
                  onSelect={(currentValue) => {
                    onSelect(currentValue === selectedFund.fund_name ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedFund.fund_name === fund.fund_name ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {fund.fund_name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}

    