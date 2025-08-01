
'use server';

/**
 * @fileOverview A Genkit flow to generate a detailed recipe for a given Indian food dish using Gemini.
 *
 * - getRecipe - Function to generate a recipe.
 * - GetRecipeInput - Input type for the function.
 * - GetRecipeOutput - Output type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { GetRecipeInputSchema, GetRecipeOutputSchema } from '@/types/recipe';
import type { GetRecipeInput, GetRecipeOutput } from '@/types/recipe';


// Export types for external use
export type { GetRecipeInput, GetRecipeOutput };


const recipePrompt = ai.definePrompt({
    name: 'generateRecipePrompt',
    input: { schema: GetRecipeInputSchema },
    output: { schema: GetRecipeOutputSchema },
    prompt: `You are an expert chef specializing in Indian cuisine. A user wants a recipe for a specific dish.

Dish Name: "{{dishName}}"
{{#if state}}
State of Origin: "{{state}}"
{{/if}}

Your Task:
Generate a clear, easy-to-follow recipe for this dish. The recipe should be practical for a home cook.

Provide the following in the structured output format:
1.  **ingredients**: An array of strings, where each string is a single ingredient with its precise measurement (e.g., "1 cup besan (gram flour)", "2 medium onions, finely chopped").
2.  **instructions**: A single string containing step-by-step instructions. Use newline characters ('\n') to separate each step for clear readability. Start with preparation steps, then cooking, and finally serving suggestions.
`,
});


const getRecipeFlow = ai.defineFlow(
  {
    name: 'getRecipeFlow',
    inputSchema: GetRecipeInputSchema,
    outputSchema: GetRecipeOutputSchema,
  },
  async (input) => {
    const { output } = await recipePrompt(input);
    if (!output || !output.ingredients || output.ingredients.length === 0) {
      throw new Error(`Failed to generate a valid recipe for ${input.dishName}. The model returned incomplete data.`);
    }
    return output;
  }
);


// Export the wrapper function
export async function getRecipe(input: GetRecipeInput): Promise<GetRecipeOutput> {
  return getRecipeFlow(input);
}
