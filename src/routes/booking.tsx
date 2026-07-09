import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { addDays, format, isSameDay, startOfDay } from "date-fns";
import { Reveal } from "@/components/Reveal";
import { Calendar as CalendarIcon, Clock, MapPin, Check, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { getAvailability, createBookingRequest } from "@/lib/booking.functions";

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title: "Book a Lesson — Dorottya Litkei" },
      { name: "description", content: "Book a private pole sport lesson, workshop or consultation with Dorottya Litkei in Cyprus. Real-time availability." },
      { property: "og:title", content: "Book — Dorottya Litkei" },
      { property: "og:description", content: "Reserve your session with live availability." },
      { property: "og:url", content: "/booking" },
    ],
    links: [{ rel: "canonical", href: "/booking" }],
  }),
  component: Booking,
});

const SERVICES = [
  { id: "private_lesson", label: "Private Lesson" },
  { id: "consultation", label: "Consultation" },
  { id: "workshop", label: "Workshop" },
  { id: "competition_prep", label: "Competition Prep" },
] as const;

const LOCATIONS = [
  { id: "studio_limassol", label: "Studio · Limassol" },
  { id: "online", label: "Online" },
  { id: "client_studio", label: "Client's studio" },
] as const;

const DURATIONS = [
  { min: 30, label: "30 min" },
  { min: 60, label: "60 min" },
  { min: 90, label: "90 min" },
  { min: 120, label: "2 hours" },
] as const;

type ServiceId = typeof SERVICES[number]["id"];
type LocationId = typeof LOCATIONS[number]["id"];

function formatSlotTime(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Europe/Nicosia",
  }).format(new Date(iso));
}

