
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function MutualFundScreenerTool() {
  return (
    <Card className="shadow-lg animate-in fade-in-50">
      <CardHeader>
        <CardTitle>Interactive Mutual Fund Screener</CardTitle>
        <CardDescription>
          Start by selecting your goal, then use the filters to find the perfect fund.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-8 border-2 border-dashed rounded-lg text-center">
          <p className="text-muted-foreground">
            [Interactive tool placeholder]
          </p>
          <Button className="mt-4">Launch Screener</Button>
        </div>
      </CardContent>
    </Card>
  );
}
