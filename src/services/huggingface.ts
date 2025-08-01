
'use server';

/**
 * @fileOverview A service for interacting with the Hugging Face Inference API.
 */

interface QuestionAnsweringInput {
  inputs: {
    question: string;
    context: string;
  };
}

interface QuestionAnsweringOutput {
  score: number;
  start: number;
  end: number;
  answer: string;
}

const API_URL = 'https://api-inference.huggingface.co/models/deepset/roberta-base-squad2';

/**
 * Calls the Hugging Face Inference API for question answering.
 * @param question - The question to ask.
 * @param context - The context to find the answer in.
 * @returns A promise that resolves to the answer from the model.
 */
export async function queryHuggingFaceQA(question: string, context: string): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY;

  if (!apiKey) {
    console.warn('HUGGING_FACE_API_KEY is not configured. Skipping Hugging Face API call.');
    return 'Hugging Face API key is not configured. Please add it to your .env file.';
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        inputs: {
          question,
          context,
        },
      } as QuestionAnsweringInput),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Hugging Face API Error: ${response.statusText}`, errorBody);
      return `Sorry, I couldn't get an answer from the model right now. Error: ${response.statusText}`;
    }

    const jsonResponse: QuestionAnsweringOutput = await response.json();
    
    // Always return the model's best answer, even if the confidence score is low.
    if (jsonResponse.answer) {
        return jsonResponse.answer;
    }
    
    return "I'm not sure I have enough information to answer that question. Try asking something else about the foods listed.";

  } catch (error) {
    console.error('An error occurred while calling the Hugging Face API:', error);
    return 'An unexpected error occurred while trying to find an answer.';
  }
}
