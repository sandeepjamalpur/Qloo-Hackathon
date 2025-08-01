
'use server';

import { generateInitialRecommendations as genRecs, GenerateInitialRecommendationsOutput } from '@/ai/flows/generate-initial-recommendations';
import type { GenerateInitialRecommendationsInput } from '@/ai/flows/generate-initial-recommendations';
import { unifiedSearch as search, UnifiedSearchOutput } from '@/ai/flows/search-by-category';
import type { UnifiedSearchInput } from '@/ai/flows/search-by-category';
import { answerFoodQuestion as answer, AnswerFoodQuestionInput, AnswerFoodQuestionOutput } from '@/ai/flows/answer-food-question';
import { generateImageUrl as genImg, GenerateImageUrlInput, GenerateImageUrlOutput } from '@/ai/flows/generate-image-url';
import { getRecipe as getRecipeFlow, GetRecipeInput, GetRecipeOutput } from '@/ai/flows/get-recipe';

export async function generateInitialRecommendations(input: GenerateInitialRecommendationsInput): Promise<GenerateInitialRecommendationsOutput> {
  return await genRecs(input);
}

export async function unifiedSearch(input: UnifiedSearchInput): Promise<UnifiedSearchOutput> {
    return await search(input);
}

export async function answerFoodQuestion(input: AnswerFoodQuestionInput): Promise<AnswerFoodQuestionOutput> {
    return await answer(input);
}

export async function generateImage(query: GenerateImageUrlInput): Promise<GenerateImageUrlOutput> {
    return await genImg(query);
}

export async function getRecipe(input: GetRecipeInput): Promise<GetRecipeOutput> {
    return getRecipeFlow(input);
}
