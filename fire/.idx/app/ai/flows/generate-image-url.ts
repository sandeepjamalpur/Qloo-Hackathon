
'use server';

/**
 * @fileOverview A Genkit flow to generate a high-quality image for a given query using Gemini.
 *
 * - generateImageUrl - Function to generate an image.
 * - GenerateImageUrlInput - Input type for the function (a string query).
 * - GenerateImageUrlOutput - Output type for the function (a data URI string).
 */

import { ai } from 'fire/src/ai/genkit';
import { z } from 'genkit';

// 1. Define Schemas
const GenerateImageUrlInputSchema = z.string();
export type GenerateImageUrlInput = z.infer<typeof GenerateImageUrlInputSchema>;

// Output is a data URI string
const GenerateImageUrlOutputSchema = z.string();
export type GenerateImageUrlOutput = z.infer<typeof GenerateImageUrlOutputSchema>;


// 2. Define and Export the Flow
const generateImageUrlFlow = ai.defineFlow(
  {
    name: 'generateImageUrlFlow',
    inputSchema: GenerateImageUrlInputSchema,
    outputSchema: GenerateImageUrlOutputSchema,
  },
  async (query) => {
    try {
      const { media } = await ai.generate({
        // Use the dedicated image generation model
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: `Generate a beautiful, high-quality, artistic representation of the following Indian cultural item: ${query}. The style should be visually stunning and evocative.`,
        config: {
            // This config is required for image generation models
            responseModalities: ['TEXT', 'IMAGE'],
        },
      });
      
      if (media?.url) {
        return media.url; // This will be a "data:image/png;base64,..." string
      }
      
      // Fallback if image generation fails for any reason
      console.warn(`Image generation failed for query: "${query}". Falling back to placeholder.`);
      return 'https://placehold.co/800x600.png';

    } catch (error) {
      console.error(`Error generating image for "${query}":`, error);
      // Return a placeholder on any error to prevent crashes.
      return 'https://placehold.co/800x600.png';
    }
  }
);

export async function generateImageUrl(query: GenerateImageUrlInput): Promise<GenerateImageUrlOutput> {
  return generateImageUrlFlow(query);
}
