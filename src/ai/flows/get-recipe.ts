
'use server';

/**
 * @fileOverview A flow to get a recipe for a given Indian dish using the Hugging Face QA service.
 *
 * - getRecipeFlow - Function to fetch a recipe for a dish.
 */

import { GetRecipeInputSchema, type GetRecipeInput } from '@/types/recipe';
import { queryHuggingFaceQA } from '@/services/huggingface';
import { allFoodItemsForContext } from '@/lib/food-data';

// Redefining the output to be a simple string, as the QA model provides a text block.
export type GetRecipeOutput = string;

// The main function that gets the recipe.
export async function getRecipeFlow(input: GetRecipeInput): Promise<GetRecipeOutput> {
  const context = allFoodItemsForContext.map(item => `${item.name}: ${item.description}`).join('\n\n');
  const question = `Provide a simple recipe for ${input.dishName}.`;
  
  try {
    const answer = await queryHuggingFaceQA(question, context);
    // The QA model might not find a structured recipe, so we have a fallback.
    if (!answer || answer.toLowerCase().includes("not enough information")) {
      return `I couldn't find a specific recipe for ${input.dishName}. Typical ingredients include...`;
    }
    return answer;
  } catch (error) {
    console.error('Error fetching recipe from Hugging Face:', error);
    return `Sorry, I was unable to fetch a recipe for ${input.dishName} at the moment.`;
  }
}
