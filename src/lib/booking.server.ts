// Server-only booking logic: availability computation, conflict checks, notifications.
export const BOOKING_NOTIFY_EMAIL = "xxdorottyaxx@gmail.com";

const TZ = "Europe/Nicosia";
const SLOT_STEP_MIN = 30;
export const LEAD_HOURS = 12;
const HORIZON_DAYS = 60;

const FALLBACK_HOURS: Record<number, { open: number; close: number } | null> = {
  0: null,
  1: { open: 540, close: 1200 },
  2: { open: 540, close: 1200 },
  3: { open: 540, close: 1200 },
  4: { open: 540, close: 1200 },
  5: { open: 540, close: 1200 },
  6: { open: 600, close: 1080 },
};

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

export function cyprusWallToUTC(y: number, m: number, d: number, hh: number, mm: number): Date {
  const guess = new Date(Date.UTC(y, m - 1, d, hh, mm));
  const off = tzOffsetMinutes(guess, TZ);
  return new Date(guess.getTime() - off * 60000);
}

export function cyprusWeekday(y: number, m: number, d: number): number {
  const dt = cyprusWallToUTC(y, m, d, 12, 0);
  const s = new Intl.DateTimeFormat("en-US", { timeZone: TZ, weekday: "short" }).format(dt);
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(s);
}

export function formatCyprus(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: false, timeZone: TZ,
  }).format(new Date(iso));
}

export async function computeSlots(input: { date: string; durationMinutes: number }) {
  const [y, m, d] = input.date.split("-").map(Number);
  const dow = cyprusWeekday(y, m, d);

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data: rule } = await supabaseAdmin
    .from("availability_rules")
    .select("open_minute,close_minute,closed")
    .eq("weekday", dow)
    .maybeSingle();

  const hours = rule
    ? (rule.closed ? null : { open: rule.open_minute, close: rule.close_minute })
    : FALLBACK_HOURS[dow];
  if (!hours) return { slots: [] as string[] };

  const dayStart = cyprusWallToUTC(y, m, d, 0, 0);
  const dayEnd = cyprusWallToUTC(y, m, d, 23, 59);
  const minStart = new Date(Date.now() + LEAD_HOURS * 3600_000);
  const maxHorizon = new Date(Date.now() + HORIZON_DAYS * 86400_000);
  if (dayStart > maxHorizon) return { slots: [] as string[] };

  const from = new Date(dayStart.getTime() - 4 * 3600_000).toISOString();
  const to = new Date(dayEnd.getTime() + 4 * 3600_000).toISOString();

  const [{ data: existing, error }, { data: blocks }] = await Promise.all([
    supabaseAdmin
      .from("bookings")
      .select("starts_at,ends_at,status")
      .in("status", ["pending", "approved"])
      .gte("starts_at", from)
      .lte("starts_at", to),
    supabaseAdmin
      .from("availability_blocks")
      .select("starts_at,ends_at")
      .lt("starts_at", to)
      .gt("ends_at", from),
  ]);
  if (error) throw new Error(error.message);

  const busy = [...(existing ?? []), ...(blocks ?? [])].map((b) => ({
    start: new Date(b.starts_at).getTime(),
    end: new Date(b.ends_at).getTime(),
  }));

  const slots: string[] = [];
  for (let h = hours.open; h + input.durationMinutes <= hours.close; h += SLOT_STEP_MIN) {
    const start = cyprusWallToUTC(y, m, d, Math.floor(h / 60), h % 60);
    const end = new Date(start.getTime() + input.durationMinutes * 60000);
    if (start < minStart) continue;
    if (busy.some((b) => start.getTime() < b.end && end.getTime() > b.start)) continue;
    slots.push(start.toISOString());
  }
  return { slots };
}

export type BookingInput = {
  service: string;
  location: string;
  durationMinutes: number;
  startsAt: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  notes?: string;
};

export async function insertBooking(data: BookingInput) {
  const start = new Date(data.startsAt);
  if (Number.isNaN(start.getTime())) throw new Error("Invalid start time");
  if (start.getTime() < Date.now() + LEAD_HOURS * 3600_000) {
    throw new Error("This slot is no longer available.");
  }
  const end = new Date(start.getTime() + data.durationMinutes * 60000);

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

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

  const { data: blocked } = await supabaseAdmin
    .from("availability_blocks")
    .select("id")
    .lt("starts_at", end.toISOString())
    .gt("ends_at", start.toISOString())
    .limit(1);
  if (blocked && blocked.length > 0) {
    throw new Error("That time is no longer available. Please pick another time.");
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

  await notifyCoach(data);

  return { id: inserted.id };
}

/**
 * Sends the booking request to the coach's inbox.
 * Uses Resend when RESEND_API_KEY is configured; otherwise the request is only
 * stored in the database (and visible in the admin dashboard).
 */
async function notifyCoach(data: BookingInput) {
  const apiKey = process.env["RESEND_API_KEY"];
  const from = process.env["BOOKING_FROM_EMAIL"] || "onboarding@resend.dev";
  const lines = [
    `New booking request`,
    ``,
    `When: ${formatCyprus(data.startsAt)} (Cyprus time)`,
    `Service: ${data.service}`,
    `Location: ${data.location}`,
    `Duration: ${data.durationMinutes} min`,
    ``,
    `Name: ${data.clientName}`,
    `Email: ${data.clientEmail}`,
    `Phone: ${data.clientPhone || "—"}`,
    `Notes: ${data.notes || "—"}`,
  ];
  if (!apiKey) {
    console.log(`[booking] notification for ${BOOKING_NOTIFY_EMAIL}:\n${lines.join("\n")}`);
    return;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: `Booking <${from}>`,
        to: [BOOKING_NOTIFY_EMAIL],
        reply_to: data.clientEmail,
        subject: `Booking request — ${data.clientName} · ${formatCyprus(data.startsAt)}`,
        text: lines.join("\n"),
      }),
    });
    if (!res.ok) console.error("[booking] email failed", res.status, await res.text());
  } catch (err) {
    console.error("[booking] email error", err);
  }
}
