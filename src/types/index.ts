
import { z } from 'zod';

export type CulturalItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  reviews: string[];
  reason?: string;
  diet?: 'veg' | 'non-veg';
  state?: string;
  type?: 'Religious' | 'Seasonal' | 'Cultural' | 'National';
  month?: string;
  calories?: number;
  protein?: string;
  carbs?: string;
  fat?: string;
  quantity?: string;
};

export const CulturalItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  description: z.string(),
  image: z.string(),
  reviews: z.array(z.string()),
  reason: z.string().optional(),
  diet: z.enum(['veg', 'non-veg']).optional(),
  state: z.string().optional(),
  type: z.enum(['Religious', 'Seasonal', 'Cultural', 'National']).optional(),
  month: z.string().optional(),
  calories: z.number().optional(),
  protein: z.string().optional(),
  carbs: z.string().optional(),
  fat: z.string().optional(),
  quantity: z.string().optional(),
});
