
'use server';

/**
 * @fileOverview A unified flow for searching cultural items, storing their images in Supabase, and gettin details.
 *
 * - unifiedSearch - Function to search for an item and get its details.
 * - UnifiedSearchInput - Input type for the function.
 * - UnifiedSearchOutput - Output type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { CulturalItem } from '@/types';
import { CulturalItemSchema } from '@/types';
import { UnifiedSearchInputSchema } from '@/types/schemas';
import type { UnifiedSearchInput } from '@/types/schemas';
import { generateImageUrl } from './generate-image-url';


// Exporting the type is allowed
export type { UnifiedSearchInput };
export type UnifiedSearchOutput = CulturalItem[];


const DetailsOutputSchema = z.object({
  name: z.string().describe("The canonical name of the item."),
  category: z.enum(['Food', 'Temple', 'Festival', 'Place', 'Unknown']).describe("The category of the item."),
  description: z.string().describe("A detailed and engaging description covering history, significance, and key features."),
  region: z.string().describe("The primary region, state, or city of origin/location (e.g., 'Punjab', 'Nationwide')."),
  type: z.string().optional().describe("For festivals, the type (e.g., 'Religious', 'Seasonal'). For food, the diet (e.g., 'veg', 'non-veg')."),
  month: z.string().optional().describe("For festivals, the month or typical time of year it's celebrated (e.g., 'October/November', 'March')."),
  calories: z.number().optional().describe("For food items, an estimated calorie count."),
  protein: z.string().optional().describe("For food items, the estimated protein amount (e.g., '15g')."),
  carbs: z.string().optional().describe("For food items, the estimated carbohydrate amount (e.g., '30g')."),
  fat: z.string().optional().describe("For food items, the estimated fat amount (e.g., '12g')."),
  quantity: z.string().optional().describe("For food items, a typical serving quantity (e.g., '1 plate', '2 pieces', '100g')."),
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
    *   **CRITICAL**: If the user's query contains "place", "monument", "city", or "landmark", you MUST categorize the returned items as 'Place'. These could be cities, monuments, or natural landmarks.
    *   **CRITICAL**: If the user's query contains "food" or a 'diet' filter is provided, you MUST categorize the returned items as 'Food'.
    *   **CRITICAL**: If the user's query contains "temple", you MUST categorize the returned items as 'Temple'.
    *   **CRITICAL**: If the user's query contains "festival", you MUST categorize the returned items as 'Festival'.
    *   You MUST generate a list containing a MINIMUM of 8 items. Aim for 8 items.
    *   If the user's 'query' is for a specific item (e.g., "Durga Puja") AND a 'place' is also provided, still prioritize the place and list at least 8 relevant items from there, ensuring the queried item is included if it's relevant to that state.

2.  **General Keyword Search (No Filters)**:
    *   If no 'place' or 'diet' filters are specified, analyze the 'query'.
    *   If the query is for a **specific item** (e.g., "Golden Temple", "Biryani", "Holi"), return **only the details for that single item** in a list of one.
    *   If the query is a **generic category term** (e.g., "food", "temples", "festivals", "places"), return a diverse list of at least 8-10 popular items from that category from all over India. If the query is "places", ensure the category is 'Place'.

3.  **Gather Details**: For each item in your generated list, provide the following in the structured output format:
    *   **name**: The canonical name of the item.
    *   **category**: The determined category: 'Food', 'Temple', 'Festival', or 'Place'.
    *   **description**: A detailed, engaging description covering history, cultural significance, and key features.
    *   **region**: The primary state, region, or city of origin/location.
    *   **type**:
        *   If it's a **Festival**, classify it by choosing **only one** primary type from the following options: 'Religious', 'Seasonal', 'Cultural', or 'National'. It is critical that you only select ONE value.
        *   If it's **Food**, classify the diet as 'veg' or 'non-veg'.
        *   If it's a **Temple** or **Place**, this can be omitted.
    *   **month**: 
        *   If it's a **Festival**, provide the month or general time of year it's celebrated (e.g., 'March', 'October/November').
        *   Omit for other categories.
    *   **calories, protein, carbs, fat, quantity**: If the category is 'Food', you MUST provide estimated nutritional information, including a typical serving quantity.
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
        console.error('Gemini call failed during unified search:', e);
        // Return an empty array to prevent the app from crashing on API errors.
        return [];
    }
    
    if (!output) {
        // Return empty array if the model gives no output, preventing a crash.
        return [];
    }

    const itemsWithImages = await Promise.all(output.map(async (item) => {
        let category = item.category;

        // Force category based on query if Gemini doesn't categorize correctly
        const lowerCaseQuery = input.query.toLowerCase();
        if (lowerCaseQuery.includes('food') || input.diet) {
            category = 'Food';
        } else if (lowerCaseQuery.includes('temple')) {
            category = 'Temple';
        } else if (input.place || lowerCaseQuery.includes('place') || lowerCaseQuery.includes('monument')) {
            category = 'Place';
        } else if (lowerCaseQuery.includes('festival')) {
            category = 'Festival';
        }


        let imageUrl = '';
        try {
            imageUrl = await generateImageUrl(item.name);
        } catch (error) {
            console.error(`Failed to get image for "${item.name}". Using placeholder.`, error);
            imageUrl = 'https://placehold.co/800x600.png';
        }
        
        // Ensure fileName is unique for React keys
        const uniqueFileNameSuffix = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const baseName = item.name.toLowerCase().replace(/\s+/g, '-');
        
        return {
            id: `${category.toLowerCase()}-${baseName}-${uniqueFileNameSuffix}`,
            name: item.name,
            category: category,
            description: item.description,
            image: imageUrl, 
            reviews: [],
            state: item.region,
            type: category === 'Festival' ? item.type as ('Religious' | 'Seasonal' | 'Cultural' | 'National') : undefined,
            diet: category === 'Food' ? item.type as 'veg' | 'non-veg' : undefined,
            reason: `A fascinating cultural item in the ${category} category, hailing from ${item.region}.`,
            month: item.month,
            calories: item.calories,
            protein: item.protein,
            carbs: item.carbs,
            fat: item.fat,
            quantity: item.quantity,
        };
    }));

    return itemsWithImages;
  }
);


// 3. Export the wrapper function
export async function unifiedSearch(input: UnifiedSearchInput): Promise<UnifiedSearchOutput> {
  return unifiedSearchFlow(input);
}
