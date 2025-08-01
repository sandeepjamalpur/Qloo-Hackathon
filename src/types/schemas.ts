
import { z } from 'zod';

// Schema for getTransportOptions flow
export const GetTransportOptionsInputSchema = z.object({
  destination: z.string().describe("The user's travel destination."),
  startDate: z.string().describe("The start date of the trip in ISO format."),
  endDate: z.string().optional().describe("The optional end date of the trip in ISO format."),
  travelers: z.number().int().positive().describe("The number of travelers."),
});
export type GetTransportOptionsInput = z.infer<typeof GetTransportOptionsInputSchema>;

const TrainOptionSchema = z.object({
  operator: z.string().describe("Name of the train operator, e.g., 'Indian Railways'."),
  vehicleNumber: z.string().describe("The train number, e.g., '12002'."),
  from: z.string().describe("Departure station name."),
  to: z.string().describe("Arrival station name."),
  departureTime: z.string().describe("Departure time, e.g., '06:00'."),
  arrivalTime: z.string().describe("Arrival time, e.g., '14:00'."),
  duration: z.string().describe("Total travel duration, e.g., '8h 0m'."),
  stops: z.number().int().describe("Number of intermediate stops."),
  fare: z.string().describe("The fare for the trip, formatted with currency, e.g., '₹1,500'."),
  status: z.enum(['On Time', 'Delayed', 'Cancelled']).describe("The real-time status of the transport."),
  bookingLink: z.string().url().describe("A direct link to the official booking website."),
});

const BusOptionSchema = TrainOptionSchema.extend({
  operator: z.string().describe("Name of the bus operator, e.g., 'RedBus', 'HRTC'."),
  vehicleNumber: z.string().describe("The bus registration number or service ID."),
  busType: z.enum(['Sleeper', 'Semi-Sleeper', 'Seater', 'Volvo']).describe("Type of bus."),
});

const FlightOptionSchema = TrainOptionSchema.extend({
    operator: z.string().describe("Name of the airline, e.g., 'IndiGo', 'Vistara'."),
    vehicleNumber: z.string().describe("The flight number, e.g., '6E 203'."),
    fare: z.string().describe("The fare for the flight, formatted with currency, e.g., '₹4,500'."),
});


export const TransportOptionsSchema = z.object({
  trains: z.array(TrainOptionSchema).describe("A list of available train options."),
  buses: z.array(BusOptionSchema).describe("A list of available bus options."),
  flights: z.array(FlightOptionSchema).describe("A list of available flight options."),
});
export type TransportOptions = z.infer<typeof TransportOptionsSchema>;

// Schema for unifiedSearch flow
export const UnifiedSearchInputSchema = z.object({
  query: z.string().describe("The user's search query (e.g., 'Diwali', 'Paneer Tikka', 'Golden Temple')."),
  place: z.string().optional().describe("An optional state or region in India to narrow down the search."),
  diet: z.enum(['veg', 'non-veg']).optional().describe("An optional dietary preference to filter food results."),
});
export type UnifiedSearchInput = z.infer<typeof UnifiedSearchInputSchema>;
