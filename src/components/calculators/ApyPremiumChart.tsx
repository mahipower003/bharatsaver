'use client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apyPremiums } from "@/data/apy-chart";
import type { Dictionary } from "@/types";

type ApyPremiumChartProps = {
  dictionary: Dictionary['apy_calculator']['premium_chart'];
};

export function ApyPremiumChart({ dictionary }: ApyPremiumChartProps) {
  const ages = [18, 20, 25, 30, 35, 40];
  const pensionAmounts = [1000, 2000, 3000, 4000, 5000];

  return (
    <div className="overflow-x-auto">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>{dictionary.age_header}</TableHead>
                    {pensionAmounts.map(amount => (
                        <TableHead key={amount} className="text-center">{`₹${amount.toLocaleString('en-IN')}`}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {ages.map(age => (
                    <TableRow key={age}>
                        <TableCell className="font-medium">{age} {dictionary.years_label}</TableCell>
                        {pensionAmounts.map(pension => {
                            const premium = apyPremiums[age]?.[pension as keyof typeof apyPremiums[18]] ?? '-';
                            return (
                                <TableCell key={`${age}-${pension}`} className="text-center">
                                    {typeof premium === 'number' ? `₹${premium}` : premium}
                                </TableCell>
                            );
                        })}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
  );
}
