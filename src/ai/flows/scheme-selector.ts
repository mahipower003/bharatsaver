'use server';

/**
 * @fileOverview An AI-powered scheme selector flow.
 *
 * - schemeSelector - A function that recommends an investment scheme based on user responses.
 * - SchemeSelectorInput - The input type for the schemeSelector function.
 * - SchemeSelectorOutput - The return type for the schemeSelector function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SchemeSelectorInputSchema = z.object({
  age: z.number().describe('Your age.'),
  riskTolerance: z.enum(['low', 'medium', 'high']).describe('Your risk tolerance (low, medium, high).'),
  investmentGoal: z.string().describe('Your primary investment goal (e.g., retirement, child education).'),
  investmentHorizon: z.enum(['short', 'medium', 'long']).describe('Your investment horizon (short, medium, long).'),
  currentIncome: z.number().describe('Your current annual income.'),
});
export type SchemeSelectorInput = z.infer<typeof SchemeSelectorInputSchema>;

const SchemeSelectorOutputSchema = z.object({
  recommendation: z.enum(['PPF', 'SSY', 'NPS', 'APY', 'FD']).describe('The recommended investment scheme.'),
  reasoning: z.string().describe('The reasoning behind the recommendation.'),
});
export type SchemeSelectorOutput = z.infer<typeof SchemeSelectorOutputSchema>;

export async function schemeSelector(input: SchemeSelectorInput): Promise<SchemeSelectorOutput> {
  return schemeSelectorFlow(input);
}

const schemeSelectorPrompt = ai.definePrompt({
  name: 'schemeSelectorPrompt',
  input: {schema: SchemeSelectorInputSchema},
  output: {schema: SchemeSelectorOutputSchema},
  prompt: `You are an expert financial advisor. Based on the user's responses to the following questionnaire, recommend the most suitable investment scheme (PPF, SSY, NPS, APY, or FD) and explain your reasoning.

Questionnaire:
Age: {{{age}}}
Risk Tolerance: {{{riskTolerance}}}
Investment Goal: {{{investmentGoal}}}
Investment Horizon: {{{investmentHorizon}}}
Current Income: {{{currentIncome}}}

Consider the following factors when making your recommendation:

*   PPF: Low risk, long-term investment with tax benefits. Suitable for retirement planning and long-term goals.
*   SSY: Specifically for girl child education and marriage. Tax benefits and guaranteed returns.
*   NPS: Retirement-focused, market-linked returns, and tax benefits. Offers flexibility in investment options.
*   APY: Guaranteed pension scheme for the unorganized sector. Low contribution amounts and fixed pension.
*   FD: Safe and liquid investment option with guaranteed returns. Suitable for short-term goals and risk-averse investors.

Your recommendation should be one of the following: PPF, SSY, NPS, APY, FD.
Provide a clear and concise reasoning for your recommendation.
`,
});

const schemeSelectorFlow = ai.defineFlow(
  {
    name: 'schemeSelectorFlow',
    inputSchema: SchemeSelectorInputSchema,
    outputSchema: SchemeSelectorOutputSchema,
  },
  async input => {
    const {output} = await schemeSelectorPrompt(input);
    return output!;
  }
);
