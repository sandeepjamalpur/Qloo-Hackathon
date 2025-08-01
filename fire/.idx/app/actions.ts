
'use server';

import { generateInitialRecommendations as genRecs, GenerateInitialRecommendationsOutput } from 'fire/src/ai/flows/generate-initial-recommendations';
import type { GenerateInitialRecommendationsInput } from 'fire/src/ai/flows/generate-initial-recommendations';
import { unifiedSearch as search, UnifiedSearchOutput } from 'fire/src/ai/flows/search-by-category';
import type { UnifiedSearchInput } from 'fire/src/ai/flows/search-by-category';
import { answerFoodQuestion as answer, AnswerFoodQuestionInput, AnswerFoodQuestionOutput } from 'fire/src/ai/flows/answer-food-question';
import { getTransportOptions as getTransport } from 'fire/src/ai/flows/get-transport-options';
import type { GetTransportOptionsInput, TransportOptions } from 'fire/src/types/schemas';
import { generateImageUrl as genImg, GenerateImageUrlInput, GenerateImageUrlOutput } from 'fire/src/ai/flows/generate-image-url';


export async function generateInitialRecommendations(input: GenerateInitialRecommendationsInput): Promise<GenerateInitialRecommendationsOutput> {
  return await genRecs(input);
}

export async function unifiedSearch(input: UnifiedSearchInput): Promise<UnifiedSearchOutput> {
    return await search(input);
}

export async function answerFoodQuestion(input: AnswerFoodQuestionInput): Promise<AnswerFoodQuestionOutput> {
    return await answer(input);
}

export async function getTransportOptions(input: GetTransportOptionsInput): Promise<TransportOptions> {
    return await getTransport(input);
}

export async function generateImage(query: GenerateImageUrlInput): Promise<GenerateImageUrlOutput> {
    return await genImg(query);
}
