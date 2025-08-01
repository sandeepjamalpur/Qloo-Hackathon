
'use server';

/**
 * @fileOverview A Genkit flow to get detailed information and an image for a specific Indian temple.
 *
 * - getTempleDetails - Function to fetch details for a temple.
 * - GetTempleDetailsInput - Input type for the function.
 * - GetTempleDetailsOutput - Output type for the function.
 */

import { ai } from 'fire/src/ai/genkit';
import { z } from 'genkit';

// 1. Define Schemas
const GetTempleDetailsInputSchema = z.object({
  query: z.string().describe("The user's query about a specific Indian temple (e.g., 'Tell me about the Golden Temple')."),
});
export type GetTempleDetailsInput = z.infer<typeof GetTempleDetailsInputSchema>;

const GetTempleDetailsOutputSchema = z.object({
  name: z.string().describe("The full, formal name of the temple."),
  description: z.string().describe("A detailed and engaging description of the temple, covering its history, architectural style, and cultural or religious significance."),
  state: z.string().describe("The state in India where the temple is located (e.g., 'Punjab', 'Tamil Nadu')."),
});
export type GetTempleDetailsOutput = z.infer<typeof GetTempleDetailsOutputSchema>;


// 2. Define AI Prompt & Flow
const templeDetailsPrompt = ai.definePrompt({
  name: 'templeDetailsPrompt',
  input: { schema: GetTempleDetailsInputSchema },
  output: { schema: GetTempleDetailsOutputSchema },
  prompt: `You are an expert on Indian architecture and religious sites. A user is asking about a specific temple.

User Query: "{{query}}"

Based on the query, identify the specific Indian temple. Then, provide the following information in the structured output format:

1.  **name**: The canonical name of the temple (e.g., "Golden Temple (Harmandir Sahib)", "Meenakshi Amman Temple").
2.  **description**: Write a detailed, engaging description. Cover its key historical facts, architectural style (e.g., Dravidian, Nagara), primary deity or significance, and what makes it famous.
3.  **state**: Specify the Indian state where it is located (e.g., "Punjab", "Tamil Nadu", "Odisha").
`,
});

const getTempleDetailsFlow = ai.defineFlow(
  {
    name: 'getTempleDetailsFlow',
    inputSchema: GetTempleDetailsInputSchema,
    outputSchema: GetTempleDetailsOutputSchema,
  },
  async (input) => {
    
    const { output } = await templeDetailsPrompt(input);
    
    if (!output) {
      throw new Error('Failed to get temple details from the AI model.');
    }

    return output;
  }
);


// 3. Export the wrapper function
export async function getTempleDetails(input: GetTempleDetailsInput): Promise<GetTempleDetailsOutput> {
  return getTempleDetailsFlow(input);
}
