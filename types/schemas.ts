
import { z } from 'zod';

// Schema for unifiedSearch flow
export const UnifiedSearchInputSchema = z.object({
  query: z.string().describe("The user's search query (e.g., 'Diwali', 'Paneer Tikka', 'Golden Temple')."),
  place: z.string().optional().describe("An optional state or region in India to narrow down the search."),
  diet: z.enum(['veg', 'non-veg']).optional().describe("An optional dietary preference to filter food results."),
});
export type UnifiedSearchInput = z.infer<typeof UnifiedSearchInputSchema>;
