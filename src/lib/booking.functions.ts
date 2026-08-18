import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getAvailability = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) =>
    z.object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      durationMinutes: z.number().int().min(30).max(240),
      location: z.enum(["studio_limassol", "online", "client_studio"]),
    }).parse(raw),
  )
  .handler(async ({ data }) => {
    const { computeSlots } = await import("./booking.server");
    return computeSlots({ date: data.date, durationMinutes: data.durationMinutes });
  });

export const createBookingRequest = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) =>
    z.object({
      service: z.enum(["private_lesson", "consultation", "workshop", "competition_prep"]),
      location: z.enum(["studio_limassol", "online", "client_studio"]),
      durationMinutes: z.number().int().min(30).max(240),
      startsAt: z.string().datetime(),
      clientName: z.string().trim().min(2).max(120),
      clientEmail: z.string().trim().email().max(200),
      clientPhone: z.string().trim().max(40).optional().or(z.literal("")),
      notes: z.string().trim().max(2000).optional().or(z.literal("")),
    }).parse(raw),
  )
  .handler(async ({ data }) => {
    const { insertBooking } = await import("./booking.server");
    return insertBooking(data);
  });
