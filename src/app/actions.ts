'use server';

import { schemeSelector, type SchemeSelectorInput, type SchemeSelectorOutput } from '@/ai/flows/scheme-selector';

export async function getSchemeRecommendation(input: SchemeSelectorInput): Promise<{
    success: boolean;
    data?: SchemeSelectorOutput;
    error?: string;
}> {
  try {
    const result = await schemeSelector(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error getting scheme recommendation:', error);
    if (error instanceof Error) {
        return { success: false, error: error.message };
    }
    return { success: false, error: 'An unexpected error occurred while fetching the recommendation.' };
  }
}
