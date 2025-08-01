
import { z } from 'zod';

export const GetRecipeInputSchema = z.object({
  dishName: z.string().describe("The name of the Indian food dish (e.g., 'Paneer Tikka')."),
  state: z.string().optional().describe("The Indian state of origin for the dish (e.g., 'Punjab'). This is optional."),
});
export type GetRecipeInput = z.infer<typeof GetRecipeInputSchema>;


export const GetRecipeOutputSchema = z.object({
    ingredients: z.array(z.string()).describe("A list of ingredients required for the recipe, with measurements."),
    instructions: z.string().describe("The step-by-step instructions for preparing the dish, formatted as a single string with newlines."),
});
export type GetRecipeOutput = z.infer<typeof GetRecipeOutputSchema>;
