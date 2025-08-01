
import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-cultural-item.ts';
import '@/ai/flows/generate-initial-recommendations.ts';
import '@/ai/flows/search-by-category.ts';
import '@/ai/flows/answer-food-question.ts';
import '@/ai/flows/generate-image-url.ts';
import '@/ai/flows/get-recipe.ts';
