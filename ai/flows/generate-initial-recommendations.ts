
'use server';

/**
 * @fileOverview Flow for generating initial cultural recommendations and adding a personalized reason with AI.
 *
 * - generateInitialRecommendations - Function to generate initial recommendations.
 * - GenerateInitialRecommendationsInput - Input type for the function.
 * - GenerateInitialRecommendationsOutput - Output type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { generateImageUrl } from './generate-image-url';

const GenerateInitialRecommendationsInputSchema = z.object({
  prompt: z.string().describe('A short text prompt describing the user’s cultural preferences related to India (food, music, festivals, dress, temples).'),
});

export type GenerateInitialRecommendationsInput = z.infer<typeof GenerateInitialRecommendationsInputSchema>;

const RecommendationSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  description: z.string().optional(),
  image: z.string().describe("A relevant, dynamically generated image URL for the item."),
  reason: z.string().describe("A short, personalized explanation for why this item is a good recommendation for the user based on their prompt about Indian culture."),
});

const GenerateInitialRecommendationsOutputSchema = z.object({
  recommendations: z.array(RecommendationSchema).describe('A list of cultural recommendations based on the user’s prompt about India.'),
});

export type GenerateInitialRecommendationsOutput = z.infer<typeof GenerateInitialRecommendationsOutputSchema>;

// Define a schema for the initial text-only generation from the prompt
const TextOnlyRecommendationSchema = RecommendationSchema.omit({ image: true });

const TextOnlyOutputSchema = z.object({
  recommendations: z.array(TextOnlyRecommendationSchema).describe('A list of cultural recommendations based on the user’s prompt about India.'),
});


const recommendationsPrompt = ai.definePrompt({
    name: 'generateRecommendationsPrompt',
    input: { schema: GenerateInitialRecommendationsInputSchema },
    output: { schema: TextOnlyOutputSchema },
    prompt: `You are an expert cultural guide for India. Your task is to generate 12 excellent cultural recommendations for a user based on their prompt.

User's Prompt: "{{prompt}}"

Your task:
1.  **Analyze**: Review the user's prompt to understand their interests.
2.  **Generate**: Create a diverse list of 12 recommendations that are highly relevant to the prompt.
    *   Include a mix of categories like 'Food', 'Temple', 'Festival', 'Place', 'Music', or 'Dress'.
    *   Ensure the recommendations are interesting and specific.
3.  **Finalize**: For each of the 12 items, provide the following details:
    *   A unique ID (e.g., 'gemini-1', 'gemini-2').
    *   The item's name.
    *   A category (MUST be one of: Food, Temple, Festival, Music, Dress, Place).
    *   A brief, engaging description.
    *   Write a compelling, personalized reason (1-2 sentences) explaining *why* the user would like this specific item, directly connecting it to their prompt.
    *   DO NOT generate an image URL. This will be handled later.
`,
});


export async function generateInitialRecommendations(input: GenerateInitialRecommendationsInput): Promise<GenerateInitialRecommendationsOutput> {
  return generateInitialRecommendationsFlow(input);
}

const generateInitialRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateInitialRecommendationsFlow',
    inputSchema: GenerateInitialRecommendationsInputSchema,
    outputSchema: GenerateInitialRecommendationsOutputSchema,
  },
  async (input) => {
    try {
      const { output: textOutput } = await recommendationsPrompt(input);

      if (!textOutput || !textOutput.recommendations) {
          throw new Error('Failed to get recommendations from the AI model.');
      }
      
      // Now, generate images for each recommendation in parallel, handling individual errors
      const recommendationsWithImages = await Promise.all(
        textOutput.recommendations.map(async (item) => {
          try {
            const imageUrl = await generateImageUrl(item.name);
            return {
              ...item,
              image: imageUrl,
            };
          } catch (error) {
              console.warn(`Failed to generate image for "${item.name}". Using placeholder.`, error);
              return {
                  ...item,
                  image: 'https://placehold.co/800x600.png', // Fallback image
              };
          }
        })
      );

      return { recommendations: recommendationsWithImages };

    } catch (error: any) {
        const errorMessage = error.message || '';
        if (errorMessage.includes('429') || errorMessage.includes('503') || errorMessage.includes('overloaded')) {
            console.warn('AI model is overloaded or quota has been exceeded. Returning empty recommendations.', error);
            // Return a valid, empty output to prevent the app from crashing.
            return { recommendations: [] };
        }
        // For any other error, re-throw it to be handled elsewhere.
        console.error('An unexpected error occurred in generateInitialRecommendationsFlow:', error);
        throw error;
    }
  }
);
