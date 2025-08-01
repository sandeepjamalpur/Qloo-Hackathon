// Summarize-cultural-item.ts
'use server';
/**
 * @fileOverview Summarizes a cultural item based on reviews and descriptions.
 *
 * - summarizeCulturalItem - A function that summarizes the reviews and descriptions of a cultural item.
 * - SummarizeCulturalItemInput - The input type for the summarizeCulturalItem function.
 * - SummarizeCulturalItemOutput - The return type for the summarizeCulturalItem function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeCulturalItemInputSchema = z.object({
  name: z.string().describe('The name of the cultural item.'),
  description: z.string().describe('A detailed description of the cultural item.'),
  reviews: z.array(z.string()).describe('An array of reviews for the cultural item.'),
});
export type SummarizeCulturalItemInput = z.infer<typeof SummarizeCulturalItemInputSchema>;

const SummarizeCulturalItemOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise, engaging summary of the cultural item, written in a narrative style, based on the description and reviews.'
    ),
  positiveThemes: z
    .array(z.string())
    .describe('A list of up to 3 key positive themes or keywords mentioned in the reviews.'),
  negativeThemes: z
    .array(z.string())
    .describe('A list of up to 3 key negative or critical themes mentioned in the reviews.'),
  sentimentScore: z
    .number()
    .min(0)
    .max(100)
    .describe(
      'An overall sentiment score from 0 (overwhelmingly negative) to 100 (overwhelmingly positive), based on the provided reviews.'
    ),
});
export type SummarizeCulturalItemOutput = z.infer<typeof SummarizeCulturalItemOutputSchema>;

export async function summarizeCulturalItem(input: SummarizeCulturalItemInput): Promise<SummarizeCulturalItemOutput> {
  return summarizeCulturalItemFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeCulturalItemPrompt',
  input: {schema: SummarizeCulturalItemInputSchema},
  output: {schema: SummarizeCulturalItemOutputSchema},
  prompt: `You are an expert cultural critic. Your task is to analyze a cultural item based on its description and a set of reviews.

Analyze the provided information for "{{name}}".

Description:
"{{description}}"

Reviews:
{{#each reviews}}
- "{{this}}"
{{/each}}

Based on your analysis, provide the following:
1.  A concise, engaging summary.
2.  Up to 3 positive themes and 3 negative themes from the reviews.
3.  An overall sentiment score from 0 to 100.`,
});

const summarizeCulturalItemFlow = ai.defineFlow(
  {
    name: 'summarizeCulturalItemFlow',
    inputSchema: SummarizeCulturalItemInputSchema,
    outputSchema: SummarizeCulturalItemOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      if (!output) {
        throw new Error('No output from AI model.');
      }
      return output;
    } catch (error: any) {
        console.error(`Error in summarizeCulturalItemFlow for "${input.name}":`, error);
        const errorMessage = error.message || '';
        if (errorMessage.includes('503') || errorMessage.includes('overloaded')) {
            throw new Error(`The AI service is currently busy. Please try again in a moment.`);
        }
        // Re-throw a more generic error to be caught by the client-side caller
        throw new Error(`Failed to generate analysis due to a server error. Please try again later.`);
    }
  }
);
