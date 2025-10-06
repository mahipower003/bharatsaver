
'use client';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatCurrency } from '@/lib/utils';

// Simplified premium rates for demonstration
const premiumData = [
  { age: '30', '15 Yrs PPT': 65000, '20 Yrs PPT': 45000, '25 Yrs PPT': 34000, '30 Yrs PPT': 27000 },
  { age: '40', '15 Yrs PPT': 78000, '20 Yrs PPT': 55000, '25 Yrs PPT': 42000, '30 Yrs PPT': 34000 },
  { age: '50', '15 Yrs PPT': 95000, '20 Yrs PPT': 70000, '25 Yrs PPT': 55000, '30 Yrs PPT': 45000 },
];

export function LicUmangPremiumChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Premium Comparison by PPT</CardTitle>
        <CardDescription>Illustrative yearly premiums for a ₹10 Lakh Sum Assured at different entry ages and Premium Paying Terms (PPT).</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={premiumData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="age" name="Age" />
            <YAxis tickFormatter={(value) => formatCurrency(value, true)} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend />
            <Bar dataKey="15 Yrs PPT" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="20 Yrs PPT" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="25 Yrs PPT" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
