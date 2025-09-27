
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Dictionary } from '@/types';

const formSchema = z.object({
  productCategory: z.string().min(1, 'Please select a category'),
  subCategory: z.string().optional(),
  plan: z.string().min(1, 'Please select a plan'),
});

type LicFormValues = z.infer<typeof formSchema>;

type LicCalculatorProps = {
  dictionary: Dictionary['lic_premium_calculator'];
};

export function LicPremiumCalculator({ dictionary }: LicCalculatorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LicFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productCategory: 'insurance_plans',
      subCategory: 'whole_life_plans',
      plan: 'jeevan_umang',
    },
  });

  const productCategory = form.watch('productCategory');
  const subCategory = form.watch('subCategory');
  const categoriesWithSubCategories = ['insurance_plans'];

  useEffect(() => {
    form.resetField('subCategory', { defaultValue: '' });
    form.resetField('plan', { defaultValue: '' });
  }, [productCategory, form]);

  useEffect(() => {
     form.resetField('plan', { defaultValue: '' });
  }, [subCategory, form]);

  const hasSubCategories = categoriesWithSubCategories.includes(productCategory);
  
  const subCategories = hasSubCategories && dictionary.tool.sub_categories[productCategory] 
    ? Object.entries(dictionary.tool.sub_categories[productCategory])
    : null;

  const plans = hasSubCategories 
    ? (subCategory && dictionary.tool.plans[subCategory] ? Object.entries(dictionary.tool.plans[subCategory]) : null)
    : (productCategory && dictionary.tool.plans[productCategory] ? Object.entries(dictionary.tool.plans[productCategory]) : null);


  async function handleSubmit(values: LicFormValues) {
    setIsLoading(true);
    const lang = pathname.split('/')[1] || 'en';
    const planSlug = `lic-${values.plan}-calculator`.replace(/_/g, '-');
    
    // Simulate a brief delay before redirecting
    await new Promise(resolve => setTimeout(resolve, 300));

    router.push(`/${lang}/${planSlug}`);
  }

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
           <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <h2 className="flex items-center gap-2 text-xl font-bold">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <span>{dictionary.tool.title}</span>
            </h2>
            </div>
             <CardDescription>{dictionary.tool.form_description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="productCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{dictionary.tool.category_label}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(dictionary.tool.categories).map(([key, value]) => (
                              <SelectItem key={key} value={key}>{value}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                {subCategories && hasSubCategories && (
                   <FormField
                      control={form.control}
                      name="subCategory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{dictionary.tool.sub_category_label}</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ''} >
                            <FormControl>
                              <SelectTrigger><SelectValue placeholder={dictionary.tool.sub_category_placeholder} /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {subCategories.map(([key, value]) => (
                                <SelectItem key={key} value={key}>{value}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                )}

                {plans && (
                  <FormField
                    control={form.control}
                    name="plan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{dictionary.tool.plan_label}</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ''}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder={dictionary.tool.plan_placeholder} /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                             {plans.map(([key, value]) => (
                                <SelectItem key={key} value={key}>{value}</SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                {dictionary.tool.view_calculator_button}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
