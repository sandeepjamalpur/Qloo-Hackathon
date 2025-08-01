
'use server';
/**
 * @fileOverview A Genkit flow to generate mock real-time transport options for a trip.
 *
 * - getTransportOptions - Function to generate transport options.
 * - GetTransportOptionsInput - Input type for the function.
 * - TransportOptions - Output type for the function.
 */

import { ai } from 'fire/src/ai/genkit';
import { GetTransportOptionsInputSchema, TransportOptionsSchema } from 'fire/src/types/schemas';
import type { GetTransportOptionsInput, TransportOptions } from 'fire/src/types/schemas';

// Define AI Prompt & Flow
const transportOptionsPrompt = ai.definePrompt({
    name: 'transportOptionsPrompt',
    input: { schema: GetTransportOptionsInputSchema },
    output: { schema: TransportOptionsSchema },
    prompt: `You are a travel data simulator. Based on the user's trip request, generate a realistic but entirely fictional set of transport options.

User Request:
- Destination: {{destination}}
- Travel Date: {{startDate}}
- Travelers: {{travelers}}

Your Task:
Generate a list of 3-5 realistic options for each transport category (trains, buses, and flights).
- **Departure/Arrival:** Assume departure is from a major nearby city (like Delhi, Mumbai, Bangalore).
- **Timings & Duration:** Create logical and varied timings.
- **Fares:** Generate realistic-looking fares (e.g., '₹1,250', '₹800', '₹5,500').
- **Status:** Randomly assign a status. Most should be 'On Time', but include one 'Delayed' option if possible.
- **Booking Links:** Use placeholder URLs like 'https://www.irctc.co.in/book' or 'https://www.makemytrip.com/flights/'.
- **Diversity:** Ensure variety in operators, vehicle numbers, and timings for each category.
- **Data Integrity:** The data must strictly follow the output schema.
`,
});


const getTransportOptionsFlow = ai.defineFlow(
  {
    name: 'getTransportOptionsFlow',
    inputSchema: GetTransportOptionsInputSchema,
    outputSchema: TransportOptionsSchema,
  },
  async (input) => {
    const { output } = await transportOptionsPrompt(input);
    if (!output) {
      throw new Error('Failed to generate transport options from the AI model.');
    }
    return output;
  }
);


// Export the wrapper function
export async function getTransportOptions(input: GetTransportOptionsInput): Promise<TransportOptions> {
  return getTransportOptionsFlow(input);
}
