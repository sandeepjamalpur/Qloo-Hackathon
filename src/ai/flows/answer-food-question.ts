
'use server';

/**
 * @fileOverview A flow for answering questions about food using a Hugging Face model.
 *
 * - answerFoodQuestion - Function to answer a food-related question.
 * - AnswerFoodQuestionInput - Input type for the function.
 * - AnswerFoodQuestionOutput - Output type for the function (a string with the answer).
 */

import { z } from 'genkit';
import { queryHuggingFaceQA } from '@/services/huggingface';

// 1. Define Schemas
const AnswerFoodQuestionInputSchema = z.object({
  question: z.string().describe("The user's question about food (e.g., 'What is in a Samosa?')."),
  context: z.string().describe('A string containing information about various food items, which the model will use to find the answer.'),
});
export type AnswerFoodQuestionInput = z.infer<typeof AnswerFoodQuestionInputSchema>;

export type AnswerFoodQuestionOutput = string;

// 2. Export the wrapper function
export async function answerFoodQuestion(input: AnswerFoodQuestionInput): Promise<AnswerFoodQuestionOutput> {
  // Directly call the Hugging Face service without an unnecessary flow wrapper
  return queryHuggingFaceQA(input.question, input.context);
}
