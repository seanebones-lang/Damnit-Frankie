import { z } from "zod";

export const bookingStep1Schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(254),
  phone: z.string().min(10).max(32),
});

export const bookingStep2Schema = z.object({
  city: z.string().min(2).max(120),
  timeline: z.enum(["asap", "1-3mo", "3-6mo", "flexible"]),
  isTravel: z.boolean(),
});

export const bookingStep3Schema = z.object({
  placement: z.string().min(2).max(200),
  sizeDescription: z.string().min(2).max(500),
  styleNotes: z.string().max(2000).optional(),
  referenceLinks: z.string().max(2000).optional(),
  firstTattoo: z.boolean(),
  budgetRange: z.enum(["under-500", "500-1500", "1500-4000", "4000-plus", "unsure"]),
});

export const bookingFullSchema = bookingStep1Schema
  .merge(bookingStep2Schema)
  .merge(bookingStep3Schema)
  .extend({
    consentContact: z.literal(true),
    consentData: z.literal(true),
  });

export type BookingFullInput = z.infer<typeof bookingFullSchema>;

export const travelWaitlistSchema = z.object({
  email: z.string().email(),
  city: z.string().min(2).max(120),
  notes: z.string().max(500).optional(),
});

export type TravelWaitlistInput = z.infer<typeof travelWaitlistSchema>;
