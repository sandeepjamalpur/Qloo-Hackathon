
'use server';

/**
 * @fileOverview A Genkit flow to get detailed information and an image for a specific Indian food dish.
 *
 * - getFoodDetails - Function to fetch details for a food dish.
 * - GetFoodDetailsInput - Input type for the function.
 * - GetFoodDetailsOutput - Output type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// 1. Define Schemas
const GetFoodDetailsInputSchema = z.object({
  query: z.string().describe("The user's query about a specific Indian food dish (e.g., 'Tell me about Paneer Tikka')."),
});
export type GetFoodDetailsInput = z.infer<typeof GetFoodDetailsInputSchema>;

const GetFoodDetailsOutputSchema = z.object({
  name: z.string().describe("The name of the food dish."),
  description: z.string().describe("A detailed and engaging description of the food dish, including its taste, ingredients, and cultural significance."),
  origin: z.string().describe("The city, state, or region in India where the dish originated."),
});
export type GetFoodDetailsOutput = z.infer<typeof GetFoodDetailsOutputSchema>;

// 2. Define AI Prompt & Flow
const foodDetailsPrompt = ai.definePrompt({
  name: 'foodDetailsPrompt',
  input: { schema: GetFoodDetailsInputSchema },
  output: { schema: GetFoodDetailsOutputSchema },
  prompt: `You are an expert on Indian cuisine. A user is asking about a specific food dish. Your task is to provide detailed and accurate information about it.

User Query: "{{query}}"

Based on the query, identify the specific Indian food dish. Then, provide the following information in the structured output format:

1.  **name**: The canonical name of the dish (e.g., "Masala Dosa", "Butter Chicken").
2.  **description**: Write a detailed, engaging description. Cover key ingredients, preparation method, taste profile (e.g., spicy, creamy, tangy), and its cultural context or how it's typically served.
3.  **origin**: Specify the city, state, or region of India it's most famously associated with (e.g., "Punjab", "Tamil Nadu", "Hyderabad").
`,
});

const getFoodDetailsFlow = ai.defineFlow(
  {
    name: 'getFoodDetailsFlow',
    inputSchema: GetFoodDetailsInputSchema,
    outputSchema: GetFoodDetailsOutputSchema,
  },
  async (input) => {
    
    const { output } = await foodDetailsPrompt(input);
    
    if (!output) {
      throw new Error('Failed to get food details from the AI model.');
    }
    
    return output;
  }
);


// 3. Export the wrapper function
export async function getFoodDetails(input: GetFoodDetailsInput): Promise<GetFoodDetailsOutput> {
  return getFoodDetailsFlow(input);
}
