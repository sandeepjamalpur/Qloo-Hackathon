
import { z } from 'zod';

export const GetRecipeInputSchema = z.object({
  dishName: z.string().describe("The name of the Indian food dish (e.g., 'Paneer Tikka')."),
  state: z.string().describe("The Indian state of origin for the dish (e.g., 'Punjab')."),
});
export type GetRecipeInput = z.infer<typeof GetRecipeInputSchema>;

// Note: The output from the QA model is a single string, not a structured object.
// The structured schema is no longer used for the Hugging Face implementation.
export const GetRecipeOutputSchema = z.string();
export type GetRecipeOutput = z.infer<typeof GetRecipeOutputSchema>;
