import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const TZ = "Europe/Nicosia";
const SLOT_STEP_MIN = 30;
const LEAD_HOURS = 12;
const HORIZON_DAYS = 60;
// Business hours per weekday (0=Sun ... 6=Sat), Cyprus local time
const HOURS: Record<number, { open: number; close: number } | null> = {
  0: null,
  1: { open: 9, close: 20 },
  2: { open: 9, close: 20 },
  3: { open: 9, close: 20 },
  4: { open: 9, close: 20 },
  5: { open: 9, close: 20 },
  6: { open: 10, close: 18 },
};

const SERVICES = ["private_lesson", "consultation", "workshop", "competition_prep"] as const;
const LOCATIONS = ["studio_limassol", "online", "client_studio"] as const;

function tzOffsetMinutes(date: Date, tz: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: tz, hour12: false,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
  const parts = dtf.formatToParts(date).reduce<Record<string, string>>((a, p) => {
    if (p.type !== "literal") a[p.type] = p.value;
    return a;
  }, {});
  const asUTC = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second);
  return (asUTC - date.getTime()) / 60000;
}

function cyprusWallToUTC(y: number, m: number, d: number, hh: number, mm: number): Date {
  const guess = new Date(Date.UTC(y, m - 1, d, hh, mm));
  const off = tzOffsetMinutes(guess, TZ);
  return new Date(guess.getTime() - off * 60000);
}

function cyprusWeekday(y: number, m: number, d: number): number {
  // Weekday for date in Cyprus (mid-day, safe across DST)
  const dt = cyprusWallToUTC(y, m, d, 12, 0);
  const s = new Intl.DateTimeFormat("en-US", { timeZone: TZ, weekday: "short" }).format(dt);
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(s);
}

export const getAvailability = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) =>
    z.object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      durationMinutes: z.number().int().min(30).max(240),
      location: z.enum(LOCATIONS),
    }).parse(raw),
  )
  .handler(async ({ data }) => {
    const [y, m, d] = data.date.split("-").map(Number);
    const dow = cyprusWeekday(y, m, d);
    const hours = HOURS[dow];
    if (!hours) return { slots: [] as string[] };

    const dayStart = cyprusWallToUTC(y, m, d, 0, 0);
    const dayEnd = cyprusWallToUTC(y, m, d, 23, 59);
    const minStart = new Date(Date.now() + LEAD_HOURS * 3600_000);
    const maxHorizon = new Date(Date.now() + HORIZON_DAYS * 86400_000);
    if (dayStart > maxHorizon) return { slots: [] };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: existing, error } = await supabaseAdmin
      .from("bookings")
      .select("starts_at,ends_at,location,status")
      .in("status", ["pending", "approved"])
      .gte("starts_at", new Date(dayStart.getTime() - 4 * 3600_000).toISOString())
      .lte("starts_at", new Date(dayEnd.getTime() + 4 * 3600_000).toISOString());
    if (error) throw new Error(error.message);

    const busy = (existing ?? []).map((b) => ({
      start: new Date(b.starts_at).getTime(),
      end: new Date(b.ends_at).getTime(),
      location: b.location as string,
    }));

    const slots: string[] = [];
    for (let h = hours.open * 60; h + data.durationMinutes <= hours.close * 60; h += SLOT_STEP_MIN) {
      const start = cyprusWallToUTC(y, m, d, Math.floor(h / 60), h % 60);
      const end = new Date(start.getTime() + data.durationMinutes * 60000);
      if (start < minStart) continue;
      // Coach can only be in one place at a time — any overlap blocks
      const overlaps = busy.some((b) => start.getTime() < b.end && end.getTime() > b.start);
      if (overlaps) continue;
      slots.push(start.toISOString());
    }
    return { slots };
  });

export const createBookingRequest = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) =>
    z.object({
      service: z.enum(SERVICES),
      location: z.enum(LOCATIONS),
      durationMinutes: z.number().int().min(30).max(240),
      startsAt: z.string().datetime(),
      clientName: z.string().trim().min(2).max(120),
      clientEmail: z.string().trim().email().max(200),
      clientPhone: z.string().trim().max(40).optional().or(z.literal("")),
      notes: z.string().trim().max(2000).optional().or(z.literal("")),
    }).parse(raw),
  )
  .handler(async ({ data }) => {
    const start = new Date(data.startsAt);
    if (Number.isNaN(start.getTime())) throw new Error("Invalid start time");
    if (start.getTime() < Date.now() + LEAD_HOURS * 3600_000) {
      throw new Error("This slot is no longer available.");
    }
    const end = new Date(start.getTime() + data.durationMinutes * 60000);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Re-check conflict at insert time to prevent races
    const { data: conflicts, error: confErr } = await supabaseAdmin
      .from("bookings")
      .select("id")
      .in("status", ["pending", "approved"])
      .lt("starts_at", end.toISOString())
      .gt("ends_at", start.toISOString())
      .limit(1);
    if (confErr) throw new Error(confErr.message);
    if (conflicts && conflicts.length > 0) {
      throw new Error("That slot was just taken. Please pick another time.");
    }

    const { data: inserted, error } = await supabaseAdmin
      .from("bookings")
      .insert({
        service: data.service,
        location: data.location,
        duration_minutes: data.durationMinutes,
        starts_at: start.toISOString(),
        ends_at: end.toISOString(),
        client_name: data.clientName,
        client_email: data.clientEmail,
        client_phone: data.clientPhone || null,
        notes: data.notes || null,
        status: "pending",
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: inserted.id };
  });
