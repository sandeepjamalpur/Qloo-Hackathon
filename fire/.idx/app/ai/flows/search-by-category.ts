
'use server';

/**
 * @fileOverview A unified flow for searching cultural items, storing their images in Supabase, and getting details.
 *
 * - unifiedSearch - Function to search for an item and get its details.
 * - UnifiedSearchInput - Input type for the function.
 * - UnifiedSearchOutput - Output type for the function.
 */

import { ai } from 'fire/src/ai/genkit';
import { z } from 'genkit';
import type { CulturalItem } from 'fire/src/types';
import { CulturalItemSchema } from 'fire/src/types';
import { UnifiedSearchInputSchema } from 'fire/src/types/schemas';
import type { UnifiedSearchInput } from 'fire/src/types/schemas';
import { uploadImageFromUrl } from 'fire/src/services/supabase';
import { generateImageUrl } from './generate-image-url';


// Exporting the type is allowed
export type { UnifiedSearchInput };
export type UnifiedSearchOutput = CulturalItem[];


const DetailsOutputSchema = z.object({
  name: z.string().describe("The canonical name of the item."),
  category: z.enum(['Food', 'Temple', 'Festival', 'Unknown']).describe("The category of the item."),
  description: z.string().describe("A detailed and engaging description covering history, significance, and key features."),
  region: z.string().describe("The primary region, state, or city of origin/location (e.g., 'Punjab', 'Nationwide')."),
  type: z.string().optional().describe("For festivals, the type (e.g., 'Religious', 'Seasonal'). For food, the diet (e.g., 'veg', 'non-veg')."),
});

// 2. Define AI Prompt & Flow
const detailsPrompt = ai.definePrompt({
  name: 'unifiedDetailsPrompt',
  input: { schema: UnifiedSearchInputSchema },
  output: { schema: z.array(DetailsOutputSchema) },
  prompt: `You are an expert on Indian culture. A user is asking about a specific cultural item. Your task is to identify the item, determine its category, and provide detailed information.

User Query: "{{query}}"
{{#if place}}
Filter by Place: "{{place}}"
{{/if}}
{{#if diet}}
Filter by Diet: "{{diet}}"
{{/if}}


Your primary instruction is to follow the filter rules below:

1.  **Filter-Based Search**:
    *   If a 'place' (a specific Indian state) is provided, you MUST IGNORE the user's text 'query' (especially if it's a generic term like 'food', 'temples', or 'famous festivals') and return a list of the most famous and culturally significant items (Festivals, Temples, or Food) from that state.
    *   **IMPORTANT**: For these searches by place, you MUST generate a list containing a MINIMUM of 5 items. Aim for 5 to 8 items.
    *   If the user's 'query' is for a specific item (e.g., "Durga Puja") AND a 'place' is also provided, still prioritize the place and list at least 5 relevant items from there, ensuring the queried item is included if it's relevant to that state.

2.  **General Keyword Search (No Filters)**:
    *   If no 'place' or 'diet' filters are specified, analyze the 'query'.
    *   If the query is for a **specific item** (e.g., "Golden Temple", "Biryani", "Holi"), return **only the details for that single item** in a list of one.
    *   If the query is a **generic category term** (e.g., "food", "temples", "festivals"), return a diverse list of at least 8-10 popular items from that category from all over India.

3.  **Gather Details**: For each item in your generated list, provide the following in the structured output format:
    *   **name**: The canonical name of the item.
    *   **category**: The determined category: 'Food', 'Temple', or 'Festival'.
    *   **description**: A detailed, engaging description covering history, cultural significance, and key features.
    *   **region**: The primary state, region, or city of origin/location.
    *   **type**:
        *   If it's a **Festival**, classify it as 'Religious', 'Seasonal', 'Cultural', or 'National'.
        *   If it's **Food**, classify the diet as 'veg' or 'non-veg'.
        *   If it's a **Temple**, this can be omitted.
`,
});

const unifiedSearchFlow = ai.defineFlow(
  {
    name: 'unifiedSearchFlow',
    inputSchema: UnifiedSearchInputSchema,
    outputSchema: z.array(CulturalItemSchema),
  },
  async (input) => {
    let output;
    try {
        const result = await detailsPrompt(input);
        output = result.output;
    } catch (e: any) {
        console.error('Gemini call failed:', e);
        return [];
    }
    
    if (!output) {
        return [];
    }

    const itemsWithImages = await Promise.all(output.map(async (item) => {
        // When filtering by place, the category might need to be inferred if Unknown.
        let category = item.category;
        if (input.place && category === 'Unknown') {
          // A simple heuristic for demo purposes
          if (input.query.toLowerCase().includes('festival')) category = 'Festival';
          else if (input.query.toLowerCase().includes('temple')) category = 'Temple';
          else if (input.query.toLowerCase().includes('food')) category = 'Food';
        }

        // Generate an image if it's food, otherwise use Unsplash
        let imageUrl = '';
        if (category === 'Food') {
            imageUrl = await generateImageUrl(item.name);
        } else {
            const queryTerms = `${item.name}, ${category}, India`;
            imageUrl = `https://source.unsplash.com/800x600/?${encodeURIComponent(queryTerms)}`;
        }
        
        // Ensure fileName is unique for Supabase upload
        const uniqueFileNameSuffix = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const baseName = item.name.toLowerCase().replace(/\s+/g, '-');
        const fileName = `${category.toLowerCase()}-${baseName}-${uniqueFileNameSuffix}.jpg`;
        
        const supabaseImageUrl = await uploadImageFromUrl(imageUrl, fileName);

        return {
            // Ensure item ID is unique for React keys
            id: `${category.toLowerCase()}-${baseName}-${uniqueFileNameSuffix}`,
            name: item.name,
            category: category,
            description: item.description,
            image: supabaseImageUrl, // Use the permanent Supabase URL
            reviews: [],
            state: item.region,
            type: category === 'Festival' ? item.type as ('Religious' | 'Seasonal' | 'Cultural' | 'National') : undefined,
            diet: category === 'Food' ? item.type as 'veg' | 'non-veg' : undefined,
            reason: `A fascinating cultural item in the ${category} category, hailing from ${item.region}.`
        };
    }));

    return itemsWithImages;
  }
);


// 3. Export the wrapper function
export async function unifiedSearch(input: UnifiedSearchInput): Promise<UnifiedSearchOutput> {
  return unifiedSearchFlow(input);
}
