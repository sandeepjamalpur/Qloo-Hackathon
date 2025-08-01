
'use server';

/**
 * @fileOverview A Genkit flow to get detailed information and an image for a specific Indian festival.
 *
 * - getFestivalDetails - Function to fetch details for a festival.
 * - GetFestivalDetailsInput - Input type for the function.
 * - GetFestivalDetailsOutput - Output type for the function.
 */

import { ai } from 'fire/src/ai/genkit';
import { z } from 'genkit';

// 1. Define Schemas
const GetFestivalDetailsInputSchema = z.object({
  query: z.string().describe("The user's query about a specific Indian festival (e.g., 'Tell me about Diwali')."),
});
export type GetFestivalDetailsInput = z.infer<typeof GetFestivalDetailsInputSchema>;

const GetFestivalDetailsOutputSchema = z.object({
  name: z.string().describe("The full, formal name of the festival."),
  description: z.string().describe("A detailed and engaging description of the festival, covering its history, traditions, and cultural significance."),
  type: z.enum(['Religious', 'Seasonal', 'Cultural', 'National']).describe("The primary type of festival (e.g., 'Religious', 'Seasonal')."),
  region: z.string().describe("The primary region or states in India where the festival is celebrated, or 'Nationwide' if applicable."),
});
export type GetFestivalDetailsOutput = z.infer<typeof GetFestivalDetailsOutputSchema>;


// 2. Define AI Prompt & Flow
const festivalDetailsPrompt = ai.definePrompt({
  name: 'festivalDetailsPrompt',
  input: { schema: GetFestivalDetailsInputSchema },
  output: { schema: GetFestivalDetailsOutputSchema },
  prompt: `You are an expert on Indian culture and festivals. A user is asking about a specific festival.

User Query: "{{query}}"

Based on the query, identify the specific Indian festival. Then, provide the following information in the structured output format:

1.  **name**: The canonical name of the festival (e.g., "Diwali", "Holi", "Durga Puja").
2.  **description**: Write a detailed, engaging description. Cover its key historical facts, main rituals and traditions, and its cultural significance.
3.  **type**: Classify the festival as 'Religious', 'Seasonal', 'Cultural', or 'National'.
4.  **region**: Specify the primary region (e.g., "North India", "West Bengal") or states where it's most celebrated. If it's celebrated across the country, use "Nationwide".
`,
});

const getFestivalDetailsFlow = ai.defineFlow(
  {
    name: 'getFestivalDetailsFlow',
    inputSchema: GetFestivalDetailsInputSchema,
    outputSchema: GetFestivalDetailsOutputSchema,
  },
  async (input) => {
    const { output } = await festivalDetailsPrompt(input);

    if (!output) {
      throw new Error('Failed to get festival details from the AI model.');
    }
    
    return output;
  }
);


// 3. Export the wrapper function
export async function getFestivalDetails(input: GetFestivalDetailsInput): Promise<GetFestivalDetailsOutput> {
  return getFestivalDetailsFlow(input);
}