function Booking() {
  const [service, setService] = useState<ServiceId>("private_lesson");
  const [location, setLocation] = useState<LocationId>("studio_limassol");
  const [duration, setDuration] = useState<number>(60);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [slot, setSlot] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<null | { when: string }>(null);
  const [error, setError] = useState<string | null>(null);

  const getAvail = useServerFn(getAvailability);
  const createBooking = useServerFn(createBookingRequest);

  const dateKey = date ? format(date, "yyyy-MM-dd") : null;

  const availability = useQuery({
    queryKey: ["availability", dateKey, duration, location],
    enabled: !!dateKey,
    queryFn: async () => getAvail({ data: { date: dateKey!, durationMinutes: duration, location } }),
    staleTime: 30_000,
  });

  const slots = availability.data?.slots ?? [];

  // reset slot when inputs change
  useMemo(() => { setSlot(null); }, [dateKey, duration, location]);

  const canSubmit = !!slot && form.name.trim().length >= 2 && /.+@.+\..+/.test(form.email);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!slot) return;
    setError(null);
    setSubmitting(true);
    try {
      await createBooking({
        data: {
          service, location, durationMinutes: duration, startsAt: slot,
          clientName: form.name.trim(), clientEmail: form.email.trim(),
          clientPhone: form.phone.trim(), notes: form.notes.trim(),
        },
      });
      const when = new Intl.DateTimeFormat("en-GB", {
        weekday: "long", day: "numeric", month: "long",
        hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Europe/Nicosia",
      }).format(new Date(slot));
      setConfirmation({ when });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmation) {
    return (
      <section className="pt-40 pb-32 bg-cream min-h-[80svh]">
        <div className="container-luxe max-w-2xl text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold">
            <Check className="h-7 w-7" />
          </span>
          <h1 className="mt-8 font-serif text-4xl md:text-5xl">Request received.</h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Your requested session on <span className="text-foreground">{confirmation.when}</span> (Cyprus time)
            is being reviewed. You'll receive an email once Dorottya confirms — typically within 24 hours.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link to="/" className="btn-luxe btn-luxe-hover">Back home</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="pt-32 md:pt-40 pb-12 bg-cream">
        <div className="container-luxe">
          <Reveal className="max-w-3xl">
            <p className="eyebrow"><span className="gold-line mr-4 align-middle" />Booking</p>
            <h1 className="mt-8 font-serif text-[clamp(2.75rem,6vw,5.5rem)] leading-[1.02]">
              Reserve your <em className="text-gold not-italic font-medium">place</em>.
            </h1>
            <p className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed">
              Live availability across the coach's calendar. Pick a service, choose a slot
              and Dorottya will confirm your request within 24 hours.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-luxe py-12 md:py-20">
        <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          {/* LEFT: selection */}
          <div className="space-y-10">
            {/* Service + location + duration */}
            <div className="space-y-8">
              <Field label="Service" icon={null}>
                <ChipRow
                  options={SERVICES.map((s) => ({ value: s.id, label: s.label }))}
                  value={service}
                  onChange={(v) => setService(v as ServiceId)}
                />
              </Field>

              <div className="grid gap-8 sm:grid-cols-2">
                <Field label="Location" icon={<MapPin className="h-3.5 w-3.5" />}>
                  <ChipRow
                    options={LOCATIONS.map((l) => ({ value: l.id, label: l.label }))}
                    value={location}
                    onChange={(v) => setLocation(v as LocationId)}
                  />
                </Field>
                <Field label="Duration" icon={<Clock className="h-3.5 w-3.5" />}>
                  <ChipRow
                    options={DURATIONS.map((d) => ({ value: String(d.min), label: d.label }))}
                    value={String(duration)}
                    onChange={(v) => setDuration(Number(v))}
                  />
                </Field>
              </div>
            </div>

            {/* Date */}
            <Field label="Date" icon={<CalendarIcon className="h-3.5 w-3.5" />}>
              <div className="mt-4 rounded-sm border border-border/60 bg-cream p-2 inline-block">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(d) =>
                    d < startOfDay(new Date()) ||
                    d > addDays(new Date(), 60) ||
                    d.getDay() === 0
                  }
                  className={cn("p-2 pointer-events-auto")}
                />
              </div>
            </Field>

            {/* Times */}
            <Field label="Time (Cyprus local)" icon={<Clock className="h-3.5 w-3.5" />}>
              {!date ? (
                <p className="mt-3 text-sm text-muted-foreground">Pick a date to see available times.</p>
              ) : availability.isLoading ? (
                <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading availability…
                </p>
              ) : availability.isError ? (
                <p className="mt-3 text-sm text-destructive">Could not load availability. Please try again.</p>
              ) : slots.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  No {duration} min slots available on {format(date, "EEEE d LLLL")}. Try another day or duration.
                </p>
              ) : (
                <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {slots.map((iso) => {
                    const active = slot === iso;
                    return (
                      <button
                        type="button"
                        key={iso}
                        onClick={() => setSlot(iso)}
                        className={cn(
                          "border py-2.5 text-sm font-serif tracking-wide transition-colors",
                          active
                            ? "border-gold bg-gold text-ink"
                            : "border-border/60 hover:border-gold hover:text-gold",
                        )}
                      >
                        {formatSlotTime(iso)}
                      </button>
                    );
                  })}
                </div>
              )}
            </Field>
          </div>

          {/* RIGHT: details + summary */}
          <div className="bg-cream p-8 md:p-10 space-y-6 h-fit lg:sticky lg:top-28">
            <h2 className="font-serif text-2xl">Your details</h2>
            <div className="space-y-5">
              <Input label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
              <Input label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
              <Input label="Phone (optional)" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
              <label className="block">
                <span className="eyebrow">Notes (optional)</span>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="mt-3 w-full bg-transparent border-b border-border/80 focus:border-gold focus:outline-none py-3 font-serif text-lg resize-none"
                />
              </label>
            </div>

            <div className="border-t border-border/60 pt-6 space-y-2 text-sm">
              <SummaryRow label="Service" value={SERVICES.find((s) => s.id === service)?.label ?? ""} />
              <SummaryRow label="Location" value={LOCATIONS.find((l) => l.id === location)?.label ?? ""} />
              <SummaryRow label="Duration" value={DURATIONS.find((d) => d.min === duration)?.label ?? ""} />
              <SummaryRow label="Date" value={date ? format(date, "EEE d LLL yyyy") : "—"} />
              <SummaryRow label="Time" value={slot ? `${formatSlotTime(slot)} (Cyprus)` : "—"} />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className="btn-luxe btn-luxe-hover w-full disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? "Sending…" : "Request Booking"}
            </button>
            <p className="text-xs text-muted-foreground">
              Manual approval by Dorottya. You'll receive email confirmation within 24 hours.{" "}
              <Link to="/contact" className="link-underline text-foreground">Prefer to chat first?</Link>
            </p>
          </div>
        </form>
      </section>
    </>
  );
}

function Field({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <span className="eyebrow flex items-center gap-2">{icon}{label}</span>
      {children}
    </div>
  );
}

function ChipRow({
  options, value, onChange,
}: { options: { value: string; label: string }[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "px-4 py-2 border text-sm font-serif tracking-wide transition-colors",
              active ? "border-gold bg-gold text-ink" : "border-border/60 hover:border-gold hover:text-gold",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function Input({
  label, value, onChange, type = "text", required,
}: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="eyebrow">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-3 w-full bg-transparent border-b border-border/80 focus:border-gold focus:outline-none py-3 font-serif text-lg"
      />
    </label>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-serif">{value}</span>
    </div>
  );
}
