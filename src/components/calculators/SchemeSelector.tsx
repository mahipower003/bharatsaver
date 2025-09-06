'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Sparkles, HandCoins } from 'lucide-react';
import { getSchemeRecommendation } from '@/app/actions';
import type { SchemeSelectorOutput } from '@/ai/flows/scheme-selector';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { Dictionary } from '@/types';

const formSchema = z.object({
  age: z.coerce.number().min(18, 'Age must be at least 18').max(100, 'Age must be 100 or less'),
  currentIncome: z.coerce.number().min(0, 'Income cannot be negative'),
  riskTolerance: z.enum(['low', 'medium', 'high']),
  investmentHorizon: z.enum(['short', 'medium', 'long']),
  investmentGoal: z.string().min(3, 'Please describe your goal'),
});

type SchemeSelectorFormValues = z.infer<typeof formSchema>;

type SchemeSelectorProps = {
  dictionary: Dictionary['scheme_selector'];
}

export function SchemeSelector({ dictionary }: SchemeSelectorProps) {
  const [result, setResult] = useState<SchemeSelectorOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<SchemeSelectorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 25,
      currentIncome: 500000,
      riskTolerance: 'medium',
      investmentHorizon: 'long',
      investmentGoal: '',
    },
  });

  async function onSubmit(values: SchemeSelectorFormValues) {
    setIsLoading(true);
    setResult(null);
    const response = await getSchemeRecommendation(values);
    setIsLoading(false);

    if (response.success && response.data) {
      setResult(response.data);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: response.error || "Failed to get recommendation.",
      });
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6 text-accent" />
            {dictionary.title}
          </CardTitle>
          <CardDescription>{dictionary.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dictionary.age_label}</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="25" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currentIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dictionary.income_label}</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="500000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="riskTolerance"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>{dictionary.risk_label}</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col md:flex-row gap-4"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="low" />
                          </FormControl>
                          <FormLabel className="font-normal">{dictionary.risk_low}</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="medium" />
                          </FormControl>
                          <FormLabel className="font-normal">{dictionary.risk_medium}</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="high" />
                          </FormControl>
                          <FormLabel className="font-normal">{dictionary.risk_high}</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="investmentHorizon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.horizon_label}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your investment horizon" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="short">{dictionary.horizon_short}</SelectItem>
                        <SelectItem value="medium">{dictionary.horizon_medium}</SelectItem>
                        <SelectItem value="long">{dictionary.horizon_long}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="investmentGoal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.goal_label}</FormLabel>
                    <FormControl>
                      <Input placeholder={dictionary.goal_placeholder} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {dictionary.loading}
                  </>
                ) : (
                  dictionary.submit_button
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <Card className="mt-8 animate-in fade-in-50 slide-in-from-bottom-5">
            <CardHeader>
                <CardTitle className="flex items-center gap-3 text-primary">
                    <HandCoins className="h-8 w-8"/>
                    <span className="text-2xl">{dictionary.result_title}</span>
                </CardTitle>
            </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-primary/10 p-6 rounded-lg text-center">
              <p className="text-lg font-medium text-muted-foreground">You should consider</p>
              <p className="text-4xl font-bold text-primary mt-2">{result.recommendation}</p>
            </div>
            <div>
              <h4 className="font-semibold text-lg">{dictionary.result_reasoning}</h4>
              <p className="text-muted-foreground mt-2">{result.reasoning}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
